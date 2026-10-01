export const DIMENSIONS = {
  ai: { label: "AI生产力", weight: 18 },
  information: { label: "信息半径", weight: 14 },
  action: { label: "行动力", weight: 15 },
  thinking: { label: "思考与表达", weight: 14 },
  economy: { label: "经济认知", weight: 12 },
  professional: { label: "专业适应性", weight: 10 },
  selfManagement: { label: "自我管理", weight: 9 },
  world: { label: "世界半径", weight: 8 }
};

export const TIERS = [
  [90, "AI时代弄潮儿", "你已经开始主动利用时代变化，而不是等待变化发生在自己身上。"],
  [82, "数字时代行动派", "你已经开始把信息和工具转化成行动。"],
  [74, "进化中的现实主义者", "你知道这个时代正在变化，也正在寻找自己的位置。"],
  [65, "合格的时代参与者", "你没有掉队，但距离真正形成自己的优势，还有一段路。"],
  [55, "舒适区大学生", "你目前的生活方式仍然比较稳定，但稳定本身未必会一直持续。"],
  [45, "信息茧房居民", "你接触到的信息和机会，可能比你想象中的少。"],
  [30, "赛博时代旁观者", "时代正在快速变化，但你更多是在观看，而不是参与。"],
  [0, "旧时代遗民", "你不是能力不够，而是很多旧的生活方式仍然占据着你的默认选项。"]
];

export const ILLUSIONS = {
  aiHighActionLow: "知道 ≈ 做到",
  infoHighVerifyLow: "我看过很多 ≈ 我了解",
  actionHighInfoLow: "忙碌 ≈ 进步",
  professionalLow: "毕业 ≈ 有竞争力",
  aiUseHighValidationLow: "使用AI ≠ 掌握AI",
  gameHighSelfLow: "娱乐正在替你分配时间"
};

export function clamp(n, min = 0, max = 100) {
  return Math.max(min, Math.min(max, n));
}

function avg(values) {
  return values.length ? values.reduce((a, b) => a + b, 0) / values.length : 0;
}

function normalized(values) {
  return clamp(avg(values) * 10);
}

export function calculateResult(answers) {
  const raw = {};
  for (const key of Object.keys(DIMENSIONS)) raw[key] = [];

  for (const answer of Object.values(answers)) {
    if (!answer) continue;
    const dimension = answer.dimension;
    if (!raw[dimension]) continue;
    if (answer.gameScore != null) {
      raw[dimension].push(Number(answer.gameScore));
    } else if (Array.isArray(answer.scores)) {
      raw[dimension].push(avg(answer.scores));
    } else {
      raw[dimension].push(Number(answer.score || 0));
    }
  }

  const dimensions = {};
  for (const [key] of Object.entries(DIMENSIONS)) {
    dimensions[key] = Math.round(normalized(raw[key]));
  }

  // Small cross-dimension modifiers. They are deliberately bounded.
  if (dimensions.ai >= 75 && dimensions.action < 50) dimensions.ai = clamp(dimensions.ai - 4);
  if (dimensions.information >= 75 && dimensions.thinking < 50) dimensions.information = clamp(dimensions.information - 3);
  if (dimensions.action >= 80 && dimensions.information < 45) dimensions.action = clamp(dimensions.action - 3);

  const total = Math.round(
    Object.entries(DIMENSIONS).reduce((sum, [key, meta]) => {
      return sum + dimensions[key] * meta.weight / 100;
    }, 0)
  );

  const tier = TIERS.find(([min]) => total >= min) || TIERS[TIERS.length - 1];

  const entries = Object.entries(dimensions).sort((a, b) => b[1] - a[1]);
  const strongest = entries[0]?.[0] || "ai";
  const weakest = entries[entries.length - 1]?.[0] || "selfManagement";

  let illusion = "没有明显单一幻觉";
  if (dimensions.ai >= 70 && dimensions.action < 55) illusion = ILLUSIONS.aiHighActionLow;
  else if (dimensions.information >= 70 && dimensions.thinking < 55) illusion = ILLUSIONS.infoHighVerifyLow;
  else if (dimensions.action >= 75 && dimensions.information < 50) illusion = ILLUSIONS.actionHighInfoLow;
  else if (dimensions.professional < 50) illusion = ILLUSIONS.professionalLow;
  else if (dimensions.ai >= 75 && dimensions.thinking < 55) illusion = ILLUSIONS.aiUseHighValidationLow;
  else if (dimensions.selfManagement < 45) illusion = ILLUSIONS.gameHighSelfLow;

  return {
    total,
    dimensions,
    tier: { name: tier[1], description: tier[2] },
    strongest,
    weakest,
    illusion,
    keyword: DIMENSIONS[strongest].label
  };
}
