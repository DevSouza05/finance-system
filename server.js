require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const pool = require('./db');

const app = express();
const PORT = 3000;
const JWT_SECRET = process.env.JWT_SECRET;

app.use(bodyParser.json());
app.use(express.static(__dirname));

// ✅ Testa conexão e cria tabela
async function createUsersTable() {
    let connection;
    try {
        connection = await pool.getConnection();
        await connection.ping();
        console.log("✅ Conexão com o banco de dados estabelecida!");

        await connection.query(`
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(255) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                finance_data JSON
            )
        `);

        console.log("✅ Tabela 'users' pronta!");
    } catch (error) {
        console.error("❌ Erro ao criar/verificar tabela:", error.message);
    } finally {
        if (connection) connection.release();
    }
}

createUsersTable();

// ✅ Registro de usuário
app.post('/api/register', async (req, res) => {
    console.log('📩 Register request:', req.body);

    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ message: 'Missing fields' });

    const connection = await pool.getConnection();
    try {
        const [rows] = await connection.query(
            'SELECT * FROM users WHERE username = ?',
            [username]
        );

        if (rows.length > 0) {
            console.log('⚠ Usuário já existe:', username);
            return res.status(400).json({ message: 'User already exists' });
        }

        await connection.query(
            'INSERT INTO users (username, password, finance_data) VALUES (?, ?, ?)',
            [username, password, JSON.stringify({})]
        );

        console.log('✅ Usuário registrado:', username);
        res.status(201).json({ message: 'User registered successfully' });

    } catch (error) {
        console.error('❌ Erro no registro:', error);
        res.status(500).json({ message: 'Internal server error' });
    } finally {
        connection.release();
    }
});

// ✅ Login com JWT
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    const connection = await pool.getConnection();
    try {
        const [rows] = await connection.query(
            'SELECT * FROM users WHERE username = ?',
            [username]
        );

        if (rows.length === 0 || rows[0].password !== password) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });

    } catch (error) {
        console.error('Erro no login:', error);
        res.sendStatus(500);
    } finally {
        connection.release();
    }
});

// ✅ Middleware de autenticação
function authenticateToken(req, res, next) {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.sendStatus(401);

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}

// ✅ Buscar dados
app.get('/api/data', authenticateToken, async (req, res) => {
    const connection = await pool.getConnection();
    try {
        const [rows] = await connection.query(
            'SELECT finance_data FROM users WHERE username = ?',
            [req.user.username]
        );
        res.json(rows[0].finance_data || {});

    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    } finally {
        connection.release();
    }
});

// ✅ Atualizar dados
app.post('/api/data', authenticateToken, async (req, res) => {
    const connection = await pool.getConnection();
    try {
        await connection.query(
            'UPDATE users SET finance_data = ? WHERE username = ?',
            [JSON.stringify(req.body), req.user.username]
        );
        res.status(200).json({ message: 'Data saved successfully' });

    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    } finally {
        connection.release();
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Server running: http://localhost:${PORT}`);
});
