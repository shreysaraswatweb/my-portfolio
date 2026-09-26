import { Resend } from "resend";

// ---------------------------------------------------------------------------
// Vercel Serverless Function — POST /api/contact
// Sends portfolio contact form emails via Resend.
// Env vars: RESEND_API_KEY, CONTACT_EMAIL, FROM_EMAIL (optional)
// ---------------------------------------------------------------------------

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_NAME = 120;
const MAX_EMAIL = 254;
const MAX_MESSAGE = 2000;
const MAX_TOPIC = 60;

/** Basic text sanitisation — strip control chars, collapse whitespace */
function sanitize(str) {
  return str.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "").trim();
}

/** HTML-escape visitor input to prevent injection in email clients */
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Generate formatted date, time, and timezone in Asia/Kolkata */
function getKolkataTimestamp() {
  const now = new Date();

  const dateFormatter = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Kolkata",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const timeFormatter = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Kolkata",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  const date = dateFormatter.format(now);
  const time = timeFormatter.format(now);
  const full = `${date}, ${time} IST`;

  return { date, time, full };
}

/**
 * Builds a responsive, professional HTML email adhering to design-system.json:
 * - Dark canvas (#0B0D14), elevated panel (#131722), sub-panels (#181D2A)
 * - Amber accent (#F5A623) to violet (#A855F7) gradient top highlight
 * - Status pill with emerald dot (#22C55E)
 * - Typography: SF Pro / Inter / system sans-serif hierarchy
 * - 100% inline CSS and table layout for Gmail, Outlook, Apple Mail compatibility
 */
