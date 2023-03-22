const express = require("express");
const bodyParser = require("body-parser");
const pdf = require("html-pdf");
const rp = require("request-promise");

const app = express();
app.use(bodyParser.json());

app.post("/", async (req, res) => {
  const { data } = req.body.json;

  console.info(`POST /: ${data}`);

  const html = await rp(data);

  pdf.create(html).toStream((err, stream) => {
    if (err) return res.sendStatus(500);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", 'attachment; filename="file.pdf"');

    stream.pipe(res);
  });
});

const PORT = process.env.PORT || 3005;
app.listen(PORT, () => {
  console.log(`PDF Generator Listening ${PORT}`);
});
