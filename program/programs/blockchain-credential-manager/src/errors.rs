use anchor_lang::prelude::*;

/*
 * Exceptions
 */
#[error_code]
pub enum CustomErrorCode {
    #[msg("Credential data too long.")]
    CredentialataTooLong
}
