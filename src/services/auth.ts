import { AUTH_CONFIG } from "../config/auth.config";

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
}

interface AuthResponse {
  token: string;
  user: User;
}

// Simulated database
const USERS_DB = [
  {
    id: "1",
    name: "Test User",
    email: "test@example.com",
    // In real app, never store plain passwords
    password: "password123",
  },
];

class AuthService {
  private token: string | null = null;

  constructor() {
    this.token = localStorage.getItem("token");
  }

  async login(email: string, password: string): Promise<User> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    const user = USERS_DB.find(
      (u) => u.email === email && u.password === password
    );

    if (!user) {
      throw new Error("Invalid credentials");
    }

    // Create simple token
    const token = btoa(`${user.id}:${Date.now()}`);
    this.setToken(token);

    // Return user without password
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async register(
    name: string, 
    email: string, 
    password: string,
    phone: string
  ): Promise<User> {
    await new Promise((resolve) => setTimeout(resolve, 800));

    if (USERS_DB.some((u) => u.email === email)) {
      throw new Error("Email already exists");
    }

    const newUser = {
      id: String(USERS_DB.length + 1),
      name,
      email,
      phone,
      password,
    };

    USERS_DB.push(newUser);

    const token = btoa(`${newUser.id}:${Date.now()}`);
    this.setToken(token);

    const { password: _, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  }

  logout() {
    this.token = null;
    localStorage.removeItem("token");
  }

  isAuthenticated(): boolean {
    return Boolean(this.token);
  }

  private setToken(token: string) {
    this.token = token;
    localStorage.setItem("token", token);
  }
}

export const auth = new AuthService();
