use anchor_lang::prelude::*;

mod errors;
mod instructions;
mod processors;
mod states;

use crate::{
    instructions::credential::*, processors::credential::process_save_credential,
    states::credential::CredentialAccount,
};

declare_id!("4Y8nXDhUJ4tGM2n8485ZErt3tVhGa8xRTN1ozMDWEkqE");

#[program]
pub mod blockchain_credential_manager {

    use super::*;

    pub fn create_credential(
        ctx: Context<CreateCredentialInstruction>,
        credential_uid: u64,
        credential_data: String,
        iv: String,
        salt: String,
    ) -> Result<()> {
        let credential_account: &mut Account<CredentialAccount> =
            &mut ctx.accounts.credential_account;

        process_save_credential(
            credential_account,
            *ctx.accounts.owner.key,
            credential_uid,
            credential_data,
            iv,
            salt,
        )?;

        Ok(())
    }

    pub fn edit_credential(
        ctx: Context<EditCredentialInstruction>,
        credential_uid: u64,
        credential_data: String,
        iv: String,
        salt: String,
    ) -> Result<()> {
        let credential_account: &mut Account<CredentialAccount> =
            &mut ctx.accounts.credential_account;

        process_save_credential(
            credential_account,
            *ctx.accounts.owner.key,
            credential_uid,
            credential_data,
            iv,
            salt,
        )?;
        Ok(())
    }

    pub fn delete_credential(_ctx: Context<DeleteCredentialInstruction>) -> Result<()> {
        Ok(())
    }
}
