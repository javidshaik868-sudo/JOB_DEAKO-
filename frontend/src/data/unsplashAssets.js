// Curated high-resolution photographic and brand assets sourced from Unsplash (images.unsplash.com)
// Configured with auto=format, fit=crop, and optimized dimensions for high-performance rendering.

export const unsplashLogos = {
  Google: 'https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?auto=format&fit=crop&w=200&h=200&q=80',
  Microsoft: 'https://images.unsplash.com/photo-1642132652075-2bfa32b217a9?auto=format&fit=crop&w=200&h=200&q=80',
  Amazon: 'https://images.unsplash.com/photo-1523474253243-28566a926df1?auto=format&fit=crop&w=200&h=200&q=80',
  Apple: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=200&h=200&q=80',
  Meta: 'https://images.unsplash.com/photo-1633613286991-611fe299c4be?auto=format&fit=crop&w=200&h=200&q=80',
  Netflix: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?auto=format&fit=crop&w=200&h=200&q=80',
  Spotify: 'https://images.unsplash.com/photo-1614680376593-902f749f7ffc?auto=format&fit=crop&w=200&h=200&q=80',
  Adobe: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=200&h=200&q=80',
  Unsplash: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=200&h=200&q=80',
  Razorpay: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=200&h=200&q=80',
  Swiggy: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=200&h=200&q=80',
  Zomato: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=200&h=200&q=80',
  Flipkart: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=200&h=200&q=80',
};

export const unsplashAvatars = {
  demo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&h=256&q=80',
  recruiter1: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&h=256&q=80',
  recruiter2: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&h=256&q=80',
  candidate1: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&h=256&q=80',
  candidate2: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=256&h=256&q=80',
  candidate3: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=256&h=256&q=80',
};

export const unsplashCategories = {
  'Software Development': 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=400&h=250&q=80',
  'AI & ML': 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=400&h=250&q=80',
  'Data & Analytics': 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=400&h=250&q=80',
  'Java Development': 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=400&h=250&q=80',
  'Frontend Development': 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=400&h=250&q=80',
  'Backend Development': 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=400&h=250&q=80',
};

export const unsplashResources = {
  interview: 'https://images.unsplash.com/photo-1573497620053-ea5300f94f21?auto=format&fit=crop&w=600&h=340&q=80',
  resume: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=600&h=340&q=80',
  systemDesign: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&h=340&q=80',
  dsa: 'https://images.unsplash.com/photo-1516116211227-bbc677161b47?auto=format&fit=crop&w=600&h=340&q=80',
  ai: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&h=340&q=80',
};

export const getCompanyLogo = (companyName) => {
  if (!companyName) return null;
  const matchKey = Object.keys(unsplashLogos).find(
    (key) => key.toLowerCase() === companyName.trim().toLowerCase()
  );
  return matchKey ? unsplashLogos[matchKey] : null;
};

export const getCategoryBanner = (categoryTitle) => {
  if (!categoryTitle) return null;
  const matchKey = Object.keys(unsplashCategories).find(
    (key) => key.toLowerCase() === categoryTitle.trim().toLowerCase()
  );
  return matchKey ? unsplashCategories[matchKey] : null;
};
