# 真实使用统计

项目已经接入隐私优先的 GA4 事件层，但默认关闭。

## 启用步骤

1. 在 Google Analytics 创建 GA4 媒体资源。
2. 新建 Web 数据流，网址填写 GitHub Pages 地址。
3. 复制 `G-XXXXXXXXXX` 格式的 Measurement ID。
4. 打开 `analytics-config.js`，填入 `measurementId`。
5. 提交并推送到 GitHub。

## 已记录事件

- `page_view`：允许匿名统计后的页面访问。
- `test_start`：点击开始评价。
- `test_progress`：完成第 5、10、15 题。
- `test_complete`：完成全部题目。
- `share_card_download`：下载分享卡。

完成事件只发送：分数区间、等级、趣味人格代号、最强和最弱维度。不会发送用户的具体答案、游戏选择或自由文本。

## 查看完成人数

在 GA4 的 Reports 或 Explore 中筛选事件名 `test_complete`。事件数量是完成次数，关联用户数可用于估算完成人数。
