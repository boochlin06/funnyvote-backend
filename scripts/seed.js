/**
 * FunnyVote Firebase 資料庫種子初始化腳本 (Seed Script)
 * 建立豐富的預設內容：焦點推薦橫幅、熱門排行榜投票、最新上架投票與多樣選項。
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

// 輔助函式：Bi-gram 繁簡切詞
function generateNgrams(text) {
  const ngrams = new Set();
  const clean = text.trim();
  for (let i = 0; i < clean.length - 1; i++) {
    ngrams.add(clean.substring(i, i + 2).toLowerCase());
  }
  return Array.from(ngrams);
}

async function seed() {
  console.log(`🚀 開始初始化 FunnyVote 預設精選內容 (專案: ${projectId})...`);

  // 1. 初始化 Promotions 橫幅
  const promoRef = db.collection('promotions');
  console.log('📦 寫入 4 筆精選焦點推薦橫幅 (Promotions)...');
  const promotions = [
    {
      id: 'promo_01',
      title: '2026 年度最受歡迎動畫投票大賽火熱進行中！',
      imageUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&auto=format&fit=crop&q=80',
      actionUrl: 'funnyvote://poll/poll_anime_2026',
      displayOrder: 1,
      isActive: true,
    },
    {
      id: 'promo_02',
      title: '工程師必備：加班提神法寶大對決！',
      imageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80',
      actionUrl: 'funnyvote://poll/poll_dev_energy',
      displayOrder: 2,
      isActive: true,
    },
    {
      id: 'promo_03',
      title: '台灣夜市最強國民美食榜單出爐！',
      imageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&auto=format&fit=crop&q=80',
      actionUrl: 'funnyvote://poll/poll_taiwan_food',
      displayOrder: 3,
      isActive: true,
    },
    {
      id: 'promo_04',
      title: '日本最想移居城市大調查！',
      imageUrl: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=800&auto=format&fit=crop&q=80',
      actionUrl: 'funnyvote://poll/poll_japan_city',
      displayOrder: 4,
      isActive: true,
    },
  ];

  for (const p of promotions) {
    await promoRef.doc(p.id).set(p, { merge: true });
  }

  // 2. 初始化豐富的 Polls (熱門與最新)
  const pollRef = db.collection('polls');
  console.log('📦 寫入 8 筆真實熱門與最新投票資料 (Polls)...');

  const now = Date.now();
  const samplePolls = [
    // --- 熱門投票 (Hot) ---
    {
      pollId: 'poll_anime_2026',
      title: '2026 年你最期待的話題動畫是哪部？',
      authorId: 'user_admin',
      authorName: 'FunnyVote 官方小編',
      authorIcon: 'https://api.dicebear.com/7.x/bottts/png?seed=funnyvote',
      imageUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&auto=format&fit=crop&q=80',
      category: 'hot',
      security: '00',
      isNeedPassword: false,
      isCanPreviewResult: true,
      isUserCanAddOption: true,
      minOption: 1,
      maxOption: 2,
      optionCount: 4,
      totalVotes: 642,
      searchKeywords: generateNgrams('2026 年你最期待的話題動畫是哪部？'),
      topOptions: [
        { optionId: 'opt_1', title: '葬送的芙莉蓮 第二季', voteCount: 289 },
        { optionId: 'opt_2', title: '咒術迴戰 死滅迴游篇', voteCount: 198 },
      ],
      startTime: now - 86400000 * 5,
      endTime: now + 86400000 * 25,
      createdAt: now - 86400000 * 5,
      options: [
        { optionId: 'opt_1', title: '葬送的芙莉蓮 第二季', voteCount: 289, displayOrder: 1 },
        { optionId: 'opt_2', title: '咒術迴戰 死滅迴游篇', voteCount: 198, displayOrder: 2 },
        { optionId: 'opt_3', title: '鏈鋸人 劇場版蕾潔篇', voteCount: 105, displayOrder: 3 },
        { optionId: 'opt_4', title: '間諜家家酒 第三季', voteCount: 50, displayOrder: 4 },
      ],
    },
    {
      pollId: 'poll_dev_energy',
      title: '寫 Code 必備提神法寶？',
      authorId: 'user_heaton',
      authorName: '架構師阿童',
      authorIcon: 'https://api.dicebear.com/7.x/avataaars/png?seed=heaton',
      imageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80',
      category: 'hot',
      security: '00',
      isNeedPassword: false,
      isCanPreviewResult: true,
      isUserCanAddOption: true,
      minOption: 1,
      maxOption: 1,
      optionCount: 4,
      totalVotes: 512,
      searchKeywords: generateNgrams('寫 Code 必備提神法寶？'),
      topOptions: [
        { optionId: 'opt_1', title: '冰美式特濃咖啡 (Americano)', voteCount: 268 },
        { optionId: 'opt_2', title: '無糖紅牛能量飲 (Red Bull)', voteCount: 142 },
      ],
      startTime: now - 86400000 * 4,
      endTime: now + 86400000 * 20,
      createdAt: now - 86400000 * 4,
      options: [
        { optionId: 'opt_1', title: '冰美式特濃咖啡 (Americano)', voteCount: 268, displayOrder: 1 },
        { optionId: 'opt_2', title: '無糖紅牛能量飲 (Red Bull)', voteCount: 142, displayOrder: 2 },
        { optionId: 'opt_3', title: '高山冷泡烏龍茶', voteCount: 72, displayOrder: 3 },
        { optionId: 'opt_4', title: '純靠責任感與意志力硬撐', voteCount: 30, displayOrder: 4 },
      ],
    },
    {
      pollId: 'poll_taiwan_food',
      title: '台灣最強國民夜市美食之王？',
      authorId: 'user_foodie',
      authorName: '深夜吃貨大師',
      authorIcon: 'https://api.dicebear.com/7.x/avataaars/png?seed=foodie',
      imageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&auto=format&fit=crop&q=80',
      category: 'hot',
      security: '00',
      isNeedPassword: false,
      isCanPreviewResult: true,
      isUserCanAddOption: true,
      minOption: 1,
      maxOption: 2,
      optionCount: 4,
      totalVotes: 428,
      searchKeywords: generateNgrams('台灣最強國民夜市美食之王？'),
      topOptions: [
        { optionId: 'opt_1', title: '現炸鹹酥雞配九層塔大蒜', voteCount: 215 },
        { optionId: 'opt_2', title: '炭烤大腸包小腸', voteCount: 118 },
      ],
      startTime: now - 86400000 * 3,
      endTime: now + 86400000 * 18,
      createdAt: now - 86400000 * 3,
      options: [
        { optionId: 'opt_1', title: '現炸鹹酥雞配九層塔大蒜', voteCount: 215, displayOrder: 1 },
        { optionId: 'opt_2', title: '炭烤大腸包小腸', voteCount: 118, displayOrder: 2 },
        { optionId: 'opt_3', title: '地瓜球 (QQ蛋)', voteCount: 65, displayOrder: 3 },
        { optionId: 'opt_4', title: '藥膳排骨湯', voteCount: 30, displayOrder: 4 },
      ],
    },
    {
      pollId: 'poll_japan_city',
      title: '如果有機會移居日本，你最想住哪？',
      authorId: 'user_traveler',
      authorName: '旅日背包客 Ken',
      authorIcon: 'https://api.dicebear.com/7.x/avataaars/png?seed=traveler',
      imageUrl: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=800&auto=format&fit=crop&q=80',
      category: 'hot',
      security: '00',
      isNeedPassword: false,
      isCanPreviewResult: true,
      isUserCanAddOption: true,
      minOption: 1,
      maxOption: 1,
      optionCount: 4,
      totalVotes: 350,
      searchKeywords: generateNgrams('如果有機會移居日本，你最想住哪？'),
      topOptions: [
        { optionId: 'opt_1', title: '京都 (Kyoto) - 充滿古都韻味', voteCount: 162 },
        { optionId: 'opt_2', title: '福岡 (Fukuoka) - 美食之都生活步調舒適', voteCount: 112 },
      ],
      startTime: now - 86400000 * 2,
      endTime: now + 86400000 * 20,
      createdAt: now - 86400000 * 2,
      options: [
        { optionId: 'opt_1', title: '京都 (Kyoto) - 充滿古都韻味', voteCount: 162, displayOrder: 1 },
        { optionId: 'opt_2', title: '福岡 (Fukuoka) - 美食之都生活步調舒適', voteCount: 112, displayOrder: 2 },
        { optionId: 'opt_3', title: '東京 (Tokyo) - 流行資訊中心', voteCount: 52, displayOrder: 3 },
        { optionId: 'opt_4', title: '札幌 (Sapporo) - 氣候涼爽風景宜人', voteCount: 24, displayOrder: 4 },
      ],
    },

    // --- 最新上架 (New) ---
    {
      pollId: 'poll_superpower',
      title: '如果能免費獲得一項超能力，你選？',
      authorId: 'user_comic',
      authorName: '動漫小迷弟',
      authorIcon: 'https://api.dicebear.com/7.x/avataaars/png?seed=comic',
      imageUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&auto=format&fit=crop&q=80',
      category: 'new',
      security: '00',
      isNeedPassword: false,
      isCanPreviewResult: true,
      isUserCanAddOption: true,
      minOption: 1,
      maxOption: 1,
      optionCount: 4,
      totalVotes: 145,
      searchKeywords: generateNgrams('如果能免費獲得一項超能力，你選？'),
      topOptions: [
        { optionId: 'opt_1', title: '瞬間移動 (Teleportation)', voteCount: 88 },
        { optionId: 'opt_2', title: '時間暫停 (Time Stop)', voteCount: 38 },
      ],
      startTime: now - 3600000 * 3,
      endTime: now + 86400000 * 14,
      createdAt: now - 3600000 * 3,
      options: [
        { optionId: 'opt_1', title: '瞬間移動 (Teleportation)', voteCount: 88, displayOrder: 1 },
        { optionId: 'opt_2', title: '時間暫停 (Time Stop)', voteCount: 38, displayOrder: 2 },
        { optionId: 'opt_3', title: '讀心術 (Mind Reading)', voteCount: 12, displayOrder: 3 },
        { optionId: 'opt_4', title: '怎麼吃都吃不胖', voteCount: 7, displayOrder: 4 },
      ],
    },
    {
      pollId: 'poll_sleep_time',
      title: '大家平常都是幾點入睡？',
      authorId: 'user_nightowl',
      authorName: '夜貓子俱樂部',
      authorIcon: 'https://api.dicebear.com/7.x/avataaars/png?seed=nightowl',
      imageUrl: 'https://images.unsplash.com/photo-1511295742362-92c96b124e52?w=800&auto=format&fit=crop&q=80',
      category: 'new',
      security: '00',
      isNeedPassword: false,
      isCanPreviewResult: true,
      isUserCanAddOption: true,
      minOption: 1,
      maxOption: 1,
      optionCount: 4,
      totalVotes: 98,
      searchKeywords: generateNgrams('大家平常都是幾點入睡？'),
      topOptions: [
        { optionId: 'opt_1', title: '凌晨 1 點 - 2 點', voteCount: 54 },
        { optionId: 'opt_2', title: '凌晨 12 點前', voteCount: 26 },
      ],
      startTime: now - 3600000 * 2,
      endTime: now + 86400000 * 10,
      createdAt: now - 3600000 * 2,
      options: [
        { optionId: 'opt_1', title: '凌晨 1 點 - 2 點', voteCount: 54, displayOrder: 1 },
        { optionId: 'opt_2', title: '凌晨 12 點前', voteCount: 26, displayOrder: 2 },
        { optionId: 'opt_3', title: '凌晨 2 點之後', voteCount: 15, displayOrder: 3 },
        { optionId: 'opt_4', title: '日夜顛倒看心情', voteCount: 3, displayOrder: 4 },
      ],
    },
    {
      pollId: 'poll_weekend_chill',
      title: '週末放假最 Chill 的放鬆充電方式？',
      authorId: 'user_relax',
      authorName: '悠閒生活誌',
      authorIcon: 'https://api.dicebear.com/7.x/avataaars/png?seed=relax',
      imageUrl: 'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800&auto=format&fit=crop&q=80',
      category: 'new',
      security: '00',
      isNeedPassword: false,
      isCanPreviewResult: true,
      isUserCanAddOption: true,
      minOption: 1,
      maxOption: 2,
      optionCount: 4,
      totalVotes: 76,
      searchKeywords: generateNgrams('週末放假最 Chill 的放鬆充電方式？'),
      topOptions: [
        { optionId: 'opt_1', title: '宅在家不設鬧鐘睡到飽追劇', voteCount: 45 },
        { optionId: 'opt_2', title: '到大自然露營爬山吸收芬多精', voteCount: 18 },
      ],
      startTime: now - 3600000 * 1,
      endTime: now + 86400000 * 7,
      createdAt: now - 3600000 * 1,
      options: [
        { optionId: 'opt_1', title: '宅在家不設鬧鐘睡到飽追劇', voteCount: 45, displayOrder: 1 },
        { optionId: 'opt_2', title: '到大自然露營爬山吸收芬多精', voteCount: 18, displayOrder: 2 },
        { optionId: 'opt_3', title: '去文青咖啡廳點一杯手沖閱讀', voteCount: 9, displayOrder: 3 },
        { optionId: 'opt_4', title: '約朋友逛街吃麻辣鍋喝兩杯', voteCount: 4, displayOrder: 4 },
      ],
    },
    {
      pollId: 'poll_phone_spec',
      title: '換新手機時，你最看重的硬體規格是？',
      authorId: 'user_tech',
      authorName: '3C 評測小狂熱',
      authorIcon: 'https://api.dicebear.com/7.x/avataaars/png?seed=tech',
      imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format&fit=crop&q=80',
      category: 'new',
      security: '00',
      isNeedPassword: false,
      isCanPreviewResult: true,
      isUserCanAddOption: true,
      minOption: 1,
      maxOption: 1,
      optionCount: 4,
      totalVotes: 54,
      searchKeywords: generateNgrams('換新手機時，你最看重的硬體規格是？'),
      topOptions: [
        { optionId: 'opt_1', title: '電池容量與極速快充', voteCount: 28 },
        { optionId: 'opt_2', title: '相機夜拍與望遠鏡頭表現', voteCount: 16 },
      ],
      startTime: now - 1800000,
      endTime: now + 86400000 * 14,
      createdAt: now - 1800000,
      options: [
        { optionId: 'opt_1', title: '電池容量與極速快充', voteCount: 28, displayOrder: 1 },
        { optionId: 'opt_2', title: '相機夜拍與望遠鏡頭表現', voteCount: 16, displayOrder: 2 },
        { optionId: 'opt_3', title: '螢幕高更新率與色彩表現', voteCount: 7, displayOrder: 3 },
        { optionId: 'opt_4', title: '外型設計與手持輕薄感', voteCount: 3, displayOrder: 4 },
      ],
    },
  ];

  for (const poll of samplePolls) {
    const { options, ...pollDoc } = poll;
    await pollRef.doc(pollDoc.pollId).set(pollDoc, { merge: true });
    for (const opt of options) {
      await pollRef.doc(pollDoc.pollId).collection('options').doc(opt.optionId).set(
        {
          ...opt,
          creatorId: pollDoc.authorId,
          createdAt: pollDoc.createdAt,
        },
        { merge: true }
      );
    }
  }

  console.log('✅ FunnyVote 豐富預設內容寫入完成！共有 4 筆橫幅與 8 筆熱門/最新投票！');
}

seed().catch((err) => {
  console.error('❌ 種子寫入失敗:', err);
  process.exit(1);
});
