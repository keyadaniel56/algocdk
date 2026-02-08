# Dark/Light Mode Integration Guide

## Quick Setup

Add these lines to your dashboard HTML files:

### 1. In the `<head>` section, add:
```html
<link rel="stylesheet" href="/theme-enhanced.css">
```

### 2. Before the closing `</body>` tag, add:
```html
<script src="/theme-toggle.js"></script>
```

### 3. The theme toggle button will automatically appear in your header!

## Files Modified

1. **theme-toggle.js** - Handles theme switching logic
2. **theme-enhanced.css** - Provides comprehensive light/dark mode styles
3. **routes.go** - Serves the new theme files

## Features

✅ Automatic theme persistence (remembers user preference)
✅ Smooth transitions between themes
✅ Responsive design maintained
✅ Works across all dashboards
✅ Mobile-friendly toggle button

## Manual Integration (if needed)

If the automatic button doesn't appear, add this to your header:

```html
<button id="themeToggle" class="theme-toggle-btn" onclick="window.themeManager.toggle()">
    <i class="fas fa-sun"></i>
</button>
```

## Customization

To customize colors, edit the CSS variables in `theme-enhanced.css`:

```css
:root {
    --primary: #FF4500;
    --success: #10B981;
    /* etc... */
}
```

## Testing

1. Open any dashboard (app.html, admin_dashboard.html, superadmin_dashboard.html)
2. Look for the sun/moon icon in the header
3. Click to toggle between light and dark modes
4. Refresh the page - your preference is saved!

## Browser Support

- Chrome/Edge: ✅
- Firefox: ✅
- Safari: ✅
- Mobile browsers: ✅
