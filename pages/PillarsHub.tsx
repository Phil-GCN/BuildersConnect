import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { PlayCircle, Mic, CheckCircle, ArrowRight, Plane, Wallet, Brain, TrendingUp } from 'lucide-react';
import { RESOURCES, BLOG_POSTS } from '../constants';

type Pillar = 'Live' | 'Earn' | 'Grow';

const PILLAR_CONFIG = {
  Live: {
    title: 'Live Beyond Borders',
    description: 'Master the art of relocation, from visa navigation to finding your first home in a new culture.',
    color: 'navy',
    accent: 'teal',
    heroImage: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&q=80&w=1200',
    features: ['Mobility Blueprint', 'Country Cost Breakdowns', 'Housing & Integration', 'Community Meetups'],
    icon: Plane,
    testimonial: {
      quote: "Moving was the hardest and best thing I ever did. Builders Connect made the logistics disappear so I could focus on my life, not the paperwork.",
      author: "Alex Rivera",
      role: "Expat in Berlin",
      img: "https://i.pravatar.cc/150?u=a"
    }
  },
  Earn: {
    title: 'Earn Across Borders',
    description: 'Build a high-impact global career and multi-currency wealth that travels with you.',
    color: 'teal',
    accent: 'navy',
    heroImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1200',
    features: ['Wealth Creation Playbook', 'Remote Work Strategies', 'Financial Literacy', 'Salary Benchmarking'],
    icon: Wallet,
    testimonial: {
      quote: "The SAP Career Playbook was a game-changer. I secured a remote role with a 40% salary bump and zero tax in Dubai. Pure ROI.",
      author: "James K.",
      role: "SAP Solutions Architect",
      img: "https://i.pravatar.cc/150?u=j_k"
    }
  },
  Grow: {
    title: 'Grow Without Borders',
    description: 'Cultivate the mindset and resilience required to thrive as a citizen of the world.',
    color: 'coral',
    accent: 'navy',
    heroImage: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1200',
    features: ['Cultural Intelligence', 'Mindset Coaching', 'Networking Skills', 'Success Stories'],
    icon: Brain,
    testimonial: {
      quote: "Cultural intelligence is the unsung hero of relocation. Builders Connect helped me transition from a local professional to a global leader.",
      author: "Sophia Chen",
      role: "FinTech Director",
      img: "https://i.pravatar.cc/150?u=s_c"
    }
  }
};

