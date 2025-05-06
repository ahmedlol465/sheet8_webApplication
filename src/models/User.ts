export class User {
    username: string;
    email: string;
    password: string;
  
    constructor(username: string, email: string, password: string) {
      this.username = username;
      this.email = email;
      this.password = password;
    }
  
    // Method to convert User object to plain object for JSON serialization
    toJSON() {
      return {
        username: this.username,
        email: this.email,
        password: this.password
      };
    }
  }
  
  // Interface for session with user data
  export interface UserSession {
    isAuthenticated: boolean;
    user?: {
      username: string;
      email: string;
    };
  }
  
  // Extend Express Session interface to include our custom properties
  declare module 'express-session' {
    interface SessionData {
      isAuthenticated?: boolean;
      user?: {
        username: string;
        email: string;
      };
    }
  }