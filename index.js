const express = require("express");
const bodyParser = require("body-parser");
const puppeteer = require("puppeteer");

const app = express();
app.use(bodyParser.json());

app.post("/", async (req, res) => {
  const { data } = req.body.json;

  console.info(`POST /: ${data}`);

  const browser = await puppeteer.launch();
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
