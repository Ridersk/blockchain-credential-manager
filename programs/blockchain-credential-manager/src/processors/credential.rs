use anchor_lang::prelude::*;

use crate::states::credential::CredentialAccount;

pub fn process_create_credential(
    credential_account: &mut Account<CredentialAccount>,
    author_key: Pubkey,
    credential_uid: u64,
    label: String,
    secret: String,
    website_url: String,
) -> Result<()> {
    let curr_timestamp: i64 = Clock::get().unwrap().unix_timestamp;

    credential_account.owner_address = author_key;
    credential_account.uid = credential_uid;
    credential_account.label = label;
    credential_account.secret = secret;
    credential_account.website_url = website_url;
    credential_account.created_at = curr_timestamp;
    credential_account.updated_at = curr_timestamp;

    Ok(())
}
