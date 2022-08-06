use anchor_lang::prelude::*;

use super::base::*;

#[account]
#[derive(Default)]
pub struct CredentialAccount {
    pub owner: Pubkey, // wallet address
    pub uid: u64,
    pub title: String,
    pub url: String,
    pub icon_url: String,
    pub label: String,
    pub secret: String,
    pub description: String,
    pub created_at: i64,
    pub updated_at: i64,
}

pub const CREDENTIAL_NAMESPACE: &str = "credential";

pub const CREDENTIAL_TITLE_SIZE: usize = 50;
pub const CREDENTIAL_LABEL_SIZE: usize = 128;
pub const CREDENTIAL_SECRET_SIZE: usize = 128;
pub const CREDENTIAL_URL_SIZE: usize = 100;
pub const CREDENTIAL_ICON_URL_SIZE: usize = 255;
pub const CREDENTIAL_DESCRIPTION_SIZE: usize = 100;

pub const CREDENTIAL_OWNER_ADDRESS_LENGTH: usize = PUBLIC_KEY_LENGTH;
pub const CREDENTIAL_UID_LENGTH: usize = 8;
pub const CREDENTIAL_TITLE_LENGTH: usize =
    STRING_LENGTH_PREFIX + CREDENTIAL_TITLE_SIZE * UTF8_CHAR_LENGTH;
pub const CREDENTIAL_URL_LENGTH: usize =
    STRING_LENGTH_PREFIX + CREDENTIAL_URL_SIZE * UTF8_CHAR_LENGTH;
pub const CREDENTIAL_ICON_URL_LENGTH: usize =
    STRING_LENGTH_PREFIX + CREDENTIAL_ICON_URL_SIZE * UTF8_CHAR_LENGTH;
pub const CREDENTIAL_LABEL_LENGTH: usize =
    STRING_LENGTH_PREFIX + CREDENTIAL_LABEL_SIZE * UTF8_CHAR_LENGTH;
pub const CREDENTIAL_SECRET_LENGTH: usize =
    STRING_LENGTH_PREFIX + CREDENTIAL_SECRET_SIZE * UTF8_CHAR_LENGTH;
pub const CREDENTIAL_DESCRIPTION_LENGTH: usize =
    STRING_LENGTH_PREFIX + CREDENTIAL_DESCRIPTION_SIZE * UTF8_CHAR_LENGTH;

impl CredentialAccount {
    pub const LEN: usize = DISCRIMINATOR_LENGTH
        + CREDENTIAL_OWNER_ADDRESS_LENGTH
        + CREDENTIAL_TITLE_LENGTH
        + CREDENTIAL_URL_LENGTH
        + CREDENTIAL_ICON_URL_LENGTH
        + CREDENTIAL_UID_LENGTH
        + CREDENTIAL_LABEL_LENGTH
        + CREDENTIAL_SECRET_LENGTH
        + CREDENTIAL_DESCRIPTION_LENGTH
        + CREATED_AT_LENGTH
        + UPDATED_AT_LENGTH;
}
