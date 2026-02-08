# 🌓 AlgoCDK Dark/Light Mode System

A comprehensive theme management system for all AlgoCDK dashboards with automatic persistence and smooth transitions.

## ✨ Features

- 🎨 **Seamless Theme Switching** - Toggle between dark and light modes instantly
- 💾 **Persistent Preferences** - Your choice is saved and remembered
- 🔄 **Smooth Transitions** - Beautiful animations when switching themes
- 📱 **Mobile Responsive** - Works perfectly on all devices
- 🎯 **Auto-Integration** - Automatically adds toggle button to headers
- 🎨 **CSS Variables** - Easy customization for developers
- ♿ **Accessible** - Follows WCAG guidelines

## 🚀 Quick Start

### For Users

1. Look for the sun ☀️ or moon 🌙 icon in the dashboard header
2. Click it to toggle between light and dark modes
3. Your preference is automatically saved!

### For Developers

Add these two lines to your dashboard HTML:

**In `<head>` section:**
```html
<link rel="stylesheet" href="/theme-enhanced.css">
```

**Before closing `</body>` tag:**
```html
<script src="/theme-toggle.js"></script>
```

That's it! The theme system is now active.

## 📁 File Structure

```
frontend/
├── theme-toggle.js           # Theme management logic
├── theme-enhanced.css        # Theme styles and variables
├── theme-integration-snippet.html  # Copy-paste snippets
└── THEME_INTEGRATION.md      # Integration guide
```

## 🎨 Customization

### CSS Variables

The theme system uses CSS variables for easy customization:

```css
:root {
    /* Brand Colors (consistent across themes) */
    --primary: #FF4500;
    --secondary: #FF6347;
    --success: #10B981;
    --danger: #EF4444;
    --warning: #F59E0B;
    
    /* Theme-specific colors (auto-adjusted) */
    --bg-primary: #111827;
    --bg-secondary: #1f2937;
    --text-primary: #f9fafb;
    --border-color: #374151;
    /* ... and more */
}
```

### Custom Styling

Use CSS variables in your custom components:

```css
.my-component {
    background-color: var(--card-bg);
    color: var(--text-primary);
    border: 1px solid var(--border-color);
    transition: all 0.3s ease;
}
```

## 🔧 API Reference

### ThemeManager Class

```javascript
// Access the theme manager
window.themeManager

// Methods
themeManager.toggle()              // Toggle between themes
themeManager.applyTheme('light')   // Set specific theme
themeManager.theme                 // Get current theme ('light' or 'dark')
```

### Example Usage

```javascript
// Check current theme
if (window.themeManager.theme === 'dark') {
    console.log('Dark mode is active');
}

// Force light mode
window.themeManager.applyTheme('light');

// Toggle theme programmatically
document.getElementById('myButton').onclick = () => {
    window.themeManager.toggle();
};
```

## 🎯 Integration Examples

### Example 1: Basic Dashboard

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>My Dashboard</title>
    <link rel="stylesheet" href="/theme-enhanced.css">
</head>
<body>
    <header>
        <h1>Dashboard</h1>
        <!-- Theme toggle auto-appears here -->
    </header>
    
    <main>
        <div class="card">Content here</div>
    </main>
    
    <script src="/theme-toggle.js"></script>
</body>
</html>
```

### Example 2: Custom Button Placement

```html
<header>
    <div class="flex items-center justify-between">
        <h1>Dashboard</h1>
        <div class="flex items-center space-x-4">
            <!-- Manual theme toggle placement -->
            <button id="themeToggle" class="theme-toggle-btn">
                <i class="fas fa-sun"></i>
            </button>
            <button>Settings</button>
        </div>
    </div>
</header>
```

## 🎨 Color Palette

### Dark Mode
- Background: `#111827` (darker) → `#1f2937` (dark) → `#374151` (medium)
- Text: `#f9fafb` (primary) → `#e5e7eb` (secondary) → `#9ca3af` (tertiary)

### Light Mode
- Background: `#ffffff` (white) → `#f3f4f6` (light gray) → `#e5e7eb` (gray)
- Text: `#111827` (dark) → `#4b5563` (medium) → `#6b7280` (light)

### Brand Colors (Both Modes)
- Primary: `#FF4500` (Orange Red)
- Success: `#10B981` (Green)
- Warning: `#F59E0B` (Amber)
- Danger: `#EF4444` (Red)

## 📱 Mobile Support

The theme system is fully responsive:

- Toggle button adapts to mobile screens
- Touch-friendly button size (44x44px minimum)
- Smooth transitions on all devices
- Persistent across mobile browsers

## ♿ Accessibility

- High contrast ratios in both themes
- Keyboard navigation support
- Screen reader friendly
- ARIA labels on toggle button
- Focus indicators

## 🐛 Troubleshooting

### Theme toggle not appearing?

1. Check that both CSS and JS files are loaded:
   ```html
   <link rel="stylesheet" href="/theme-enhanced.css">
   <script src="/theme-toggle.js"></script>
   ```

2. Verify the header element exists:
   ```javascript
   console.log(document.querySelector('header'));
   ```

3. Manually add the button if needed (see integration examples)

### Theme not persisting?

- Check browser localStorage is enabled
- Clear cache and reload
- Check console for errors

### Styles not applying?

- Ensure `theme-enhanced.css` loads after other stylesheets
- Check for CSS specificity conflicts
- Verify CSS variables are supported (all modern browsers)

## 🔄 Updates

### Version 1.0.0 (Current)
- ✅ Initial release
- ✅ Dark and light mode support
- ✅ Automatic persistence
- ✅ Mobile responsive
- ✅ Auto-integration

### Planned Features
- 🔜 System theme detection (auto-match OS preference)
- 🔜 Custom theme colors
- 🔜 Theme preview before switching
- 🔜 Scheduled theme switching (day/night)

## 📝 License

Part of the AlgoCDK platform. See main project LICENSE.

## 🤝 Contributing

To improve the theme system:

1. Edit `theme-toggle.js` for functionality changes
2. Edit `theme-enhanced.css` for styling changes
3. Test on all dashboards (app, admin, superadmin)
4. Ensure mobile responsiveness
5. Update this README

## 📞 Support

For issues or questions:
- Check the troubleshooting section above
- Review integration examples
- Contact the development team

---

**Built with ❤️ for AlgoCDK**

*Making dashboards beautiful in any light* 🌓
