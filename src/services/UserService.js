const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../config/database');

class UserService {

    static async createUser(email, password) {
        const existingUser = await pool.query(
            'SELECT user_id FROM users WHERE email = $1',
            [email]
        );

        if (existingUser.rows.length > 0) {
            throw new Error('EMAIL_EXISTS');
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const result = await pool.query(
            'INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING user_id, email, created_at',
            [email, hashedPassword]
        );

        return result.rows[0];
    }
    static async authenticateUser(email, password) {
        const result = await pool.query(
            'SELECT user_id, email, password_hash FROM users WHERE email = $1',
            [email]
        );
        if (result.rows.length === 0) {
            throw new Error('INVALID_CREDENTIALS');
        }

        const user = result.rows[0];
        const validPassword = await bcrypt.compare(password, user.password_hash)

        if (!validPassword) {
            throw new Error('INVALID_CREDENTIALS');
        }

        const token = jwt.sign(
            { userId: user.user_id, email: user.email },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '24h' }
        );

        return {
            token,
            user: { user_id: user.user_id, email: user.email }
        };

    }
    static async getUserById(userId) {
        const result = await pool.query(
            'SELECT user_id, email, created_at FROM users WHERE user_id = $1',
            [userId]
        );
        if (result.rows.length === 0) {
            throw new Error('USER_NOT_FOUND')
        }
        return result.rows[0]
    }

    static async deleteUser(userId) {
        const existingUser = await pool.query(
            'SELECT user_id FROM users WHERE user_id = $1',
            [userId]
        );
        if (existingUser.rows.length === 0) {
            throw new Error('USER_NOT_FOUND');
        }
        const result = await pool.query(
            'DELETE FROM users WHERE user_id = $1',
            [userId]
        );
        return {
            deleted: true,
            user: existingUser.rows[0],
            message: 'User deleted successfully'
        };
    }

    static async getUserByEmail(email) {
        const result = await pool.query(
            'SELECT user_id, email, created_at FROM users WHERE email = $1',
            [email]
        );
        if (result.rows.length === 0) {
            throw new Error('USER_NOT_FOUND')
        }
        return result.rows[0]
    }

    // update user email or password

}

module.exports = UserService;