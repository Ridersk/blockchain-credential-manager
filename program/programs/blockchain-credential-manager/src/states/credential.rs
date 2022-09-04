use anchor_lang::prelude::*;

use super::base::*;

#[account]
#[derive(Default)]
pub struct CredentialAccount {
    pub owner: Pubkey,
    pub uid: u64,
    pub credential_data: String,
    pub iv: String,
    pub salt: String,
    pub created_at: i64,
    pub updated_at: i64,
}

pub const CREDENTIAL_NAMESPACE: &str = "credential";
pub const CREDENTIAL_DATA_SIZE: usize = 750;
pub const IV_SIZE: usize = 16;
pub const SALT_SIZE: usize = 32;

pub const CREDENTIAL_OWNER_ADDRESS_LENGTH: usize = PUBLIC_KEY_LENGTH;
pub const CREDENTIAL_UID_LENGTH: usize = 8;
pub const CREDENTIAL_DATA_LENGTH: usize =
    STRING_LENGTH_PREFIX + CREDENTIAL_DATA_SIZE * UTF8_CHAR_LENGTH;
pub const CREDENTIAL_IV_LENGTH: usize = STRING_LENGTH_PREFIX + IV_SIZE * UTF8_CHAR_LENGTH;
pub const CREDENTIAL_SALT_LENGTH: usize = STRING_LENGTH_PREFIX + SALT_SIZE * UTF8_CHAR_LENGTH;

impl CredentialAccount {
    pub const LEN: usize = DISCRIMINATOR_LENGTH
        + CREDENTIAL_OWNER_ADDRESS_LENGTH
        + CREDENTIAL_UID_LENGTH
        + CREDENTIAL_DATA_LENGTH
        + CREDENTIAL_IV_LENGTH
        + CREDENTIAL_SALT_LENGTH
        + CREATED_AT_LENGTH
        + UPDATED_AT_LENGTH;
}
