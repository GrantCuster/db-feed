export default async (req, res) => {
  const { password } = req.body;
  if (password === process.env.PASSWORD) {
    res.status = 200;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({}));
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
};