const PillarsHub: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = (searchParams.get('tab') as Pillar) || 'Live';
  const [activeTab, setActiveTab] = useState<Pillar>(initialTab);

  useEffect(() => {
    const tab = searchParams.get('tab') as Pillar;
    if (tab && PILLAR_CONFIG[tab]) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const handleTabChange = (pillar: Pillar) => {
    setActiveTab(pillar);
    setSearchParams({ tab: pillar });
  };

  const config = PILLAR_CONFIG[activeTab];
  const filteredResources = RESOURCES.filter(r => r.pillar === activeTab);
  const filteredBlogs = BLOG_POSTS.filter(b => b.pillar === activeTab);

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative h-[65vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src={config.heroImage} alt={activeTab} className="w-full h-full object-cover transition-all duration-700" />
          <div className="absolute inset-0 bg-navy/60 backdrop-blur-[2px]"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-white">
          <div className="max-w-2xl animate-in fade-in slide-in-from-left duration-700">
            <div className="inline-flex items-center px-4 py-1 rounded-full bg-teal text-navy text-xs font-black uppercase tracking-widest mb-6">
              Global Strategy
            </div>
            <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight tracking-tighter">
              {config.title}
            </h1>
            <p className="text-xl text-gray-200 mb-10 leading-relaxed font-medium">
              {config.description}
            </p>
            
            {/* Tab Navigation */}
            <div className="flex flex-wrap gap-2 p-1.5 bg-white/10 backdrop-blur-md rounded-[2rem] w-fit border border-white/20">
              {(['Live', 'Earn', 'Grow'] as Pillar[]).map((pillar) => {
                const Icon = PILLAR_CONFIG[pillar].icon;
                return (
                  <button
                    key={pillar}
                    onClick={() => handleTabChange(pillar)}
                    className={`flex items-center px-6 py-3 rounded-full text-sm font-black transition-all ${
                      activeTab === pillar 
                        ? 'bg-white text-navy shadow-xl' 
                        : 'text-white hover:bg-white/10'
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {pillar}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Overview & Features */}
      <section className="py-24 bg-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-black text-navy mb-8 tracking-tighter">What we cover in {activeTab}</h2>
              <div className="grid sm:grid-cols-2 gap-6">
                {config.features.map(feature => (
                  <div key={feature} className="flex items-start space-x-3 p-5 bg-white rounded-3xl shadow-sm border border-gray-100">
                    <CheckCircle className="h-6 w-6 text-teal shrink-0" />
                    <span className="font-bold text-navy">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-navy p-12 rounded-[3.5rem] text-white shadow-2xl relative overflow-hidden">
              <div className="relative z-10">
                <h3 className="text-2xl font-bold mb-6 italic leading-relaxed">
                  "{config.testimonial.quote}"
                </h3>
                <div className="flex items-center mt-8">
                  <div className="w-14 h-14 rounded-full bg-teal/20 mr-4 overflow-hidden border-2 border-teal">
                    <img src={config.testimonial.img} alt={config.testimonial.author} />
                  </div>
                  <div>
                    <div className="font-black text-lg">{config.testimonial.author}</div>
                    <div className="text-sm text-gray-400 font-bold uppercase tracking-widest">{config.testimonial.role}</div>
                  </div>
                </div>
              </div>
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <TrendingUp className="w-32 h-32" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Resources */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-16">
            <div>
              <h2 className="text-4xl font-black text-navy mb-4 tracking-tighter">Popular in {activeTab}</h2>
              <p className="text-gray-600 text-lg">Hand-picked guides and tools to accelerate your growth.</p>
            </div>
            <Link to="/resources" className="text-teal font-black hover:underline flex items-center">
              See All Resources <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {filteredResources.map(res => (
              <div key={res.id} className="bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-md hover:shadow-2xl transition-all group flex flex-col">
                <div className="h-56 overflow-hidden">
                  <img src={res.thumbnail} alt={res.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                </div>
                <div className="p-8 flex flex-col flex-grow">
                  <h3 className="text-2xl font-black text-navy mb-3 group-hover:text-teal transition-colors leading-tight">{res.title}</h3>
                  <p className="text-gray-600 text-sm mb-8 line-clamp-2">{res.description}</p>
                  <Link to="/resources" className="mt-auto text-navy font-black flex items-center group-hover:text-teal transition-colors">
                    Access Resource <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            ))}
            <div className="bg-light rounded-[2.5rem] border-4 border-dashed border-gray-200 p-10 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center mb-6 shadow-sm">
                <TrendingUp className="h-8 w-8 text-gray-300" />
              </div>
              <p className="text-gray-500 mb-6 font-bold text-lg">More {activeTab} strategy content is added every month.</p>
              <button className="text-teal font-black text-sm uppercase tracking-widest hover:text-navy transition-colors">Request a Topic</button>
            </div>
          </div>
        </div>
      </section>

      {/* Multimedia Section */}
      <section className="py-24 bg-navy text-white overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div>
              <h2 className="text-4xl font-black mb-6 tracking-tighter">Masterclass Content</h2>
              <p className="text-gray-400 mb-10 text-xl leading-relaxed">
                We interview global citizens who have already walked the path. Learn from their mistakes and mirror their success.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-center p-6 bg-white/5 rounded-[2rem] border border-white/10 hover:bg-white/10 transition-all cursor-pointer group">
                  <div className="w-16 h-16 rounded-2xl bg-coral flex items-center justify-center mr-6 shrink-0 shadow-xl group-hover:scale-110 transition-transform">
                    <Mic className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xl mb-1 group-hover:text-coral transition-colors">Future Foundations Podcast</h4>
                    <span className="text-sm text-gray-500 font-bold uppercase tracking-widest block">Ep. 42 • 45 min • Strategic Life Design</span>
                    <span className="text-[10px] text-gray-600 font-bold uppercase tracking-widest block mt-1">ff_podcast@buildersconnect.org</span>
                  </div>
                </div>
                <div className="flex items-center p-6 bg-white/5 rounded-[2rem] border border-white/10 hover:bg-white/10 transition-all cursor-pointer group">
                  <div className="w-16 h-16 rounded-2xl bg-teal flex items-center justify-center mr-6 shrink-0 shadow-xl group-hover:scale-110 transition-transform">
                    <PlayCircle className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xl mb-1 group-hover:text-teal transition-colors">Video: First 30 Days in {activeTab === 'Live' ? 'Amsterdam' : activeTab === 'Earn' ? 'Dubai' : 'a New Role'}</h4>
                    <span className="text-sm text-gray-500 font-bold uppercase tracking-widest">YouTube • 12k views • Step-by-Step</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative group">
              <div className="absolute -inset-4 bg-teal/20 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              <div className="aspect-video bg-gray-800 rounded-[3rem] overflow-hidden shadow-2xl relative group cursor-pointer border border-white/5">
                <img src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-1000" alt="Video cover" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-24 h-24 bg-white/10 backdrop-blur-xl rounded-full flex items-center justify-center group-hover:scale-110 group-hover:bg-white/20 transition-all duration-500 border border-white/20">
                    <PlayCircle className="h-14 w-14 text-white fill-white/20" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Blog/Articles */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-16">
            <h2 className="text-4xl font-black text-navy tracking-tighter">Insights & Perspectives</h2>
            <Link to="/resources" className="bg-light text-navy px-8 py-3 rounded-full font-black hover:bg-gray-200 transition-all">View All Articles</Link>
          </div>
          <div className="grid md:grid-cols-2 gap-12">
            {filteredBlogs.map(blog => (
              <div key={blog.id} className="group cursor-pointer">
                <div className="h-80 rounded-[3rem] overflow-hidden mb-8 shadow-lg">
                  <img src={blog.image} alt={blog.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                </div>
                <div className="flex items-center space-x-4 mb-4">
                  <span className="px-3 py-1 bg-teal/10 text-teal rounded-lg text-xs font-black uppercase tracking-widest">{blog.pillar}</span>
                  <span className="text-gray-400 font-bold text-xs uppercase tracking-widest">{blog.date} • {blog.readTime}</span>
                </div>
                <h3 className="text-3xl font-black text-navy mb-4 group-hover:text-teal transition-colors leading-tight">{blog.title}</h3>
                <p className="text-gray-600 text-lg mb-6 leading-relaxed line-clamp-2">{blog.excerpt}</p>
                <div className="flex items-center text-navy font-black hover:text-teal transition-colors">
                  Read Full Story <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-2 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-light">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-teal rounded-[4rem] p-16 text-center shadow-2xl relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-black text-navy mb-8 tracking-tighter">Ready to Master {activeTab}?</h2>
              <p className="text-navy/70 text-xl font-bold mb-12 max-w-2xl mx-auto">
                Join 50,000+ builders receiving our weekly strategy reports and member-only resources.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/tools/quiz" className="bg-navy text-white px-10 py-5 rounded-full font-black text-lg hover:scale-105 transition-all shadow-xl">
                  Take Readiness Quiz
                </Link>
                <Link to="/resources" className="bg-white text-navy px-10 py-5 rounded-full font-black text-lg hover:bg-gray-50 transition-all border border-navy/10">
                  Browse Resources
                </Link>
              </div>
            </div>
            <div className="absolute top-0 left-0 -ml-10 -mt-10 w-40 h-40 bg-white/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-0 -mr-10 -mb-10 w-40 h-40 bg-navy/10 rounded-full blur-3xl"></div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PillarsHub;