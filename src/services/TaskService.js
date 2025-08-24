const pool = require('../config/database');

class TaskService {
    // Helper method to check if user exists
    static async _checkUserExists(userId) {
        const user = await pool.query(
            'SELECT user_id FROM users WHERE user_id = $1',
            [userId]
        );
        if (user.rows.length === 0) {
            throw new Error('INVALID_USER');
        }
    }

    // Create a new task
    static async createTask(taskData, userId) {
        await TaskService._checkUserExists(userId);
        
        const { title, description } = taskData;

        if (!title || typeof title !== 'string') {
            throw new Error('INVALID_TITLE');
        }
        if (description && typeof description !== 'string') {
            throw new Error('INVALID_DESCRIPTION');
        }

        const result = await pool.query(
            'INSERT INTO tasks (user_id, title, description) VALUES ($1, $2, $3) RETURNING task_id, title, created_at',
            [userId, title, description]
        );

        return result.rows[0];
    }

    // Get all tasks for a user // add filters = {} later
    static async getUserTasks(userId) {
        await TaskService._checkUserExists(userId);

        const result = await pool.query(
            'SELECT task_id, title, description, status, created_at FROM tasks WHERE user_id = $1',
            [userId]
        );

        return result.rows;
    }
    // Get single task by ID
    static async getTaskById(taskId, userId) {
        // Verify ownership, fetch task
        await TaskService._checkUserExists(userId);

        const result = await pool.query(
            'SELECT task_id, title, description, status, created_at FROM tasks WHERE task_id = $1 AND user_id = $2',
            [taskId, userId]
        );
        if (result.rows.length === 0) {
            throw new Error('TASK_NOT_FOUND');
        }
        return result.rows[0];
    }

    // Update existing task
    
    static async updateTask(taskId, status, userId) {
        TaskService._checkUserExists(userId);
        var newStatus = status.status
        if (!newStatus) {
            throw new Error('MISSING_STATUS');
        }
        newStatus = newStatus.toLowerCase()

        const validStatuses = ['waiting', 'in progress', 'completed'];
        if (!validStatuses.includes(newStatus)) {
            throw new Error('INVALID_STATUS');
        }
        const existingTask = await pool.query(
            'SELECT task_id FROM tasks WHERE user_id = $1 AND task_id = $2',
            [userId, taskId]
        );
        if (existingTask.rows.length === 0) {
            throw new Error('TASK_NOT_FOUND');
        }
        const result = await pool.query(
            'UPDATE tasks SET status = $1 WHERE task_id = $2 AND user_id = $3 RETURNING task_id, title, description, status',
            [newStatus, taskId, userId]
        );
        return result.rows[0];
    }
    

    // Delete task
    static async deleteTask(taskId, userId) {
        // Check ownership, soft/hard delete
        await TaskService._checkUserExists(userId);

        const existingTask = await pool.query(
            'SELECT task_id FROM tasks WHERE user_id = $1 AND task_id = $2',
            [userId, taskId]
        );
        if (existingTask.rows.length === 0) {
            throw new Error('TASK_NOT_FOUND');
        }
        const result = await pool.query(
            'DELETE FROM tasks WHERE task_id = $1 AND user_id = $2',
            [taskId, userId]
        );
        return {
            deleted: true,
            task: existingTask.rows[0],
            message: 'Task deleted successfully'
        };
    }
}

module.exports = TaskService;