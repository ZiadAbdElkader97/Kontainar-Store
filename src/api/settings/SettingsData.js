// Settings API Service
class SettingsService {
  constructor() {
    this.storageKey = 'storeSettings';
    this.initializeDefaultSettings();
  }

  // Initialize default settings if none exist
  initializeDefaultSettings() {
    const existingSettings = this.getSettings();
    if (!existingSettings || Object.keys(existingSettings).length === 0) {
      const defaultSettings = {
        // Store Information
        storeName: 'Kontainar Store',
        storeDescription: 'Your one-stop shop for quality products',
        storeLogo: '',
        storeEmail: 'info@kontainarstore.com',
        storePhone: '+1 (555) 123-4567',
        storeAddress: '123 Main Street, City, State 12345',
        storeWebsite: 'https://kontainarstore.com',
        
        // Business Information
        businessType: 'retail',
        taxId: 'TAX123456789',
        businessLicense: 'BL987654321',
        foundedYear: 2020,
        currency: 'USD',
        timezone: 'America/New_York',
        language: 'en',
        
        // Store Policies
        returnPolicy: '30 days return policy for unused items',
        shippingPolicy: 'Free shipping on orders over $50',
        privacyPolicy: 'We respect your privacy and protect your data',
        termsOfService: 'By using our service, you agree to our terms',
        
        // Payment Settings
        paymentMethods: ['credit_card', 'paypal', 'bank_transfer'],
        defaultPaymentMethod: 'credit_card',
        currencySymbol: '$',
        taxRate: 8.5,
        shippingCost: 5.99,
        freeShippingThreshold: 50,
        
        // Email Settings
        emailNotifications: {
          newOrder: true,
          orderShipped: true,
          orderDelivered: true,
          lowStock: true,
          newReview: true,
          newsletter: true,
        },
        smtpSettings: {
          host: 'smtp.gmail.com',
          port: 587,
          secure: false,
          username: '',
          password: '',
        },
        
        // Social Media
        socialMedia: {
          facebook: 'https://facebook.com/kontainarstore',
          twitter: 'https://twitter.com/kontainarstore',
          instagram: 'https://instagram.com/kontainarstore',
          linkedin: 'https://linkedin.com/company/kontainarstore',
          youtube: 'https://youtube.com/kontainarstore',
        },
        
        // SEO Settings
        seoSettings: {
          metaTitle: 'Kontainar Store - Quality Products Online',
          metaDescription: 'Shop quality products at Kontainar Store. Fast shipping, great prices, excellent customer service.',
          metaKeywords: 'store, products, shopping, quality, online',
          googleAnalyticsId: '',
          facebookPixelId: '',
        },
        
        // Security Settings
        securitySettings: {
          requireEmailVerification: true,
          requirePhoneVerification: false,
          twoFactorAuth: false,
          sessionTimeout: 30, // minutes
          maxLoginAttempts: 5,
          passwordMinLength: 8,
        },
        
        // Inventory Settings
        inventorySettings: {
          lowStockThreshold: 10,
          autoReorder: false,
          trackInventory: true,
          allowBackorders: false,
          stockAlertEmail: true,
        },
        
        // Review Settings
        reviewSettings: {
          allowReviews: true,
          requireApproval: true,
          allowAnonymousReviews: false,
          minReviewLength: 10,
          maxReviewLength: 500,
          autoApproveVerified: true,
        },
        
        // Coupon Settings
        couponSettings: {
          allowCoupons: true,
          maxCouponUsage: 1000,
          couponExpiryDays: 30,
          allowStacking: false,
          requireMinimumOrder: true,
        },
        
        // Maintenance Settings
        maintenanceSettings: {
          maintenanceMode: false,
          maintenanceMessage: 'We are currently performing maintenance. Please check back later.',
          allowAdminAccess: true,
        },
        
        // Backup Settings
        backupSettings: {
          autoBackup: true,
          backupFrequency: 'daily', // daily, weekly, monthly
          backupRetention: 30, // days
          backupLocation: 'cloud', // local, cloud
        },
        
        // Theme Settings
        themeSettings: {
          primaryColor: '#1976d2',
          secondaryColor: '#dc004e',
          backgroundColor: '#ffffff',
          textColor: '#000000',
          fontFamily: 'Roboto',
          fontSize: 'medium',
          layout: 'modern',
        },
        
        // Notification Settings
        notificationSettings: {
          browserNotifications: true,
          emailNotifications: true,
          smsNotifications: false,
          pushNotifications: true,
          soundNotifications: true,
        },
        
        // Analytics Settings
        analyticsSettings: {
          trackUserBehavior: true,
          trackPageViews: true,
          trackConversions: true,
          anonymizeIp: true,
          cookieConsent: true,
        },
        
        // API Settings
        apiSettings: {
          enableApi: true,
          apiVersion: 'v1',
          rateLimit: 1000, // requests per hour
          requireApiKey: true,
          allowCors: true,
        },
        
        // Cache Settings
        cacheSettings: {
          enableCache: true,
          cacheDuration: 3600, // seconds
          cacheStrategy: 'lru', // lru, fifo, ttl
          clearCacheOnUpdate: true,
        },
        
        // Logging Settings
        loggingSettings: {
          enableLogging: true,
          logLevel: 'info', // debug, info, warn, error
          logRetention: 30, // days
          logToFile: true,
          logToConsole: true,
        },
        
        // Feature Flags
        featureFlags: {
          enableWishlist: true,
          enableCompare: true,
          enableQuickView: true,
          enableLiveChat: true,
          enableReviews: true,
          enableCoupons: true,
          enableNewsletter: true,
          enableSocialLogin: true,
        },
        
        // Timestamps
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        version: '1.0.0',
      };

      localStorage.setItem(this.storageKey, JSON.stringify(defaultSettings));
    }
  }

