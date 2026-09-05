/**
 * FunnyVote Firebase 資料庫 50 筆熱門精選話題種子腳本
 * 涵蓋：AI科技、動漫遊戲、在地美食、職場打工、生活消費、情感人際、哲學奇想
 */
const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

const projectId = process.env.FIREBASE_PROJECT_ID || 'funny-vote-2e6be';
const serviceAccountPath = path.resolve(__dirname, '../service-account.json');

if (!admin.apps.length) {
  if (fs.existsSync(serviceAccountPath)) {
    const serviceAccount = require(serviceAccountPath);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId: projectId,
    });
  } else {
    admin.initializeApp({
      projectId: projectId,
    });
  }
}

const db = admin.firestore();

function generateNgrams(text) {
  const ngrams = new Set();
  const clean = text.trim();
  // 單字 + 雙字詞切詞
  for (let i = 0; i < clean.length; i++) {
    ngrams.add(clean.charAt(i).toLowerCase());
    if (i < clean.length - 1) {
      ngrams.add(clean.substring(i, i + 2).toLowerCase());
    }
  }
  // 英文單詞提取
  const words = clean.match(/[a-zA-Z0-9]+/g);
  if (words) {
    words.forEach(w => ngrams.add(w.toLowerCase()));
  }
  return Array.from(ngrams);
}

const now = Date.now();

