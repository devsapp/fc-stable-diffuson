############################# 
#    基础 python 依赖环境   #
#############################
FROM python:3.10.9-slim AS deps

RUN --mount=type=cache,target=/root/.cache/pip \
    python3 -m venv /venv && \
    . /venv/bin/activate && \
    pip install \
    torch==2.1.2 torchvision==0.16.2 --extra-index-url https://download.pytorch.org/whl/cu121

# 安装 rust 环境
RUN --mount=type=cache,target=/var/cache/apt \
    apt update && \
    apt install -y curl gcc g++ build-essential
RUN curl https://sh.rustup.rs -sSf | bash -s -- -y
ENV PATH="/root/.cargo/bin:$PATH"

RUN --mount=type=cache,target=/root/.cache/pip \
    . /venv/bin/activate && \
    export PATH="/root/.cargo/bin:$PATH" && \
    pip install transformers==4.30.2

# find . -type f -name "requirements.txt" | xargs -I {} cat {} | tr -d '\r' | sed 's/>/=/g' |  sort -u | awk -F '==' '! /^(#|-|\s*$)/ {sub(/^[ \t]+|[ \t]+$/, "", $0); if (!seen[$1]++) print}' | xargs
RUN --mount=type=cache,target=/root/.cache/pip \
    . /venv/bin/activate && \
    pip install \
    GitPython==3.1.32 Pillow==9.5.0 accelerate==0.21.0 addict albumentations==0.4.3 blendmodes \
    clean-fid==0.1.35 dctorch diskcache==5.6.3 einops==0.4.1 facexlib==0.3.0 fairscale==0.4.4 \
    setuptools==69.5.1 fastapi==0.94.0 future gdown timm==0.4.12 gradio==3.41.2 \
    imageio-ffmpeg==0.4.2 imageio==2.27.0 inflection==0.5.1 invisible-watermark==0.1.5 \
    jsonmerge==1.8.0 kornia==0.6.7 lark==1.1.2 lmdb lpips numpy==1.26.2 omegaconf==2.2.3 \
    opencv-python piexif==1.1.3 pillow-avif-plugin==1.4.3 psutil==5.9.5 pudb==2019.2 \
    pycocoevalcap httpcore==0.15 pyyaml requests resize-right==0.0.2 safetensors==0.4.2 \
    scikit-image==0.21.0 scipy streamlit-drawable-canvas==0.8.0 streamlit==0.73.1 \
    tb-nightly spandrel==0.1.6 test-tube==0.7.5 tomesd==0.1.3 torch torchdiffeq tqdm \
    wandb webdataset==0.2.5 yapf httpx==0.24.1

RUN --mount=type=cache,target=/root/.cache/pip \
    . /venv/bin/activate && \
    pip install \
    clip-anytorch open-clip-torch==2.20.0 pytorch_lightning==1.9.4 torchmetrics==0.7.0 \
    torchsde==0.2.6 torchdiffeq==0.2.3


# 重新安装一次 pytorch，确保最终使用的版本符合 sd webui 预期
RUN --mount=type=cache,target=/root/.cache/pip \
    . /venv/bin/activate && \
    pip install \
    torch==2.1.2 torchvision==0.16.2 xformers --index-url https://download.pytorch.org/whl/cu121


############################# 
#        sdwebui 仓库       #
#############################
FROM alpine/git:2.36.2 AS repos

ARG SHA=82a973c0
RUN git clone https://github.com/AUTOMATIC1111/stable-diffusion-webui.git /code && \
    cd /code && \
    git reset --hard ${SHA}

RUN git clone https://github.com/Stability-AI/stablediffusion.git /code/repositories/stable-diffusion-stability-ai && \
    cd /code/repositories/stable-diffusion-stability-ai && \
    git reset --hard cf1d67a6fd5ea1aa600c4df58e5b47da45f6bdbf

RUN git clone https://github.com/Stability-AI/generative-models.git /code/repositories/generative-models && \
    cd /code/repositories/generative-models && \
    git reset --hard fbdc58cab9f4ee2be7a5e1f2e2787ecd9311942f

