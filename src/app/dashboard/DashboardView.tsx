import React from 'react';
import { HeroSection } from '../../components/dashboard/HeroSection';
import { LiveGoldPriceCard } from '../../components/dashboard/LiveGoldPriceCard';
import { StatsCards } from '../../components/dashboard/StatsCards';
import { ExposureCards } from '../../components/dashboard/ExposureCards';
import { MarketOverview } from '../../components/dashboard/MarketOverview';
import { AdSenseBanner } from '../../components/common/AdSenseBanner';

export const DashboardView: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Live Gold Price Hero Metric Card */}
      <LiveGoldPriceCard />

      {/* Hero Section */}
      <HeroSection />

      {/* AdSense Compliant Banner Space */}
      <AdSenseBanner className="my-2" />

      {/* Statistics Cards */}
      <StatsCards />

      {/* Exposure Cards */}
      <ExposureCards />

      {/* Market Overview & Option Chain Matrix */}
      <MarketOverview />
    </div>
  );
};
