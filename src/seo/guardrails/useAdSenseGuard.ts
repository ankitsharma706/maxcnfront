import { useMemo, useEffect } from 'react';
import { isAdSenseEligibleRoute, loadAdSenseScriptForRoute } from '../../utils/adSenseManager';
import { ROUTE_REGISTRY } from '../config/seoDefaults';

export interface AdSenseGuardResult {
  isEligible: boolean;
  isEditorial: boolean;
  reason?: string;
}

/**
 * Custom hook to verify AdSense compliance and safely trigger script initialization.
 */
export function useAdSenseGuard(routePath: string, isEmpty = false): AdSenseGuardResult {
  const cleanPath = routePath.toLowerCase().replace(/\/$/, '') || '/';
  const routeConfig = ROUTE_REGISTRY[cleanPath];

  const result = useMemo<AdSenseGuardResult>(() => {
    if (isEmpty) {
      return {
        isEligible: false,
        isEditorial: false,
        reason: 'Empty view: 0 content rows detected'
      };
    }

    if (routeConfig?.requiresAuth || routeConfig?.robots?.index === 'noindex') {
      return {
        isEligible: false,
        isEditorial: false,
        reason: 'Restricted utility/auth route'
      };
    }

    const eligible = isAdSenseEligibleRoute(cleanPath);
    return {
      isEligible: eligible,
      isEditorial: Boolean(routeConfig?.isEditorial),
      reason: eligible ? 'Approved editorial content' : 'Interactive tool without editorial body'
    };
  }, [cleanPath, isEmpty, routeConfig]);

  useEffect(() => {
    if (result.isEligible) {
      loadAdSenseScriptForRoute(cleanPath);
    }
  }, [result.isEligible, cleanPath]);

  return result;
}
