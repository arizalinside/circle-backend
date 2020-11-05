const connection = require("../config/mysql");

module.exports = {
  postFriend: (setData) => {
    return new Promise((resolve, reject) => {
      connection.query("INSERT INTO friend set ?", setData, (error, result) => {
        if (!error) {
          const newResult = {
            id: result.insertId,
            ...setData,
          };
          resolve(newResult);
        }
      });
    });
  },
  getFriendByEmail: (id, email) => {
    return new Promise((resolve, reject) => {
      connection.query(
        "SELECT * FROM friend where user_id = ? AND friend_email = ?",
        [id, email],
        (error, result) => {
          !error ? resolve(result) : reject(new Error(error));
        }
      );
    });
  },
  getFriendById: (id) => {
    return new Promise((resolve, reject) => {
      connection.query(
        "SELECT * FROM friend where user_id = ?",
        id,
        (error, result) => {
          !error ? resolve(result) : reject(new Error(error));
        }
      );
    });
  },
  deleteFriends: (id, email) => {
    return new Promise((resolve, reject) => {
      connection.query(
        "DELETE FROM friend WHERE user_id = ? AND friend_email = ?",
        [id, email],
        (error, result) => {
          if (!error) {
            // const newResult = {
            //   user_id,
            //   friend_email,
            // resolve(result);
            console.log(result);
          } else {
            console.log(error);
          }
        }
      );
    });
  },
};
