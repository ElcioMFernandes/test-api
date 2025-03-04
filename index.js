const express = require("express");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// Configurar Prisma Client
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "API rodando no Render!" });
});

// Rota para testar a conexão com o banco
app.get("/db-test", async (req, res) => {
  try {
    const result = await prisma.$queryRaw`SELECT NOW()`; // Consulta simples
    res.json({ message: "Banco conectado!", time: result[0].now });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erro ao conectar ao banco", details: error });
  }
});

// Rota para criar um usuário
app.post("/users", async (req, res) => {
  const { email, name } = req.body;
  try {
    const user = await prisma.user.create({
      data: {
        email,
        name,
      },
    });
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar usuário", details: error });
  }
});

// Rota para buscar todos os usuários
app.get("/users", async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar usuários", details: error });
  }
});

// Rota para atualizar um usuário
app.put("/users/:id", async (req, res) => {
  const { id } = req.params;
  const { email, name } = req.body;
  try {
    const user = await prisma.user.update({
      where: { id: parseInt(id) },
      data: { email, name },
    });
    res.json(user);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erro ao atualizar usuário", details: error });
  }
});

// Rota para deletar um usuário
app.delete("/users/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.user.delete({
      where: { id: parseInt(id) },
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Erro ao deletar usuário", details: error });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
