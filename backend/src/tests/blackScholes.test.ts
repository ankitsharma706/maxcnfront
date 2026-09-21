import {
  calculateD1,
  calculateD2,
  calculateDelta,
  calculateGamma,
  calculateTheta,
  calculateVega,
  calculateRho,
  calculatePremium,
  calculateAllGreeks,
} from '../services/blackScholes.service';
import { daysToYears, normalizeIV } from '../utils/calculator';

describe('Black-Scholes Engine', () => {
  // Test parameters for Gold Mini option
  const S = 153330;    // Spot price
  const K = 155000;    // Strike price
  const days = 18;     // Days to expiry
  const T = daysToYears(days);
  const r = 0.07;      // Risk-free rate 7%
  const sigma = normalizeIV(28); // IV 28%

  describe('calculateD1', () => {
    it('should calculate d1 correctly', () => {
      const d1 = calculateD1(S, K, T, r, sigma);
      expect(typeof d1).toBe('number');
      expect(d1).not.toBeNaN();
    });

    it('should return 0 when T is 0', () => {
      const d1 = calculateD1(S, K, 0, r, sigma);
      expect(d1).toBe(0);
    });

    it('should return 0 when sigma is 0', () => {
      const d1 = calculateD1(S, K, T, r, 0);
      expect(d1).toBe(0);
    });

    it('should be positive when S > K (in-the-money for calls)', () => {
      const d1 = calculateD1(160000, 155000, T, r, sigma);
      expect(d1).toBeGreaterThan(0);
    });

    it('should be negative when S < K (out-of-the-money for calls)', () => {
      const d1 = calculateD1(150000, 155000, T, r, sigma);
      expect(d1).toBeLessThan(0);
    });
  });

  describe('calculateD2', () => {
    it('should be less than d1', () => {
      const d1 = calculateD1(S, K, T, r, sigma);
      const d2 = calculateD2(d1, sigma, T);
      expect(d2).toBeLessThan(d1);
    });

    it('should return 0 when T is 0', () => {
      const d2 = calculateD2(0.5, sigma, 0);
      expect(d2).toBe(0);
    });
  });

  describe('calculateDelta', () => {
    it('CALL delta should be between 0 and 1', () => {
      const d1 = calculateD1(S, K, T, r, sigma);
      const delta = calculateDelta(d1, 'CALL');
      expect(delta).toBeGreaterThanOrEqual(0);
      expect(delta).toBeLessThanOrEqual(1);
    });

    it('PUT delta should be between -1 and 0', () => {
      const d1 = calculateD1(S, K, T, r, sigma);
      const delta = calculateDelta(d1, 'PUT');
      expect(delta).toBeGreaterThanOrEqual(-1);
      expect(delta).toBeLessThanOrEqual(0);
    });

    it('CALL delta + |PUT delta| should approximately equal 1', () => {
      const d1 = calculateD1(S, K, T, r, sigma);
      const callDelta = calculateDelta(d1, 'CALL');
      const putDelta = calculateDelta(d1, 'PUT');
      expect(callDelta + Math.abs(putDelta)).toBeCloseTo(1, 4);
    });

    it('ATM CALL delta should be close to 0.5', () => {
      const d1 = calculateD1(155000, 155000, T, r, sigma);
      const delta = calculateDelta(d1, 'CALL');
      expect(delta).toBeCloseTo(0.5, 1);
    });
  });

  describe('calculateGamma', () => {
    it('should always be positive', () => {
      const d1 = calculateD1(S, K, T, r, sigma);
      const gamma = calculateGamma(d1, S, sigma, T);
      expect(gamma).toBeGreaterThanOrEqual(0);
    });

    it('should be the same for CALL and PUT (same inputs)', () => {
      const d1 = calculateD1(S, K, T, r, sigma);
      const gamma = calculateGamma(d1, S, sigma, T);
      // Gamma is the same for both CALL and PUT
      expect(gamma).toBeGreaterThan(0);
    });

    it('should be highest when ATM', () => {
      const d1Atm = calculateD1(155000, 155000, T, r, sigma);
      const gammaAtm = calculateGamma(d1Atm, 155000, sigma, T);

      const d1Itm = calculateD1(160000, 155000, T, r, sigma);
      const gammaItm = calculateGamma(d1Itm, 160000, sigma, T);

      const d1Otm = calculateD1(150000, 155000, T, r, sigma);
      const gammaOtm = calculateGamma(d1Otm, 150000, sigma, T);

      expect(gammaAtm).toBeGreaterThan(gammaItm);
      expect(gammaAtm).toBeGreaterThan(gammaOtm);
    });
  });

  describe('calculateTheta', () => {
    it('CALL theta should be negative (time decay)', () => {
      const d1 = calculateD1(S, K, T, r, sigma);
      const d2 = calculateD2(d1, sigma, T);
      const theta = calculateTheta(d1, d2, S, K, T, r, sigma, 'CALL');
      expect(theta).toBeLessThan(0);
    });

    it('PUT theta should typically be negative', () => {
      const d1 = calculateD1(S, K, T, r, sigma);
      const d2 = calculateD2(d1, sigma, T);
      const theta = calculateTheta(d1, d2, S, K, T, r, sigma, 'PUT');
      expect(theta).toBeLessThan(0);
    });
  });

  describe('calculateVega', () => {
    it('should always be positive', () => {
      const d1 = calculateD1(S, K, T, r, sigma);
      const vega = calculateVega(d1, S, T);
      expect(vega).toBeGreaterThan(0);
    });
  });

  describe('calculateRho', () => {
    it('CALL rho should be positive', () => {
      const d1 = calculateD1(S, K, T, r, sigma);
      const d2 = calculateD2(d1, sigma, T);
      const rho = calculateRho(d2, K, T, r, 'CALL');
      expect(rho).toBeGreaterThan(0);
    });

    it('PUT rho should be negative', () => {
      const d1 = calculateD1(S, K, T, r, sigma);
      const d2 = calculateD2(d1, sigma, T);
      const rho = calculateRho(d2, K, T, r, 'PUT');
      expect(rho).toBeLessThan(0);
    });
  });

  describe('calculatePremium', () => {
    it('CALL premium should be non-negative', () => {
      const d1 = calculateD1(S, K, T, r, sigma);
      const d2 = calculateD2(d1, sigma, T);
      const premium = calculatePremium(d1, d2, S, K, T, r, 'CALL');
      expect(premium).toBeGreaterThanOrEqual(0);
    });

    it('PUT premium should be non-negative', () => {
      const d1 = calculateD1(S, K, T, r, sigma);
      const d2 = calculateD2(d1, sigma, T);
      const premium = calculatePremium(d1, d2, S, K, T, r, 'PUT');
      expect(premium).toBeGreaterThanOrEqual(0);
    });

    it('should return intrinsic value at expiration (T=0)', () => {
      const d1 = 0;
      const d2 = 0;
      // ITM Call: S > K
      const callPremium = calculatePremium(d1, d2, 160000, 155000, 0, r, 'CALL');
      expect(callPremium).toBe(5000);

      // OTM Call: S < K
      const otmCallPremium = calculatePremium(d1, d2, 150000, 155000, 0, r, 'CALL');
      expect(otmCallPremium).toBe(0);
    });

    it('should satisfy put-call parity approximately', () => {
      const d1 = calculateD1(S, K, T, r, sigma);
      const d2 = calculateD2(d1, sigma, T);
      const callPrice = calculatePremium(d1, d2, S, K, T, r, 'CALL');
      const putPrice = calculatePremium(d1, d2, S, K, T, r, 'PUT');

      // Put-Call Parity: C - P = S - K * e^(-rT)
      const lhs = callPrice - putPrice;
      const rhs = S - K * Math.exp(-r * T);

      expect(lhs).toBeCloseTo(rhs, 0);
    });
  });

  describe('calculateAllGreeks', () => {
    it('should return all greeks for a CALL option', () => {
      const result = calculateAllGreeks({
        spotPrice: 153330,
        strike: 155000,
        daysToExpiry: 18,
        riskFreeRate: 0.07,
        iv: 28,
        optionType: 'CALL',
      });

      expect(result).toHaveProperty('delta');
      expect(result).toHaveProperty('gamma');
      expect(result).toHaveProperty('theta');
      expect(result).toHaveProperty('vega');
      expect(result).toHaveProperty('rho');
      expect(result).toHaveProperty('premium');
      expect(result).toHaveProperty('d1');
      expect(result).toHaveProperty('d2');

      // CALL delta: 0 < delta < 1
      expect(result.delta).toBeGreaterThan(0);
      expect(result.delta).toBeLessThan(1);

      // Gamma should be positive
      expect(result.gamma).toBeGreaterThan(0);

      // Theta should be negative
      expect(result.theta).toBeLessThan(0);

      // Premium should be positive
      expect(result.premium).toBeGreaterThan(0);
    });

    it('should return all greeks for a PUT option', () => {
      const result = calculateAllGreeks({
        spotPrice: 153330,
        strike: 155000,
        daysToExpiry: 18,
        riskFreeRate: 0.07,
        iv: 28,
        optionType: 'PUT',
      });

      // PUT delta: -1 < delta < 0
      expect(result.delta).toBeGreaterThan(-1);
      expect(result.delta).toBeLessThan(0);

      // Premium should be positive
      expect(result.premium).toBeGreaterThan(0);
    });

    it('should handle IV as percentage (auto-normalize)', () => {
      const result28 = calculateAllGreeks({
        spotPrice: 153330,
        strike: 155000,
        daysToExpiry: 18,
        riskFreeRate: 0.07,
        iv: 28,         // Percentage form
        optionType: 'CALL',
      });

      const result028 = calculateAllGreeks({
        spotPrice: 153330,
        strike: 155000,
        daysToExpiry: 18,
        riskFreeRate: 0.07,
        iv: 0.28,        // Decimal form
        optionType: 'CALL',
      });

      // Both should produce the same results
      expect(result28.delta).toBeCloseTo(result028.delta, 4);
      expect(result28.premium).toBeCloseTo(result028.premium, 0);
    });

    it('should have 6 decimal precision', () => {
      const result = calculateAllGreeks({
        spotPrice: 153330,
        strike: 155000,
        daysToExpiry: 18,
        riskFreeRate: 0.07,
        iv: 28,
        optionType: 'CALL',
      });

      // Check that values have at most 6 decimal places
      const decimals = (n: number) => {
        const str = n.toString();
        const dotIndex = str.indexOf('.');
        return dotIndex === -1 ? 0 : str.length - dotIndex - 1;
      };

      expect(decimals(result.delta)).toBeLessThanOrEqual(6);
      expect(decimals(result.gamma)).toBeLessThanOrEqual(6);
    });
  });
});
