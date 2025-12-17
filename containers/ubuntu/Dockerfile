FROM ubuntu:22.04

ENV NODE_VERSION=24.12.0
ENV CMAKE_VERSION=4.2.1

COPY dockerfile.d /dockerfile.d

# --- Install Tools ---
RUN apt-get update && \
    apt-get install -y --no-install-recommends ca-certificates git curl \
    clang ninja-build \
    python3 python3-pip && \
    rm -rf /var/lib/apt/lists/*

# --- Install cmake ---
RUN mkdir -p /opt && \
    curl -SsL -o /opt/cmake-${CMAKE_VERSION}-linux-x86_64.tar.gz \
      https://github.com/Kitware/CMake/releases/download/v${CMAKE_VERSION}/cmake-${CMAKE_VERSION}-linux-x86_64.tar.gz && \
    tar xz -f /opt/cmake-${CMAKE_VERSION}-linux-x86_64.tar.gz -C /opt && \
    rm -rf /opt/cmake-${CMAKE_VERSION}-linux-x86_64.tar.gz
ENV PATH="/opt/cmake-${CMAKE_VERSION}-linux-x86_64/bin:${PATH}"

# --- Install Node ---
RUN curl -SsL -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
ENV NVM_DIR=/root/.nvm
RUN . "$NVM_DIR/nvm.sh" && nvm install ${NODE_VERSION}
RUN . "$NVM_DIR/nvm.sh" && nvm use v${NODE_VERSION}
RUN . "$NVM_DIR/nvm.sh" && nvm alias default v${NODE_VERSION}
ENV PATH="/root/.nvm/versions/node/v${NODE_VERSION}/bin/:${PATH}"

# --- Install OpenVIONO ---
RUN node /dockerfile.d/install-openvino/main.js --version "2025.2" --release "ubuntu22"

ENTRYPOINT ["top", "-b"]
