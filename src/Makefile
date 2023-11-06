.PHONY: help \
		build \
		test \
		push-beijing \
		push-shanghai \
		push-shenzhen \
		push-hangzhou \
		push

help: ## 帮助文件
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {sub("\\\\n",sprintf("\n%22c"," "), $$2);printf "\033[36m%-40s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)

	
NAMESPACE=aliyun-fc
REPO=fc-stable-diffusion
BASE_TAG=basev8

SD15_VERSION=v12
ANIME_VERSION=v12
REALMAN_VERSION=v12
LITE_VERSION=v4


push: push-jp push-beijing push-shanghai push-shenzhen push-hangzhou ## push 镜像到所有 registry


build-base: ## 构建基础镜像
	DOCKER_BUILDKIT=1 docker build -f code/images/Dockerfile --target base -t registry.cn-hangzhou.aliyuncs.com/${NAMESPACE}/${REPO}:${BASE_TAG} code/images

build-sd1.5: ## 构建 sd 1.5
	DOCKER_BUILDKIT=1 docker build -f code/images/Dockerfile --target sd1.5 --build-arg IMAGE_TAG=sd1.5-${SD15_VERSION} -t stable-diffusion:sd1.5-${SD15_VERSION} code/images/

build-anime: ## 构建动漫风格
	DOCKER_BUILDKIT=1 docker build -f code/images/Dockerfile --target anime --build-arg IMAGE_TAG=anime-${ANIME_VERSION} -t stable-diffusion:anime-${ANIME_VERSION} code/images/
	
build-realman: ## 构建真人风格
	DOCKER_BUILDKIT=1 docker build -f code/images/Dockerfile --target realman --build-arg IMAGE_TAG=realman-${REALMAN_VERSION} -t stable-diffusion:realman-${REALMAN_VERSION} code/images/

build-lite: ## 构建 Lite 版本
	DOCKER_BUILDKIT=1 docker build -f code/images/Dockerfile --target lite --build-arg IMAGE_TAG=lite-${LITE_VERSION} -t stable-diffusion:lite-${LITE_VERSION} code/images/

build: build-sd1.5 build-anime build-realman build-lite # 构建全部镜像




push-base: ## 推送基础镜像
	docker push registry.cn-hangzhou.aliyuncs.com/${NAMESPACE}/${REPO}:${BASE_TAG}

push-beijing:  ## push 镜像到北京
	IMAGE=registry.cn-beijing.aliyuncs.com/${NAMESPACE}/${REPO} && \
	for tag in "sd1.5-${SD15_VERSION}" "anime-${ANIME_VERSION}" "realman-${REALMAN_VERSION}" "lite-${LITE_VERSION}"; do \
		docker tag stable-diffusion:$$tag $$IMAGE:$$tag && \
		docker push $$IMAGE:$$tag; \
	done

push-shanghai:  ## push 镜像到上海
	IMAGE=registry.cn-shanghai.aliyuncs.com/${NAMESPACE}/${REPO} && \
	for tag in "sd1.5-${SD15_VERSION}" "anime-${ANIME_VERSION}" "realman-${REALMAN_VERSION}" "lite-${LITE_VERSION}"; do \
		docker tag stable-diffusion:$$tag $$IMAGE:$$tag && \
		docker push $$IMAGE:$$tag; \
	done

push-shenzhen:  ## push 镜像到深圳
	IMAGE=registry.cn-shenzhen.aliyuncs.com/${NAMESPACE}/${REPO} && \
	for tag in "sd1.5-${SD15_VERSION}" "anime-${ANIME_VERSION}" "realman-${REALMAN_VERSION}" "lite-${LITE_VERSION}"; do \
		docker tag stable-diffusion:$$tag $$IMAGE:$$tag && \
		docker push $$IMAGE:$$tag; \
	done

push-hangzhou:  ## push 镜像到杭州
	IMAGE=registry.cn-hangzhou.aliyuncs.com/${NAMESPACE}/${REPO} && \
	for tag in "sd1.5-${SD15_VERSION}" "anime-${ANIME_VERSION}" "realman-${REALMAN_VERSION}" "lite-${LITE_VERSION}"; do \
		docker tag stable-diffusion:$$tag $$IMAGE:$$tag && \
		docker push $$IMAGE:$$tag; \
	done

push-ap: build ## push 镜像到新加坡
	IMAGE=registry-vpc.ap-southeast-1.aliyuncs.com/${NAMESPACE}/${REPO} && \
	for tag in "sd1.5-${SD15_VERSION}" "anime-${ANIME_VERSION}" "realman-${REALMAN_VERSION}" "lite-${LITE_VERSION}"; do \
		docker tag stable-diffusion:$$tag $$IMAGE:$$tag && \
		docker push $$IMAGE:$$tag; \
	done

push-jp:
	IMAGE=registry.ap-northeast-1.aliyuncs.com/${NAMESPACE}/${REPO} && \
	for tag in "sd1.5-${SD15_VERSION}" "anime-${ANIME_VERSION}" "realman-${REALMAN_VERSION}" "lite-${LITE_VERSION}"; do \
		docker tag stable-diffusion:$$tag $$IMAGE:$$tag && \
		docker push $$IMAGE:$$tag; \
	done
	
push-base-ap: build ## push 镜像到新加坡
	docker tag registry.cn-hangzhou.aliyuncs.com/${NAMESPACE}/${REPO}:${BASE_TAG} registry-vpc.ap-southeast-1.aliyuncs.com/${NAMESPACE}/${REPO}:${BASE_TAG} && \
	docker push registry-vpc.ap-southeast-1.aliyuncs.com/${NAMESPACE}/${REPO}:${BASE_TAG}

sync-from-ap: ## 同步新加坡镜像到其他 region
	docker pull registry.ap-southeast-1.aliyuncs.com/${NAMESPACE}/${REPO}:${BASE_TAG} && \
	docker tag  registry.ap-southeast-1.aliyuncs.com/${NAMESPACE}/${REPO}:${BASE_TAG} registry.cn-hangzhou.aliyuncs.com/${NAMESPACE}/${REPO}:${BASE_TAG} && \
	docker push registry.cn-hangzhou.aliyuncs.com/${NAMESPACE}/${REPO}:${BASE_TAG} && \
	for tag in "sd1.5-${SD15_VERSION}" "anime-${ANIME_VERSION}" "realman-${REALMAN_VERSION}" "lite-${LITE_VERSION}"; do \
		for region in "cn-hangzhou" "cn-beijing" "cn-shanghai" "cn-shenzhen" "ap-northeast-1"; do \
			docker pull registry.ap-southeast-1.aliyuncs.com/${NAMESPACE}/${REPO}:$${tag} && \
			docker tag registry.ap-southeast-1.aliyuncs.com/${NAMESPACE}/${REPO}:$${tag} registry.$${region}.aliyuncs.com/${NAMESPACE}/${REPO}:$${tag} && \
			docker push registry.$${region}.aliyuncs.com/${NAMESPACE}/${REPO}:$${tag} && continue; break; \
		done; \
	done
	

push: push-beijing push-shanghai push-hangzhou push-shenzhen push-jp

all-ap: build-base build push-base-ap push-ap

all: all-ap push push-base 

dev: build-anime  ## 使用动漫风格进行测试
	docker run --rm -it --name=sd --net=host -v ${shell pwd}/nas:/mnt/auto stable-diffusion:anime-${ANIME_VERSION}

exec: ## 登入容器实例
	docker exec -it sd /bin/bash
