import express, { Request, Response, Router, RequestHandler } from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { readFile, writeFile } from "fs/promises";
import { join } from "path";

const router: Router = express.Router();
const PORT = 3001;
const JWT_SECRET = "tryb3_chaw_2024_secure_jwt_token_9x8q7w6v5u4t3s2r1p";

router.use(cors());
router.use(express.json());

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  password: string;
}

interface RegisterRequest extends Request {
  body: {
    name: string;
    email: string;
    password: string;
    phone: string;
  };
}

interface LoginRequest extends Request {
  body: {
    email: string;
    password: string;
  };
}

// Helper functions
async function readUsers(): Promise<User[]> {
  try {
    const data = await readFile(join(__dirname, "../data/users.json"), "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function writeUsers(users: User[]): Promise<void> {
  await writeFile(
    join(__dirname, "../data/users.json"),
    JSON.stringify(users, null, 2)
  );
}

// Define handler types
type RegisterHandler = (
  req: Request<{}, any, RegisterRequest["body"]>,
  res: Response
) => Promise<Response>;

type LoginHandler = (
  req: Request<{}, any, LoginRequest["body"]>,
  res: Response
) => Promise<Response>;

// Auth endpoints
const registerHandler: RegisterHandler = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    const users = await readUsers();

    if (users.some((u) => u.email === email)) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser: User = {
      id: String(users.length + 1),
      name,
      email,
      phone,
      password: hashedPassword,
    };

    users.push(newUser);
    await writeUsers(users);

    const token = jwt.sign({ userId: newUser.id }, JWT_SECRET, {
      expiresIn: "7d",
    });

    const { password: _, ...userWithoutPassword } = newUser;
    return res.status(201).json({ user: userWithoutPassword, token });
  } catch (error) {
    return res.status(500).json({ message: "Registration failed" });
  }
};

const loginHandler: LoginHandler = async (req, res) => {
  try {
    const { email, password } = req.body;
    const users = await readUsers();
    const user = users.find((u) => u.email === email);

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: "7d",
    });

    const { password: _, ...userWithoutPassword } = user;
    return res.json({ user: userWithoutPassword, token });
  } catch (error) {
    return res.status(500).json({ message: "Login failed" });
  }
};

router.post("/auth/register", registerHandler);
router.post("/auth/login", loginHandler);

const server = express();
server.use(cors());
server.use(express.json());
server.use("/api", router);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
