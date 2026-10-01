export const COPIES = {
  strengths: {
    ai: "你已经开始把 AI 当成生产力工具，而不只是聊天机器人。",
    information: "你主动扩展信息来源的倾向比较明显，说明你不太满足于只接收被推荐的信息。",
    action: "你最大的优势是愿意开始。很多人停在想法，而你更愿意把东西做出来。",
    thinking: "你比较能容忍复杂问题，不容易被一句话解释整个世界。",
    economy: "你开始用收入、成本、需求、竞争这些变量理解现实。",
    professional: "你没有把专业当成终点，而是在寻找专业之外的可迁移能力。",
    selfManagement: "你对时间和娱乐的控制相对稳定。",
    world: "你对环境变化的接受度较高，不容易把城市和路径当成绝对边界。"
  },
  weaknesses: {
    ai: "你可能还没有把 AI 真正嵌入自己的工作流。",
    information: "你的信息来源可能比较集中，容易让平台替你决定看到什么。",
    action: "你知道的东西可能明显多于真正做过的东西。",
    thinking: "你可以进一步训练自己理解不同立场背后的前提。",
    economy: "你对商业和经济变量的关注还可以继续深入。",
    professional: "你目前对传统路径的依赖可能略高。",
    selfManagement: "你的时间分配可能比你想象中更需要主动管理。",
    world: "面对完全陌生的环境时，你可能更倾向于先保证确定性。"
  }
};

export function getStrengthCopy(key) {
  return COPIES.strengths[key] || COPIES.strengths.ai;
}

export function getWeaknessCopy(key) {
  return COPIES.weaknesses[key] || COPIES.weaknesses.ai;
}

export function getKeyword(key) {
  const map = {
    ai: "AI生产力",
    information: "信息半径",
    action: "行动力",
    thinking: "独立思考",
    economy: "经济认知",
    professional: "第二技能",
    selfManagement: "时间管理",
    world: "世界半径"
  };
  return map[key] || "持续进化";
}

const PROFILE_FALLBACKS = {
  ai: {
    code: "CYBR",
    title: "赛博外挂驾驶员",
    line: "工具可以很强，但方向盘最好还在你手里。",
    tags: ["会用工具", "结果复核", "效率优先"]
  },
  information: {
    code: "SCAN",
    title: "信息流拆弹员",
    line: "热搜负责冒烟，你负责找到真正的引线。",
    tags: ["多源核对", "不吃标题", "主动搜索"]
  },
  action: {
    code: "GOOO",
    title: "人间启动按钮",
    line: "别人还在等状态，你已经把第一版做出来了。",
    tags: ["马上开工", "先有再优", "行动派"]
  },
  thinking: {
    code: "WHYI",
    title: "复杂问题翻译官",
    line: "一句话说不清的事，你愿意多拆两层。",
    tags: ["追问前提", "能听反方", "拒绝简化"]
  },
  economy: {
    code: "CALC",
    title: "现实成本会计",
    line: "你看到的不只价格，还有时间、风险和机会。",
    tags: ["会算成本", "风险意识", "现实主义"]
  },
  professional: {
    code: "SKIL",
    title: "技能树玩家",
    line: "路径可以变化，但你会给自己多点几个技能。",
    tags: ["持续学习", "能力迁移", "路径更新"]
  },
  selfManagement: {
    code: "CTRL",
    title: "时间边界管理员",
    line: "娱乐可以续杯，但你的时间不会无限供应。",
    tags: ["时间有数", "收放自如", "边界在线"]
  },
  world: {
    code: "ROAM",
    title: "地图外探索者",
    line: "陌生不是劝退词，只是新的加载页面。",
    tags: ["环境适应", "机会导向", "敢于试探"]
  }
};

export function getFunProfile(result) {
  const d = result.dimensions;
  const profiles = [
    [d.ai >= 80 && d.action >= 75 && d.thinking >= 65, {
      code: "SHIP", title: "人机协作出片机",
      line: "别人还在研究提示词，你已经交付并复核了。",
      tags: ["AI工作流", "行动在线", "结果复核"]
    }],
    [d.information >= 80 && d.thinking >= 75, {
      code: "RADR", title: "互联网防骗雷达",
      line: "截图和热搜想带节奏，得先过你这一关。",
      tags: ["来源敏感", "交叉验证", "冷静吃瓜"]
    }],
    [d.action >= 80 && d.selfManagement >= 70, {
      code: "MOVE", title: "说干就干型人类",
      line: "你的计划不在备忘录里，在已经发生的现实里。",
      tags: ["立即启动", "稳定推进", "拒绝空想"]
    }],
    [d.economy >= 80 && d.professional >= 75, {
      code: "BETA", title: "现实世界调参师",
      line: "会算成本，也会给自己的技能版本打补丁。",
      tags: ["成本清醒", "技能升级", "长期视角"]
    }],
    [d.world >= 80 && d.information >= 70, {
      code: "ROAM", title: "地图边界消失术",
      line: "环境会变，路径会改，但你不轻易把门关死。",
      tags: ["开放地图", "主动探索", "适应变化"]
    }],
    [d.ai >= 75 && d.thinking < 55, {
      code: "AUTO", title: "AI答案收藏家",
      line: "你离高手只差一步：别让流畅代替正确。",
      tags: ["工具熟练", "复核待开", "谨防幻觉"]
    }],
    [d.information >= 75 && d.action < 55, {
      code: "CACH", title: "收藏夹战略储备局",
      line: "知道很多，资料很全，第一步仍在排队。",
      tags: ["信息充足", "稍后再做", "启动困难"]
    }],
    [d.action >= 75 && d.information < 55, {
      code: "RUSH", title: "先冲再看地图",
      line: "发动机很强，偶尔需要先确认方向。",
      tags: ["行动很快", "边做边看", "方向待校"]
    }],
    [d.selfManagement < 50, {
      code: "FIVE", title: "再五分钟股东",
      line: "你不是没有时间，只是平台经常自动续杯。",
      tags: ["容易超时", "注意力散", "边界待建"]
    }],
    [d.professional < 50, {
      code: "PACH", title: "技能树待更新",
      line: "主线任务还在跑，但支线技能该点一点了。",
      tags: ["路径依赖", "技能待补", "可塑性高"]
    }]
  ];

  const matched = profiles.find(([condition]) => condition);
  if (matched) return matched[1];

  const values = Object.values(d);
  if (Math.max(...values) - Math.min(...values) <= 12) {
    return {
      code: "BALN",
      title: "稳定版本大学生",
      line: "没有明显短板，也没有把自己更新成测试版。",
      tags: ["均衡发展", "稳定在线", "继续迭代"]
    };
  }

  return PROFILE_FALLBACKS[result.strongest] || PROFILE_FALLBACKS.action;
}
