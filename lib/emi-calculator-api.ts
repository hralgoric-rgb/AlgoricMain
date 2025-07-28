// Service for EMI Calculator API
import EMI_API_CONFIG from './emi-api-config';

interface EMICalculationRequest {
  loanAmount: number;
  interestRate: number;
  tenure: number;
}

interface EMICalculationResponse {
  monthlyEMI: number;
  totalInterest: number;
  totalAmount: number;
  principalPercentage: number;
  interestPercentage: number;
}

class EMICalculatorAPI {
  private baseURL: string;
  private timeout: number;

  constructor(baseURL?: string) {
    this.baseURL = baseURL || EMI_API_CONFIG.baseURL;
    this.timeout = EMI_API_CONFIG.timeout;
  }

  /**
   * Calculate EMI using the Flask API
   */
  async calculateEMI(data: EMICalculationRequest): Promise<EMICalculationResponse> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const response = await fetch(`${this.baseURL}${EMI_API_CONFIG.endpoints.predict}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          principal: data.loanAmount,
          rate: data.interestRate,
          tenure: data.tenure,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const result = await response.json();

      // Calculate derived values if not provided by API
      const totalAmount = result.total_amount || result.monthlyEMI * data.tenure * 12;
      const totalInterest = result.total_interest || totalAmount - data.loanAmount;

      const calculationResult: EMICalculationResponse = {
        monthlyEMI: result.monthly_emi || result.emi || result.monthlyEMI,
        totalInterest: totalInterest,
        totalAmount: totalAmount,
        principalPercentage: result.principal_percentage || (data.loanAmount / totalAmount) * 100,
        interestPercentage: result.interest_percentage || (totalInterest / totalAmount) * 100,
      };

      // Auto-save calculation if enabled
      if (EMI_API_CONFIG.autoSave) {
        this.saveCalculation(calculationResult).catch(error => 
          console.warn('Failed to auto-save calculation:', error)
        );
      }

      return calculationResult;
    } catch (error) {
      console.error('EMI Calculation API Error:', error);
      
      // Use fallback calculation if enabled
      if (EMI_API_CONFIG.enableFallback) {
        return this.fallbackCalculation(data);
      } else {
        throw error;
      }
    }
  }

  /**
   * Fallback calculation method if API is unavailable
   */
  private fallbackCalculation(data: EMICalculationRequest): EMICalculationResponse {
    const { loanAmount, interestRate, tenure } = data;
    const monthlyRate = interestRate / 12 / 100;
    const months = tenure * 12;
    
    const emi = loanAmount * monthlyRate * Math.pow(1 + monthlyRate, months) / (Math.pow(1 + monthlyRate, months) - 1);
    const totalAmount = emi * months;
    const totalInterest = totalAmount - loanAmount;
    
    return {
      monthlyEMI: Math.round(emi),
      totalInterest: Math.round(totalInterest),
      totalAmount: Math.round(totalAmount),
      principalPercentage: (loanAmount / totalAmount) * 100,
      interestPercentage: (totalInterest / totalAmount) * 100,
    };
  }

  /**
   * Save calculation result using the Flask API
   */
  async saveCalculation(calculation: EMICalculationResponse): Promise<boolean> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const response = await fetch(`${this.baseURL}${EMI_API_CONFIG.endpoints.saveCalculation}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(calculation),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      return response.ok;
    } catch (error) {
      console.error('Save Calculation API Error:', error);
      return false;
    }
  }

  /**
   * Check if models are available
   */
  async checkModels(): Promise<boolean> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const response = await fetch(`${this.baseURL}${EMI_API_CONFIG.endpoints.checkModels}`, {
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      const result = await response.json();
      return result.models_exist || false;
    } catch (error) {
      console.error('Check Models API Error:', error);
      return false;
    }
  }

  /**
   * Get model information
   */
  async getModelInfo(): Promise<any> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const response = await fetch(`${this.baseURL}${EMI_API_CONFIG.endpoints.modelInfo}`, {
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      return await response.json();
    } catch (error) {
      console.error('Model Info API Error:', error);
      return null;
    }
  }

  /**
   * Train models (if needed)
   */
  async trainModels(): Promise<boolean> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // Longer timeout for training

      const response = await fetch(`${this.baseURL}${EMI_API_CONFIG.endpoints.train}`, {
        method: 'GET',
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      return response.ok;
    } catch (error) {
      console.error('Train Models API Error:', error);
      return false;
    }
  }
}

// Export singleton instance
export const emiCalculatorAPI = new EMICalculatorAPI();
export type { EMICalculationRequest, EMICalculationResponse };
