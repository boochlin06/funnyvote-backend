/**
 * FunnyVote Firebase 資料庫種子初始化腳本 (Seed Script)
 * 支援寫入雲端 Firestore 或 Local Emulator。
 */
const admin = require('firebase-admin');

// 若指定專案或環境變數
const projectId = process.env.FIREBASE_PROJECT_ID || 'funny-vote-2e6be';

if (!admin.apps.length) {
  admin.initializeApp({
    projectId: projectId,
  });
}

const db = admin.firestore();

// 輔助函式：Bi-gram 繁簡切詞
function generateNgrams(text) {
  const ngrams = new Set();
  const clean = text.trim();
  for (let i = 0; i < clean.length - 1; i++) {
    ngrams.add(clean.substring(i, i + 2));
  }
  return Array.from(ngrams);
}

async function seed() {
  console.log(`🚀 開始初始化 FunnyVote 資料庫 (專案: ${projectId})...`);

  // 1. 初始化 Promotions 橫幅
  const promoRef = db.collection('promotions');
  const promoSnapshot = await promoRef.limit(1).get();
  if (promoSnapshot.empty) {
    console.log('📦 寫入焦點推薦橫幅 (Promotions)...');
    const promotions = [
      {
        id: 'promo_01',
        title: '2026 年度最受歡迎動畫投票大賽！',
        imageUrl: 'https://picsum.photos/800/400?random=1',
        actionUrl: 'funnyvote://poll/poll_anime_2026',
        displayOrder: 1,
        isActive: true,
      },
      {
        id: 'promo_02',
        title: '炎炎夏日消暑聖品大對決',
        imageUrl: 'https://picsum.photos/800/400?random=2',
        actionUrl: 'funnyvote://poll/poll_summer_dessert',
        displayOrder: 2,
        isActive: true,
      },
      {
        id: 'promo_03',
        title: '程式工程師最愛的咖啡品牌',
        imageUrl: 'https://picsum.photos/800/400?random=3',
        actionUrl: 'funnyvote://poll/poll_coffee_dev',
        displayOrder: 3,
        isActive: true,
      },
    ];

    for (const p of promotions) {
      await promoRef.doc(p.id).set(p);
    }
  }

  // 2. 初始化範例 Polls
  const pollRef = db.collection('polls');
  const pollSnapshot = await pollRef.limit(1).get();
  if (pollSnapshot.empty) {
    console.log('📦 寫入精選投票主檔與選項子集合 (Polls)...');

    const samplePolls = [
      {
        pollId: 'poll_anime_2026',
        title: '2026 年你最期待的話題動畫是哪部？',
        authorId: 'admin_funnyvote',
        authorName: 'FunnyVote 官方小編',
        authorIcon: 'https://api.dicebear.com/7.x/bottts/png?seed=funnyvote',
        imageUrl: 'https://picsum.photos/800/600?random=10',
        category: 'hot',
        security: '00',
        isNeedPassword: false,
        isCanPreviewResult: true,
        isUserCanAddOption: true,
        minOption: 1,
        maxOption: 2,
        optionCount: 4,
        totalVotes: 328,
        searchKeywords: generateNgrams('2026 年你最期待的話題動畫是哪部？'),
        topOptions: [
          { optionId: 'opt_a1', title: '葬送的芙莉蓮 第二季', voteCount: 156 },
          { optionId: 'opt_a2', title: '咒術迴戰 死滅迴游篇', voteCount: 98 },
        ],
        startTime: Date.now() - 86400000 * 2,
        endTime: Date.now() + 86400000 * 30,
        createdAt: Date.now() - 86400000 * 2,
        options: [
          { optionId: 'opt_a1', title: '葬送的芙莉蓮 第二季', voteCount: 156, displayOrder: 1 },
          { optionId: 'opt_a2', title: '咒術迴戰 死滅迴游篇', voteCount: 98, displayOrder: 2 },
          { optionId: 'opt_a3', title: '鏈鋸人 蕾潔篇', voteCount: 46, displayOrder: 3 },
          { optionId: 'opt_a4', title: '間諜家家酒 第三季', voteCount: 28, displayOrder: 4 },
        ],
      },
      {
        pollId: 'poll_coffee_dev',
        title: '寫 Code 必備提神飲品是？',
        authorId: 'user_dev_01',
        authorName: '資深後端阿偉',
        authorIcon: 'https://api.dicebear.com/7.x/avataaars/png?seed=awei',
        imageUrl: 'https://picsum.photos/800/600?random=11',
        category: 'new',
        security: '00',
        isNeedPassword: false,
        isCanPreviewResult: true,
        isUserCanAddOption: true,
        minOption: 1,
        maxOption: 1,
        optionCount: 3,
        totalVotes: 85,
        searchKeywords: generateNgrams('寫 Code 必備提神飲品是？'),
        topOptions: [
          { optionId: 'opt_c1', title: '冰美式咖啡 (Americano)', voteCount: 52 },
          { optionId: 'opt_c2', title: '無糖紅牛 (Red Bull Sugarfree)', voteCount: 21 },
        ],
        startTime: Date.now() - 3600000 * 5,
        endTime: Date.now() + 86400000 * 14,
        createdAt: Date.now() - 3600000 * 5,
        options: [
          { optionId: 'opt_c1', title: '冰美式咖啡 (Americano)', voteCount: 52, displayOrder: 1 },
          { optionId: 'opt_c2', title: '無糖紅牛 (Red Bull Sugarfree)', voteCount: 21, displayOrder: 2 },
          { optionId: 'opt_c3', title: '無糖綠茶 / 烏龍茶', voteCount: 12, displayOrder: 3 },
        ],
      },
    ];

    for (const poll of samplePolls) {
      const { options, ...pollDoc } = poll;
      await pollRef.doc(pollDoc.pollId).set(pollDoc);
      for (const opt of options) {
        await pollRef.doc(pollDoc.pollId).collection('options').doc(opt.optionId).set({
          ...opt,
          creatorId: pollDoc.authorId,
          createdAt: pollDoc.createdAt,
        });
      }
    }
  }

  console.log('✅ FunnyVote 資料庫種子建立完成！');
}

seed().catch((err) => {
  console.error('❌ 種子寫入失敗:', err);
  process.exit(1);
});
