#!/bin/bash
set -Eeuov pipefail

# 处理一下镜像内置的文件
#
# 特定目录
# - BUILTIN: 内置文件目录，实际文件的存放位置
# - SD_DIR: sd 的根目录
# - VIRTUAL_NAS: 虚拟 NAS 目录，运行时会完整 copy 至 nas 挂载点，除去允许用户修改的配置文件外，均为软链接
#
# 程序期望访问的目录                  实际访问的目录                        文件真正的存放位置                      备注
# /root                               ${NAS_DIR}/root                                                               用户目录
# /root/.huggingface/a                ${NAS_DIR}/root/.huggingface/a        ${BUILTIN}/root/.huggingface/a          内置的 root 文件             
# /root/.huggingface/b                ${NAS_DIR}/root/.huggingface/b                                                用户自己安装的 root 文件             
# ${SD_DIR}/models                    ${NAS_DIR}/models                                                             模型目录
# ${SD_DIR}/models/aaa.safetensors    ${NAS_DIR}/models/aaa.safetensors     ${BUILTIN}/models/aaa.safetensors       内置的模型
# ${SD_DIR}/models/bbb.safetensors    ${NAS_DIR}/models/bbb.safetensors                                             用户自己安装的模型
# ${NAS_DIR}/venv                     ${NAS_DIR}/venv                                                               python 虚拟环境
# ${NAS_DIR}/venv/.../torch           /venv/.../torch                       /venv/.../torch                         内置依赖
# ${NAS_DIR}/venv/.../xxx             ${NAS_DIR}/venv/.../xxx                                                       用户自己安装的依赖


function mount_file_if_not_exist() {
  # 挂载单个文件到指定目录，如果已存在文件则不做处理
  SRC="$1"
  DST="$2"

  # 如果文件已经存在，则跳过
  if [ ! -e "${DST}" ]; then
    mkdir -p "$(dirname "${DST}")"
    ln -sT "${SRC}" "${DST}"
  fi 
}

function mount_folder_files() {
  # 挂载目录下直属的文件/文件夹到指定目录
  local SRC=$1
  local DST=$2
  ls ${SRC} | xargs -I {} bash -c "mount_file_if_not_exist ${SRC}/{} ${DST}/{}"
}

function mount_all_files() {
  # 挂载目录所有文件逐个到指定目录
  local SRC=$1
  local DST=$2
  find $SRC ! -type d -printf "%P\n" | xargs -I {} bash -c "mount_file_if_not_exist '${SRC}/{}' '${DST}/{}'"
}

export -f \
  mount_file_if_not_exist \
  mount_folder_files \
  mount_all_files

 
# 将所有必要的文件放到 BUILTIN 目录
# 该部分是处理的实际文件，因此只考虑复制和移动，不用考虑挂载

mkdir -p "$BUILTIN"

# 要移动的文件，主要涉及 sd 代码自带的内容，需要保留下来，避免被后续挂载覆盖
declare -A move_files
for dir in "models" "extensions" "extensions-builtin" "scripts" "localizations" \
  "configs" "embeddings" "textual_inversion_templates"; do
  move_files["${SD_DIR}/${dir}/"]="${BUILTIN}/${dir}"
done
for src in "${!move_files[@]}"; do
  dst="${move_files[${src}]}"
  mkdir -p $(dirname $dst)
  rsync -a --ignore-existing --remove-source-files "$src" "$dst"
done

# 要复制的文件，主要涉及 Docker 构建上下文附加的文件
declare -A copy_folder
for dir in "configs" "embeddings" "extensions" "extensions-builtin" \
  "localizations" "models"; do
  copy_folder["/ctx/${dir}/"]="${BUILTIN}/${dir}"
done
copy_folder["/ctx/config.json"]="$BUILTIN/config.json"
copy_folder["/ctx/ui-config.json"]="$BUILTIN/ui-config.json"
for src in "${!copy_folder[@]}"; do
  dst="${copy_folder[${src}]}"
  mkdir -p $(dirname $dst)
  rsync -a --ignore-existing $src $dst
done

mkdir -p $VIRTUAL_NAS
rsync -a --ignore-existing /ctx/config.json $VIRTUAL_NAS
rsync -a --ignore-existing /ctx/ui-config.json $VIRTUAL_NAS


touch "${VIRTUAL_NAS}/styles.csv"

# 构建 VIRTUAL_NAS 目录，提升启动速度
# 挂载分为如下类型
# - 挂载文件夹，不挂载子文件：用户无法修改文件夹内部的内容（因为没有持久化到 NAS，主要应用于不存在改动的场景，如依赖）
# - 挂载文件夹及所有子文件: 用户有修改文件夹内容的需要，如模型目录
# - 挂载文件：主要应用于挂载文件夹及所有文件

# 挂载文件夹及所有子文件
declare -A all_files
for dir in "configs" "embeddings" "extensions" "extensions-builtin" \
  "localizations" "models" "scripts"; do
  all_files["${BUILTIN}/${dir}"]="${VIRTUAL_NAS}/${dir}"
done
all_files["${BUILTIN}/root"]="${VIRTUAL_NAS}/root"
for src in "${!all_files[@]}"; do
  dst="${all_files[${src}]}"
  mount_all_files "$src" "$dst"
done

# 挂载单个文件 / 仅挂载文件夹，不挂载子文件
declare -A single_files
# single_files[""]=""
for src in "${!single_files[@]}"; do
  dst="${single_files[${src}]}"
  mount_file_if_not_exist "$src" "$dst"
done



# 处理 venv 虚拟环境 /venv => ${VIRTUAL_NAS}/venv => ${NAS_DIR}/venv

# 先尝试将 venv 切回到默认位置
grep -r "/venv" /venv/bin/* | awk -F: "{print \$1}" | xargs -I {} sed "s@${NAS_DIR}/venv@/venv@g" -i {}

# 处理文件挂载
mount_file_if_not_exist /venv/bin ${VIRTUAL_NAS}/venv/bin
mount_file_if_not_exist /venv/include ${VIRTUAL_NAS}/venv/include
mount_file_if_not_exist /venv/pyvenv.cfg ${VIRTUAL_NAS}/venv/pyvenv.cfg
mount_file_if_not_exist /venv/include ${VIRTUAL_NAS}/venv/include
mount_folder_files /venv/lib/python3.10/site-packages ${VIRTUAL_NAS}/venv/lib/python3.10/site-packages
mount_folder_files /venv/lib64/python3.10/site-packages ${VIRTUAL_NAS}/venv/lib64/python3.10/site-packages

# 重写虚拟环境配置
export VIRTUAL_ENV="${NAS_DIR}/venv"
export PATH="${VIRTUAL_ENV}/bin:$PATH"
grep -r "/venv" /venv/bin/* | awk -F: '{print $1}' | xargs -I {} sed "s@/venv@${VIRTUAL_ENV}@" -i {}
echo "export VIRTUAL_ENV=${VIRTUAL_ENV}" >> /etc/profile
echo "export PATH=${PATH}" >> /etc/profile



# 复制启动文件
mkdir -p /docker
cp /ctx/entrypoint.bash /docker/entrypoint.bash

if [ ! -e "/docker/sd-agent" ] && [ -e /serverless-api ]; then
  cp /serverless-api/build/agent/agentServer /docker/sd-agent
fi

chmod a+x /docker/entrypoint.bash /docker/sd-agent

# 写入镜像版本
IMAGE_TAG="${IMAGE_TAG:-$(date +%y%m%d%H%M%S)}" && echo "${IMAGE_TAG}" > /IMAGE_TAG