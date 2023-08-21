# syntax = docker/dockerfile:experimental

# # WebUI 基础镜像
# # 包含 WebUI、相关依赖、插件、Lora、VAE

############################# 
#     clone repositories    #
#############################
FROM alpine/git:2.36.2 as repositories

COPY clone.sh /clone.sh

# RUN . /clone.sh taming-transformers https://github.com/CompVis/taming-transformers.git 3ba01b241669f5ade541ce990f7650a3b8f65318 \
#     && rm -rf data assets **/*.ipynb

RUN . /clone.sh stable-diffusion-stability-ai https://github.com/Stability-AI/stablediffusion.git cf1d67a6fd5ea1aa600c4df58e5b47da45f6bdbf \
    && rm -rf assets data/**/*.png data/**/*.jpg data/**/*.gif

RUN . /clone.sh generative-models https://github.com/Stability-AI/generative-models.git 5c10deee76adad0032b412294130090932317a87 \
    && rm -rf assets data/**/*.png data/**/*.jpg data/**/*.gif

RUN . /clone.sh CodeFormer https://github.com/sczhou/CodeFormer.git c5b4593074ba6214284d6acd5f1719b6c5d739af \
    && rm -rf assets inputs

RUN . /clone.sh BLIP https://github.com/salesforce/BLIP.git 48211a1594f1321b00f14c9f7a5b4813144b2fb9
RUN . /clone.sh k-diffusion https://github.com/crowsonkb/k-diffusion.git c9fe758757e022f05ca5a53fa8fac28889e4f1cf
RUN . /clone.sh clip-interrogator https://github.com/pharmapsychotic/clip-interrogator 2486589f24165c8e3b303f84e9dbbea318df83e8

############################# 
#     download xformers     #
#############################

FROM alpine:3.17 as xformers

RUN apk add --no-cache aria2
RUN aria2c -x 5 --dir / --out wheel.whl 'https://github.com/AbdBarho/stable-diffusion-webui-docker/releases/download/5.0.3/xformers-0.0.20.dev528-cp310-cp310-manylinux2014_x86_64-pytorch2.whl'

    
# ############################# 
# #     extension models     d#
# #############################

FROM python:3.10.9-slim as extensions

RUN --mount=type=cache,target=/root/.cache/pip \
    pip install transformers[sentencepiece] sentencepiece && \
    pip install torch==2.0.1 torchvision==0.15.2 --index-url https://download.pytorch.org/whl/cu118

COPY ./init /init
RUN mkdir -p /sd-prompt-translator && python /init/sd-prompt-translator.py /sd-prompt-translator
RUN mkdir -p /bert-base-uncased-cache && python /init/bert-base-uncased.py /bert-base-uncased-cache
RUN mkdir -p /clip-vit-large-patch14 && python /init/clip-vit-large-patch14.py /clip-vit-large-patch14
RUN mkdir -p /models--Bingsu--adetailer && python /init/bingsu-adetailer.py /models--Bingsu--adetailer

# ############################# 
# #           models          #
# #############################
FROM alpine:3.17 as models

RUN apk add --no-cache aria2

RUN aria2c -x 8 --dir "/" --out "codeformer-v0.1.0.pth" "https://github.com/sczhou/CodeFormer/releases/download/v0.1.0/codeformer.pth"  
RUN aria2c -x 8 --dir "/" --out "detection_Resnet50_Final.pth" "https://github.com/xinntao/facexlib/releases/download/v0.1.0/detection_Resnet50_Final.pth" 
RUN aria2c -x 8 --dir "/" --out "parsing_parsenet.pth" "https://github.com/sczhou/CodeFormer/releases/download/v0.1.0/parsing_parsenet.pth" 
RUN aria2c -x 8 --dir "/" --out "model_base_caption_capfilt_large.pth" "https://storage.googleapis.com/sfr-vision-language-research/BLIP/models/model_base_caption_capfilt_large.pth" 
RUN aria2c -x 8 --dir "/" --out "model-resnet_custom_v3.pt" "https://github.com/AUTOMATIC1111/TorchDeepDanbooru/releases/download/v1/model-resnet_custom_v3.pt" 
RUN aria2c -x 8 --dir "/" --out "inswapper_128.onnx" "https://huggingface.co/henryruhs/roop/resolve/main/inswapper_128.onnx" 
RUN aria2c -x 8 --dir "/" --out "detector.onnx" "https://huggingface.co/s0md3v/nudity-checker/resolve/main/detector.onnx" 
RUN aria2c -x 8 --dir "/" --out "control_v11p_sd15_scribble.pth" "https://huggingface.co/lllyasviel/ControlNet-v1-1/resolve/main/control_v11p_sd15_scribble.pth"
RUN aria2c -x 8 --dir "/" --out "control_v11p_sd15_scribble.yaml" "https://huggingface.co/lllyasviel/ControlNet-v1-1/resolve/main/control_v11p_sd15_scribble.yaml"
RUN aria2c -x 8 --dir "/" --out "diffusion_pytorch_model.safetensors" "https://huggingface.co/ioclab/control_v1p_sd15_brightness/resolve/main/diffusion_pytorch_model.safetensors"


