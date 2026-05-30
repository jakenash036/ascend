import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export async function sendPasswordResetEmail(to: string, resetUrl: string) {
  await sgMail.send({
    to,
    from: {
      email: "noreply@ascendescapeaverage.com",
      name: "Ascend",
    },
    subject: "Reset your Ascend password",
    html: `
      <div style="background:#0a0a0a;color:#e8e8e3;font-family:sans-serif;padding:40px;max-width:480px;margin:0 auto;">
        <p style="font-size:11px;letter-spacing:0.4em;text-transform:uppercase;color:#808080;margin-bottom:24px;">Ascend &mdash; Escape Average</p>
        <h1 style="font-size:20px;font-weight:600;margin-bottom:16px;">Reset your password</h1>
        <p style="font-size:13px;color:#808080;line-height:1.6;margin-bottom:32px;">Click the button below to reset your password. This link expires in 1 hour.</p>
        <a href="${resetUrl}" style="display:inline-block;padding:14px 32px;background:#e8e8e3;color:#0a0a0a;font-weight:600;font-size:12px;letter-spacing:0.2em;text-transform:uppercase;text-decoration:none;">Reset Password</a>
        <p style="font-size:11px;color:#404040;margin-top:32px;">If you didn't request this, ignore this email.</p>
      </div>
    `,
  });
}
