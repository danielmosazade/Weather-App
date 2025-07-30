const express = require('express');
const router = express.Router();
const { register, login, deleteUser } = require("../controllers/AuthControllers");

router.post('/register', register);
router.post('/login', login);
router.delete('/users/:username', deleteUser);

module.exports = router;
