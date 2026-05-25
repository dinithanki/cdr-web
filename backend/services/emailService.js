const brevoApiKey = process.env.BREVO_API_KEY || "";
const fromEmail = process.env.EMAIL_FROM || process.env.BREVO_FROM_EMAIL || "";
const fromName = process.env.BREVO_FROM_NAME || "Your App";

export const sendEmail = async (to, subject, html) => {
  if (!brevoApiKey || !fromEmail) {
    throw new Error(
      "Email service is not configured. Set BREVO_API_KEY and EMAIL_FROM.",
    );
  }

  const response = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-key": brevoApiKey,
      accept: "application/json",
    },
    body: JSON.stringify({
      sender: {
        name: fromName,
        email: fromEmail,
      },
      to: [{ email: to }],
      subject,
      htmlContent: html,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Brevo email request failed (${response.status}): ${errorText}`,
    );
  }
};
