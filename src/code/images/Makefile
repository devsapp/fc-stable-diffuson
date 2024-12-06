PWD=$(shell dirname $(realpath $(lastword $(MAKEFILE_LIST))))

.PHONY: help
help: ## 帮助文件
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {sub("\\\\n",sprintf("\n%22c"," "), $$2);printf "\033[36m%-40s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)

NAMESPACE=aliyun-fc
REPO=fc-stable-diffusion
REGIONS="ap-northeast-1" "cn-hangzhou" "cn-shanghai" "cn-beijing" "cn-shenzhen" "ap-southeast-1" "us-east-1"

LITE_VERSION="lite-v12"
SD15_VERSION="sd1.5-v21"
TENSORRT_VERSION="tensorrt-v5"

.PHONY: build-lite
build-lite: ## 构建 Lite 版本
	cd ${PWD} && \
	DOCKER_BUILDKIT=1 docker build -f Dockerfile --target lite --build-arg IMAGE_TAG=${LITE_VERSION} -t ${REPO}:${LITE_VERSION} .

.PHONY: build-sd1.5
build-sd1.5: ## 构建 sd 1.5
	cd ${PWD} && \
	DOCKER_BUILDKIT=1 docker build -f Dockerfile.sd1.5 --target sd1.5 --build-arg IMAGE_TAG=${SD15_VERSION} --build-arg BASE_IMAGE=${REPO}:${LITE_VERSION} -t ${REPO}:${SD15_VERSION} .

.PHONY: build-tensorrt
build-tensorrt: ## 构建 TensorRT
	cd ${PWD} && \
	DOCKER_BUILDKIT=1 docker build -f Dockerfile.tensorrt --target tensorrt --build-arg IMAGE_TAG=${TENSORRT_VERSION} --build-arg BASE_IMAGE=${REPO}:${LITE_VERSION} -t ${REPO}:${TENSORRT_VERSION} .

.PHONY: build
build: build-lite build-sd1.5 # 构建所有 sd 镜像

.PHONY: push-lite
push-lite: build-lite ## push lite 镜像
	tag=${LITE_VERSION} && \
	for region in ${REGIONS}; do \
		image=registry.$$region.aliyuncs.com/${NAMESPACE}/${REPO}:$$tag; \
		docker tag ${REPO}:$$tag $$image; \
		docker push $$image; \
	done

.PHONY: push-sd1.5
push-sd1.5:  ## push sd1.5 镜像
	tag=${SD15_VERSION} && \
	for region in ${REGIONS}; do \
		image=registry.$$region.aliyuncs.com/${NAMESPACE}/${REPO}:$$tag; \
		docker tag ${REPO}:$$tag $$image; \
		docker push $$image; \
	done

.PHONY: push-tensorrt
push-tensorrt:  ## push TensorRT 镜像
	tag=${TENSORRT_VERSION} && \
	for region in ${REGIONS}; do \
		image=registry.$$region.aliyuncs.com/${NAMESPACE}/${REPO}:$$tag; \
		docker tag ${REPO}:$$tag $$image; \
		docker push $$image; \
	done

push: push-lite push-sd1.5 # 推送所有 sd 镜像


dev: ## 使用动漫风格进行测试
	@eval $(shell for l in $(shell cat .env | grep -v '#'); do echo export $$l; done) && \
	if [ -z "$${FC_REGION}" ] || [ -z "$${FC_ACCOUNT_ID}" ] || [ -z "$${ALIBABA_CLOUD_ACCESS_KEY_ID}" ] || [ -z "$${ALIBABA_CLOUD_ACCESS_KEY_SECRET}" ]; then \
		echo "Please set FC_REGION, FC_ACCOUNT_ID, ALIBABA_CLOUD_ACCESS_KEY_ID, ALIBABA_CLOUD_ACCESS_KEY_SECRET in .env"; \
	fi && \
	docker run --rm -it --gpus=all --name=sd --net=host \
		-e EXTRA_ARGS="--api" \
		-e FC_REGION=$$FC_REGION \
		-e FC_ACCOUNT_ID=$$FC_ACCOUNT_ID \
		-e ALIBABA_CLOUD_ACCESS_KEY_ID=$$ALIBABA_CLOUD_ACCESS_KEY_ID \
		-e ALIBABA_CLOUD_ACCESS_KEY_SECRET=$$ALIBABA_CLOUD_ACCESS_KEY_SECRET \
		-e HF_HUB_OFFLINE=1 \
		-v ${shell pwd}/nas:/mnt/auto \
		${REPO}:${SD15_VERSION}

shell: ## 登入 sd shell 环境
	docker run --rm -it --name=sd --net=host --entrypoint="" -v ${shell pwd}/nas:/mnt/auto ${REPO}:${SD15_VERSION} /bin/bash

exec: ## 登入容器实例
	docker exec -it sd /bin/bash


build-proxy: ## 构建 Serverless Stable Diffusion API Proxy 二进制文件
	cd ${PWD} && \
	mkdir -p ../serverless-stable-diffusion-api && \
	DOCKER_BUILDKIT=1 docker build -f Dockerfile --target serverless-stable-diffusion-api -t serverless-stable-diffusion-api:builder . && \
	docker create --name proxy-builder serverless-stable-diffusion-api:builder && \
	docker cp proxy-builder:/code/build/proxy/proxyServer ../serverless-stable-diffusion-api/proxy && \
	docker rm proxy-builder


registry: build-proxy ## 发布到 Serverless Devs Registry
	s registry publish