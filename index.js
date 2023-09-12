const express = require("express");
const bodyParser = require("body-parser");
const chromium = require("chrome-aws-lambda");

const isValidUrl = (url) => {
  try {
    const parsedUrl = new URL(url);
    return parsedUrl.protocol === "http:" || parsedUrl.protocol === "https:";
  } catch (error) {
    return false;
  }
};

const app = express();
app.use(bodyParser.json());

app.post("/", async (req, res) => {
  const body = req.body;
  const timestamp = new Date().getTime();

  if (!body.data) {
    const errorMessage =
      'No information provided in json format { "data": "url" }';
    console.error(`[${timestamp}] ${errorMessage}`);
    res.status(400);
    res.send(errorMessage);
    return;
  }

  const { data } = body;

  if (!isValidUrl(data)) {
    const errorMessage = `The URL provided "${data}" is not valid`;
    console.error(`[${timestamp}] ${errorMessage}`);
    res.status(400);
    res.send(errorMessage);
    return;
  }

  console.info(`[${timestamp}] URL accepted "${data}"`);

  try {
    const browser = await chromium.puppeteer.launch({
      args: [...chromium.args, "--hide-scrollbars", "--disable-web-security"],
      defaultViewport: chromium.defaultViewport,
      executablePath: "/usr/bin/google-chrome",
      headless: true,
      ignoreHTTPSErrors: true,
    });
    const page = await browser.newPage();

    await page.goto(data, { waitUntil: "networkidle2" });
    const pdf = await page.pdf();

    await browser.close();

    res.contentType("application/pdf");
    res.send(pdf);
    return;
  } catch (error) {
    const errorMessage = `The URL "${data}" not responds or does not exists`;
    console.error(`[${timestamp}] ${errorMessage}`);
    console.error(`[${timestamp}] Exception "${error.message}"`);
    res.status(400);
    res.send(errorMessage);
    return;
  }
});

const PORT = process.env.PORT || 3005;
app.listen(PORT, () => {
  console.log(`PDF Generator listening on: http://localhost:${PORT}`);
});