// 50 個熱門話題資料定義
const rawPolls = [
  // --- 1. AI 與科技趨勢 (1-8) ---
  {
    pollId: 'poll_tech_01',
    title: '2026 年你日常最頻繁使用的 AI 工具是？',
    authorName: '極客科技狂',
    authorIcon: 'https://api.dicebear.com/7.x/avataaars/png?seed=techgeek',
    imageUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&auto=format&fit=crop&q=80',
    category: 'hot',
    maxOption: 1,
    options: [
      { id: 'opt_1', title: 'ChatGPT (OpenAI)', votes: 540 },
      { id: 'opt_2', title: 'Claude (Anthropic)', votes: 480 },
      { id: 'opt_3', title: 'Gemini (Google)', votes: 360 },
      { id: 'opt_4', title: 'Cursor / GitHub Copilot', votes: 290 },
      { id: 'opt_5', title: 'Perplexity AI 搜尋', votes: 180 },
    ],
  },
  {
    pollId: 'poll_tech_02',
    title: '未來 3 年內，你認為哪種職位受到 AI 衝擊最大？',
    authorName: '職場觀察家',
    authorIcon: 'https://api.dicebear.com/7.x/avataaars/png?seed=career',
    imageUrl: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&auto=format&fit=crop&q=80',
    category: 'hot',
    maxOption: 2,
    options: [
      { id: 'opt_1', title: '初階程式設計與程式碼維護', votes: 410 },
      { id: 'opt_2', title: '基礎文字翻譯與文案潤飾', votes: 520 },
      { id: 'opt_3', title: '商業插畫與概念美術設計', votes: 390 },
      { id: 'opt_4', title: '客服人員與初階數據登錄', votes: 470 },
      { id: 'opt_5', title: '全面賦能，不會被取代只會提高門檻', votes: 230 },
    ],
  },
  {
    pollId: 'poll_tech_03',
    title: '寫 Code 效率神器大對決：你最愛哪款編輯器/IDE？',
    authorName: '架構師阿童',
    authorIcon: 'https://api.dicebear.com/7.x/avataaars/png?seed=heaton',
    imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80',
    category: 'hot',
    maxOption: 1,
    options: [
      { id: 'opt_1', title: 'Cursor (原生 AI 強大整合)', votes: 610 },
      { id: 'opt_2', title: 'VS Code (經典外掛生態豐富)', votes: 530 },
      { id: 'opt_3', title: 'Android Studio / IntelliJ IDEA', votes: 420 },
      { id: 'opt_4', title: 'Neovim / Vim (極致輕量終端流)', votes: 190 },
    ],
  },
  {
    pollId: 'poll_tech_04',
    title: '智慧型眼鏡 (Smart Glasses) 能否在 5 年內取代手機？',
    authorName: '穿戴設備玩家',
    authorIcon: 'https://api.dicebear.com/7.x/avataaars/png?seed=glasses',
    imageUrl: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&auto=format&fit=crop&q=80',
    category: 'new',
    maxOption: 1,
    options: [
      { id: 'opt_1', title: '一定會，語音+視覺抬頭顯示是終極形態', votes: 140 },
      { id: 'opt_2', title: '能分擔日常通知，但手機大螢幕無可取代', votes: 380 },
      { id: 'opt_3', title: '續航與發熱問題短期難解，只是極客玩具', votes: 210 },
      { id: 'opt_4', title: '觀望生態發展與價格表現', votes: 95 },
    ],
  },
  {
    pollId: 'poll_tech_05',
    title: '家中最能顯著提升生活幸福感的智慧家電？',
    authorName: '智慧生活家',
    authorIcon: 'https://api.dicebear.com/7.x/avataaars/png?seed=smarthome',
    imageUrl: 'https://images.unsplash.com/photo-1558002038-1055907df827?w=800&auto=format&fit=crop&q=80',
    category: 'hot',
    maxOption: 2,
    options: [
      { id: 'opt_1', title: '洗烘脫一體洗衣機 / 乾衣機', votes: 620 },
      { id: 'opt_2', title: '全自動洗拖洗地掃地機器人', votes: 590 },
      { id: 'opt_3', title: '智慧門鎖 (徹底告別帶鑰匙)', votes: 450 },
      { id: 'opt_4', title: '洗碗機 (家庭和睦終極救星)', votes: 580 },
      { id: 'opt_5', title: '智慧冷氣遠端定時開關', votes: 290 },
    ],
  },
  {
    pollId: 'poll_tech_06',
    title: '如果現在換新車，你會優先考慮哪種動力？',
    authorName: '車壇老司機',
    authorIcon: 'https://api.dicebear.com/7.x/avataaars/png?seed=driver',
    imageUrl: 'https://images.unsplash.com/photo-1563720223185-11003d516935?w=800&auto=format&fit=crop&q=80',
    category: 'new',
    maxOption: 1,
    options: [
      { id: 'opt_1', title: '油電複合動力 Hybrid (省油無里程焦慮)', votes: 460 },
      { id: 'opt_2', title: '純電動車 EV (極速靜音、家用充電方便)', votes: 310 },
      { id: 'opt_3', title: '傳統純燃油車 (熱血引擎聲浪、機械可靠)', votes: 220 },
      { id: 'opt_4', title: '大眾運輸+共享機車，不買車最省錢', votes: 340 },
    ],
  },
  {
    pollId: 'poll_tech_07',
    title: '你認為 AGI (通用人工智慧) 什麼時候會真正普及？',
    authorName: 'AI 研究員',
    authorIcon: 'https://api.dicebear.com/7.x/avataaars/png?seed=airesearch',
    imageUrl: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&auto=format&fit=crop&q=80',
    category: 'new',
    maxOption: 1,
    options: [
      { id: 'opt_1', title: '2026 ~ 2027 年 (技術爆發超乎想像)', votes: 190 },
      { id: 'opt_2', title: '2028 ~ 2030 年 (演算法與算力成熟期)', votes: 350 },
      { id: 'opt_3', title: '2035 年之後 (需要基礎物理與能源突破)', votes: 240 },
      { id: 'opt_4', title: '只是行銷噱頭，真正的通用智慧遙不可及', votes: 80 },
    ],
  },
  {
    pollId: 'poll_tech_08',
    title: '換新手機時，你最看重的硬體規格是？',
    authorName: '3C 評測小狂熱',
    authorIcon: 'https://api.dicebear.com/7.x/avataaars/png?seed=tech',
    imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format&fit=crop&q=80',
    category: 'hot',
    maxOption: 1,
    options: [
      { id: 'opt_1', title: '電池容量與極速快充', votes: 410 },
      { id: 'opt_2', title: '相機夜拍與望遠鏡頭表現', votes: 290 },
      { id: 'opt_3', title: '螢幕高更新率與護眼色彩表現', votes: 180 },
      { id: 'opt_4', title: '外型設計與握持輕薄手感', votes: 110 },
    ],
  },

  // --- 2. 動漫、ACG 與遊戲熱潮 (9-16) ---
  {
    pollId: 'poll_acg_09',
    title: '2026 年你最期待哪部重磅神作續集動畫？',
    authorName: 'FunnyVote 官方小編',
    authorIcon: 'https://api.dicebear.com/7.x/avataaars/png?seed=admin',
    imageUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&auto=format&fit=crop&q=80',
    category: 'hot',
    maxOption: 1,
    options: [
      { id: 'opt_1', title: '葬送的芙莉蓮 第二季', votes: 720 },
      { id: 'opt_2', title: '咒術迴戰 死滅迴游篇', votes: 490 },
      { id: 'opt_3', title: '鬼滅之刃 無限城篇 (劇場版三部曲)', votes: 650 },
      { id: 'opt_4', title: '一拳超人 第三季', votes: 310 },
      { id: 'opt_5', title: '鏈鋸人 蕾潔篇', votes: 430 },
    ],
  },
  {
    pollId: 'poll_acg_10',
    title: '歷代最偉大的「開放世界 RPG」遊戲之王？',
    authorName: '白金成就黨',
    authorIcon: 'https://api.dicebear.com/7.x/avataaars/png?seed=gamer',
    imageUrl: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=800&auto=format&fit=crop&q=80',
    category: 'hot',
    maxOption: 1,
    options: [
      { id: 'opt_1', title: '薩爾達傳說：曠野之息 (BOTW)', votes: 850 },
      { id: 'opt_2', title: '艾爾登法環 (Elden Ring)', votes: 780 },
      { id: 'opt_3', title: '碧血狂殺 2 (Red Dead Redemption 2)', votes: 690 },
      { id: 'opt_4', title: '巫師 3：狂獵 (The Witcher 3)', votes: 520 },
      { id: 'opt_5', title: '俠盜獵車手 5 (GTA V)', votes: 480 },
    ],
  },
  {
    pollId: 'poll_acg_11',
    title: '如果能轉生到異世界，你最想獲得什麼神級被動技能？',
    authorName: '異世界重度患者',
    authorIcon: 'https://api.dicebear.com/7.x/avataaars/png?seed=isekai',
    imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80',
    category: 'hot',
    maxOption: 1,
    options: [
      { id: 'opt_1', title: '絕對防禦 (免疫一切物理與魔法傷害)', votes: 580 },
      { id: 'opt_2', title: '大賢者解析 (瞬間理解並學會所有技能)', votes: 630 },
      { id: 'opt_3', title: '無限金錢與最高幸運值', votes: 490 },
      { id: 'opt_4', title: '超速再生不死之身', votes: 320 },
      { id: 'opt_5', title: '隨意召喚現代科技與外賣', votes: 280 },
    ],
  },
  {
    pollId: 'poll_acg_12',
    title: '航海王 (One Piece) 最終大密寶究竟是什麼？',
    authorName: '草帽團水手',
    authorIcon: 'https://api.dicebear.com/7.x/avataaars/png?seed=luffy',
    imageUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&auto=format&fit=crop&q=80',
    category: 'new',
    maxOption: 1,
    options: [
      { id: 'opt_1', title: '歷史真相、古代兵器與推翻世界政府的開關', votes: 390 },
      { id: 'opt_2', title: '將四海合一 (All Blue) 的物理設計圖', votes: 270 },
      { id: 'opt_3', title: '喬伊波伊留給全世界的一場巨大狂歡笑話', votes: 310 },
      { id: 'opt_4', title: '真正無盡的黃金與財寶', votes: 85 },
    ],
  },
  {
    pollId: 'poll_acg_13',
    title: '任天堂次世代新主機 (Switch 2) 推出你會第一時間買嗎？',
    authorName: '老任忠粉',
    authorIcon: 'https://api.dicebear.com/7.x/avataaars/png?seed=nintendo',
    imageUrl: 'https://images.unsplash.com/photo-1578303512597-8be6373789c0?w=800&auto=format&fit=crop&q=80',
    category: 'hot',
    maxOption: 1,
    options: [
      { id: 'opt_1', title: '首發必搶！不管護航陣容都要買', votes: 420 },
      { id: 'opt_2', title: '看護航首發陣容 (如新瑪利歐/薩爾達) 決定', votes: 530 },
      { id: 'opt_3', title: '等推出 1-2 年出 OLED 或改良加強版再買', votes: 290 },
      { id: 'opt_4', title: '目前舊版 Switch / Steam Deck 依然很夠玩', votes: 190 },
    ],
  },
  {
    pollId: 'poll_acg_14',
    title: '射擊競技/大逃殺遊戲，你目前玩得最多的是？',
    authorName: '電競槍神',
    authorIcon: 'https://api.dicebear.com/7.x/avataaars/png?seed=fps',
    imageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80',
    category: 'new',
    maxOption: 1,
    options: [
      { id: 'opt_1', title: 'Apex Legends (英雄大逃殺)', votes: 380 },
      { id: 'opt_2', title: '特戰英豪 VALORANT', votes: 440 },
      { id: 'opt_3', title: 'Counter-Strike 2 (CS2)', votes: 290 },
      { id: 'opt_4', title: '決勝時刻：現代戰域 Warzone', votes: 180 },
      { id: 'opt_5', title: 'PUBG 絕地求生', votes: 150 },
    ],
  },
  {
    pollId: 'poll_acg_15',
    title: '心目中催淚指數第一名、看完必哭的動畫神作？',
    authorName: '動漫小迷弟',
    authorIcon: 'https://api.dicebear.com/7.x/avataaars/png?seed=comic',
    imageUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&auto=format&fit=crop&q=80',
    category: 'hot',
    maxOption: 1,
    options: [
      { id: 'opt_1', title: 'CLANNAD AFTER STORY', votes: 520 },
      { id: 'opt_2', title: '未聞花名 (我們仍未知道那天所看見的花名)', votes: 480 },
      { id: 'opt_3', title: '四月是你的謊言', votes: 510 },
      { id: 'opt_4', title: '紫羅蘭永恆花園 (第 10 話與劇場版)', votes: 460 },
      { id: 'opt_5', title: '螢火蟲之墓', votes: 310 },
    ],
  },
  {
    pollId: 'poll_acg_16',
    title: '英雄聯盟 (LoL) 職業電競史上最偉大選手？',
    authorName: '召喚師峽谷導師',
    authorIcon: 'https://api.dicebear.com/7.x/avataaars/png?seed=lol',
    imageUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&auto=format&fit=crop&q=80',
    category: 'new',
    maxOption: 1,
    options: [
      { id: 'opt_1', title: 'Faker (大魔王五冠神話，無可爭議 GOAT)', votes: 980 },
      { id: 'opt_2', title: 'Ruler (極致走位與頂尖輸出射手)', votes: 65 },
      { id: 'opt_3', title: 'TheShy (顛峰時期天神下凡極限操作)', votes: 120 },
      { id: 'opt_4', title: 'Chovy (完美的補兵與對線機器)', votes: 85 },
    ],
  },

  // --- 3. 台灣在地美食與宵夜 (17-24) ---
  {
    pollId: 'poll_food_17',
    title: '台灣最強國民夜市美食之王？',
    authorName: '深夜吃貨大師',
    authorIcon: 'https://api.dicebear.com/7.x/avataaars/png?seed=foodie',
    imageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&auto=format&fit=crop&q=80',
    category: 'hot',
    maxOption: 2,
    options: [
      { id: 'opt_1', title: '現炸鹹酥雞配九層塔大蒜', votes: 680 },
      { id: 'opt_2', title: '炭烤大腸包小腸', votes: 430 },
      { id: 'opt_3', title: '現炸地瓜球 (QQ蛋)', votes: 490 },
      { id: 'opt_4', title: '藥膳排骨湯 / 麻油雞', votes: 310 },
      { id: 'opt_5', title: '蚵仔煎配甜辣醬', votes: 370 },
    ],
  },
  {
    pollId: 'poll_food_18',
    title: '早餐店「大冰奶」究竟是通腸神器還是心靈慰藉？',
    authorName: '早餐店老闆娘',
    authorIcon: 'https://api.dicebear.com/7.x/avataaars/png?seed=milktea',
    imageUrl: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=800&auto=format&fit=crop&q=80',
    category: 'hot',
    maxOption: 1,
    options: [
      { id: 'opt_1', title: '每喝必瀉！醫學無法解釋的天然通腸藥', votes: 640 },
      { id: 'opt_2', title: '腸胃鐵打的完全沒事，單純好喝提神', votes: 280 },
      { id: 'opt_3', title: '雖知是高熱量奶精炸彈，但早餐必點一杯', votes: 430 },
      { id: 'opt_4', title: '我是健康派，只喝無糖豆漿或黑咖啡', votes: 190 },
    ],
  },
  {
    pollId: 'poll_food_19',
    title: '火鍋湯底第一選擇，你吃鍋首選哪一種？',
    authorName: '火鍋糾察隊',
    authorIcon: 'https://api.dicebear.com/7.x/avataaars/png?seed=hotpot',
    imageUrl: 'https://images.unsplash.com/photo-1547928576-a4a33237cbc3?w=800&auto=format&fit=crop&q=80',
    category: 'hot',
    maxOption: 1,
    options: [
      { id: 'opt_1', title: '麻辣鍋 (老油條+鴨血豆腐無限續)', votes: 620 },
      { id: 'opt_2', title: '日式昆布柴魚蔬菜鍋 (清爽鮮美百搭)', votes: 450 },
      { id: 'opt_3', title: '酸菜白肉鍋 (解膩酸爽大開胃)', votes: 310 },
      { id: 'opt_4', title: '香濃牛奶起司鍋 (濃郁奶香肉片絕配)', votes: 290 },
      { id: 'opt_5', title: '泰式酸辣冬蔭功鍋', votes: 180 },
    ],
  },
  {
    pollId: 'poll_food_20',
    title: '手搖飲無糖純茶，你私心最愛喝哪一家？',
    authorName: '茶道品評家',
    authorIcon: 'https://api.dicebear.com/7.x/avataaars/png?seed=tea',
    imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80',
    category: 'new',
    maxOption: 1,
    options: [
      { id: 'opt_1', title: '得正 (春烏龍系列極神)', votes: 560 },
      { id: 'opt_2', title: '麻古茶坊 (金萱雙Q / 翡翠綠)', votes: 390 },
      { id: 'opt_3', title: '可不可熟成紅茶 (麗春/熟成)', votes: 410 },
      { id: 'opt_4', title: '五桐號 (五桐茶/青茶)', votes: 320 },
      { id: 'opt_5', title: '迷客夏 (大正紅茶)', votes: 210 },
    ],
  },
  {
    pollId: 'poll_food_21',
    title: '便當盒裡面最讓你一打開就崩潰的配菜？',
    authorName: '午餐挑食鬼',
    authorIcon: 'https://api.dicebear.com/7.x/avataaars/png?seed=bento',
    imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80',
    category: 'hot',
    maxOption: 2,
    options: [
      { id: 'opt_1', title: '三色豆 (玉米紅蘿蔔青豆三煞)', votes: 780 },
      { id: 'opt_2', title: '螢光黃咖哩 (全是太白粉毫無咖哩香)', votes: 610 },
      { id: 'opt_3', title: '電話線海茸 (黑黑捲捲口感怪異)', votes: 420 },
      { id: 'opt_4', title: '軟爛苦瓜 / 茄子', votes: 360 },
      { id: 'opt_5', title: '豆棗 (甜甜紅色絲狀物居然算一道菜)', votes: 290 },
    ],
  },
  {
    pollId: 'poll_food_22',
    title: '台灣在地小吃臭豆腐，你派別是酥炸還是清蒸麻辣？',
    authorName: '臭味相投俱樂部',
    authorIcon: 'https://api.dicebear.com/7.x/avataaars/png?seed=tofu',
    imageUrl: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=80',
    category: 'new',
    maxOption: 1,
    options: [
      { id: 'opt_1', title: '現炸金黃酥脆+塞滿台式酸甜泡菜大蒜', votes: 670 },
      { id: 'opt_2', title: '深坑清蒸麻辣鴨血臭豆腐煲', votes: 310 },
      { id: 'opt_3', title: '炭烤臭豆腐串 (刷滿特調醬汁花生粉)', votes: 240 },
      { id: 'opt_4', title: '小孩子才做選擇，只要夠臭我都吃', votes: 190 },
    ],
  },
  {
    pollId: 'poll_food_23',
    title: '吃台灣牛肉麵，你永遠的第一名流派？',
    authorName: '牛肉麵巡禮者',
    authorIcon: 'https://api.dicebear.com/7.x/avataaars/png?seed=noodle',
    imageUrl: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800&auto=format&fit=crop&q=80',
    category: 'new',
    maxOption: 1,
    options: [
      { id: 'opt_1', title: '川味紅燒 (濃郁牛油豆瓣醬香、重口味)', votes: 530 },
      { id: 'opt_2', title: '甘甜清燉 (慢熬牛骨清湯、原汁原味)', votes: 390 },
      { id: 'opt_3', title: '鮮甜番茄 (酸爽濃醇果酸解油膩)', votes: 340 },
      { id: 'opt_4', title: '乾拌牛肉麵配一碗清牛肉湯', votes: 160 },
    ],
  },
  {
    pollId: 'poll_food_24',
    title: '吃披薩加鳳梨 (夏威夷披薩) 是美食還是犯罪？',
    authorName: '義大利廚神審判',
    authorIcon: 'https://api.dicebear.com/7.x/avataaars/png?seed=pizza',
    imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&auto=format&fit=crop&q=80',
    category: 'hot',
    maxOption: 1,
    options: [
      { id: 'opt_1', title: '絕世美味！酸甜鳳梨配火腿起司超解膩', votes: 590 },
      { id: 'opt_2', title: '義大利人的噩夢，熱水果上披薩不可原諒', votes: 320 },
      { id: 'opt_3', title: '不排斥但也不會主動點', votes: 210 },
      { id: 'opt_4', title: '香菜皮蛋豬血糕披薩才是終極挑戰', votes: 380 },
    ],
  },

  // --- 4. 職場生存與打工人心聲 (25-32) ---
  {
    pollId: 'poll_work_25',
    title: '遠端工作 (WFH) vs 混合辦公 vs 每天進辦公室？',
    authorName: '自由打工人',
    authorIcon: 'https://api.dicebear.com/7.x/avataaars/png?seed=remote',
    imageUrl: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800&auto=format&fit=crop&q=80',
    category: 'hot',
    maxOption: 1,
    options: [
      { id: 'opt_1', title: '全遠端 WFH！省下通勤 2 小時自由無價', votes: 680 },
      { id: 'opt_2', title: '每週 2-3 天 Hybrid (平衡社交與效率)', votes: 520 },
      { id: 'opt_3', title: '每天進辦公室 (軟硬體設備齊、公私分明)', votes: 140 },
      { id: 'opt_4', title: '只要錢給到位、不亂加班，怎樣都行', votes: 310 },
    ],
  },
  {
    pollId: 'poll_work_26',
    title: '職場上最讓你一秒想要光速離職的主管特質？',
    authorName: '匿名社畜小組',
    authorIcon: 'https://api.dicebear.com/7.x/avataaars/png?seed=worker',
    imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80',
    category: 'hot',
    maxOption: 2,
    options: [
      { id: 'opt_1', title: '朝令夕改+出了事第一秒甩鍋給下屬', votes: 690 },
      { id: 'opt_2', title: '微觀管理 (連呼吸上廁所發呆都要管)', votes: 580 },
      { id: 'opt_3', title: '畫大餅幾年不加薪、只講情懷不給錢', votes: 620 },
      { id: 'opt_4', title: '情緒化、在公開群組或辦公室大呼小叫', votes: 540 },
      { id: 'opt_5', title: '不懂裝懂還愛瞎指揮專業人員', votes: 470 },
    ],
  },
  {
    pollId: 'poll_work_27',
    title: '開無意義冗長會議時，你的靈魂通常在做什麼？',
    authorName: '會議受害者',
    authorIcon: 'https://api.dicebear.com/7.x/avataaars/png?seed=meeting',
    imageUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop&q=80',
    category: 'new',
    maxOption: 1,
    options: [
      { id: 'opt_1', title: '表面嚴肅點頭，私下偷偷敲 Code / 滑手機', votes: 480 },
      { id: 'opt_2', title: '眼神聚焦放空，腦內思考今晚吃什麼', votes: 510 },
      { id: 'opt_3', title: '計算每分鐘大家浪費的公司時薪總和', votes: 260 },
      { id: 'opt_4', title: '直接在鍵盤上打哈欠爭取秒睡', votes: 190 },
    ],
  },
  {
    pollId: 'poll_work_28',
    title: '下班後收到老闆/主管的 LINE 或 Slack 訊息，你會？',
    authorName: '下班失聯狂',
    authorIcon: 'https://api.dicebear.com/7.x/avataaars/png?seed=offline',
    imageUrl: 'https://images.unsplash.com/photo-1577563908411-5077b6dc7624?w=800&auto=format&fit=crop&q=80',
    category: 'hot',
    maxOption: 1,
    options: [
      { id: 'opt_1', title: '長按預覽偷看，非生死交關明天上班再回', votes: 650 },
      { id: 'opt_2', title: '已讀不回或完全不點開，下班就是私人時間', votes: 430 },
      { id: 'opt_3', title: '責任心作祟秒回，然後陷入加班深淵', votes: 220 },
      { id: 'opt_4', title: '早就將工作通訊軟體關閉推播通知', votes: 340 },
    ],
  },
  {
    pollId: 'poll_work_29',
    title: '你換工作/跳槽時最無法妥協的優先條件？',
    authorName: '獵頭顧問阿倫',
    authorIcon: 'https://api.dicebear.com/7.x/avataaars/png?seed=headhunter',
    imageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&auto=format&fit=crop&q=80',
    category: 'new',
    maxOption: 1,
    options: [
      { id: 'opt_1', title: '總薪資福利顯著成長 (錢給到位受點委屈可)', votes: 620 },
      { id: 'opt_2', title: '健康無毒的團隊氛圍與好主管', votes: 490 },
      { id: 'opt_3', title: '通勤時間與工時長度 (拒絕每天通勤 2 小時)', votes: 380 },
      { id: 'opt_4', title: '技術挑戰與職涯成長性', votes: 210 },
    ],
  },
  {
    pollId: 'poll_work_30',
    title: '工作時必備的「提神續命飲品」霸主？',
    authorName: '咖啡因中毒者',
    authorIcon: 'https://api.dicebear.com/7.x/avataaars/png?seed=coffeeaddict',
    imageUrl: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&auto=format&fit=crop&q=80',
    category: 'hot',
    maxOption: 1,
    options: [
      { id: 'opt_1', title: '特濃冰美式黑咖啡 (苦澀喚醒靈魂)', votes: 590 },
      { id: 'opt_2', title: '燕麥奶拿鐵 (溫潤好喝兼顧飽足感)', votes: 410 },
      { id: 'opt_3', title: '能量飲料 (Red Bull / Monster)', votes: 270 },
      { id: 'opt_4', title: '無糖高山冷泡烏龍茶', votes: 320 },
      { id: 'opt_5', title: '純靠房貸、車貸與月底帳單的意志力', votes: 450 },
    ],
  },
  {
    pollId: 'poll_work_31',
    title: '週一上班症候群 (Monday Blues) 你最有效的急救法？',
    authorName: '週一厭世者',
    authorIcon: 'https://api.dicebear.com/7.x/avataaars/png?seed=monday',
    imageUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&auto=format&fit=crop&q=80',
    category: 'new',
    maxOption: 1,
    options: [
      { id: 'opt_1', title: '中午叫一頓平常捨不得吃的高級外送美食', votes: 460 },
      { id: 'opt_2', title: '買一杯平常不喝的全糖手搖飲療癒心情', votes: 390 },
      { id: 'opt_3', title: '開始看週末或下個連假的旅遊機票飯店', votes: 410 },
      { id: 'opt_4', title: '認命深呼吸，告訴自己只剩 4 天就放假', votes: 350 },
    ],
  },
  {
    pollId: 'poll_work_32',
    title: '在公司裡，你更傾向於當個「隱形人」還是「顯眼包」？',
    authorName: '職場心理師',
    authorIcon: 'https://api.dicebear.com/7.x/avataaars/png?seed=psy',
    imageUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&auto=format&fit=crop&q=80',
    category: 'new',
    maxOption: 1,
    options: [
      { id: 'opt_1', title: '徹底當隱形人，默默做好份內事準時下班', votes: 680 },
      { id: 'opt_2', title: '在關鍵時刻爭取表現，平常低調沉穩', votes: 490 },
      { id: 'opt_3', title: '當活躍的核心社交活躍分子', votes: 120 },
      { id: 'opt_4', title: '看當天的心情與同事契合度', votes: 160 },
    ],
  },

  // --- 5. 生活消費與日常瑣事 (33-40) ---
  {
    pollId: 'poll_life_33',
    title: '週末放假最 Chill 的放鬆充電方式？',
    authorName: '悠閒生活誌',
    authorIcon: 'https://api.dicebear.com/7.x/avataaars/png?seed=relax',
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80',
    category: 'hot',
    maxOption: 1,
    options: [
      { id: 'opt_1', title: '宅在家不設鬧鐘睡到飽追劇打遊戲', votes: 690 },
      { id: 'opt_2', title: '到大自然露營、爬山吸收芬多精', votes: 290 },
      { id: 'opt_3', title: '去文青咖啡廳點一杯手沖閱讀發呆', votes: 340 },
      { id: 'opt_4', title: '約三五好友逛街吃麻辣火鍋喝兩杯', votes: 420 },
    ],
  },
  {
    pollId: 'poll_life_34',
    title: '在外租屋族最讓人理智斷線的租屋大雷？',
    authorName: '租屋苦主大聯盟',
    authorIcon: 'https://api.dicebear.com/7.x/avataaars/png?seed=renter',
    imageUrl: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&auto=format&fit=crop&q=80',
    category: 'hot',
    maxOption: 2,
    options: [
      { id: 'opt_1', title: '隔音極差，半夜聽得到隔壁打呼走動聊天', votes: 720 },
      { id: 'opt_2', title: '潮濕發霉壁癌漏水嚴重', votes: 610 },
      { id: 'opt_3', title: '惡質房東巧立名目亂扣押金、一度電收6元', votes: 590 },
      { id: 'opt_4', title: '頂樓加蓋夏熱冬冷、電費爆表', votes: 410 },
      { id: 'opt_5', title: '出入複雜、鄰居衛生習慣極差生蟑螂', votes: 530 },
    ],
  },
  {
    pollId: 'poll_life_35',
    title: '網購包裹抵達超商後的取件速度？',
    authorName: '網購狂人',
    authorIcon: 'https://api.dicebear.com/7.x/avataaars/png?seed=shopper',
    imageUrl: 'https://images.unsplash.com/photo-1526367790999-0150786686a2?w=800&auto=format&fit=crop&q=80',
    category: 'new',
    maxOption: 1,
    options: [
      { id: 'opt_1', title: '秒取派！收到簡訊當天回家順路立刻領', votes: 610 },
      { id: 'opt_2', title: '收集狂派！等 2-3 個包裹都到齊一次拿', votes: 430 },
      { id: 'opt_3', title: '壓線派！收到最後一天退回警告才衝去領', votes: 240 },
      { id: 'opt_4', title: '拜託家人朋友順便幫忙領', votes: 110 },
    ],
  },
  {
    pollId: 'poll_life_36',
    title: '出國旅遊度假，你一生去不膩的首選國家？',
    authorName: '背包客走天下',
    authorIcon: 'https://api.dicebear.com/7.x/avataaars/png?seed=traveler',
    imageUrl: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=800&auto=format&fit=crop&q=80',
    category: 'hot',
    maxOption: 1,
    options: [
      { id: 'opt_1', title: '日本 (美食購物風景文化治安無懈可擊)', votes: 890 },
      { id: 'opt_2', title: '泰國 (海島度假按摩物價便宜超 Chill)', votes: 450 },
      { id: 'opt_3', title: '歐洲各國 (歷史古蹟浪漫莊園大景)', votes: 320 },
      { id: 'opt_4', title: '韓國 (潮流服飾韓食追星逛街)', votes: 280 },
      { id: 'opt_5', title: '台灣本島深度慢活環島', votes: 190 },
    ],
  },
  {
    pollId: 'poll_life_37',
    title: '晚上躺在床上準備睡覺時，你平均滑手機多久？',
    authorName: '失眠羊研究員',
    authorIcon: 'https://api.dicebear.com/7.x/avataaars/png?seed=sleepy',
    imageUrl: 'https://images.unsplash.com/photo-1511295742362-92c96b124e52?w=800&auto=format&fit=crop&q=80',
    category: 'hot',
    maxOption: 1,
    options: [
      { id: 'opt_1', title: '5-10 分鐘設個鬧鐘就關燈秒睡', votes: 160 },
      { id: 'opt_2', title: '30 分鐘左右回回訊息滑滑社群', votes: 450 },
      { id: 'opt_3', title: '1-2 小時不知不覺滑到凌晨', votes: 580 },
      { id: 'opt_4', title: '經常滑到手滑被手機正面砸到臉', votes: 340 },
    ],
  },
  {
    pollId: 'poll_life_38',
    title: '運動健身習慣，你目前維持最久的項目是？',
    authorName: '肌肉魔法使',
    authorIcon: 'https://api.dicebear.com/7.x/avataaars/png?seed=fitness',
    imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&auto=format&fit=crop&q=80',
    category: 'new',
    maxOption: 1,
    options: [
      { id: 'opt_1', title: '健身房重量訓練 / 器械重訓', votes: 460 },
      { id: 'opt_2', title: '戶外慢跑 / 河濱跑步機', votes: 320 },
      { id: 'opt_3', title: '羽球 / 籃球 / 游泳等球類運動', votes: 380 },
      { id: 'opt_4', title: '瑜珈 / 皮拉提斯伸展', votes: 240 },
      { id: 'opt_5', title: '在沙發上翻滾運動與呼吸運動', votes: 410 },
    ],
  },
  {
    pollId: 'poll_life_39',
    title: '洗澡洗澡時，你是屬於哪種風格流派？',
    authorName: '浴室歌王',
    authorIcon: 'https://api.dicebear.com/7.x/avataaars/png?seed=shower',
    imageUrl: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&auto=format&fit=crop&q=80',
    category: 'new',
    maxOption: 1,
    options: [
      { id: 'opt_1', title: '戰鬥澡派：10 分鐘內全身沖洗完畢乾淨俐落', votes: 510 },
      { id: 'opt_2', title: '放空享受派：20-30 分鐘熱水沖背沉思思考人生', votes: 590 },
      { id: 'opt_3', title: '精緻泡澡儀式派：40 分鐘以上放音樂點香氛泡澡', votes: 190 },
      { id: 'opt_4', title: '看當天疲勞與時間狀況動態切換', votes: 270 },
    ],
  },
  {
    pollId: 'poll_life_40',
    title: '換新手機時，舊手機能用通常多久換一次？',
    authorName: '數位極簡主義',
    authorIcon: 'https://api.dicebear.com/7.x/avataaars/png?seed=phoneuser',
    imageUrl: 'https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?w=800&auto=format&fit=crop&q=80',
    category: 'new',
    maxOption: 1,
    options: [
      { id: 'opt_1', title: '1 年年年換新，追求最新科技規格', votes: 120 },
      { id: 'opt_2', title: '2 ~ 3 年換一次，配合門號合約或電池衰退', votes: 610 },
      { id: 'opt_3', title: '4 ~ 5 年戰到極限，卡頓或壞掉才甘願換', votes: 530 },
      { id: 'opt_4', title: '換過電池再戰三年，能用就不換', votes: 240 },
    ],
  },

  // --- 6. 情感、人際與金錢觀 (41-46) ---
  {
    pollId: 'poll_social_41',
    title: '男女約會聚餐結帳時，你最認同的付款方式？',
    authorName: '情感調解員',
    authorIcon: 'https://api.dicebear.com/7.x/avataaars/png?seed=dating',
    imageUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&auto=format&fit=crop&q=80',
    category: 'hot',
    maxOption: 1,
    options: [
      { id: 'opt_1', title: '輪流請客！這次你請下次我出，有來有往最舒服', votes: 640 },
      { id: 'opt_2', title: '嚴格精準 AA 制，各自為自己的消費買單', votes: 410 },
      { id: 'opt_3', title: '主動發起邀約的一方負責大頭，對方請飲料', votes: 350 },
      { id: 'opt_4', title: '誰收入高誰多出一點，彼此有默契就好', votes: 220 },
    ],
  },
  {
    pollId: 'poll_social_42',
    title: '個人投資理財，目前你的資產配置主力是？',
    authorName: '財富自由實踐者',
    authorIcon: 'https://api.dicebear.com/7.x/avataaars/png?seed=finance',
    imageUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&auto=format&fit=crop&q=80',
    category: 'hot',
    maxOption: 1,
    options: [
      { id: 'opt_1', title: '大盤指數型 ETF (如 0050, 006208, VOO, QQQ)', votes: 680 },
      { id: 'opt_2', title: '高股息 ETF / 債券領息定存穩健流', votes: 470 },
      { id: 'opt_3', title: '個股波段操作 / 台積電信仰長期持有', votes: 420 },
      { id: 'opt_4', title: '比特幣 / 加密貨幣等高風險高報酬資產', votes: 190 },
      { id: 'opt_5', title: '月光族活在當下即時行樂派', votes: 150 },
    ],
  },
  {
    pollId: 'poll_social_43',
    title: '好朋友向你開口借錢，你的最高處事準則？',
    authorName: '處世哲學家',
    authorIcon: 'https://api.dicebear.com/7.x/avataaars/png?seed=wisdom',
    imageUrl: 'https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=800&auto=format&fit=crop&q=80',
    category: 'new',
    maxOption: 1,
    options: [
      { id: 'opt_1', title: '借出去的錢就當送他，做好拿不回來的心理準備', votes: 530 },
      { id: 'opt_2', title: '堅決不借！親兄弟明算帳，避免連朋友都做不成', votes: 480 },
      { id: 'opt_3', title: '救急不救窮，小額應急可以，大額請走銀行貸款', votes: 510 },
      { id: 'opt_4', title: '幫他介紹合法正規信用貸款途徑', votes: 180 },
    ],
  },
  {
    pollId: 'poll_social_44',
    title: '假日臨時被朋友取消約會/放鴿子，你當下的真實心情？',
    authorName: '內向社恐人',
    authorIcon: 'https://api.dicebear.com/7.x/avataaars/png?seed=introvert',
    imageUrl: 'https://images.unsplash.com/photo-1516302752625-fcc3c50ae61f?w=800&auto=format&fit=crop&q=80',
    category: 'hot',
    maxOption: 1,
    options: [
      { id: 'opt_1', title: '暗爽到不行！不用化妝換衣服換來一整天自由時光', votes: 760 },
      { id: 'opt_2', title: '稍微失落但體諒對方，立刻轉移陣地去想去的地方', votes: 380 },
      { id: 'opt_3', title: '非常火大！嚴重浪費他人時間，直接列入冷宮名單', votes: 410 },
      { id: 'opt_4', title: '立刻約其他隨和的朋友出門', votes: 130 },
    ],
  },
  {
    pollId: 'poll_social_45',
    title: '日常購物時，你是「全網比價狂」還是「看對眼就買」？',
    authorName: '精明消費者',
    authorIcon: 'https://api.dicebear.com/7.x/avataaars/png?seed=smartbuyer',
    imageUrl: 'https://images.unsplash.com/photo-1556742049-0a67e5572293?w=800&auto=format&fit=crop&q=80',
    category: 'new',
    maxOption: 1,
    options: [
      { id: 'opt_1', title: '比價狂魔！查歷史價格、折價券、信用卡回饋才買', votes: 580 },
      { id: 'opt_2', title: '時間成本更貴派！價格差不多口碑好直接下單', votes: 490 },
      { id: 'opt_3', title: '衝動購物型！看對眼、主播/網紅一推就下單', votes: 230 },
      { id: 'opt_4', title: '加進購物車放一週冷靜，80% 後來都沒買', votes: 420 },
    ],
  },
  {
    pollId: 'poll_social_46',
    title: '對於社群平台 (IG, Threads, FB, 小紅書)，你現在的狀態？',
    authorName: '數位排毒體驗者',
    authorIcon: 'https://api.dicebear.com/7.x/avataaars/png?seed=digitaldetox',
    imageUrl: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&auto=format&fit=crop&q=80',
    category: 'new',
    maxOption: 1,
    options: [
      { id: 'opt_1', title: '重度滑客！每天開啟好幾十次看廢文與短影音', votes: 540 },
      { id: 'opt_2', title: '只看不發的潛水客，當作資訊與娛樂來源', votes: 610 },
      { id: 'opt_3', title: '偶爾發生活動態當日記，只給摯友看', votes: 350 },
      { id: 'opt_4', title: '嚴重數位疲倦，已關閉通知或卸載 App', votes: 220 },
    ],
  },

  // --- 7. 奇想、腦洞與哲學辯論 (47-50) ---
  {
    pollId: 'poll_mind_47',
    title: '如果能免費獲得一項超能力，你人生必選哪一項？',
    authorName: '超能力研究所',
    authorIcon: 'https://api.dicebear.com/7.x/avataaars/png?seed=superhero',
    imageUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&auto=format&fit=crop&q=80',
    category: 'hot',
    maxOption: 1,
    options: [
      { id: 'opt_1', title: '瞬間移動 (無懼距離，隨時出現在世界任何角落)', votes: 730 },
      { id: 'opt_2', title: '時間暫停 / 回溯 (擁有反悔並重來人生的機會)', votes: 690 },
      { id: 'opt_3', title: '讀心術 (看穿任何人內心真實想法)', votes: 320 },
      { id: 'opt_4', title: '怎麼吃都吃不胖、永遠維持健康青春活力', votes: 540 },
    ],
  },
  {
    pollId: 'poll_mind_48',
    title: '如果能預先看到自己未來的「人生劇本」，你願意看嗎？',
    authorName: '命運觀測員',
    authorIcon: 'https://api.dicebear.com/7.x/avataaars/png?seed=destiny',
    imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80',
    category: 'hot',
    maxOption: 1,
    options: [
      { id: 'opt_1', title: '堅決不看！未知的生活探索與選擇才有意義', votes: 620 },
      { id: 'opt_2', title: '一定要看！能提前避開災難和大坑，輕鬆躺平', votes: 510 },
      { id: 'opt_3', title: '只看重大財富節點與關鍵戀愛結婚對象', votes: 460 },
      { id: 'opt_4', title: '看了如果無法改變只會徒增痛苦，所以不看', votes: 340 },
    ],
  },
  {
    pollId: 'poll_mind_49',
    title: '你認為人類是否生活在高等文明的「電腦虛擬世界」中？',
    authorName: '矩陣覺醒者',
    authorIcon: 'https://api.dicebear.com/7.x/avataaars/png?seed=matrix',
    imageUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80',
    category: 'new',
    maxOption: 1,
    options: [
      { id: 'opt_1', title: '極大機率是！量子力學雙狹縫實驗就像渲染優化', votes: 470 },
      { id: 'opt_2', title: '純粹科幻想像，肉身痛苦與生老病死如此真實', votes: 360 },
      { id: 'opt_3', title: '無法證偽，就算是虛擬的也得好好過好當下生活', votes: 620 },
      { id: 'opt_4', title: '希望模擬器管理員能調高我的帳戶餘額', votes: 580 },
    ],
  },
  {
    pollId: 'poll_mind_50',
    title: '假如收到外星文明的宇宙信號，地球人類應該主動回應嗎？',
    authorName: '三體宇宙學者',
    authorIcon: 'https://api.dicebear.com/7.x/avataaars/png?seed=alien',
    imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80',
    category: 'hot',
    maxOption: 1,
    options: [
      { id: 'opt_1', title: '不要回答！宇宙是黑暗森林，暴露坐標招致毀滅', votes: 780 },
      { id: 'opt_2', title: '勇敢回應！促進跨星際科技大躍進與新時代', votes: 240 },
      { id: 'opt_3', title: '先靜觀其變，暗中監聽並全面發展防衛科技', votes: 530 },
      { id: 'opt_4', title: '相信能星際航行的文明必然具備善良道德水準', votes: 120 },
    ],
  },
];

