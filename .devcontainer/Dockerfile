FROM ubuntu:latest
ARG HOME_DIR

RUN apt update -y
RUN apt upgrade -y
#RUN unminimize -y

RUN apt install zsh  git sudo man    -y

RUN apt install curl -y 
RUN apt install wget -y
RUN curl -fsSL https://deb.nodesource.com/setup_19.x | sudo -E bash - && sudo apt-get install -y nodejs 
RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add
RUN echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
RUN  apt update && apt install yarn -y

# Instalar MongoDB
RUN wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
RUN echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
RUN apt update -y 

ENV TZ=Europe/Madrid
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

RUN apt install -y mongodb-org && rm -rf /var/lib/apt/lists/*

RUN useradd --create-home --shell /bin/zsh vscode
RUN adduser vscode sudo 

RUN echo '%sudo ALL=(ALL) NOPASSWD:ALL' >>/etc/sudoers
RUN echo "vscode:vscode" | chpasswd

COPY ./.zshrc /home/vscode
