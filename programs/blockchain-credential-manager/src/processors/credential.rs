use anchor_lang::prelude::*;

use crate::states::credential::CredentialAccount;

pub fn process_create_credential(
    credential_account: &mut Account<CredentialAccount>,
    author_key: Pubkey,
    credential_uid: u64,
    title: String,
    label: String,
    secret: String,
    website_url: String,
    label_path: String,
    secret_path: String,
) -> Result<()> {
    let curr_timestamp: i64 = Clock::get().unwrap().unix_timestamp;

    credential_account.owner_address = author_key;
    credential_account.uid = credential_uid;
    credential_account.title = title;
    credential_account.label = label;
    credential_account.secret = secret;
    credential_account.website_url = website_url;
    credential_account.label_path = label_path;
    credential_account.secret_path = secret_path;
    credential_account.created_at = curr_timestamp;
    credential_account.updated_at = curr_timestamp;

    Ok(())
}
