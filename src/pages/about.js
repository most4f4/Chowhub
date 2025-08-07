import React from 'react';
import Top from '../components/Top';
import AboutMissionSection from '@/components/About-Mission';
import AboutValuesSection from '@/components/AboutValues';
import TeamSection from '@/components/TeamSection';
import CTABanner from '@/components/CTABanner';

export default function AboutUsPage() {
  return (
    <div>
      <Top />
      <AboutMissionSection />
      <AboutValuesSection/>
      <TeamSection/>
      <CTABanner/>
    </div>
  );
}