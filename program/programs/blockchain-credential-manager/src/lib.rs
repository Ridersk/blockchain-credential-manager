use anchor_lang::prelude::*;

mod errors;
mod instructions;
mod processors;
mod states;

use crate::{
    instructions::credential::*, processors::credential::process_save_credential,
    states::credential::CredentialAccount,
};

declare_id!("5ZJTTxRsgehbwPeZcjz98xcXA9z8QeiSwMrthLrmwsNQ");

#[program]
pub mod blockchain_credential_manager {

    use super::*;

    pub fn create_credential(
        ctx: Context<CreateCredentialInstruction>,
        credential_uid: u64,
        title: String,
        url: String,
        icon_url: String,
        label: String,
        secret: String,
        description: String,
    ) -> Result<()> {
        let credential_account: &mut Account<CredentialAccount> =
            &mut ctx.accounts.credential_account;

        process_save_credential(
            credential_account,
            *ctx.accounts.owner.key,
            credential_uid,
            title,
            url,
            icon_url,
            label,
            secret,
            description,
        )?;

        Ok(())
    }

    pub fn edit_credential(
        ctx: Context<EditCredentialInstruction>,
        credential_uid: u64,
        title: String,
        url: String,
        icon_url: String,
        label: String,
        secret: String,
        description: String,
    ) -> Result<()> {
        let credential_account: &mut Account<CredentialAccount> =
            &mut ctx.accounts.credential_account;

        process_save_credential(
            credential_account,
            *ctx.accounts.owner.key,
            credential_uid,
            title,
            url,
            icon_url,
            label,
            secret,
            description,
        )?;
        Ok(())
    }

    pub fn delete_credential(_ctx: Context<DeleteCredentialInstruction>) -> Result<()> {
        Ok(())
    }
}