function buildHtmlEmail({ name, email, message, topic, date, time, fullTimestamp }) {
  const safeName = escapeHtml(name || "Website Visitor");
  const safeEmail = escapeHtml(email);
  const safeTopic = escapeHtml(topic || "General");
  const safeMessageHtml = escapeHtml(message).replace(/\r\n|\r|\n/g, "<br />");

  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="color-scheme" content="dark" />
  <meta name="supported-color-schemes" content="dark" />
  <title>New Portfolio Contact — ${safeName}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0B0D14; font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; color: #FFFFFF;">
  <!-- Outer Canvas Table -->
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #0B0D14; width: 100%; min-height: 100vh; padding: 36px 12px;">
    <tr>
      <td align="center" valign="top">
        <!-- Main Card Container (Max 580px) -->
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 580px; background-color: #131722; border-radius: 20px; border: 1px solid #232938; overflow: hidden; box-shadow: 0 16px 48px rgba(0, 0, 0, 0.5);">
          
          <!-- Top Accent Gradient Stripe (design-system amber to violet) -->
          <tr>
            <td height="4" style="background-color: #F5A623; background: linear-gradient(90deg, #F5A623 0%, #A855F7 100%); line-height: 4px; font-size: 0px;">&nbsp;</td>
          </tr>

          <!-- Header Section -->
          <tr>
            <td style="padding: 28px 28px 20px 28px;">
              <!-- Live Status Pill -->
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="background-color: #1A2030; border: 1px solid #2B354C; border-radius: 9999px; margin-bottom: 14px;">
                <tr>
                  <td style="padding: 5px 12px; font-size: 11px; font-weight: 700; letter-spacing: 0.08em; color: #9AA1B2; text-transform: uppercase;">
                    <span style="display: inline-block; width: 7px; height: 7px; background-color: #22C55E; border-radius: 50%; margin-right: 6px; vertical-align: middle;"></span>
                    PORTFOLIO CONTACT
                  </td>
                </tr>
              </table>

              <!-- Main Title -->
              <h1 style="margin: 0 0 6px 0; font-size: 24px; font-weight: 700; color: #FFFFFF; letter-spacing: -0.01em; line-height: 1.25;">
                New Portfolio Contact
              </h1>
              <p style="margin: 0; font-size: 14px; color: #9AA1B2; line-height: 1.5;">
                Someone submitted the contact form on your portfolio website.
              </p>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding: 0 28px;">
              <div style="border-top: 1px solid #232938; height: 1px; line-height: 1px; font-size: 0;"></div>
            </td>
          </tr>

          <!-- VISITOR SECTION -->
          <tr>
            <td style="padding: 24px 28px 12px 28px;">
              <div style="font-size: 11px; font-weight: 700; letter-spacing: 0.08em; color: #9AA1B2; text-transform: uppercase; margin-bottom: 10px;">
                VISITOR
              </div>
              <!-- Visitor Nested Panel -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #181D2A; border: 1px solid #242B3D; border-radius: 14px;">
                <tr>
                  <td style="padding: 20px;">
                    <!-- Name Row -->
                    <div style="font-size: 11px; font-weight: 600; color: #6B7280; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 4px;">
                      NAME
                    </div>
                    <div style="font-size: 17px; font-weight: 700; color: #FFFFFF; line-height: 1.3; margin-bottom: 16px;">
                      ${safeName}
                    </div>

                    <!-- Email Row -->
                    <div style="font-size: 11px; font-weight: 600; color: #6B7280; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 4px;">
                      EMAIL
                    </div>
                    <div style="font-size: 15px; font-weight: 500; line-height: 1.3; margin-bottom: ${safeTopic ? "16px" : "0"};">
                      <a href="mailto:${safeEmail}" style="color: #F5A623; text-decoration: none; font-weight: 600;">
                        ${safeEmail}
                      </a>
                    </div>

                    ${
                      safeTopic
                        ? `
                    <!-- Topic Row -->
                    <div style="font-size: 11px; font-weight: 600; color: #6B7280; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 4px;">
                      TOPIC
                    </div>
                    <div style="font-size: 14px; font-weight: 500; color: #E5E7EB; line-height: 1.3;">
                      ${safeTopic}
                    </div>
                    `
                        : ""
                    }
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- MESSAGE SECTION -->
          <tr>
            <td style="padding: 12px 28px;">
              <div style="font-size: 11px; font-weight: 700; letter-spacing: 0.08em; color: #9AA1B2; text-transform: uppercase; margin-bottom: 10px;">
                MESSAGE
              </div>
              <!-- Message Nested Panel -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #181D2A; border: 1px solid #242B3D; border-radius: 14px;">
                <tr>
                  <td style="padding: 20px;">
                    <div style="font-size: 15px; color: #F3F4F6; line-height: 1.65; word-break: break-word;">
                      ${safeMessageHtml}
                    </div>

                    <!-- Direct Reply Pill CTA Button -->
                    <div style="margin-top: 22px; padding-top: 18px; border-top: 1px solid #242B3D;">
                      <a href="mailto:${safeEmail}?subject=Re:%20${encodeURIComponent(
    `Portfolio Contact — ${safeName}`
  )}" style="display: inline-block; background-color: #F5A623; color: #0B0D14; font-size: 13px; font-weight: 700; padding: 10px 22px; border-radius: 9999px; text-decoration: none; letter-spacing: 0.01em;">
                        Reply to ${safeName} &rarr;
                      </a>
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- SUBMISSION DETAILS SECTION -->
          <tr>
            <td style="padding: 12px 28px 26px 28px;">
              <div style="font-size: 11px; font-weight: 700; letter-spacing: 0.08em; color: #9AA1B2; text-transform: uppercase; margin-bottom: 10px;">
                SUBMISSION DETAILS
              </div>
              <!-- Details Nested Panel -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #181D2A; border: 1px solid #242B3D; border-radius: 14px;">
                <tr>
                  <td style="padding: 18px 20px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td width="33%" valign="top">
                          <div style="font-size: 10px; font-weight: 600; color: #6B7280; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 4px;">
                            DATE
                          </div>
                          <div style="font-size: 13px; font-weight: 600; color: #FFFFFF;">
                            ${date}
                          </div>
                        </td>
                        <td width="33%" valign="top">
                          <div style="font-size: 10px; font-weight: 600; color: #6B7280; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 4px;">
                            TIME
                          </div>
                          <div style="font-size: 13px; font-weight: 600; color: #FFFFFF;">
                            ${time}
                          </div>
                        </td>
                        <td width="34%" valign="top">
                          <div style="font-size: 10px; font-weight: 600; color: #6B7280; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 4px;">
                            SOURCE
                          </div>
                          <div style="font-size: 13px; font-weight: 600; color: #FFFFFF;">
                            Portfolio — Get in Touch
                          </div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer Metadata Section -->
          <tr>
            <td style="padding: 20px 28px 24px 28px; background-color: #0E1017; border-top: 1px solid #1E2330; text-align: center;">
              <p style="margin: 0 0 4px 0; font-size: 12px; color: #9AA1B2; font-weight: 500;">
                Portfolio Contact Form • Shrey Saraswat
              </p>
              <p style="margin: 0; font-size: 11px; color: #6B7280;">
                Submitted on ${fullTimestamp}
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/**
 * Builds the fallback plain-text version for email clients that do not support HTML
 */
