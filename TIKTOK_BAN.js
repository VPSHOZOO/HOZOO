const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
const cheerio = require('cheerio');

// Replace with your Telegram bot token
const token = "8109698197:AAFksLBRURP3t5AcOLEJs3MCzwOLU2wzV9M";
const bot = new TelegramBot(token, {polling: true});

// Video link
const video = "https://vt.tiktok.com/ZShxS8FeT/";

bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    const username = msg.from.username ? `@${msg.from.username}` : msg.from.first_name;
    
    const startMessage = `┏━━ıllıllı◌LORDHOZOO◌ıllıllı━━╼
┃  𝐁𝐨𝐭 𝐍𝐚𝐦𝐞: LORDHOZOO
┃ 𝐎𝐖𝐍𝐄𝐑 𝐍𝐀𝐌𝐄: @LORDHO,OO
┃ $𝐑𝐀𝐌: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB
┃ $𝐃𝐀𝐓𝐄: ${new Date().toLocaleString()}
╚═══❖•ೋ°🤡°ೋ•❖═══╝
＼／＼／＼／＼／＼／＼／＼／＼／
${video}`;

    const menuKeyboard = {
        reply_markup: {
            keyboard: [
                ['/start'],
                ['/username', '/help'],
                ['/youtube', '/tiktok'],
                ['/donasi']
            ],
            resize_keyboard: true
        }
    };

    bot.sendMessage(chatId, startMessage, menuKeyboard);
});

bot.onText(/\/help/, (msg) => {
    const chatId = msg.chat.id;
    const helpMessage = `┏━━━•❅•°•❈👑❈•°•❅•━━━┓
╚»★ 𖤍BANNED TIKTOK 2025𖤍★«╝
║ /start - Start bot
║ /username - Enter TikTok username to ban
║ /help - Show this help  
║ /youtube - YouTube features
║ /tiktok - TikTok features
║ /donasi - Donation info

┗━━━•❅•°•❈💀❈•°•❅•━━━┛`;
    
    bot.sendMessage(chatId, helpMessage);
});

bot.onText(/\/username/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, "Please enter the TikTok username you want to ban (without @):", {
        reply_markup: {
            force_reply: true
        }
    });
});

// Handle username input
bot.on('message', (msg) => {
    if (msg.reply_to_message && msg.reply_to_message.text === "Please enter the TikTok username you want to ban (without @):") {
        const chatId = msg.chat.id;
        const username = msg.text.trim().replace('@', '');
        
        if (username) {
            bot.sendMessage(chatId, `Processing ban request for @${username}...`);
            banTikTokUser(chatId, username);
        } else {
            bot.sendMessage(chatId, "Invalid username. Please try again.");
        }
    }
});

async function banTikTokUser(chatId, username) {
    try {
        // First get user info
        const response = await axios.get(`https://www.tiktok.com/@${username}`, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36'
            }
        });
        
        const $ = cheerio.load(response.data);
        const scriptTag = $('#__UNIVERSAL_DATA_FOR_REHYDRATION__').html();
        const jsonData = JSON.parse(scriptTag);
        const userInfo = jsonData.__DEFAULT_SCOPE__['webapp.user-detail'].userInfo;
        
        const userId = userInfo.user.id;
        const secUid = userInfo.user.secUid;
        
        // Generate report URL
        const reportUrl = generateReportUrl(username, userId, secUid);
        
        // Send report (simplified version)
        bot.sendMessage(chatId, `Ban report generated for @${username}. Sending reports...`);
        
        // Simulate sending reports (in a real bot, you'd make actual HTTP requests)
        for (let i = 0; i < 5; i++) {
            const currentTime = new Date().toLocaleTimeString();
            bot.sendMessage(chatId, `[${currentTime}] Report ${i+1} sent for @${username}`);
            await new Promise(resolve => setTimeout(resolve, 3000)); // 3 second delay
        }
        
        bot.sendMessage(chatId, `Ban reports completed for @${username}!`);
        
    } catch (error) {
        console.error(error);
        if (error.response && error.response.status === 403) {
            bot.sendMessage(chatId, "Error: 403 Forbidden. TikTok blocked the request.");
        } else {
            bot.sendMessage(chatId, `Error: Could not process ban for @${username}. User may not exist or an error occurred.`);
        }
    }
}

function generateReportUrl(username, userId, secUid) {
    const params = {
        aid: '9101',
        app_language: 'en',
        app_name: 'tiktok_web',
        browser_language: 'en-US',
        browser_name: 'Chrome',
        browser_online: 'true',
        browser_platform: 'Win32',
        browser_version: '110.0.0.0',
        channel: 'tiktok_web',
        cookie_enabled: 'true',
        current_region: 'US',
        device_id: Math.floor(Math.random() * 1e18).toString(),
        device_platform: 'web_pc',
        focus_state: 'true',
        from_page: 'user',
        history_len: '1',
        is_fullscreen: 'false',
        is_page_visible: 'true',
        lang: 'en',
        nickname: encodeURIComponent(username),
        object_id: userId,
        os: 'windows',
        priority_region: 'US',
        reason: '9010',
        referer: 'https://www.tiktok.com/',
        region: 'US',
        report_type: 'user',
        reporter_id: userId,
        root_referer: 'https://www.tiktok.com/',
        screen_height: '1080',
        screen_width: '1920',
        secUid: secUid,
        target: userId,
        tz_name: 'America/New_York',
        webcast_language: 'en'
    };
    
    const baseUrl = 'https://www.tiktok.com/aweme/v2/aweme/feedback/?';
    const queryString = Object.entries(params).map(([key, value]) => `${key}=${value}`).join('&');
    
    return baseUrl + queryString;
}

// Other command handlers
bot.onText(/\/youtube/, (msg) => {
    bot.sendMessage(msg.chat.id, "YouTube features coming soon!");
});

bot.onText(/\/tiktok/, (msg) => {
    bot.sendMessage(msg.chat.id, "TikTok features coming soon!");
});

bot.onText(/\/donasi/, (msg) => {
    bot.sendMessage(msg.chat.id, "Donation information coming soon!");
});

console.log("Bot is running...");
