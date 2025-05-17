import express from 'express';
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
// import { authenticateToken } from './middleware/auth.js';
import { signupLimiter, deleteUserLimiter } from '../middleware/rate_limiter.js';
const router = express.Router();

/**
 * Authentication Endpoints
 */
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    
    console.log('Login request received:', req.body);
    
    console.log(`Username: ${username}, Password: ${password}`);

    try {
        // Check For an Admin Login
        if ( username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
            const token = jwt.sign({ username }, process.env.JWT_SECRET_KEY, { expiresIn: '24h'});
            res.cookie('token', token, { httpOnly: true});
            res.json({ success: true });
        } 

        // Check for A Regular Login by checking Database
        const result = await req.pgClient.query(`SELECT user_id, username, password_hash
                                                FROM users WHERE username = $1
                                            `, [username]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, error: 'Username does not exist'})
        }

        // Check password by unecrypting the users password_hash
        const user = result.rows[0];
        const passwordMatch = await bcrypt.compare(password, user.password_hash);

        console.log(user);
        console.log(passwordMatch)

        if (passwordMatch) {
            const token = jwt.sign({ username }, process.env.JWT_SECRET_KEY, { expiresIn: '24h'});
            res.cookie('token', token, { httpOnly: true});
            res.json({ success: true });
        } else { 
            console.log(passwordMatch);
            res.status(401).json({ success: false });
        }
    } catch(error) {
        console.log('Error Logging In');
        res.status(500).json({ error: 'Server Error' });
    }
})

router.post('/signup', signupLimiter, async (req, res) => {
    const { username, password } = req.body;

    console.log('Signup Request Recieved: ', req.body);
    console.log(`Username: ${username}, Password: ${password}`);

    // Check If username or password exist in the database
    try {
        const userExists = await req.pgClient.query(`SELECT username 
                                                    FROM users 
                                                    WHERE username = $1`, [username]);
        if (userExists.rows.length > 0) {
            return res.status(400).json({ error: 'Username already exists'});
        }

        // Hashing with bcrypt
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);

        await req.pgClient.query(`INSERT INTO users (username, password_hash) VALUES ($1, $2)
                                `, [username, passwordHash]);
        
        res.status(201).json({ message: 'User successfully created'})

    } catch (error) {
        console.log('Error Signing Up: ', error);
        res.status(500).json({ error: 'Server Error' });
    }
})

router.delete('/user_id', deleteUserLimiter, async(req, res) => {
    try {
        const { username } = req.params;
        const query = `DELETE FROM users WHERE usename = $1`

        await req.pgClient.query(query, [username]);
        res.status(201).json({ message: 'User successfully deleted'})
    } catch (error) {
        console.log('Error Deleting User: ', error);
        res.status(500).json({ error: 'Server Error' });
    }
})

export default router;