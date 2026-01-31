// notifications.js - Toast notification system
class NotificationSystem {
  constructor() {
    this.container = null;
    this.init();
  }

  init() {
    this.createContainer();
    this.addStyles();
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
        z-index: 1000;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        pointer-events: none;
      }
      
      .notification {
        pointer-events: auto;
        max-width: 400px;
        background: rgba(26, 26, 26, 0.95);
        border: 1px solid rgba(255, 69, 0, 0.3);
        border-radius: 12px;
        padding: 1rem;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
        backdrop-filter: blur(10px);
        display: flex;
        align-items: center;
        gap: 0.75rem;
        transform: translateX(100%);
        opacity: 0;
        transition: all 0.3s ease-in-out;
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
      }
      
      .notification-content {
        flex: 1;
        color: #ffffff;
        font-size: 0.875rem;
        font-weight: 500;
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
        transition: color 0.2s;
      }
      
      .notification-close:hover {
        color: #ffffff;
        background: rgba(255, 255, 255, 0.1);
      }
      
      .notification-success .notification-icon {
        background: linear-gradient(135deg, #22c55e, #16a34a);
      }
      
      .notification-error .notification-icon {
        background: linear-gradient(135deg, #ef4444, #dc2626);
      }
      
      .notification-warning .notification-icon {
        background: linear-gradient(135deg, #f59e0b, #d97706);
      }
      
      .notification-info .notification-icon {
        background: linear-gradient(135deg, #ff4500, #e63e00);
      }
    `;
    document.head.appendChild(style);
  }

  createContainer() {
    if (document.getElementById('notification-container')) return;

    this.container = document.createElement('div');
    this.container.id = 'notification-container';
    this.container.className = 'notification-container';
    document.body.appendChild(this.container);
  }

  show(message, type = 'info', duration = 5000) {
    const notification = this.createNotification(message, type);
    this.container.appendChild(notification);

    // Animate in
    setTimeout(() => {
      notification.classList.add('show');
    }, 10);

    // Auto remove
    setTimeout(() => {
      this.remove(notification);
    }, duration);

    return notification;
  }

  createNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;

    const icon = this.getIcon(type);

    notification.innerHTML = `
      <div class="notification-icon">
        ${icon}
      </div>
      <div class="notification-content">${message}</div>
      <button class="notification-close" onclick="notifications.remove(this.parentElement)">
        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
        </svg>
      </button>
    `;

    return notification;
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
    notification.classList.remove('show');
    setTimeout(() => {
      if (notification.parentElement) {
        notification.parentElement.removeChild(notification);
      }
    }, 300);
  }

  success(message, duration) {
    return this.show(message, 'success', duration);
  }

  error(message, duration) {
    return this.show(message, 'error', duration);
  }

  warning(message, duration) {
    return this.show(message, 'warning', duration);
  }

  info(message, duration) {
    return this.show(message, 'info', duration);
  }

  clear() {
    const notifications = this.container.querySelectorAll('.notification');
    notifications.forEach(notification => {
      this.remove(notification);
    });
  }
}

// Initialize notification system
const notifications = new NotificationSystem();

// Override utils.notify to use the notification system
if (window.utils) {
  window.utils.notify = (message, type = 'info') => {
    notifications.show(message, type);
  };
} else {
  // If utils isn't loaded yet, set it up when it is
  document.addEventListener('DOMContentLoaded', () => {
    if (window.utils) {
      window.utils.notify = (message, type = 'info') => {
        notifications.show(message, type);
      };
    }
  });
}

// Export for global use
window.notifications = notifications;
window.NotificationSystem = NotificationSystem;