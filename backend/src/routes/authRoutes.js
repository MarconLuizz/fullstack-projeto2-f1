const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const User = require("../models/User");

const router = express.Router();

// Rota do post de login: /api/login
router.post(
  "/",
  [body("username").notEmpty(), body("password").notEmpty()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const { username, password } = req.body;
    try {
      const user = await User.findOne({ username });
      if (!user) return res.status(400).json({ msg: "Usuário não encontrado" });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ msg: "Senha incorreta" });

      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "2h",
      });
      res.json({ token });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

module.exports = router;
