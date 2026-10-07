import React from 'react';
import { Hero } from '../components/hero/Hero';
import { ScrollStory } from '../components/story/ScrollStory';
import { UnderstandSkinSection } from '../components/editorial/UnderstandSkinSection';
import { SkinIntelligenceSection } from '../components/editorial/SkinIntelligenceSection';
import { ProfilePreviewSection } from '../components/editorial/ProfilePreviewSection';
import { PersonalizedCareSection } from '../components/editorial/PersonalizedCareSection';
import { JourneySection } from '../components/editorial/JourneySection';
import { FinalCtaSection } from '../components/editorial/FinalCtaSection';

export const Home: React.FC = () => {
  return (
    <div className="w-full">
      <Hero />
      <ScrollStory />
      <UnderstandSkinSection />
      <SkinIntelligenceSection />
      <ProfilePreviewSection />
      <PersonalizedCareSection />
      <JourneySection />
      <FinalCtaSection />
    </div>
  );
};
