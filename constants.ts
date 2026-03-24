import { Resource, CountryData, QuizQuestion, BlogPost, User, Permission, CommunityPost, DonationTier, Comment } from './types';

export const MOCK_PERMISSIONS: Permission[] = [
  { id: 'p1', name: 'Manage Users', description: 'Create, edit, and delete system users.', enabled: true },
  { id: 'p2', name: 'Content Editing', description: 'Modify resources and blog posts.', enabled: true },
  { id: 'p3', name: 'View Analytics', description: 'Access site-wide performance metrics.', enabled: true },
  { id: 'p4', name: 'System Settings', description: 'Configure site-wide parameters.', enabled: false },
  { id: 'p5', name: 'Newsletter Editor', description: 'Access the Newsletter Studio and AI generation features.', enabled: true },
];

export const MOCK_USERS: User[] = [
  { 
    id: 'u1', 
    name: 'Phil E.A', 
    email: 'phil@buildersconnect.org', 
    role: 'ADMIN', 
    avatar: 'https://images.unsplash.com/photo-1507152832244-10d45c7eda57?auto=format&fit=crop&q=80&w=800',
    bio: 'Founder of Builders Connect. Avid traveler and strategic life designer.',
    location: 'Dubai, UAE',
    accesses: ['p1', 'p2', 'p3', 'p4', 'p5']
  },
  { 
    id: 'u2', 
    name: 'Sarah Jenkins', 
    email: 'sarah.j@buildersconnect.org', 
    role: 'BACK_OFFICE', 
    avatar: 'https://i.pravatar.cc/150?u=u2',
    bio: 'Content strategist helping expats find their feet.',
    location: 'Berlin, Germany',
    accesses: ['p2', 'p3', 'p5']
  },
  { 
    id: 'u3', 
    name: 'James Globalist', 
    email: 'james@gmail.com', 
    role: 'MEMBER', 
    avatar: 'https://i.pravatar.cc/150?u=u3',
    bio: 'Future builder exploring mobility and wealth creation.',
    location: 'London, UK',
    accesses: []
  }
];

export const SHOP_PRODUCTS = [
  {
    id: 'p1',
    name: 'Built to Last',
    subtitle: 'A Guide to Strategic Life Design',
    description: 'Our flagship book that teaches you how to design a life beyond default settings. Learn practical strategies for mobility, wealth creation, and personal evolution.',
    price: 29.99,
    category: 'Books',
    image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=800',
    features: ['150+ pages of strategy', 'Case studies', 'Actionable blueprints'],
    isNew: true
  },
  {
    id: 'p2',
    name: 'Borderless Blueprint',
    subtitle: 'Digital Strategy Guide',
    description: 'The definitive 150-page digital guide to global living and multi-currency wealth creation.',
    price: 49.00,
    category: 'Digital',
    image: 'https://images.unsplash.com/photo-1589998059171-988d887df646?auto=format&fit=crop&q=80&w=800',
    features: ['Instant Download', 'Interactive Checklists', 'Resource Directory'],
    isNew: false
  },
  {
    id: 'p3',
    name: 'Wealth Simulator Pro',
    subtitle: 'Tax & Net Worth Calculator',
    description: 'Advanced tool to simulate your net worth across 50+ tax jurisdictions and investment scenarios.',
    price: 99.00,
    category: 'Tools',
    image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=800',
    features: ['50+ Countries', 'Investment Scenarios', 'Exportable Reports'],
    isNew: true
  }
];

