#!/bin/bash

set -Eeuo pipefail

function set_start_time() {
  START_TIME=$(date '+%s.%N')
}

function show_cost_time() {
  echo "$START_TIME $(date '+%s.%N')" | awk "{printf \"$1, cost %f seconds\n\", \$2 - \$1}"
}

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


  IMAGE_TAG_I=$(cat /IMAGE_TAG)
  IMAGE_TAG_N=$(cat /${NAS_DIR}/IMAGE_TAG 2>/dev/null || echo '') 

  echo "IMAGE_TAG [[${IMAGE_TAG_I}]] [[${IMAGE_TAG_N}]]"

  if [ "${IMAGE_TAG_I}" != "${IMAGE_TAG_N}" ]; then 
    # 去除无用的软链接/空文件夹
    set_start_time
    find -L ${NAS_DIR} -type l -delete
    find ${NAS_DIR} -type d -empty -delete
    show_cost_time "remove symbolic links"

    

    echo "with NAS, mount built-in files to ${NAS_DIR}"
    
    set_start_time

    find ${SD_BUILTIN} | while read -r file; do
      SRC="${file}"
      DST="${NAS_DIR}/${file#$SD_BUILTIN/}"

      if [ ! -e "$DST" ] && [ ! -d "$SRC" ] && [ "$DST" != "${NAS_DIR}/config.json" ] && [ "$DST" != "${NAS_DIR}/ui-config.json" ]; then
        mount_file "$SRC" "$DST"
      fi
    done

    if [ ! -e "${NAS_DIR}/ui-config.json" ]; then
      echo "no ui-config.json, copy it"
      cp "${SD_BUILTIN}/ui-config.json" "${NAS_DIR}/ui-config.json"
    fi 

    show_cost_time "mount built-in files"


    echo -n ${IMAGE_TAG_I} > /${NAS_DIR}/IMAGE_TAG
  fi
fi


if [ ! -e "${NAS_DIR}/config.json" ]; then
  echo "no config.json, copy it"
  cp "${SD_BUILTIN}/config.json" "${NAS_DIR}/config.json"
fi

if [ "$(wc -c ${NAS_DIR}/config.json | cut -f 1 -d ' ')" == "0" ]; then
  echo "config.json is empty, copy it"
  rm -f "${SD_BUILTIN}/config.json"
  cp "${SD_BUILTIN}/config.json" "${NAS_DIR}/config.json"
fi

if [ ! -e "${NAS_DIR}/styles.csv" ]; then
  echo "no styles.csv, create it"
  touch "${NAS_DIR}/styles.csv"
fi


declare -A MOUNTS

MOUNTS["/root"]="${NAS_DIR}/root"
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
# MOUNTS["${ROOT}/cache.json"]="${NAS_DIR}/cache.json"
MOUNTS["${ROOT}/scripts"]="${NAS_DIR}/scripts"
MOUNTS["${ROOT}/textual_inversion_templates"]="${NAS_DIR}/textual_inversion_templates"
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
DISABLE_AGENT="${DISABLE_AGENT:-}"

export ARGS="${CLI_ARGS} ${EXTRA_ARGS}"
export PYTHONPATH="${PYTHONPATH:-}:${NAS_DIR}/python"
export SD_WEBUI_CACHE_FILE="/mnt/auto/sd/cache.json"

echo "args: $ARGS"

if [ -z "$DISABLE_AGENT" ]; then
  /docker/sd-agent python -u webui.py --listen --port 7861 ${ARGS}
else 
  python -u webui.py --listen --port 7860 ${ARGS}
fi
