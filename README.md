# Hermes Weekly Report

单页静态周报模板。数据驱动 — 替换 `data.json` 即可出新一期。

## 本地预览

```bash
python3 -m http.server 8080
# 浏览器 http://localhost:8080
```

## 部署

- GitHub Pages: main branch / (root), 自动部署
- URL: https://feihc-sh.github.io/weekly-report/

## Schema

看 `data.json` 字段（`meta` / `overview` / `real_projects` / `rolling_projects` / `problems` / `new_skills` / `hot_topics`）。

## 文件

- `data.json` — 周报数据
- `index.html` — 单页骨架
- `styles.css` — 暗色样式
- `script.js` — vanilla JS 渲染
