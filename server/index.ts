import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import fs from 'fs/promises';
import path from 'path';

const app = express();
const PORT = 3001;
const JWT_SECRET = 'your-secret-key'; // In production, use environment variable

app.use(cors());
app.use(express.json());

// Helper functions
async function readJsonFile(filename: string) {
  const data = await fs.readFile(path.join(__dirname, '..', filename), 'utf-8');
  return JSON.parse(data);
}

async function writeJsonFile(filename: string, data: any) {
  await fs.writeFile(
    path.join(__dirname, '..', filename),
    JSON.stringify(data, null, 2)
  );
}

// Authentication middleware
const auth = async (req: any, res: any, next: any) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) throw new Error();

    const decoded = jwt.verify(token, JWT_SECRET);
    const users = await readJsonFile('users.json');
    const user = users.users.find((u: any) => u.id === decoded.userId);
    
    if (!user) throw new Error();
    req.user = user;
    next();
  } catch {
    res.status(401).json({ error: 'Please authenticate' });
  }
};

// Auth routes
app.post('/auth/register', async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    const data = await readJsonFile('users.json');
    
    if (data.users.some((u: any) => u.email === email)) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 8);
    const newUser = {
      id: String(data.users.length + 1),
      name,
      email,
      password: hashedPassword,
      phone,
      addresses: [],
      orders: []
    };

    data.users.push(newUser);
    await writeJsonFile('users.json', data);

    const token = jwt.sign({ userId: newUser.id }, JWT_SECRET);
    const { password: _, ...userWithoutPassword } = newUser;

    res.status(201).json({ user: userWithoutPassword, token });
  } catch (error) {
    res.status(500).json({ error: 'Registration failed' });
  }
});

app.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const data = await readJsonFile('users.json');
    const user = data.users.find((u: any) => u.email === email);

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET);
    const { password: _, ...userWithoutPassword } = user;

    res.json({ user: userWithoutPassword, token });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});

// Protected routes
app.get('/auth/me', auth, (req, res) => {
  const { password: _, ...user } = req.user;
  res.json(user);
});

// Order routes
app.post('/orders', auth, async (req, res) => {
  try {
    const { items, deliveryAddress, paymentMethod } = req.body;
    const data = await readJsonFile('users.json');
    const user = data.users.find((u: any) => u.id === req.user.id);

    const order = {
      id: `ord${Date.now()}`,
      date: new Date().toISOString(),
      status: paymentMethod === 'card' ? 'pending_payment' : 'pending',
      items,
      deliveryAddress,
      total: items.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0),
      paymentMethod,
      paymentStatus: paymentMethod === 'card' ? 'pending' : 'not_required'
    };

    user.orders.push(order);
    await writeJsonFile('users.json', data);

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// Payment routes (Paystack integration)
app.post('/payments/initiate', auth, async (req, res) => {
  try {
    const { amount, email } = req.body;
    
    // Initialize Paystack transaction
    const response = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email,
        amount: Math.round(amount), // amount in kobo
        callback_url: `${process.env.FRONTEND_URL}/payment/callback`
      })
    });

    const data = await response.json();
    if (!data.status) {
      throw new Error(data.message);
    }

    res.json(data.data);
  } catch (error) {
    res.status(500).json({ error: 'Payment initialization failed' });
  }
});

app.get('/payments/verify/:reference', auth, async (req, res) => {
  try {
    const { reference } = req.params;
    
    // Verify Paystack transaction
    const response = await fetch(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
        }
      }
    );

    const data = await response.json();
    if (!data.status) {
      throw new Error(data.message);
    }

    // Update order status if payment successful
    if (data.data.status === 'success') {
      const userData = await readJsonFile('users.json');
      const user = userData.users.find((u: any) => u.id === req.user.id);
      const order = user.orders.find((o: any) => o.id === req.query.orderId);
      
      if (order) {
        order.status = 'confirmed';
        order.paymentStatus = 'paid';
        await writeJsonFile('users.json', userData);
      }
    }

    res.json(data.data);
  } catch (error) {
    res.status(500).json({ error: 'Payment verification failed' });
  }
});

app.listen(PORT, () => {
 