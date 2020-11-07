const helper = require("../helper/index");
const {
  checkRoomUsed,
  postRoom,
  sendMessage,
  getRoomById,
  getRoomByUserId,
  getLatestMessage,
  getMessageByRoomId,
} = require("../model/chat");
const { getUserById } = require("../model/user");

module.exports = {
  createRoom: async (request, response) => {
    const { sender_id, getter_id } = request.body;
    const roomId = Math.floor(100000 + Math.random() * 9000000);
    const setData = {
      roomchat_id: roomId,
      sender_id,
      getter_id,
    };
    const getData = {
      roomchat_id: roomId,
      sender_id: getter_id,
      getter_id: sender_id,
    };
    try {
      const checkRoom = await checkRoomUsed(sender_id, getter_id);
      if (checkRoom.length > 0) {
        const data = { roomchat_id: checkRoom[0].roomchat_id };
        console.log(data);
        return helper.response(response, 400, "Room already created", data);
      } else {
        const result_a = await postRoom(setData);
        const result_b = await postRoom(getData);
        const result = { result_a, result_b };
        console.log(result);
        return helper.response(response, 200, "Room created", result);
      }
    } catch (error) {
      console.log(error);
    }
  },
  postMessage: async (request, response) => {
    const { sender_id, message_text, roomchat_id } = request.body;
    if (sender_id == "" || sender_id == undefined) {
      return helper.response(response, 400, "Sender ID must be fill");
    } else if (message_text == "" || message_text == undefined) {
      return helper.response(response, 400, "Please, write your message");
    } else if (roomchat_id == "" || roomchat_id == undefined) {
      return helper.response(response, 400, "Roomchat ID must be filled");
    }

    const setData = {
      sender_id,
      message_text,
      roomchat_id,
    };

    try {
      const result = await sendMessage(setData);
      console.log(result);
      return helper.response(response, 200, "Success send message", result);
    } catch (error) {
      console.log(error);
      return helper.response(response, 400, "Bad Request");
    }
  },
  getRoomByUser: async (request, response) => {
    const { id } = request.params;
    try {
      const result = await getRoomByUserId(id);
      console.log(result);
      if (result.length > 0) {
        for (let i = 0; i < result.length; i++) {
          const getRoomData = await getUserById(result[i].getter_id);
          const getLatestMsg = await getLatestMessage(result[i].roomchat_id);
          result[i].room_name = getRoomData[0].user_name;
          result[i].room_image = getRoomData[0].user_image;
          result[i].room_message = getLatestMsg;
        }
      }
      return helper.response(
        response,
        200,
        `Success get room by user ID ${id}`,
        result
      );
    } catch (error) {
      console.log(error);
      return helper.response(response, 400, "Bad Request");
    }
  },
  getRoomByid: async (request, response) => {
    const { sender_id, roomchat_id } = request.params;

    try {
      const result = await getRoomById(sender_id, roomchat_id);
      //   console.log(result);
      if (result.length > 0) {
        const getGetterData = await getUserById(result[0].getter_id);
        // console.log(getGetterData);
        result[0].room_name = getGetterData[0].user_name;
        result[0].room_image = getGetterData[0].user_image;

        const getMessage = await getMessageByRoomId(roomchat_id);
        // console.log(getMessage);
        if (getMessage.length > 0) {
          for (let i = 0; i < getMessage.length; i++) {
            const getSender = await getUserById(getMessage[i].sender_id);
            // console.log(getSender);
            getMessage[i].sender_name = getSender[0].user_name;
            getMessage[i].sender_image = getSender[0].user_image;
          }
        }
        // console.log(result);
        result[0].room_message = getMessage;
        return helper.response(
          response,
          200,
          `Success get room ID ${roomchat_id}`,
          result
        );
      } else {
        return helper.response(
          response,
          400,
          `Room with ID ${roomchat_id} & user ID ${sender_id} is not found`
        );
      }
    } catch (error) {
      console.log(error);
      return helper.response(response, 400, "Bad Request");
    }
  },
};
