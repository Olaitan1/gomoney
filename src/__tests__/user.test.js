import request from 'supertest';
import { app } from '../app';

describe('User Controller', () => {
  // Define a user object for testing
  const testUser = {
    email: 'test@example.com',
    username: 'testuser',
    phone: '1234567890',
    password: 'password123',
    confirm_password: 'password123',
  };

  it('should register a user', async () => {
    try {
      const response = await request(app)
        .post('/api/user/register')
        .send(testUser);

      // Ensure a successful registration
      expect(response.status).toBe(201);
      expect(response.body.message).toBe('User created successfully');

      // Check the response for user details
      const newUser = response.body.newUser;
      expect(newUser.email).toBe(testUser.email);
      expect(newUser.username).toBe(testUser.username);
      expect(newUser.phone).toBe(testUser.phone);

    } catch (error) {
      throw error; 
    }
  });

  it('should log in a user', async () => {
    const response = await request(app)
      .post('/api/user/login')
      .send({ email: testUser.email, password: testUser.password });

    // Ensure a successful login
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
    expect(response.body).toHaveProperty('user');
    expect(response.body.user.email).toBe(testUser.email);

  });
});
