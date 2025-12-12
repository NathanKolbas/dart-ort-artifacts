# Dart ONNX Runtime Artifacts

Builds of [ONNX runtime](https://github.com/microsoft/onnxruntime) for various platforms.

This repo provides pre-built libraries of ONNX Runtime specifically for use with [ort_dart](https://github.com/NathanKolbas/ort_dart).

This repo is based of the excellent work of [alfatraining's ort-artifacts repo](https://github.com/alfatraining/ort-artifacts) and [pykeio's ort artifacts repo](https://github.com/pykeio/ort-artifacts).

To make sure the binaries are available, the binaries are built and released in this repo. Otherwise, the binaries provided by the other repos might change, deleted, or not be compatible anymore with `ort_dart`. This helps ensures that the binaries that are needed/required are available. This repo also compiles a couple extra binaries for needed architectures/platforms.

## Execution Providers

Each platform has certain execution providers compiled by default.

> 🗒️ If you would like specific execution providers to be built-in by default feel free to make an issue so this can be discussed more!

Here is a matrix breakdown:

[//]: # (https://onnxruntime.ai/docs/build/eps.html)
[//]: # (CUDA, TensorRT, oneDNN, OpenVINO, QNN, DirectML, ACL, ANN, RKNPU, AMD Vitis AI, AMD MIGraphX, NNAPI, CoreML, XNNPACK, CANN, Azure)

| Platform | Execution Providers                       |
|----------|-------------------------------------------|
| Android  | NNAPI, XNNPACK                            |
| iOS      | CoreML, XNNPACK                           |
| Linux    | OpenVINO, XNNPACK                         |
| MacOS    | CoreML, XNNPACK                           |
| WASM     | WebGPU                                    |
| Windows  | DirectML, OpenVINO (x86_64 only), XNNPACK |

## Platform Breakdown

You can find more information about each platform below.

### Android

The minimum SDK is 28. While you can go lower, this is best for performance.

### iOS

The minimum iOS version is 15. While you can go lower, this is best for performance.

### Linux

Add as needed.

### MacOS

MacOS 13.3 or greater.

### WASM

Comes bundled with WebGPU execution provider.

### Windows

> ⚠️ ARM Support is disabled for the time being until build can be fixed.

Supports Windows 10 and 11.

OpenVINO does not have builds for arm64. npm distribution states "Windows ARM is not supported".
