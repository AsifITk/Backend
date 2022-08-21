const express = require("express");
const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const { jsx } = require("@emotion/react");

const router = express.Router();

router.post("/signup", async (req, res) => {
    const { name, email, password, } = req.body;
    console.log(name, email, password);
    if (!email || !password || !name) {
        return res.status(400).json({ msg: "Please fill all fields" });
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
    let sendUser = { ...newUser }
    delete sendUser._doc.password;

    res.send({
        msg: "User created",
        user: sendUser


    });
});

router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    console.log(email, password);
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
    let sendUser = { ...user }
    delete sendUser._doc.password;
    res.send({
        msg: "login",
        user: sendUser,
    });
});

module.exports = router;