async function seedFiftyPolls() {
  console.log(`🚀 開始寫入 50 筆熱門精選話題至 Firestore (專案: ${projectId})...`);

  // 分批寫入：每批最多 10 個 Polls（含子集合約 50-60 次寫入），確保小於 500 筆上限
  const chunkSize = 10;
  for (let i = 0; i < rawPolls.length; i += chunkSize) {
    const chunk = rawPolls.slice(i, i + chunkSize);
    const batch = db.batch();

    for (const p of chunk) {
      const pollRef = db.collection('polls').doc(p.pollId);

      // 計算總票數
      const totalVotes = p.options.reduce((sum, opt) => sum + opt.votes, 0);

      // 前兩名選項快取 (反正規化)
      const sortedOptions = [...p.options].sort((a, b) => b.votes - a.votes);
      const topOptions = sortedOptions.slice(0, 2).map((opt) => ({
        optionId: opt.id,
        title: opt.title,
        voteCount: opt.votes,
      }));

      const searchKeywords = generateNgrams(p.title);
      const createdAt = now - Math.floor(Math.random() * 86400000 * 7); // 最近 7 天內

      const pollData = {
        pollId: p.pollId,
        title: p.title,
        authorId: 'user_official',
        authorName: p.authorName,
        authorIcon: p.authorIcon,
        imageUrl: p.imageUrl,
        category: p.category,
        security: '00',
        isNeedPassword: false,
        isCanPreviewResult: true,
        isUserCanAddOption: true,
        minOption: 1,
        maxOption: p.maxOption || 1,
        optionCount: p.options.length,
        totalVotes: totalVotes,
        searchKeywords: searchKeywords,
        topOptions: topOptions,
        startTime: createdAt,
        endTime: createdAt + 86400000 * 30,
        createdAt: createdAt,
      };

      batch.set(pollRef, pollData, { merge: true });

      // 寫入 options 子集合
      p.options.forEach((opt, idx) => {
        const optRef = pollRef.collection('options').doc(opt.id);
        batch.set(
          optRef,
          {
            optionId: opt.id,
            title: opt.title,
            voteCount: opt.votes,
            displayOrder: idx + 1,
            creatorId: 'user_official',
            createdAt: createdAt,
          },
          { merge: true }
        );
      });
    }

    await batch.commit();
    console.log(`✅ 已寫入第 ${i + 1} ~ ${Math.min(i + chunkSize, rawPolls.length)} 筆投票！`);
  }

  console.log('🎉 50 筆熱門精選話題寫入 Firestore 完成！');
}

seedFiftyPolls()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('❌ 寫入失敗:', err);
    process.exit(1);
  });
