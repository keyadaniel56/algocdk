# 🚀 Quick Start: Add Dark/Light Mode in 2 Minutes

## Step 1: Add CSS (in `<head>`)

Open your dashboard HTML file and add this line in the `<head>` section:

```html
<link rel="stylesheet" href="/theme-enhanced.css">
```

**Example:**
```html
<head>
    <meta charset="UTF-8">
    <title>My Dashboard</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="/theme-enhanced.css">  <!-- ADD THIS LINE -->
</head>
```

## Step 2: Add JavaScript (before `</body>`)

Add this line before the closing `</body>` tag:

```html
<script src="/theme-toggle.js"></script>
```

**Example:**
```html
    <script src="api.js"></script>
    <script src="dashboard.js"></script>
    <script src="/theme-toggle.js"></script>  <!-- ADD THIS LINE -->
</body>
</html>
```

## Step 3: Done! 🎉

That's it! The theme toggle button will automatically appear in your header.

## Test It

1. Refresh your dashboard
2. Look for the sun ☀️ or moon 🌙 icon in the header
3. Click it to toggle between themes
4. Refresh the page - your choice is saved!

## Demo

Want to see it in action first?

Visit: **http://localhost:3000/theme-demo**

## Files to Update

Add the two lines above to these files:

- [ ] `frontend/app.html`
- [ ] `frontend/admin_dashboard.html`
- [ ] `frontend/superadmin_dashboard.html`

## Need Help?

- 📖 Full docs: `THEME_README.md`
- 🔧 Integration guide: `THEME_INTEGRATION.md`
- 💡 Code examples: `theme-integration-snippet.html`
- 🎨 Live demo: `/theme-demo`

---

**That's all you need!** The theme system handles everything else automatically. 🌓
