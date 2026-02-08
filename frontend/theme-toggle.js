// Theme Toggle System for AlgoCDK Dashboards
class ThemeManager {
    constructor() {
        this.theme = localStorage.getItem('theme') || 'dark';
        this.buttons = [];
        this.init();
    }

    init() {
        this.applyTheme(this.theme, false);
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.createToggleButton());
        } else {
            this.createToggleButton();
        }
    }

    applyTheme(theme, save = true) {
        document.documentElement.setAttribute('data-theme', theme);
        document.body.classList.toggle('light-mode', theme === 'light');
        document.body.classList.toggle('dark-mode', theme === 'dark');
        
        this.theme = theme;
        if (save) localStorage.setItem('theme', theme);
    }

    toggle() {
        const newTheme = this.theme === 'dark' ? 'light' : 'dark';
        this.applyTheme(newTheme);
        this.updateAllButtons();
    }

    createToggleButton() {
        const selectors = [
            'header.desktop-header .flex.items-center.space-x-4',
            'header.mobile-header .flex.items-center.justify-between',
            'header .flex.items-center.space-x-4',
            'header .actions'
        ];
        
        selectors.forEach(selector => {
            const container = document.querySelector(selector);
            if (container && !container.querySelector('.theme-toggle-btn')) {
                const button = this.createButton();
                if (selector.includes('mobile')) {
                    container.appendChild(button);
                } else {
                    container.insertBefore(button, container.firstChild);
                }
                this.buttons.push(button);
            }
        });
    }

    createButton() {
        const button = document.createElement('button');
        button.className = 'theme-toggle-btn bg-gray-700 hover:bg-gray-600 p-2 rounded-lg transition-colors';
        button.setAttribute('aria-label', 'Toggle theme');
        button.innerHTML = this.getIcon();
        button.onclick = () => this.toggle();
        return button;
    }

    getIcon() {
        return this.theme === 'dark'
            ? '<i class="fas fa-sun text-yellow-400"></i>'
            : '<i class="fas fa-moon text-blue-400"></i>';
    }

    updateAllButtons() {
        const icon = this.getIcon();
        this.buttons.forEach(btn => btn.innerHTML = icon);
        document.querySelectorAll('.theme-toggle-btn').forEach(btn => btn.innerHTML = icon);
    }
}

// Initialize theme manager
if (!window.themeManager) {
    window.themeManager = new ThemeManager();
}
