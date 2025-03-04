const express = require("express");
const cors = require("cors");
const { Client } = require("pg");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// Configurar conexão com PostgreSQL
const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Necessário para conexões remotas no Render
  },
});

// Testar conexão ao iniciar a API
client
  .connect()
  .then(() => console.log("Conectado ao PostgreSQL!"))
  .catch((err) => console.error("Erro ao conectar ao PostgreSQL:", err));

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "API rodando no Render!" });
});

// Rota para testar a conexão com o banco
app.get("/db-test", async (req, res) => {
  try {
    const result = await client.query("SELECT NOW()"); // Consulta simples
    res.json({ message: "Banco conectado!", time: result.rows[0].now });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erro ao conectar ao banco", details: error });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
