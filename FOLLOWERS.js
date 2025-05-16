const TelegramBot = require('8109698197:AAFksLBRURP3t5AcOLEJs3MCzwOLU2wzV9M');
const axios = require('axios');
const moment = require('moment');
const token = 'YOUR_TELEGRAM_BOT_TOKEN';
const bot = new TelegramBot(token, { polling: true });
const botInfo = `
┏━━ıllıllı◌LORDHOZOO◌ıllıllı━━╼
┃  𝐁𝐨𝐭 𝐍𝐚𝐦𝐞: LORDHOZOO
┃ 𝐎𝐖𝐍𝐄𝐑 𝐍𝐀𝐌𝐄: @LORDHOZOO
┃ $𝐑𝐀𝐌: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB
┃ $𝐃𝐀𝐓𝐄: ${moment().format('YYYY-MM-DD HH:mm:ss')}
╚═══❖•ೋ°👸°ೋ•❖═══╝
＼／＼／＼／＼／＼／＼／＼／＼／`;
const mainMenu = `
┏━━━•❅•°•❈👑❈•°•❅•━━━┓
╚»★ 𖤍FOLLWERS TIKTOK 2025𖤍★«╝
║ /start - Start bot
║ /username - Enter TikTok username
┗━━━•❅•°•❈💀❈•°•❅•━━━┛
     ⇆ㅤ◁ㅤ ❚❚ㅤ ▷ㅤ↻`;
function generateUserAgent() {
    const browserVersion = `${Math.floor(Math.random() * 8) + 101}.0.${Math.floor(Math.random() * 700) + 4200}.${Math.floor(Math.random() * 110) + 40}`;
    const byte = Math.random() > 0.5 ? 'Win64; x64' : 'Win32; x86';
    return `Mozilla/5.0 (Windows NT 10.0; ${byte}) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${browserVersion} Safari/537.36`;
}
async function sendFollowers(username) {
    try {
        const session = axios.create({
            headers: {
                'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
                'accept-language': 'en-US,en;q=0.9',
                'connection': 'keep-alive',
                'host': 'tikfuel.com',
                'upgrade-insecure-requests': '1',
                'user-agent': generateUserAgent(),
            }
        });
        const response = await session.get('https://tikfuel.com/free-tt/');
        const responseText = response.data;
        const wpformsPostId = responseText.match(/name="wpforms\[post_id\]" value="(\d+)"/)?.[1];
        const wpformsId = responseText.match(/name="wpforms\[id\]" value="(\d+)"/)?.[1];
        const dataToken = responseText.match(/data-token="(.*?)"/)?.[1];
        const wpformsFields = responseText.match(/name="wpforms\[fields\]\[4\]\[\]" value="(.*?)"/)?.[1];
        const wpformsSubmit = responseText.match(/name="wpforms\[submit\]" id="(.*?)"/)?.[1];

        if (!wpformsPostId || !wpformsId || !dataToken || !wpformsFields || !wpformsSubmit) {
            return { success: false, message: "Service is currently unavailable. Please try again later." };
        }
        const randomString = Math.random().toString(36).substring(2, 10);
        const fakeEmail = `${randomString}@gmail.com`;
        const fakeName = Math.random().toString(36).substring(2, 10);

        const formData = new URLSearchParams();
        formData.append('wpforms[fields][3]', `@${username}`);
        formData.append('wpforms[fields][1]', fakeName);
        formData.append('wpforms[fields][2]', fakeEmail);
        formData.append('wpforms[fields][4][]', wpformsFields);
        formData.append('wpforms[id]', wpformsId);
        formData.append('wpforms[author]', '1');
        formData.append('wpforms[post_id]', wpformsPostId);
        formData.append('wpforms[submit]', wpformsSubmit);
        formData.append('wpforms[token]', dataToken);
        const response2 = await session.post('https://tikfuel.com/free-tt/', formData.toString(), {
            headers: {
                'content-type': 'application/x-www-form-urlencoded',
                'referer': 'https://tikfuel.com/free-tt/',
                'origin': 'https://tikfuel.com'
            }
        });
        if (response2.data.includes('Our systems detected that you already used once our program for Free Followers.')) {
            return { success: false, message: "You've already used this service. Please try with a different username." };
        } else if (response2.data.includes('Estimated delivery time') || response2.data.includes('First time submission')) {
            return { 
                success: true, 
                message: `Status: Successfully...\nFollowers: -+25\nLink: https://www.tiktok.com/@${username}` 
            };
        } else {
            return { success: false, message: "Server error occurred while sending followers. Please try again later." };
        }
    } catch (error) {
        console.error(error);
        return { success: false, message: "An error occurred. Please try again." };
    }
}
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, `${botInfo}\n\n${mainMenu}`);
});

bot.onText(/\/username/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, "Please enter the TikTok username you want to get followers for (without @):", {
        reply_markup: {
            force_reply: true
        }
    });
});
bot.on('message', async (msg) => {
    if (msg.reply_to_message && msg.reply_to_message.text === "Please enter the TikTok username you want to get followers for (without @):") {
        const chatId = msg.chat.id;
        const username = msg.text.replace('@', '').trim();
        
        if (!username) {
            bot.sendMessage(chatId, "Please enter a valid username.");
            return;
        }
        
        bot.sendMessage(chatId, `Processing request for @${username}...`);
        
        const result = await sendFollowers(username);
        if (result.success) {
            bot.sendMessage(chatId, `┏━━━•❅•°•❈👑❈•°•❅•━━━┓\n${result.message}\n┗━━━•❅•°•❈💀❈•°•❅•━━━┛`);
        } else {
            bot.sendMessage(chatId, `Error: ${result.message}`);
        }
    }
});
console.log('Bot is running...');
