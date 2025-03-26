export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
}

// Simple auth service that accepts any email/password for now
export const auth = {
  async login(email: string, _password: string): Promise<User> {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Accept any email/password combination for now
    return {
      id: "1",
      name: email.split("@")[0], // Use email name as user name
      email: email,
      phone: "+1234567890",
    };
  },

  async register(
    name: string,
    email: string,
    _password: string,
    phone: string
  ): Promise<User> {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Accept any registration for now
    return {
      id: Math.random().toString(36).substr(2, 9),
      name,
      email,
      phone,
    };
  },

  logout() {
    localStorage.removeItem("token");
  },

  getCurrentUser(): User | null {
    const token = localStorage.getItem("token");
    if (!token) return null;

    // TODO: Validate token and get user info from server
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },
};
