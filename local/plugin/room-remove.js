/*
 * @Desc: ç§»åºç¾¤è
 * @Author: lwp
 * @Date: 2020-08-13 16:22:37
 * @LastEditors: lwp
 * @LastEditTime: 2020-08-13 16:35:24
 */

const DEFAULT_CONFIG = {
  keyword: ["ð", "è¸¢"],
  adminList: [],
  time: 3000,
  replyInfo: function (msg) {
    return `æ¨ä¸å®æ¯è¿åäºç¾¤çç¸å³è§åï¼${this.time / 1000}såæ¨å°è¢«ç§»åºæ¬ç¾¤ï¼æä½ç®¡çåï¼${msg.from().name()}`
  },
  replyDone: "done",
  replyNoPermission: "",
}

module.exports = function RoomRemove(config = {}) {
  config = Object.assign({}, DEFAULT_CONFIG, config)
  if (typeof config.keyword === "string") config.keyword = [config.keyword]
  if (typeof config.replyInfo === "string") {
    let info = config.replyInfo
    config.replyInfo = () => info
  }
  return (bot) => {
    // æ¶æ¯çå¬
    bot.on("message", async (msg) => {
      if (msg.self()) return
      // æ ¡éªæ¶æ¯ç±»åä¸ºææ¬ ä¸ æ¥èªç¾¤è
      if (msg.type() === bot.Message.Type.Text && msg.room()) {
        // è·åç¾¤èå®ä¾
        const room = await msg.room()
        // æ¯å¦ä¸º@çç¨æ·åè¡¨
        if (msg.mentionList()) {
          // è·åå¨ç¾¤ä¸­@çç¨æ·åè¡¨
          let contactList = await msg.mentionList()
          let sendText = msg.text(),
            aite = ""
          for (let i = 0; i < contactList.length; i++) {
            // è·å@ +  ç¾¤èå«ç§° || åå­
            let name =
              (await room.code(contactList[i])) || contactList[i].name()
            aite = "@" + name
            // å¹éå é¤åå­ä¿¡æ¯
            sendText = sendText.replace(aite, "")
          }
          // å é¤é¦å°¾ç©ºæ ¼
          sendText = sendText.replace(/(^\s*)|(\s*$)/g, "")
          if (config.keyword.some((v) => v === sendText)) {
            if (config.adminList.some((v) => v.id == msg.from().id)) {
              room.say(config.replyInfo(msg), ...contactList)
              setTimeout(async () => {
                contactList.map(async (item) => {
                  try {
                    await room.del(item)
                  } catch (e) {
                    console.error(e)
                  }
                  room.say(config.replyDone)
                })
              }, config.time)
            } else {
              if (config.replyNoPermission) {
                room.say(config.replyNoPermission, msg.from())
              }
            }
          }
        }
      }
    })
  }
}