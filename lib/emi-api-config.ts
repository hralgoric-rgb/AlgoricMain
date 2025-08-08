// Configuration for EMI Calculator API
export const EMI_API_CONFIG = {
  // Default API URL - can be overridden via environment variable
  baseURL: process.env.NEXT_PUBLIC_EMI_API_URL || 'http://localhost:5000',
  
  // API endpoints
  endpoints: {
    predict: '/api/predict',
    train: '/train',
    checkModels: '/check_models',
    modelInfo: '/model_info',
    saveCalculation: '/save_calculation',
  },
  
  // Request timeout in milliseconds
  timeout: 10000,
  
  // Whether to enable fallback calculation if API fails
  enableFallback: true,
  
  // Whether to save calculations automatically
  autoSave: true,
};

export default EMI_API_CONFIG;
