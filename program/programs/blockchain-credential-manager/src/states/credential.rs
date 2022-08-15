use anchor_lang::prelude::*;

use super::base::*;

#[account]
#[derive(Default)]
pub struct CredentialAccount {
    pub owner: Pubkey, // wallet address
    pub uid: u64,
    pub url: String,
    pub title: String,
    // pub title: [u8; 50],
    pub credential_data: String,
    pub description: String,
    pub created_at: i64,
    pub updated_at: i64,
}

pub const CREDENTIAL_NAMESPACE: &str = "credential";

pub const CREDENTIAL_TITLE_SIZE: usize = 50;
pub const CREDENTIAL_URL_SIZE: usize = 100;
pub const CREDENTIAL_DATA_SIZE: usize = 640;
pub const CREDENTIAL_DESCRIPTION_SIZE: usize = 100;

pub const CREDENTIAL_OWNER_ADDRESS_LENGTH: usize = PUBLIC_KEY_LENGTH;
pub const CREDENTIAL_UID_LENGTH: usize = 8;
pub const CREDENTIAL_URL_LENGTH: usize =
    STRING_LENGTH_PREFIX + CREDENTIAL_URL_SIZE * UTF8_CHAR_LENGTH;
pub const CREDENTIAL_TITLE_LENGTH: usize =
    STRING_LENGTH_PREFIX + CREDENTIAL_TITLE_SIZE * UTF8_CHAR_LENGTH;
pub const CREDENTIAL_DATA_LENGTH: usize =
    STRING_LENGTH_PREFIX + CREDENTIAL_DATA_SIZE * UTF8_CHAR_LENGTH;
pub const CREDENTIAL_DESCRIPTION_LENGTH: usize =
    STRING_LENGTH_PREFIX + CREDENTIAL_DESCRIPTION_SIZE * UTF8_CHAR_LENGTH;

impl CredentialAccount {
    pub const LEN: usize = DISCRIMINATOR_LENGTH
        + CREDENTIAL_OWNER_ADDRESS_LENGTH
        + CREDENTIAL_URL_LENGTH
        + CREDENTIAL_TITLE_LENGTH
        + CREDENTIAL_UID_LENGTH
        + CREDENTIAL_DATA_LENGTH
        + CREDENTIAL_DESCRIPTION_LENGTH
        + CREATED_AT_LENGTH
        + UPDATED_AT_LENGTH;
}
