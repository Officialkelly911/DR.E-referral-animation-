import bronzeBadgeImg from "@assets/A11ED17F-C652-4842-860A-238B900B4582_1785791355033.png";
import silverBadgeImg from "@assets/53083A32-EC5F-4005-B708-C200E43E8F4A_1785791355033.png";
import goldBadgeImg from "@assets/68639902-95DA-48F1-91B5-E14F971DE277_1785791355033.png";

export type LevelInfo = {
  id: string;
  name: string;
  image: string;
  isLocked: boolean;
  target: number;
  current: number;
  rewardText: string;
  requirements: string[];
};

export const levelsData: LevelInfo[] = [
  {
    id: "bronze",
    name: "Bronze",
    image: bronzeBadgeImg,
    isLocked: false,
    target: 10,
    current: 0,
    rewardText: "Get $40 when 10 of your referrals complete an activity.",
    requirements: [
      "Referred users must complete user onboarding",
      "Join at least 2 forums and engage with at least 3 posts"
    ]
  },
  {
    id: "silver",
    name: "Silver",
    image: silverBadgeImg,
    isLocked: true,
    target: 25,
    current: 0,
    rewardText: "Get $100 when you refer 25 additional qualified users",
    requirements: [
      "Referred users must complete user onboarding",
      "Join at least 2 forums and engage with at least 3 posts"
    ]
  },
  {
    id: "gold",
    name: "Gold",
    image: goldBadgeImg,
    isLocked: true,
    target: 50,
    current: 0,
    rewardText: "Get $200 when you refer 50 additional qualified users",
    requirements: [
      "Referred users must complete user onboarding",
      "Join at least 2 forums and engage with at least 3 posts"
    ]
  }
];
