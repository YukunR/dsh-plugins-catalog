# 安装指南（添加目录源）

[English](install.md) | [中文](install.zh.md)

本文演示如何在 [**DSH Desktop**](https://github.com/anywhere-labs/deepseek-harness-desktop#dsh-desktop) 中通过内置插件市场添加 YukunR 插件目录源。
添加这一个来源后，本目录下的所有插件（目前为 `dsh-ezprot-plugin`）都会出现在
**Discover（发现）** 与 **Installable（可安装）** 中。全程图形界面操作，无需终端。

## 前置条件

- 已安装 DSH Desktop（自带 Node.js 与 pnpm，无需另装）；
- 网络可访问 `dsh-plugin.yukunr.top`。

## 步骤

### 第 1 步：打开「设置 → 插件」

启动 DSH Desktop，进入 **设置（Settings）→ 插件（Plugins）**。

![打开设置中的插件页](images/install-1.png)

### 第 2 步：进入插件市场的「来源」视图

在插件页中找到 **插件市场（Plugin market）** 标签页，切换到 **来源（Sources）** 视图。

![插件市场来源视图](images/install-2.png)

### 第 3 步：添加标准来源

点击 **添加标准来源（Add standard source）**，粘贴目录地址：

```
https://dsh-plugin.yukunr.top/catalog-source.json
```

确认后，该来源会出现在来源列表中。

![添加标准来源并粘贴目录地址](images/install-3.png)

## 添加完成后

切回 **可安装（Installable）** 视图，即可看到本目录下的全部插件（目前为
`dsh-ezprot-plugin`）。点击卡片即可安装；安装后需重启 Desktop，新插件才会被装入组合。

## 常见问题

| 现象 | 处理 |
|---|---|
| 添加来源失败（来源操作失败） | 检查网络可访问 `dsh-plugin.yukunr.top`；确认系统 IPv6 可用（Desktop 客户端对自建来源会固定使用解析到的第一个地址） |
| 发现页 / 可安装页没有插件 | 确认来源已选择；在来源页点刷新后重试 |
| 安装后工具未出现 | 需要重启 Desktop 才会把新 bundle 装入组合；确认安装到了当前激活的 profile |
