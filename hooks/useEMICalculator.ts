// React hook for EMI calculations
import { useState, useCallback, useEffect } from 'react';
import { emiCalculatorAPI, type EMICalculationRequest, type EMICalculationResponse } from '@/lib/emi-calculator-api';

interface UseEMICalculatorResult {
  calculation: EMICalculationResponse | null;
  isCalculating: boolean;
  error: string | null;
  calculate: (data: EMICalculationRequest) => Promise<void>;
  reset: () => void;
}

export function useEMICalculator(): UseEMICalculatorResult {
  const [calculation, setCalculation] = useState<EMICalculationResponse | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const calculate = useCallback(async (data: EMICalculationRequest) => {
    setIsCalculating(true);
    setError(null);

    try {
      const result = await emiCalculatorAPI.calculateEMI(data);
      setCalculation(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Calculation failed';
      setError(errorMessage);
      console.error('EMI calculation error:', err);
    } finally {
      setIsCalculating(false);
    }
  }, []);

  const reset = useCallback(() => {
    setCalculation(null);
    setError(null);
    setIsCalculating(false);
  }, []);

  return {
    calculation,
    isCalculating,
    error,
    calculate,
    reset,
  };
}

interface UseAutoEMICalculatorOptions {
  loanAmount: number;
  interestRate: number;
  tenure: number;
  debounceMs?: number;
}

export function useAutoEMICalculator({
  loanAmount,
  interestRate,
  tenure,
  debounceMs = 500,
}: UseAutoEMICalculatorOptions): UseEMICalculatorResult {
  const {
    calculation,
    isCalculating,
    error,
    calculate,
    reset,
  } = useEMICalculator();

  // Debounced calculation effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (loanAmount > 0 && interestRate > 0 && tenure > 0) {
        calculate({
          loanAmount,
          interestRate,
          tenure,
        });
      }
    }, debounceMs);

    return () => clearTimeout(timeoutId);
  }, [loanAmount, interestRate, tenure, debounceMs, calculate]);

  return {
    calculation,
    isCalculating,
    error,
    calculate,
    reset,
  };
}

export default useEMICalculator;
