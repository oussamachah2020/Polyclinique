const express = require("express");
const adminAuth = require("../Middleware/adminAuthMiddleware");
const { getStats } = require("../controllers/stats.controller");

const router = express.Router();

router.get("/", adminAuth, getStats);

module.exports = router;
