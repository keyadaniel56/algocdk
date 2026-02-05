// admin-dashboard.js - Admin Dashboard Management
class AdminDashboard {
  constructor() {
    this.data = {
      dashboard: {},
      bots: [],
      transactions: [],
      profile: {}
    };
    this.init();
  }

  async init() {
    if (window.location.pathname !== '/admin') {
      return;
    }
    
    if (!TokenManager.isValid()) {
      window.location.href = '/auth';
      return;
    }

    try {
      await this.loadCurrentUser();
    } catch (err) {
      console.error('Failed to validate admin user:', err);
      return;
    }
    try {
      this.showLoading(true);
      await this.loadDashboardData();
      this.setupEventListeners();
      this.showLoading(false);
    } catch (error) {
      this.showLoading(false);
      utils.handleError(error);
    }
  }

  async loadCurrentUser() {
    try {
      const payload = TokenManager.getPayload();
      // admin profile endpoint uses the token to determine current admin
      const profileResponse = await api.admin.getProfile();
      const admin = profileResponse && profileResponse.admin ? profileResponse.admin : profileResponse;

      // If role does not include 'admin', show wrong-page and redirect
      const role = (admin && admin.role) ? String(admin.role).toLowerCase() : '';
      if (!role.includes('admin')) {
        // Not an admin - clear token and show wrong page overlay
        TokenManager.remove();
        // Reuse the overlay function from SuperAdminDashboard if available, otherwise fallback
        if (window.SuperAdminDashboard && typeof window.SuperAdminDashboard.prototype.showWrongPageMessageAndRedirect === 'function') {
          // create a temporary instance to call the overlay
          const tmp = new window.SuperAdminDashboard();
          tmp.showWrongPageMessageAndRedirect('/auth');
        } else {
          // simple fallback overlay
          const overlay = document.createElement('div');
          overlay.style.position = 'fixed'; overlay.style.inset = '0'; overlay.style.display = 'flex'; overlay.style.alignItems = 'center'; overlay.style.justifyContent = 'center'; overlay.style.background = 'rgba(0,0,0,0.8)'; overlay.style.zIndex = '9999';
          overlay.innerHTML = '<div style="background:#1f2937;color:#fff;padding:24px;border-radius:8px;text-align:center;max-width:480px;"><h2>Wrong Page</h2><p>You have accessed the Admin area by mistake. Redirecting to the login page...</p></div>';
          document.body.appendChild(overlay);
          setTimeout(() => window.location.href = '/auth', 3000);
        }
        throw new Error('not an admin');
      }

      // store some profile info
      this.data.profile = admin || {};
    } catch (err) {
      console.error('Error loading current admin profile:', err);
      if (err.message && (err.message.includes('401') || err.message.includes('403'))) {
        TokenManager.remove();
        window.location.href = '/auth';
      }
      throw err;
    }
  }

  async loadDashboardData() {
    try {
      // Load dashboard stats
      const dashboardResponse = await api.admin.getDashboard();
      this.data.dashboard = dashboardResponse.data || {};
      this.updateDashboardStats();

      // Load bots
      const botsResponse = await api.admin.getBots();
      this.data.bots = botsResponse.bots || [];
      this.updateBotsTable();

      // Load transactions
      const transactionsResponse = await api.admin.getTransactions();
      this.data.transactions = transactionsResponse.transactions || [];
      this.updateActivity();

      // Load profile
      const profileResponse = await api.admin.getProfile();
      this.data.profile = profileResponse.admin || {};
      this.updateProfile();

    } catch (error) {
      console.error('Error loading dashboard data:', error);
      utils.notify('Failed to load dashboard data', 'error');
    }
  }

  updateDashboardStats() {
    const data = this.data.dashboard;
    
    // Update revenue
    const totalRevenueEl = document.getElementById('totalRevenue');
    if (totalRevenueEl) {
      totalRevenueEl.textContent = utils.formatCurrency(data.adminShare || 0);
    }

    // Update active bots
    const activeBotsEl = document.getElementById('activeBots');
    if (activeBotsEl) {
      activeBotsEl.textContent = data.activeBots || 0;
    }

    // Update total users
    const totalUsersEl = document.getElementById('totalUsers');
    if (totalUsersEl) {
      totalUsersEl.textContent = data.totalUsers || 0;
    }

    // Update transactions
    const totalTransactionsEl = document.getElementById('totalTransactions');
    if (totalTransactionsEl) {
      totalTransactionsEl.textContent = data.totalTransactions || 0;
    }

    // Update growth indicators
    this.updateGrowthIndicators(data);
  }

  updateGrowthIndicators(data) {
    // Revenue change
    const revenueChangeEl = document.getElementById('revenueChange');
    if (revenueChangeEl && data.revenueGrowth !== undefined) {
      const growth = data.revenueGrowth || 0;
      revenueChangeEl.textContent = `${growth >= 0 ? '+' : ''}${growth.toFixed(1)}%`;
      revenueChangeEl.parentElement.className = `stat-change ${growth >= 0 ? 'positive' : 'negative'}`;
    }

    // Bots change
    const botsChangeEl = document.getElementById('botsChange');
    if (botsChangeEl) {
      botsChangeEl.textContent = data.activeBots > 0 ? 'Running well' : 'No active bots';
    }

    // Users change
    const usersChangeEl = document.getElementById('usersChange');
    if (usersChangeEl && data.newUsersToday !== undefined) {
      usersChangeEl.textContent = `+${data.newUsersToday || 0} new today`;
    }

    // Transactions change
    const transactionsChangeEl = document.getElementById('transactionsChange');
    if (transactionsChangeEl) {
      const successRate = data.transactionSuccessRate || 100;
      transactionsChangeEl.textContent = `${successRate}% successful`;
    }
  }

