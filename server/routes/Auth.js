const express = require('express');
const router = express.Router();
const { verifyToken } = require("../middleware/AuthMiddleware");
const { register, login, deleteUser,updateUsername,getCurrentUser,getAllUsers,deleteUserById,updateUsernameById } = require("../controllers/AuthControllers");

router.post('/register', register);
router.post('/login', login);
router.delete('/users/by-username/:username', deleteUser);
router.put('/username', updateUsername);
router.get('/me', verifyToken, getCurrentUser);
router.get("/users", verifyToken, getAllUsers);
router.delete("/users/:id", verifyToken, deleteUserById);
router.put("/users/:id", verifyToken, updateUsernameById);

module.exports = router;
