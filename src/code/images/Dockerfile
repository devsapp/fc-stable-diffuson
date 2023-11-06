# syntax = docker/dockerfile:experimental

# # WebUI 基础镜像
# # 包含 WebUI、相关依赖、插件、Lora、VAE



ARG ROOT="/stable-diffusion-webui"
ARG SD_BUILTIN="/built-in"

############################# 
#     依赖的仓库下载        #
#############################

FROM alpine/git:2.36.2 as repositories

COPY clone.sh /clone.sh

# RUN . /clone.sh taming-transformers https://github.com/CompVis/taming-transformers.git 3ba01b241669f5ade541ce990f7650a3b8f65318 \
#     && rm -rf data assets **/*.ipynb

RUN . /clone.sh /repositories/stable-diffusion-stability-ai https://github.com/Stability-AI/stablediffusion.git cf1d67a6fd5ea1aa600c4df58e5b47da45f6bdbf \
    && rm -rf assets data/**/*.png data/**/*.jpg data/**/*.gif

RUN . /clone.sh /repositories/generative-models https://github.com/Stability-AI/generative-models.git 45c443b316737a4ab6e40413d7794a7f5657c19f \
    && rm -rf assets data/**/*.png data/**/*.jpg data/**/*.gif

RUN . /clone.sh /repositories/CodeFormer https://github.com/sczhou/CodeFormer.git c5b4593074ba6214284d6acd5f1719b6c5d739af \
    && rm -rf assets inputs

RUN . /clone.sh /repositories/BLIP https://github.com/salesforce/BLIP.git 48211a1594f1321b00f14c9f7a5b4813144b2fb9
RUN . /clone.sh /repositories/k-diffusion https://github.com/crowsonkb/k-diffusion.git ab527a9a6d347f364e3d185ba6d714e22d80cb3c
RUN . /clone.sh /repositories/clip-interrogator https://github.com/pharmapsychotic/clip-interrogator 2486589f24165c8e3b303f84e9dbbea318df83e8


############################# 
#     内置的插件下载        #
#############################

FROM alpine/git:2.36.2 as extensions

COPY clone.sh /clone.sh

# adetailer 人脸修复插件
RUN . /clone.sh /extensions/adetailer https://github.com/Bing-su/adetailer.git v23.9.3 && \
    cd /extensions/adetailer && \
    rm -rf .github .vscode *.md .gitignore

# sd-prompt-translator 中文提示词支持
RUN . /clone.sh /extensions/sd-prompt-translator https://github.com/studyzy/sd-prompt-translator.git bfe88c39ff020f22ef3e81b317862cdbe6e0f8af && \
    cd /extensions/sd-prompt-translator && \
    rm -rf UI.png *.md .gitignore

# sd-webui-controlnet
RUN . /clone.sh /extensions/sd-webui-controlnet https://github.com/Mikubill/sd-webui-controlnet.git 7a4805c8ea3256a0eab3512280bd4f84ca0c8182 && \
    cd /extensions/sd-webui-controlnet && \
    rm -rf .github example tests web_tests *.md .gitignore

# sd-webui-deforum 全息视频
RUN . /clone.sh /extensions/sd-webui-deforum https://github.com/deforum-art/sd-webui-deforum.git 368ffb01121b0cbf4c316318bfc1ebe6666e74bd && \
    cd /extensions/sd-webui-deforum && \
    rm -rf .github tests *.md .gitignore

# sd-webui-llul 细节增强
RUN . /clone.sh /extensions/sd-webui-llul https://github.com/hnmr293/sd-webui-llul.git aa47b3eeb45c53f0d6ccaae59abf36e8ed6731f5 && \
    cd /extensions/sd-webui-llul && \
    rm -rf images *.md .gitignore

# sd-webui-prompt-all-in-one 提示词增强
RUN . /clone.sh /extensions/sd-webui-prompt-all-in-one https://github.com/Physton/sd-webui-prompt-all-in-one.git 6e06fb051ab67cd587a9961132c37047b5e6d06d && \
    cd /extensions/sd-webui-prompt-all-in-one && \
    rm -rf .github tests *.MD .gitignore && \
    sed -n -i '1,21p' scripts/physton_prompt/translator/amazon_translator.py && \
    sed -i '16d' scripts/physton_prompt/packages.py

