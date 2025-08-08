// Health check utility for EMI Calculator API
import { emiCalculatorAPI } from './emi-calculator-api';

export interface APIHealthStatus {
  isHealthy: boolean;
  responseTime: number;
  error?: string;
  modelsAvailable?: boolean;
}

export class EMIAPIHealthCheck {
  /**
   * Perform a complete health check of the EMI API
   */
  static async checkHealth(): Promise<APIHealthStatus> {
    const startTime = Date.now();
    
    try {
      // Test basic connectivity with home endpoint
      const response = await fetch(`${emiCalculatorAPI['baseURL']}/`, {
        method: 'GET',
        signal: AbortSignal.timeout(5000), // 5 second timeout
      });
      
      const responseTime = Date.now() - startTime;
      
      if (!response.ok) {
        return {
          isHealthy: false,
          responseTime,
          error: `API returned status ${response.status}`,
        };
      }
      
      const data = await response.json();
      
      // Check if models are available
      const modelsAvailable = await emiCalculatorAPI.checkModels();
      
      return {
        isHealthy: data.status === 'success',
        responseTime,
        modelsAvailable,
      };
    } catch (error) {
      const responseTime = Date.now() - startTime;
      
      return {
        isHealthy: false,
        responseTime,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
  
  /**
   * Test the EMI calculation endpoint with sample data
   */
  static async testCalculation(): Promise<boolean> {
    try {
      const testData = {
        loanAmount: 1000000,
        interestRate: 8.5,
        tenure: 15,
      };
      
      const result = await emiCalculatorAPI.calculateEMI(testData);
      
      // Basic validation of the result
      return (
        result.monthlyEMI > 0 &&
        result.totalAmount > testData.loanAmount &&
        result.totalInterest > 0
      );
    } catch (error) {
      console.error('Test calculation failed:', error);
      return false;
    }
  }
  
  /**
   * Get a comprehensive status report
   */
  static async getStatusReport(): Promise<{
    health: APIHealthStatus;
    calculationTest: boolean;
    modelInfo?: any;
  }> {
    const health = await this.checkHealth();
    const calculationTest = health.isHealthy ? await this.testCalculation() : false;
    
    let modelInfo;
    if (health.isHealthy) {
      try {
        modelInfo = await emiCalculatorAPI.getModelInfo();
      } catch (error) {
        console.warn('Could not fetch model info:', error);
      }
    }
    
    return {
      health,
      calculationTest,
      modelInfo,
    };
  }
}

export default EMIAPIHealthCheck;
