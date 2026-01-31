// superadmin-dashboard.js - Comprehensive SuperAdmin Dashboard
class SuperAdminDashboard {
  constructor() {
    this.currentUser = null;
    this.currentView = 'dashboard';
    this.data = {
      users: [],
      admins: [],
      bots: [],
      stats: {}
    };
    this.init();
  }

  async init() {
    // Only run on superadmin page
    if (window.location.pathname !== '/superadmin') {
      return;
    }
    
    if (!TokenManager.isValid()) {
      window.location.href = '/auth';
      return;
    }

    try {
      await this.loadCurrentUser();
      await this.loadDashboardData();
      this.setupEventListeners();
      this.initializeViews();
    } catch (error) {
      utils.handleError(error);
    }
  }

  async loadCurrentUser() {
    try {
      // Try to get superadmin profile - use a default ID if none stored
      const adminId = localStorage.getItem('superadminId') || '1';
      this.currentUser = await api.superadmin.getProfile(adminId);
      
      // Store the superadmin ID for future use
      if (this.currentUser && this.currentUser.id) {
        localStorage.setItem('superadminId', this.currentUser.id);
      }
      
      // Ensure we stay on superadmin dashboard
      if (window.location.pathname !== '/superadmin') {
        window.location.href = '/superadmin';
      }
    } catch (error) {
      console.error('Failed to load superadmin profile:', error);
      // If we can't load superadmin profile, redirect to auth
      if (error.message.includes('401') || error.message.includes('403')) {
        TokenManager.remove();
        window.location.href = '/auth';
      }
    }
  }

  async loadDashboardData() {
    try {
      console.log('Loading dashboard data...');
      
      // Load users
      try {
        const usersResponse = await api.superadmin.getAllUsers();
        console.log('Raw users response:', usersResponse);
        this.data.users = Array.isArray(usersResponse) ? usersResponse : (usersResponse.users || []);
        console.log('Users loaded:', this.data.users.length);
      } catch (error) {
        console.error('Failed to load users:', error);
        this.data.users = [];
      }

      // Load admins
      try {
        const adminsResponse = await api.superadmin.getAllAdmins();
        console.log('Raw admins response:', adminsResponse);
        this.data.admins = Array.isArray(adminsResponse) ? adminsResponse : (adminsResponse.admins || []);
        console.log('Admins loaded:', this.data.admins.length);
      } catch (error) {
        console.error('Failed to load admins:', error);
        this.data.admins = [];
      }

      // Load bots
      try {
        const botsResponse = await api.superadmin.getBots();
        console.log('Raw bots response:', botsResponse);
        this.data.bots = Array.isArray(botsResponse) ? botsResponse : (botsResponse.bots || []);
        console.log('Bots loaded:', this.data.bots.length);
      } catch (error) {
        console.error('Failed to load bots:', error);
        this.data.bots = [];
      }

      // Load sales data
      try {
        const salesResponse = await api.superadmin.getSales();
        console.log('Raw sales response:', salesResponse);
        this.data.sales = salesResponse.sales || [];
        this.data.salesAnalytics = salesResponse.analytics || {};
        console.log('Sales loaded:', this.data.sales.length);
      } catch (error) {
        console.error('Failed to load sales:', error);
        this.data.sales = [];
        this.data.salesAnalytics = {};
      }

      // Load performance data
      try {
        const performanceResponse = await api.superadmin.getPerformance();
        console.log('Raw performance response:', performanceResponse);
        this.data.performance = performanceResponse || {};
        console.log('Performance data loaded');
      } catch (error) {
        console.error('Failed to load performance:', error);
        this.data.performance = {};
      }

      // Load dashboard stats
      try {
        this.data.stats = await this.loadDashboardStats();
      } catch (error) {
        console.error('Failed to load dashboard stats:', error);
        this.data.stats = {};
      }

      // Update all UI components
      this.updateUserStats();
      this.updateAdminStats();
      this.updateBotStats();
      this.updateSalesStats();
      this.updatePerformanceStats();
      this.updateDashboard();
      
      console.log('Dashboard data loaded successfully');
      
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      utils.notify('Failed to load dashboard data', 'error');
    }
  }

