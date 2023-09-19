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
RUN aria2c -x 8 --dir "/" --out "inswapper_128.onnx" "https://drive.google.com/u/0/uc?id=1krOLgjW2tAPaqV-Bw4YALz0xT5zlb5HF&export=download" 
RUN aria2c -x 8 --dir "/" --out "detector.onnx" "https://huggingface.co/s0md3v/nudity-checker/resolve/main/detector.onnx" 
RUN aria2c -x 8 --dir "/" --out "control_v11p_sd15_scribble.pth" "https://huggingface.co/lllyasviel/ControlNet-v1-1/resolve/main/control_v11p_sd15_scribble.pth"
RUN aria2c -x 8 --dir "/" --out "control_v11p_sd15_scribble.yaml" "https://huggingface.co/lllyasviel/ControlNet-v1-1/resolve/main/control_v11p_sd15_scribble.yaml"
RUN aria2c -x 8 --dir "/" --out "control_v1p_sd15_illumination.safetensors" "https://huggingface.co/ioclab/ioc-controlnet/resolve/main/models/control_v1p_sd15_illumination.safetensors"
RUN aria2c -x 8 --dir "/" --out "buffalo_l.zip" "https://github.com/deepinsight/insightface/releases/download/v0.7/buffalo_l.zip"
  
# ############################# 
# #           dist            #
# #############################


FROM python:3.10.9-slim as sd_base

ENV DEBIAN_FRONTEND=noninteractive PIP_PREFER_BINARY=1

RUN --mount=type=cache,target=/var/cache/apt \
    apt update && \
    apt install -y \
        wget git fonts-dejavu-core rsync git jq moreutils aria2 \
        ffmpeg libglfw3-dev libgles2-mesa-dev pkg-config libcairo2 libcairo2-dev \
        libpython3.9-dev gcc g++ procps unzip curl

ENV ROOT=/stable-diffusion-webui


ENV SHA=v1.6.0
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
        chardet PyExecJS lxml pathos cryptography openai aliyun-python-sdk-core aliyun-python-sdk-alimt send2trash \
        insightface==0.7.3 tensorflow ifnude && \
    pip install xformers==0.0.20 taming-transformers-rom1504 && \
    pip install torch==2.0.1 torchvision==0.15.2 --index-url https://download.pytorch.org/whl/cu118

# fix using lora in only api mode 
COPY ./fix.diff ${ROOT}/fix.diff
RUN cd ${ROOT} && git apply --whitespace=fix  fix.diff

# ==========================

FROM sd_base as base