# sd-webui-roop 换脸
RUN . /clone.sh /extensions/sd-webui-roop https://github.com/s0md3v/sd-webui-roop.git 3176d477d77830f06b83573d07aeeae1a7046f6e && \
    cd /extensions/sd-webui-roop && \
    rm -rf example *.md .gitignore

# stable-diffusion-webui-chinese 中文翻译
RUN . /clone.sh /extensions/stable-diffusion-webui-chinese https://github.com/VinsonLaro/stable-diffusion-webui-chinese.git 304061b791599807afec20221438e8c74d94a89f && \
    cd /extensions/stable-diffusion-webui-chinese && \
    rm -rf *.md

# stable-diffusion-webui-dataset-tag-editor 训练打标
RUN . /clone.sh /extensions/stable-diffusion-webui-dataset-tag-editor https://github.com/toshiaki1729/stable-diffusion-webui-dataset-tag-editor.git v0.2.0 && \
    cd /extensions/stable-diffusion-webui-dataset-tag-editor && \
    rm -rf .github pic *.md .gitignore *.png

# stable-diffusion-webui-images-browser 图片浏览器
RUN . /clone.sh /extensions/stable-diffusion-webui-images-browser https://github.com/yfszzx/stable-diffusion-webui-images-browser.git v1.0.0 && \
    cd /extensions/stable-diffusion-webui-images-browser && \
    rm -rf .DS_Store *.md .gitignore

# stable-diffusion-webui-rembg 移除背景
RUN . /clone.sh /extensions/stable-diffusion-webui-rembg https://github.com/AUTOMATIC1111/stable-diffusion-webui-rembg.git 3d9eedbbf0d585207f97d5b21e42f32c0042df70 && \
    cd /extensions/stable-diffusion-webui-rembg && \
    rm -rf *.md .gitignore *.png

# stable-diffusion-webui-wd14-tagger 图片反推提示词
RUN . /clone.sh /extensions/stable-diffusion-webui-wd14-tagger https://github.com/picobyte/stable-diffusion-webui-wd14-tagger.git  v1.2.0 && \
    cd /extensions/stable-diffusion-webui-wd14-tagger && \
    rm -rf docs *.md .gitignore

# sdweb-easy-prompt-selector 提示词选择
COPY ./sd-resource/extensions/sdweb-easy-prompt-selector /extensions/sdweb-easy-prompt-selector


############################# 
#     sdwebui 需要的模型    #
#############################

FROM python:3.10.9-slim as download_sdwebui

RUN apt update && apt install -y aria2

RUN aria2c -x 5 --dir / --out wheel.whl 'https://github.com/AbdBarho/stable-diffusion-webui-docker/releases/download/5.0.3/xformers-0.0.20.dev528-cp310-cp310-manylinux2014_x86_64-pytorch2.whl'

RUN aria2c -x 8 --dir "/" --out "codeformer-v0.1.0.pth" "https://github.com/sczhou/CodeFormer/releases/download/v0.1.0/codeformer.pth"  
RUN aria2c -x 8 --dir "/" --out "detection_Resnet50_Final.pth" "https://github.com/xinntao/facexlib/releases/download/v0.1.0/detection_Resnet50_Final.pth" 
RUN aria2c -x 8 --dir "/" --out "parsing_parsenet.pth" "https://github.com/sczhou/CodeFormer/releases/download/v0.1.0/parsing_parsenet.pth" 
RUN aria2c -x 8 --dir "/" --out "model_base_caption_capfilt_large.pth" "https://storage.googleapis.com/sfr-vision-language-research/BLIP/models/model_base_caption_capfilt_large.pth" 
RUN aria2c -x 8 --dir "/" --out "model-resnet_custom_v3.pt" "https://github.com/AUTOMATIC1111/TorchDeepDanbooru/releases/download/v1/model-resnet_custom_v3.pt" 

############################# 
#     内置插件需要的模型    #
#############################

FROM python:3.10.9-slim as download_extensions

RUN apt update && apt install -y aria2