  async loadDashboardStats() {
    try {
      const adminId = localStorage.getItem('superadminId') || '1';
      return await api.superadmin.getDashboard(adminId);
    } catch (error) {
      console.error('Failed to load dashboard stats:', error);
      return {};
    }
  }

  updateUserStats() {
    const totalUsers = this.data.users.length;
    console.log('Updating user stats:', totalUsers);
    
    const usersBadge = document.getElementById('usersBadge');
    const totalUsersCount = document.getElementById('totalUsersCount');
    
    if (usersBadge) {
      usersBadge.textContent = totalUsers;
      console.log('Updated usersBadge to:', totalUsers);
    }
    if (totalUsersCount) {
      totalUsersCount.textContent = totalUsers;
      console.log('Updated totalUsersCount to:', totalUsers);
    }
  }

  updateAdminStats() {
    const totalAdmins = this.data.admins.length;
    console.log('Updating admin stats:', totalAdmins);
    
    const adminsBadge = document.getElementById('adminsBadge');
    const totalAdminsCount = document.getElementById('totalAdminsCount');
    
    if (adminsBadge) {
      adminsBadge.textContent = totalAdmins;
      console.log('Updated adminsBadge to:', totalAdmins);
    }
    if (totalAdminsCount) {
      totalAdminsCount.textContent = totalAdmins;
      console.log('Updated totalAdminsCount to:', totalAdmins);
    }
  }

  updateBotStats() {
    const totalBots = this.data.bots.length;
    console.log('Updating bot stats:', totalBots);
    
    const botsBadge = document.getElementById('botsBadge');
    const totalBotsCount = document.getElementById('totalBotsCount');
    
    if (botsBadge) {
      botsBadge.textContent = totalBots;
      console.log('Updated botsBadge to:', totalBots);
    }
    if (totalBotsCount) {
      totalBotsCount.textContent = totalBots;
      console.log('Updated totalBotsCount to:', totalBots);
    }
  }

  updateSalesStats() {
    const totalSales = this.data.salesAnalytics?.total_sales || 0;
    const totalTransactions = this.data.salesAnalytics?.total_transactions || 0;
    console.log('Updating sales stats:', { totalSales, totalTransactions });
    
    const totalSalesElement = document.getElementById('totalSales');
    const totalTransactionsElement = document.getElementById('totalTransactions');
    
    if (totalSalesElement) {
      totalSalesElement.textContent = utils.formatCurrency(totalSales);
    }
    if (totalTransactionsElement) {
      totalTransactionsElement.textContent = totalTransactions;
    }
  }

  updatePerformanceStats() {
    const performance = this.data.performance || {};
    console.log('Updating performance stats:', performance);
    
    // Update revenue metrics
    const totalRevenueElement = document.getElementById('totalRevenue');
    const companyRevenueElement = document.getElementById('companyRevenue');
    const revenueGrowthElement = document.getElementById('revenueGrowth');
    
    if (totalRevenueElement && performance.revenue_metrics) {
      totalRevenueElement.textContent = utils.formatCurrency(performance.revenue_metrics.total_revenue || 0);
    }
    if (companyRevenueElement && performance.revenue_metrics) {
      companyRevenueElement.textContent = utils.formatCurrency(performance.revenue_metrics.company_revenue || 0);
    }
    if (revenueGrowthElement && performance.revenue_metrics) {
      const growth = performance.revenue_metrics.revenue_growth_rate || 0;
      revenueGrowthElement.textContent = `${growth.toFixed(1)}%`;
      revenueGrowthElement.className = growth >= 0 ? 'text-success' : 'text-danger';
    }
    
    // Update user growth
    const userGrowthElement = document.getElementById('userGrowth');
    if (userGrowthElement && performance.user_metrics) {
      const growth = performance.user_metrics.user_growth_rate || 0;
      userGrowthElement.textContent = `${growth.toFixed(1)}%`;
    }
  }