ENV SD_BUILTIN=/built-in
COPY ./sd-resource ${SD_BUILTIN}
RUN cp -R ${ROOT}/scripts ${SD_BUILTIN}/scripts && \
    cp -R ${ROOT}/extensions-builtin/* ${SD_BUILTIN}/extensions-builtin/

# 中文提示词翻译 299M
COPY --from=extensions /sd-prompt-translator  ${SD_BUILTIN}/extensions/sd-prompt-translator/scripts/models
# COPY --from=extensions /bert-base-uncased-cache/*  ${SD_BUILTIN}/root/.cache/huggingface/hub/

# 启动的时候会下载这个
COPY --from=extensions /clip-vit-large-patch14  ${SD_BUILTIN}/root/.cache/huggingface/hub/

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
RUN --mount=type=bind,target=/buffalo_l.zip,from=models,source=/buffalo_l.zip \
    mkdir -p ${SD_BUILTIN}/root/.insightface/models && \
    unzip /buffalo_l.zip -d ${SD_BUILTIN}/root/.insightface/models

# controlnet 
COPY --from=models /control_v11p_sd15_scribble.pth ${SD_BUILTIN}/models/ControlNet/control_v11p_sd15_scribble.pth
COPY --from=models /control_v11p_sd15_scribble.yaml ${SD_BUILTIN}/models/ControlNet/control_v11p_sd15_scribble.yaml
COPY --from=models /control_v1p_sd15_illumination.safetensors ${SD_BUILTIN}/models/ControlNet/control_v1p_sd15_illumination.safetensors

# adetailer
COPY --from=extensions /models--Bingsu--adetailer ${SD_BUILTIN}/root/.cache/huggingface/hub/

COPY ./config.json /docker/config.json
COPY ./entrypoint.sh /docker/entrypoint.sh
COPY ./info.py /docker/info.py
COPY --chmod=777 ./sd-agent /docker/sd-agent

ENV NVIDIA_DRIVER_CAPABILITIES=compute,utility
ENV NVIDIA_VISIBLE_DEVICES=all

WORKDIR ${ROOT}

EXPOSE 7860
ENTRYPOINT ["/docker/entrypoint.sh"]


FROM alpine:3.17 as model-base-download

RUN apk add --no-cache aria2

RUN aria2c -x 16 --dir "/" --out "sd-v1-5-inpainting.ckpt" "https://huggingface.co/runwayml/stable-diffusion-inpainting/resolve/main/sd-v1-5-inpainting.ckpt"

RUN aria2c -x 16 --dir "/" --out "mixProV4.Cqhm.safetensors" "https://civitai.com/api/download/models/34559?type=Model&format=SafeTensor&size=full&fp=fp16"

RUN aria2c -x 16 --dir "/" --out "ChinaDollLikeness.safetensors" "https://civitai.com/api/download/models/66172?type=Model&format=SafeTensor"
RUN aria2c -x 16 --dir "/" --out "KoreanDollLikeness.safetensors" "https://civitai.com/api/download/models/31284?type=Model&format=SafeTensor&size=full&fp=fp16"
RUN aria2c -x 16 --dir "/" --out "JapaneseDollLikeness.safetensors" "https://civitai.com/api/download/models/34562?type=Model&format=SafeTensor&size=full&fp=fp16"
RUN aria2c -x 16 --dir "/" --out "chilloutmix_NiPrunedFp16Fix.safetensors" https://huggingface.co/samle/sd-webui-models/resolve/main/chilloutmix_NiPrunedFp16Fix.safetensors


RUN aria2c -x 16 --dir "/" --out "cIF8Anime2.43ol.ckpt" "https://civitai.com/api/download/models/28569"
RUN aria2c -x 16 --dir "/" --out "vae-ft-mse-840000-ema-pruned.safetensors" "https://huggingface.co/stabilityai/sd-vae-ft-mse-original/resolve/main/vae-ft-mse-840000-ema-pruned.safetensors"

RUN aria2c -x 16 --dir "/" --out "moxin.safetensors" "https://civitai.com/api/download/models/14856?type=Model&format=SafeTensor&size=full&fp=fp16"
RUN aria2c -x 16 --dir "/" --out "milkingMachine_v11.safetensors" "https://civitai.com/api/download/models/20705?type=Model&format=SafeTensor&size=full&fp=fp16" 
RUN aria2c -x 16 --dir "/" --out "blingdbox_v1_mix.safetensors" "https://civitai.com/api/download/models/32988?type=Model&format=SafeTensor&size=full&fp=fp16" 
RUN aria2c -x 16 --dir "/" --out "GachaSpliash4.safetensors" "https://civitai.com/api/download/models/38884?type=Model&format=SafeTensor" 
RUN aria2c -x 16 --dir "/" --out "Colorwater_v4.safetensors" "https://civitai.com/api/download/models/21173?type=Model&format=SafeTensor&size=full&fp=fp16" 


FROM base as model-base

COPY --from=model-base-download /cIF8Anime2.43ol.ckpt ${SD_BUILTIN}/models/VAE/cIF8Anime2.43ol.ckpt
# COPY --from=models /vae-ft-mse-840000-ema-pruned.safetensors ${SD_BUILTIN}/models/VAE/vae-ft-mse-840000-ema-pruned.safetensors

COPY --from=model-base-download /moxin.safetensors ${SD_BUILTIN}/models/Lora/moxin.safetensors
COPY --from=model-base-download /milkingMachine_v11.safetensors ${SD_BUILTIN}/models/Lora/milkingMachine_v11.safetensors
COPY --from=model-base-download /blingdbox_v1_mix.safetensors ${SD_BUILTIN}/models/Lora/blingdbox_v1_mix.safetensors
COPY --from=model-base-download /GachaSpliash4.safetensors ${SD_BUILTIN}/models/Lora/GachaSpliash4.safetensors
COPY --from=model-base-download /Colorwater_v4.safetensors ${SD_BUILTIN}/models/Lora/Colorwater_v4.safetensors 

RUN sed -i ${SD_BUILTIN}/ui-config.json -e 's@"txt2img/Prompt/value": ""@"txt2img/Prompt/value": "masterpiece, best quality, very detailed, extremely detailed beautiful, super detailed, tousled hair, illustration, dynamic angles, girly, fashion clothing, standing, mannequin, looking at viewer, interview, beach, beautiful detailed eyes, exquisitely beautiful face, floating, high saturation, beautiful and detailed light and shadow"@'
RUN sed -i ${SD_BUILTIN}/ui-config.json -e 's@"txt2img/Negative prompt/value": ""@"txt2img/Negative prompt/value": "loli,nsfw,logo,text,badhandv4,EasyNegative,ng_deepnegative_v1_75t,rev2-badprompt,verybadimagenegative_v1.3,negative_hand-neg,mutated hands and fingers,poorly drawn face,extra limb,missing limb,disconnected limbs,malformed hands,ugly"@'

FROM model-base as sd1.5

COPY --from=model-base-download /sd-v1-5-inpainting.ckpt ${SD_BUILTIN}/models/Stable-diffusion/sd-v1-5-inpainting.ckpt


FROM model-base as anime

COPY --from=model-base-download /mixProV4.Cqhm.safetensors ${SD_BUILTIN}/models/Stable-diffusion/mixProV4.Cqhm.safetensors

RUN sed -i ${SD_BUILTIN}/config.json -e 's/sd-v1-5-inpainting.ckpt \[c6bbc15e32\]/mixProV4.Cqhm.safetensors \[61e23e57ea\]/'
RUN sed -i ${SD_BUILTIN}/config.json -e 's/c6bbc15e3224e6973459ba78de4998b80b50112b0ae5b5c67113d56b4e366b19/61e23e57ea13765152435b42d55e7062de188ca3234edb82d751cf52f7667d4f/'
RUN sed -i ${SD_BUILTIN}/config.json -e 's/Automatic/cIF8Anime2.43ol.ckpt/'

FROM model-base as realman

COPY --from=model-base-download /ChinaDollLikeness.safetensors ${SD_BUILTIN}/models/Lora/ChinaDollLikeness.safetensors
COPY --from=model-base-download /KoreanDollLikeness.safetensors ${SD_BUILTIN}/models/Lora/KoreanDollLikeness.safetensors
COPY --from=model-base-download /JapaneseDollLikeness.safetensors ${SD_BUILTIN}/models/Lora/JapaneseDollLikeness.safetensors
COPY --from=model-base-download /chilloutmix_NiPrunedFp16Fix.safetensors ${SD_BUILTIN}/models/Stable-diffusion/chilloutmix_NiPrunedFp16Fix.safetensors

RUN sed -i ${SD_BUILTIN}/config.json -e 's@sd-v1-5-inpainting.ckpt \[c6bbc15e32\]@chilloutmix_NiPrunedFp16Fix.safetensors \[59ffe2243a\]@'
RUN sed -i ${SD_BUILTIN}/config.json -e 's@c6bbc15e3224e6973459ba78de4998b80b50112b0ae5b5c67113d56b4e366b19@59ffe2243a25c9fe137d590eb3c5c3d3273f1b4c86252da11bbdc9568773da0c@'
