const express = require("express");
const router = express.Router();
const Users = require("../models/User");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const jwt_decode = require("jwt-decode");

const JWT_SECRET = "certmanjwtsecret";

const nodemailer = require("nodemailer");

router.get("/", (req, res) => {
  try {
    res.json({ message: "Welcome to user" });
  } catch (err) {
    console.log(err);

    res.json({ message: err });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || typeof email !== "string" || email.indexOf("@") == -1) {
    return res.json({ status: "email error", error: "Enter a valid email id" });
  }
  if (!password || typeof password !== "string") {
    return res.json({ status: "pass error", error: "Enter a valid password" });
  }

  const user = await Users.findOne({ email }).lean();

  if (!user) {
    return res.json({
      status: "email error",
      error: "User does not exist!",
      data: "",
    });
  } else {
    if (await bcrypt.compare(password, user.password)) {
      const token = jwt.sign(
        {
          _id: user._id,
          name: user.name,
          email: user.email,
          todos: user.todos,
        },
        JWT_SECRET
      );
      var payload = jwt_decode(token);

      return res.json({ status: "success", error: "", data: payload });
    } else {
      return res.json({
        status: "pass error",
        error: "Incorrect Password",
        data: "",
      });
    }
  }
});
router.post("/signup", async (req, res) => {
  const { name, email, password: plainTextPassword } = req.body;
  const password = await bcrypt.hash(plainTextPassword, 10);

  try {
    if (!name || typeof name !== "string") {
      return res.json({ status: "name error", error: "Enter a valid name" });
    }
    if (!email || typeof email !== "string" || email.indexOf("@") == -1) {
      return res.json({ status: "email error", error: "Enter a valid email" });
    }

    if (!plainTextPassword || typeof plainTextPassword !== "string") {
      return res.json({ status: "pass error", error: "Enter Password" });
    }
    if (plainTextPassword.length < 6) {
      return res.json({
        status: "pass error",
        error: "Password should be atleast 6 characters long.",
      });
    }
    const response = await Users.create({
      name,
      email,
      password,
    });
    const user = {
      name,
      email,
    };
    return res.json({ status: "success", error: "", data: user });
  } catch (error) {
    console.log(error);
    if ((error.code = 11000)) {
      return res.json({
        status: "email error",
        error: "Email ID already used.",
      });
    }
    throw error;
  }
});

router.post("/update", async (req, res) => {
  const { updatedTodos, id } = req.body;
  Users.findByIdAndUpdate(id, { todos: updatedTodos }, function (err, docs) {
    if (err) {
      console.log(err);
    } else {
      res.json(docs)
    }
  });
});


router.post("/get", async (req, res) => {
  const  {email}  = req.body;
  console.log(email)
  const user = await Users.findOne({ email }).lean();
res.json(user)
});

module.exports = router;
