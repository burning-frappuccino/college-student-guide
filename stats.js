// V1 uses local demo statistics. Replace these values only when real anonymous
// aggregate data is available. Never present demo data as real population data.
export const DEMO_STATS = {
  totalUsers: 12483,
  tiers: [
    { label: "AI时代弄潮儿", percentage: 8.4 },
    { label: "数字时代行动派", percentage: 17.8 },
    { label: "进化中的现实主义者", percentage: 24.6 },
    { label: "合格的时代参与者", percentage: 21.3 },
    { label: "舒适区大学生", percentage: 15.2 },
    { label: "信息茧房居民", percentage: 7.9 },
    { label: "赛博时代旁观者", percentage: 4.1 },
    { label: "旧时代遗民", percentage: 0.7 }
  ],
  gameTime: [
    { label: "基本不玩", percentage: 18 },
    { label: "≤30分钟", percentage: 11 },
    { label: "30分钟–1小时", percentage: 17 },
    { label: "1–2小时", percentage: 25 },
    { label: "2–4小时", percentage: 19 },
    { label: "4小时以上", percentage: 10 }
  ]
};

export function percentileForDemoScore(score) {
  // Illustrative only. Do not label as a real percentile in production.
  return Math.max(1, Math.min(99, Math.round(50 + (score - 65) * 2.2)));
}
