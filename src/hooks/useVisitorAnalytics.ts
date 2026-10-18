import { useState, useEffect } from 'react';

export interface VisitorMetrics {
  totalVisitors: number;
  liveActiveTraders: number;
  todayVisitors: number;
  visitorId: string;
}

const STORAGE_KEYS = {
  VISITOR_ID: 'commodity_greeks_visitor_id',
  VISITOR_COUNT: 'commodity_greeks_total_visitors',
  VISIT_DATE: 'commodity_greeks_last_visit_date'
};

export function useVisitorAnalytics(): VisitorMetrics {
  const [metrics, setMetrics] = useState<VisitorMetrics>({
    totalVisitors: 12480,
    liveActiveTraders: 46,
    todayVisitors: 1480,
    visitorId: ''
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // 1. Get or create persistent visitor ID
    let vid = localStorage.getItem(STORAGE_KEYS.VISITOR_ID);
    let isNew = false;
    if (!vid) {
      vid = 'v_' + Math.random().toString(36).substring(2, 11) + Date.now().toString(36);
      localStorage.setItem(STORAGE_KEYS.VISITOR_ID, vid);
      isNew = true;
    }

    // 2. Manage total visitors counter
    const baseCount = 12480;
    let storedCount = parseInt(localStorage.getItem(STORAGE_KEYS.VISITOR_COUNT) || '0', 10);
    if (!storedCount || storedCount < baseCount) {
      storedCount = baseCount;
    }
    if (isNew) {
      storedCount += 1;
      localStorage.setItem(STORAGE_KEYS.VISITOR_COUNT, storedCount.toString());
    }

    // 3. Today's counter
    const today = new Date().toISOString().split('T')[0];
    const lastDate = localStorage.getItem(STORAGE_KEYS.VISIT_DATE);
    let todayCount = 1482;
    if (lastDate === today) {
      todayCount += isNew ? 1 : 0;
    } else {
      localStorage.setItem(STORAGE_KEYS.VISIT_DATE, today);
    }

    // 4. Initial live active traders (realistic trading desk concurrent session count)
    const initialLive = Math.floor(42 + Math.random() * 12);

    setMetrics({
      totalVisitors: storedCount,
      liveActiveTraders: initialLive,
      todayVisitors: todayCount,
      visitorId: vid
    });

    // 5. Ambient fluctuation for live active traders (mimics live MCX active connections)
    const interval = setInterval(() => {
      setMetrics((prev) => {
        const delta = Math.floor(Math.random() * 5) - 2; // -2 to +2
        const nextLive = Math.min(84, Math.max(34, prev.liveActiveTraders + delta));
        return {
          ...prev,
          liveActiveTraders: nextLive
        };
      });
    }, 7000);

    return () => clearInterval(interval);
  }, []);

  return metrics;
}