RUN aria2c -x 8 --dir "/" --out "inswapper_128.onnx" "https://huggingface.co/ezioruan/inswapper_128.onnx/resolve/main/inswapper_128.onnx" 
RUN aria2c -x 8 --dir "/" --out "detector.onnx" "https://huggingface.co/s0md3v/nudity-checker/resolve/main/detector.onnx" 
RUN aria2c -x 8 --dir "/" --out "control_v11p_sd15_scribble.pth" "https://huggingface.co/lllyasviel/ControlNet-v1-1/resolve/main/control_v11p_sd15_scribble.pth"
RUN aria2c -x 8 --dir "/" --out "control_v11p_sd15_scribble.yaml" "https://huggingface.co/lllyasviel/ControlNet-v1-1/resolve/main/control_v11p_sd15_scribble.yaml"
RUN aria2c -x 8 --dir "/" --out "control_v1p_sd15_illumination.safetensors" "https://huggingface.co/ioclab/ioc-controlnet/resolve/main/models/control_v1p_sd15_illumination.safetensors"
RUN aria2c -x 8 --dir "/" --out "buffalo_l.zip" "https://github.com/deepinsight/insightface/releases/download/v0.7/buffalo_l.zip"

############################# 
#          内置模型         #
#############################

FROM python:3.10.9-slim as download_models

RUN apt update && apt install -y aria2

RUN aria2c -x 16 --dir "/" --out "sd-v1-5-inpainting.ckpt" "https://huggingface.co/runwayml/stable-diffusion-inpainting/resolve/main/sd-v1-5-inpainting.ckpt"

RUN aria2c -x 16 --dir "/" --out "mixProV4.Cqhm.safetensors" "https://civitai.com/api/download/models/34559?type=Model&format=SafeTensor&size=full&fp=fp16"

RUN aria2c -x 16 --dir "/" --out "ChinaDollLikeness.safetensors" "https://civitai.com/api/download/models/66172?type=Model&format=SafeTensor"
RUN aria2c -x 16 --dir "/" --out "KoreanDollLikeness.safetensors" "https://civitai.com/api/download/models/31284?type=Model&format=SafeTensor&size=full&fp=fp16"
RUN aria2c -x 16 --dir "/" --out "JapaneseDollLikeness.safetensors" "https://civitai.com/api/download/models/34562?type=Model&format=SafeTensor&size=full&fp=fp16"
RUN aria2c -x 16 --dir "/" --out "chilloutmix_NiPrunedFp16Fix.safetensors" "https://huggingface.co/samle/sd-webui-models/resolve/main/chilloutmix_NiPrunedFp16Fix.safetensors"


RUN aria2c -x 16 --dir "/" --out "cIF8Anime2.43ol.ckpt" "https://civitai.com/api/download/models/28569"
RUN aria2c -x 16 --dir "/" --out "vae-ft-mse-840000-ema-pruned.safetensors" "https://huggingface.co/stabilityai/sd-vae-ft-mse-original/resolve/main/vae-ft-mse-840000-ema-pruned.safetensors"

RUN aria2c -x 16 --dir "/" --out "moxin.safetensors" "https://civitai.com/api/download/models/14856?type=Model&format=SafeTensor&size=full&fp=fp16"
RUN aria2c -x 16 --dir "/" --out "milkingMachine_v11.safetensors" "https://huggingface.co/samle/sd-webui-models/resolve/main/milkingMachine_v11.safetensors" 
RUN aria2c -x 16 --dir "/" --out "blingdbox_v1_mix.safetensors" "https://civitai.com/api/download/models/32988?type=Model&format=SafeTensor&size=full&fp=fp16" 
RUN aria2c -x 16 --dir "/" --out "GachaSpliash4.safetensors" "https://civitai.com/api/download/models/38884?type=Model&format=SafeTensor" 
RUN aria2c -x 16 --dir "/" --out "Colorwater_v4.safetensors" "https://civitai.com/api/download/models/21173?type=Model&format=SafeTensor&size=full&fp=fp16" 

############################# 
#   插件从 hf 下载的模型    #
#############################

FROM python:3.10.9-slim as download_huggingface

RUN --mount=type=cache,target=/root/.cache/pip \
    pip install transformers[sentencepiece] sentencepiece && \
    pip install torch==2.0.1 torchvision==0.15.2 --index-url https://download.pytorch.org/whl/cu118