RUN git clone https://github.com/sczhou/CodeFormer.git /code/repositories/CodeFormer && \
    cd /code/repositories/CodeFormer && \
    git reset --hard 8392d0334956108ab53d9439c4b9fc9c4af0d66d

RUN git clone https://github.com/salesforce/BLIP.git /code/repositories/BLIP && \
    cd /code/repositories/BLIP && \
    git reset --hard 3a29b7410476bf5f2ba0955827390eb6ea1f4f9d

RUN git clone https://github.com/crowsonkb/k-diffusion.git /code/repositories/k-diffusion && \
    cd /code/repositories/k-diffusion && \
    git reset --hard 21d12c91ad4550e8fcf3308ff9fe7116b3f19a08

RUN git clone  https://github.com/pharmapsychotic/clip-interrogator /code/repositories/clip-interrogator && \
    cd /code/repositories/clip-interrogator && \
    git reset --hard bc07ce62c179d3aab3053a623d96a071101d11cb


RUN git clone https://github.com/AUTOMATIC1111/stable-diffusion-webui-assets /code/repositories/stable-diffusion-webui-assets && \
    cd /code/repositories/stable-diffusion-webui-assets && \
    git reset --hard 6f7db241d2f8ba7457bac5ca9753331f0c266917



############################# 
#  sdwebui 需要的 hf 模型   #
#############################
FROM python:3.10.9-slim AS download_huggingface

RUN --mount=type=cache,target=/root/.cache/pip \
    pip install transformers[sentencepiece] sentencepiece && \
    pip install torch==2.0.1 torchvision==0.15.2 --index-url https://download.pytorch.org/whl/cu118

COPY ./init /init
RUN mkdir -p /sd-prompt-translator && python /init/sd-prompt-translator.py /sd-prompt-translator
RUN mkdir -p /bert-base-uncased-cache && python /init/bert-base-uncased.py /bert-base-uncased-cache
RUN mkdir -p /clip-vit-large-patch14 && python /init/clip-vit-large-patch14.py /clip-vit-large-patch14
RUN mkdir -p /models--Bingsu--adetailer && python /init/bingsu-adetailer.py /models--Bingsu--adetailer

RUN --mount=type=cache,target=/var/cache/apt \
    apt update && \
    apt install -y tar
    
RUN tar -C /init -xvf /init/models--google--t5-v1_1-xxl.tar.gz 


############################# 
#     sdwebui 需要的模型    #
#############################

FROM python:3.10.9-slim AS download_sdwebui

RUN apt update && apt install -y aria2

RUN aria2c -x 5 --dir / --out wheel.whl 'https://github.com/AbdBarho/stable-diffusion-webui-docker/releases/download/5.0.3/xformers-0.0.20.dev528-cp310-cp310-manylinux2014_x86_64-pytorch2.whl'

RUN aria2c -x 8 --dir "/" --out "codeformer-v0.1.0.pth" "https://github.com/sczhou/CodeFormer/releases/download/v0.1.0/codeformer.pth"  
RUN aria2c -x 8 --dir "/" --out "detection_Resnet50_Final.pth" "https://github.com/xinntao/facexlib/releases/download/v0.1.0/detection_Resnet50_Final.pth" 
RUN aria2c -x 8 --dir "/" --out "parsing_parsenet.pth" "https://github.com/sczhou/CodeFormer/releases/download/v0.1.0/parsing_parsenet.pth" 
RUN aria2c -x 8 --dir "/" --out "model_base_caption_capfilt_large.pth" "https://storage.googleapis.com/sfr-vision-language-research/BLIP/models/model_base_caption_capfilt_large.pth" 
RUN aria2c -x 8 --dir "/" --out "model-resnet_custom_v3.pt" "https://github.com/AUTOMATIC1111/TorchDeepDanbooru/releases/download/v1/model-resnet_custom_v3.pt" 
RUN aria2c -x 8 --dir "/" --out "clip_l.safetensors" "https://huggingface.co/AUTOMATIC/stable-diffusion-3-medium-text-encoders/resolve/main/clip_l.safetensors"
RUN aria2c -x 8 --dir "/" --out "clip_g.safetensors" "https://huggingface.co/AUTOMATIC/stable-diffusion-3-medium-text-encoders/resolve/main/clip_g.safetensors"


