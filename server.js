import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

// routes
import TeleRoute from './app/routes/canary_account.route.js';
import ChatRoute from './app/routes/chat.route.js';
import MessageRoute from './app/routes/message.route.js';
import ChatListRoute from './app/routes/chat_list.route.js';
import SessionRoute from './app/routes/session.route.js';

const app = express();

// middleware
app.use(bodyParser.json({ limit: '30mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }));
app.use(cors());
// to serve images inside public folder
// app.use(express.static('public'));
// app.use('/images', express.static('images'));

dotenv.config();
const PORT = process.env.PORT;

const CONNECTION = process.env.MONGODB_CONNECTION;

mongoose
  .connect(CONNECTION, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => app.listen(PORT, () => console.log(`Scam-chat backend is listening on port: ${PORT}`)))
  .catch((error) => console.log(`${error} did not connect`));

app.get('/health', (req, res) => {
  res.json({
    message: 'Service deployed successfully!',
    timestamp: new Date().toUTCString()
  });
});

app.use('/tele_user', TeleRoute);
app.use('/chat', ChatRoute);
app.use('/msg', MessageRoute);
app.use('/chat_list', ChatListRoute);
app.use('/sessions', SessionRoute);

export default app;
