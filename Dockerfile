FROM ubuntu:focal-20240123

RUN apt-get update && \
    apt-get install -y curl bash unzip jq

SHELL [ "/bin/bash", "-c" ]

RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash

# NOTE: nodejsのバージョンを変えるときはここを変える
ARG NODE_VERSION=21.6.1

# NOTE: nvmを使ってnodeを入れる
RUN . $HOME/.nvm/nvm.sh && \
    nvm install $NODE_VERSION && \
    nvm use $NODE_VERSION && \
    nvm alias default $NODE_VERSION

RUN apt-get update && . $HOME/.nvm/nvm.sh

WORKDIR /app
