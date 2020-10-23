const connection = require("../config/mysql");

module.exports = {
  checkUser: (email) => {
    return new Promise((resolve, reject) => {
      connection.query(
        "SELECT * from user WHERE user_email = ?",
        email,
        (error, result) => {
          !error ? resolve(result) : reject(new Error(error));
        }
      );
    });
  },
  postUser: (setData) => {
    return new Promise((resolve, reject) => {
      connection.query("INSERT INTO user SET ?", setData, (error, result) => {
        if (!error) {
          const newResult = {
            id: result.insertId,
            ...setData,
          };
          delete newResult.user_password;
          resolve(newResult);
        } else {
          console.log(error);
        }
      });
    });
  },
  getUser: () => {
    return new Promise((resolve, reject) => {
      connection.query("SELECT * from user", (error, result) => {
        if (!error) {
          // result.map((value) => {
          //   console.log(value);
          //   delete value.user_password;
          //   delete value.user_key;
          // });
          resolve(result);
        } else {
          // console.log(error);
          reject(new Error(error));
        }
      });
    });
  },
  getUserById: (id) => {
    return new Promise((resolve, reject) => {
      connection.query(
        "SELECT * from user WHERE user_id = ?",
        id,
        (error, result) => {
          if (!error) {
            result.map((value) => {
              delete value.user_password;
              delete value.user_key;
            });
            resolve(result);
          } else {
            reject(new Error(error));
          }
        }
      );
    });
  },
  getUserByEmail: (email) => {
    return new Promise((resolve, reject) => {
      connection.query(
        "SELECT * FROM user WHERE user_email = ?",
        email,
        (error, result) => {
          !error ? resolve(result) : reject(new Error(error));
        }
      );
    });
  },
};
