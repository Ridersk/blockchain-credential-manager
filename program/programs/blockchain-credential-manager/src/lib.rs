use anchor_lang::prelude::*;

mod errors;
mod instructions;
mod processors;
mod states;

use crate::{
    errors::CustomErrorCode,
    instructions::credential::*,
    processors::credential::process_create_credential,
    states::credential::{
        CredentialAccount, CREDENTIAL_DESCRIPTION_SIZE, CREDENTIAL_LABEL_SIZE,
        CREDENTIAL_SECRET_SIZE, CREDENTIAL_TITLE_SIZE, CREDENTIAL_URL_SIZE,
    },
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
        website_url: String,
        label: String,
        secret: String,
        description: String,
    ) -> Result<()> {
        let credential_account: &mut Account<CredentialAccount> =
            &mut ctx.accounts.credential_account;
        let _bump_vector = credential_bump.to_be_bytes();

        if title.chars().count() > CREDENTIAL_TITLE_SIZE {
            return Err(CustomErrorCode::TitleTooLong.into());
        }

        if website_url.chars().count() > CREDENTIAL_URL_SIZE {
            return Err(CustomErrorCode::URLTooLong.into());
        }

        if label.chars().count() > CREDENTIAL_LABEL_SIZE {
            return Err(CustomErrorCode::LabelTooLong.into());
        }

        if secret.chars().count() > CREDENTIAL_SECRET_SIZE {
            return Err(CustomErrorCode::SecretTooLong.into());
        }

        if description.chars().count() > CREDENTIAL_DESCRIPTION_SIZE {
            return Err(CustomErrorCode::DescriptionTooLong.into());
        }

        process_create_credential(
            credential_account,
            *ctx.accounts.author.key,
            credential_uid,
            title,
            website_url,
            label,
            secret,
            description,
        )?;

        Ok(())
    }
}
