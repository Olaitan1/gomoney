// Import necessary dependencies and your controller functions

import request from 'supertest';
import {app} from '../app';


describe('Admin Controller', () => {
  // Define a user object for testing
  const testUser = {
    email: 'test@example.com',
    username: 'testuser',
    phone: '1234567890',
    password: 'password123',
    confirm_password:'password123'
  };

  it('should register an admin', async () => {
    const response = await request(app)
      .post('/api/register')
      .send(testUser);

    expect(response.status).toBe(201);
    expect(response.body.message).toBe('User created successfully');
    expect(response.body.newAdmin.email).toBe(testUser.email);
  });

  it('should log in an admin', async () => {
    const response = await request(app)
      .post('/api/login')
      .send({ email: testUser.email, password: testUser.password });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
    expect(response.body).toHaveProperty('admin');
    expect(response.body.admin.email).toBe(testUser.email);
  });
});

describe('Teams Controller', () => {
  // Define a team object for testing
  const testTeam = {
    teamName: 'Test Team',
    sport: 'Test Sport',
    homeCity: 'Test City',
    homeStadium: 'Test Stadium',
    country: 'Test Country',
  };

  it('should create a new team', async () => {
    const response = await request(app)
      .post('/api/teams')
      .send(testTeam);

    expect(response.status).toBe(201);
    expect(response.body.message).toBe('Team created successfully');
    expect(response.body.savedTeam.teamName).toBe(testTeam.teamName);
  });

  it('should get all teams', async () => {
    const response = await request(app).get('/api/teams');

    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
  });

});

describe('Fixtures Controller', () => {
  //  fixture object for testing
  const testFixture = {
     homeTeam: 'Test1',
  awayTeam: 'Test2',
  date: '2023-11-31T14:50:00.000Z',
  location: 'Stadium Name',
  result: {
    homeScore: 0,
    awayScore: 0
  },
  status: 'pending'
};

  it('should create a new fixture', async () => {
    const response = await request(app)
      .post('/api/fixtures')
      .send(testFixture);

    expect(response.status).toBe(201);
    expect(response.body.message).toBe('Fixture created successfully');
    expect(response.body.savedFixture.homeTeam).toBe(testFixture.homeTeam);
  });

  it('should get all fixtures', async () => {
    const response = await request(app)
      .get('/api/fixtures')
      .query({ status: 'complete' }); 
    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
  });

});
