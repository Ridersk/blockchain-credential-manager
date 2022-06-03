use anchor_lang::prelude::*;

/*
 * Exceptions
 */
#[error_code]
pub enum CustomErrorCode {
    #[msg("O título deve ter no máximo 50 caracteres.")]
    TitleTooLong,
    #[msg("A URL deve ter no máximo 100 caracteres.")]
    URLTooLong,
    #[msg("Tamanho da label ultrapassou o limite após encriptação.")]
    LabelTooLong,
    #[msg("Tamanho da senha ultrapassou o limite após encriptação.")]
    SecretTooLong,
    #[msg("A descrição deve ter no máximo 100 caracteres.")]
    DescriptionTooLong,
}
