# WebUI 基础镜像
# 包含 WebUI、相关依赖、插件、Lora、VAE

############################# 
#     clone repositories    #
#############################
FROM alpine/git:2.36.2 as repositories

COPY clone.sh /clone.sh

RUN . /clone.sh taming-transformers https://github.com/CompVis/taming-transformers.git 24268930bf1dce879235a7fddd0b2355b84d7ea6 \
    && rm -rf data assets **/*.ipynb

RUN . /clone.sh stable-diffusion-stability-ai https://github.com/Stability-AI/stablediffusion.git 47b6b607fdd31875c9279cd2f4f16b92e4ea958e \
    && rm -rf assets data/**/*.png data/**/*.jpg data/**/*.gif

RUN . /clone.sh CodeFormer https://github.com/sczhou/CodeFormer.git c5b4593074ba6214284d6acd5f1719b6c5d739af \
    && rm -rf assets inputs

RUN . /clone.sh BLIP https://github.com/salesforce/BLIP.git 48211a1594f1321b00f14c9f7a5b4813144b2fb9
RUN . /clone.sh k-diffusion https://github.com/crowsonkb/k-diffusion.git 5b3af030dd83e0297272d861c19477735d0317ec
RUN . /clone.sh clip-interrogator https://github.com/pharmapsychotic/clip-interrogator 2486589f24165c8e3b303f84e9dbbea318df83e8

############################# 
#     download xformers     #
#############################

FROM alpine:3.17 as xformers

RUN apk add --no-cache aria2
RUN aria2c -x 5 --dir / --out wheel.whl 'https://github.com/AbdBarho/stable-diffusion-webui-docker/releases/download/5.0.3/xformers-0.0.20.dev528-cp310-cp310-manylinux2014_x86_64-pytorch2.whl'

############################# 
#    base image with deps   #
#############################

FROM python:3.10.9-slim as base

ENV DEBIAN_FRONTEND=noninteractive PIP_PREFER_BINARY=1

RUN --mount=type=cache,target=/var/cache/apt \
    apt-get update && \
    # we need those
    apt-get install -y fonts-dejavu-core rsync git jq moreutils aria2 \
    # extensions needs those
    ffmpeg libglfw3-dev libgles2-mesa-dev pkg-config libcairo2 libcairo2-dev

RUN --mount=type=cache,target=/cache --mount=type=cache,target=/root/.cache/pip \
    aria2c -x 5 --dir /cache --out torch-2.0.0-cp310-cp310-linux_x86_64.whl -c \
    https://download.pytorch.org/whl/cu118/torch-2.0.0%2Bcu118-cp310-cp310-linux_x86_64.whl && \
    pip install /cache/torch-2.0.0-cp310-cp310-linux_x86_64.whl torchvision --index-url https://download.pytorch.org/whl/cu118

RUN --mount=type=cache,target=/root/.cache/pip \
    git clone https://github.com/AUTOMATIC1111/stable-diffusion-webui.git && \
    cd stable-diffusion-webui && \
    git reset --hard d7aec59c4eb02f723b3d55c6f927a42e97acd679 && \
    pip install -r requirements_versions.txt

RUN --mount=type=cache,target=/root/.cache/pip  \
    --mount=type=bind,from=xformers,source=/wheel.whl,target=/xformers-0.0.20.dev528-cp310-cp310-manylinux2014_x86_64.whl \
    pip install /xformers-0.0.20.dev528-cp310-cp310-manylinux2014_x86_64.whl

ENV ROOT=/stable-diffusion-webui


