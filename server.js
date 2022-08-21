const express = require("express");
var cors = require('cors')
const mongoose = require("mongoose");


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
app.use("/auth", authRouter);
app.use("/post", postRouter);
app.use("/category", categoryRouter);

app.listen(8000);
