// ==========================================
// 你的 YouTube API Key (已修复换行和格式问题)
// ==========================================
const YOUTUBE_API_KEY = '输入你的API KEY';

document.getElementById('extractBtn').addEventListener('click', async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const url = tab.url;
  const title = tab.title;

  if (url.includes('youtube.com/watch')) {
    // === YouTube API 提取逻辑 ===
    const videoId = new URL(url).searchParams.get('v');
    if (!videoId) {
      showResult("❌ 无法从网址中解析出 YouTube Video ID");
      return;
    }

    try {
      document.getElementById('extractBtn').innerText = "提取中...";
      const response = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${YOUTUBE_API_KEY}`);
      const data = await response.json();
      
      if (data.items && data.items.length > 0) {
        const snippet = data.items[0].snippet;
        const author = snippet.channelTitle;
        const publishDate = snippet.publishedAt.split('T')[0]; // 直接截取纯日期
        
        let cleanTitle = title.replace(/ - YouTube$/i, '');
        let cleanUrl = url.split('&')[0];

        const markdown = `### [${cleanTitle}](${cleanUrl}) #内容 #笔记属性\n- **平台**: YouTube\n- **作者**: ${author}\n- **发布日期**: ${publishDate}`;
        showResult(markdown, true);
      } else {
        showResult("❌ API 未返回数据，请检查 API Key 权限或视频是否存在。");
      }
    } catch (error) {
      showResult("❌ API 请求失败: " + error.message);
    }
  } else {
    // === B 站等其他网站页面注入提取逻辑 ===
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: extractOtherVideoInfo,
    }, (results) => {
      if (results && results[0] && results[0].result) {
        showResult(results[0].result, true);
      } else {
        showResult("❌ 无法提取信息，请确保在支持的视频播放页运行。");
      }
    });
  }
});

function showResult(text, copy = false) {
  const resDiv = document.getElementById('result');
  resDiv.style.display = 'block';
  resDiv.textContent = text;
  if (copy) {
    navigator.clipboard.writeText(text);
    document.getElementById('extractBtn').innerText = "✅ 提取成功！已复制";
    document.getElementById('extractBtn').style.background = "#107C41";
  }
}

// 网页内的兜底脚本
function extractOtherVideoInfo() {
  const url = window.location.href;
  const info = { platform: 'Unknown', title: document.title, url: url, author: '', publishDate: '' };

  const getText = (selectors) => {
    for (let sel of selectors) {
      const el = document.querySelector(sel);
      if (el && el.innerText.trim()) return el.innerText.trim();
    }
    return '';
  };

  if (url.includes('bilibili.com/video/')) {
    info.platform = 'Bilibili';
    info.author = getText(['.up-name', '.bili-avatar-right-name', '.username']);
    
    const biliMetas = document.querySelectorAll('meta[itemprop="uploadDate"], meta[property="video:release_date"]');
    if (biliMetas.length > 0) {
      info.publishDate = biliMetas[biliMetas.length - 1].getAttribute('content');
    }
    if (!info.publishDate) {
      info.publishDate = getText(['.pubdate', '.pubdate-ip-text', '.video-data span[title]']);
    }
  }

  if (info.publishDate) {
    const dateMatch = info.publishDate.match(/\d{4}[-年/.]\d{1,2}[-月/.]\d{1,2}/);
    if (dateMatch) {
      info.publishDate = dateMatch[0];
    } else {
      info.publishDate = info.publishDate.split('T')[0].split(' ')[0];
    }
  }

  let cleanTitle = info.title.replace(/ - (哔哩哔哩|bilibili)$/i, '');
  let cleanUrl = info.url.split('?')[0];

  return `### [${cleanTitle}](${cleanUrl}) #内容 #笔记属性\n- **平台**: ${info.platform}\n- **作者**: ${info.author || '未获取到'}\n  **发布日期**: ${info.publishDate || '未获取到'}`;
}
