#!/bin/bash

set -Eeuo pipefail

function mount_file() {
  echo Mount $1 to $2

  SRC="$1"
  DST="$2"

  rm -rf "${DST}"

  if [ ! -f "${SRC}" ]; then 
    mkdir -pv "${SRC}"
  fi

  mkdir -pv "$(dirname "${DST}")"
  
  ln -sT "${SRC}" "${DST}"
}


NAS_DIR="/mnt/auto/sd"

# 内置模型准备
# 如果挂载了 NAS，软链接到 NAS 中
# 如果未挂载 NAS，则尝试直接将内置模型过载
NAS_MOUNTED=0
if [ -d "/mnt/auto" ]; then
  NAS_MOUNTED=1
fi

if [ "$NAS_MOUNTED" == "0" ]; then
  echo "without NAS, mount $SD_BUILTIN to ${NAS_DIR}"
  mount_file "$SD_BUILTIN" "${NAS_DIR}"
else
  mkdir -p "${NAS_DIR}"

  echo "with NAS, mount built-in files to ${NAS_DIR}"
  
  find ${SD_BUILTIN} | while read -r file; do
    SRC="${file}"
    DST="${NAS_DIR}/${file#$SD_BUILTIN/}"

    if [ ! -e "$DST" ] && [ ! -d "$SRC" ] && [ "$DST" != "${NAS_DIR}/config.json" ] && [ "$DST" != "${NAS_DIR}/ui-config.json" ]; then
      mount_file "$SRC" "$DST"
    fi
  done

  if [ ! -e "${NAS_DIR}/config.json" ]; then
    echo "no config.json, copy it"
    cp "${SD_BUILTIN}/config.json" "${NAS_DIR}/config.json"
  fi

  if [ ! -e "${NAS_DIR}/ui-config.json" ]; then
    echo "no ui-config.json, copy it"
    cp "${SD_BUILTIN}/ui-config.json" "${NAS_DIR}/ui-config.json"
  fi 
fi

if [ ! -e "${NAS_DIR}/styles.csv" ]; then
  echo "no styles.csv, create it"
  touch "${NAS_DIR}/styles.csv"
fi


declare -A MOUNTS

MOUNTS["/root/.cache"]="${NAS_DIR}/cache"
MOUNTS["${ROOT}/models"]="${NAS_DIR}/models"
MOUNTS["${ROOT}/localizations"]="${NAS_DIR}/localizations"
MOUNTS["${ROOT}/configs"]="${NAS_DIR}/configs"
MOUNTS["${ROOT}/extensions-builtin"]="${NAS_DIR}/extensions-builtin"
MOUNTS["${ROOT}/embeddings"]="${NAS_DIR}/embeddings"
MOUNTS["${ROOT}/config.json"]="${NAS_DIR}/config.json"
MOUNTS["${ROOT}/ui-config.json"]="${NAS_DIR}/ui-config.json"
MOUNTS["${ROOT}/extensions"]="${NAS_DIR}/extensions"
MOUNTS["${ROOT}/outputs"]="${NAS_DIR}/outputs"
MOUNTS["${ROOT}/styles.csv"]="${NAS_DIR}/styles.csv"
# MOUNTS["${ROOT}/javascript"]="${NAS_DIR}/javascript"
# MOUNTS["${ROOT}/html"]="${NAS_DIR}/html"
MOUNTS["${ROOT}/repositories/CodeFormer/weights/facelib"]="${NAS_DIR}/repositories/CodeFormer/weights/facelib"


for to_path in "${!MOUNTS[@]}"; do
  mount_file "${MOUNTS[${to_path}]}" "${to_path}"
done

if [ -f "/mnt/auto/sd/startup.sh" ]; then
  pushd ${ROOT}
  . /mnt/auto/sd/startup.sh
  popd
fi


CLI_ARGS="${CLI_ARGS:---xformers --enable-insecure-extension-access --skip-version-check --no-download-sd-model}"
EXTRA_ARGS="${EXTRA_ARGS:-}"

export ARGS="${CLI_ARGS} ${EXTRA_ARGS}"

echo "args: $ARGS"

python -u webui.py --listen --port 7860 ${ARGS}
