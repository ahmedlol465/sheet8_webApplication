import { promises as fs } from 'fs';
import path from 'path';
import { User } from '../models/User';

export class UserService {
  private static usersFilePath = path.join(__dirname, '../data/users.json');

  private static async readUsers(): Promise<User[]> {
    try {
      const data = await fs.readFile(this.usersFilePath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      return [];
    }
  }

  private static async writeUsers(users: User[]): Promise<void> {
    await fs.writeFile(this.usersFilePath, JSON.stringify(users, null, 2));
  }

  static async createUser(username: string, email: string, password: string): Promise<User> {
    const users = await this.readUsers();
    
    // Check if user exists
    const userExists = users.some(
      user => user.username === username || user.email === email
    );
    
    if (userExists) {
      throw new Error('Username or email already exists');
    }
    
    const newUser = new User(username, email, password);
    users.push(newUser);
    await this.writeUsers(users);
    
    return newUser;
  }

  static async findUserByCredentials(email: string, password: string): Promise<User | null> {
    const users = await this.readUsers();
    return users.find(user => user.email === email && user.password === password) || null;
  }
} 