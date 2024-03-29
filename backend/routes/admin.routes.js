const express = require("express");
const {
  adminLogin,
  createAdmin,
  getAdminProfile,
  updateAdminProfile,
} = require("../controllers/admin.controller");
const adminAuth = require("../Middleware/adminAuthMiddleware");
const router = express.Router();

router.post("/login", adminLogin);
router.get("/profile", adminAuth, getAdminProfile);
router.put("/profile", adminAuth, updateAdminProfile);
router.post("/create", createAdmin);

module.exports = router;
