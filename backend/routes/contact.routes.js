const express = require("express");
const {
  postMessage,
  getMessages,
} = require("../controllers/contact.controller");
const adminAuth = require("../Middleware/adminAuthMiddleware");
const router = express.Router();

router.post("/", postMessage);
router.get("/", adminAuth, getMessages);

module.exports = router;
