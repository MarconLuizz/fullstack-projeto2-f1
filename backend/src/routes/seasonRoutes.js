// backend/src/routes/seasonRoutes.js
const express = require("express");
const { body, validationResult } = require("express-validator");
const Season = require("../models/Season");
const auth = require("./auth");
const apicache = require("apicache");

const router = express.Router();

const cache = apicache.middleware;
const FIVE_MINUTES = "5 minutes";

// Listagem de seasons: GET /api/seasons
router.get("/", auth, cache(FIVE_MINUTES), async (req, res) => {
  try {
    const seasons = await Season.find();
    res.json(seasons);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Pesquisar com filtros: GET /api/seasons/search
router.get("/search", auth, cache(FIVE_MINUTES), async (req, res) => {
  try {
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

// Criar nova season: POST /api/seasons
router.post(
  "/",
  auth,
  [
    body("year").notEmpty().withMessage("Ano é obrigatório"),
    body("champion").notEmpty().withMessage("Campeão é obrigatório"),
    body("team").notEmpty().withMessage("Equipe é obrigatória"),
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
      apicache.clear("/api/seasons/search");

      res.status(201).json(season);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

module.exports = router;
