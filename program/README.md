# Metavault - Program (Development Guide)

To develop the program, you need to have installed [Rust](https://www.rust-lang.org/tools/install) and [Solana CLI](https://docs.solana.com/cli/install-solana-cli-tools) or use the commands in Makefile.

## Install dependencies

```shell
make install
```

If an error occurs, try to run the commands manually (see Makefile).

## Change network

__Local:__

```shell
make switch-local
```

__Devnet:__

```shell
make switch-devnet
```

__Testnet:__

```shell
make switch-testnet
```

## Airdrop

```shell
make airdrop
```

## Run Tests

```shell
make test
```

## Deploy Program

__In Localhost:__

Before deploying the program, you need to start a local Solana cluster. You can use the following command to start a local Solana cluster:

```shell
make start-localnet
```

Then, you can deploy the program by running the following command:

```shell
make deploy
# that is equivalent to
make deploy CLUSTER=localnet AUTHORITY_KEYPAIR_FILE=${HOME}/.config/solana/id.json
```

Only use options if you need non default values. See the all available options in Makefile.

__Devnet/Testnet/Mainnet:__

Example with devnet.

```shell
make deploy CLUSTER=devnet AUTHORITY_KEYPAIR_FILE=${HOME}/.config/solana/id.json
```
