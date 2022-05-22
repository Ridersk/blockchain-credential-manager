use anchor_lang::prelude::*;

use crate::states::credential::{CredentialAccount, CREDENTIAL_NAMESPACE};

#[derive(Accounts)]
#[instruction(uid: u64, credential_bump: u8)]
pub struct CreateCredentialInstruction<'info> {
    #[account(init, seeds = [CREDENTIAL_NAMESPACE.as_ref(), author.key().as_ref(), uid.to_be_bytes().as_ref()], bump, payer = author, space = CredentialAccount::LEN)]
    pub credential_account: Account<'info, CredentialAccount>,
    #[account(mut)]
    pub author: Signer<'info>,
    pub system_program: Program<'info, System>,
}
