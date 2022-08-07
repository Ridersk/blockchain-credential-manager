use anchor_lang::prelude::*;

/*
 * Exceptions
 */
#[error_code]
pub enum CustomErrorCode {
    #[msg("Title should be 50 characters long maximum.")]
    TitleTooLong,
    #[msg("URL should be 100 characters long maximum.")]
    URLTooLong,
    #[msg("Credential data should be 512 characters long.")]
    CredentialDataTooLong,
    #[msg("Description should be 100 characters long maximum.")]
    DescriptionTooLong,
}
