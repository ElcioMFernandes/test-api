const verifyToken = require("./firebase");

async function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split("Bearer ")[1];

  if (!token) {
    return res.status(401).json({ error: "Token ausente" });
  }

  const user = await verifyToken(token);

  if (!user) {
    return res.status(403).json({ error: "Token inválido" });
  }

  req.user = user; // Adiciona os dados do usuário na requisição
  next();
}

module.exports = authMiddleware;
