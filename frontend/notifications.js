// notifications.js - Enhanced Toast notification system
class NotificationSystem {
  constructor() {
    this.container = null;
    this.notifications = new Set();
    this.init();
  }

  init() {
    this.createContainer();
    this.addStyles();
    console.log('NotificationSystem initialized');
  }

  addStyles() {
    if (document.getElementById('notification-styles')) return;

    const style = document.createElement('style');
    style.id = 'notification-styles';
    style.textContent = `
      .notification-container {
        position: fixed;
        top: 1rem;
        right: 1rem;
        z-index: 9999;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        pointer-events: none;
        max-width: 400px;
      }
      
      @media (max-width: 640px) {
        .notification-container {
          top: 0.5rem;
          right: 0.5rem;
          left: 0.5rem;
          max-width: none;
        }
      }
      
      .notification {
        pointer-events: auto;
        background: rgba(26, 26, 26, 0.95);
        border: 1px solid rgba(255, 69, 0, 0.3);
        border-radius: 12px;
        padding: 1rem;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        display: flex;
        align-items: center;
        gap: 0.75rem;
        transform: translateX(100%);
        opacity: 0;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        word-wrap: break-word;
        min-height: 60px;
      }
      
      .notification.show {
        transform: translateX(0);
        opacity: 1;
      }
      
      .notification-icon {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        color: white;
      }
      
      .notification-content {
        flex: 1;
        color: #ffffff;
        font-size: 0.875rem;
        font-weight: 500;
        line-height: 1.4;
      }
      
      .notification-close {
        width: 24px;
        height: 24px;
        border: none;
        background: none;
        color: #a3a3a3;
        cursor: pointer;
        border-radius: 4px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s;
        flex-shrink: 0;
      }
      
      .notification-close:hover {
        color: #ffffff;
        background: rgba(255, 255, 255, 0.1);
      }
      
      .notification-success {
        border-color: rgba(34, 197, 94, 0.5);
      }
      
      .notification-success .notification-icon {
        background: linear-gradient(135deg, #22c55e, #16a34a);
      }
      
      .notification-error {
        border-color: rgba(239, 68, 68, 0.5);
      }
      
      .notification-error .notification-icon {
        background: linear-gradient(135deg, #ef4444, #dc2626);
      }
      
      .notification-warning {
        border-color: rgba(245, 158, 11, 0.5);
      }
      
      .notification-warning .notification-icon {
        background: linear-gradient(135deg, #f59e0b, #d97706);
      }
      
      .notification-info {
        border-color: rgba(255, 69, 0, 0.5);
      }
      
      .notification-info .notification-icon {
        background: linear-gradient(135deg, #ff4500, #e63e00);
      }
    `;
    document.head.appendChild(style);
  }

  createContainer() {
    if (document.getElementById('notification-container')) {
      this.container = document.getElementById('notification-container');
      return;
    }

    this.container = document.createElement('div');
    this.container.id = 'notification-container';
    this.container.className = 'notification-container';
    document.body.appendChild(this.container);
  }

  show(message, type = 'info', duration = 5000) {
    try {
      if (!this.container) {
        console.warn('Notification container not found, recreating...');
        this.createContainer();
      }
      
      const notification = this.createNotification(message, type);
      this.container.appendChild(notification);
      this.notifications.add(notification);

      // Animate in
      requestAnimationFrame(() => {
        notification.classList.add('show');
      });

      // Auto remove
      const timeoutId = setTimeout(() => {
        this.remove(notification);
      }, duration);

      // Store timeout ID for potential cancellation
      notification.timeoutId = timeoutId;

      console.log(`✓ Notification shown: [${type.toUpperCase()}] ${message}`);
      return notification;
    } catch (error) {
      console.error('Failed to show notification:', error);
      // Fallback to browser alert for critical errors
      if (type === 'error') {
        alert(`Error: ${message}`);
      }
      return null;
    }
  }

  createNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;

    const icon = this.getIcon(type);
    const notificationId = Date.now() + Math.random();

    notification.innerHTML = `
      <div class="notification-icon">
        ${icon}
      </div>
      <div class="notification-content">${this.escapeHtml(message)}</div>
      <button class="notification-close" onclick="window.notifications.remove(this.parentElement)">
        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
        </svg>
      </button>
    `;

    notification.dataset.id = notificationId;
    return notification;
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  getIcon(type) {
    const icons = {
      success: `<svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                </svg>`,
      error: `<svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"/>
              </svg>`,
      warning: `<svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"/>
                </svg>`,
      info: `<svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
             </svg>`
    };
    return icons[type] || icons.info;
  }

  remove(notification) {
    if (!notification || !notification.parentElement) return;
    
    // Clear timeout if exists
    if (notification.timeoutId) {
      clearTimeout(notification.timeoutId);
    }
    
    this.notifications.delete(notification);
    notification.classList.remove('show');
    
    setTimeout(() => {
      if (notification.parentElement) {
        notification.parentElement.removeChild(notification);
      }
    }, 300);
  }

  success(message, duration = 5000) {
    return this.show(message, 'success', duration);
  }

  error(message, duration = 7000) {
    return this.show(message, 'error', duration);
  }

  warning(message, duration = 6000) {
    return this.show(message, 'warning', duration);
  }

  info(message, duration = 5000) {
    return this.show(message, 'info', duration);
  }

  clear() {
    const notifications = Array.from(this.notifications);
    notifications.forEach(notification => {
      this.remove(notification);
    });
  }
}

// Initialize notification system immediately
const notifications = new NotificationSystem();

// Setup utils.notify integration
function setupUtilsNotify() {
  // Ensure utils object exists
  if (!window.utils) {
    window.utils = {};
  }
  
  // Override utils.notify
  window.utils.notify = (message, type = 'info') => {
    notifications.show(message, type);
  };
  
  console.log('✓ Notification system integrated with utils.notify');
}

// Set up immediately
setupUtilsNotify();

// Also set up on DOMContentLoaded as fallback
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', setupUtilsNotify);
} else {
  setupUtilsNotify();
}

// Provide global fallback functions
window.showNotification = (message, type = 'info') => {
  notifications.show(message, type);
};

window.notify = (message, type = 'info') => {
  notifications.show(message, type);
};

// Export for global use
window.notifications = notifications;
window.NotificationSystem = NotificationSystem;

// Debug helper
window.testNotification = () => {
  notifications.show('Test notification working!', 'success');
};