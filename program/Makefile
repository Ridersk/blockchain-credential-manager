SET_LOCALHOST = solana config set --url localhost
SET_DEVNET = solana config set --url devnet


### 1
install-dependencies:
	sudo apt install -y libudev1 libudev-dev pkg-config &&\
	curl --proto '=https' --tlsv1.2 https://sh.rustup.rs -sSf | sh &&\
	sh -c "$$(curl -sSfL https://release.solana.com/stable/install)" && . ~/.profile &&\
	cargo install --git https://github.com/project-serum/anchor anchor-cli --locked

###### Switch Networks
### 1.1
switch-localhost:
	${SET_LOCALHOST}

switch-devnet:
	${SET_DEVNET}

show-net:
	solana config get

### 1.2
# Setup a fake solana cluster on localnet
start-localnet-cluster:
	solana-test-validator

### 2
gen-account:
	solana-keygen new

airdrop:
	solana airdrop 5 &&\
	solana balance

### 3
# Use default anchor program id
test-localnet:
	anchor test --provider.cluster localnet

test-localnet-net-started:
	anchor test --provider.cluster localnet

test-devnet:
	anchor test --provider.cluster devnet

###### Deploy
deploy-devnet:
	${SET_DEVNET} &&\
	anchor build &&\
	anchor deploy --provider.cluster devnet &&\
	${SET_LOCALHOST} &&\
	anchor run copy-idl &&\
	anchor run copy-types

# To deploy local, run "make start-localnet-cluster" first
deploy-localnet:
	${SET_LOCALHOST} &&\
	anchor build &&\
	anchor deploy --provider.cluster localnet &&\
	anchor run copy-idl &&\
	anchor run copy-types

show-program-id:
	@echo PROGRAM_ID: $$(solana address -k target/deploy/blockchain_credential_manager-keypair.json)

###### Styling
code-formatting:
	rustfmt programs/**/**/*.rs
	npm run lint:fix
