use anchor_lang::prelude::*;

mod errors;
mod instructions;
mod processors;
mod states;

declare_id!("5ZJTTxRsgehbwPeZcjz98xcXA9z8QeiSwMrthLrmwsNQ");

#[program]
pub mod blockchain_credential_manager {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
