FROM alpine:3.17 as models

RUN apk add --no-cache aria2

RUN aria2c -x 16 --dir "/" --out "sd-v1-5-inpainting.ckpt" "https://huggingface.co/runwayml/stable-diffusion-inpainting/resolve/main/sd-v1-5-inpainting.ckpt"

RUN aria2c -x 16 --dir "/" --out "mixProV4.Cqhm.safetensors" "https://civitai.com/api/download/models/34559?type=Model&format=SafeTensor&size=full&fp=fp16"

RUN aria2c -x 16 --dir "/" --out "chikmix_V2.safetensors" "https://civitai.com/api/download/models/59409?type=Model&format=SafeTensor&size=full&fp=fp32"
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

RUN aria2c -x 16 --dir "/" --out "sd_xl_base_1.0_0.9vae.safetensors" "https://huggingface.co/stabilityai/stable-diffusion-xl-base-1.0/resolve/main/sd_xl_base_1.0_0.9vae.safetensors" 
RUN aria2c -x 16 --dir "/" --out "sdxl_vae.safetensors" "https://huggingface.co/stabilityai/sdxl-vae/resolve/main/sdxl_vae.safetensors" 


FROM registry.cn-hangzhou.aliyuncs.com/aliyun-fc/fc-stable-diffusion:basev3 as base

COPY --from=models /cIF8Anime2.43ol.ckpt ${SD_BUILTIN}/models/VAE/cIF8Anime2.43ol.ckpt
# COPY --from=models /vae-ft-mse-840000-ema-pruned.safetensors ${SD_BUILTIN}/models/VAE/vae-ft-mse-840000-ema-pruned.safetensors

COPY --from=models /moxin.safetensors ${SD_BUILTIN}/models/Lora/moxin.safetensors
COPY --from=models /milkingMachine_v11.safetensors ${SD_BUILTIN}/models/Lora/milkingMachine_v11.safetensors
COPY --from=models /blingdbox_v1_mix.safetensors ${SD_BUILTIN}/models/Lora/blingdbox_v1_mix.safetensors
COPY --from=models /GachaSpliash4.safetensors ${SD_BUILTIN}/models/Lora/GachaSpliash4.safetensors
COPY --from=models /Colorwater_v4.safetensors ${SD_BUILTIN}/models/Lora/Colorwater_v4.safetensors 

RUN sed -i ${SD_BUILTIN}/ui-config.json -e 's@"txt2img/Prompt/value": ""@"txt2img/Prompt/value": "masterpiece, best quality, very detailed, extremely detailed beautiful, super detailed, tousled hair, illustration, dynamic angles, girly, fashion clothing, standing, mannequin, looking at viewer, interview, beach, beautiful detailed eyes, exquisitely beautiful face, floating, high saturation, beautiful and detailed light and shadow"@'
RUN sed -i ${SD_BUILTIN}/ui-config.json -e 's@"txt2img/Negative prompt/value": ""@"txt2img/Negative prompt/value": "loli,nsfw,logo,text,badhandv4,EasyNegative,ng_deepnegative_v1_75t,rev2-badprompt,verybadimagenegative_v1.3,negative_hand-neg,mutated hands and fingers,poorly drawn face,extra limb,missing limb,disconnected limbs,malformed hands,ugly"@'

FROM base as sd1.5

COPY --from=models /sd-v1-5-inpainting.ckpt ${SD_BUILTIN}/models/Stable-diffusion/sd-v1-5-inpainting.ckpt
COPY ./base/entrypoint.sh /docker/entrypoint.sh


FROM base as anime

COPY --from=models /mixProV4.Cqhm.safetensors ${SD_BUILTIN}/models/Stable-diffusion/mixProV4.Cqhm.safetensors

RUN sed -i ${SD_BUILTIN}/config.json -e 's/sd-v1-5-inpainting.ckpt \[c6bbc15e32\]/mixProV4.Cqhm.safetensors \[61e23e57ea\]/'
RUN sed -i ${SD_BUILTIN}/config.json -e 's/c6bbc15e3224e6973459ba78de4998b80b50112b0ae5b5c67113d56b4e366b19/61e23e57ea13765152435b42d55e7062de188ca3234edb82d751cf52f7667d4f/'
RUN sed -i ${SD_BUILTIN}/config.json -e 's/Automatic/cIF8Anime2.43ol.ckpt/'
COPY ./base/entrypoint.sh /docker/entrypoint.sh

FROM base as realman

# COPY --from=models /chikmix_V2.safetensors ${SD_BUILTIN}/models/Stable-diffusion/chikmix_V2.safetensors
COPY --from=models /ChinaDollLikeness.safetensors ${SD_BUILTIN}/models/Lora/ChinaDollLikeness.safetensors
COPY --from=models /KoreanDollLikeness.safetensors ${SD_BUILTIN}/models/Lora/KoreanDollLikeness.safetensors
COPY --from=models /JapaneseDollLikeness.safetensors ${SD_BUILTIN}/models/Lora/JapaneseDollLikeness.safetensors
COPY --from=models /chilloutmix_NiPrunedFp16Fix.safetensors ${SD_BUILTIN}/models/Stable-diffusion/chilloutmix_NiPrunedFp16Fix.safetensors

RUN sed -i ${SD_BUILTIN}/config.json -e 's@sd-v1-5-inpainting.ckpt \[c6bbc15e32\]@chilloutmix_NiPrunedFp16Fix.safetensors \[59ffe2243a\]@'
RUN sed -i ${SD_BUILTIN}/config.json -e 's@c6bbc15e3224e6973459ba78de4998b80b50112b0ae5b5c67113d56b4e366b19@59ffe2243a25c9fe137d590eb3c5c3d3273f1b4c86252da11bbdc9568773da0c@'
COPY ./base/entrypoint.sh /docker/entrypoint.sh