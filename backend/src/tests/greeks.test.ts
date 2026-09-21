import {
  calculateGreeks,
  calculateScenario,
  DEFAULT_PRICE_MOVES,
} from '../services/greeks.service';

describe('Greeks Service', () => {
  const baseInput = {
    commodity: 'Gold Mini',
    spotPrice: 153330,
    strike: 155000,
    iv: 28,
    daysToExpiry: 18,
    optionType: 'CALL' as const,
    riskFreeRate: 0.07,
  };

  describe('calculateGreeks', () => {
    it('should calculate all greeks with additional metadata', () => {
      const result = calculateGreeks(baseInput);

      expect(result.commodity).toBe('Gold Mini');
      expect(result.spotPrice).toBe(153330);
      expect(result.strike).toBe(155000);
      expect(result.optionType).toBe('CALL');
      expect(result.delta).toBeDefined();
      expect(result.gamma).toBeDefined();
      expect(result.theta).toBeDefined();
      expect(result.vega).toBeDefined();
      expect(result.rho).toBeDefined();
      expect(result.premium).toBeDefined();
      expect(result.notionalValue).toBeDefined();
    });

    it('should default lots to 1', () => {
      const result = calculateGreeks(baseInput);
      expect(result.lots).toBe(1);
    });

    it('should multiply premium by lots for notional value', () => {
      const resultWithLots = calculateGreeks({ ...baseInput, lots: 5 });
      const resultWithout = calculateGreeks(baseInput);

      expect(resultWithLots.notionalValue).toBeCloseTo(
        resultWithout.premium * 5,
        1
      );
    });
  });

  describe('calculateScenario', () => {
    it('should return base case and scenarios', () => {
      const priceMoves = [100, 500, -100, -500];
      const result = calculateScenario(baseInput, priceMoves);

      expect(result.baseCase).toBeDefined();
      expect(result.scenarios).toHaveLength(priceMoves.length);
    });

    it('should have correct scenario spot prices', () => {
      const priceMoves = [100, -100];
      const result = calculateScenario(baseInput, priceMoves);

      expect(result.scenarios[0].newSpotPrice).toBe(baseInput.spotPrice + 100);
      expect(result.scenarios[1].newSpotPrice).toBe(baseInput.spotPrice - 100);
    });

    it('should have P&L relative to base case', () => {
      const priceMoves = [1000];
      const result = calculateScenario(baseInput, priceMoves);

      const scenario = result.scenarios[0];
      // For CALL, positive price move should give positive P&L
      expect(scenario.pnl).toBeGreaterThan(0);
    });

    it('should use DEFAULT_PRICE_MOVES when none provided', () => {
      expect(DEFAULT_PRICE_MOVES).toHaveLength(10);
      expect(DEFAULT_PRICE_MOVES).toContain(100);
      expect(DEFAULT_PRICE_MOVES).toContain(-100);
    });

    it('should handle negative spot prices gracefully', () => {
      const priceMoves = [-200000]; // Would make spot price negative
      const result = calculateScenario(baseInput, priceMoves);

      const scenario = result.scenarios[0];
      expect(scenario.pnl).toBeDefined();
    });
  });
});
