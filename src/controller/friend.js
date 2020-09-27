const helper = require("../helper/index");
const { getUserById, getUserByEmail } = require("../model/user");
const {
  getFriendByUser,
  getFriendByEmail,
  postFriend,
} = require("../model/friend");

module.exports = {
  addFriend: async (request, response) => {
    const { user_id, friend_email } = request.body;
    if (user_id === "") {
      return helper.response(response, 400, "User ID can't be empty");
    } else if (friend_email === "") {
      return helper.response(response, 400, "Email can't be empty");
    }
    try {
      const checkUser = await getUserById(user_id);
      //   console.log(checkUser);
      if (checkUser.length > 0) {
        const resultUserEmail = checkUser[0].user_email;
        if (resultUserEmail === friend_email) {
          return helper.response(
            response,
            404,
            `Sorry, ${friend_email} is your email`
          );
        } else {
          const checkFriendData = await getUserByEmail(friend_email);
          if (checkFriendData.length > 0) {
            const checkFriendList = await getFriendByEmail(
              user_id,
              friend_email
            );

            if (checkFriendList.length > 0) {
              return helper.response(
                response,
                400,
                `${friend_email} is already friend with you`
              );
            } else {
              const friend_name = checkFriendData[0].user_name;
              const setData = {
                user_id,
                friend_email,
                friend_created_at: new Date(),
              };
              const result = await postFriend(setData);
              return helper.response(
                response,
                200,
                `Congratulation! now you are friends with ${friend_email}`,
                result
              );
            }
          } else {
            return helper.response(
              response,
              400,
              `User with email ${friend_email} is not found`
            );
          }
        }
      } else {
        return helper.response(
          response,
          200,
          `User by ID ${user_id} is not found`
        );
      }
    } catch (error) {
      console.log(error);
    }
  },
  getFriendByUser: async (request, response) => {
    const { id } = request.params;
    try {
      result = await getFriendByUser(id);
      return helper.response(
        response,
        200,
        `Success get friends by user ID ${id}`,
        result
      );
    } catch (error) {
      return helper.response(response, 400, "Bad Request");
    }
  },
};
