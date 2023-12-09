const express = require("express");
const app = express();
const path = require("path");
const priceRouter = require("./routes/price-page");
const formRouter = require("./routes/form");
const { dbConnect } = require("./conn");
require("dotenv").config();
const PORT = process.env.PORT || 4003;
app.use(express.static("public"));
app.use(express.static("uploads"));

(async () => await dbConnect())()

app.use(express.urlencoded({extended: false}));
app.set("view engine","ejs");
app.set("views",path.resolve("./views"));
app.use("/price-page",priceRouter);
app.use("/form",formRouter);

app.get("*",(req,res,next) => {
    return res.status(404).render("404Page");
})

app.listen(PORT, () => {
    console.log(`Server running at PORT:${PORT}`);
});