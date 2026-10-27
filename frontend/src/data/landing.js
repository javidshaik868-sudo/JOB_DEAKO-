import { unsplashLogos, unsplashCategories } from './unsplashAssets';

export const popularSearches = [
  'Software Engineer',
  'AI Engineer',
  'Java Developer',
  'Python Developer',
  'Data Analyst',
];

export const heroStats = [
  { value: '150K+', label: 'Active Jobs', icon: 'briefcase' },
  { value: '12K+', label: 'Top Companies', icon: 'building' },
  { value: '94%', label: 'Success Rate', icon: 'sparkles' },
  { value: '₹18.4 LPA', label: 'Average Package', icon: 'award' },
];

export const whyFeatures = [
  {
    title: 'Smart Search',
    description: 'Find relevant opportunities using powerful search and personalized recommendations.',
    icon: 'search',
  },
  {
    title: 'Easy Apply',
    description: 'Apply to jobs quickly with your profile, resume, and saved application details.',
    icon: 'sparkles',
  },
  {
    title: 'Track Applications',
    description: 'Keep everything organized and follow your applications from submission to interview.',
    icon: 'chart',
  },
  {
    title: 'Career Growth',
    description: 'Access resources, build your resume, and get expert tips to advance your career.',
    icon: 'graduation',
  },
];

export const popularCategories = [
  { title: 'Software Development', count: '12,400+ jobs', icon: 'code', image: unsplashCategories['Software Development'] },
  { title: 'AI & ML', count: '8,200+ jobs', icon: 'robot', image: unsplashCategories['AI & ML'] },
  { title: 'Data & Analytics', count: '6,800+ jobs', icon: 'database', image: unsplashCategories['Data & Analytics'] },
  { title: 'Java Development', count: '5,400+ jobs', icon: 'code', image: unsplashCategories['Java Development'] },
  { title: 'Frontend Development', count: '4,900+ jobs', icon: 'globe', image: unsplashCategories['Frontend Development'] },
  { title: 'Backend Development', count: '4,300+ jobs', icon: 'cloud', image: unsplashCategories['Backend Development'] },
];

export const featuredJobs = [
  {
    id: 'feat-1',
    title: 'Software Engineer',
    company: 'Google',
    location: 'Hyderabad',
    workMode: 'Remote',
    salary: '₹28-45 LPA',
    posted: '2d ago',
    tags: ['React', 'Go', 'Kubernetes'],
    verified: true,
    logo: unsplashLogos.Google,
  },
  {
    id: 'feat-2',
    title: 'AI Engineer',
    company: 'Microsoft',
    location: 'Bangalore',
    workMode: 'Hybrid',
    salary: '₹32-50 LPA',
    posted: '1d ago',
    tags: ['Python', 'ML', 'Azure'],
    verified: true,
    logo: unsplashLogos.Microsoft,
  },
  {
    id: 'feat-3',
    title: 'Software Development Engineer I',
    company: 'Amazon',
    location: 'Chennai',
    workMode: 'On-site',
    salary: '₹24-40 LPA',
    posted: '3d ago',
    tags: ['Java', 'AWS', 'System Design'],
    verified: true,
    logo: unsplashLogos.Amazon,
  },
];

export const trustedCompanies = [
  { name: 'Google', type: 'tech', logo: unsplashLogos.Google },
  { name: 'Microsoft', type: 'tech', logo: unsplashLogos.Microsoft },
  { name: 'Amazon', type: 'tech', logo: unsplashLogos.Amazon },
  { name: 'Meta', type: 'tech', logo: unsplashLogos.Meta },
  { name: 'Apple', type: 'tech', logo: unsplashLogos.Apple },
  { name: 'Netflix', type: 'tech', logo: unsplashLogos.Netflix },
  { name: 'Spotify', type: 'tech', logo: unsplashLogos.Spotify },
  { name: 'Unsplash', type: 'tech', logo: unsplashLogos.Unsplash },
  { name: 'Adobe', type: 'tech', logo: unsplashLogos.Adobe },
];

