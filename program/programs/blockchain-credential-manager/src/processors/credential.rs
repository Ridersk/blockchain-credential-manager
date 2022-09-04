use anchor_lang::prelude::*;

use crate::{
    errors::CustomErrorCode,
    states::credential::{CredentialAccount, CREDENTIAL_DATA_SIZE},
};

pub fn process_save_credential(
    credential_account: &mut Account<CredentialAccount>,
    owner_key: Pubkey,
    credential_uid: u64,
    credential_data: String,
    iv: String,
    salt: String,
) -> Result<()> {
    validate(credential_data.clone())?;

    let curr_timestamp: i64 = Clock::get().unwrap().unix_timestamp;

    credential_account.owner = owner_key;
    credential_account.uid = credential_uid;
    credential_account.credential_data = credential_data;
    credential_account.iv = iv;
    credential_account.salt = salt;

    if credential_account.created_at == 0 {
        credential_account.created_at = curr_timestamp;
    }

    credential_account.updated_at = curr_timestamp;

    Ok(())
}

fn validate(credential_data: String) -> Result<()> {
    if credential_data.chars().count() > CREDENTIAL_DATA_SIZE {
        return Err(CustomErrorCode::CredentialataTooLong.into());
    }
    Ok(())
}
