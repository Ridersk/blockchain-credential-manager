CLUSTER = localnet
CLUSTER_URL = http://localhost:8899

AUTHORITY_KEYPAIR_FILE = $${HOME}/.config/solana/id.json
AUTHORITY_ID = $$(solana-keygen pubkey $${AUTHORITY_KEYPAIR_FILE})

PROGRAM_FILE = target/deploy/blockchain_credential_manager.so
PROGRAM_KEYPAIR_FILE = target/deploy/blockchain_credential_manager-keypair.json
PROGRAM_ID = $$(solana address -k ${PROGRAM_KEYPAIR_FILE})


### Setup
install-dependencies:
	sudo apt install -y libudev1 libudev-dev pkg-config &&\
	curl --proto '=https' --tlsv1.2 https://sh.rustup.rs -sSf | sh &&\
	sh -c "$$(curl -sSfL https://release.solana.com/stable/install)" && . ~/.profile &&\
	cargo install --git https://github.com/project-serum/anchor anchor-cli --locked

set-solana-env:
	export PATH="$PATH:$HOME/.local/share/solana/install/active_release/bin/"

###### Network Configs
switch-local:
	solana config set --url localhost

switch-devnet:
	solana config set --url devnet

switch-testnet:
	solana config set --url testnet

switch-custom:
	solana config set --url ${CLUSTER_URL}

show-net:
	solana config get

# Start a local node
start-localnet:
	solana-test-validator --limit-ledger-size 100000

###### Authority Configs
gen-account:
	solana-keygen new --outfile ${AUTHORITY_KEYPAIR_FILE}

show-authority-id:
	@echo ${AUTHORITY_ID}

show-authority-balance:
	solana balance ${AUTHORITY_ID}

airdrop:
	solana airdrop 2 --keypair ${AUTHORITY_KEYPAIR_FILE} &&\
	solana balance --keypair ${AUTHORITY_KEYPAIR_FILE}

###### Program Configs
show-program-id:
	@echo ${PROGRAM_ID}

build:
	anchor build

###### Testing the Program
test:
	anchor test --provider.cluster ${CLUSTER} --provider.wallet ${AUTHORITY_KEYPAIR_FILE}

###### Deploy
# To deploy local, run "make start-localnet" first
deploy:
	$(MAKE) build &&\
	anchor deploy --provider.cluster ${CLUSTER} --provider.wallet ${AUTHORITY_KEYPAIR_FILE} &&\
	$(MAKE) export-program-idl

###### Upgrade
upgrade:
	$(MAKE) build &&\
	anchor upgrade --program-id ${PROGRAM_ID} --provider.cluster ${CLUSTER} ${PROGRAM_FILE} --provider.wallet ${AUTHORITY_KEYPAIR_FILE}


export-program-idl:
	anchor run copy-idl &&\
	anchor run copy-types

###### Styling
code-formatting:
	rustfmt programs/**/**/*.rs
	npm run lint:fix
