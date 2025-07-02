const express = require("express");
const { body, query, validationResult } = require("express-validator");
const Season = require("../models/Season");
const auth = require("./auth");
const apicache = require("apicache");
const { sanitizeBody, sanitizeQuery, preventNoSQLInjection } = require("./sanitizers");
const { seasonsCacheMiddleware, invalidateCache } = require("./cacheManager");

const router = express.Router();

const cache = apicache.middleware;
const FIVE_MINUTES = "5 minutes";

router.get("/", auth, preventNoSQLInjection, sanitizeQuery, [
  query("year")
    .optional()
    .isInt({ min: 1950, max: new Date().getFullYear() + 1 })
    .withMessage("Ano deve ser um número inteiro entre 1950 e o próximo ano")
    .toInt(),
  query("champion")
    .optional()
    .isLength({ min: 1, max: 100 })
    .withMessage("Nome do campeão deve ter entre 1 e 100 caracteres")
    .trim()
    .escape(),
  query("team")
    .optional()
    .isLength({ min: 1, max: 100 })
    .withMessage("Nome da equipe deve ter entre 1 e 100 caracteres")
    .trim()
    .escape()
], seasonsCacheMiddleware, cache(FIVE_MINUTES), async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { year, champion, team } = req.query;
    const searchFilter = {};

    if (year) searchFilter.year = year;
    if (champion) searchFilter.champion = { $regex: champion, $options: "i" };
    if (team) searchFilter.team = { $regex: team, $options: "i" };

    const seasons = await Season.find(searchFilter).sort({ year: -1 });
    res.json(seasons);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

router.post(
  "/",
  auth,
  preventNoSQLInjection,
  sanitizeBody,
  [
    body("year")
      .notEmpty()
      .withMessage("Ano é obrigatório")
      .isInt({ min: 1950, max: new Date().getFullYear() + 1 })
      .withMessage("Ano deve ser um número inteiro entre 1950 e o próximo ano")
      .toInt(),
    body("champion")
      .notEmpty()
      .withMessage("Campeão é obrigatório")
      .isLength({ min: 1, max: 100 })
      .withMessage("Nome do campeão deve ter entre 1 e 100 caracteres")
      .matches(/^[a-zA-ZÀ-ÿ\s\-'\.]+$/)
      .withMessage("Nome do campeão deve conter apenas letras, espaços, hífens, apostrofes e pontos")
      .trim()
      .escape(),
    body("team")
      .notEmpty()
      .withMessage("Equipe é obrigatória")
      .isLength({ min: 1, max: 100 })
      .withMessage("Nome da equipe deve ter entre 1 e 100 caracteres")
      .matches(/^[a-zA-ZÀ-ÿ\s\-'\.0-9]+$/)
      .withMessage("Nome da equipe deve conter apenas letras, números, espaços, hífens, apostrofes e pontos")
      .trim()
      .escape(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { year, champion, team } = req.body;

    try {
      const existingSeason = await Season.findOne({ year });
      if (existingSeason) {
        return res.status(400).json({ msg: "Temporada já existe" });
      }

      const season = new Season({ year, champion, team });
      await season.save();

      apicache.clear("/api/seasons");

      invalidateCache("seasons");

      res.status(201).json(season);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

module.exports = router;
