import dotenv from 'dotenv';

import ActiveSessionModel from '../models/active_session.model.js';
import ArchivedSessionModel from '../models/archived_session.model.js';
import { checkUserExists } from '../utils/user.util.js';

dotenv.config();

/** Time in seconds after which a session is considered inactive */
const RELEASE_TIMEOUT = process.env.RELEASE_DURATION;

/** Time in seconds after which a session is to be archived */
const ARCHIVE_TIMEOUT = process.env.ARCHIVE_DURATION;

const sessionRefresh = async () => {
  const sessions = await ActiveSessionModel.find();

  // TODO: Update last_msg_time for each session

  sessions.forEach((session) => {
    validateSession(session);
  });
};

/**
 * Retrieve all active sessions
 */
export const getSessions = async (req, res) => {
  sessionRefresh();

  try {
    const sessions = await ActiveSessionModel.find();
    res.status(200).json(sessions);
  } catch (error) {
    res.status(500).json(error);
  }
};

/**
 * Retrieves all active sessions that are not assigned to a user
 */
export const getSessionsAvailable = async (req, res) => {
  sessionRefresh();

  try {
    const sessions = await ActiveSessionModel.find({ user_id: null });
    res.status(200).json(sessions);
  } catch (error) {
    res.status(500).json(error);
  }
};

/**
 * Retrieve active sessions for a given user
*/
export const getSessionsByUsername = async (req, res) => {
  sessionRefresh();

  try {
    const sessions = await ActiveSessionModel.find({ user_id: req.params.username });
    res.status(200).json(sessions);
  } catch (error) {
    res.status(500).json(error);
  }
};

/**
 * Assigns an available session to a user with the provided user ID.
 * If an available session exists, the session's user ID is updated to the provided user ID
 * and the updated session is returned in the response.
 * If no available sessions exist, a 404 error is returned.
 *
 * @param {*} req - The HTTP request object containing the user ID as a URL parameter.
 * @param {*} res - The HTTP response object used to send the response.
 */
export const assignSessionByUsername = async (req, res) => {
  sessionRefresh();

  const userExist = await checkUserExists(req.params.username);
  if (!userExist) {
    res.status(403).json({ message: 'User does not exist' });
    return;
  }

  try {
    let session = await ActiveSessionModel.find({ user_id: null })
      .sort({ last_msg_time: -1 })
      .limit(1);

    if (session.length === 0) {
      res.status(404).json({ message: 'No available session' });
      return;
    }

    session = session[0];

    await ActiveSessionModel.updateOne(
      { _id: session._id },
      { $set: { user_id: req.params.username } }
    );

    session.user_id = req.params.username;
    res.json(session);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

/**
 * Create and save a new active session
 * @param {*} req
 * @param {*} res
 */
export const createSession = async (req, res) => {
  const newSession = new ActiveSessionModel(req.body);
  newSession.save((err, session) => {
    if (err) {
      res.status(500).json(err);
    } else {
      res.status(201).json(session);
    }
  });
};

/**
 * Performs validation on a session. If time difference exceeds `ARCHIVE_TIMEOUT`, the session is archived. Otherwise,
 * if time difference exceeds `RELEASE_TIMEOUT`, the session is released.
 */
const validateSession = async (session) => {
  const { last_msg_time: lastMsgTime } = session;
  const currentTime = new Date();
  const diff = (currentTime.getTime() - lastMsgTime.getTime()) / 1000;
  if (diff > ARCHIVE_TIMEOUT) {
    await archiveSession(session);
  } else if (diff > RELEASE_TIMEOUT) {
    await releaseSession(session);
  }
};

/**
 * Release a session to the pool of available sessions, for other users to access
 */
const releaseSession = async (session) => {
  ActiveSessionModel.updateOne({ _id: session._id }, { user_id: null }, (err, res) => {
    if (err) {
      console.log(err);
    }
  });
};

/**
 * Archive a session (remove from active sessions and add to archived sessions)
 */
const archiveSession = async (session) => {
  ActiveSessionModel.deleteOne({ _id: session._id }, (err, res) => {
    if (err) {
      console.log(err);
    }
  });

  const { phone_num: phoneNum, chat_id: chatId, last_msg_time: lastMsgTime } = session;

  const toArchive = {
    phone_num: phoneNum,
    chat_id: chatId,
    last_msg_time: lastMsgTime
  };

  ArchivedSessionModel.create(toArchive, (err, res) => {
    if (err) {
      console.log(err);
    }
  });
};

/**
 * Retrieve all archived sessions
 */
export const getArchivedSessions = async (req, res) => {
  try {
    const sessions = await ArchivedSessionModel.find();
    res.status(200).json(sessions);
  } catch (error) {
    res.status(500).json(error);
  }
};
