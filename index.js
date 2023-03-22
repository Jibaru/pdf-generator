const express = require("express");
const bodyParser = require("body-parser");
const chromium = require("chrome-aws-lambda");

const app = express();
app.use(bodyParser.json());

app.post("/", async (req, res) => {
  const { data } = req.body.json;

  console.info(`POST /: ${data}`);

  const browser = await chromium.puppeteer.launch({
    args: [
      "--disable-dev-shm-usage",
      "--no-sandbox",
      "--headless",
      "--disable-gpu",
    ],
  });
  const page = await browser.newPage();

  await page.goto(data, { waitUntil: "networkidle2" });
  const pdf = await page.pdf();

  await browser.close();

  res.contentType("application/pdf");
  res.send(pdf);
});

const PORT = process.env.PORT || 3005;
app.listen(PORT, () => {
  console.log(`PDF Generator Listening ${PORT}`);
});
