import React from 'react';
import { HeroSection } from '../../components/dashboard/HeroSection';
import { LiveGoldPriceCard } from '../../components/dashboard/LiveGoldPriceCard';
import { StatsCards } from '../../components/dashboard/StatsCards';
import { ExposureCards } from '../../components/dashboard/ExposureCards';
import { MarketOverview } from '../../components/dashboard/MarketOverview';
import { AdSenseBanner } from '../../components/common/AdSenseBanner';
import { QuantitativeKnowledgeGuide } from '../../components/dashboard/QuantitativeKnowledgeGuide';
import { ContextualLinkRouter } from '../../seo';
import { useGreeksStore } from '../../store/useGreeksStore';
import { getTabFromPath } from '../../App';

export const DashboardView: React.FC = () => {
  const { setActiveTab } = useGreeksStore();

  return (
    <div className="space-y-6">
      {/* Live Gold Price Hero Metric Card */}
      <LiveGoldPriceCard />

      {/* Hero Section */}
      <HeroSection />

      {/* AdSense Compliant Banner Space (Only renders if eligible & surrounded by text) */}
      <AdSenseBanner className="my-2" />

      {/* Statistics Cards */}
      <StatsCards />

      {/* Exposure Cards */}
      <ExposureCards />

      {/* Market Overview & Option Chain Matrix */}
      <MarketOverview />

      {/* Substantial Publisher Content: Quantitative Knowledge & Option Greeks Guide */}
      <QuantitativeKnowledgeGuide />

      {/* Contextual Internal Link Hub for PageRank Equity Distribution */}
      <ContextualLinkRouter
        currentPath="/"
        onNavigate={(target) => setActiveTab(getTabFromPath(target))}
      />
    </div>
  );
};
