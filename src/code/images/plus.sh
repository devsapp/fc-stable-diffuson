#!/bin/bash

set -Eeuo pipefail

# TODO: move all mkdir -p ?
mkdir -p /mnt/auto/sd/scripts/
# mount scripts individually
find "${ROOT}/scripts/" -maxdepth 1 -type l -delete
cp -vrfTs /mnt/auto/sd/scripts/ "${ROOT}/scripts/"

cp -n /docker/config.json /mnt/auto/sd/config.json
jq '. * input' /mnt/auto/sd/config.json /docker/config.json | sponge /mnt/auto/sd/config.json

if [ ! -f /mnt/auto/sd/ui-config.json ]; then
  echo '{}' >/mnt/auto/sd/ui-config.json
fi

declare -A MOUNTS

MOUNTS["/root/.cache"]="/mnt/auto/sd/.cache"


MOUNTS["${ROOT}/models"]="/mnt/auto/sd/models"

MOUNTS["${ROOT}/localizations"]="/mnt/auto/sd/localizations"

MOUNTS["${ROOT}/configs"]="/mnt/auto/sd/configs"

MOUNTS["${ROOT}/extensions-builtin"]="/mnt/auto/sd/extensions-builtin"


MOUNTS["${ROOT}/embeddings"]="/mnt/auto/sd/embeddings"
MOUNTS["${ROOT}/config.json"]="/mnt/auto/sd/config.json"
MOUNTS["${ROOT}/ui-config.json"]="/mnt/auto/sd/ui-config.json"
MOUNTS["${ROOT}/extensions"]="/mnt/auto/sd/extensions"
MOUNTS["${ROOT}/outputs"]="/mnt/auto/sd/outputs"
# MOUNTS["${ROOT}/javascript"]="/mnt/auto/sd/javascript"
# MOUNTS["${ROOT}/html"]="/mnt/auto/sd/html"

# extra hacks
MOUNTS["${ROOT}/repositories/CodeFormer/weights/facelib"]="/mnt/auto/sd/.cache"

for to_path in "${!MOUNTS[@]}"; do
  set -Eeuo pipefail
  from_path="${MOUNTS[${to_path}]}"
  rm -rf "${to_path}"
  if [ ! -f "$from_path" ]; then
    mkdir -vp "$from_path"
  fi
  mkdir -vp "$(dirname "${to_path}")"
  ln -sT "${from_path}" "${to_path}"
  echo Mounted $(basename "${from_path}")
done

if [ -f "/mnt/auto/sd/startup.sh" ]; then
  pushd ${ROOT}
  . /mnt/auto/sd/startup.sh
  popd
fi

exec "$@"