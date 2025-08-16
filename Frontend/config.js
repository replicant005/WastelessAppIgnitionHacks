// Configuration file for API endpoints
// Automatically detects environment and sets correct URLs

const config = {
  // Detect if we're running locally or on a deployed site
  isLocal: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1',
  
  // API base URLs
  get apiBase() {
    return this.isLocal 
      ? 'http://localhost:5000' 
      : 'https://wastelessappignitionhacks-1.onrender.com';
  },
  
  // Specific API endpoints
  get endpoints() {
    const base = this.apiBase;
    return {
      users: `${base}/api/users`,
      food: `${base}/api/food`,
      chat: `${base}/api/chat`,
      health: `${base}/api/health`
    };
  },
  
  // Log current configuration (for debugging)
  logConfig() {
    console.log('🌐 API Configuration:', {
      environment: this.isLocal ? 'Local Development' : 'Production',
      apiBase: this.apiBase,
      endpoints: this.endpoints
    });
  }
};

// Log configuration when loaded
config.logConfig();

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = config;
} 