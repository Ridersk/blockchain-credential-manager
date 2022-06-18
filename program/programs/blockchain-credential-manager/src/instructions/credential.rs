use anchor_lang::prelude::*;

use crate::states::credential::{CredentialAccount, CREDENTIAL_NAMESPACE};

#[derive(Accounts)]
#[instruction(uid: u64)]
pub struct CreateCredentialInstruction<'info> {
    #[account(init, seeds = [CREDENTIAL_NAMESPACE.as_ref(), owner.key().as_ref(), uid.to_be_bytes().as_ref()], bump, payer = owner, space = CredentialAccount::LEN)]
    pub credential_account: Account<'info, CredentialAccount>,
    #[account(mut)]
    pub owner: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(uid: u64)]
pub struct EditCredentialInstruction<'info> {
    #[account(mut, seeds = [CREDENTIAL_NAMESPACE.as_ref(), owner.key().as_ref(), uid.to_be_bytes().as_ref()], bump, has_one=owner)]
    pub credential_account: Account<'info, CredentialAccount>,
    pub owner: Signer<'info>,
}

#[derive(Accounts)]
pub struct DeleteCredentialInstruction<'info> {
    #[account(mut, close=owner)]
    pub credential_account: Account<'info, CredentialAccount>,
    #[account(mut)]
    pub owner: Signer<'info>,
}