  updateDashboard() {
    console.log('Updating dashboard with data:', {
      users: this.data.users.length,
      admins: this.data.admins.length,
      bots: this.data.bots.length,
      sales: this.data.sales?.length || 0
    });
    
    this.updateUsersTable();
    this.updateAdminsTable();
    this.updateBotsTable();
    this.updateSalesTable();
    this.updateAnalyticsData();
    this.generateActivityFeed();
    this.updateSystemActivity();
  }

  updateSalesTable() {
    const tbody = document.getElementById('salesTableBody');
    if (!tbody) return;

    const recentSales = this.data.salesAnalytics?.recent_sales || [];
    
    if (recentSales.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="6" class="text-center py-8 text-gray-400">
            No sales found
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = recentSales.map(sale => `
      <tr class="border-b border-gray-700 hover:bg-gray-700">
        <td class="py-3 px-4">
          <span class="font-medium">${sale.bot?.name || 'Unknown Bot'}</span>
        </td>
        <td class="py-3 px-4">
          <div>
            <p class="font-medium">${sale.buyer?.name || 'Unknown'}</p>
            <p class="text-sm text-gray-400">${sale.buyer?.email || ''}</p>
          </div>
        </td>
        <td class="py-3 px-4">
          <div>
            <p class="font-medium">${sale.seller?.name || 'Unknown'}</p>
            <p class="text-sm text-gray-400">${sale.seller?.email || ''}</p>
          </div>
        </td>
        <td class="py-3 px-4">
          <span class="font-semibold text-success">${utils.formatCurrency(sale.amount)}</span>
        </td>
        <td class="py-3 px-4">
          <span class="bg-primary bg-opacity-20 text-primary px-2 py-1 rounded-full text-xs">
            ${sale.sale_type}
          </span>
        </td>
        <td class="py-3 px-4 text-gray-300">
          ${this.formatDate(sale.sale_date)}
        </td>
      </tr>
    `).join('');
  }

  updateAnalyticsData() {
    const performance = this.data.performance || {};
    
    // Update active users
    const activeUsersElement = document.getElementById('activeUsersCount');
    if (activeUsersElement && performance.user_metrics) {
      activeUsersElement.textContent = performance.user_metrics.active_users || 0;
    }
    
    // Update revenue growth rate
    const revenueGrowthRateElement = document.getElementById('revenueGrowthRate');
    if (revenueGrowthRateElement && performance.revenue_metrics) {
      const rate = performance.revenue_metrics.revenue_growth_rate || 0;
      revenueGrowthRateElement.textContent = `${rate.toFixed(1)}%`;
      revenueGrowthRateElement.className = `text-2xl font-bold ${rate >= 0 ? 'text-success' : 'text-danger'}`;
    }
    
    // Update top performers
    this.updateTopPerformers();
  }

  updateTopPerformers() {
    const performance = this.data.performance || {};
    
    // Update top bots
    const topBotsContainer = document.getElementById('topBotsContainer');
    if (topBotsContainer && performance.top_performers?.top_bots) {
      const topBots = performance.top_performers.top_bots.slice(0, 5);
      topBotsContainer.innerHTML = topBots.map(bot => `
        <div class="flex items-center justify-between py-2 border-b border-gray-700 last:border-b-0">
          <div>
            <p class="font-medium">${bot.BotName || 'Unknown Bot'}</p>
            <p class="text-sm text-gray-400">${bot.SalesCount} sales</p>
          </div>
          <span class="text-success font-semibold">${utils.formatCurrency(bot.TotalSales)}</span>
        </div>
      `).join('');
    }
    
    // Update top admins
    const topAdminsContainer = document.getElementById('topAdminsContainer');
    if (topAdminsContainer && performance.top_performers?.top_admins) {
      const topAdmins = performance.top_performers.top_admins.slice(0, 5);
      topAdminsContainer.innerHTML = topAdmins.map(admin => `
        <div class="flex items-center justify-between py-2 border-b border-gray-700 last:border-b-0">
          <div>
            <p class="font-medium">${admin.AdminName || 'Unknown Admin'}</p>
            <p class="text-sm text-gray-400">${admin.TransactionCount} transactions</p>
          </div>
          <span class="text-warning font-semibold">${utils.formatCurrency(admin.TotalRevenue)}</span>
        </div>
      `).join('');
    }
  }

  updateUsersTable() {
    console.log('Updating users table with', this.data.users.length, 'users');
    const tbody = document.getElementById('usersTableBody');
    const recentUsersList = document.getElementById('recentUsersList');
    
    if (this.data.users.length === 0) {
      if (tbody) {
        tbody.innerHTML = `
          <tr>
            <td colspan="6" class="text-center py-8 text-gray-400">
              No users found
            </td>
          </tr>
        `;
      }
      if (recentUsersList) {
        recentUsersList.innerHTML = `
          <div class="text-center py-4 text-gray-400">
            <i class="fas fa-users text-2xl mb-2"></i>
            <p>No users found</p>
          </div>
        `;
      }
      return;
    }

    // Update full users table
    if (tbody) {
      tbody.innerHTML = this.data.users.map(user => `
        <tr class="border-b border-gray-700 hover:bg-gray-700">
          <td class="py-3 px-4">
            <div class="flex items-center">
              <div class="w-8 h-8 bg-primary rounded-full flex items-center justify-center mr-3">
                ${(user.name || user.email || 'U').charAt(0).toUpperCase()}
              </div>
              <span class="font-medium">${user.name || 'User'}</span>
            </div>
          </td>
          <td class="py-3 px-4 text-gray-300">${user.email || 'No email'}</td>
          <td class="py-3 px-4">
            <span class="bg-primary bg-opacity-20 text-primary px-2 py-1 rounded-full text-xs">
              ${user.role || 'User'}
            </span>
          </td>
          <td class="py-3 px-4">
            <span class="bg-success bg-opacity-20 text-success px-2 py-1 rounded-full text-xs">
              Active
            </span>
          </td>
          <td class="py-3 px-4 text-gray-300">${this.formatDate(user.created_at || user.createdAt)}</td>
          <td class="py-3 px-4">
            <div class="flex space-x-2">
              <button onclick="superAdminDashboard.editUser('${user.id}')" class="text-primary hover:text-secondary">
                <i class="fas fa-edit"></i>
              </button>
              <button onclick="superAdminDashboard.deleteUser('${user.id}')" class="text-danger hover:text-red-400">
                <i class="fas fa-trash"></i>
              </button>
            </div>
          </td>
        </tr>
      `).join('');
      console.log('Users table updated');
    }

    // Update recent users list (first 5)
    if (recentUsersList) {
      recentUsersList.innerHTML = this.data.users.slice(0, 5).map(user => `
        <div class="flex items-center space-x-3 p-3 bg-gray-700 rounded-lg">
          <div class="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
            ${(user.name || user.email || 'U').charAt(0).toUpperCase()}
          </div>
          <div class="flex-1">
            <p class="font-medium">${user.name || 'User'}</p>
            <p class="text-sm text-gray-400">${user.email}</p>
          </div>
          <span class="text-xs text-gray-400">${this.formatDate(user.created_at || user.createdAt)}</span>
        </div>
      `).join('');
      console.log('Recent users list updated');
    }
  }

  updateAdminsTable() {
    console.log('Updating admins table with', this.data.admins.length, 'admins');
    const container = document.getElementById('adminsContainer');
    if (!container) return;

    if (this.data.admins.length === 0) {
      container.innerHTML = `
        <div class="text-center py-8">
          <i class="fas fa-user-shield text-4xl text-gray-400 mb-4"></i>
          <p class="text-gray-400 mb-4">No admins found</p>
          <button onclick="showCreateAdminModal()" class="bg-primary hover:bg-secondary px-4 py-2 rounded-lg">
            <i class="fas fa-plus mr-2"></i>Create Admin
          </button>
        </div>
      `;
      return;
    }

    container.innerHTML = `
      <div class="grid gap-4">
        ${this.data.admins.map(admin => `
          <div class="bg-gray-700 p-4 rounded-lg">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-3">
                <div class="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold">
                  ${(admin.name || admin.email || 'A').charAt(0).toUpperCase()}
                </div>
                <div>
                  <h4 class="font-semibold">${admin.name || 'Admin'}</h4>
                  <p class="text-gray-400 text-sm">${admin.email}</p>
                  <span class="bg-success bg-opacity-20 text-success px-2 py-1 rounded-full text-xs">
                    ${admin.status || 'Active'}
                  </span>
                </div>
              </div>
              <div class="flex space-x-2">
                <button onclick="superAdminDashboard.editAdmin('${admin.id}')" class="text-primary hover:text-secondary p-2">
                  <i class="fas fa-edit"></i>
                </button>
                <button onclick="superAdminDashboard.toggleAdminStatus('${admin.id}')" class="text-warning hover:text-yellow-400 p-2">
                  <i class="fas fa-toggle-on"></i>
                </button>
                <button onclick="superAdminDashboard.deleteAdmin('${admin.id}')" class="text-danger hover:text-red-400 p-2">
                  <i class="fas fa-trash"></i>
                </button>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    `;
    console.log('Admins table updated');
  }

  updateBotsTable() {
    console.log('Updating bots table with', this.data.bots.length, 'bots');
    const container = document.getElementById('botsContainer');
    if (!container) return;

    if (this.data.bots.length === 0) {
      container.innerHTML = `
        <div class="text-center py-8">
          <i class="fas fa-robot text-4xl text-gray-400 mb-4"></i>
          <p class="text-gray-400">No bots found</p>
        </div>
      `;
      return;
    }

    container.innerHTML = `
      <div class="grid gap-4">
        ${this.data.bots.map(bot => `
          <div class="bg-gray-700 p-4 rounded-lg">
            <div class="flex justify-between items-start">
              <div>
                <h4 class="font-semibold">${bot.name || 'Bot'}</h4>
                <p class="text-gray-400 text-sm">${bot.description || 'No description'}</p>
                <div class="flex space-x-2 mt-2">
                  <span class="bg-primary bg-opacity-20 text-primary px-2 py-1 rounded-full text-xs">
                    ${bot.category || 'General'}
                  </span>
                  <span class="bg-success bg-opacity-20 text-success px-2 py-1 rounded-full text-xs">
                    Active
                  </span>
                </div>
              </div>
              <div class="text-right">
                <p class="text-success font-semibold">+${bot.performance || '0'}%</p>
                <p class="text-gray-400 text-sm">${utils.formatCurrency(bot.price || 0)}</p>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    `;
    console.log('Bots table updated');
  }

  generateActivityFeed() {
    const activityFeed = document.getElementById('systemActivity');
    if (!activityFeed) return;

    const activities = [
      { icon: 'user-plus', title: 'New user registered', desc: `${this.data.users.length} total users`, time: '2m ago' },
      { icon: 'robot', title: 'Bot scan completed', desc: `${this.data.bots.length} bots scanned`, time: '15m ago' },
      { icon: 'shield-alt', title: 'Admin activity', desc: `${this.data.admins.length} admins active`, time: '1h ago' },
      { icon: 'chart-line', title: 'System health check', desc: 'All systems operational', time: '2h ago' },
      { icon: 'database', title: 'Database backup', desc: 'Backup completed successfully', time: '3h ago' }
    ];

    activityFeed.innerHTML = activities.map(activity => `
      <div class="flex items-start space-x-3">
        <div class="bg-success p-2 rounded-lg">
          <i class="fas fa-${activity.icon} text-white text-sm"></i>
        </div>
        <div class="flex-1">
          <p class="text-sm font-medium">${activity.title}</p>
          <p class="text-xs text-gray-400">${activity.desc}</p>
          <p class="text-xs text-gray-500">${activity.time}</p>
        </div>
      </div>
    `).join('');
  }

  updateSystemActivity() {
    const activeSessions = document.getElementById('activeSessions');
    if (activeSessions) {
      activeSessions.textContent = this.data.users.length + this.data.admins.length;
    }
  }

  setupEventListeners() {
    // Navigation
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const view = link.getAttribute('href').substring(1);
        this.switchView(view);
      });
    });

