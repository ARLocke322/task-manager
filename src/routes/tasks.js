const express = require('express');
const router = express.Router();
const TaskController = require('../controllers/TaskController');

// Apply authentication middleware to all task routes
router.use((req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ success: false, error: 'AUTH_REQUIRED' });
    }

    const token = authHeader.split(' ')[1];
    const jwt = require('jsonwebtoken');
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        req.user = { id: decoded.userId, email: decoded.email };
        next();
    } catch (err) {
        return res.status(401).json({ success: false, error: 'INVALID_TOKEN' });
    }
});

router.post('/', TaskController.createTask);
router.get('/', TaskController.getUserTasks);
router.get('/:id', TaskController.getTaskById);
router.put('/:id', TaskController.updateTask);
router.delete('/:id', TaskController.deleteTask);

module.exports = router;