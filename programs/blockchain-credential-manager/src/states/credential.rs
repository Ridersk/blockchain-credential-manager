use anchor_lang::prelude::*;

use super::base::*;

#[account]
pub struct CredentialAccount {
    pub owner_address: Pubkey, // wallet address
    pub uid: u64,
    pub label: String,
    pub secret: String,
    pub website_url: String,
    pub created_at: i64,
    pub updated_at: i64,
}

pub const CREDENTIAL_NAMESPACE: &str = "credential";

pub const CREDENTIAL_LABEL_SIZE: usize = 20;
pub const CREDENTIAL_SECRET_SIZE: usize = 50;
pub const CREDENTIAL_URL_SIZE: usize = 50;

pub const CREDENTIAL_OWNER_ADDRESS_LENGTH: usize = PUBLIC_KEY_LENGTH;
pub const CREDENTIAL_UID_LENGTH: usize = 8;
pub const CREDENTIAL_LABEL_LENGTH: usize =
    STRING_LENGTH_PREFIX + CREDENTIAL_LABEL_SIZE * UTF8_CHAR_LENGTH;
pub const CREDENTIAL_SECRET_LENGTH: usize =
    STRING_LENGTH_PREFIX + CREDENTIAL_SECRET_SIZE * UTF8_CHAR_LENGTH;
pub const CREDENTIAL_URL_LENGTH: usize =
    STRING_LENGTH_PREFIX + CREDENTIAL_URL_SIZE * UTF8_CHAR_LENGTH;

impl CredentialAccount {
    pub const LEN: usize = DISCRIMINATOR_LENGTH
        + CREDENTIAL_OWNER_ADDRESS_LENGTH
        + CREDENTIAL_UID_LENGTH
        + CREDENTIAL_LABEL_LENGTH
        + CREDENTIAL_SECRET_LENGTH
        + CREDENTIAL_URL_LENGTH
        + CREATED_AT_LENGTH
        + UPDATED_AT_LENGTH;
}
