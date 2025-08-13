const express = require('express');
const router = express.Router();
const { verifyToken } = require("../middleware/AuthMiddleware");
const { register, login, deleteUser,updateUsername,getCurrentUser } = require("../controllers/AuthControllers");

router.post('/register', register);
router.post('/login', login);
router.delete('/users/:username', deleteUser);
router.put('/username', updateUsername);
router.get('/me', verifyToken, getCurrentUser);
module.exports = router;
