CONTAINER_NAME="ort-ubuntu"

docker exec -it -w "/home/dev" "$CONTAINER_NAME" bash

# Example command:
# GCC_VERSION=11 CMAKE_VERSION=3.28 PYTHON_VERSION=3.10 ./build.sh -r "v1.22.2" -b "Release" --static --xnnpack -N --openvino
