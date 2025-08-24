const UserService = require('../services/UserService');
class UserController {
    // Register a new user
    static async register(req, res) {
        try {
            const { email, password } = req.body;
            const user = await UserService.createUser(email, password);
            res.status(201).json({
                success: true,
                data: user
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                error: error.message
            });
        }
    }

    // Login user
    static async login(req, res) {
        try {
            const { email, password } = req.body;
            const authData = await UserService.authenticateUser(email, password);
            res.status(200).json({
                success: true,
                data: authData
            });
        } catch (error) {
            res.status(401).json({
                success: false,
                error: error.message
            });
        }
    }

    // Get user profile
    static async getProfile(req, res) {
        try {
            const userId = req.user.id; // Assuming user ID is set in req.user by auth middleware
            const user = await UserService.getUserById(userId);
            if (!user) {
                return res.status(404).json({
                    success: false,
                    error: 'USER_NOT_FOUND'
                });
            }
            res.status(200).json({
                success: true,
                data: user
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                error: error.message
            });
        }
    }
}

module.exports = UserController;