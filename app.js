const express = require("express");
const app = express();
const authRouter = require("./router/authRouter");
const databaseconnect = require("./config/databaseConfig");
const cookiesParser = require("cookie-parser");
const cors = require("cors");

app.use(express.json());
app.use(cookiesParser());
app.use(
  cors({
    origin: [process.env.CLIENT_URL],
    credentials:true,
  })
);

databaseconnect();

// Auth router
app.use("/api/auth", authRouter);

app.use("/", (req, res) => {
  res.status(200).json({ data: "JWTauth server ;)" });
});

module.exports = app;
