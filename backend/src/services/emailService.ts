import { Resend } from 'resend'
import dotenv from 'dotenv'
dotenv.config()

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendAuditConfirmationEmail(
  email: string,
  auditId: string,
  totalSavings: number,
  isHighSavings: boolean
) {
  try {
    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: email,
      subject: 'Your AI Spend Audit Report',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Your AI Spend Audit is Ready</h2>
          <p>We've completed your audit. Here's what we found:</p>
          <p style="font-size: 24px; font-weight: bold; color: #16a34a;">
            Potential savings: $${totalSavings}/month ($${totalSavings * 12}/year)
          </p>
          <a href="${process.env.FRONTEND_URL}/audit/${auditId}" 
             style="background: #2563eb; color: white; padding: 12px 24px; 
                    border-radius: 6px; text-decoration: none; display: inline-block;">
            View Full Report
          </a>
          ${isHighSavings ? `
          <div style="margin-top: 24px; padding: 16px; background: #f0fdf4; border-radius: 8px;">
            <p><strong>You qualify for a Credex consultation.</strong></p>
            <p>Your savings potential is significant. A Credex advisor will reach out 
               within 2 business days to discuss discounted AI credits that could 
               save you even more.</p>
          </div>
          ` : ''}
          <p style="margin-top: 24px; color: #6b7280; font-size: 14px;">
            View your shareable report: ${process.env.FRONTEND_URL}/audit/${auditId}
          </p>
        </div>
      `
    })
  } catch (error) {
    // Don't throw — email failure shouldn't break the lead capture
    console.error('Email send failed:', error)
  }
}