const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();

// Database connection
const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'buyforce',
  user: 'postgres',
  password: 'postgres',
});

const JWT_SECRET = 'buyforce-super-secret-jwt-key-2024-change-in-production';

// Middleware
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

// Health check
app.get('/v1/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'OK', service: 'BuyForce Backend', version: 'v1', db: 'OK' });
  } catch (err) {
    res.status(500).json({ status: 'FAIL', error: err.message });
  }
});

// Login
app.post('/v1/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = result.rows[0];
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ sub: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        fullName: user.full_name,
        phone: user.phone,
        created_at: user.created_at,
      },
      token,
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Register
app.post('/v1/auth/register', async (req, res) => {
  try {
    const { fullName, email, phone, password } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({ error: 'fullName, email, password are required' });
    }

    // Check if user exists
    const existing = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ error: 'Email already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const result = await pool.query(
      'INSERT INTO users (full_name, email, phone, password) VALUES ($1, $2, $3, $4) RETURNING *',
      [fullName, email, phone, hashedPassword]
    );

    const user = result.rows[0];
    const token = jwt.sign({ sub: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        fullName: user.full_name,
        phone: user.phone,
        created_at: user.created_at,
      },
      token,
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Products
app.get('/api/products', async (req, res) => {
  try {
    const { categoryId } = req.query;
    
    let query = `
      SELECT 
        p.*,
        json_agg(
          DISTINCT jsonb_build_object(
            'id', i.id,
            'image_url', i.image_url,
            'is_main', i.is_main
          )
        ) FILTER (WHERE i.id IS NOT NULL) as images,
        json_agg(
          DISTINCT jsonb_build_object(
            'spec_key', s.spec_key,
            'spec_value', s.spec_value
          )
        ) FILTER (WHERE s.id IS NOT NULL) as specs
      FROM products p
      LEFT JOIN images i ON p.id = i.product_id
      LEFT JOIN specs s ON p.id = s.product_id
    `;
    
    const params = [];
    if (categoryId) {
      query += ' WHERE p.category_id = $1';
      params.push(categoryId);
    }
    
    query += ' GROUP BY p.id ORDER BY p.id';
    
    const result = await pool.query(query, params);
    
    const products = result.rows.map(p => ({
      ...p,
      stock_quantity: p.stock,
      images: p.images || [],
      specs: p.specs || [],
    }));
    
    res.json(products);
  } catch (err) {
    console.error('Products error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Single Product
app.get('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query(`
      SELECT 
        p.*,
        json_agg(
          DISTINCT jsonb_build_object(
            'id', i.id,
            'image_url', i.image_url,
            'is_main', i.is_main
          )
        ) FILTER (WHERE i.id IS NOT NULL) as images,
        json_agg(
          DISTINCT jsonb_build_object(
            'spec_key', s.spec_key,
            'spec_value', s.spec_value
          )
        ) FILTER (WHERE s.id IS NOT NULL) as specs
      FROM products p
      LEFT JOIN images i ON p.id = i.product_id
      LEFT JOIN specs s ON p.id = s.product_id
      WHERE p.id = $1
      GROUP BY p.id
    `, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    const product = {
      ...result.rows[0],
      stock_quantity: result.rows[0].stock,
      images: result.rows[0].images || [],
      specs: result.rows[0].specs || [],
    };
    
    res.json(product);
  } catch (err) {
    console.error('Product error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Groups
app.get('/api/groups', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        g.*,
        COUNT(DISTINCT ug.user_id) as current_members
      FROM groups g
      LEFT JOIN user_groups ug ON g.id = ug.group_id
      GROUP BY g.id
      ORDER BY g.id
    `);
    res.json(result.rows);
  } catch (err) {
    console.error('Groups error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Single Group
app.get('/api/groups/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query(`
      SELECT 
        g.*,
        COUNT(DISTINCT ug.user_id) as current_members,
        json_agg(
          DISTINCT jsonb_build_object(
            'id', u.id,
            'full_name', u.full_name,
            'email', u.email
          )
        ) FILTER (WHERE u.id IS NOT NULL) as members
      FROM groups g
      LEFT JOIN user_groups ug ON g.id = ug.group_id
      LEFT JOIN users u ON ug.user_id = u.id
      WHERE g.id = $1
      GROUP BY g.id
    `, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Group not found' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Group error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Categories
app.get('/api/categories', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM categories ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = 3000;
const HOST = '0.0.0.0';

app.listen(PORT, HOST, () => {
  console.log(`\n✅ BuyForce Backend Server running!`);
  console.log(`📍 Local: http://localhost:${PORT}`);
  console.log(`📱 Network: http://192.168.160.126:${PORT}`);
  console.log(`\n🔓 Login with: test@test.com / 123456\n`);
});
