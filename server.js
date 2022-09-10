require('dotenv').config();
const express = require("express");
var cors = require('cors')
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
var morgan = require('morgan')

mongoose
    .connect(
        "mongodb+srv://asif:NidPbLiBZXcA2LlN@cluster0.4fnlhxn.mongodb.net/?retryWrites=true&w=majority",
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }
    )
    .then(async () => {
        console.log("Connected to MongoDB...");
    })

    .catch((err) => console.log("Could not connect to MongoDB...", err));

const authRouter = require("./routes/authRoutes");
const postRouter = require("./routes/postRoute");
const categoryRouter = require("./routes/categoryRoutes");
const app = express();
app.use(cors())

app.use(express.json());
app.use(morgan("dev"))
// app.use(express.urlencoded({ extended: false }))
app.use(express.static('public'))

app.use("/auth", authRouter);
// app.use(authenticateRequest);
app.use("/post", postRouter);
app.use("/category", categoryRouter);

app.listen(process.env.PORT || 8000);







function authenticateRequest(req, res, next) {
    const authHeaderInfo = req.headers.authorization;
    if (!authHeaderInfo) {
        return res.status(401).json({ msg: "No token provided" });
    }
    const token = authHeaderInfo.split(" ")[1];
    console.log(token);
    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        req.user = decoded;
        next();
    }
    catch (error) {
        console.log(error);

        res.send(401).send("Invalid token Provided")
    }



}
