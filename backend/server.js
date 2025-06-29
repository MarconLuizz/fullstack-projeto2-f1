require("dotenv").config();
const express = require("express");
const connectDB = require("./src/config/db");
const authRoutes = require("./src/routes/authRoutes");
const seasonRoutes = require("./src/routes/seasonRoutes");
const cors = require("cors");
const morgan = require("morgan");
const compression = require("compression");
const helmet = require("helmet");
const apicache = require("apicache");

const app = express();

// Conexão com o DB
connectDB();

// Middlewares
let cache = apicache.middleware;
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use(compression());
app.use(helmet());

// Routes (Rotas)
app.use("/api/login", authRoutes);
app.use("/api/seasons", seasonRoutes);

// Inicialização do server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