  updateBotsTable() {
    const tbody = document.getElementById('botsTableBody');
    if (!tbody) return;

    if (this.data.bots.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="5" style="text-align: center; padding: 2rem; color: var(--text-secondary);">
            No bots found. <a href="#" onclick="createBot()" style="color: var(--primary);">Create your first bot</a>
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = this.data.bots.map(bot => `
      <tr>
        <td>
          <div style="font-weight: 500;">${bot.name || 'Unnamed Bot'}</div>
          <div style="font-size: 0.875rem; color: var(--text-secondary);">${bot.strategy || 'No strategy'}</div>
        </td>
        <td>
          <span class="status-badge status-${(bot.status || 'inactive').toLowerCase()}">
            ${bot.status || 'inactive'}
          </span>
        </td>
        <td>${bot.users?.length || 0}</td>
        <td>${utils.formatCurrency(bot.price || 0)}</td>
        <td>
          <div class="action-buttons">
            <button class="btn btn-primary" onclick="editBot('${bot.id}')">Edit</button>
            <button class="btn btn-danger" onclick="deleteBot('${bot.id}')">Delete</button>
          </div>
        </td>
      </tr>
    `).join('');
  }

  updateActivity() {
    const activityList = document.getElementById('activityList');
    if (!activityList) return;

    if (this.data.transactions.length === 0) {
      activityList.innerHTML = `
        <li class="activity-item">
          <div class="activity-icon">
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"/>
            </svg>
          </div>
          <div class="activity-content">
            <div class="activity-title">No recent activity</div>
            <div class="activity-time">Your transactions will appear here</div>
          </div>
        </li>
      `;
      return;
    }

    activityList.innerHTML = this.data.transactions.slice(0, 5).map(transaction => `
      <li class="activity-item">
        <div class="activity-icon">
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"/>
          </svg>
        </div>
        <div class="activity-content">
          <div class="activity-title">
            ${transaction.description || `Payment of ${utils.formatCurrency(transaction.amount || 0)}`}
          </div>
          <div class="activity-time">${this.formatTime(transaction.created_at)}</div>
        </div>
      </li>
    `).join('');
  }

  updateProfile() {
    if (this.data.profile.name) {
      const initial = this.data.profile.name.charAt(0).toUpperCase();
      const userAvatar = document.getElementById('userAvatar');
      const userName = document.getElementById('userName');
      
      if (userAvatar) {
        userAvatar.textContent = initial;
      }
      if (userName) {
        userName.textContent = this.data.profile.name;
      }
    }
  }

  setupEventListeners() {
    // Navigation
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const href = link.getAttribute('href');
        if (href.startsWith('#')) {
          this.switchView(href.substring(1));
        }
      });
    });
  }

  switchView(view) {
    // Update active nav
    document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.remove('active');
    });
    document.querySelector(`[href="#${view}"]`)?.classList.add('active');

    // Handle view switching logic here
    console.log('Switching to view:', view);
  }

  showLoading(show) {
    const loadingEl = document.getElementById('loadingState');
    if (loadingEl) {
      loadingEl.style.display = show ? 'block' : 'none';
    }
  }

  // Action methods
  async createBot() {
    // Show create bot modal or redirect
    const name = prompt('Enter bot name:');
    if (!name) return;
    
    const price = prompt('Enter bot price:');
    if (!price) return;
    
    const strategy = prompt('Enter bot strategy:');
    if (!strategy) return;

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('price', price);
      formData.append('strategy', strategy);
      
      // Note: In production, you'd have a proper form with file uploads
      utils.notify('Bot creation requires file uploads. Please use the full form.', 'info');
      
    } catch (error) {
      utils.notify('Failed to create bot', 'error');
    }
  }

  async editBot(botId) {
    utils.notify(`Edit bot ${botId} - Feature coming soon`, 'info');
  }

  async deleteBot(botId) {
    if (confirm('Are you sure you want to delete this bot?')) {
      try {
        await api.admin.deleteBot(botId);
        utils.notify('Bot deleted successfully', 'success');
        await this.loadDashboardData();
      } catch (error) {
        utils.notify('Failed to delete bot', 'error');
      }
    }
  }

  async refreshData() {
    this.showLoading(true);
    await this.loadDashboardData();
    this.showLoading(false);
    utils.notify('Data refreshed', 'success');
  }

  // Utility methods
  formatTime(timestamp) {
    if (!timestamp) return 'Just now';
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  }
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  if (window.location.pathname === '/admin') {
    window.adminDashboard = new AdminDashboard();
  }
});

// Export for use in other scripts
window.AdminDashboard = AdminDashboard;