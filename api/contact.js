const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const maxRequestSize = 10_000;

module.exports = async function handler(req, res) {
  res.setHeader("Allow", "POST");

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed." });
  }

  if (!req.headers["content-type"]?.startsWith("application/json")) {
    return res.status(415).json({ error: "Content-Type must be application/json." });
  }

  const contentLength = Number(req.headers["content-length"] || 0);
  if (contentLength > maxRequestSize) {
    return res.status(413).json({ error: "Message is too large." });
  }

  const body = req.body;
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return res.status(400).json({ error: "Invalid form submission." });
  }

  if (typeof body.website === "string" && body.website.trim()) {
    return res.status(200).json({ success: true });
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const message = typeof body.message === "string" ? body.message.trim() : "";

  if (name.length < 2 || name.length > 100) {
    return res.status(400).json({ error: "Name must be between 2 and 100 characters." });
  }
  if (email.length > 254 || !emailPattern.test(email)) {
    return res.status(400).json({ error: "Enter a valid email address." });
  }
  if (message.length < 10 || message.length > 5_000) {
    return res.status(400).json({ error: "Message must be between 10 and 5,000 characters." });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.CONTACT_FROM_EMAIL;
  const to = process.env.CONTACT_TO_EMAIL || "sheenaponsica1125@gmail.com";
  if (!apiKey || !from) {
    console.error("Contact form is missing RESEND_API_KEY or CONTACT_FROM_EMAIL.");
    return res.status(503).json({ error: "The contact form is not configured yet. Please email me directly." });
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: email,
        subject: `Portfolio inquiry from ${name.replace(/[\r\n]/g, " ")}`,
        text: `Name: ${name}\nEmail: ${email}\n\n${message}`
      })
    });

    if (!response.ok) {
      console.error(`Resend rejected contact form email with status ${response.status}.`);
      return res.status(502).json({ error: "Your message could not be sent. Please email me directly." });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Contact form email delivery failed.", error);
    return res.status(502).json({ error: "Your message could not be sent. Please email me directly." });
  }
};
