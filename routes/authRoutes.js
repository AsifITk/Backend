const express = require("express");
const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");

const router = express.Router();

router.post("/signup", async (req, res) => {
    const { name, email, password, confirmPassword } = req.body;
    if (!email || !password || !name || !confirmPassword) {
        return res.status(400).json({ msg: "Please fill all fields" });
    } else if (password !== confirmPassword) {
        return res.status(400).json({ msg: "Passwords do not match" });
    }

    const existingUser = await userModel.findOne({ email: email });
    if (existingUser) {
        return res.status(400).json({ msg: "User already exists" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    console.log(hashedPassword);
    const newUser = new userModel({
        name: name,
        email: email,
        password: hashedPassword,
    });

    await newUser.save((err, user) => {
        if (err) {
            console.log(err);
        } else {
            console.log(user);
        }
    });

    console.log(req.body);
    res.send("signup");
});

router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ msg: "Please fill all fields" });
    }
    const user = await userModel.findOne({ email: email });
    if (!user) {
        return res.status(400).json({ msg: "User does not exist" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(400).json({ msg: "Invalid credentials" });
    }
    res.send("logged in");
});

module.exports = router;
