import type { Campaign } from '@/types';

export const MOCK_CAMPAIGNS: Campaign[] = [
  {
    id: 'camp-rice-jam-mask',
    title: 'SIOT Rice Jam Mask',
    subtitle: 'Overnight hydration & glass-skin glow',
    description:
      'Experience the viral SIOT Rice Jam Mask — a nourishing overnight sleeping mask infused with fermented rice extract and ceramides. We\'re looking for US-based TikTok creators to showcase their glass-skin morning routine and share authentic results with their audience.',
    productImage:
      'https://images.pexels.com/photos/7161668/pexels-photo-7161668.jpeg?auto=compress&cs=tinysrgb&w=800',
    productDetails:
      'A 50ml sleeping mask with fermented rice extract, niacinamide, and triple ceramide complex. Vegan, cruelty-free, and fragrance-free. Suitable for all skin types.',
    requirements: [
      'Must be US-based with an active TikTok account',
      'Minimum 5,000 TikTok followers',
      'Create one TikTok video (15–60 seconds) showing application and morning results',
      'Tag @siot.skincare and use #SIOTRiceJamMask',
      'Post within 14 days of receiving the product',
    ],
    rewards: [
      'Free full-size SIOT Rice Jam Mask (value $38)',
      'Exclusive 20% affiliate commission code',
      'Featured on SIOT\'s official TikTok and Instagram',
      'Early access to upcoming SIOT product launches',
    ],
    rewardSummary: 'Free product + 20% affiliate code',
    deadline: '2026-11-15',
    status: 'open',
    createdAt: '2026-09-01',
  },
  {
    id: 'camp-matcha-gua-sha',
    title: 'SIOT Matcha Gua Sha Cream',
    subtitle: 'Depuffing matcha-infused sculpting cream',
    description:
      'The SIOT Matcha Gua Sha Cream pairs the antioxidant power of ceremonial-grade matcha with a cooling, glide-on texture designed for Gua Sha massage. We\'re seeking creators who can demonstrate a facial massage routine and share the depuffing benefits with their community.',
    productImage:
      'https://images.pexels.com/photos/6724376/pexels-photo-6724376.jpeg?auto=compress&cs=tinysrgb&w=800',
    productDetails:
      'A 60ml sculpting cream with ceremonial matcha extract, caffeine, and peptides. Designed to pair with the included SIOT rose quartz Gua Sha tool. Vegan and cruelty-free.',
    requirements: [
      'Must be US-based with an active TikTok account',
      'Minimum 8,000 TikTok followers',
      'Create one TikTok video demonstrating a Gua Sha massage routine',
      'Tag @siot.skincare and use #SIOTMatchaGuaSha',
      'Post within 14 days of receiving the product',
    ],
    rewards: [
      'Free SIOT Matcha Gua Sha Cream + Rose Quartz Gua Sha tool (value $62)',
      'Exclusive 25% affiliate commission code',
      'Featured on SIOT\'s official TikTok and Instagram',
      'Invitation to SIOT\'s annual creator retreat in Seoul',
    ],
    rewardSummary: 'Free product + Gua Sha tool + 25% affiliate code',
    deadline: '2026-11-30',
    status: 'open',
    createdAt: '2026-09-05',
  },
];

export const US_STATES = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado',
  'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho',
  'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana',
  'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota',
  'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada',
  'New Hampshire', 'New Jersey', 'New Mexico', 'New York',
  'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon',
  'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota',
  'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington',
  'West Virginia', 'Wisconsin', 'Wyoming',
];
