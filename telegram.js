var unirest = require('unirest'),
    Promise = require('bluebird'),
    logger = require('./config/logger');

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
                if (response.body.ok) {
                    logger.debug('[Telegram] sendMessage success : ', response.body.result);
                } else {
                    logger.error('[Telegram] sendMessage fail : ', chat_id, text);
                }
            });
    },

    /**
     * Get Updates
     *
     * @param offset
     * @param limit
     * @param timeout
     * @returns {bluebird|exports|module.exports}
     */
    getUpdates: function(offset, limit, timeout) {
        var url = this.baseUrl + this.token + '/getUpdates';
        return new Promise(function(resolve, reject) {
            unirest.post(url)
                .field({
                    offset: offset || 0,
                    limit: limit || 1,
                    timeout: timeout || 0
                })
                .end(function(response) {
                    if (response.body.ok && response.body.result.length > 0) {
                        resolve(response.body.result[0]);
                    } else {
                        reject('no update');
                    }
                });
        });
    }
};

module.exports = Telegram;