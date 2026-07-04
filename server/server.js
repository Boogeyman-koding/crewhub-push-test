const express = require("express");
const cors = require("cors");
const webpush = require("web-push");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const VAPID_PUBLIC_KEY = "BNpCrzDAeasD94P_7AaClH1zVw9YKH8Nk-fRHj9enoUkUfeUep3x1xe3wiylc7B1GQksqfGxYiAKD7Sm20583QM";
const VAPID_PRIVATE_KEY = "Td4yf4mzR2fH6cbyv7-RK5bOUj6k4WM2Ufw8RbIAtig";

webpush.setVapidDetails(
  "mailto:test@crewhub.ru",
  VAPID_PUBLIC_KEY,
  VAPID_PRIVATE_KEY
);

global.subscriptions = global.subscriptions || [];

app.get("/public-key", (req, res) => {
  res.json({ publicKey: VAPID_PUBLIC_KEY });
});

app.post("/subscribe", (req, res) => {
  global.subscriptions.push(req.body);
  res.json({ ok: true, count: global.subscriptions.length });
});

app.post("/send", async (req, res) => {
  const payload = JSON.stringify({
    title: "CrewHub",
    body: req.body.message || "Тестовое уведомление"
  });

  const results = [];

  for (const sub of global.subscriptions) {
    try {
      await webpush.sendNotification(sub, payload);
      results.push({ ok: true });
    } catch (e) {
      results.push({ ok: false, error: e.message });
    }
  }

  res.json({
    sent: results.length,
    results
  });
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

module.exports = app;