# ############################# 
# #           dist            #
# #############################


FROM python:3.10.9-slim as base

ENV DEBIAN_FRONTEND=noninteractive PIP_PREFER_BINARY=1

RUN --mount=type=cache,target=/var/cache/apt \
    apt update && \
    apt install -y \
        wget git fonts-dejavu-core rsync git jq moreutils aria2 \
        ffmpeg libglfw3-dev libgles2-mesa-dev pkg-config libcairo2 libcairo2-dev \
        libpython3.9-dev gcc g++

ENV ROOT=/stable-diffusion-webui


ENV SHA=v1.5.1
RUN --mount=type=cache,target=/root/.cache/pip \
    git clone https://github.com/AUTOMATIC1111/stable-diffusion-webui.git /stable-diffusion-webui && \
    cd stable-diffusion-webui && \
    git reset --hard ${SHA} && \
    pip install -r requirements_versions.txt

COPY --from=repositories /repositories/ ${ROOT}/repositories/

# 其他必备的依赖
RUN --mount=type=cache,target=/root/.cache/pip \
    find ${ROOT}/repositories -name requirements.txt | xargs -I {} pip install -r {} || echo "failed" && \
    pip install rich==13.4.2 numexpr matplotlib pandas av pims imageio_ffmpeg gdown mediapipe==0.10.2 \
        ultralytics==8.0.145 py-cpuinfo protobuf==3.20 rembg==2.0.38 \
        deepdanbooru onnxruntime-gpu jsonschema opencv_contrib_python opencv_python opencv_python_headless packaging Pillow tqdm \
        chardet PyExecJS lxml pathos cryptography openai boto3 aliyun-python-sdk-core aliyun-python-sdk-alimt send2trash \
        insightface==0.7.3 tensorflow ifnude && \
    pip install xformers==0.0.20 taming-transformers-rom1504 && \
    pip install torch==2.0.1 torchvision==0.15.2 --index-url https://download.pytorch.org/whl/cu118
    

# ==========================

ENV SD_BUILTIN=/built-in
COPY ./sd-resource ${SD_BUILTIN}
RUN cp -R ${ROOT}/scripts ${SD_BUILTIN}/scripts

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

# roop 554M + 
COPY --from=models /inswapper_128.onnx ${SD_BUILTIN}/models/roop/inswapper_128.onnx
COPY --from=models /detector.onnx ${SD_BUILTIN}/root/.ifnude/detector.onnx

# controlnet 
COPY --from=models /control_v11p_sd15_scribble.pth ${SD_BUILTIN}/models/ControlNet/control_v11p_sd15_scribble.pth
COPY --from=models /control_v11p_sd15_scribble.yaml ${SD_BUILTIN}/models/ControlNet/control_v11p_sd15_scribble.yaml
COPY --from=models /diffusion_pytorch_model.safetensors ${SD_BUILTIN}/models/ControlNet/control_v1p_sd15_brightness

# adetailer
COPY --from=extensions /models--Bingsu--adetailer ${SD_BUILTIN}/root/.cache/huggingface/hub/models--Bingsu--adetailer

COPY ./config.json /docker/config.json
COPY ./entrypoint.sh /docker/entrypoint.sh
COPY ./info.py /docker/info.py

ENV NVIDIA_DRIVER_CAPABILITIES=compute,utility
ENV NVIDIA_VISIBLE_DEVICES=all

WORKDIR ${ROOT}

EXPOSE 7860
ENTRYPOINT ["/docker/entrypoint.sh"]