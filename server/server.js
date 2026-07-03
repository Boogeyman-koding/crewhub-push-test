const express = require("express");
const cors = require("cors");
const webpush = require("web-push");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("CrewHub server работает 🍻");
});

app.listen(3000, () => {
    console.log("CrewHub server запущен на порту 3000");
});