COPY ./init /init
RUN mkdir -p /sd-prompt-translator && python /init/sd-prompt-translator.py /sd-prompt-translator
RUN mkdir -p /bert-base-uncased-cache && python /init/bert-base-uncased.py /bert-base-uncased-cache
RUN mkdir -p /clip-vit-large-patch14 && python /init/clip-vit-large-patch14.py /clip-vit-large-patch14
RUN mkdir -p /models--Bingsu--adetailer && python /init/bingsu-adetailer.py /models--Bingsu--adetailer

############################# 
#       基础 sd 镜像        #
#############################

FROM python:3.10.9-slim as sdwebui


ENV DEBIAN_FRONTEND=noninteractive PIP_PREFER_BINARY=1

ARG ROOT
ARG SD_BUILTIN
ENV ROOT="${ROOT}"
ENV SD_BUILTIN="${SD_BUILTIN}"

RUN --mount=type=cache,target=/var/cache/apt \
    apt update && \
    apt install -y --no-install-recommends \
    wget git fonts-dejavu-core rsync git jq moreutils aria2 \
    ffmpeg libglfw3-dev libgles2-mesa-dev pkg-config libcairo2 libcairo2-dev \
    libpython3.9-dev gcc g++ procps unzip curl

ENV SHA=v1.6.0
RUN git clone https://github.com/AUTOMATIC1111/stable-diffusion-webui.git /stable-diffusion-webui && \
    cd stable-diffusion-webui && \
    git reset --hard ${SHA}    

