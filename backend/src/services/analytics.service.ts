import { Greek } from '../models/Greek';
import { Analytics, IAnalytics } from '../models/Analytics';
import { logger } from '../utils/logger';

/**
 * Calculate Delta Exposure across all positions for a commodity.
 */
export const getDeltaExposure = async (commodity?: string) => {
  const matchStage = commodity ? { $match: { commodity } } : { $match: {} };

  const result = await Greek.aggregate([
    matchStage,
    {
      $group: {
        _id: '$optionType',
        totalDelta: { $sum: { $multiply: ['$delta', { $ifNull: ['$lots', 1] }] } },
        count: { $sum: 1 },
        avgDelta: { $avg: '$delta' },
        positions: {
          $push: {
            strike: '$strike',
            delta: '$delta',
            lots: { $ifNull: ['$lots', 1] },
            premium: '$premium',
          },
        },
      },
    },
  ]);

  const callData = result.find((r: any) => r._id === 'CALL') || { totalDelta: 0, count: 0, avgDelta: 0, positions: [] };
  const putData = result.find((r: any) => r._id === 'PUT') || { totalDelta: 0, count: 0, avgDelta: 0, positions: [] };

  return {
    totalCallDelta: callData.totalDelta,
    totalPutDelta: putData.totalDelta,
    netDelta: callData.totalDelta + putData.totalDelta,
    callPositions: callData.count,
    putPositions: putData.count,
    avgCallDelta: callData.avgDelta,
    avgPutDelta: putData.avgDelta,
    callDetails: callData.positions,
    putDetails: putData.positions,
  };
};

/**
 * Calculate Gamma Exposure (GEX) across all positions.
 */
export const getGammaExposure = async (commodity?: string) => {
  const matchStage = commodity ? { $match: { commodity } } : { $match: {} };

  const result = await Greek.aggregate([
    matchStage,
    {
      $group: {
        _id: '$optionType',
        totalGamma: { $sum: { $multiply: ['$gamma', { $ifNull: ['$lots', 1] }] } },
        count: { $sum: 1 },
        avgGamma: { $avg: '$gamma' },
      },
    },
  ]);

  const callData = result.find((r: any) => r._id === 'CALL') || { totalGamma: 0, count: 0, avgGamma: 0 };
  const putData = result.find((r: any) => r._id === 'PUT') || { totalGamma: 0, count: 0, avgGamma: 0 };

  return {
    totalCallGamma: callData.totalGamma,
    totalPutGamma: putData.totalGamma,
    netGamma: callData.totalGamma - putData.totalGamma,
    gex: (callData.totalGamma - putData.totalGamma),
  };
};

/**
 * Calculate Theta Decay across all positions.
 */
export const getThetaDecay = async (commodity?: string) => {
  const matchStage = commodity ? { $match: { commodity } } : { $match: {} };

  const result = await Greek.aggregate([
    matchStage,
    {
      $group: {
        _id: '$optionType',
        totalTheta: { $sum: { $multiply: ['$theta', { $ifNull: ['$lots', 1] }] } },
        count: { $sum: 1 },
        avgTheta: { $avg: '$theta' },
      },
    },
  ]);

  const callData = result.find((r: any) => r._id === 'CALL') || { totalTheta: 0, count: 0, avgTheta: 0 };
  const putData = result.find((r: any) => r._id === 'PUT') || { totalTheta: 0, count: 0, avgTheta: 0 };

  return {
    totalCallTheta: callData.totalTheta,
    totalPutTheta: putData.totalTheta,
    netTheta: callData.totalTheta + putData.totalTheta,
    dailyDecay: callData.totalTheta + putData.totalTheta,
  };
};

/**
 * Calculate Vega Exposure across all positions.
 */
export const getVegaExposure = async (commodity?: string) => {
  const matchStage = commodity ? { $match: { commodity } } : { $match: {} };

  const result = await Greek.aggregate([
    matchStage,
    {
      $group: {
        _id: '$optionType',
        totalVega: { $sum: { $multiply: ['$vega', { $ifNull: ['$lots', 1] }] } },
        count: { $sum: 1 },
        avgVega: { $avg: '$vega' },
      },
    },
  ]);

  const callData = result.find((r: any) => r._id === 'CALL') || { totalVega: 0, count: 0, avgVega: 0 };
  const putData = result.find((r: any) => r._id === 'PUT') || { totalVega: 0, count: 0, avgVega: 0 };

  return {
    totalCallVega: callData.totalVega,
    totalPutVega: putData.totalVega,
    netVega: callData.totalVega + putData.totalVega,
  };
};

/**
 * Calculate IV Analysis across all positions.
 */
