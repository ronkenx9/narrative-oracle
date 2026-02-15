use anchor_lang::prelude::*;

declare_id!("8PH2BtyQzVwaxzhEqs6bNSR43LiwYNZqp5pAjMfQnSm5");

#[program]
pub mod narrative_oracle {
    use super::*;

    pub fn register_narrative(
        ctx: Context<RegisterNarrative>,
        metadata_url: String,
        confidence_score: u16,
    ) -> Result<()> {
        let narrative = &mut ctx.accounts.narrative;
        narrative.author = ctx.accounts.author.key();
        narrative.metadata_url = metadata_url;
        narrative.confidence_score = confidence_score;
        narrative.total_staked = 0;
        narrative.bump = ctx.bumps.narrative;

        msg!("Narrative registered: {}", narrative.metadata_url);
        Ok(())
    }

    pub fn validate_narrative(
        ctx: Context<ValidateNarrative>,
        amount: u64,
    ) -> Result<()> {
        let narrative = &mut ctx.accounts.narrative;
        
        // Simple staking logic: transfer SOL to the narrative account (or a vault)
        // Here we just track the "stake" for simplicity in the MVP
        let cpi_context = CpiContext::new(
            ctx.accounts.system_program.to_account_info(),
            anchor_lang::system_program::Transfer {
                from: ctx.accounts.signer.to_account_info(),
                to: narrative.to_account_info(),
            },
        );
        anchor_lang::system_program::transfer(cpi_context, amount)?;

        narrative.total_staked += amount;
        msg!("Staked {} lamports on narrative", amount);
        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(metadata_url: String)]
pub struct RegisterNarrative<'info> {
    #[account(
        init,
        payer = author,
        space = 8 + 32 + (4 + 64) + 2 + 8 + 1, // disc + pubkey + string(64) + score + stake + bump
        seeds = [b"narrative", author.key().as_ref(), metadata_url.as_bytes()],
        bump
    )]
    pub narrative: Account<'info, Narrative>,
    #[account(mut)]
    pub author: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct ValidateNarrative<'info> {
    #[account(mut)]
    pub narrative: Account<'info, Narrative>,
    #[account(mut)]
    pub signer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[account]
pub struct Narrative {
    pub author: Pubkey,
    pub metadata_url: String,
    pub confidence_score: u16,   // 0-10000
    pub total_staked: u64,
    pub bump: u8,
}
