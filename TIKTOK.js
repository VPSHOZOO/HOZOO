const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
const crypto = require('crypto');
const fs = require('fs');
const { randomInt, randomBytes } = require('crypto');
const token = '7886425911:AAHBDpZwh8_-ov5CtpOWbazKVn9eRwvIWAg';
const bot = new TelegramBot(token, { polling: true });
const config = {
  proxy: {
    useProxy: false,
    proxyType: 'http',
    auth: false,
    credential: '',
    proxyScrape: true
  }
};
const domains = [
  "api22-core-c-useast1a.tiktokv.com", 
  "api19-core-c-useast1a.tiktokv.com",
  "api16-core-c-useast1a.tiktokv.com", 
  "api21-core-c-useast1a.tiktokv.com"
];
const devices = [
  "SM-G9900", "SM-A136U1", "SM-M225FV", "SM-E426B", "SM-M526BR", 
  "SM-M326B", "SM-A528B", "SM-F711B", "SM-F926B", "SM-A037G"
];
const versions = [
  "190303", "190205", "190204", "190103", "180904", 
  "180804", "180803", "180802", "270204"
];
let stats = {
  requests: 0,
  success: 0,
  fails: 0,
  rps: 0,
  rpm: 0
};
class Gorgon {
  constructor(params, data, cookies, unix) {
    this.unix = unix;
    this.params = params;
    this.data = data;
    this.cookies = cookies;
  }
  hash(data) {
    return crypto.createHash('md5').update(data).digest('hex');
  }
  getBaseString() {
    let baseStr = this.hash(this.params);
    baseStr += this.data ? this.hash(this.data) : '0'.repeat(32);
    baseStr += this.cookies ? this.hash(this.cookies) : '0'.repeat(32);
    return baseStr;
  }
  getValue() {
    const baseStr = this.getBaseString();
    return this.encrypt(baseStr);
  }
  encrypt(data) {
    const unix = this.unix;
    const len = 20;
    const key = [223,119,185,64,185,155,132,131,209,185,203,209,247,194,185,133,195,208,251,195];
    const paramList = [];
    for (let i = 0; i < 12; i += 4) {
      const temp = data.substring(8*i, 8*(i+1));
      for (let j = 0; j < 4; j++) {
        const H = parseInt(temp.substring(j*2, (j+1)*2), 16);
        paramList.push(H);
      }
    }
    paramList.push(0, 6, 11, 28);
    paramList.push((unix & 4278190080) >> 24);
    paramList.push((unix & 16711680) >> 16);
    paramList.push((unix & 65280) >> 8);
    paramList.push((unix & 255) >> 0);
    const eorResultList = paramList.map((val, idx) => val ^ key[idx]);
    for (let i = 0; i < len; i++) {
      const C = this.reverse(eorResultList[i]);
      const D = eorResultList[(i+1)%len];
      const E = C ^ D;
      const F = this.rbitAlgorithm(E);
      const H = (F ^ 4294967295 ^ len) & 255;
      eorResultList[i] = H;
    }
    let result = '';
    for (const param of eorResultList) {
      result += this.hexString(param);
    }
    return {
      'X-Gorgon': '0404b0d30000' + result,
      'X-Khronos': unix.toString()
    };
  }
  rbitAlgorithm(num) {
    let tmpString = num.toString(2).padStart(8, '0');
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += tmpString[7-i];
    }
    return parseInt(result, 2);
  }
  hexString(num) {
    let tmpString = num.toString(16);
    if (tmpString.length < 2) tmpString = '0' + tmpString;
    return tmpString;
  }
  reverse(num) {
    const tmpString = this.hexString(num);
    return parseInt(tmpString.substring(1) + tmpString.substring(0, 1), 16);
  }
}
function randomString(length) {
  return randomBytes(Math.ceil(length/2))
    .toString('hex')
    .slice(0, length);
}
async function sendView(deviceId, installId, cdid, openudid, awemeId) {
  try {
    const version = versions[Math.floor(Math.random() * versions.length)];
    const params = new URLSearchParams({
      os_api: "25",
      device_type: devices[Math.floor(Math.random() * devices.length)],
      ssmix: "a",
      manifest_version_code: version,
      dpi: "240",
      region: "VN",
      carrier_region: "VN",
      app_name: "musically_go",
      version_name: "27.2.4",
      timezone_offset: "-28800",
      ab_version: "27.2.4",
      ac2: "wifi",
      ac: "wifi",
      app_type: "normal",
      channel: "googleplay",
      update_version_code: version,
      device_platform: "android",
      iid: installId,
      build_number: "27.2.4",
      locale: "vi",
      op_region: "VN",
      version_code: version,
      timezone_name: "Asia/Ho_Chi_Minh",
      device_id: deviceId,
      sys_region: "VN",
      app_language: "vi",
      resolution: "720*1280",
      device_brand: "samsung",
      language: "vi",
      os_version: `7.${Math.floor(Math.random() * 9) + 1}.${Math.floor(Math.random() * 99) + 1}`,
      aid: "1340"
    }).toString();
    const payload = `item_id=${awemeId}&play_delta=1`;
    const sig = new Gorgon(params, null, null, Math.floor(Date.now() / 1000)).getValue();
    const headers = {
      'cookie': `sessionid=${randomString(32)}`,
      'x-gorgon': sig['X-Gorgon'],
      'x-khronos': sig['X-Khronos'],
      'user-agent': 'okhttp/3.10.0.1'
    };
    const url = `https://${domains[Math.floor(Math.random() * domains.length)]}/aweme/v1/aweme/stats/?${params}`;
    const response = await axios.post(url, payload, { headers });
    stats.requests++;
    if (response.data.status_code === 0) {
      stats.success++;
      return true;
    } else {
      stats.fails++;
      return false;
    }
  } catch (error) {
    stats.fails++;
    return false;
  }
}
function startStatsCalculator() {
  setInterval(() => {
    const initial = stats.requests;
    setTimeout(() => {
      const current = stats.requests;
      stats.rps = parseFloat(((current - initial) / 1.5).toFixed(1));
      stats.rpm = parseFloat((stats.rps * 60).toFixed(1));
    }, 1500);
  }, 1500);
}
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const options = {
    reply_markup: {
      keyboard: [
        [{ text: '🚀 Start Viewbot' }],
        [{ text: '📊 Statistics' }],
        [{ text: '⚙️ Settings' }]
      ],
      resize_keyboard: true,
      one_time_keyboard: false
    },
    parse_mode: 'HTML'
  };
  const welcomeMsg = `
  <b>👸HAI KAK HOZOO IMUT 👸
</b>
  
  SUNTIK TIKTOK 2025
  • <b>🚀 Start Viewbot</b> - Start sending views to a TikTok video
  • <b>📊 Statistics</b> - View current bot statistics
  • <b>⚙️ Settings</b> - Configure bot settings
  
  <i>Select an option below:</i>
  `;
  bot.sendMessage(chatId, welcomeMsg, options);
});

