import React from 'react';
import { HeroSection } from '../../components/dashboard/HeroSection';
import { LiveGoldPriceCard } from '../../components/dashboard/LiveGoldPriceCard';
import { StatsCards } from '../../components/dashboard/StatsCards';
import { ExposureCards } from '../../components/dashboard/ExposureCards';
import { MarketOverview } from '../../components/dashboard/MarketOverview';

export const DashboardView: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Live Gold Price Hero Metric Card */}
      <LiveGoldPriceCard />

      {/* Hero Section */}
      <HeroSection />

      {/* Google AdSense Space */}
      <div className="w-full min-h-[120px] bg-white/40 dark:bg-[#15232d]/40 backdrop-blur-sm border border-dashed border-[#00778A]/30 rounded-xl flex flex-col items-center justify-center p-4 shadow-sm transition-colors">
        <span className="text-xs font-semibold tracking-wider text-gray-400 dark:text-gray-500 uppercase mb-2">Advertisement</span>
        {/* Replace the div below with your actual Google AdSense <ins> tag and script block */}
        <div className="text-sm text-gray-500 dark:text-gray-400 text-center">
          Place your Google AdSense ad unit code here.
        </div>
      </div>

      {/* Statistics Cards */}
      <StatsCards />

      {/* Exposure Cards */}
      <ExposureCards />

      {/* Market Overview & Option Chain Matrix */}
      <MarketOverview />
    </div>
  );
};