function buildPlainTextEmail({ name, email, message, topic, date, time }) {
  return [
    "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
    "NEW PORTFOLIO CONTACT",
    "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
    "Someone submitted the contact form on your portfolio website.",
    "",
    "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
    "VISITOR",
    "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
    `Name:    ${name || "Website Visitor"}`,
    `Email:   ${email}`,
    ...(topic ? [`Topic:   ${topic}`] : []),
    "",
    "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
    "MESSAGE",
    "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
    message,
    "",
    "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
    "SUBMISSION DETAILS",
    "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
    `Date:    ${date}`,
    `Time:    ${time}`,
    `Source:  Portfolio — Get in Touch`,
    "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
  ].join("\n");
}

export default async function handler(req, res) {
  // ── CORS preflight ────────────────────────────────────────────────────
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  // ── Only POST ─────────────────────────────────────────────────────────
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method not allowed." });
  }

  // ── Honeypot check ────────────────────────────────────────────────────
  const { name, email, message, topic, _hp } = req.body || {};

  if (_hp) {
    // Honeypot field filled → likely bot; pretend success silently
    return res.status(200).json({ success: true });
  }

  // ── Server-side validation ────────────────────────────────────────────
  const errors = {};

  const cleanName = sanitize(String(name || ""));
  const cleanEmail = sanitize(String(email || ""));
  const cleanMessage = sanitize(String(message || ""));
  const cleanTopic = sanitize(String(topic || "General"));

  if (!cleanName) {
    errors.name = "Name is required.";
  } else if (cleanName.length > MAX_NAME) {
    errors.name = `Name must be under ${MAX_NAME} characters.`;
  }

  if (!cleanEmail) {
    errors.email = "Email is required.";
  } else if (!EMAIL_REGEX.test(cleanEmail)) {
    errors.email = "Invalid email format.";
  } else if (cleanEmail.length > MAX_EMAIL) {
    errors.email = "Email is too long.";
  }

  if (!cleanMessage) {
    errors.message = "Message is required.";
  } else if (cleanMessage.length < 5) {
    errors.message = "Message must be at least 5 characters.";
  } else if (cleanMessage.length > MAX_MESSAGE) {
    errors.message = `Message must be under ${MAX_MESSAGE} characters.`;
  }

  if (cleanTopic.length > MAX_TOPIC) {
    errors.topic = "Topic is too long.";
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ success: false, message: "Validation failed.", errors });
  }

  // ── Env guard ─────────────────────────────────────────────────────────
  const apiKey = process.env.RESEND_API_KEY;
  const contactEmail = process.env.CONTACT_EMAIL || "shreysaraswat1998@gmail.com";
  const fromAddress = process.env.FROM_EMAIL || "Portfolio Contact <onboarding@resend.dev>";

  if (!apiKey) {
    console.error("[contact] Missing RESEND_API_KEY env var in hosting environment.");
    return res.status(500).json({
      success: false,
      message: "Email service is not configured (missing RESEND_API_KEY in Vercel environment variables).",
    });
  }

  // ── Server-side Timestamps & Subject ──────────────────────────────────
  const { date, time, full: fullTimestamp } = getKolkataTimestamp();
  const subjectName = cleanName || "Website Visitor";
  const subject = `New Portfolio Contact — ${subjectName}`;

  // ── Send email via Resend ─────────────────────────────────────────────
  try {
    const resend = new Resend(apiKey);

    const { data, error } = await resend.emails.send({
      from: fromAddress,
      to: [contactEmail],
      replyTo: cleanEmail,
      subject,
      html: buildHtmlEmail({
        name: cleanName,
        email: cleanEmail,
        message: cleanMessage,
        topic: cleanTopic,
        date,
        time,
        fullTimestamp,
      }),
      text: buildPlainTextEmail({
        name: cleanName,
        email: cleanEmail,
        message: cleanMessage,
        topic: cleanTopic,
        date,
        time,
      }),
    });

    if (error) {
      console.error("[contact] Resend API error:", error);
      return res.status(500).json({
        success: false,
        message: error.message || "Failed to deliver email through Resend.",
      });
    }

    return res.status(200).json({ success: true, id: data?.id });
  } catch (err) {
    console.error("[contact] Resend error:", err);
    return res.status(500).json({
      success: false,
      message: err?.message || "Unable to send message.",
    });
  }
}
