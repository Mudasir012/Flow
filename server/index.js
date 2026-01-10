import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

const app = express();
app.set("trust proxy", true);
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

/* ---- CORS ---- */
const devDefaultOrigins = new Set([
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:3000",
  "http://127.0.0.1:3000",
]);
const extraOrigins = (process.env.ALLOWED_ORIGINS || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);
const prodOrigins = new Set(extraOrigins);
const allowOrigin = (origin) => {
  if (!origin) return true;
  if (process.env.NODE_ENV !== "production") return devDefaultOrigins.has(origin);
  return prodOrigins.has(origin);
};
app.use(
  cors({
    origin: (origin, cb) =>
      allowOrigin(origin)
        ? cb(null, true)
        : cb(new Error(`CORS: origin not allowed -> ${origin || "null"}`)),
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
    credentials: false,
  })
);

/* ---- ENV Variables ---- */
const {
  SMTP_HOST,
  SMTP_PORT,
  SMTP_USER,
  SMTP_PASS,
  OWNER_EMAIL,
  BRAND_NAME = "FLOW",
  SITE_URL = "https://flow.com",
  CONTACT_PHONE = "",
  INSTAGRAM_URL = "https://www.instagram.com/mudasir_hssain/",
  LINKEDIN_URL = "https://www.linkedin.com/in/huzaifasafdar/",
  X_URL = "https://x.com/umeizefa?s=21",
  NODE_ENV,
} = process.env;

const PORT = process.env.PORT || 5000;

/* ---- Validate critical env vars ---- */
if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS || !OWNER_EMAIL) {
  console.error("❌ ERROR: Missing critical SMTP configuration!");
  console.error(
    "Required env vars: SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, OWNER_EMAIL"
  );
  process.exit(1);
}

console.log("✓ SMTP Configuration:");
console.log(`  Host: ${SMTP_HOST}`);
console.log(`  Port: ${SMTP_PORT}`);
console.log(`  User: ${SMTP_USER}`);
console.log(`  Owner: ${OWNER_EMAIL}`);

/* ---- Nodemailer Transport ---- */
const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: Number(SMTP_PORT),
  secure: Number(SMTP_PORT) === 465, // true for 465, false for other ports
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS,
  },
  tls: {
    minVersion: "TLSv1.2",
    rejectUnauthorized: NODE_ENV === "production",
  },
  debug: NODE_ENV !== "production", // Enable debug logs in dev
  logger: NODE_ENV !== "production", // Enable logging in dev
});

const fromAddress = `"${BRAND_NAME}" <${SMTP_USER}>`;

/* ---- Helpers ---- */
const escapeHtml = (str = "") =>
  String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const devDetails = (err) =>
  NODE_ENV === "production"
    ? undefined
    : {
        code: err?.code,
        responseCode: err?.responseCode,
        command: err?.command,
        message: err?.message,
        stack: err?.stack,
      };

const COLORS = {
  blue: "#4a6cf7",
  black: "#1a1a1a",
  gold: "#D4AF37",
  text: "#222222",
  light: "#f5f7ff",
  border: "#e6e8f0",
};

