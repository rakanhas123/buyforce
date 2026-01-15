import "dotenv/config";
import express from "express";

const app = express();

app.get("/test", (req, res) => {
  console.log("Test endpoint hit!");
  res.json({ message: "Hello World!" });
});

const port = 3000;
app.listen(port, "0.0.0.0", () => {
  console.log(`Test server running on http://0.0.0.0:${port}`);
});
