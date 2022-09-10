FROM projectserum/build:v0.24.2

WORKDIR /program

RUN apt update &&\
    apt install -y build-essential &&\
    solana-install update

COPY . /program

RUN yarn install &&\
    anchor build

CMD ["tail", "-f", "/dev/null"]