/* ---- Email Template Shell ---- */
function emailShell({ preheader = "", title = "", body = "" }) {
  return `<!doctype html>
<html>
<head>
<meta charset="utf-8">
<meta name="color-scheme" content="light only">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${escapeHtml(title)}</title>
<style type="text/css">
  body { margin: 0; padding: 0; background: #ffffff; }
  table { border-collapse: collapse; }
  img { border: 0; }
</style>
</head>
<body style="margin:0;padding:0;background:#ffffff;">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">${escapeHtml(
    preheader
  )}</div>
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:${
    COLORS.blue
  };">
  <tr>
    <td align="center" style="padding:8px 12px;">
      <span style="font:500 12px/1.4 system-ui,-apple-system,Segoe UI,Roboto,Ubuntu,'Helvetica Neue',Arial; color:#fff; letter-spacing:.3px;">
        DISCOVER THE POWER OF CODE AND USE IT TO CHANGE THE WORLD • FLOW
      </span>
    </td>
  </tr>
</table>
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:${
    COLORS.black
  };">
  <tr>
    <td align="center" style="padding:22px 12px;">
      <div style="font:800 24px/1 system-ui,-apple-system,Segoe UI,Roboto,Ubuntu,'Helvetica Neue',Arial; color:#ffffff; letter-spacing:1px;">
        <span style="display:inline-block;padding:8px 14px;border:2px solid ${
          COLORS.gold
        };border-radius:6px;">FLOW</span>
      </div>
    </td>
  </tr>
</table>
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
  <tr>
    <td align="center">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="640" style="width:100%;max-width:640px;">
        <tr>
          <td style="padding:24px 20px 8px 20px;border-bottom:1px solid ${
            COLORS.border
          };">
            <h1 style="margin:0;font:800 20px/1.3 system-ui,-apple-system,Segoe UI,Roboto,Ubuntu,'Helvetica Neue',Arial;color:${
              COLORS.black
            };">${escapeHtml(title)}</h1>
          </td>
        </tr>
        <tr>
          <td style="padding:20px;color:${COLORS.text};font:400 14px/1.7 -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Ubuntu,Helvetica,Arial;">
            ${body}
          </td>
        </tr>
        <tr>
          <td style="padding:0 20px 24px 20px;">
            <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:${
              COLORS.light
            };border:1px solid ${
    COLORS.border
  };border-radius:10px;">
              <tr>
                <td style="padding:16px 18px;">
                  <div style="font:700 13px/1.4 system-ui,-apple-system,Segoe UI,Roboto,Ubuntu,Helvetica,Arial;color:${
                    COLORS.black
                  };margin:0 0 8px 0;">Connect</div>
                  <div style="font:400 13px/1.6 system-ui,-apple-system,Segoe UI,Roboto,Ubuntu,Helvetica,Arial;">
                    <a href="${escapeHtml(
                      LINKEDIN_URL
                    )}" style="color:${COLORS.blue};text-decoration:none;">LinkedIn</a> &nbsp;•&nbsp;
                    <a href="${escapeHtml(
                      INSTAGRAM_URL
                    )}" style="color:${COLORS.blue};text-decoration:none;">Instagram</a> &nbsp;•&nbsp;
                    <a href="${escapeHtml(
                      X_URL
                    )}" style="color:${COLORS.blue};text-decoration:none;">X/Twitter</a>
                    ${
                      CONTACT_PHONE
                        ? `&nbsp;•&nbsp; <span style="color:${COLORS.text};">Phone: ${escapeHtml(
                            CONTACT_PHONE
                          )}</span>`
                        : ""
                    }
                  </div>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding:6px 20px 28px 20px;text-align:center;color:#666;font:400 12px/1.5 -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Ubuntu,Helvetica,Arial;">
            © ${new Date().getFullYear()} ${escapeHtml(
    BRAND_NAME
  )} • <a href="${escapeHtml(
    SITE_URL
  )}" style="color:${COLORS.blue};text-decoration:none;">${escapeHtml(
    SITE_URL
  )}</a>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
</body>
</html>`;
}

/* ---- Owner Notification Email ---- */
function ownerEmailHtml({ firstName, lastName, email, message }) {
  const title = "New Portfolio Contact";
  const preheader = `${firstName} ${lastName} just sent you a message.`;
  const body = `
    <p style="margin:0 0 14px 0;">You've received a new message from your portfolio contact form.</p>
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border:1px solid ${
      COLORS.border
    };border-radius:10px;">
      <tr>
        <td style="padding:12px 16px;border-bottom:1px solid ${COLORS.border};">
          <div style="font:700 13px/1.2 system-ui,-apple-system,Segoe UI,Roboto,Ubuntu,Helvetica,Arial;color:${
            COLORS.black
          };">Name</div>
          <div style="font:400 14px/1.6 system-ui,-apple-system,Segoe UI,Roboto,Ubuntu,Helvetica,Arial;">${escapeHtml(
            firstName
          )} ${escapeHtml(lastName)}</div>
        </td>
      </tr>
      <tr>
        <td style="padding:12px 16px;border-bottom:1px solid ${COLORS.border};">
          <div style="font:700 13px/1.2 system-ui,-apple-system,Segoe UI,Roboto,Ubuntu,Helvetica,Arial;color:${
            COLORS.black
          };">Email</div>
          <div style="font:400 14px/1.6 system-ui,-apple-system,Segoe UI,Roboto,Ubuntu,Helvetica,Arial;"><a href="mailto:${escapeHtml(
            email
          )}" style="color:${COLORS.blue};text-decoration:none;">${escapeHtml(
    email
  )}</a></div>
        </td>
      </tr>
      <tr>
        <td style="padding:12px 16px;">
          <div style="font:700 13px/1.2 system-ui,-apple-system,Segoe UI,Roboto,Ubuntu,Helvetica,Arial;color:${
            COLORS.black
          };">Message</div>
          <div style="font:400 14px/1.7 system-ui,-apple-system,Segoe UI,Roboto,Ubuntu,Helvetica,Arial;white-space:pre-wrap;">${escapeHtml(
            message
          )}</div>
        </td>
      </tr>
    </table>
  `;
  return emailShell({ preheader, title, body });
}

