const TaskService = require('../services/TaskService')

class TaskController {
    // Create a new task
    static async createTask(req, res) {
        try {
            const taskData = req.body;
            const userId = req.user.id

            const task = await TaskService.createTask(taskData, userId);

            res.status(201).json({
                success: true,
                data: task
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                error: error.message
            });
        }
    }

    // Get all tasks for a user // filters = {} to be added later
    static async getUserTasks(req, res) {
        try {
            const userId = req.user.id; // Assuming user ID is set in req.user by auth middleware
            const tasks = await TaskService.getUserTasks(userId);
            res.status(200).json({
                success: true,
                data: tasks
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                error: error.message
            });
        }
    }
    // Get single task by ID
    static async getTaskById(req, res) {
        // Verify ownership, fetch task
        try {
            const userId = req.user.id; // Assuming user ID is set in req.user by auth middleware
            const taskId = req.params.id;
            const task = await TaskService.getTaskById(taskId, userId);
            if (!task) {
                return res.status(404).json({
                    success: false,
                    error: 'TASK_NOT_FOUND'
                });
            }
            res.status(200).json({
                success: true,
                data: task
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                error: error.message
            });
        }
    }

    // Update existing task
    static async updateTask(req, res) {
        // Validate, check ownership, update
        try {
            const userId = req.user.id;
            const taskId = req.params.id;
            const updateData = req.body;
            const task = await TaskService.updateTask(taskId, updateData, userId);
            if (!task) {
                return res.status(404).json({
                    success: false,
                    error: 'TASK_NOT_FOUND'
                });
            }
            res.status(200).json({
                success: true,
                data: task
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                error: error.message
            });
        }
    }

    // Delete task
    static async deleteTask(req, res) {
        // Check ownership, soft/hard delete
        try {
            const userId = req.user.id;
            const taskId = req.params.id;
            const task = await TaskService.deleteTask(taskId, userId);
            if (!task) {
                return res.status(404).json({
                    success: false,
                    error: 'TASK_NOT_FOUND'
                });
            }
            res.status(200).json({
                success: true,
                data: task
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                error: error.message
            });
        }
    }
}

module.exports = TaskController;