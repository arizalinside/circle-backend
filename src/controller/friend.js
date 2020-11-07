const helper = require("../helper/index");
const { getUserById, getUserByEmail } = require("../model/user");
const {
  getFriendById,
  getFriendByEmail,
  postFriend,
  deleteFriends,
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
          // console.log(checkFriendData);
          if (checkFriendData.length > 0) {
            const checkFriendList = await getFriendByEmail(
              user_id,
              friend_email
            );

            if (checkFriendList.length > 0) {
              const friend_name = checkFriendData[0].user_name;
              return helper.response(
                response,
                400,
                `${friend_name} is already friend with you`
              );
            } else {
              const friend_name = checkFriendData[0].user_name;
              const setData = {
                user_id,
                friend_id: checkFriendData[0].user_id,
                friend_email,
                friend_name: checkFriendData[0].user_name,
                friend_phone: checkFriendData[0].user_phone,
                friend_bio: checkFriendData[0].user_bio,
                friend_image: checkFriendData[0].user_image,
                friend_created_at: new Date(),
              };
              const result = await postFriend(setData);
              return helper.response(
                response,
                200,
                `Congratulation! now you are friends with ${friend_name}`,
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
      const result = await getFriendById(id);
      console.log(result);
      if (result.length > 0) {
        for (let i = 0; i < result.length; i++) {
          const getFriendData = await getUserByEmail(result[i].friend_email);
          console.log(getFriendData);
          result[i].friend_id = getFriendData[0].user_id;
          result[i].friend_name = getFriendData[0].user_name;
          result[i].friend_username = getFriendData[0].user_username;
          result[i].friend_phone = getFriendData[0].user_phone;
          result[i].friend_bio = getFriendData[0].user_bio;
          result[i].friend_image = getFriendData[0].user_image;
        }
        // console.log(result);
      }
      return helper.response(response, 200, `Success get friends`, result);
    } catch (error) {
      // console.log(error);
      return helper.response(response, 400, "Bad Request");
    }
  },
  deleteFriend: async (request, response) => {
    const { user_id, friend_email } = request.params;
    if (user_id === "" || user_id === undefined) {
      console.log("id gak ada");
      // return helper.response(response, 400, "Cannot found User ID");
    } else if (friend_email === "" || friend_email === undefined) {
      return helper.response(response, 400, "Cannot found Friend's Email");
    }
    try {
      const checkData = await getFriendByEmail(user_id, friend_email);
      if (checkData.length < 1) {
        return helper.response(response, 400, "Friend's data is not found");
      } else {
        const result = await deleteFriends(user_id, friend_email);
        return helper.response(response, 200, "Success delete friend", result);
      }
    } catch (error) {
      console.log(error);
    }
  },
};
