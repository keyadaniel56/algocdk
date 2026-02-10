
// components.js - Reusable UI Components

const Components = {
    // Standard Navigation Bar
    renderNav: function (activePage = '') {
        // Try to get user from local storage
        let user = { name: 'Guest' };
        try {
            const userData = localStorage.getItem('userData');
            if (userData) user = JSON.parse(userData);
        } catch (e) { }

        return `
        <header class="main-header">
            <div class="flex items-center gap-4">
                <a href="/index.html" class="brand-logo">
                    <div class="brand-icon">
                        <i class="fas fa-chart-line"></i>
                    </div>
                    <span>AlgoCDK</span>
                </a>
                
                <nav class="nav-menu hidden lg:flex items-center gap-2">
                    <a href="/app.html" class="${activePage === 'dashboard' ? 'active' : ''}">Dashboard</a>
                    <a href="/trading.html" class="${activePage === 'trading' ? 'active' : ''}">Trade</a>
                    <a href="/mybots.html" class="${activePage === 'bots' ? 'active' : ''}">My Bots</a>
                    <a href="/botstore.html" class="${activePage === 'store' ? 'active' : ''}">Store</a>
                    <a href="/marketchart.html" class="${activePage === 'charts' ? 'active' : ''}">Charts</a>
                </nav>
            </div>

            <div class="flex items-center gap-4">
                <div class="hidden md:block text-right">
                    <div class="text-xs text-secondary">Balance</div>
                    <div class="font-bold text-success">$10,432.50</div>
                </div>

                <div class="flex items-center gap-2">
                    <button id="themeToggleBtn" class="btn btn-ghost p-2" aria-label="Toggle Theme">
                        <i class="fas fa-moon"></i>
                    </button>
                    
                    <div class="relative">
                        <button id="userMenuBtn" class="btn btn-ghost flex items-center gap-2">
                            <i class="fas fa-user-circle text-xl"></i>
                            <span id="userName" class="hidden md:inline">${user.name}</span>
                            <i class="fas fa-chevron-down text-xs"></i>
                        </button>
                        
                        <div id="userMenuDropdown" class="dropdown-menu">
                            <a href="/profile.html" class="dropdown-item">
                                <i class="fas fa-user"></i> Profile
                            </a>
                            <a href="/settings.html" class="dropdown-item">
                                <i class="fas fa-cog"></i> Settings
                            </a>
                            <div class="border-b"></div>
                            <a href="#" onclick="logout()" class="dropdown-item text-danger">
                                <i class="fas fa-sign-out-alt"></i> Logout
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </header>
        `;
    },

    // Initialize Components
    init: function () {
        this.setupEventListeners();
    },

    setupEventListeners: function () {
        // User Menu Dropdown
        const userBtn = document.getElementById('userMenuBtn');
        const userMenu = document.getElementById('userMenuDropdown');

        if (userBtn && userMenu) {
            userBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                userMenu.classList.toggle('show');
            });

            document.addEventListener('click', (e) => {
                if (!userMenu.contains(e.target)) {
                    userMenu.classList.remove('show');
                }
            });
        }
    }
};

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    window.location.href = '/index.html';
}

// Global exposure
window.Components = Components;
