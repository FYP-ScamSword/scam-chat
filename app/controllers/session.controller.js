import dotenv from 'dotenv'

import ActiveSessionModel from '../models/active_session.model.js';
import ArchivedSessionModel from '../models/archived_session.model.js';

dotenv.config();

/** Time in seconds after which a session is considered inactive */
const RELEASE_TIMEOUT = process.env.RELEASE_DURATION;

/** Time in seconds after which a session is to be archived */
const ARCHIVE_TIMEOUT = process.env.ARCHIVE_DURATION;


const sessionRefresh = async () => {
  const sessions = await ActiveSessionModel.find();

  // TODO: Update last_msg_time for each session

  sessions.forEach((session) => {
    validateSession(session) && validateUserSession(session);
  });
}

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
}

/**
 * Retrieve active sessions for a given user
*/
export const getSessionsByUserId = async (req, res) => {
  sessionRefresh();

  try {
    const sessions = await ActiveSessionModel.find({ user_id: req.params.user_id });
    res.status(200).json(sessions);
  } catch (error) {
    res.status(500).json(error);
  }
};

/**
 * Performs validation on a session. If time difference exceeds `ARCHIVE_TIMEOUT`, the session is archived. Otherwise,
 * if time difference exceeds `RELEASE_TIMEOUT`, the session is released.
 */
const validateSession = async (session) => {
  const { last_msg_time } = session;
  const currentTime = new Date();
  const diff = (currentTime.getTime() - last_msg_time.getTime()) / 1000;
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

  const { phone_num, chat_id, last_msg_time } = session;

  const toArchive = {
    phone_num: phone_num,
    chat_id: chat_id,
    last_msg_time: last_msg_time
  }

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
