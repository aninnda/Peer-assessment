// server.test.js
const request = require('supertest');
const app = require('./server'); // Adjust to point to your server.js file
const db = require('./db'); // Your database module

// Mocking the database
jest.mock('./db', () => ({
    query: jest.fn()
}));

describe('API Tests', () => {
    // Test the /users GET route
    test('GET /users should return a list of users', async () => {
        db.query.mockImplementation((query, callback) => {
            callback(null, [{ id: 1, username: 'john_doe', role: 'student' }]);
        });

        const response = await request(app).get('/users');
        expect(response.status).toBe(200);
        expect(response.body).toEqual([{ id: 1, username: 'john_doe', role: 'student' }]);
    });

    // Test the /users/login POST route
    test('POST /users/login should login a user successfully', async () => {
        const mockUser = {
            id: 1,
            username: 'john_doe',
            password: 'password123',
            role: 'student'
        };
        
        db.query.mockImplementation((query, values, callback) => {
            if (values[0] === 'john_doe' && values[1] === 'student') {
                callback(null, [mockUser]);
            } else {
                callback(null, []);
            }
        });

        const response = await request(app)
            .post('/users/login')
            .send({ name: 'john_doe', password: 'password123', role: 'student' });

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Success');
        expect(response.body.user.name).toBe('john_doe');
    });

    // Test the /ratings POST route
    test('POST /ratings should save a rating', async () => {
        const ratingData = {
            rater_username: 'john_doe',
            rated_username: 'jane_doe',
            team_name: 'Team A',
            ratings: { conceptual: 5, practical: 4, workEthic: 5, cooperation: 4 },
            comments: 'Great teamwork!'
        };

        db.query.mockImplementation((query, values, callback) => {
            callback(null, {});
        });

        const response = await request(app)
            .post('/ratings')
            .send(ratingData);

        expect(response.status).toBe(200);
        expect(response.text).toBe('Rating saved successfully');
    });

    // Test the /session GET route
    test('GET /session should return user session data', async () => {
        const mockSession = { user: { id: 1, username: 'john_doe', role: 'student' } };
        // Simulate setting session manually in your test setup
        request(app)
            .get('/session')
            .set('Cookie', 'connect.sid=mock-session-id') // Using the correct cookie session ID
            .expect(200)
            .expect('Content-Type', /json/)
            .expect(res => {
                expect(res.body.username).toBe('john_doe');
            });
    });

  // Student Login: Should log in student successfully
  test('Student Login: Should log in student successfully', async () => {
    const response = await request(app)
        .post('/users/login')
        .send({ name: 'student_1', password: 'student_password', role: 'student' });
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Success');
    expect(response.body.user.name).toBe('student_1');
  });


  // Instructor Login: Should log in instructor successfully
  test('Instructor Login: Should log in instructor successfully', async () => {
    const response = await request(app)
        .post('/users/login')
        .send({ name: 'instructor_1', password: 'instructor_password', role: 'instructor' });
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Success');
    expect(response.body.user.username).toBe('instructor_1');
  });


  // POST /users/login should return an error if password is incorrect
  test('POST /users/login should return an error if password is incorrect', async () => {
    const response = await request(app)
      .post('/users/login')
      .send({ name: 'student_1', password: 'wrong_password', role: 'student' });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Invalid credentials');
  });


  // Instructor should be able to assign students to a team
  test('Instructor should be able to create a team and assign students to a team', async () => {
    const studentData = { studentId: 1, teamId: 1 };

    const response = await request(app)
      .post('/teams/assign')
      .send(studentData);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Student assigned to team successfully');
  });

  // Student should be able to view team members
  test('Student should be able to view team members', async () => {
    const response = await request(app)
        .get('/teams/1/members') // Assuming team ID is 1
        .set('Cookie', 'connect.sid=mock-session-id'); // If using sessions for authentication
    expect(response.status).toBe(200);
    expect(response.body.members.length).toBeGreaterThan(0);
  });


  // Instructor should be able to view teams and their members
  test('Instructor should be able to view teams and their members', async () => {
    const response = await request(app)
        .get('/teams')
        .set('Cookie', 'connect.sid=mock-session-id');
    expect(response.status).toBe(200);
    expect(response.body.teams.length).toBeGreaterThan(0);
});


  // Student should be able to submit a peer rating
  test('Student should be able to submit a peer rating', async () => {
    const ratingData = { teammateId: 2, rating: 4, feedback: 'Good teamwork' };
    const response = await request(app)
        .post('/ratings')
        .send(ratingData)
        .set('Cookie', 'connect.sid=mock-session-id');
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Rating submitted successfully');
  });


  // Session endpoint to check if user session data is accessible
  test('GET /session should return user session data', async () => {
    const response = await request(app)
        .get('/session')
        .set('Cookie', 'connect.sid=mock-session-id');
    expect(response.status).toBe(200);
    expect(response.body.user).toBeDefined();
  });

});

