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
};
