import questions from "./questions.js";
import { calculateResult } from "./scoring.js";
import { getStrengthCopy, getWeaknessCopy, getKeyword, getFunProfile } from "./copy.js";
import { DEMO_STATS, percentileForDemoScore } from "./stats.js";

const app = document.querySelector("#app");
let index = -1;
const answers = {};
const selectedLeisure = new Set();

const leisureTypes = ["短视频","游戏","追剧 / 综艺","社交媒体","网文 / 漫画","直播","无目的刷网页","其他"];

function esc(s) {
  return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

function shell(content, extra = "") {
  window.scrollTo({ top: 0, behavior: "instant" });
  app.innerHTML = `
    <div class="noise"></div>
    <main class="shell ${extra}">
      ${content}
    </main>`;
}

function home() {
  shell(`
    <section class="hero">
      <div class="hero-orbit" aria-hidden="true"><span>20</span><small>REAL MOMENTS</small></div>
      <div class="eyebrow">2026 · COLLEGE STUDENT FIELD GUIDE</div>
      <h1>大学生评价指南</h1>
      <p class="lead">不看学校，不看家境，也不考你背过多少热词。</p>
      <p class="sublead">20 个具体场景：AI 怎么用、信息怎么查、事情怎么做、时间交给谁。</p>
      <p class="reclaim">reclaim that · 把注意力、时间和选择权拿回来</p>
      <button class="primary" id="start">开始评价 <span>→</span></button>
      <div class="meta-row"><span>约 2–3 分钟</span><span>没有知识考试</span><span>答案只留在本机</span></div>
    </section>
  `);
  document.querySelector("#start").onclick = () => { index = 0; renderQuestion(); };
}

function progress() {
  return `<div class="progress" role="progressbar" aria-valuemin="1" aria-valuemax="${questions.length}" aria-valuenow="${index + 1}"><span style="width:${((index + 1) / questions.length) * 100}%"></span></div>`;
}

function advanceQuestion() {
  if (index === questions.length - 1) showAnalysis();
  else {
    index++;
    renderQuestion();
  }
}

function renderQuestion() {
  const q = questions[index];
  if (q.type === "game") return renderGame();
  const multi = q.type === "multi";
  const maxSelections = q.maxSelections || 5;
  const selected = answers[q.id]?.values || [];
  shell(`
    <section class="test">
      <div class="topline"><span>${String(index+1).padStart(2,"0")} / ${questions.length}</span><span>${DIMENSION_LABELS[q.dimension]}</span></div>
      ${progress()}
      <h2>${esc(q.title)}</h2>
      ${multi ? `<p class="hint" id="selection-hint">选出你真的会查的，最多 ${maxSelections} 项 · 已选 ${selected.length}/${maxSelections}</p>` : `<p class="hint">${esc(q.hint || "别选理想中的你，选平时真的会做的")}</p>`}
      <div class="options">
        ${q.options.map((o,i) => {
          const checked = selected.includes(i) ? "selected" : "";
          return `<button class="option ${checked}" data-i="${i}">
            <span class="option-index">${String.fromCharCode(65+i)}</span>
            <span>${esc(o[0])}</span>
          </button>`;
        }).join("")}
      </div>
      ${index > 0 || multi ? `<div class="footer-actions ${multi ? "" : "auto-advance"}">
        ${index > 0 ? `<button class="ghost" id="back">← 上一题</button>` : ""}
        ${multi ? `<button class="primary" id="next" ${selected.length ? "" : "disabled"}>继续 →</button>` : ""}
      </div>` : ""}
    </section>
  `);

  document.querySelectorAll(".option").forEach(btn => btn.onclick = () => {
    const i = Number(btn.dataset.i);
    if (multi) {
      const current = new Set(answers[q.id]?.values || []);
      if (current.has(i)) current.delete(i);
      else if (current.size < maxSelections) current.add(i);
      else {
        const hint = document.querySelector("#selection-hint");
        hint.textContent = `最多选择 ${maxSelections} 项，请先取消一项`;
        hint.classList.add("warning");
        return;
      }
      answers[q.id] = { values: [...current] };
      btn.classList.toggle("selected", current.has(i));
      const hint = document.querySelector("#selection-hint");
      hint.textContent = `最多选择 ${maxSelections} 项 · 已选 ${current.size}/${maxSelections}`;
      hint.classList.remove("warning");
    } else {
      answers[q.id] = { values: [i] };
      document.querySelectorAll(".option").forEach(x => x.classList.remove("selected"));
      btn.classList.add("selected");
      const selectedQuestion = index;
      document.querySelectorAll(".option").forEach(x => { x.disabled = true; });
      setTimeout(() => {
        if (index === selectedQuestion) advanceQuestion();
      }, 260);
      return;
    }
    document.querySelector("#next").disabled = !(answers[q.id]?.values?.length);
  });
  document.querySelector("#next")?.addEventListener("click", () => {
    if (!answers[q.id]?.values?.length) return;
    advanceQuestion();
  });
  document.querySelector("#back")?.addEventListener("click", () => { index--; renderQuestion(); });
}

function renderGame() {
  const q = questions[index];
  shell(`
    <section class="test">
      <div class="topline"><span>${String(index+1).padStart(2,"0")} / ${questions.length}</span><span>${DIMENSION_LABELS[q.dimension]}</span></div>
      ${progress()}
      <h2>${esc(q.title)}</h2>
      <p class="hint">娱乐没有原罪。这里看的是：结束以后，你恢复了，还是更空了？</p>
      <div class="game-grid">
        ${leisureTypes.map(g => `<button class="game ${selectedLeisure.has(g) ? "selected" : ""}" data-game="${esc(g)}" aria-pressed="${selectedLeisure.has(g)}">${esc(g)}</button>`).join("")}
      </div>
      <h3>平均每天，“本来只想看一会儿”最后会用掉多久？</h3>
      <div class="time-options">
        ${[
          ["几乎没有", 10], ["30分钟内", 9], ["30分钟–1小时", 7],
          ["1–2小时", 5], ["2–4小时", 3], ["4小时以上", 1]
        ].map(([t,s]) => `<button class="time ${answers[q.id]?.time === t ? "selected" : ""}" data-time="${t}" data-score="${s}">${t}</button>`).join("")}
      </div>
      <div class="footer-actions">
        <button class="ghost" id="back">← 上一题</button>
        <button class="primary" id="next" ${answers[q.id]?.time ? "" : "disabled"}>继续 →</button>
      </div>
    </section>
  `);
  document.querySelectorAll(".game").forEach(btn => btn.onclick = () => {
    const g = btn.dataset.game;
    if (selectedLeisure.has(g)) selectedLeisure.delete(g); else selectedLeisure.add(g);
    btn.classList.toggle("selected", selectedLeisure.has(g));
    btn.setAttribute("aria-pressed", String(selectedLeisure.has(g)));
  });
  document.querySelectorAll(".time").forEach(btn => btn.onclick = () => {
    answers[q.id] = { time: btn.dataset.time, gameScore: Number(btn.dataset.score) };
    document.querySelectorAll(".time").forEach(x => x.classList.remove("selected"));
    btn.classList.add("selected");
    document.querySelector("#next").disabled = false;
  });
  document.querySelector("#back").onclick = () => { index--; renderQuestion(); };
  document.querySelector("#next").onclick = () => {
    if (index === questions.length - 1) showAnalysis();
    else { index++; renderQuestion(); }
  };
}

function showAnalysis() {
  const resolved = {};
  for (const q of questions) {
    const a = answers[q.id];
    if (!a) continue;
    if (q.type === "single") {
      const opt = q.options[a.values[0]];
      resolved[q.id] = { dimension: q.dimension, score: opt[1] };
    } else if (q.type === "multi") {
      const scores = a.values.map(i => q.options[i][1]);
      const score = Math.min(10, scores.reduce((x,y)=>x+y,0));
      resolved[q.id] = { dimension: q.dimension, scores: [score] };
    } else {
      resolved[q.id] = { dimension: q.dimension, gameScore: a.gameScore };
    }
  }
  const result = calculateResult(resolved);
  shell(`
    <section class="analysis">
      <div class="eyebrow">READING YOUR REAL PATTERNS</div>
      <h2>正在生成你的大学生画像……</h2>
      <div class="analysis-list" aria-live="polite">
        <div>分析 AI 使用方式 <b></b></div>
        <div>分析信息半径 <b></b></div>
        <div>分析行动模式 <b></b></div>
        <div>分析时间分配 <b></b></div>
        <div>生成你的八维评价 <b></b></div>
      </div>
      <button class="primary" id="reveal" disabled>正在计算...</button>
    </section>
  `);
  const rows = [...document.querySelectorAll(".analysis-list div")];
  rows.forEach((row, i) => setTimeout(() => {
    row.classList.add("done");
    row.querySelector("b").textContent = "✓";
    if (i === rows.length - 1) {
      const reveal = document.querySelector("#reveal");
      reveal.disabled = false;
      reveal.textContent = "查看结果 →";
    }
  }, 320 * (i + 1)));
  document.querySelector("#reveal").onclick = () => showResult(result);
}

function showResult(result) {
  const strength = getStrengthCopy(result.strongest);
  const weakness = getWeaknessCopy(result.weakest);
  const fun = getFunProfile(result);
  const percentile = percentileForDemoScore(result.total);
  const dimRows = Object.entries(result.dimensions).map(([k,v]) => `<div class="dim"><span>${DIMENSION_LABELS[k]}</span><div class="bar"><i style="width:${v}%"></i></div><b>${v}</b></div>`).join("");
  shell(`
    <section class="result">
      <div class="eyebrow">2026 · COLLEGE STUDENT PROFILE</div>
      <p class="muted">你的综合适应度</p>
      <div class="score"><span>${result.total}</span><small>/100</small></div>
      <h1>${esc(result.tier.name)}</h1>
      <p class="result-desc">${esc(result.tier.description)}</p>

      <section class="fun-profile">
        <div class="fun-profile-head"><span>趣味人格 · 仅供娱乐</span><b>${esc(fun.code)}</b></div>
        <h2>${esc(fun.title)}</h2>
        <p>${esc(fun.line)}</p>
        <div class="fun-tags">${fun.tags.map(tag => `<span>${esc(tag)}</span>`).join("")}</div>
      </section>

      <div class="percentile">超过 <strong>${percentile}%</strong> 的参与测试者 <small>（演示数据）</small></div>

      <div class="panel">
        <h3>八维评价</h3>
        ${dimRows}
      </div>

      <div class="insights">
        <article><span>最大优势</span><strong>${esc(DIMENSION_LABELS[result.strongest])}</strong><p>${esc(strength)}</p></article>
        <article><span>最值得拿回来</span><strong>${esc(DIMENSION_LABELS[result.weakest])}</strong><p>${esc(weakness)}</p></article>
        <article class="illusion"><span>最容易骗过自己的话</span><strong>“${esc(result.illusion)}”</strong></article>
        <article><span>你的2026关键词</span><strong>${esc(getKeyword(result.strongest))}</strong></article>
      </div>

      <div class="panel">
        <h3>你的无意识时间</h3>
        <p>最容易停不下来的：${[...selectedLeisure].map(esc).join("、") || "没有明显类型"}</p>
        <p>平均每天：<strong>${esc(answers[questions.find(q => q.type === "game")?.id]?.time || "未填写")}</strong></p>
        <p class="muted">娱乐本身不扣分。真正重要的是，它有没有挤掉睡眠、行动和恢复。</p>
      </div>

      <div class="panel">
        <h3>参与者画像（演示数据）</h3>
        <div class="stats-list">
          ${DEMO_STATS.tiers.map(x => `<div><span>${esc(x.label)}</span><b>${x.percentage}%</b></div>`).join("")}
        </div>
        <small>正式上线后，这里应替换为真实匿名聚合数据。</small>
      </div>

      <div class="share-card" id="share-card">
        <div class="eyebrow">2026 · COLLEGE STUDENT FIELD GUIDE</div>
        <p>${esc(fun.code)} · ${esc(fun.title)}</p>
        <strong>${result.total}</strong>
        <h2>${esc(fun.line)}</h2>
        <div>${fun.tags.map(esc).join(" · ")}</div>
        <small>大学生评价指南 · reclaim that</small>
      </div>

      <div class="footer-actions">
        <button class="ghost" id="restart">再测一次</button>
        <button class="primary" id="share">下载分享卡</button>
      </div>
    </section>
  `);

  document.querySelector("#restart").onclick = () => {
    for (const k of Object.keys(answers)) delete answers[k];
    selectedLeisure.clear();
    index = 0;
    renderQuestion();
  };
  document.querySelector("#share").onclick = () => downloadShareCard(result);
}

function downloadShareCard(result) {
  const fun = getFunProfile(result);
  const canvas = document.createElement("canvas");
  canvas.width = 1080;
  canvas.height = 1440;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#f3f7f4";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "#b9cec0";
  ctx.lineWidth = 3;
  ctx.strokeRect(54, 54, 972, 1332);
  ctx.fillStyle = "#4fae30";
  ctx.font = "700 30px system-ui";
  ctx.fillText("2026 · COLLEGE STUDENT FIELD GUIDE", 100, 145);
  ctx.fillStyle = "#66766d";
  ctx.font = "34px system-ui";
  ctx.fillText("我的趣味人格", 100, 330);
  ctx.fillStyle = "#1b2a23";
  ctx.font = "900 300px system-ui";
  ctx.fillText(String(result.total), 82, 665);
  ctx.fillStyle = "#4fae30";
  ctx.font = "800 72px system-ui";
  ctx.fillText(`${fun.code} · ${fun.title}`, 100, 800);
  ctx.fillStyle = "#66766d";
  ctx.font = "30px system-ui";
  ctx.fillText("一句话评价", 100, 970);
  ctx.fillStyle = "#1b2a23";
  ctx.font = "700 38px system-ui";
  ctx.fillText(fun.line, 100, 1035);
  ctx.fillStyle = "#66766d";
  ctx.font = "30px system-ui";
  ctx.fillText("人格标签", 100, 1145);
  ctx.fillStyle = "#1b2a23";
  ctx.font = "700 44px system-ui";
  ctx.fillText(fun.tags.join(" · "), 100, 1210);
  ctx.fillStyle = "#66766d";
  ctx.font = "28px system-ui";
  ctx.fillText("大学生评价指南 · reclaim that", 100, 1320);
  const link = document.createElement("a");
  link.download = `大学生评价指南-${result.total}.png`;
  link.href = canvas.toDataURL("image/png");
  link.click();
}

const DIMENSION_LABELS = {
  ai: "AI生产力",
  information: "信息半径",
  action: "行动力",
  thinking: "思考与表达",
  economy: "经济认知",
  professional: "专业适应性",
  selfManagement: "自我管理",
  world: "世界半径"
};

home();

if ("serviceWorker" in navigator && location.protocol !== "file:") {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").catch(() => {});
  });
}