export const getIVAnalysis = async (commodity?: string) => {
  const matchStage = commodity ? { $match: { commodity } } : { $match: {} };

  const result = await Greek.aggregate([
    matchStage,
    {
      $group: {
        _id: { optionType: '$optionType', strike: '$strike' },
        avgIV: { $avg: '$iv' },
        minIV: { $min: '$iv' },
        maxIV: { $max: '$iv' },
        latestIV: { $last: '$iv' },
      },
    },
    { $sort: { '_id.strike': 1 } },
  ]);

  const callIV = result
    .filter((r: any) => r._id.optionType === 'CALL')
    .map((r: any) => ({ strike: r._id.strike, iv: r.avgIV, min: r.minIV, max: r.maxIV }));

  const putIV = result
    .filter((r: any) => r._id.optionType === 'PUT')
    .map((r: any) => ({ strike: r._id.strike, iv: r.avgIV, min: r.minIV, max: r.maxIV }));

  return {
    callIV,
    putIV,
    ivSkew: {
      strikes: callIV.map((c: any) => c.strike),
      callIVs: callIV.map((c: any) => c.iv),
      putIVs: putIV.map((p: any) => p.iv),
    },
  };
};

/**
 * Calculate Put-Call Ratio (PCR).
 */
export const getPCR = async (commodity?: string) => {
  const matchStage = commodity ? { $match: { commodity } } : { $match: {} };

  const result = await Greek.aggregate([
    matchStage,
    {
      $group: {
        _id: '$optionType',
        count: { $sum: 1 },
        totalPremium: { $sum: '$premium' },
        totalOI: { $sum: { $ifNull: ['$lots', 1] } },
      },
    },
  ]);

  const callData = result.find((r: any) => r._id === 'CALL') || { count: 0, totalPremium: 0, totalOI: 0 };
  const putData = result.find((r: any) => r._id === 'PUT') || { count: 0, totalPremium: 0, totalOI: 0 };

  const pcrByCount = callData.count > 0 ? putData.count / callData.count : 0;
  const pcrByPremium = callData.totalPremium > 0 ? putData.totalPremium / callData.totalPremium : 0;
  const pcrByOI = callData.totalOI > 0 ? putData.totalOI / callData.totalOI : 0;

  return {
    pcrByCount: Math.round(pcrByCount * 1000) / 1000,
    pcrByPremium: Math.round(pcrByPremium * 1000) / 1000,
    pcrByOI: Math.round(pcrByOI * 1000) / 1000,
    callCount: callData.count,
    putCount: putData.count,
    callPremium: Math.round(callData.totalPremium * 100) / 100,
    putPremium: Math.round(putData.totalPremium * 100) / 100,
    sentiment: pcrByCount > 1 ? 'Bearish' : pcrByCount < 0.7 ? 'Bullish' : 'Neutral',
  };
};

/**
 * Calculate Max Pain.
 * Max Pain is the strike price where option writers (sellers) would have minimum losses.
 */
export const getMaxPain = async (commodity?: string) => {
  const matchStage = commodity ? { $match: { commodity } } : { $match: {} };

  // Get all positions grouped by strike
  const positions = await Greek.aggregate([
    matchStage,
    {
      $group: {
        _id: { strike: '$strike', optionType: '$optionType' },
        totalPremium: { $sum: { $multiply: ['$premium', { $ifNull: ['$lots', 1] }] } },
        spotPrice: { $last: '$spotPrice' },
      },
    },
  ]);

  // Get unique strikes
  const strikes = [...new Set(positions.map((p: any) => p._id.strike))].sort((a, b) => a - b);

  if (strikes.length === 0) {
    return { maxPain: 0, strikes: [], painValues: [] };
  }

  // Calculate total pain at each strike
  const painValues: { strike: number; totalPain: number }[] = [];

  for (const testStrike of strikes) {
    let totalPain = 0;

    for (const pos of positions) {
      const strike = pos._id.strike;
      const optionType = pos._id.optionType;

      if (optionType === 'CALL') {
        // Call option: pain = max(testStrike - strike, 0) * premium_weight
        const intrinsic = Math.max(testStrike - strike, 0);
        totalPain += intrinsic * pos.totalPremium;
      } else {
        // Put option: pain = max(strike - testStrike, 0) * premium_weight
        const intrinsic = Math.max(strike - testStrike, 0);
        totalPain += intrinsic * pos.totalPremium;
      }
    }

    painValues.push({ strike: testStrike, totalPain });
  }

  // Max pain is at the strike with minimum total pain
  const minPain = painValues.reduce((min, curr) =>
    curr.totalPain < min.totalPain ? curr : min
  );

  return {
    maxPain: minPain.strike,
    minPainValue: minPain.totalPain,
    strikes: painValues.map((p) => p.strike),
    painValues: painValues.map((p) => p.totalPain),
  };
};
