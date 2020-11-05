const bcrypt = require("bcrypt");
const helper = require("../helper/index");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const nodemailer = require("nodemailer");
const {
  checkUser,
  postUser,
  getUser,
  getUserById,
  patchUser,
} = require("../model/user");

module.exports = {
  registerUser: async (request, response) => {
    const {
      user_name,
      user_email,
      user_username,
      user_phone,
      user_password,
    } = request.body;
    const salt = bcrypt.genSaltSync(10);
    const encryptPassword = bcrypt.hashSync(user_password, salt);
    const setData = {
      user_name,
      user_email,
      user_username,
      user_phone,
      user_image: "blank-profile.jpg",
      user_password: encryptPassword,
      user_created_at: new Date(),
    };
    try {
      const checkEmailUser = await checkUser(user_email);
      if (checkEmailUser.length > 0) {
        return helper.response(response, 400, "Email has been registered");
      } else if (user_email === "") {
        return helper.response(response, 400, "Email can't be empty");
      } else if (user_password === "") {
        return helper.response(response, 400, "Password can't be empty");
      } else if (user_password.length < 8 || user_password.length > 16) {
        return helper.response(
          response,
          400,
          "Password must be 8-16 characters"
        );
      } else if (user_name === "") {
        return helper.response(response, 400, "Your name can't be empty");
      } else if (user_phone === "" || user_phone.length > 15) {
        return helper.response(
          response,
          400,
          "Phone number can't be 15 numbers"
        );
      } else {
        const result = await postUser(setData);
        return helper.response(response, 200, "Register Success!", result);
      }
    } catch (error) {
      return helper.response(response, 400, "Bad Request");
    }
  },
  loginUser: async (request, response) => {
    try {
      const { user_email, user_password } = request.body;
      const checkDataUser = await checkUser(user_email);
      if (checkDataUser.length >= 1) {
        const checkPassword = bcrypt.compareSync(
          user_password,
          checkDataUser[0].user_password
        );
        if (checkPassword) {
          const {
            user_id,
            user_name,
            user_email,
            user_username,
            user_image,
            user_phone,
            user_bio,
          } = checkDataUser[0];
          let payload = {
            user_id,
            user_name,
            user_email,
            user_username,
            user_image,
            user_phone,
            user_bio,
          };
          const token = jwt.sign(payload, "SECRET", { expiresIn: "5h" });
          payload = { ...payload, token };
          return helper.response(response, 200, "Login Success", payload);
        } else {
          return helper.response(response, 400, "Wrong Password");
        }
      } else {
        return helper.response(
          response,
          400,
          "Email / account is not registered"
        );
      }
    } catch (error) {
      console.log(error);
      // return helper.response(response, 400, "Bad Request");
    }
  },
  getAllUser: async (request, response) => {
    try {
      const result = await getUser();
      // console.log(result);
      // console.log(result);
      if (result.length > 0) {
        return helper.response(response, 200, "Success Get All User", result);
      } else {
        return helper.response(response, 400, "Cannot find user");
      }
    } catch (error) {
      console.log(error);
      // return helper.response(response, 400, "Bad Request", error);
    }
  },
  getUserById: async (request, response) => {
    try {
      const { id } = request.params;
      const result = await getUserById(id);
      // console.log(result);
      if (result.length > 0) {
        return helper.response(
          response,
          200,
          `Success Get User By ID: ${id}`,
          result
        );
      } else {
        return helper.response(response, 400, `User By ID: ${id} is not found`);
      }
    } catch (error) {
      // console.log(error);
      return helper.response(response, 400, "Bad Request", error);
    }
  },
  patchUserById: async (request, response) => {
    try {
      const { id } = request.params;
      const { user_name, user_username, user_phone, user_bio } = request.body;
      const setData = {
        user_name,
        user_username,
        user_phone,
        user_bio,
        user_updated_at: new Date(),
      };
      if (user_name === "") {
        return helper.response(response, 400, "Name cannot be empty");
      } else if (user_username === "") {
        return helper.response(response, 400, "Username cannot be empty");
      } else if (user_phone === "") {
        return helper.response(response, 400, "Phone number cannot be empty");
      } else if (user_bio === "") {
        return helper.response(response, 400, "Bio cannot be empty");
      }

      const checkUser = await getUserById(id);
      console.log(checkUser[0].user_image);
      if (checkUser.length > 0) {
        if (request.file == undefined || request.file == "") {
          console.log("tanpa gambar");
          const result = await patchUser(setData, id);
          return helper.response(
            response,
            200,
            "User Profile successfully updated",
            result
          );
        } else {
          console.log("dengan gambar");
          // console.log(true);
          fs.unlink(`./uploads/${checkUser[0].user_image}`, async (error) => {
            if (error) {
              console.log(error);
            } else {
              setData.user_image = request.file.filename;
              const result = await patchUser(setData, id);
              return helper.response(
                response,
                200,
                "User Profile successfully updated",
                result
              );
            }
          });
        }
      } else {
        return helper.response(response, 404, `User By ID: ${id} not found`);
      }
    } catch (error) {
      console.log(error);
      // return helper.response(response, 400, "Bad Request");
    }
  },
};
