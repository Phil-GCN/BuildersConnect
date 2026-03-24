import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Menu, X, Globe, Search, LayoutDashboard, ChevronDown, 
  Check, LogIn, User as UserIcon, Youtube, Instagram, 
  Music, Video, Twitter, Linkedin 
} from 'lucide-react';
import { RESOURCES, BLOG_POSTS, MOCK_USERS } from '../constants';
import { User } from '../types';

// Mock Auth Context Emulation
const useAuth = () => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('builders_user');
    return saved ? JSON.parse(saved) : null;
  });

  const login = (u: User) => {
    setUser(u);
    localStorage.setItem('builders_user', JSON.stringify(u));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('builders_user');
  };

  return { user, login, logout };
};

const SearchOverlay = ({ query, onClose }: { query: string, onClose: () => void }) => {
  const results = {
    resources: RESOURCES.filter(r => r.title.toLowerCase().includes(query.toLowerCase()) || r.description.toLowerCase().includes(query.toLowerCase())).slice(0, 3),
    blogs: BLOG_POSTS.filter(b => b.title.toLowerCase().includes(query.toLowerCase()) || b.excerpt.toLowerCase().includes(query.toLowerCase())).slice(0, 3),
    tools: ['Quiz', 'Cost of Living', 'Wealth Calculator'].filter(t => t.toLowerCase().includes(query.toLowerCase()))
  };

  const hasResults = results.resources.length > 0 || results.blogs.length > 0 || results.tools.length > 0;

  if (!query) return null;

  return (
    <div className="absolute top-full right-0 mt-4 w-[400px] bg-white rounded-[2rem] shadow-2xl border border-gray-100 overflow-hidden z-[70] animate-in fade-in slide-in-from-top-2 duration-200">
      <div className="p-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
        {!hasResults ? (
          <div className="py-8 text-center">
            <Search className="h-12 w-12 text-gray-200 mx-auto mb-4" />
            <p className="text-gray-500 font-bold">No results found for "{query}"</p>
          </div>
        ) : (
          <div className="space-y-6">
            {results.tools.length > 0 && (
              <div>
                <h4 className="text-[10px] font-black text-teal uppercase tracking-widest mb-3">Tools</h4>
                <div className="space-y-2">
                  {results.tools.map(tool => (
                    <Link 
                      key={tool} 
                      to={tool === 'Quiz' ? '/tools/quiz' : '/tools'} 
                      onClick={onClose}
                      className="block p-3 rounded-xl hover:bg-light transition-colors font-bold text-navy"
                    >
                      {tool}
                    </Link>
                  ))}
                </div>
              </div>
            )}
            
            {results.resources.length > 0 && (
              <div>
                <h4 className="text-[10px] font-black text-teal uppercase tracking-widest mb-3">Resources</h4>
                <div className="space-y-2">
                  {results.resources.map(res => (
                    <Link 
                      key={res.id} 
                      to="/resources" 
                      onClick={onClose}
                      className="block p-3 rounded-xl hover:bg-light transition-colors"
                    >
                      <div className="font-bold text-navy text-sm">{res.title}</div>
                      <div className="text-[10px] text-gray-400 font-bold uppercase">{res.pillar} • {res.format}</div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {results.blogs.length > 0 && (
              <div>
                <h4 className="text-[10px] font-black text-teal uppercase tracking-widest mb-3">Insights</h4>
                <div className="space-y-2">
                  {results.blogs.map(blog => (
                    <Link 
                      key={blog.id} 
                      to="/strategy" 
                      onClick={onClose}
                      className="block p-3 rounded-xl hover:bg-light transition-colors"
                    >
                      <div className="font-bold text-navy text-sm">{blog.title}</div>
                      <div className="text-[10px] text-gray-400 font-bold uppercase">{blog.date}</div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const CustomSelect = ({ options, value, onChange, label }: { options: string[], value: string, onChange: (v: string) => void, label: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={containerRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 text-gray-500 hover:text-white transition-colors text-xs font-black uppercase tracking-widest"
      >
        <span>{value}</span>
        <ChevronDown className={`h-3 w-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="absolute bottom-full mb-2 right-0 bg-white rounded-xl shadow-xl border border-gray-100 py-2 w-32 overflow-hidden z-50">
          {options.map(opt => (
            <button
              key={opt}
              onClick={() => { onChange(opt); setIsOpen(false); }}
              className="w-full text-left px-4 py-2 text-[10px] font-black text-navy hover:bg-light flex justify-between items-center"
            >
              {opt}
              {value === opt && <Check className="h-3 w-3 text-teal" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { user, login, logout } = useAuth();
  const location = useLocation();
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
    setIsSearchVisible(false);
    setSearchQuery('');
  }, [location]);

  const navLinks = [
    { name: 'Strategy', path: '/strategy' },
    { name: 'Resources', path: '/resources' },
    { name: 'Tools', path: '/tools' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' }
  ];

  return (
    <nav 
      className={`fixed w-full z-50 transition-all duration-500 ${isScrolled ? 'bg-white shadow-xl py-2' : 'bg-transparent py-5'}`}
      aria-label="Global navigation"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2 group">
            <Globe className={`h-9 w-9 group-hover:rotate-45 transition-transform duration-500 ${!isScrolled && location.pathname === '/stories' ? 'text-teal' : 'text-teal'}`} />
            <span className={`text-2xl font-black tracking-tighter uppercase ${!isScrolled && location.pathname === '/stories' ? 'text-white' : 'text-navy'}`}>Builders Connect</span>
          </Link>

          <div className="hidden lg:flex items-center space-x-10">
            {navLinks.map((link) => (
              <Link 
                key={link.name}
                to={link.path} 
                className={`text-sm font-black transition-all hover:text-teal py-4 ${
                  location.pathname === link.path 
                    ? 'text-teal' 
                    : (!isScrolled && location.pathname === '/stories' ? 'text-white' : 'text-navy')
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="hidden lg:flex items-center space-x-6 relative">
            <div className={`flex items-center bg-light rounded-2xl transition-all duration-300 ${isSearchVisible ? 'w-64 pr-4' : 'w-10 overflow-hidden'}`}>
              <button 
                onClick={() => {
                  setIsSearchVisible(!isSearchVisible);
                  if (!isSearchVisible) setTimeout(() => searchInputRef.current?.focus(), 100);
                }}
                className="p-2.5 hover:bg-gray-100 cursor-pointer transition-colors"
              >
                <Search className="h-5 w-5 text-gray-500" />
              </button>
              <input 
                ref={searchInputRef}
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="bg-transparent border-none focus:ring-0 text-sm font-bold w-full"
              />
            </div>
            
            <SearchOverlay query={searchQuery} onClose={() => { setSearchQuery(''); setIsSearchVisible(false); }} />

            {user ? (
              <div className="flex items-center space-x-4">
                <Link to="/portal" className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-teal to-coral rounded-full blur opacity-30 group-hover:opacity-60 transition duration-1000 group-hover:duration-200"></div>
                  <div className="relative bg-navy text-white px-8 py-3.5 rounded-full text-sm font-black flex items-center shadow-lg hover:scale-[1.03] active:scale-[0.98] transition-all">
                    <LayoutDashboard className="mr-2 h-4 w-4 text-teal" />
                    Portal
                  </div>
                </Link>
                <button onClick={() => logout()} className="text-navy/50 hover:text-coral transition-colors">
                  <X className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setIsAuthModalOpen(true)}
                className="bg-navy text-white px-8 py-3.5 rounded-full text-sm font-black flex items-center shadow-lg hover:bg-teal transition-all"
              >
                <LogIn className="mr-2 h-4 w-4" />
                Sign In
              </button>
            )}
          </div>

          <div className="lg:hidden flex items-center">
            <button 
              onClick={() => setIsOpen(!isOpen)} 
              className="text-navy p-3 bg-light rounded-2xl active:scale-95 transition-transform"
              aria-expanded={isOpen}
            >
              {isOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
            </button>
          </div>
        </div>
      </div>

      {/* Auth Simulation Modal */}
      {isAuthModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-navy/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-[3rem] p-12 max-md w-full shadow-2xl relative">
            <button onClick={() => setIsAuthModalOpen(false)} className="absolute top-8 right-8 text-gray-400 hover:text-navy">
              <X className="h-6 w-6" />
            </button>
            <h2 className="text-3xl font-black text-navy mb-8 text-center">Select Role (Demo)</h2>
            <div className="space-y-4">
              {MOCK_USERS.map(u => (
                <button
                  key={u.id}
                  onClick={() => { login(u); setIsAuthModalOpen(false); }}
                  className="w-full flex items-center p-4 bg-light rounded-2xl hover:bg-teal hover:text-white transition-all group"
                >
                  <img src={u.avatar} className="w-12 h-12 rounded-full mr-4 border-2 border-white" alt="" />
                  <div className="text-left">
                    <div className="font-bold">{u.name}</div>
                    <div className="text-xs opacity-60 group-hover:opacity-100 uppercase tracking-widest">{u.role}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {isOpen && (
        <div className="lg:hidden fixed inset-0 top-[88px] bg-white z-[100] overflow-y-auto pb-20 animate-in slide-in-from-top duration-500">
          <div className="px-6 py-8 space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`block text-3xl font-black tracking-tighter py-4 px-4 rounded-3xl ${location.pathname === link.path ? 'text-teal bg-light' : 'text-navy'}`}
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            
            <div className="pt-10 space-y-5">
              <Link 
                to={user ? "/portal" : "/tools/quiz"}
                onClick={() => setIsOpen(false)} 
                className="flex items-center justify-center w-full py-6 bg-navy text-white text-xl font-black rounded-[2.5rem] shadow-2xl shadow-navy/20 active:scale-[0.97] transition-all"
              >
                {user ? "Access Dashboard" : "Start Here"}
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

const Footer = () => {
  const [lang, setLang] = useState('English');
  const [currency, setCurrency] = useState('USD ($)');

  const socialPlatforms = [
    { name: 'YouTube', icon: Youtube, color: 'hover:bg-teal', url: 'https://youtube.com' },
    { name: 'Spotify', icon: Music, color: 'hover:bg-coral', url: 'https://spotify.com' },
    { name: 'Instagram', icon: Instagram, color: 'hover:bg-teal', url: 'https://instagram.com' },
    { name: 'TikTok', icon: Video, color: 'hover:bg-coral', url: 'https://tiktok.com' }
  ];

  return (
    <footer className="bg-navy text-white pt-24 pb-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-12 mb-20">
          <div className="col-span-2">
            <Link to="/" className="flex items-center space-x-2 mb-8">
              <Globe className="h-10 w-10 text-teal" />
              <span className="text-3xl font-black tracking-tight uppercase">Builders Connect</span>
            </Link>
            <p className="text-gray-400 max-w-sm mb-10 leading-relaxed text-lg">
              Empowering ambitious people to design lives beyond default settings—through practical strategies for mobility, wealth creation, and personal evolution.
            </p>
            <div className="flex space-x-5">
              {socialPlatforms.map(platform => (
                <a 
                  key={platform.name} 
                  href={platform.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={platform.name}
                  className={`w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center transition-all cursor-pointer group ${platform.color}`}
                >
                  <platform.icon className="h-5 w-5 text-gray-400 group-hover:text-navy transition-colors" />
                </a>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-extrabold text-lg mb-8">Strategy</h4>
            <ul className="space-y-4 text-gray-400 font-medium">
              <li><Link to="/strategy?tab=Live" className="hover:text-teal transition-colors">Live Abroad</Link></li>
              <li><Link to="/strategy?tab=Earn" className="hover:text-teal transition-colors">Earn Global</Link></li>
              <li><Link to="/strategy?tab=Grow" className="hover:text-teal transition-colors">Grow Mindset</Link></li>
              <li><Link to="/tools" className="hover:text-teal transition-colors">Calculators</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-extrabold text-lg mb-8">Network</h4>
            <ul className="space-y-4 text-gray-400 font-medium">
              <li><Link to="/community" className="hover:text-teal transition-colors">Community Feed</Link></li>
              <li><Link to="/stories" className="hover:text-teal transition-colors">Builder Stories</Link></li>
              <li><Link to="/donate" className="hover:text-teal transition-colors">Donate & Support</Link></li>
              <li><Link to="/resources" className="hover:text-teal transition-colors">Resource Library</Link></li>
              <li><Link to="/about" className="hover:text-teal transition-colors">About Us</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-extrabold text-lg mb-8">Legal</h4>
            <ul className="space-y-4 text-gray-400 font-medium">
              <li><Link to="#" className="hover:text-teal transition-colors">Privacy Policy</Link></li>
              <li><Link to="#" className="hover:text-teal transition-colors">Terms of Use</Link></li>
              <li><Link to="#" className="hover:text-teal transition-colors">Cookie Policy</Link></li>
            </ul>
          </div>
        </div>
        <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-sm font-medium text-gray-500">
          <p>© 2024 Builders Connect. Built for the ambitious.</p>
          <div className="flex space-x-8 mt-6 md:mt-0">
            <CustomSelect 
              options={['English', 'French', 'German', 'Spanish']} 
              value={lang} 
              onChange={setLang} 
              label="Language" 
            />
            <CustomSelect 
              options={['USD ($)', 'EUR (€)', 'GBP (£)', 'AED (د.إ)']} 
              value={currency} 
              onChange={setCurrency} 
              label="Currency" 
            />
          </div>
        </div>
      </div>
    </footer>
  );
};

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
};