export const COMMUNITY_POSTS: CommunityPost[] = [
  {
    id: 'cp1',
    author: 'Elena Rossi',
    avatar: 'https://i.pravatar.cc/150?u=elena',
    title: 'Digital Nomad Visa in Spain: My experience',
    content: 'Just received my approval for the Spanish digital nomad visa! The process took about 45 days. I was worried about the income threshold, but they accept a combination of remote contracts and passive income. If you are applying from within the EU, the process is much faster (approx 20 days). Happy to answer any questions about the health insurance requirement or the tax NIE process!',
    pillar: 'Live',
    likes: 124,
    replies: 18,
    date: '2 hours ago',
    comments: [
      {
        id: 'c1',
        author: 'Marcus Chen',
        avatar: 'https://i.pravatar.cc/150?u=marcus',
        content: 'Congrats Elena! Did you use an agency or do it yourself? I\'ve heard the NIE process is a nightmare right now.',
        date: '1 hour ago',
        likes: 12,
        replies: [
          {
            id: 'c2',
            author: 'Elena Rossi',
            avatar: 'https://i.pravatar.cc/150?u=elena',
            content: '> Did you use an agency or do it yourself?\n\nI did it myself! It was tedious but manageable. The NIE appointment took some refreshing of the website, but I got one in 2 weeks.',
            date: '45 mins ago',
            likes: 5,
            replies: []
          }
        ]
      }
    ]
  },
  {
    id: 'cp2',
    author: 'David Wu',
    avatar: 'https://i.pravatar.cc/150?u=david',
    title: 'SAP S/4HANA roles in UAE',
    content: 'Seeing a massive surge in contract roles for FICO specialists in Dubai. Anyone else noticing the rate hike? I have seen daily rates jumping from $800 to nearly $1200 for senior architects this quarter. Looking for a partner to share housing costs in Marina or JBR if anyone is planning a Q3 move. The tax-free life is calling!',
    pillar: 'Earn',
    likes: 89,
    replies: 24,
    date: '5 hours ago',
    comments: []
  },
  {
    id: 'cp3',
    author: 'Sarah Jenkins',
    avatar: 'https://i.pravatar.cc/150?u=u2',
    title: 'Mindset: Overcoming the 6-month expat blues',
    content: 'We often talk about the excitement of moving, but the "settling period" is tough. After the initial honeymoon phase ends, the reality of missing friends and family sets in. I wrote a small guide on finding community in Berlin and why choosing a coworking space over home-office is the #1 defense against loneliness. Don\'t give up just yet!',
    pillar: 'Grow',
    likes: 215,
    replies: 42,
    date: '1 day ago',
    comments: []
  },
  {
    id: 'cp4',
    author: 'Liam Smith',
    avatar: 'https://i.pravatar.cc/150?u=liam',
    title: 'Tax efficiency in Singapore vs UAE?',
    content: 'Trying to decide where to base my remote SaaS business. Singapore has the infrastructure, but UAE has the 0% personal income tax advantage. Would love to hear from anyone who has run businesses in both. Is the 15% in SG worth the lifestyle upgrade?',
    pillar: 'Earn',
    likes: 56,
    replies: 31,
    date: '2 days ago',
    comments: []
  }
];

export const DONATION_TIERS: DonationTier[] = [
  {
    id: 'd1',
    name: 'Supporter',
    amount: 10,
    description: 'Help us keep the servers running and the resources free for everyone.',
    perks: ['Discord Supporter Role', 'Impact Newsletter'],
    color: 'navy'
  },
  {
    id: 'd2',
    name: 'Advocate',
    amount: 50,
    description: 'Directly fund the creation of new mobility and wealth playbooks.',
    perks: ['Early Access Tools', 'Builders Digital Badge'],
    color: 'teal'
  },
  {
    id: 'd3',
    name: 'Global Patron',
    amount: 250,
    description: 'Become a cornerstone of our mission to build a world beyond default settings.',
    perks: ['Founders Circle Access', 'Priority Roadmap Votes'],
    color: 'coral'
  }
];

export const RESOURCES: Resource[] = [
  {
    id: '1',
    title: 'Moving Abroad Checklist',
    description: 'The ultimate guide for your first 90 days in a new country.',
    pillar: 'Live',
    format: 'Guide',
    price: 'Free',
    tags: ['Relocation', 'Planning'],
    thumbnail: 'https://picsum.photos/seed/live1/400/300'
  },
  {
    id: '2',
    title: 'Wealth Creation Fast-Track',
    description: 'Land a high-paying role or build a business in global markets.',
    pillar: 'Earn',
    format: 'Course',
    price: 199,
    rating: 4.9,
    tags: ['Career', 'Wealth', 'Tech'],
    thumbnail: 'https://picsum.photos/seed/earn1/400/300'
  },
  {
    id: '3',
    title: 'Global Budgeting Template',
    description: 'Manage finances across multiple currencies and bank accounts.',
    pillar: 'Earn',
    format: 'Template',
    price: 'Free',
    tags: ['Finance', 'Savings'],
    thumbnail: 'https://picsum.photos/seed/earn2/400/300'
  },
  {
    id: '4',
    title: 'Mindset Shift for Expats',
    description: 'Mental resilience techniques for living and thriving abroad.',
    pillar: 'Grow',
    format: 'Course',
    price: 49,
    rating: 4.7,
    tags: ['Mindset', 'Growth'],
    thumbnail: 'https://picsum.photos/seed/grow1/400/300'
  }
];

