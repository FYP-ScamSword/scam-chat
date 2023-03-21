import app from './test.server.js';
import supertest from 'supertest';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config({ path: '../../.env' });

const request = supertest.agent(app);

/* Connecting to the database before each test. */
beforeEach(async () => {
  const mongoURI = process.env.TESTDB_URI;
  await mongoose.connect(mongoURI);
});

/* Closing database connection after each test. */
afterEach(async () => {
  await mongoose.connection.db.dropDatabase();
  await mongoose.connection.close();
});

describe('Health Check: GET /', () => {
  it('should return healthy status', async () => {
    const res = await request.get('/');
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Scam Chat is healthy.');
  });
});

describe('POST /tele_user/', () => {
  it('should return created 201 status', async () => {
    const res = await request.post('/tele_user').send({
      phone_num: '+6512345678',
      api_id: 12345678,
      api_hash: 'Description 2',
      session_id: 'session id',
      alias: 'Name'
    });
    expect(res.statusCode).toBe(201);
    expect(res.body.phone_num).toBe('+6512345678');
  });
});

describe('GET /tele_user/:phone_num', () => {
  it('should return correct user details', async () => {
    const postBody = await request.post('/tele_user').send({
      phone_num: '+6512345678',
      api_id: 12345678,
      api_hash: 'Description 2',
      session_id: 'session id',
      alias: 'Name'
    });

    const res = await request.get('/tele_user/+6512345678');
    expect(res.statusCode).toBe(200);
    expect(res.body[0].phone_num).toBe('+6512345678');
    expect(res.body[0].alias).toBe('Name');
  });
});

describe('POST /chat/createChat', () => {
  it('should return created 201 status', async () => {
    const res = await request.post('/chat/createChat').send({
      phone_num: '+6512345678',
      contact_name: 'Hello',
      total_msgs: 10,
      chat_id: '12345678910',
      latest_message: 'hi',
      type: 1,
      time: 1234

    });
    expect(res.statusCode).toBe(201);
    expect(res.body.phone_num).toBe('+6512345678');
  });
});

describe('GET /chat/:phone_num/:chat_id', () => {
  it('should return correct chat details', async () => {
    await request.post('/chat/createChat').send({
      phone_num: '+6512345678',
      contact_name: 'Hello',
      total_msgs: 10,
      chat_id: '12345678910'
    });

    const res = await request.get('/chat/get_by_id/+6512345678/12345678910');
    expect(res.statusCode).toBe(200);
    expect(res.body[0].contact_name).toBe('Hello');
  });
});

describe('POST /msg', () => {
  it('should return created 201 status', async () => {
    const res = await request.post('/msg').send({
      phone_num: '+6512345678',
      chat_id: '12345678910',
      msg_id: '1000',
      sender_username: 'CharlyCharyChar',
      sender_id: '511302430',
      sender_firstname: 'Charlotte',
      text: 'hi',
      type: 0,
      date: '3/4/2023',
      time: '6:21 PM'
    });
    expect(res.statusCode).toBe(201);
    expect(res.body.phone_num).toBe('+6512345678');
  });
});

describe('GET /msg/get_msg/:phone_num/:chat_id/:msg_id', () => {
  it('should return correct msg details', async () => {
    await request.post('/msg').send({
      phone_num: '+6512345678',
      chat_id: '12345678910',
      msg_id: '1000',
      sender_username: 'CharlyCharyChar',
      sender_id: '511302430',
      sender_firstname: 'Charlotte',
      text: 'hi',
      type: 0,
      date: '3/4/2023',
      time: '6:21 PM'
    });

    const res = await request.get('/msg/get_msg/+6512345678/12345678910/1000');
    expect(res.statusCode).toBe(200);
    expect(res.body[0].text).toBe('hi');
  });
});
