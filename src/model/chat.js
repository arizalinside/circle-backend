const connection = require("../config/mysql");

module.exports = {
  checkRoomUsed: (sender, getter) => {
    return new Promise((resolve, reject) => {
      connection.query(
        "SELECT * FROM roomchat WHERE sender_id = ? AND getter_id = ?",
        [sender, getter],
        (error, result) => {
          !error ? resolve(result) : reject(new Error(error));
        }
      );
    });
  },
  postRoom: (data) => {
    return new Promise((resolve, reject) => {
      connection.query("INSERT INTO roomchat SET ?", data, (error, result) => {
        !error ? resolve(data) : reject(new Error(error));
      });
    });
  },
  sendMessage: (setData) => {
    return new Promise((resolve, reject) => {
      connection.query(
        "INSERT INTO message SET ?",
        setData,
        (error, result) => {
          !error ? resolve(setData) : reject(new Error(error));
        }
      );
    });
  },
  getRoomById: (sender_id, roomchat_id) => {
    return new Promise((resolve, reject) => {
      connection.query(
        "SELECT * FROM roomchat WHERE sender_id = ? AND roomchat_id = ?",
        [sender_id, roomchat_id],
        (error, result) => {
          !error ? resolve(result) : reject(new Error(error));
        }
      );
    });
  },
  getRoomByUserId: (id) => {
    return new Promise((resolve, reject) => {
      connection.query(
        "SELECT * FROM roomchat WHERE sender_id = ?",
        id,
        (error, result) => {
          !error ? resolve(result) : reject(new Error(error));
        }
      );
    });
  },
  getLatestMessage: (id) => {
    return new Promise((resolve, reject) => {
      connection.query(
        "SELECT * FROM message WHERE roomchat_id = ? ORDER BY message_created_at DESC LIMIT 1",
        id,
        (error, result) => {
          !error ? resolve(result) : reject(new Error(error));
        }
      );
    });
  },
  getMessageByRoomId: (id) => {
    return new Promise((resolve, reject) => {
      connection.query(
        "SELECT * FROM message WHERE roomchat_id = ?",
        id,
        (error, result) => {
          !error ? resolve(result) : reject(new Error(error));
        }
      );
    });
  },
};