    // Search functionality
    const searchInput = document.querySelector('.search-box input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.handleSearch(e.target.value);
      });
    }
  }

  switchView(view) {
    this.currentView = view;
    
    // Update active nav
    document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.remove('active');
    });
    document.querySelector(`[href="#${view}"]`)?.classList.add('active');

    // Show appropriate content
    this.renderView(view);
  }

  renderView(view) {
    const mainContent = document.querySelector('.main-content');
    if (!mainContent) return;

    switch (view) {
      case 'users':
        this.renderUsersView();
        break;
      case 'admins':
        this.renderAdminsView();
        break;
      case 'bots':
        this.renderBotsView();
        break;
      case 'security':
        this.renderSecurityView();
        break;
      case 'logs':
        this.renderLogsView();
        break;
      case 'settings':
        this.renderSettingsView();
        break;
      default:
        // Dashboard view is already rendered
        break;
    }
  }

  renderUsersView() {
    const content = `
      <div class="panel">
        <div class="panel-header">
          <h2 class="panel-title">Users Management</h2>
          <button onclick="superAdminDashboard.showCreateUserModal()" class="btn btn-primary">
            <i class="fas fa-plus mr-2"></i>Create User
          </button>
        </div>
        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>User</th>
                <th>Role</th>
                <th>Status</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody id="allUsersTableBody">
              ${this.data.users.map(user => `
                <tr>
                  <td>
                    <div class="user-cell">
                      <div class="user-avatar">${(user.name || user.email || 'U').charAt(0).toUpperCase()}</div>
                      <div class="user-info">
                        <div class="user-name">${user.name || 'User'}</div>
                        <div class="user-email">${user.email || 'No email'}</div>
                      </div>
                    </div>
                  </td>
                  <td><span class="badge badge-primary">${user.role || 'User'}</span></td>
                  <td><span class="badge badge-success">Active</span></td>
                  <td>${this.formatDate(user.createdAt)}</td>
                  <td>
                    <div class="action-menu">
                      <button class="action-btn" onclick="superAdminDashboard.editUser('${user.id}')" title="Edit">
                        <i class="fas fa-edit"></i>
                      </button>
                      <button class="action-btn" onclick="superAdminDashboard.deleteUser('${user.id}')" title="Delete">
                        <i class="fas fa-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;

    document.querySelector('.content-grid').innerHTML = content;
  }

  renderAdminsView() {
    const content = `<div id="adminsContainer"></div>`;
    document.querySelector('.content-grid').innerHTML = content;
    this.updateAdminsTable();
  }

  renderBotsView() {
    const content = `<div id="botsContainer"></div>`;
    document.querySelector('.content-grid').innerHTML = content;
    this.updateBotsTable();
  }

  renderSecurityView() {
    const content = `
      <div class="panel">
        <div class="panel-header">
          <h2 class="panel-title">Security Overview</h2>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div class="stat-card">
            <h3>Failed Login Attempts</h3>
            <p class="text-2xl font-bold">0</p>
          </div>
          <div class="stat-card">
            <h3>Active Sessions</h3>
            <p class="text-2xl font-bold">${this.data.users.length + this.data.admins.length}</p>
          </div>
        </div>
      </div>
    `;
    document.querySelector('.content-grid').innerHTML = content;
  }

  renderLogsView() {
    const content = `
      <div class="panel">
        <div class="panel-header">
          <h2 class="panel-title">System Logs</h2>
        </div>
        <div class="activity-feed">
          <div class="activity-item">
            <div class="activity-icon"><i class="fas fa-info-circle"></i></div>
            <div class="activity-content">
              <div class="activity-title">System started</div>
              <div class="activity-desc">Application initialized successfully</div>
              <div class="activity-time">1h ago</div>
            </div>
          </div>
        </div>
      </div>
    `;
    document.querySelector('.content-grid').innerHTML = content;
  }

  renderSettingsView() {
    const content = `
      <div class="panel">
        <div class="panel-header">
          <h2 class="panel-title">System Settings</h2>
        </div>
        <div class="space-y-4">
          <div class="setting-item">
            <h3>Maintenance Mode</h3>
            <button class="btn btn-secondary">Toggle</button>
          </div>
          <div class="setting-item">
            <h3>Backup Settings</h3>
            <button class="btn btn-secondary">Configure</button>
          </div>
        </div>
      </div>
    `;
    document.querySelector('.content-grid').innerHTML = content;
  }

  // Action methods
  async createUser(userData) {
    try {
      await api.superadmin.createUser(userData);
      utils.notify('User created successfully', 'success');
      await this.loadDashboardData();
    } catch (error) {
      utils.notify('Failed to create user', 'error');
    }
  }

  async editUser(userId) {
    // Implementation for editing user
    utils.notify('Edit user functionality to be implemented', 'info');
  }

  async deleteUser(userId) {
    if (confirm('Are you sure you want to delete this user?')) {
      try {
        await api.superadmin.deleteUser(userId);
        utils.notify('User deleted successfully', 'success');
        await this.loadDashboardData();
      } catch (error) {
        utils.notify('Failed to delete user', 'error');
      }
    }
  }

  async createAdmin(adminData) {
    try {
      await api.superadmin.createAdmin(adminData);
      utils.notify('Admin created successfully', 'success');
      await this.loadDashboardData();
    } catch (error) {
      utils.notify('Failed to create admin', 'error');
    }
  }

  async editAdmin(adminId) {
    utils.notify('Edit admin functionality to be implemented', 'info');
  }

  async toggleAdminStatus(adminId) {
    try {
      await api.superadmin.toggleAdminStatus();
      utils.notify('Admin status updated', 'success');
      await this.loadDashboardData();
    } catch (error) {
      utils.notify('Failed to update admin status', 'error');
    }
  }

  async deleteAdmin(adminId) {
    if (confirm('Are you sure you want to delete this admin?')) {
      try {
        await api.superadmin.deleteAdmin();
        utils.notify('Admin deleted successfully', 'success');
        await this.loadDashboardData();
      } catch (error) {
        utils.notify('Failed to delete admin', 'error');
      }
    }
  }

  async scanAllBots() {
    try {
      await api.superadmin.scanBots();
      utils.notify('Bot scan initiated', 'success');
    } catch (error) {
      utils.notify('Failed to scan bots', 'error');
    }
  }

  // Modal methods
  showCreateUserModal() {
    utils.notify('Create user modal to be implemented', 'info');
  }

  showCreateAdminModal() {
    utils.notify('Create admin modal to be implemented', 'info');
  }

  // Utility methods
  formatDate(timestamp) {
    if (!timestamp) return 'N/A';
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  }

  handleSearch(query) {
    // Implementation for search functionality
    console.log('Searching for:', query);
  }

  initializeViews() {
    // Set up initial view based on URL hash
    const hash = window.location.hash.substring(1);
    if (hash) {
      this.switchView(hash);
    }
  }

  async refreshData() {
    await this.loadDashboardData();
    utils.notify('Data refreshed', 'success');
  }
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  console.log('SuperAdmin dashboard script loaded');
  if (window.location.pathname === '/superadmin') {
    console.log('Initializing SuperAdmin dashboard');
    window.superAdminDashboard = new SuperAdminDashboard();
  }
});

// Export for use in other scripts
window.SuperAdminDashboard = SuperAdminDashboard;