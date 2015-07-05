var unirest = require('unirest');

var Telegram = {
    adminId: 49397784,
    baseUrl: 'https://api.telegram.org/bot',
    token: '78880997:AAHq84xbSdS3AP2dzOwhUd507i_huBBYfuE',

    /**
     * SendMessage
     *
     * @param chat_id
     * @param text
     * @param disable_web_page_preview
     * @param reply_to_message_id
     * @param reply_markup
     */
    sendMessage: function(chat_id, text, disable_web_page_preview, reply_to_message_id, reply_markup) {
        var url = this.baseUrl + this.token + '/sendMessage';
        unirest.post(url)
            .field({
                chat_id: chat_id || this.adminId,
                text: text
            })
            .end(function(response) {
                console.log(response.body);
            });
    }
};

module.exports = Telegram;