/* ---- User Auto-Reply Email ---- */
function userEmailHtml({ firstName, message }) {
  const title = `Thanks for contacting ${BRAND_NAME}`;
  const preheader =
    "We received your message and will get back to you soon.";
  const body = `
    <p style="margin:0 0 14px 0;">Hi <strong>${escapeHtml(
      firstName
    )}</strong>,</p>
    <p style="margin:0 0 14px 0;">Thank you for reaching out to <strong>${escapeHtml(
      BRAND_NAME
    )}</strong>. We've received your message and will get back to you shortly.</p>
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border:1px solid ${
      COLORS.border
    };border-radius:10px;background:#fff;">
      <tr>
        <td style="padding:12px 16px;">
          <div style="font:700 13px/1.2 system-ui,-apple-system,Segoe UI,Roboto,Ubuntu,Helvetica,Arial;color:${
            COLORS.black
          };">Your message</div>
          <div style="font:400 14px/1.7 system-ui,-apple-system,Segoe UI,Roboto,Ubuntu,Helvetica,Arial;white-space:pre-wrap;">${escapeHtml(
            message
          )}</div>
        </td>
      </tr>
    </table>
    <p style="margin:16px 0 0 0;color:#666;font:400 12px/1.7 -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Ubuntu,Helvetica,Arial;">
      If you didn't request this message, you can safely ignore it.
    </p>
  `;
  return emailShell({ preheader, title, body });
}

/* ---- Health Check ---- */
app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "contact-api" });
});

/* ---- SMTP Verification ---- */
app.get("/api/verify-smtp", async (_req, res) => {
  try {
    await transporter.verify();
    console.log("✓ SMTP connection verified");
    res.json({ ok: true, message: "SMTP connection verified" });
  } catch (err) {
    console.error("❌ SMTP verify failed:", err);
    res.status(500).json({
      ok: false,
      error: "SMTP verify failed",
      details: devDetails(err),
    });
  }
});

/* ---- Contact Form Endpoint ---- */
app.post("/api/contact", async (req, res) => {
  try {
    const { firstName, lastName, email, message } = req.body || {};

    // Validation
    if (!firstName?.trim() || !lastName?.trim() || !email?.trim() || !message?.trim()) {
      return res.status(400).json({ error: "All fields are required." });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email address." });
    }

    console.log(`📧 Processing contact from: ${firstName} ${lastName} <${email}>`);

    // Generate unique message IDs
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 15);
    const messageIdOwner = `<owner-${timestamp}-${random}@artbyzefa.today>`;
    const messageIdUser = `<user-${timestamp}-${random}@artbyzefa.today>`;

    /* Send email to owner */
    let ownerMail;
    try {
      ownerMail = await transporter.sendMail({
        from: fromAddress,
        to: OWNER_EMAIL,
        replyTo: email,
        subject: `New Contact: ${firstName} ${lastName}`,
        html: ownerEmailHtml({ firstName, lastName, email, message }),
        text: `New contact form submission\n\nName: ${firstName} ${lastName}\nEmail: ${email}\n\nMessage:\n${message}`,
        messageId: messageIdOwner,
        headers: {
          "X-Priority": "3",
          "X-Mailer": "FLOW Contact Form",
        },
      });
      console.log("✓ Owner notification sent:", ownerMail.messageId);
    } catch (err) {
      console.error("❌ Failed to send owner notification:", err);
      return res.status(500).json({
        error: "Failed to send notification to owner.",
        details: devDetails(err),
      });
    }

    /* Send auto-reply to user */
    let userMail;
    try {
      userMail = await transporter.sendMail({
        from: fromAddress,
        to: email,
        replyTo: OWNER_EMAIL,
        subject: `Thanks for contacting ${BRAND_NAME}`,
        html: userEmailHtml({ firstName, message }),
        text: `Hi ${firstName},\n\nThank you for contacting ${BRAND_NAME}. We've received your message and will get back to you soon.\n\nYour message:\n${message}\n\nBest regards,\n${BRAND_NAME}\n${SITE_URL}`,
        messageId: messageIdUser,
        headers: {
          "Auto-Submitted": "auto-replied",
          "X-Priority": "3",
          "X-Mailer": "FLOW Contact Form",
        },
      });
      console.log("✓ Auto-reply sent:", userMail.messageId);
    } catch (err) {
      console.error("❌ Failed to send auto-reply:", err);
      // Don't fail the request if auto-reply fails
      return res.json({
        ok: true,
        ownerMailId: ownerMail.messageId,
        warning: "Owner notified but auto-reply failed",
      });
    }

    res.json({
      ok: true,
      ownerMailId: ownerMail.messageId,
      userMailId: userMail.messageId,
    });
  } catch (err) {
    console.error("❌ Unexpected error in /api/contact:", err);
    res.status(500).json({
      error: "An unexpected error occurred.",
      details: devDetails(err),
    });
  }
});

/* ---- Start Server ---- */
app.listen(Number(PORT), () => {
  console.log(`\n🚀 Contact API server running on port ${PORT}`);
  console.log(`   Environment: ${NODE_ENV || "development"}`);
  console.log(`   Health check: http://localhost:${PORT}/api/health`);
  console.log(`   SMTP verify: http://localhost:${PORT}/api/verify-smtp\n`);
});

// Verify SMTP on startup
transporter.verify((error, success) => {
  if (error) {
    console.error("❌ SMTP connection error on startup:", error);
  } else {
    console.log("✓ SMTP server is ready to send emails");
  }
});
