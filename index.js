require("dotenv").config();
const express = require("express");

const app = express();
app.use(express.json());

const OFFICIAL_EMAIL = "rishu1350.be23@chitkara.edu.in";

function generateFibonacci(n) 
{
  if (!Number.isInteger(n) || n <= 0) return [];
  const seq = [0];
  if (n === 1) return seq;
  seq.push(1);
  while (seq.length < n) seq.push(seq[seq.length - 1] + seq[seq.length - 2]);
  return seq;
}

function isPrime(n) 
{
  if (!Number.isInteger(n) || n <= 1) return false;
  if (n <= 3) return true;
  if (n % 2 === 0) return false;
  for (let i = 3; i * i <= n; i += 2) if (n % i === 0) return false;
  return true;
}

function primesFromList(arr) 
{
  if (!Array.isArray(arr)) return [];
  return arr.filter((x) => Number.isInteger(x) && isPrime(x));
}

function gcd(a, b) 
{
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) {
    const t = b;
    b = a % b;
    a = t;
  }
  return a;
}

function lcm(a, b) 
{
  if (a === 0 || b === 0) return 0;
  return Math.abs((a / gcd(a, b)) * b);
}

function gcdList(arr) 
{
  if (!Array.isArray(arr) || arr.length === 0) return 0;
  return arr.reduce((acc, v) => gcd(acc, v));
}

function lcmList(arr) 
{
  if (!Array.isArray(arr) || arr.length === 0) return 0;
  return arr.reduce((acc, v) => lcm(acc, v));
}

app.get("/health", (req, res) => {
  res.json({ is_success: true, official_email: OFFICIAL_EMAIL });
});

app.post("/bfhl", async (req, res) => {
  const payload = req.body;
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) 
{
    return res
      .status(400)
      .json({ is_success: false, error: "JSON object required" });
  }

  const keys = Object.keys(payload);
  if (keys.length !== 1) {
    return res
      .status(400)
      .json({ is_success: false, error: "Exactly one key required" });
  }

  const key = keys[0].trim();
  const value = payload[keys[0]];
  const allowed = new Set(["fibonacci", "prime", "lcm", "hcf", "AI"]);
  if (!allowed.has(key)) {
    return res
      .status(400)
      .json({ is_success: false, error: `Unsupported key '${key}'` });
  }

  try {
    let data;
    if (key === "fibonacci") {
      if (!Number.isInteger(value))
        return res.status(400).json({
          is_success: false,
          error: "fibonacci value must be integer",
        });
      data = generateFibonacci(value);
    } 
    else if (key === "prime") {
      if (!Array.isArray(value))
        return res.status(400).json({
          is_success: false,
          error: "prime value must be integer array",
        });
      data = primesFromList(value);
    } 
    else if (key === "lcm") {
      if (!Array.isArray(value) || !value.every((x) => Number.isInteger(x)))
        return res.status(400).json({
          is_success: false,
          error: "lcm value must be integer array",
        });
      data = lcmList(value);
    } 
    else if (key === "hcf") {
      if (!Array.isArray(value) || !value.every((x) => Number.isInteger(x)))
        return res.status(400).json({
          is_success: false,
          error: "hcf value must be integer array",
        });
      data = gcdList(value);
    } 
    else if (key === "AI") {
      if (typeof value !== "string")
        return res.status(400).json({
          is_success: false,
          error: "AI value must be a question string",
        });

      // Placeholder for AI (add real Google AI when API key is properly configured)
      data = { answer: `Echo: ${value}` };
    } 
    else {
      return res
        .status(400)
        .json({ is_success: false, error: "Unsupported operation" });
    }

    return res
      .status(200)
      .json({ is_success: true, official_email: OFFICIAL_EMAIL, data });
  } catch (err) {
    return res.status(500).json({ is_success: false, error: String(err) });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`BFHL API listening on port ${PORT}`);
});
