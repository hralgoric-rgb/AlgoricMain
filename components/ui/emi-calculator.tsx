"use client";

import React, { useState } from 'react';
import { useAutoEMICalculator } from '@/hooks/useEMICalculator';

export const EMICalculator = () => {
  const [loanAmount, setLoanAmount] = useState(3000000);
  const [interestRate, setInterestRate] = useState(8.5);
  const [loanTenure, setLoanTenure] = useState(20);

  // Use the auto-calculating hook
  const { calculation, isCalculating, error } = useAutoEMICalculator({
    loanAmount,
    interestRate,
    tenure: loanTenure,
    debounceMs: 300, // Reduced debounce for better UX
  });

  // Fallback values when calculation is not available
  const monthlyEMI = calculation?.monthlyEMI || 0;
  const totalInterest = calculation?.totalInterest || 0;
  const totalAmount = calculation?.totalAmount || 0;
  const principalPercentage = calculation?.principalPercentage || 0;
  const interestPercentage = calculation?.interestPercentage || 0;
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="bg-gradient-to-br from-orange-500 to-black rounded-xl shadow-xl overflow-hidden shadow-sm shadow-orange-600">
      <div className="p-6 md:p-8">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">Loan EMI Calculator</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            {/* Error Display */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-red-300 text-sm">
                <strong>Calculation Error:</strong> {error}
                <br />
                <span className="text-xs opacity-80">Using fallback calculation method.</span>
              </div>
            )}

            {/* Loan Amount Slider */}
            <div>
              <div className="flex justify-between mb-2">
                <label className="block text-sm font-medium text-white">Loan Amount</label>
                <span className="text-sm font-semibold text-white">{formatCurrency(loanAmount)}</span>
              </div>
              <input
                type="range"
                min="100000"
                max="10000000"
                step="100000"
                value={loanAmount}
                onChange={(_e) => setLoanAmount(Number(_e.target.value))}
                className="w-full h-2 bg-white rounded-lg appearance-none cursor-pointer accent-orange-400"
              />
              <div className="flex justify-between mt-1">
                <span className="text-xs text-white">₹1L</span>
                <span className="text-xs text-white">₹1Cr</span>
              </div>
            </div>

            {/* Interest Rate Slider */}
            <div>
              <div className="flex justify-between mb-2">
                <label className="block text-sm font-medium text-white">Interest Rate</label>
                <span className="text-sm font-semibold text-white">{interestRate}%</span>
              </div>
              <input
                type="range"
                min="5"
                max="20"
                step="0.1"
                value={interestRate}
                onChange={(_e) => setInterestRate(Number(_e.target.value))}
                className="w-full h-2 bg-white rounded-lg appearance-none cursor-pointer accent-orange-400"
              />
              <div className="flex justify-between mt-1">
                <span className="text-xs text-white">5%</span>
                <span className="text-xs text-white">20%</span>
              </div>
            </div>

            {/* Loan Tenure Slider */}
            <div>
              <div className="flex justify-between mb-2">
                <label className="block text-sm font-medium text-white">Loan Tenure (Years)</label>
                <span className="text-sm font-semibold text-white">{loanTenure} years</span>
              </div>
              <input
                type="range"
                min="1"
                max="30"
                step="1"
                value={loanTenure}
                onChange={(_e) => setLoanTenure(Number(_e.target.value))}
                className="w-full h-2 bg-white rounded-lg appearance-none cursor-pointer accent-orange-400"
              />
              <div className="flex justify-between mt-1">
                <span className="text-xs text-white">1 yr</span>
                <span className="text-xs text-white">30 yrs</span>
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="bg-white/10 rounded-xl p-6 border border-orange-500/10">
            <h3 className="text-xl font-semibold text-white mb-4">Your Loan Summary</h3>

            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-orange-500/10">
                <span className="text-white">Monthly EMI</span>
                <span className="text-xl font-bold text-orange-500">
                  {isCalculating ? (
                    <div className="animate-pulse">Calculating...</div>
                  ) : (
                    formatCurrency(monthlyEMI)
                  )}
                </span>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-orange-500/10">
                <span className="text-white">Principal Amount</span>
                <span className="font-semibold text-orange-500">{formatCurrency(loanAmount)}</span>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-orange-500/10">
                <span className="text-white">Total Interest</span>
                <span className="font-semibold text-orange-500">
                  {isCalculating ? (
                    <div className="animate-pulse">Calculating...</div>
                  ) : (
                    formatCurrency(totalInterest)
                  )}
                </span>
              </div>

              <div className="flex justify-between items-center py-2">
                <span className="text-white font-medium">Total Amount</span>
                <span className="font-semibold text-orange-500">
                  {isCalculating ? (
                    <div className="animate-pulse">Calculating...</div>
                  ) : (
                    formatCurrency(totalAmount)
                  )}
                </span>
              </div>
            </div>

            {/* Pie Chart Visualization */}
            <div className="mt-6">
              <div className="h-4 w-full rounded-full overflow-hidden bg-orange-500/10">
                <div
                  className="h-full bg-gradient-to-r from-orange-400 to-orange-500"
                  style={{ width: `${principalPercentage}%` }}
                />
              </div>
              <div className="flex justify-between mt-2 text-sm">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-gradient-to-r from-orange-400 to-orange-500 mr-2"></div>
                  <span className="text-white">Principal ({principalPercentage.toFixed(1)}%)</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-orange-500/10 mr-2"></div>
                  <span className="text-white">Interest ({interestPercentage.toFixed(1)}%)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 text-sm text-white/70">
          <p className="font-medium mb-2">Disclaimer:</p>
          <p>This calculator provides estimates only and should not be considered financial advice. The actual EMI amount may vary based on factors like processing fees, prepayment charges, and other terms set by the lender.</p>
        </div>
      </div>
    </div>
  );
};

export default EMICalculator;
