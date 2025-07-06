import { WellnessType } from '@/types';
import { Walk, SwimmingPool, PhotoSpot, NatureExperience, ArtGallery, SpecialActivity } from './wellness';

export const WellnessDetail = ({ wellnessType }: { wellnessType: WellnessType }) => {
  switch (wellnessType) {
    case "walk":
      return <Walk />;
    case "swimming-pool":
      return <SwimmingPool />;
    case "photo-spot":
      return <PhotoSpot />;
    case "nature-experience":
      return <NatureExperience />;
    case "art-gallery":
      return <ArtGallery />;
    case "special-activity":
      return <SpecialActivity />;
    default:
      return <div>Wellness Type Not Found</div>;
  }
};