bot.onText(/🚀 Start Viewbot/, (msg) => {
  const chatId = msg.chat.id;
  const options = {
    reply_markup: {
      force_reply: true
    },
    parse_mode: 'HTML'
  };

  bot.sendMessage(chatId, `
  <b>🔗 Enter TikTok URL:</b>
  
  Silakan balas dengan URL video TikTok yang ingin Anda kirimi penayangan.
  
  Contoh: <code>https://www.tiktok.com/@username/video/1234567890123456789</code>
  `, options);
});

bot.onText(/📊 Statistics/, (msg) => {
  const chatId = msg.chat.id;
  const statsMsg = `
  <b>📊 Bot Statistics</b>
  
  • <b>Total Requests:</b> ${stats.requests}
  • <b>Successful Views:</b> ${stats.success}
  • <b>Failed Attempts:</b> ${stats.fails}
  • <b>Requests Per Second:</b> ${stats.rps}
  • <b>Requests Per Minute:</b> ${stats.rpm}
  
  <i>Last updated: ${new Date().toLocaleTimeString()}</i>
  `;

  bot.sendMessage(chatId, statsMsg, { parse_mode: 'HTML' });
});
bot.onText(/⚙️ Settings/, (msg) => {
  const chatId = msg.chat.id;
  const settingsMsg = `
  <b>⚙️ Bot Settings</b>
  Current configuration:
  • <b>Proxy Usage:</b> ${config.proxy.useProxy ? '✅ Enabled' : '❌ Disabled'}
  • <b>Proxy Type:</b> ${config.proxy.proxyType}
  • <b>Proxy Auth:</b> ${config.proxy.auth ? '✅ Enabled' : '❌ Disabled'}
  <i>To change settings, please contact the bot administrator.</i>
  `;
  bot.sendMessage(chatId, settingsMsg, { parse_mode: 'HTML' });
});
bot.on('message', (msg) => {
  if (msg.reply_to_message && msg.reply_to_message.text && msg.reply_to_message.text.includes('Enter TikTok URL')) {
    const chatId = msg.chat.id;
    const url = msg.text.trim();
    if (!url.includes('tiktok.com')) {
      return bot.sendMessage(chatId, '❌ Invalid TikTok URL. Please try again.');
    }
    let videoId;
    try {
      const match = url.match(/\d{18,19}/);
      if (match) {
        videoId = match[0];
      } else {
        return bot.sendMessage(chatId, '❌ Could not extract video ID from URL. Please try again.');
      }
    } catch (error) {
      return bot.sendMessage(chatId, '❌ Error processing URL. Please try again.');
    }
    bot.sendMessage(chatId, `
    <b>🔢 Masukkan Jumlah Tampilan:</b>
    
    Berapa banyak penayangan yang ingin Anda kirimkan ke video ini?
    `, {
      reply_markup: {
        force_reply: true
      },
      parse_mode: 'HTML'
    }).then((sentMsg) => {
      bot.once('message', (viewsMsg) => {
        if (viewsMsg.reply_to_message && viewsMsg.reply_to_message.message_id === sentMsg.message_id) {
          const numViews = parseInt(viewsMsg.text);
          if (isNaN(numViews) {
            return bot.sendMessage(chatId, '❌ Please enter a valid number.');
          }
          bot.sendMessage(chatId, `🚀 Starting to send ${numViews} views to video ${videoId}...`);
          let sent = 0;
          const interval = setInterval(() => {
            if (sent >= numViews) {
              clearInterval(interval);
              bot.sendMessage(chatId, `✅ Successfully sent ${numViews} views to the video!`);
              return;
            }
            const devices = fs.readFileSync('devices.txt', 'utf-8').split('\n');
            const device = devices[Math.floor(Math.random() * devices.length)];
            if (device) {
              const [did, iid, cdid, openudid] = device.split(':');
              sendView(did, iid, cdid, openudid, videoId);
              sent++;
            }
          }, 100);
        }
      });
    });
  }
});
startStatsCalculator();
console.log('🤖 TikTok ViewBot is running...');
