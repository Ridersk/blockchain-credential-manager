use anchor_lang::prelude::*;

use crate::{
    errors::CustomErrorCode,
    states::credential::{
        CredentialAccount, CREDENTIAL_DATA_SIZE, CREDENTIAL_DESCRIPTION_SIZE,
        CREDENTIAL_TITLE_SIZE, CREDENTIAL_URL_SIZE,
    },
};

pub fn process_save_credential(
    credential_account: &mut Account<CredentialAccount>,
    owner_key: Pubkey,
    credential_uid: u64,
    title: String,
    url: String,
    credential_data: String,
    description: String,
) -> Result<()> {
    validate(
        title.clone(),
        url.clone(),
        credential_data.clone(),
        description.clone(),
    )?;

    let curr_timestamp: i64 = Clock::get().unwrap().unix_timestamp;

    credential_account.owner = owner_key;
    credential_account.uid = credential_uid;
    credential_account.title = title;
    credential_account.credential_data = credential_data;
    credential_account.url = url;
    credential_account.description = description;
    credential_account.created_at = curr_timestamp;
    credential_account.updated_at = curr_timestamp;

    Ok(())
}

fn validate(
    title: String,
    url: String,
    credential_data: String,
    description: String,
) -> Result<()> {
    if title.chars().count() > CREDENTIAL_TITLE_SIZE {
        return Err(CustomErrorCode::TitleTooLong.into());
    }

    if url.chars().count() > CREDENTIAL_URL_SIZE {
        return Err(CustomErrorCode::URLTooLong.into());
    }

    if credential_data.chars().count() > CREDENTIAL_DATA_SIZE {
        return Err(CustomErrorCode::CredentialDataTooLong.into());
    }

    if description.chars().count() > CREDENTIAL_DESCRIPTION_SIZE {
        return Err(CustomErrorCode::DescriptionTooLong.into());
    }

    Ok(())
}
