import express from 'express'
import getDbConnection from '../config/db.js';
import cors from "cors"
import bodyParser from 'body-parser'
import mysql from "mysql2/promise"

const app = express()
const port = 3000

// Middleware
app.use(cors())
app.use(express.json())
app.use(bodyParser.json())

// Initialize database connection
let db;
try {
  db = await getDbConnection();
  console.log('Database connection established successfully');
} catch (error) {
  console.error('Failed to connect to database:', error);
  process.exit(1);
}

// Test route
app.get('/test', (req, res) => {
  res.json({ message: 'Server is running' });
});

app.post('/', (req, res) => {
    console.log(req.body)
    const { username, password } = req.body; // Extract username and password
    console.log(`Username: ${username}, Password: ${password}`);

  res.send('Hello World!')
})

app.post('/register', async (req, res) => {
  try {
    console.log('Registration request received:', req.body);
    const { name, email, password } = req.body;
    
    if (!name || !email || !password) {
      console.log('Missing fields in registration request');
      return res.status(400).json({ message: 'All fields are required' });
    }

    const [existingUsers] = await db.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (existingUsers.length > 0) {
      console.log('User already exists:', email);
      return res.status(400).json({ message: 'User already exists' });
    }

    const [result] = await db.execute(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [name, email, password]
    );

    console.log('User registered successfully:', email);
    res.status(201).json({ 
      message: 'Registration successful',
      userId: result.insertId 
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

app.post('/login', async (req, res) => {
  try {
    console.log('Login request received:', req.body);
    const { email, password } = req.body;
    
    if (!email || !password) {
      console.log('Missing fields in login request');
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const [users] = await db.execute(
      'SELECT * FROM users WHERE email = ? AND password = ?',
      [email, password]
    );

    if (users.length === 0) {
      console.log('Invalid login attempt:', email);
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const user = users[0];
    console.log('User logged in successfully:', email);
    res.json({ 
      message: 'Login successful',
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      },
      
    });
    res.redirect('./propertys/index.html');
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log(`Test the server at http://localhost:${port}/test`);
});
 