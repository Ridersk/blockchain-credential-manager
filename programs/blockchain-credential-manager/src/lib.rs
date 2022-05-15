use anchor_lang::prelude::*;

mod errors;
mod instructions;
mod processors;
mod states;

use crate::{
    instructions::credential::*, processors::credential::process_create_credential,
    states::credential::CredentialAccount,
};

declare_id!("5ZJTTxRsgehbwPeZcjz98xcXA9z8QeiSwMrthLrmwsNQ");

#[program]
pub mod blockchain_credential_manager {

    use super::*;

    pub fn create_credential(
        ctx: Context<CreateCredentialInstruction>,
        credential_uid: u64,
        credential_bump: u8,
        title: String,
        label: String,
        secret: String,
        website_url: String,
        label_path: String,
        secret_path: String,
    ) -> Result<()> {
        let credential_account: &mut Account<CredentialAccount> =
            &mut ctx.accounts.credential_account;
        let _bump_vector = credential_bump.to_be_bytes();

        process_create_credential(
            credential_account,
            *ctx.accounts.author.key,
            credential_uid,
            title,
            label,
            secret,
            website_url,
            label_path,
            secret_path,
        )?;

        Ok(())
    }
}
