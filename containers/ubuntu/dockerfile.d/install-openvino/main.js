#!/usr/bin/env node

const child_process = require('node:child_process');
const download = require('./src/download');
const filetree = require('./src/filetree');
const fs = require('node:fs');
const runner = require('./src/runner');
const path = require('node:path');
const { parseArgs: parseNodeArgs } = require('node:util');

function parseArgs() {
    const { values } = parseNodeArgs({
        options: {
            version: { type: 'string' },
            arch: { type: 'string' },
            os: { type: 'string' },
            release: { type: 'string' },
            apt: { type: 'boolean' },
        }
    });
    return values;
}

/**
 * Main entry point for this script. This function will parse the inputs
 * and decide how to install OpenVINO:
 * - *APT packages*: on Debian-based Linux, we can set `apt == true` to install the OpenVINO APT
 *   packages; in later versions of OpenVINO, this installs libraries to the system's default
 *   installation paths (e.g., `/usr/lib/x86_64-linux-gnu`).
 * - *extracted archive*: an OS-portable way to install OpenVINO is to download the archive (`.tgz`
 *   or `.zip`) and extract it; this method also sets up the `OPENVINO_INSTALL_DIR` environment
 *   variable.
 */
async function run() {
    const args = parseArgs();
    const version = args.version;
    if (!version) {
        throw new Error('The --version argument is required');
    }
    console.log(`version: ${version}`);
    const env = runner.readEnvironment();
    const arch = args.arch || env.arch;
    console.log(`arch: ${arch}`);
    const os = args.os || env.os;
    console.log(`os: ${os}`);
    let linuxRelease, defaultRelease;
    if (os === 'linux') {
        linuxRelease = await runner.readLinuxRelease(fs.createReadStream('/etc/os-release'));
        defaultRelease = `${linuxRelease.id}${linuxRelease.version}`;
    }
    if (os === 'macos') {
        if (version >= '2024.1.0') {
            defaultRelease = '12_6';
        } else {
            defaultRelease = '10_15';
        }
    }
    let release = args.release || defaultRelease;
    if (release === 'ubuntu22' && version.startsWith('2022')) {
        console.warn('downgrading jammy packages to focal; OpenVINO has no jammy packages for this version but focal should work');
        release = 'ubuntu20'
        // See how this is recorded below in `_OPENVINO_INSTALL_RELEASE`
    }
    console.log(`release: ${release}`);
    const useApt = !!args.apt;
    console.log(`apt: ${useApt}`);

    // Choose between an APT installation or an extracted archive installation.
    if (useApt) {
        // Retrieve and install the OpenVINO package with APT. We shell out to a Bash script since
        // we expect this to only run on Linux machines.
        if (os !== 'linux') {
            console.warn('retrieving OpenVINO with APT is unlikely to work on OSes other than Linux.');
        }
        const env = { version, version_year: version.split('.')[0], release };
        bash('src/apt.sh', env);
    } else {
        // Download and decompress the OpenVINO archive from https://storage.openvinotoolkit.org.
        const filetreeJson = await filetree.readCached('filetree.json');
        const version_stripped = version.replace(/\.0$/, ''); // The filetree strips off the `.0`.
        const url = filetree.buildUrl(filetreeJson, version_stripped, os, release, arch);
        console.log(`url: ${url}`);
        let downloadedFile = await download.downloadCached(url);
        decompress(downloadedFile);
        const extractedDirectory = path.resolve(path.parse(downloadedFile).name);
        console.log(`Setting up environment: OPENVINO_INSTALL_DIR=${extractedDirectory}`);
        // Output environment variables for the calling script to use.
        console.log(`OPENVINO_INSTALL_DIR=${extractedDirectory}`);
        console.log(`_OPENVINO_INSTALL_RELEASE=${release}`);
    }
}

function decompress(path) {
    const ext = path.split('.').pop();
    let cmd, args;
    if (ext === 'tgz') {
        cmd = 'tar';
        args = ['-xf', path];
    } else if (ext === 'zip') {
        // Assume that .zip files are only used on Windows.
        cmd = '7z';
        args = ['x', path];
    } else {
        throw new Error(`unrecognized extension to decompress: ${path}`)
    }
    console.log(`decompressing: ${cmd} ${args.join(' ')}`);
    child_process.execFileSync(cmd, args, { stdio: 'inherit' });
}

function bash(scriptPath, env) {
    console.log(`running: bash ${scriptPath}`);
    child_process.execFileSync('bash', [scriptPath], { stdio: 'inherit', env });
}

function logError(e) {
    console.error("ERROR: ", e.message);
    try {
        console.error(JSON.stringify(e, null, 2));
    } catch (e) {
        // ignore JSON errors for now
    }
    console.error(e.stack);
}

run().catch(err => {
    logError(err);
    process.exit(1);
});
