# 怪物猎人 Wiki

怪物猎人系列数据查询站，移动端优先。当前收录《怪物猎人：荒野》55 种怪物。

**在线访问**：https://helisz.github.io/Monster-Hunter-Wiki/

## 功能

- **怪物图鉴** — 卡片 / 列表双视图、模糊搜索、体型与物种筛选、HR 点数排序
- **怪物详情** — 肉质表（按部位分组）、部位耐久、状态抗性、素材掉落
- **打击建议** — 在右下角配置武器类型（斩 / 打 / 弹）后，详情页给出针对该武器的最优属性、优先攻击部位与应避开的低效部位

## 技术栈

- Vue 3（`<script setup>`）+ Vite
- TailwindCSS v4
- vue-router 4
- 纯静态，数据以 JSON 形式随站分发，无后端

## 本地开发

```bash
npm install
npm run dev
```

## 构建

```bash
npm run build
```

推送到 `main` 分支后由 GitHub Actions 自动部署到 GitHub Pages。

## 数据来源

怪物数据抓取自 [mhwilds.kiranico.net](https://mhwilds.kiranico.net/)，结构与字段定义见 `public/data/monsters.json`。
图标版权归 CAPCOM 所有，本站仅作查询用途。