############################# 
#       serverless api      #
#############################

FROM golang:1.21 AS serverless-stable-diffusion-api

RUN go install github.com/oapi-codegen/oapi-codegen/v2/cmd/oapi-codegen@latest

RUN mkdir -p /code && \
    git clone https://github.com/devsapp/serverless-stable-diffusion-api.git /code && \
    cd /code && \
    git checkout 0a3be77d477092e3c6c1f31ebc504232c1a5f6ed

WORKDIR /code

RUN go get ./... && \
    go get github.com/oapi-codegen/runtime && \
    go get github.com/getkin/kin-openapi/openapi3 && \
    go get golang.org/x/text/language 

# /code/build/agent/agentServer
RUN make build-agent

# /code/build/proxy/proxyServer
RUN make build-proxy



############################# 
#          基础镜像         #
#############################
FROM python:3.10.9-slim AS base

ENV BUILTIN="/built-in"
ENV SD_DIR="/stable-diffusion-webui"
ENV NAS_DIR="/mnt/auto/sd"
ENV VIRTUAL_NAS="/virtual_nas"

RUN --mount=type=cache,target=/var/cache/apt \
    apt update && \
    apt install -y \
    rsync vim git curl wget jq ffmpeg \
    gcc g++ unzip build-essential \
    fonts-dejavu-core moreutils aria2 libglfw3-dev libgles2-mesa-dev pkg-config \
    libcairo2 libcairo2-dev procps libpython3-dev

# 从依赖镜像获取所需的依赖文件，并映射至 /mnt/auto/sd
RUN --mount=type=bind,from=deps,source=/venv,target=/mnt/venv \
    mkdir -p /venv && \
    cp -R /mnt/venv/* /venv

# 获取 Stable Diffusion 代码
RUN --mount=type=bind,from=repos,source=/code,target=/code \
    mkdir -p ${SD_DIR} && \
    find /code -maxdepth 1 | xargs -I {} cp -r {} "${SD_DIR}"

# 使用 venv 环境
ENV VIRTUAL_ENV="/venv"
ENV PATH="${VIRTUAL_ENV}/bin:$PATH"


# 启动的时候会下载这个
COPY --from=download_huggingface /clip-vit-large-patch14  ${BUILTIN}/root/.cache/huggingface/hub/
RUN --mount=type=bind,from=download_huggingface,source=/init,target=/init \
    mkdir -p ${BUILTIN}/root/.cache/huggingface/hub/ && \
    cp -R /init/models--google--t5-v1_1-xxl ${BUILTIN}/root/.cache/huggingface/hub/

# 面部修复 + 高分辨率修复 359M + 104M + 81.4M
COPY --from=download_sdwebui /codeformer-v0.1.0.pth ${BUILTIN}/models/Codeformer/codeformer-v0.1.0.pth
COPY --from=download_sdwebui /detection_Resnet50_Final.pth ${BUILTIN}/repositories/CodeFormer/weights/facelib/detection_Resnet50_Final.pth
COPY --from=download_sdwebui /parsing_parsenet.pth ${BUILTIN}/repositories/CodeFormer/weights/facelib/parsing_parsenet.pth

# DeepBooru 反向推导提示词 614M
COPY --from=download_sdwebui /model-resnet_custom_v3.pt ${BUILTIN}/models/torch_deepdanbooru/model-resnet_custom_v3.pt

COPY --from=download_sdwebui /clip_g.safetensors ${BUILTIN}/models/CLIP/clip_g.safetensors
COPY --from=download_sdwebui /clip_l.safetensors ${BUILTIN}/models/CLIP/clip_l.safetensors
WORKDIR ${SD_DIR}

ENTRYPOINT [ "/docker/entrypoint.bash" ]


############################# 
#      lite 轻量版镜像      #
#############################
FROM base AS lite

ARG IMAGE_TAG="${IMAGE_TAG}"
ENV IMAGE_TAG=${IMAGE_TAG}

RUN --mount=type=bind,from=serverless-stable-diffusion-api,source=/code,target=/serverless-api \
    --mount=type=bind,source=/sd-resource,target=/ctx \
    bash /ctx/init.bash


