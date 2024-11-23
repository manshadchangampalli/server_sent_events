import express from "express";
import { dirname } from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(
  import.meta?.url
);

const __dirname = dirname(__filename);
const app = express();

app.get("/", (req, res) => {
  res.sendFile(
    __dirname + "/index.html"
  );
});

app.get("/sse", (req, res) => {
  console.log("entering");
  res.writeHead(200, {
    "Cache-Control": "no-cache",
    "Content-Type": "text/event-stream",
    Connection: "keep-alive",
  });
  sendEvents(res, req, 100);
});

// we are using double /n for saying the message is ended ; so client can understand that
function sendEvents(res, req, count) {
  let interval;
  res.write(
    "data: this is the event , number is :" +
      count +
      "\n\n"
  );
  interval = setInterval(() => {
    count--;
    if (count === 0) {
      res.end();
      return;
    }
    req.on("close", () => {
      clearInterval(interval);
    });
    res.write(
      "data: this is the event , number is :" +
        count +
        "\n\n"
    );
  }, 1000);
}

app.listen(8080, () => {
  console.log(
    "Server is running on port 8080"
  );
});
