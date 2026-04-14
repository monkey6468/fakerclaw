const fetch = require('node-fetch');

async function checkin() {
  try {
    console.log('开始执行签到任务...');
    
    const domain = process.env.DOMAIN || 'https://api.fakerclaw.online';
    const cookie = process.env.COOKIE || 'session=MTc3NTc4NzMwNXxEWDhFQVFMX2dBQUJFQUVRQUFEXzNfLUFBQWNHYzNSeWFXNW5EQVFBQW1sa0EybHVkQVFFQVA0U25BWnpkSEpwYm1jTUNnQUlkWE5sY201aGJXVUdjM1J5YVc1bkRBd0FDbTF2Ym10bGVUWTBOamdHYzNSeWFXNW5EQVlBQkhKdmJHVURhVzUwQkFJQUFnWnpkSEpwYm1jTUNBQUdjM1JoZEhWekEybHVkQVFDQUFJR2MzUnlhVzVuREFjQUJXZHliM1Z3Qm5OMGNtbHVad3dKQUFka1pXWmhkV3gwQm5OMGNtbHVad3dGQUFOaFptWUdjM1J5YVc1bkRBWUFCRkYwZG04R2MzUnlhVzVuREEwQUMyOWhkWFJvWDNOMFlYUmxCbk4wY21sdVp3d09BQXgyVTNKbVRGQnpkVk5xVDNVPXyu4m33vNMiO0oA1kf2u6gMIixRGdCGaX0zjccqvR6YGQ==';
    const newApiUser = process.env.NEW_API_USER || '2382';
    
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
      await sendTelegramNotification(result);
    }
    
  } catch (error) {
    console.error('签到失败:', error);
    
    // 发送错误通知
    if (process.env.TG_TOKEN && process.env.TG_ID) {
      await sendTelegramNotification({ error: error.message });
    }
  }
}

async function sendTelegramNotification(data) {
  try {
    const message = data.error 
      ? `🚫 签到失败: ${data.error}` 
      : `✅ 签到成功: ${JSON.stringify(data)}`;
    
    await fetch(`https://api.telegram.org/bot${process.env.TG_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        chat_id: process.env.TG_ID,
        text: message,
        parse_mode: 'Markdown'
      })
    });
    
    console.log('Telegram 通知已发送');
  } catch (error) {
    console.error('发送 Telegram 通知失败:', error);
  }
}

// 执行签到
checkin();