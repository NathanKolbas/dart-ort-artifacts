BASEDIR="$(cd "$(dirname "$0")" ; pwd -P)"
ROOTDIR="$(realpath -s $BASEDIR/../..)"

IMAGE_NAME="ort-ubuntu"
CONTAINER_NAME="$IMAGE_NAME"

docker stop "$CONTAINER_NAME"
docker container rm "$CONTAINER_NAME"

docker build -t "$CONTAINER_NAME" .
docker create --name "$CONTAINER_NAME" \
  -v "$ROOTDIR:/home/dev" \
  "$IMAGE_NAME"

docker start "$CONTAINER_NAME"
