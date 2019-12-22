'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/3.0.0-beta.x/guides/controllers.html#core-controllers)
 * to customize this controller
 */

module.exports = {

    hook: async (ctx) => {
        let event = ctx.request.body;
            if (event.type === "message" && event.data.body && event.data.fromMe) {
                let message = event.data.body
                let knexQueryBuilder = strapi.connections.default;
                let v_messages = await knexQueryBuilder.raw('SELECT * FROM responsewapps');
                //console.log(v_messages)
                let responses = v_messages[0].filter(obj => {
                        if (obj.response.toUpperCase().indexOf(message.toUpperCase()) !== -1) {


var request = require("request");

var options = { method: 'POST',
  url: 'https://api.mercury.chat/sdk/whatsapp/sendMessage',
  qs:
   { api_token: '5df81eb80c63380019240e57rM0D1J6EL',
     instance: event.data.instance_number },
  headers:
   { 'cache-control': 'no-cache',
     Connection: 'keep-alive',
     Accept: '*/*',
     'User-Agent': 'PostmanRuntime/7.20.1',
     'Content-Type': 'application/json' },
  body: { body: obj.message, phone: event.data.author.split('@')[0]},
  json: true };

console.log(event)
console.log(obj.message)
console.log(event.data.author.split('@')[0])

request(options, function (error, response, body) {
  if (error) throw new Error(error);

  console.log(body);
});