const express = require('express');
const router = express.Router();
const { verifyToken,verifyAdmin } = require("../middleware/AuthMiddleware");
const { register, login, deleteUser,updateUsername,getCurrentUser,getAllUsers,deleteUserById,updateUsernameById,getEmailByUsername,getUserNameByEmail,logout,updateUserRole } = require("../controllers/AuthControllers");

router.post('/register', register);
router.post('/login', login);
router.delete('/users/by-username/:username', deleteUser);
router.put('/username', updateUsername);
router.get('/me', verifyToken, getCurrentUser);
router.get("/users", verifyToken, getAllUsers);
router.delete("/users/:id", verifyToken, deleteUserById);
router.put("/users/:id", verifyToken, updateUsernameById);
router.put("/users/:id/role", verifyToken, updateUserRole);
 router.get("/email/:username", getEmailByUsername)
 router.get("/bla/:email", getUserNameByEmail)
 router.get('/users', verifyToken, verifyAdmin, getAllUsers);
router.post("/logout", logout);

module.exports = router;
