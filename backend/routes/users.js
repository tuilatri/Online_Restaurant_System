const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/', userController.getAllUsers);
router.get('/:phone', userController.getUserByPhone);
router.post('/', userController.createUser);
router.put('/:phone', userController.updateUser);
router.delete('/:phone', userController.deleteUser);

module.exports = router;