COPY --from=repositories /repositories/ ${ROOT}/repositories/
RUN mkdir ${ROOT}/interrogate && cp ${ROOT}/repositories/clip-interrogator/data/* ${ROOT}/interrogate
RUN --mount=type=cache,target=/root/.cache/pip \
    pip install -r ${ROOT}/repositories/CodeFormer/requirements.txt

RUN --mount=type=cache,target=/root/.cache/pip \
    pip install pyngrok \
    git+https://github.com/TencentARC/GFPGAN.git@8d2447a2d918f8eba5a4a01463fd48e45126a379 \
    git+https://github.com/openai/CLIP.git@d50d76daa670286dd6cacf3bcd80b5e4823fc8e1 \
    git+https://github.com/mlfoundations/open_clip.git@bb6e834e9c70d9c27d0dc3ecedeebeaeb1ffad6b

# Note: don't update the sha of previous versions because the install will take forever
# instead, update the repo state in a later step

# TODO: either remove if fixed in A1111 (unlikely) or move to the top with other apt stuff
RUN apt-get -y install libgoogle-perftools-dev && apt-get clean
ENV LD_PRELOAD=libtcmalloc.so

ARG SHA=89f9faa63388756314e8a1d96cf86bf5e0663045
RUN --mount=type=cache,target=/root/.cache/pip \
    cd stable-diffusion-webui && \
    git fetch && \
    git reset --hard ${SHA} && \
    pip install -r requirements_versions.txt

RUN --mount=type=cache,target=/root/.cache/pip  pip install -U opencv-python-headless

RUN python -m pip install --upgrade fastapi==0.90.1

############################# 
#     extension models     #
#############################

FROM base as extensions

COPY ./init /init
RUN mkdir -p /sd-prompt-translator && python /init/sd-prompt-translator.py /sd-prompt-translator
RUN mkdir -p /bert-base-uncased-cache && python /init/bert-base-uncased.py /bert-base-uncased-cache
RUN mkdir -p /clip-vit-large-patch14 && python /init/clip-vit-large-patch14.py /clip-vit-large-patch14

############################# 
#           models          #
#############################
FROM alpine:3.17 as models

RUN apk add --no-cache aria2

RUN aria2c -x 8 --dir "/" --out "codeformer-v0.1.0.pth" "https://github.com/sczhou/CodeFormer/releases/download/v0.1.0/codeformer.pth"  
RUN aria2c -x 8 --dir "/" --out "detection_Resnet50_Final.pth" "https://github.com/xinntao/facexlib/releases/download/v0.1.0/detection_Resnet50_Final.pth" 
RUN aria2c -x 8 --dir "/" --out "parsing_parsenet.pth" "https://github.com/sczhou/CodeFormer/releases/download/v0.1.0/parsing_parsenet.pth" 
RUN aria2c -x 8 --dir "/" --out "model_base_caption_capfilt_large.pth" "https://storage.googleapis.com/sfr-vision-language-research/BLIP/models/model_base_caption_capfilt_large.pth" 
RUN aria2c -x 8 --dir "/" --out "model-resnet_custom_v3.pt" "https://github.com/AUTOMATIC1111/TorchDeepDanbooru/releases/download/v1/model-resnet_custom_v3.pt" 

############################# 
#           dist            #
#############################

FROM base as dist

ENV SD_BUILTIN=/built-in

RUN mkdir -p "${ROOT}/models/Stable-diffusion"

# copy built-in extensions、models
COPY ./sd-resource ${SD_BUILTIN}

# 中文提示词翻译 299M
COPY --from=extensions /sd-prompt-translator  ${SD_BUILTIN}/extensions/sd-prompt-translator/scripts/models
# COPY --from=extensions /bert-base-uncased-cache/*  ${SD_BUILTIN}/cache/huggingface/hub/

# 启动的时候会下载这个
# COPY --from=extensions /clip-vit-large-patch14/*  ${SD_BUILTIN}/cache/huggingface/hub/

# 面部修复 + 高分辨率修复 359M + 104M + 81.4M
COPY --from=models /codeformer-v0.1.0.pth ${SD_BUILTIN}/models/Codeformer/codeformer-v0.1.0.pth
COPY --from=models /detection_Resnet50_Final.pth ${SD_BUILTIN}/repositories/CodeFormer/weights/facelib/detection_Resnet50_Final.pth
COPY --from=models /parsing_parsenet.pth ${SD_BUILTIN}/repositories/CodeFormer/weights/facelib/parsing_parsenet.pth

# CLIP 反向推导提示词 614M? 890M?
# https://github.com/AUTOMATIC1111/stable-diffusion-webui/discussions/10574
# COPY --from=models /model_base_caption_capfilt_large.pth ${SD_BUILTIN}/models/BLIP/model_base_caption_capfilt_large.pth 

# DeepBooru 反向推导提示词 614M
COPY --from=models /model-resnet_custom_v3.pt ${SD_BUILTIN}/models/torch_deepdanbooru/model-resnet_custom_v3.pt

COPY ./config.json /docker/config.json
COPY ./entrypoint.sh /docker/entrypoint.sh
COPY ./info.py /docker/info.py

RUN \
    python3 /docker/info.py ${ROOT}/modules/ui.py && \
    mv ${ROOT}/style.css ${ROOT}/user.css && \
    # one of the ugliest hacks I ever wrote \
    sed -i 's/in_app_dir = .*/in_app_dir = True/g' /usr/local/lib/python3.10/site-packages/gradio/routes.py && \
    git config --global --add safe.directory '*'

WORKDIR ${ROOT}
ENV NVIDIA_DRIVER_CAPABILITIES=compute,utility
ENV NVIDIA_VISIBLE_DEVICES=all
EXPOSE 7860
ENTRYPOINT ["/docker/entrypoint.sh"]