const fetch = require('node-fetch');

async function checkin() {
  try {
    console.log('开始执行签到任务...');
    
    const domain = process.env.DOMAIN || 'https://api.fakerclaw.online';
    const cookie = process.env.COOKIE;
    const newApiUser = process.env.NEW_API_USER;
    
    const response = await fetch(`${domain}/api/user/checkin`, {
      method: 'POST',
      headers: {
        'accept': 'application/json, text/plain, */*',
        'accept-language': 'zh-CN,zh-TW;q=0.9,zh;q=0.8,en;q=0.7',
        'cache-control': 'no-store',
        'content-length': '0',
        'cookie': cookie,
        'new-api-user': newApiUser,
        'origin': domain,
        'priority': 'u=1, i',
        'referer': `${domain}/console/personal`,
        'sec-ch-ua': '"Chromium";v="146", "Not-A.Brand";v="24", "Google Chrome";v="146"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"macOS"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-origin',
        'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36'
      }
    });
    
    const result = await response.json();
    console.log('签到结果:', result);
    
    // 发送 Telegram 通知（如果配置了）
    if (process.env.TG_TOKEN && process.env.TG_ID) {
      const msg = `✅ 签到成功: ${JSON.stringify(result)}`;
      await sendMessage(msg);
    }
    
  } catch (error) {
    console.error('签到失败:', error);
    
    // 发送错误通知
    if (process.env.TG_TOKEN && process.env.TG_ID) {
      const msg = `🚫 签到失败: ${error.message}`;
      await sendMessage(msg);
    }
  }
}

async function sendMessage(msg) {
  const botToken = process.env.TG_TOKEN;
  const chatId = process.env.TG_ID;
  
  if (!botToken || !chatId) {
    console.log("Telegram 推送未启用. 消息内容:", msg);
    return;
  }

  const now = new Date();
  const formattedTime = new Date(now.getTime() + 8 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 19)
    .replace("T", " ");
  
  const message = `执行时间: ${formattedTime}\n${msg}`;
  const tgUrl = `https://api.telegram.org/bot${botToken}/sendMessage?chat_id=${chatId}&parse_mode=HTML&text=${encodeURIComponent(message)}`;

  try {
    const response = await fetch(tgUrl, { method: "GET", headers: { "User-Agent": "Mozilla/5.0", "Accept": "application/json" } });
    
    if (!response.ok) {
         return "Telegram 消息发送失败: "  + await response.text();
    }
    const jsonResponse = await response.text();
    console.log("Telegram 消息发送成功:", jsonResponse);
    return message;
  } catch (error) {
    console.error("发送 Telegram 消息失败:", error);
    return `发送 Telegram 消息失败: ${error.message}`;
  }
}

// 执行签到
checkin();