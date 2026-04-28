const express = require("express");
const cors = require("cors");
const profile = require("./data/profile");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Core Profile API",
    endpoints: {
      profile: "/api/profile",
      profileSection: "/api/profile/:section"
    }
  });
});

app.get("/api/profile", (req, res) => {
  res.json({
    success: true,
    data: profile
  });
});

app.get("/api/profile/:section", (req, res) => {
  const { section } = req.params;
  const sectionAliases = {
    backgrond: "background"
  };
  const normalizedSection = sectionAliases[section] || section;
  const sectionData = profile[normalizedSection];

  if (!sectionData) {
    return res.status(404).json({
      success: false,
      message: `Profile section '${section}' not found`,
      availableSections: Object.keys(profile)
    });
  }

  res.json({
    success: true,
    section: normalizedSection,
    data: sectionData
  });
});

app.listen(PORT, () => {
  console.log(`API server running at http://localhost:${PORT}`);
});