  // Get all settings
  getSettings() {
    try {
      const settings = localStorage.getItem(this.storageKey);
      return settings ? JSON.parse(settings) : {};
    } catch (error) {
      console.error('Error getting settings:', error);
      return {};
    }
  }

  // Get specific setting by key
  getSetting(key) {
    try {
      const settings = this.getSettings();
      return settings[key];
    } catch (error) {
      console.error('Error getting setting:', error);
      return null;
    }
  }

  // Update settings
  updateSettings(newSettings) {
    try {
      const currentSettings = this.getSettings();
      const updatedSettings = {
        ...currentSettings,
        ...newSettings,
        updatedAt: new Date().toISOString(),
      };

      localStorage.setItem(this.storageKey, JSON.stringify(updatedSettings));
      return updatedSettings;
    } catch (error) {
      console.error('Error updating settings:', error);
      throw error;
    }
  }

  // Update specific setting
  updateSetting(key, value) {
    try {
      const currentSettings = this.getSettings();
      const updatedSettings = {
        ...currentSettings,
        [key]: value,
        updatedAt: new Date().toISOString(),
      };

      localStorage.setItem(this.storageKey, JSON.stringify(updatedSettings));
      return updatedSettings;
    } catch (error) {
      console.error('Error updating setting:', error);
      throw error;
    }
  }

  // Reset settings to default
  resetSettings() {
    try {
      localStorage.removeItem(this.storageKey);
      this.initializeDefaultSettings();
      return this.getSettings();
    } catch (error) {
      console.error('Error resetting settings:', error);
      throw error;
    }
  }

  // Export settings
  exportSettings() {
    try {
      const settings = this.getSettings();
      const dataStr = JSON.stringify(settings, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      
      const link = document.createElement('a');
      link.href = URL.createObjectURL(dataBlob);
      link.download = `store-settings-${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      
      return true;
    } catch (error) {
      console.error('Error exporting settings:', error);
      throw error;
    }
  }

  // Import settings
  importSettings(file) {
    try {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const settings = JSON.parse(e.target.result);
            this.updateSettings(settings);
            resolve(settings);
          } catch (error) {
            reject(new Error('Invalid settings file format'));
          }
        };
        reader.onerror = () => reject(new Error('Error reading file'));
        reader.readAsText(file);
      });
    } catch (error) {
      console.error('Error importing settings:', error);
      throw error;
    }
  }

  // Validate settings
  validateSettings(settings) {
    const errors = [];

    // Required fields validation
    if (!settings.storeName || settings.storeName.trim() === '') {
      errors.push('Store name is required');
    }

    if (!settings.storeEmail || !this.isValidEmail(settings.storeEmail)) {
      errors.push('Valid store email is required');
    }

    if (settings.taxRate < 0 || settings.taxRate > 100) {
      errors.push('Tax rate must be between 0 and 100');
    }

    if (settings.shippingCost < 0) {
      errors.push('Shipping cost cannot be negative');
    }

    if (settings.freeShippingThreshold < 0) {
      errors.push('Free shipping threshold cannot be negative');
    }

    return {
      isValid: errors.length === 0,
      errors: errors,
    };
  }

  // Helper function to validate email
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Get settings by category
  getSettingsByCategory(category) {
    try {
      const settings = this.getSettings();
      const categorySettings = {};

      Object.keys(settings).forEach(key => {
        if (key.includes(category) || key.endsWith('Settings')) {
          categorySettings[key] = settings[key];
        }
      });

      return categorySettings;
    } catch (error) {
      console.error('Error getting settings by category:', error);
      return {};
    }
  }

  // Update settings by category
  updateSettingsByCategory(category, categorySettings) {
    try {
      const currentSettings = this.getSettings();
      const updatedSettings = {
        ...currentSettings,
        ...categorySettings,
        updatedAt: new Date().toISOString(),
      };

      localStorage.setItem(this.storageKey, JSON.stringify(updatedSettings));
      return updatedSettings;
    } catch (error) {
      console.error('Error updating settings by category:', error);
      throw error;
    }
  }

  // Get settings statistics
  getSettingsStats() {
    try {
      const settings = this.getSettings();
      const totalSettings = Object.keys(settings).length;
      const categories = [
        'store', 'business', 'payment', 'email', 'social', 'seo',
        'security', 'inventory', 'review', 'coupon', 'maintenance',
        'backup', 'theme', 'notification', 'analytics', 'api',
        'cache', 'logging', 'feature'
      ];

      return {
        totalSettings,
        categories: categories.length,
        lastUpdated: settings.updatedAt,
        version: settings.version || '1.0.0',
      };
    } catch (error) {
      console.error('Error getting settings stats:', error);
      return {
        totalSettings: 0,
        categories: 0,
        lastUpdated: null,
        version: '1.0.0',
      };
    }
  }
}

// Create service instance
const settingsService = new SettingsService();

// Export individual methods
export const getSettings = () => settingsService.getSettings();
export const getSetting = (key) => settingsService.getSetting(key);
export const updateSettings = (newSettings) => settingsService.updateSettings(newSettings);
export const updateSetting = (key, value) => settingsService.updateSetting(key, value);
export const resetSettings = () => settingsService.resetSettings();
export const exportSettings = () => settingsService.exportSettings();
export const importSettings = (file) => settingsService.importSettings(file);
export const validateSettings = (settings) => settingsService.validateSettings(settings);
export const getSettingsByCategory = (category) => settingsService.getSettingsByCategory(category);
export const updateSettingsByCategory = (category, categorySettings) => settingsService.updateSettingsByCategory(category, categorySettings);
export const getSettingsStats = () => settingsService.getSettingsStats();

// MSW Handlers for API compatibility
export const SettingsHandlers = [];
