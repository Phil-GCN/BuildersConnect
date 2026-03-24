import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, Plane, Wallet, Brain, Star, CheckCircle, 
  Calculator, Search, ShieldCheck, Quote, PlayCircle, 
  Mic, BookOpen, TrendingUp, Users, X, Info, Check,
  MessageSquare, Heart
} from 'lucide-react';
import { BLOG_POSTS, COUNTRIES, COMMUNITY_POSTS } from '../constants';

const Home = () => {
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  // --- Tool State: Cost of Living Matcher ---
  const [colCityA, setColCityA] = useState(COUNTRIES[0].id);
  const [colCityB, setColCityB] = useState(COUNTRIES[2].id);

  // --- Tool State: Visa Discovery ---
  const [visaSkill, setVisaSkill] = useState('');
  const [visaDiscoveryResult, setVisaDiscoveryResult] = useState<any>(null);

  // --- Tool State: Wealth Calculator ---
  const [grossIncome, setGrossIncome] = useState(100000);

  const getCityData = (id: string) => COUNTRIES.find(c => c.id === id);

  const handleVisaSearch = () => {
    const allVisas = COUNTRIES.flatMap(c => c.visaOptions.map(v => ({ ...v, country: c.name })));
    const skillMatch = allVisas.filter(v => 
      v.description.toLowerCase().includes(visaSkill.toLowerCase()) || 
      v.name.toLowerCase().includes(visaSkill.toLowerCase())
    );
    setVisaDiscoveryResult(skillMatch.length > 0 ? skillMatch[0] : null);
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail) {
      setIsSubscribed(true);
      // Simulate API call
      setTimeout(() => {
        setNewsletterEmail('');
      }, 3000);
    }
  };

  const renderToolModal = () => {
    if (!activeTool) return null;

    return (
      <div className="fixed inset-0 z-[60] flex items-center justify-center px-4 bg-navy/80 backdrop-blur-sm animate-in fade-in duration-300">
        <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl p-8 md:p-12 relative max-h-[90vh] overflow-y-auto">
          <button 
            onClick={() => setActiveTool(null)}
            className="absolute top-8 right-8 p-2 hover:bg-light rounded-full transition-colors"
          >
            <X className="h-6 w-6 text-gray-400" />
          </button>

          {activeTool === 'col' && (
            <div className="space-y-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-teal/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Calculator className="h-8 w-8 text-teal" />
                </div>
                <h3 className="text-3xl font-bold mb-2">Cost of Living Matcher</h3>
                <p className="text-gray-500">Compare essential expenses between your top choices.</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase">City A</label>
                  <select 
                    value={colCityA} 
                    onChange={(e) => setColCityA(e.target.value)}
                    className="w-full bg-light border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-teal"
                  >
                    {COUNTRIES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase">City B</label>
                  <select 
                    value={colCityB} 
                    onChange={(e) => setColCityB(e.target.value)}
                    className="w-full bg-light border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-teal"
                  >
                    {COUNTRIES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                {['Housing', 'Food', 'Transport', 'Healthcare'].map((key) => {
                  const dataA = getCityData(colCityA)?.costs[key.toLowerCase() as keyof typeof COUNTRIES[0]['costs']] || 0;
                  const dataB = getCityData(colCityB)?.costs[key.toLowerCase() as keyof typeof COUNTRIES[0]['costs']] || 0;
                  return (
                    <div key={key} className="space-y-1">
                      <div className="flex justify-between text-sm font-bold">
                        <span>{key}</span>
                        <span className="text-gray-400">${dataA} vs ${dataB}</span>
                      </div>
                      <div className="h-2 bg-light rounded-full overflow-hidden flex">
                        <div 
                          className="h-full bg-navy border-r border-white" 
                          style={{ width: `${(dataA / (dataA + dataB)) * 100}%` }}
                        ></div>
                        <div 
                          className="h-full bg-teal" 
                          style={{ width: `${(dataB / (dataA + dataB)) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="p-4 bg-teal/5 rounded-2xl flex items-start space-x-3">
                <Info className="h-5 w-5 text-teal shrink-0 mt-0.5" />
                <p className="text-xs text-gray-600 leading-relaxed">
                  Data updated monthly based on community reports and local indices. Figures are estimates for a single person.
                </p>
              </div>
            </div>
          )}

          {activeTool === 'visa' && (
            <div className="space-y-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-coral/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Search className="h-8 w-8 text-coral" />
                </div>
                <h3 className="text-3xl font-bold mb-2">Visa Discovery Tool</h3>
                <p className="text-gray-500">Quickly identify pathways based on your background.</p>
              </div>

              <div className="space-y-4">
                <label className="text-xs font-bold text-gray-400 uppercase">What is your area of expertise?</label>
                <div className="flex space-x-2">
                  <input 
                    type="text" 
                    placeholder="e.g. SAP, Tech, Remote, Investor..." 
                    className="flex-grow bg-light border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-coral"
                    value={visaSkill}
                    onChange={(e) => setVisaSkill(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleVisaSearch()}
                  />
                  <button 
                    onClick={handleVisaSearch}
                    className="bg-coral text-white px-6 py-3 rounded-xl font-bold hover:bg-opacity-90"
                  >
                    Search
                  </button>
                </div>
              </div>

              {visaDiscoveryResult ? (
                <div className="p-8 bg-light rounded-3xl animate-in slide-in-from-bottom-2 duration-300">
                  <div className="text-xs font-bold text-coral uppercase mb-1">{visaDiscoveryResult.country}</div>
                  <h4 className="text-2xl font-bold mb-2">{visaDiscoveryResult.name}</h4>
                  <div className="inline-block px-2 py-0.5 bg-white rounded text-[10px] font-bold text-gray-500 mb-4 border border-gray-100">Difficulty: {visaDiscoveryResult.difficulty}</div>
                  <p className="text-gray-600 text-sm leading-relaxed">{visaDiscoveryResult.description}</p>
                </div>
              ) : (
                <div className="text-center py-10 text-gray-400 italic">
                  Enter a keyword like "Points", "Remote", or "SAP" to see matches.
                </div>
              )}
            </div>
          )}

          {activeTool === 'wealth' && (
            <div className="space-y-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-navy/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <ShieldCheck className="h-8 w-8 text-navy" />
                </div>
                <h3 className="text-3xl font-bold mb-2">Global Wealth Calculator</h3>
                <p className="text-gray-500">Simulate tax impact across multiple jurisdictions.</p>
              </div>

              <div className="space-y-4">
                <label className="text-xs font-bold text-gray-400 uppercase">Annual Gross Income (USD)</label>
                <input 
                  type="number" 
                  value={grossIncome}
                  onChange={(e) => setGrossIncome(Number(e.target.value))}
                  className="w-full bg-light border-none rounded-2xl px-6 py-4 text-2xl font-bold text-navy focus:ring-2 focus:ring-navy"
                />
              </div>

              <div className="space-y-6">
                {[
                  { region: 'Dubai (UAE)', tax: 0, color: 'teal' },
                  { region: 'Berlin (Germany)', tax: 0.42, color: 'navy' },
                  { region: 'New York (USA)', tax: 0.35, color: 'coral' }
                ].map(r => {
                  const net = grossIncome * (1 - r.tax);
                  return (
                    <div key={r.region} className="bg-light p-6 rounded-2xl flex justify-between items-center">
                      <div>
                        <div className="text-xs font-bold text-gray-400 uppercase mb-1">{r.region}</div>
                        <div className="text-2xl font-black text-navy">${net.toLocaleString()}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs font-bold text-gray-400 uppercase mb-1">Effective Tax</div>
                        <div className={`text-lg font-bold text-${r.color}`}>{r.tax * 100}%</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="overflow-hidden">
      {renderToolModal()}
      
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center bg-white pt-20">
        <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
          <div className="h-full w-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-teal via-transparent to-transparent"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-in fade-in slide-in-from-left duration-700">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-light text-teal text-sm font-bold mb-6">
                <Star className="h-4 w-4 mr-2" />
                Trusted by 50,000+ Ambitious Builders
              </div>
              <h1 className="text-5xl md:text-7xl font-extrabold text-navy leading-[1.1] mb-6 uppercase">
                Design Your Life <br />
                <span className="text-teal">Beyond Default</span>
              </h1>
              <p className="text-xl text-gray-600 mb-10 max-w-xl leading-relaxed">
                For ambitious people who refuse default paths, Builders Connect is the practical resource that helps you navigate mobility, build wealth, and evolve personally.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Link to="/tools/quiz" className="px-8 py-4 bg-navy text-white rounded-full font-bold text-lg hover:bg-opacity-95 transition-all shadow-xl shadow-navy/20 flex items-center justify-center group">
                  Start Your Journey
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link to="/resources" className="px-8 py-4 bg-white border-2 border-navy text-navy rounded-full font-bold text-lg hover:bg-light transition-all flex items-center justify-center">
                  Explore Resources
                </Link>
              </div>
            </div>
            
            <div className="relative animate-in fade-in zoom-in duration-1000 delay-200">
              <div className="bg-light p-4 rounded-[3rem] shadow-2xl overflow-hidden transform rotate-2">
                <img 
                  src="https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&q=80&w=800" 
                  alt="Global Citizen" 
                  className="rounded-[2rem] object-cover h-[500px] w-full"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pillars Section */}
      <section className="py-24 bg-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl font-bold mb-4">Master Your Borderless Life</h2>
            <p className="text-gray-600 text-lg">We provide the blueprint for relocation, financial freedom, and personal evolution in a globalized world.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Plane, title: 'LIVE', desc: 'Navigate relocation, visas, and settling into your new home with ease.', color: 'bg-navy', path: '/strategy?tab=Live' },
              { icon: Wallet, title: 'EARN', desc: 'Build multi-currency wealth and unlock high-paying global career paths.', color: 'bg-teal', path: '/strategy?tab=Earn' },
              { icon: Brain, title: 'GROW', desc: 'Evolve your mindset and skills to thrive in any culture or environment.', color: 'bg-coral', path: '/strategy?tab=Grow' }
            ].map((pillar) => (
              <Link 
                key={pillar.title} 
                to={pillar.path}
                className="group p-10 bg-white rounded-[2.5rem] shadow-lg border border-gray-100 hover:-translate-y-2 hover:shadow-2xl transition-all duration-300"
              >
                <div className={`w-14 h-14 ${pillar.color} rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform`}>
                  <pillar.icon className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-2xl font-extrabold mb-4">{pillar.title}</h3>
                <p className="text-gray-600 mb-8 leading-relaxed">{pillar.desc}</p>
                <span className="text-navy font-bold flex items-center group-hover:text-teal transition-colors">
                  Explore {pillar.title} <ArrowRight className="ml-2 h-4 w-4" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Community Buzz Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center mb-16">
            <div className="text-center md:text-left mb-6 md:mb-0">
              <h2 className="text-4xl font-black text-navy mb-4 tracking-tighter">Community Pulse</h2>
              <p className="text-gray-600 text-lg">Real-time discussions from our global network of explorers.</p>
            </div>
            <Link to="/community" className="bg-navy text-white px-8 py-3 rounded-full font-black text-sm uppercase tracking-widest hover:bg-teal transition-all">
              Join the Conversation
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {COMMUNITY_POSTS.map((post) => (
              <div key={post.id} className="bg-light p-8 rounded-[2.5rem] border border-gray-100 hover:shadow-xl transition-all group cursor-pointer" onClick={() => window.location.href = '/community'}>
                <div className="flex items-center mb-6">
                  <img src={post.avatar} className="w-12 h-12 rounded-2xl mr-4 border-2 border-white shadow-sm" alt="" />
                  <div>
                    <h4 className="font-bold text-navy">{post.author}</h4>
                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">{post.date}</p>
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-4 leading-tight group-hover:text-teal transition-colors">{post.title}</h3>
                <p className="text-gray-500 text-sm mb-8 line-clamp-2 leading-relaxed">{post.content}</p>
                <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                  <div className="flex items-center space-x-4">
                    <span className="flex items-center text-xs font-bold text-gray-400"><Heart className="h-4 w-4 mr-1 text-coral" /> {post.likes}</span>
                    <span className="flex items-center text-xs font-bold text-gray-400"><MessageSquare className="h-4 w-4 mr-1" /> {post.replies}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                    post.pillar === 'Live' ? 'bg-navy text-white' : post.pillar === 'Earn' ? 'bg-teal text-white' : 'bg-coral text-white'
                  }`}>
                    {post.pillar}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Content Section */}
      <section className="py-24 bg-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-16">
            <div>
              <h2 className="text-4xl font-black text-navy mb-4 tracking-tighter">Insights Hub</h2>
              <p className="text-gray-600 text-lg max-w-xl">Latest strategies and stories to accelerate your journey.</p>
            </div>
            <Link to="/resources" className="hidden sm:flex items-center text-teal font-black hover:underline">
              Browse All Content <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-navy rounded-[2.5rem] p-8 text-white relative overflow-hidden group">
              <div className="relative z-10">
                <div className="w-12 h-12 bg-teal rounded-xl flex items-center justify-center mb-6 shadow-xl">
                  <Mic className="h-6 w-6 text-navy" />
                </div>
                <h4 className="text-[10px] font-black uppercase tracking-widest text-teal mb-2">PODCAST</h4>
                <h3 className="text-2xl font-bold mb-4">Future Foundations</h3>
                <p className="text-gray-400 text-sm mb-4 leading-relaxed">A strategic life-design podcast for ambitious builders who refuse to accept their current circumstances as their final destination.</p>
                <p className="text-[10px] font-bold text-gray-500 mb-8 uppercase tracking-widest">Reach out: ff_podcast@buildersconnect.org</p>
                <div className="flex items-center text-teal font-black group-hover:translate-x-2 transition-transform cursor-pointer">
                  Listen Now <PlayCircle className="ml-2 h-5 w-5" />
                </div>
              </div>
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <Mic className="w-32 h-32" />
              </div>
            </div>

            <div className="lg:col-span-2 bg-white rounded-[2.5rem] overflow-hidden relative group shadow-lg">
              <div className="aspect-video sm:aspect-auto sm:h-full relative overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=1200" 
                  alt="Featured Video" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy/80 to-transparent"></div>
                <div className="absolute bottom-10 left-10 right-10 text-white">
                  <div className="w-12 h-12 bg-white/10 backdrop-blur-xl rounded-full flex items-center justify-center mb-6 border border-white/20">
                    <PlayCircle className="h-6 w-6 text-white" />
                  </div>
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-teal mb-2">MASTERCLASS</h4>
                  <h3 className="text-3xl font-black mb-4">Global Career Hacking</h3>
                  <p className="text-gray-300 text-sm max-w-lg mb-0">Learn resume strategies that command high rates in the US, Europe, and UAE markets.</p>
                </div>
              </div>
            </div>

            {BLOG_POSTS.slice(0, 2).map((post) => (
              <div key={post.id} className="bg-white border border-gray-100 rounded-[2.5rem] overflow-hidden group hover:shadow-xl transition-all">
                <div className="h-48 overflow-hidden">
                  <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                </div>
                <div className="p-8">
                  <div className="flex items-center space-x-2 mb-4">
                    <span className="px-2 py-0.5 bg-teal/10 text-teal rounded text-[10px] font-black uppercase">{post.pillar}</span>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{post.readTime}</span>
                  </div>
                  <h3 className="text-xl font-bold mb-4 group-hover:text-teal transition-colors leading-tight">{post.title}</h3>
                  <p className="text-gray-500 text-sm mb-6 line-clamp-2">{post.excerpt}</p>
                  <Link to="/strategy" className="text-navy font-black text-xs uppercase tracking-widest flex items-center group-hover:text-teal">
                    Read Story <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              </div>
            ))}

            <div className="bg-teal rounded-[2.5rem] p-8 flex flex-col justify-between group cursor-pointer hover:bg-navy hover:text-white transition-all shadow-lg">
              <div>
                <BookOpen className="h-10 w-10 mb-6" />
                <h3 className="text-2xl font-black mb-4">Borderless Blueprint</h3>
                <p className="text-navy/60 group-hover:text-gray-400 text-sm font-medium">Download our definitive 150-page guide to global living and multi-currency wealth creation.</p>
              </div>
              <div className="pt-8 flex items-center font-black">
                Access Library <ArrowRight className="ml-2 h-5 w-5" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-navy mb-4 tracking-tighter">Builders in the Wild</h2>
            <p className="text-gray-600 text-lg">Real experiences from people living the borderless dream.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                quote: "Before Builders Connect, I was tethered. Using the 'Earn Across Borders' roadmap, I transitioned to a remote SAP role and now live tax-efficiently in Dubai. My net income effectively doubled.",
                author: "James T.",
                role: "SAP Architect",
                location: "Dubai, UAE",
                img: "https://i.pravatar.cc/150?u=j"
              },
              {
                quote: "The Cost of Living Matcher saved us. We thought we'd save more in London, but Builders Connect showed us Berlin offered a 15% better surplus for our lifestyle. We've never been happier.",
                author: "Elena & Marc",
                role: "Product Designers",
                location: "Berlin, Germany",
                img: "https://i.pravatar.cc/150?u=e"
              },
              {
                quote: "The 'Grow' pillar changed everything. Moving to Singapore was daunting, but the cultural intelligence tools helped me build a network within months. I feel at home now.",
                author: "Sarah L.",
                role: "FinTech Lead",
                location: "Singapore",
                img: "https://i.pravatar.cc/150?u=s"
              }
            ].map((t, idx) => (
              <div key={idx} className="bg-light p-10 rounded-[3rem] shadow-sm border border-gray-100 flex flex-col relative group hover:bg-white hover:shadow-xl transition-all">
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-teal rounded-2xl flex items-center justify-center shadow-xl group-hover:-rotate-12 transition-transform">
                  <Quote className="h-6 w-6 text-navy" />
                </div>
                <p className="text-gray-600 italic mb-8 leading-relaxed">"{t.quote}"</p>
                <div className="mt-auto flex items-center pt-8 border-t border-gray-200">
                  <div className="w-12 h-12 rounded-full overflow-hidden mr-4 border-2 border-teal shadow-sm">
                    <img src={t.img} alt={t.author} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <div className="font-black text-navy">{t.author}</div>
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{t.role} • {t.location}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Tools Section */}
      <section className="py-24 bg-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Interactive Strategy Tools</h2>
            <p className="text-gray-600 text-xl max-w-3xl mx-auto">Data-driven insights to make smarter decisions about your global life.</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 relative group overflow-hidden rounded-[3rem] bg-navy text-white p-12 flex flex-col justify-between shadow-2xl">
              <div className="absolute top-0 right-0 p-12 opacity-10">
                <TrendingUp className="h-48 w-48" />
              </div>
              <div className="relative z-10">
                <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-teal/20 text-teal border border-teal/30 text-xs font-bold uppercase mb-8">
                  Featured Assessment
                </div>
                <h3 className="text-4xl md:text-5xl font-bold mb-6">Global Readiness <br/>Self-Assessment</h3>
                <p className="text-gray-300 text-lg mb-8 max-w-md">
                  Identify your relocation blind spots across financial, career, and cultural preparedness.
                </p>
                <Link to="/tools/quiz" className="inline-flex items-center bg-teal text-navy font-bold px-8 py-4 rounded-full hover:bg-white transition-all transform group-hover:scale-105">
                  Check Your Score <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </div>
              <div className="mt-12 grid grid-cols-3 gap-4 border-t border-white/10 pt-8">
                <div>
                  <div className="text-2xl font-bold">100%</div>
                  <div className="text-xs text-gray-400">Data-Driven</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">3 Min</div>
                  <div className="text-xs text-gray-400">Total Time</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">Personalized</div>
                  <div className="text-xs text-gray-400">Action Plan</div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {[
                { id: 'col', icon: Calculator, title: 'Cost of Living Matcher', desc: 'Find where your income goes furthest.', color: 'teal' },
                { id: 'visa', icon: Search, title: 'Visa Discovery Tool', desc: 'Match skills with global pathways.', color: 'coral' },
                { id: 'wealth', icon: ShieldCheck, title: 'Wealth Simulator', desc: 'Compare your net worth across tax zones.', color: 'navy' }
              ].map((tool) => (
                <div 
                  key={tool.id} 
                  onClick={() => setActiveTool(tool.id)}
                  className="group p-8 bg-white rounded-[2rem] hover:bg-navy hover:text-white border-2 border-transparent hover:border-navy shadow-sm hover:shadow-xl transition-all cursor-pointer"
                >
                  <div className={`w-12 h-12 rounded-xl bg-${tool.color} flex items-center justify-center mb-6 shadow-md`}>
                    <tool.icon className="h-6 w-6 text-white" />
                  </div>
                  <h4 className="text-xl font-bold mb-2 group-hover:text-teal transition-colors">{tool.title}</h4>
                  <p className="text-sm text-gray-500 group-hover:text-gray-400">{tool.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-navy rounded-[4rem] p-12 md:p-20 text-center shadow-2xl text-white relative overflow-hidden">
            {isSubscribed ? (
              <div className="relative z-10 animate-in zoom-in duration-500">
                <div className="w-20 h-20 bg-teal rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl">
                  <Check className="h-10 w-10 text-navy" />
                </div>
                <h2 className="text-4xl md:text-5xl font-black mb-4">Success!</h2>
                <p className="text-gray-400 text-xl font-medium">Check your inbox for the Borderless Strategy Report.</p>
                <button 
                  onClick={() => setIsSubscribed(false)}
                  className="mt-8 text-teal text-sm font-black uppercase tracking-widest hover:text-white transition-colors"
                >
                  Back to Newsletter
                </button>
              </div>
            ) : (
              <div className="relative z-10">
                <h2 className="text-4xl md:text-5xl font-bold mb-6">The Borderless Briefing</h2>
                <p className="text-gray-400 text-xl mb-10 font-medium max-w-lg mx-auto">Weekly strategy reports, visa updates, and member-only opportunities.</p>
                <form className="flex flex-col sm:flex-row max-w-lg mx-auto gap-4" onSubmit={handleNewsletterSubmit}>
                  <input 
                    type="email" 
                    required
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="Enter your email" 
                    className="flex-grow px-8 py-4 rounded-full bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal"
                  />
                  <button className="bg-teal text-navy font-bold px-10 py-4 rounded-full hover:bg-white transition-all whitespace-nowrap">
                    Join Network
                  </button>
                </form>
              </div>
            )}
            <div className="absolute top-0 right-0 -mt-20 -mr-20 w-64 h-64 bg-teal/10 rounded-full blur-[100px]"></div>
            <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-64 h-64 bg-coral/10 rounded-full blur-[100px]"></div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;