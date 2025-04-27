const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
const PORT = 3000;
const SECRET_KEY = 'your-secret-key';

app.use(cors());
app.use(express.json());

// Ініціалізація бази даних
const db = new sqlite3.Database(':memory:', (err) => {
    if (err) {
        console.error('Database error:', err.message);
    } else {
        console.log('Connected to SQLite database');
        db.run(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            gender TEXT,
            dob TEXT
        )`);
        db.run(`CREATE TABLE IF NOT EXISTS alarms (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            userId INTEGER,
            time TEXT NOT NULL,
            date TEXT NOT NULL,
            triggered INTEGER DEFAULT 0,
            FOREIGN KEY (userId) REFERENCES users(id)
        )`, [], (err) => {
            if (err) console.error('Error creating alarms table:', err);
        });
    }
});

// Реєстрація
app.post('/api/register', async (req, res) => {
    const { name, email, password, gender, dob } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        db.run(
            `INSERT INTO users (name, email, password, gender, dob) VALUES (?, ?, ?, ?, ?)`,
            [name, email, hashedPassword, gender, dob],
            function (err) {
                if (err) {
                    console.error('Register error:', err.message);
                    return res.status(400).json({ error: 'Email already exists' });
                }
                console.log(`User registered: ${email}`);
                res.status(201).json({ message: 'User registered successfully' });
            }
        );
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Вхід
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    db.get(`SELECT * FROM users WHERE email = ?`, [email], async (err, user) => {
        if (err || !user) {
            console.error('Login error: User not found');
            return res.status(401).json({ error: 'Invalid email or password' });
        }
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            console.error('Login error: Invalid password');
            return res.status(401).json({ error: 'Invalid email or password' });
        }
        const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, { expiresIn: '1h' });
        console.log(`User logged in: ${email}, Token: ${token}`);
        res.json({ token, user: { id: user.id, name: user.name, email: user.email, gender: user.gender, dob: user.dob } });
    });
});

// Аутентифікація
const authenticate = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        console.error('Auth error: No token provided');
        return res.status(401).json({ error: 'No token provided' });
    }
    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        req.user = decoded;
        next();
    } catch (error) {
        console.error('Auth error: Invalid token', error);
        res.status(401).json({ error: 'Invalid token' });
    }
};

// Профіль
app.get('/api/profile', authenticate, (req, res) => {
    db.get(`SELECT id, name, email, gender, dob FROM users WHERE id = ?`, [req.user.id], (err, user) => {
        if (err || !user) {
            console.error('Profile error:', err || 'User not found');
            return res.status(404).json({ error: 'User not found' });
        }
        console.log(`Profile fetched for user ${req.user.id}`);
        res.json(user);
    });
});

// Додавання будильника
app.post('/api/alarms', authenticate, (req, res) => {
    const { time, date } = req.body;
    db.run(
        `INSERT INTO alarms (userId, time, date, triggered) VALUES (?, ?, ?, ?)`,
        [req.user.id, time, date, 0],
        function (err) {
            if (err) {
                console.error('Add alarm error:', err);
                return res.status(400).json({ error: 'Failed to add alarm' });
            }
            console.log(`Alarm added: id=${this.lastID}, userId=${req.user.id}, time=${time}, date=${date}, triggered=0`);
            res.status(201).json({ id: this.lastID, userId: req.user.id, time, date, triggered: 0 });
        }
    );
});

// Отримання будильників
app.get('/api/alarms', authenticate, (req, res) => {
    db.all(`SELECT * FROM alarms WHERE userId = ?`, [req.user.id], (err, alarms) => {
        if (err) {
            console.error('Fetch alarms error:', err);
            return res.status(500).json({ error: 'Failed to fetch alarms' });
        }
        console.log(`Fetched alarms for user ${req.user.id}:`, JSON.stringify(alarms, null, 2));
        res.json(alarms);
    });
});

// Видалення будильника
app.delete('/api/alarms/:id', authenticate, (req, res) => {
    const alarmId = req.params.id;
    db.run(`DELETE FROM alarms WHERE id = ? AND userId = ?`, [alarmId, req.user.id], function (err) {
        if (err || this.changes === 0) {
            console.error('Delete alarm error:', err || 'Alarm not found');
            return res.status(404).json({ error: 'Alarm not found' });
        }
        console.log(`Alarm deleted: id=${alarmId}, userId=${req.user.id}`);
        res.json({ message: 'Alarm deleted' });
    });
});

// Оновлення triggered
app.patch('/api/alarms/:id/triggered', authenticate, (req, res) => {
    const alarmId = req.params.id;
    const { triggered } = req.body;
    db.run(
        `UPDATE alarms SET triggered = ? WHERE id = ? AND userId = ?`,
        [triggered ? 1 : 0, alarmId, req.user.id],
        function (err) {
            if (err || this.changes === 0) {
                console.error('Update triggered error:', err || `Alarm not found: id=${alarmId}`);
                return res.status(404).json({ error: 'Alarm not found' });
            }
            console.log(`Alarm updated: id=${alarmId}, userId=${req.user.id}, triggered=${triggered ? 1 : 0}`);
            res.json({ message: 'Alarm updated' });
        }
    );
});

// Обробка помилок
app.use((err, req, res, next) => {
    console.error('Server error:', err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
