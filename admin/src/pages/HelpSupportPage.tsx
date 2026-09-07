import React from 'react';
import { HelpSupportPageHeader } from '../components/help/HelpSupportPageHeader';
import { HelpQuickActions } from '../components/help/HelpQuickActions';
import { HelpFaqSection } from '../components/help/HelpFaqSection';
import { StaffGuidesSection } from '../components/help/StaffGuidesSection';
import { HelpContactCard } from '../components/help/HelpContactCard';

export const HelpSupportPage: React.FC = () => {
  return (
    <div className="space-y-6 pb-10">
      <HelpSupportPageHeader />
      <HelpQuickActions />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        <HelpFaqSection />
        <div className="space-y-6">
          <StaffGuidesSection />
          <HelpContactCard />
        </div>
      </div>
    </div>
  );
};