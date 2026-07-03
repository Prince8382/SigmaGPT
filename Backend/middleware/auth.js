import jwt from "jsonwebtoken";

export default function auth(req, res, next) {
  let token = req.headers.authorization;

  if (!token) return res.status(401).json({ error: "No token" });

  if (token.startsWith("Bearer ")) {
    token = token.split(" ")[1];
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // contains userId
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
}
