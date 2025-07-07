require("dotenv").config();
const express = require("express");
const multer = require("multer");
const nodemailer = require("nodemailer");
const cors = require("cors");

const app = express();
const upload = multer(); // using memory storage by default

app.use(cors());
app.use(express.json());

app.post("/submit", upload.none(), async (req, res) => {
  const { name, email, whatsapp, follow_brandhypez, follow_adeline } = req.body;

  const message = `
    <h2>New WhatsApp Class Registration</h2>
    <p><strong>Name:</strong> ${name}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>WhatsApp:</strong> ${whatsapp}</p>
    <p><strong>Followed Brandhypez:</strong> ${
      follow_brandhypez ? "Yes" : "No"
    }</p>
    <p><strong>Followed Adeline:</strong> ${follow_adeline ? "Yes" : "No"}</p>
  `;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_FROM,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"Brandhypez Form" <${process.env.EMAIL_FROM}>`,
    to: process.env.EMAIL_TO,
    subject: "New WhatsApp Class Registration",
    html: message,
  };

  try {
    await transporter.sendMail(mailOptions);
    return res.status(200).json({ success: true }); // <-- frontend will handle redirect
  } catch (error) {
    console.error("Failed to send email:", error);
    return res.status(500).send("Something went wrong.");
  }
});

// Optional: root route
app.get("/", (req, res) => {
  res.send("Form backend is running!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on ${PORT}`));
