/*import express, { Request, Response, Router } from "express";
import cors from "cors";

const router: Router = express.Router();
const PORT = 3001;

// Simple in-memory users array for testing
const users = [
  {
    id: "1",
    name: "Test User",
    email: "test@example.com",
    password: "password123",
    phone: "+1234567890",
  },
];

// Auth handlers
router.post("/auth/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Please enter both email and password",
      });
    }

    const user = users.find(
      (u) => u.email === email && u.password === password
    );

    if (!user) {
      return res.status(401).json({
        message: "Email or password is incorrect",
      });
    }

    const { password: _, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({
      message: "Could not log in. Please try again.",
    });
  }
});

router.post("/auth/register", async (req: Request, res: Response) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password || !phone) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    if (users.some((u) => u.email === email)) {
      return res.status(400).json({
        message: "This email is already registered",
      });
    }

    const newUser = {
      id: String(users.length + 1),
      name,
      email,
      password,
      phone,
    };

    users.push(newUser);

    const { password: _, ...userWithoutPassword } = newUser;
    res.status(201).json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({
      message: "Registration failed",
    });
  }
});

// Server setup
const server = express();
server.use(cors());
server.use(express.json());
server.use(router);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); */