export const COUNTRIES: CountryData[] = [
  {
    id: 'germany',
    name: 'Germany',
    overview: 'The heart of Europe with a strong economy and high quality of life.',
    visaOptions: [
      { name: 'Opportunity Card', difficulty: 'Medium', description: 'Points-based search visa.' },
      { name: 'Blue Card', difficulty: 'Easy', description: 'For highly skilled workers.' }
    ],
    costs: { housing: 1200, food: 400, transport: 100, healthcare: 150 },
    techMarket: 'Robust demand for software engineers and strategic builders.',
    language: 'German (B1+ recommended, English okay in tech)'
  },
  {
    id: 'canada',
    name: 'Canada',
    overview: 'Diverse, welcoming, and vast opportunities across all sectors.',
    visaOptions: [
      { name: 'Express Entry', difficulty: 'Hard', description: 'Main skilled worker pathway.' },
      { name: 'Work Permit', difficulty: 'Medium', description: 'Employer-sponsored.' }
    ],
    costs: { housing: 1800, food: 500, transport: 120, healthcare: 50 },
    techMarket: 'Fast-growing tech hubs in Toronto, Vancouver, and Montreal.',
    language: 'English and French'
  },
  {
    id: 'uae',
    name: 'UAE',
    overview: 'Tax-free income and ultra-modern infrastructure in the desert.',
    visaOptions: [
      { name: 'Golden Visa', difficulty: 'Medium', description: '10-year residency for investors/talents.' },
      { name: 'Remote Work Visa', difficulty: 'Easy', description: 'Live in Dubai, work anywhere.' }
    ],
    costs: { housing: 2500, food: 600, transport: 200, healthcare: 100 },
    techMarket: 'Massive investment in AI and digital transformation.',
    language: 'English (primary business language), Arabic'
  }
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: "How much emergency savings do you have for a potential move?",
    category: 'financial',
    options: [
      { text: "Less than 3 months", score: 2 },
      { text: "3-6 months", score: 5 },
      { text: "6+ months of target country expenses", score: 10 }
    ]
  },
  {
    id: 2,
    question: "How would you describe your current professional skill set?",
    category: 'career',
    options: [
      { text: "Locally specific skills", score: 3 },
      { text: "General skills but no niche", score: 6 },
      { text: "High-demand tech/specialized niche (e.g. AI, Strategy)", score: 10 }
    ]
  },
  {
    id: 3,
    question: "How do you handle unfamiliar cultural situations?",
    category: 'cultural',
    options: [
      { text: "I find them stressful and prefer the familiar", score: 2 },
      { text: "I try to adapt but often feel lost", score: 6 },
      { text: "I embrace them as learning opportunities", score: 10 }
    ]
  }
];

export const BLOG_POSTS: BlogPost[] = [
  {
    id: 'b1',
    title: 'Why I Left My Stable Job to Move to Portugal',
    excerpt: 'The story of how a digital nomad found home in the Algarve.',
    author: 'Maria Silva',
    date: 'Oct 12, 2023',
    pillar: 'Live',
    readTime: '6 min read',
    image: 'https://picsum.photos/seed/blog1/800/400'
  },
  {
    id: 'b2',
    title: 'Top 5 Skills for 2024 Global Careers',
    excerpt: 'Which skills are commanding the highest rates in the global market.',
    author: 'David Chen',
    date: 'Nov 05, 2023',
    pillar: 'Earn',
    readTime: '8 min read',
    image: 'https://picsum.photos/seed/blog2/800/400'
  }
];