RUN --mount=type=bind,from=repositories,source=/repositories,target=/repositories \
    mkdir -p ${ROOT}/repositories/ && \
    cp -R /repositories/* ${ROOT}/repositories/

# 其他必备的依赖
RUN --mount=type=cache,target=/root/.cache/pip \
    pip install --upgrade pip && \
    pip install -r ${ROOT}/requirements_versions.txt && \
    find ${ROOT}/repositories -name requirements.txt | xargs -I {} pip install -r {} || echo "failed" && \
    pip install rich==13.4.2 numexpr matplotlib pandas av pims imageio_ffmpeg gdown mediapipe==0.10.2 \
    ultralytics==8.0.145 py-cpuinfo protobuf==3.20 rembg==2.0.38 \
    deepdanbooru onnxruntime-gpu jsonschema opencv_contrib_python opencv_python opencv_python_headless packaging Pillow tqdm \
    chardet PyExecJS lxml pathos cryptography openai aliyun-python-sdk-core aliyun-python-sdk-alimt send2trash \
    insightface==0.7.3 tensorflow ifnude && \
    pip install xformers==0.0.20 taming-transformers-rom1504 && \
    pip install torch==2.0.1 torchvision==0.15.2 --index-url https://download.pytorch.org/whl/cu118

# fix using lora in only api mode 
# COPY ./fix.diff ${ROOT}/fix.diff
# RUN cd ${ROOT} && git apply --whitespace=fix  fix.diff

FROM sdwebui as base

# 启动的时候会下载这个
COPY --from=download_huggingface /clip-vit-large-patch14  ${SD_BUILTIN}/root/.cache/huggingface/hub/

# 面部修复 + 高分辨率修复 359M + 104M + 81.4M
COPY --from=download_sdwebui /codeformer-v0.1.0.pth ${SD_BUILTIN}/models/Codeformer/codeformer-v0.1.0.pth
COPY --from=download_sdwebui /detection_Resnet50_Final.pth ${SD_BUILTIN}/repositories/CodeFormer/weights/facelib/detection_Resnet50_Final.pth
COPY --from=download_sdwebui /parsing_parsenet.pth ${SD_BUILTIN}/repositories/CodeFormer/weights/facelib/parsing_parsenet.pth

# DeepBooru 反向推导提示词 614M
COPY --from=download_sdwebui /model-resnet_custom_v3.pt ${SD_BUILTIN}/models/torch_deepdanbooru/model-resnet_custom_v3.pt

ENTRYPOINT ["/docker/entrypoint.sh"]
EXPOSE 7860

WORKDIR ${ROOT}

ENV NVIDIA_DRIVER_CAPABILITIES=compute,utility
ENV NVIDIA_VISIBLE_DEVICES=all

############################# 
#      执行部分文件         #
#############################

FROM python:3.10.9-slim as execute

ARG ROOT
ARG SD_BUILTIN
ENV ROOT="${ROOT}"
ENV SD_BUILTIN="${SD_BUILTIN}"

ARG IMAGE_TAG=""
RUN echo -n ${IMAGE_TAG} > /IMAGE_TAG


COPY ./sd-resource ${SD_BUILTIN}

RUN --mount=type=bind,from=sdwebui,source=/,target=/sdwebui \
    cp -R /sdwebui/${ROOT}/scripts ${SD_BUILTIN}/scripts && \
    cp -R /sdwebui/${ROOT}/extensions-builtin/* ${SD_BUILTIN}/extensions-builtin/

RUN sed -i ${SD_BUILTIN}/ui-config.json -e 's@"txt2img/Prompt/value": ""@"txt2img/Prompt/value": "masterpiece, best quality, very detailed, extremely detailed beautiful, super detailed, tousled hair, illustration, dynamic angles, girly, fashion clothing, standing, mannequin, looking at viewer, interview, beach, beautiful detailed eyes, exquisitely beautiful face, floating, high saturation, beautiful and detailed light and shadow"@'
RUN sed -i ${SD_BUILTIN}/ui-config.json -e 's@"txt2img/Negative prompt/value": ""@"txt2img/Negative prompt/value": "loli,nsfw,logo,text,badhandv4,EasyNegative,ng_deepnegative_v1_75t,rev2-badprompt,verybadimagenegative_v1.3,negative_hand-neg,mutated hands and fingers,poorly drawn face,extra limb,missing limb,disconnected limbs,malformed hands,ugly"@'

COPY ./config.json ./entrypoint.sh ./info.py ./sd-agent /docker/
RUN chmod 777 /docker/sd-agent

############################# 
#      最小可运行版本       #
#############################

FROM base as lite

RUN --mount=type=bind,from=execute,source=/,target=/execute \
    cp -R /execute/${SD_BUILTIN}/* ${SD_BUILTIN} && \
    cp -R /execute/docker/ /docker && \
    cp /execute/IMAGE_TAG /IMAGE_TAG

############################# 
#         内置模型          #
#############################

FROM base as model-base

# 内置插件
RUN --mount=type=bind,from=extensions,source=/extensions,target=/extensions \
    mkdir -p ${SD_BUILTIN}/extensions/ && \
    cp -R /extensions/* ${SD_BUILTIN}/extensions/

# 中文提示词翻译 299M
COPY --from=download_huggingface /sd-prompt-translator  ${SD_BUILTIN}/extensions/sd-prompt-translator/scripts/models
# COPY --from=repositories /bert-base-uncased-cache/*  ${SD_BUILTIN}/root/.cache/huggingface/hub/

# CLIP 反向推导提示词 614M? 890M?
# https://github.com/AUTOMATIC1111/stable-diffusion-webui/discussions/10574
# COPY --from=download_extensions /model_base_caption_capfilt_large.pth ${SD_BUILTIN}/models/BLIP/model_base_caption_capfilt_large.pth 

# roop 554M + 
# COPY --from=download_extensions /inswapper_128.onnx ${SD_BUILTIN}/models/roop/inswapper_128.onnx
# COPY --from=download_extensions /detector.onnx ${SD_BUILTIN}/root/.ifnude/detector.onnx
# RUN --mount=type=bind,from=download_extensions,source=/buffalo_l.zip,target=/buffalo_l.zip \
#     mkdir -p ${SD_BUILTIN}/root/.insightface/models && \
#     unzip /buffalo_l.zip -d ${SD_BUILTIN}/root/.insightface/models

# controlnet 
# COPY --from=download_extensions /control_v11p_sd15_scribble.pth ${SD_BUILTIN}/models/ControlNet/control_v11p_sd15_scribble.pth
# COPY --from=download_extensions /control_v11p_sd15_scribble.yaml ${SD_BUILTIN}/models/ControlNet/control_v11p_sd15_scribble.yaml
COPY --from=download_extensions /control_v1p_sd15_illumination.safetensors ${SD_BUILTIN}/models/ControlNet/control_v1p_sd15_illumination.safetensors

# adetailer
COPY --from=download_huggingface /models--Bingsu--adetailer ${SD_BUILTIN}/root/.cache/huggingface/hub/

# 内置模型
COPY --from=download_models /cIF8Anime2.43ol.ckpt ${SD_BUILTIN}/models/VAE/cIF8Anime2.43ol.ckpt

# COPY --from=download_models  /moxin.safetensors ${SD_BUILTIN}/models/Lora/moxin.safetensors
COPY --from=download_models  /milkingMachine_v11.safetensors ${SD_BUILTIN}/models/Lora/milkingMachine_v11.safetensors
COPY --from=download_models  /blingdbox_v1_mix.safetensors ${SD_BUILTIN}/models/Lora/blingdbox_v1_mix.safetensors
COPY --from=download_models  /GachaSpliash4.safetensors ${SD_BUILTIN}/models/Lora/GachaSpliash4.safetensors
COPY --from=download_models  /Colorwater_v4.safetensors ${SD_BUILTIN}/models/Lora/Colorwater_v4.safetensors 


############################# 
#        sd1.5 版本         #
#############################

FROM model-base as sd1.5

COPY --from=download_models  /sd-v1-5-inpainting.ckpt ${SD_BUILTIN}/models/Stable-diffusion/sd-v1-5-inpainting.ckpt

RUN --mount=type=bind,from=execute,source=/,target=/execute \
    cp -R /execute/${SD_BUILTIN}/* ${SD_BUILTIN} && \
    cp -R /execute/docker/ /docker && \
    cp /execute/IMAGE_TAG /IMAGE_TAG

############################# 
#         动漫版本          #
#############################

FROM model-base as anime

COPY --from=download_models  /mixProV4.Cqhm.safetensors ${SD_BUILTIN}/models/Stable-diffusion/mixProV4.Cqhm.safetensors

RUN --mount=type=bind,from=execute,source=/,target=/execute \
    cp -R /execute/${SD_BUILTIN}/* ${SD_BUILTIN} && \
    cp -R /execute/docker/ /docker && \
    cp /execute/IMAGE_TAG /IMAGE_TAG

RUN sed -i ${SD_BUILTIN}/config.json -e 's/sd-v1-5-inpainting.ckpt \[c6bbc15e32\]/mixProV4.Cqhm.safetensors \[61e23e57ea\]/'
RUN sed -i ${SD_BUILTIN}/config.json -e 's/c6bbc15e3224e6973459ba78de4998b80b50112b0ae5b5c67113d56b4e366b19/61e23e57ea13765152435b42d55e7062de188ca3234edb82d751cf52f7667d4f/'
RUN sed -i ${SD_BUILTIN}/config.json -e 's/Automatic/cIF8Anime2.43ol.ckpt/'

############################# 
#         真人版本          #
#############################

FROM model-base as realman

COPY --from=download_models  /ChinaDollLikeness.safetensors ${SD_BUILTIN}/models/Lora/ChinaDollLikeness.safetensors
COPY --from=download_models  /KoreanDollLikeness.safetensors ${SD_BUILTIN}/models/Lora/KoreanDollLikeness.safetensors
COPY --from=download_models  /JapaneseDollLikeness.safetensors ${SD_BUILTIN}/models/Lora/JapaneseDollLikeness.safetensors
COPY --from=download_models  /chilloutmix_NiPrunedFp16Fix.safetensors ${SD_BUILTIN}/models/Stable-diffusion/chilloutmix_NiPrunedFp16Fix.safetensors

RUN --mount=type=bind,from=execute,source=/,target=/execute \
    cp -R /execute/${SD_BUILTIN}/* ${SD_BUILTIN} && \
    cp -R /execute/docker/ /docker && \
    cp /execute/IMAGE_TAG /IMAGE_TAG

RUN sed -i ${SD_BUILTIN}/config.json -e 's@sd-v1-5-inpainting.ckpt \[c6bbc15e32\]@chilloutmix_NiPrunedFp16Fix.safetensors \[59ffe2243a\]@'
RUN sed -i ${SD_BUILTIN}/config.json -e 's@c6bbc15e3224e6973459ba78de4998b80b50112b0ae5b5c67113d56b4e366b19@59ffe2243a25c9fe137d590eb3c5c3d3273f1b4c86252da11bbdc9568773da0c@'
