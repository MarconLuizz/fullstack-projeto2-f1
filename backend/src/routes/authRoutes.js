const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const User = require("../models/User");
const { sanitizeBody, preventNoSQLInjection } = require("./sanitizers");

const router = express.Router();

router.post(
  "/",
  preventNoSQLInjection,
  sanitizeBody,
  [
    body("username")
      .notEmpty()
      .withMessage("Username é obrigatório")
      .isLength({ min: 3, max: 50 })
      .withMessage("Username deve ter entre 3 e 50 caracteres")
      .matches(/^[a-zA-Z0-9_]+$/)
      .withMessage("Username deve conter apenas letras, números e underscore")
      .trim()
      .escape(),
    body("password")
      .notEmpty()
      .withMessage("Password é obrigatório")
      .isLength({ min: 6, max: 100 })
      .withMessage("Password deve ter entre 6 e 100 caracteres")
  ],
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
