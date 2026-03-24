import React, { useState, useMemo, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { 
  Users, BookOpen, Settings, BarChart3, Shield, 
  User as UserIcon, Plus, Edit2, Trash2, 
  ArrowUpRight, CheckCircle2, AlertCircle, FileText,
  Globe, Search, Filter, X, Save, Camera, MapPin,
  Lock, MessageSquare, Heart, Mail, Sparkles, Send, Zap,
  ExternalLink, RotateCcw, Brain, TrendingUp
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { GoogleGenAI, Type } from "@google/genai";
import { MOCK_USERS, RESOURCES, BLOG_POSTS, MOCK_PERMISSIONS, COMMUNITY_POSTS } from '../constants';
import { User, Resource, Permission, CommunityPost, NewsletterSuggestion } from '../types';

const ANALYTICS_DATA = [
  { name: 'Jan', users: 400, resources: 240, quizzes: 150 },
  { name: 'Feb', users: 600, resources: 320, quizzes: 210 },
  { name: 'Mar', users: 800, resources: 450, quizzes: 290 },
  { name: 'Apr', users: 1100, resources: 510, quizzes: 420 },
  { name: 'May', users: 1402, resources: 680, quizzes: 580 },
];

const Portal = () => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('builders_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [activeTab, setActiveTab] = useState('Overview');
  
  // CMS & Newsletter States
  const [isAiSuggesting, setIsAiSuggesting] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<NewsletterSuggestion[]>([]);
  const [selectedSuggestion, setSelectedSuggestion] = useState<NewsletterSuggestion | null>(null);
  const [newsletterContent, setNewsletterContent] = useState('');
  const [newsletterSubject, setNewsletterSubject] = useState('');
  const [isDrafting, setIsDrafting] = useState(false);
  
  // Back Office States
  const [localResources, setLocalResources] = useState<Resource[]>(() => {
    const saved = localStorage.getItem('builders_resources');
    return saved ? JSON.parse(saved) : RESOURCES;
  });

  useEffect(() => {
    localStorage.setItem('builders_resources', JSON.stringify(localResources));
  }, [localResources]);

  const [contentSearch, setContentSearch] = useState('');
  const [contentPillarFilter, setContentPillarFilter] = useState('All');
  const [editingResource, setEditingResource] = useState<Resource | null>(null);
  const [isAddingResource, setIsAddingResource] = useState(false);
  const [newResourceForm, setNewResourceForm] = useState<Partial<Resource>>({
    title: '',
    description: '',
    pillar: 'Live',
    format: 'Guide',
    price: 'Free',
    tags: [],
    thumbnail: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=800',
    rating: 4.8
  });

  // Admin States
  const [permissions, setPermissions] = useState<Permission[]>(() => {
    const saved = localStorage.getItem('builders_permissions');
    return saved ? JSON.parse(saved) : MOCK_PERMISSIONS;
  });

  // Member States
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState<Partial<User>>(user || {});

  // Initialize Gemini for AI CMS
  const ai = useMemo(() => new GoogleGenAI({ apiKey: process.env.API_KEY }), []);

  if (!user) return <Navigate to="/" />;

  const isPermissionEnabled = (permId: string) => {
    const perm = permissions.find(p => p.id === permId);
    return perm ? perm.enabled : false;
  };

  const savePermissions = (newPerms: Permission[]) => {
    setPermissions(newPerms);
    localStorage.setItem('builders_permissions', JSON.stringify(newPerms));
  };

  const handleUpdateUser = (updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem('builders_user', JSON.stringify(updatedUser));
  };

  // --- AI Newsletter Functions ---
  const generateNewsletterSuggestions = async () => {
    setIsAiSuggesting(true);
    setAiSuggestions([]);
    try {
      const prompt = `Search for the most recent trending topics (visa changes, tax law updates, digital nomad hubs, global career trends like SAP hiring surges) relevant for Builders and ambitious people in May 2024. Provide 3 specific newsletter topic suggestions. Each suggestion must include: 1. A catchy topic name. 2. A reason why it's trending. 3. Links to sources.`;
      
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt,
        config: {
          tools: [{ googleSearch: {} }],
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                topic: { type: Type.STRING },
                reason: { type: Type.STRING },
                sources: {
                   type: Type.ARRAY,
                   items: {
                     type: Type.OBJECT,
                     properties: {
                       title: { type: Type.STRING },
                       uri: { type: Type.STRING }
                     }
                   }
                }
              },
              required: ["topic", "reason", "sources"]
            }
          }
        }
      });

      const jsonStr = response.text.trim();
      const data = JSON.parse(jsonStr);
      setAiSuggestions(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAiSuggesting(false);
    }
  };

  const draftNewsletterWithAi = async (suggestion: NewsletterSuggestion) => {
    setIsDrafting(true);
    setNewsletterContent('');
    setSelectedSuggestion(suggestion);
    try {
      const prompt = `Write a high-converting, professional, and engaging email newsletter for "Builders Connect" about the topic: "${suggestion.topic}". Focus on current context: ${suggestion.reason}. Include sections for: Introduction, Strategy Breakdown, Resource of the week, and a Call to Action. Use a sophisticated yet accessible tone. Use Markdown for formatting.`;
      
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt
      });
      
      setNewsletterSubject(`Builders Weekly: ${suggestion.topic}`);
      setNewsletterContent(response.text || '');
    } catch (err) {
      console.error(err);
    } finally {
      setIsDrafting(false);
    }
  };

  const renderSidebar = () => {
    const canAccessNewsletter = isPermissionEnabled('p5') || user.role === 'ADMIN';
    
    const menuItems = {
      ADMIN: [
        { name: 'Overview', icon: BarChart3 },
        { name: 'User Management', icon: Users },
        { name: 'Newsletter Studio', icon: Mail, access: 'p5' },
        { name: 'Permissions', icon: Shield },
        { name: 'Settings', icon: Settings },
      ],
      BACK_OFFICE: [
        { name: 'Content Hub', icon: BookOpen },
        { name: 'Newsletter Studio', icon: Mail, access: 'p5' },
        { name: 'Analytics', icon: BarChart3 },
        { name: 'Support Tickets', icon: AlertCircle },
      ],
      MEMBER: [
        { name: 'Overview', icon: Globe },
        { name: 'Community Feed', icon: MessageSquare },
        { name: 'My Journey', icon: UserIcon },
        { name: 'Saved Assets', icon: BookOpen },
        { name: 'Plan Status', icon: CheckCircle2 },
      ]
    };

    return (
      <div className="w-72 bg-navy text-white p-8 flex flex-col sticky top-[88px] h-[calc(100vh-88px)] shrink-0 z-40 shadow-2xl">
        <div className="mb-12">
          <img src={user.avatar} className="w-20 h-20 rounded-3xl mb-4 border-2 border-teal object-cover shadow-lg" alt="" />
          <h3 className="font-black text-xl leading-tight">{user.name}</h3>
          <p className="text-teal text-xs font-black uppercase tracking-widest">{user.role.replace('_', ' ')}</p>
        </div>
        
        <nav className="space-y-2 flex-grow overflow-y-auto custom-scrollbar">
          {menuItems[user.role].map(item => {
             // If item has access requirement, check it
             if (item.access && !isPermissionEnabled(item.access) && user.role !== 'ADMIN') return null;
             
             return (
               <button
                 key={item.name}
                 onClick={() => setActiveTab(item.name)}
                 className={`w-full flex items-center p-4 rounded-2xl font-bold transition-all ${
                   activeTab === item.name ? 'bg-teal text-navy shadow-lg shadow-teal/20' : 'hover:bg-white/5 text-gray-400'
                 }`}
               >
                 <item.icon className="h-5 w-5 mr-3" />
                 {item.name}
               </button>
             );
          })}
        </nav>

        <button 
          onClick={() => { localStorage.removeItem('builders_user'); window.location.href = '/'; }}
          className="mt-8 p-4 bg-coral/10 text-coral rounded-2xl font-bold hover:bg-coral hover:text-white transition-all text-center"
        >
          Logout
        </button>
      </div>
    );
  };

  const renderNewsletterStudio = () => {
    return (
      <div className="space-y-12 animate-in fade-in duration-500">
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-4xl font-black text-navy mb-2 tracking-tighter">Newsletter Studio</h2>
            <p className="text-gray-500">Compose and generate community briefings using AI-powered search trends.</p>
          </div>
          <button 
            onClick={generateNewsletterSuggestions}
            disabled={isAiSuggesting}
            className="bg-navy text-white px-8 py-4 rounded-full font-black text-xs uppercase flex items-center shadow-lg hover:bg-teal transition-all disabled:opacity-50"
          >
            {isAiSuggesting ? <RotateCcw className="h-4 w-4 mr-2 animate-spin" /> : <Sparkles className="h-4 w-4 mr-2 text-teal" />}
            {isAiSuggesting ? 'Analyzing Trends...' : 'Brainstorm with AI'}
          </button>
        </div>

        {/* Suggestion Grid */}
        {aiSuggestions.length > 0 && !newsletterContent && (
          <div className="grid md:grid-cols-3 gap-6 animate-in slide-in-from-bottom-4 duration-500">
            {aiSuggestions.map((s, idx) => (
              <div key={idx} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all flex flex-col group">
                <div className="w-12 h-12 bg-teal/10 rounded-2xl flex items-center justify-center mb-6">
                  <TrendingUp className="h-6 w-6 text-teal" />
                </div>
                <h4 className="text-xl font-black text-navy mb-4 leading-tight">{s.topic}</h4>
                <p className="text-gray-500 text-sm mb-6 flex-grow leading-relaxed">{s.reason}</p>
                <div className="space-y-2 mb-8">
                  {s.sources.slice(0, 2).map((src, i) => (
                    <a key={i} href={src.uri} target="_blank" className="flex items-center text-[10px] font-bold text-gray-400 hover:text-teal">
                      <ExternalLink className="h-3 w-3 mr-1.5" /> {src.title}
                    </a>
                  ))}
                </div>
                <button 
                  onClick={() => draftNewsletterWithAi(s)}
                  className="w-full py-4 bg-light text-navy font-black text-xs uppercase tracking-widest rounded-xl hover:bg-navy hover:text-white transition-all"
                >
                  Draft Newsletter
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Editor Area */}
        {(newsletterContent || isDrafting) && (
          <div className="grid lg:grid-cols-3 gap-8 animate-in fade-in duration-700">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100">
                <div className="mb-8 space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Subject Line</label>
                    <input 
                      type="text" 
                      value={newsletterSubject}
                      onChange={(e) => setNewsletterSubject(e.target.value)}
                      placeholder="Enter subject..." 
                      className="w-full bg-light border-none rounded-2xl px-6 py-4 font-bold text-navy focus:ring-2 focus:ring-teal"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Content (Markdown)</label>
                  <div className="relative">
                    {isDrafting && (
                      <div className="absolute inset-0 bg-white/50 backdrop-blur-sm flex items-center justify-center rounded-2xl z-10">
                        <div className="text-center">
                          <Brain className="h-10 w-10 text-teal animate-pulse mx-auto mb-4" />
                          <p className="font-black text-navy text-xs uppercase tracking-widest">Drafting Strategy...</p>
                        </div>
                      </div>
                    )}
                    <textarea 
                      rows={20}
                      value={newsletterContent}
                      onChange={(e) => setNewsletterContent(e.target.value)}
                      className="w-full bg-light border-none rounded-2xl px-8 py-8 font-medium text-navy focus:ring-2 focus:ring-teal custom-scrollbar leading-relaxed"
                      placeholder="Start writing or generate a draft with AI..."
                    />
                  </div>
                </div>

                <div className="mt-8 flex justify-between">
                  <button className="flex items-center text-xs font-black text-gray-400 hover:text-navy transition-all" onClick={() => setNewsletterContent('')}>
                    <X className="h-4 w-4 mr-2" /> Discard Draft
                  </button>
                  <div className="flex gap-4">
                    <button className="bg-light text-navy px-8 py-4 rounded-full font-black text-xs uppercase tracking-widest hover:bg-gray-200 transition-all">
                      Save Draft
                    </button>
                    <button className="bg-teal text-navy px-10 py-4 rounded-full font-black text-xs uppercase tracking-widest shadow-xl shadow-teal/20 hover:scale-105 transition-all">
                      Send to 50k+ Members
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-1 space-y-6">
              <div className="bg-navy rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl">
                 <h3 className="text-xl font-black mb-4">Newsletter DNA</h3>
                 <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10">
                       <span className="text-xs font-bold text-gray-400">Total Subscribers</span>
                       <span className="font-black text-teal">52,192</span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10">
                       <span className="text-xs font-bold text-gray-400">Avg. Open Rate</span>
                       <span className="font-black text-coral">42.1%</span>
                    </div>
                 </div>
                 <div className="mt-10 pt-10 border-t border-white/5">
                    <h4 className="text-[10px] font-black uppercase text-gray-500 tracking-widest mb-4">Editor Tip</h4>
                    <p className="text-xs text-gray-300 leading-relaxed italic">"Always focus on actionable tax or visa data. Members value utility over lifestyle inspiration."</p>
                 </div>
              </div>

              {selectedSuggestion && (
                <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm">
                   <h4 className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-4">Reference Context</h4>
                   <p className="text-xs font-bold text-navy mb-4 leading-relaxed">{selectedSuggestion.reason}</p>
                   <div className="space-y-2">
                     {selectedSuggestion.sources.map((s, i) => (
                       <a key={i} href={s.uri} target="_blank" className="block p-3 bg-light rounded-xl text-[10px] font-bold text-gray-500 hover:text-teal transition-all overflow-hidden text-ellipsis whitespace-nowrap">
                         {s.title}
                       </a>
                     ))}
                   </div>
                </div>
              )}
            </div>
          </div>
        )}

        {aiSuggestions.length === 0 && !newsletterContent && !isAiSuggesting && (
          <div className="bg-white rounded-[4rem] p-32 text-center border border-dashed border-gray-200">
             <Mail className="h-16 w-16 text-gray-100 mx-auto mb-6" />
             <h3 className="text-2xl font-black text-navy mb-4">Studio Idle</h3>
             <p className="text-gray-500 max-w-md mx-auto">Use the AI Strategist to discover global trends or manually start a new briefing for our community.</p>
          </div>
        )}
      </div>
    );
  };

  /**
   * Fix: Implement the missing 'renderAnalyticsView' function which provides 
   * a dashboard of system growth and engagement metrics.
   */
  const renderAnalyticsView = () => (
    <div className="space-y-12 animate-in fade-in duration-500">
      <div>
        <h2 className="text-4xl font-black text-navy mb-2 tracking-tighter">System Analytics</h2>
        <p className="text-gray-500">Real-time performance metrics for the Builders Connect platform.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
          <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Total Users</h4>
          <div className="text-4xl font-black text-navy mb-2">14,202</div>
          <div className="text-teal text-xs font-bold flex items-center">
            <TrendingUp className="h-3 w-3 mr-1" /> +12% this month
          </div>
        </div>
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
          <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Resource Downloads</h4>
          <div className="text-4xl font-black text-navy mb-2">45,100</div>
          <div className="text-teal text-xs font-bold flex items-center">
            <TrendingUp className="h-3 w-3 mr-1" /> +8% this month
          </div>
        </div>
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
          <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Quizzes Completed</h4>
          <div className="text-4xl font-black text-navy mb-2">8,290</div>
          <div className="text-coral text-xs font-bold flex items-center">
             -2% this month
          </div>
        </div>
      </div>

      <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100">
        <h4 className="text-xl font-bold text-navy mb-8">User Growth (Last 5 Months)</h4>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={ANALYTICS_DATA}>
              <defs>
                <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00BFA6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#00BFA6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} />
              <Tooltip />
              <Area type="monotone" dataKey="users" stroke="#00BFA6" strokeWidth={4} fillOpacity={1} fill="url(#colorUsers)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );

  const renderAdminView = () => {
    switch (activeTab) {
      case 'Newsletter Studio':
        return renderNewsletterStudio();
      case 'Permissions':
        return (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div>
              <h2 className="text-4xl font-black text-navy mb-2 tracking-tighter">Access Control</h2>
              <p className="text-gray-500">Configure global permissions and granular back-office editor access.</p>
            </div>
            <div className="grid gap-4">
              {permissions.map(p => (
                <div key={p.id} className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition-all">
                  <div className="flex items-center space-x-6">
                    <div className={`p-4 rounded-2xl ${p.enabled ? 'bg-teal/10 text-teal' : 'bg-gray-100 text-gray-400'}`}>
                      <Shield className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-navy">{p.name}</h4>
                      <p className="text-xs text-gray-400">{p.description}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => savePermissions(permissions.map(perm => perm.id === p.id ? {...perm, enabled: !perm.enabled} : perm))}
                    className={`px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                      p.enabled ? 'bg-navy text-white' : 'bg-gray-100 text-gray-400'
                    }`}
                  >
                    {p.enabled ? 'Active' : 'Restricted'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        );
      case 'User Management':
        return (
          <div className="space-y-8">
            <div className="flex justify-between items-end">
              <div>
                <h2 className="text-4xl font-black text-navy mb-2 tracking-tighter">User Management</h2>
                <p className="text-gray-500">Manage {MOCK_USERS.length} active platform members and assign roles.</p>
              </div>
              <button className="bg-teal text-navy px-8 py-4 rounded-full font-black text-xs uppercase flex items-center shadow-lg hover:scale-105 transition-all">
                <Plus className="h-4 w-4 mr-2" /> Add User
              </button>
            </div>
            <div className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm border border-gray-100">
              <table className="w-full text-left">
                <thead className="bg-light border-b border-gray-100">
                  <tr>
                    <th className="p-6 text-[10px] font-black uppercase text-gray-400">User</th>
                    <th className="p-6 text-[10px] font-black uppercase text-gray-400">Primary Role</th>
                    <th className="p-6 text-[10px] font-black uppercase text-gray-400">Editor Access</th>
                    <th className="p-6 text-[10px] font-black uppercase text-gray-400">Status</th>
                    <th className="p-6 text-[10px] font-black uppercase text-gray-400">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {MOCK_USERS.map(u => (
                    <tr key={u.id} className="border-b border-gray-50 last:border-0 hover:bg-light/50 transition-colors">
                      <td className="p-6 flex items-center">
                        <img src={u.avatar} className="w-10 h-10 rounded-xl mr-4 object-cover" alt="" />
                        <div>
                          <div className="font-bold text-navy">{u.name}</div>
                          <div className="text-xs text-gray-400">{u.email}</div>
                        </div>
                      </td>
                      <td className="p-6">
                        <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase ${
                          u.role === 'ADMIN' ? 'bg-navy text-white' : u.role === 'BACK_OFFICE' ? 'bg-teal/10 text-teal' : 'bg-gray-100 text-gray-500'
                        }`}>
                          {u.role.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="p-6">
                        {u.role !== 'MEMBER' && (
                          <div className="flex items-center">
                            <input 
                              type="checkbox" 
                              checked={u.accesses.includes('p5')} 
                              className="w-4 h-4 rounded border-gray-300 text-teal focus:ring-teal"
                            />
                            <span className="ml-2 text-xs font-bold text-gray-500">Editor</span>
                          </div>
                        )}
                      </td>
                      <td className="p-6">
                        <div className="flex items-center text-xs font-bold text-teal">
                          <CheckCircle2 className="h-4 w-4 mr-1" /> Active
                        </div>
                      </td>
                      <td className="p-6">
                        <div className="flex space-x-2">
                          <button className="p-3 bg-light rounded-xl hover:bg-teal hover:text-white transition-all shadow-sm"><Edit2 className="h-4 w-4" /></button>
                          <button className="p-3 bg-light rounded-xl hover:bg-coral hover:text-white transition-all shadow-sm"><Trash2 className="h-4 w-4" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      default:
        return renderAnalyticsView();
    }
  };

  const renderBackOfficeView = () => {
    if (activeTab === 'Analytics') return renderAnalyticsView();
    if (activeTab === 'Newsletter Studio') return renderNewsletterStudio();

    const filtered = localResources.filter(res => {
        const matchesSearch = res.title.toLowerCase().includes(contentSearch.toLowerCase());
        const matchesPillar = contentPillarFilter === 'All' || res.pillar === contentPillarFilter;
        return matchesSearch && matchesPillar;
    });

    const isEditAllowed = isPermissionEnabled('p2');

    return (
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="flex justify-between items-end flex-wrap gap-6">
          <div>
            <h2 className="text-4xl font-black text-navy mb-2 tracking-tighter">Content Hub</h2>
            <p className="text-gray-500">Modify global resources, guides, and tools for our community.</p>
          </div>
          <div className="flex gap-4">
              <div className="relative group">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input 
                    type="text" 
                    placeholder="Search assets..."
                    value={contentSearch}
                    onChange={(e) => setContentSearch(e.target.value)}
                    className="pl-12 pr-6 py-4 bg-white rounded-2xl border border-gray-100 focus:ring-2 focus:ring-teal outline-none w-64 shadow-sm font-bold"
                  />
              </div>
              <div className="relative group">
                  <Filter className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <select 
                    value={contentPillarFilter}
                    onChange={(e) => setContentPillarFilter(e.target.value)}
                    className="pl-12 pr-10 py-4 bg-white rounded-2xl border border-gray-100 focus:ring-2 focus:ring-teal outline-none appearance-none font-black text-[10px] uppercase text-navy shadow-sm"
                  >
                      <option value="All">All Pillars</option>
                      <option value="Live">Live</option>
                      <option value="Earn">Earn</option>
                      <option value="Grow">Grow</option>
                  </select>
              </div>
              <button 
                onClick={() => setIsAddingResource(true)}
                className="bg-navy text-white px-10 py-4 rounded-full font-black text-xs uppercase flex items-center shadow-lg hover:scale-105 transition-all"
              >
                <Plus className="h-4 w-4 mr-2" /> New Asset
              </button>
          </div>
        </div>

        <div className="grid gap-6">
          {filtered.map(res => (
            <div key={res.id} className="bg-white p-8 rounded-[3rem] shadow-sm border border-gray-100 flex items-center gap-10 hover:shadow-xl transition-all group">
              <img src={res.thumbnail} className="w-32 h-32 rounded-3xl object-cover grayscale group-hover:grayscale-0 transition-all duration-500 shadow-sm" alt="" />
              <div className="flex-grow">
                <div className="flex items-center space-x-3 mb-2">
                  <span className="bg-light px-2 py-0.5 rounded text-[10px] font-black text-navy uppercase">{res.pillar}</span>
                  <span className="bg-teal text-white px-2 py-0.5 rounded text-[10px] font-black uppercase">{res.format}</span>
                </div>
                <h4 className="text-2xl font-bold text-navy">{res.title}</h4>
                <p className="text-gray-500 text-sm line-clamp-1 mb-2 font-medium">{res.description}</p>
                <div className="flex flex-wrap gap-2">
                    {res.tags.map(t => <span key={t} className="text-[9px] font-black text-gray-400 uppercase tracking-widest">#{t}</span>)}
                </div>
              </div>
              <div className="flex space-x-3">
                {isEditAllowed ? (
                    <>
                        <button 
                            onClick={() => setEditingResource(res)}
                            className="bg-light p-5 rounded-2xl hover:bg-navy hover:text-white transition-all shadow-sm"
                        >
                            <Edit2 className="h-5 w-5" />
                        </button>
                        <button 
                            onClick={() => {
                                if (window.confirm('Are you sure you want to delete this resource?')) {
                                    setLocalResources(localResources.filter(r => r.id !== res.id));
                                }
                            }}
                            className="bg-light p-5 rounded-2xl hover:bg-coral hover:text-white transition-all shadow-sm"
                        >
                            <Trash2 className="h-5 w-5" />
                        </button>
                    </>
                ) : (
                    <div className="p-5 bg-gray-50 text-gray-300 rounded-2xl border border-dashed border-gray-200" title="Editing Restricted">
                        <Lock className="h-5 w-5" />
                    </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Edit Resource Modal */}
        {editingResource && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-navy/80 backdrop-blur-sm animate-in fade-in duration-300">
                <div className="bg-white rounded-[3rem] p-12 max-w-2xl w-full shadow-2xl relative max-h-[90vh] overflow-y-auto">
                    <button onClick={() => setEditingResource(null)} className="absolute top-10 right-10 text-gray-400 hover:text-navy transition-colors">
                        <X className="h-6 w-6" />
                    </button>
                    <h2 className="text-3xl font-black text-navy mb-8 tracking-tighter">Edit Resource</h2>
                    <form className="space-y-6" onSubmit={(e) => {
                        e.preventDefault();
                        setLocalResources(localResources.map(r => r.id === editingResource.id ? editingResource : r));
                        setEditingResource(null);
                    }}>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Asset Title</label>
                            <input 
                                type="text"
                                className="w-full bg-light rounded-2xl px-6 py-4 font-bold border-none focus:ring-2 focus:ring-teal outline-none"
                                value={editingResource.title}
                                onChange={e => setEditingResource({...editingResource, title: e.target.value})}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Description</label>
                            <textarea 
                                rows={3}
                                className="w-full bg-light rounded-2xl px-6 py-4 font-bold border-none focus:ring-2 focus:ring-teal outline-none"
                                value={editingResource.description}
                                onChange={e => setEditingResource({...editingResource, description: e.target.value})}
                                required
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Price (USD)</label>
                                <input 
                                    type="text"
                                    className="w-full bg-light rounded-2xl px-6 py-4 font-bold border-none focus:ring-2 focus:ring-teal outline-none"
                                    value={editingResource.price}
                                    onChange={e => setEditingResource({...editingResource, price: e.target.value === 'Free' ? 'Free' : Number(e.target.value) || 0})}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Pillar</label>
                                <select 
                                    className="w-full bg-light rounded-2xl px-6 py-4 font-bold border-none focus:ring-2 focus:ring-teal outline-none appearance-none"
                                    value={editingResource.pillar}
                                    onChange={e => setEditingResource({...editingResource, pillar: e.target.value as any})}
                                >
                                    <option value="Live">Live</option>
                                    <option value="Earn">Earn</option>
                                    <option value="Grow">Grow</option>
                                </select>
                            </div>
                        </div>
                        <button type="submit" className="w-full bg-navy text-white py-6 rounded-full font-black text-xl shadow-xl hover:bg-teal transition-all active:scale-95">
                            Save Changes
                        </button>
                    </form>
                </div>
            </div>
        )}

        {/* Add Resource Modal */}
        {isAddingResource && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-navy/80 backdrop-blur-sm animate-in fade-in duration-300">
                <div className="bg-white rounded-[3rem] p-12 max-w-2xl w-full shadow-2xl relative max-h-[90vh] overflow-y-auto">
                    <button onClick={() => setIsAddingResource(false)} className="absolute top-10 right-10 text-gray-400 hover:text-navy transition-colors">
                        <X className="h-6 w-6" />
                    </button>
                    <h2 className="text-3xl font-black text-navy mb-8 tracking-tighter">New Community Asset</h2>
                    <form className="space-y-6" onSubmit={(e) => {
                        e.preventDefault();
                        const id = (localResources.length + 1).toString();
                        setLocalResources([...localResources, { ...newResourceForm, id } as Resource]);
                        setIsAddingResource(false);
                        setNewResourceForm({
                            title: '',
                            description: '',
                            pillar: 'Live',
                            format: 'Guide',
                            price: 'Free',
                            tags: [],
                            thumbnail: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=800',
                            rating: 4.8
                        });
                    }}>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Asset Title</label>
                            <input 
                                type="text"
                                className="w-full bg-light rounded-2xl px-6 py-4 font-bold border-none focus:ring-2 focus:ring-teal outline-none"
                                value={newResourceForm.title}
                                onChange={e => setNewResourceForm({...newResourceForm, title: e.target.value})}
                                placeholder="e.g. Dubai Relocation Blueprint"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Description</label>
                            <textarea 
                                rows={3}
                                className="w-full bg-light rounded-2xl px-6 py-4 font-bold border-none focus:ring-2 focus:ring-teal outline-none"
                                value={newResourceForm.description}
                                onChange={e => setNewResourceForm({...newResourceForm, description: e.target.value})}
                                placeholder="What will members learn?"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Format</label>
                                <select 
                                    className="w-full bg-light rounded-2xl px-6 py-4 font-bold border-none focus:ring-2 focus:ring-teal outline-none appearance-none"
                                    value={newResourceForm.format}
                                    onChange={e => setNewResourceForm({...newResourceForm, format: e.target.value as any})}
                                >
                                    <option value="Guide">Guide</option>
                                    <option value="Template">Template</option>
                                    <option value="Course">Course</option>
                                    <option value="Tool">Tool</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Pillar</label>
                                <select 
                                    className="w-full bg-light rounded-2xl px-6 py-4 font-bold border-none focus:ring-2 focus:ring-teal outline-none appearance-none"
                                    value={newResourceForm.pillar}
                                    onChange={e => setNewResourceForm({...newResourceForm, pillar: e.target.value as any})}
                                >
                                    <option value="Live">Live</option>
                                    <option value="Earn">Earn</option>
                                    <option value="Grow">Grow</option>
                                </select>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Thumbnail URL</label>
                            <input 
                                type="text"
                                className="w-full bg-light rounded-2xl px-6 py-4 font-bold border-none focus:ring-2 focus:ring-teal outline-none"
                                value={newResourceForm.thumbnail}
                                onChange={e => setNewResourceForm({...newResourceForm, thumbnail: e.target.value})}
                            />
                        </div>
                        <button type="submit" className="w-full bg-navy text-white py-6 rounded-full font-black text-xl shadow-xl hover:bg-teal transition-all active:scale-95">
                            Publish to Library
                        </button>
                    </form>
                </div>
            </div>
        )}
      </div>
    );
  };

  const renderMemberView = () => {
    if (activeTab === 'Community Feed') {
      return (
        <div className="space-y-12 animate-in fade-in duration-500 max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
              <h2 className="text-4xl font-black text-navy mb-2 tracking-tighter">Community Feed</h2>
              <p className="text-gray-500">Real-time wisdom from fellow citizens.</p>
            </div>
            <button className="bg-navy text-white px-10 py-4 rounded-full font-black text-xs uppercase tracking-widest flex items-center shadow-lg hover:bg-teal transition-all active:scale-95">
              <Plus className="h-4 w-4 mr-2" /> Start Thread
            </button>
          </div>

          <div className="space-y-6">
            {COMMUNITY_POSTS.map((post) => (
              <div key={post.id} className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all group">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center">
                    <img src={post.avatar} className="w-12 h-12 rounded-2xl mr-4 border-2 border-light shadow-sm object-cover" alt="" />
                    <div>
                      <h4 className="font-bold text-navy">{post.author}</h4>
                      <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">{post.date}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                    post.pillar === 'Live' ? 'bg-navy text-white' : post.pillar === 'Earn' ? 'bg-teal text-white' : 'bg-coral text-white'
                  }`}>
                    {post.pillar}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-navy mb-4 leading-tight group-hover:text-teal transition-colors tracking-tight">{post.title}</h3>
                <p className="text-gray-600 leading-relaxed mb-8">{post.content}</p>
                <div className="flex items-center space-x-6 pt-6 border-t border-gray-50">
                  <button className="flex items-center text-xs font-bold text-gray-400 hover:text-coral transition-colors">
                    <Heart className="h-4 w-4 mr-1.5" /> {post.likes}
                  </button>
                  <button className="flex items-center text-xs font-bold text-gray-400 hover:text-navy transition-colors">
                    <MessageSquare className="h-4 w-4 mr-1.5" /> {post.replies} Replies
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (activeTab === 'My Journey') {
        return (
            <div className="space-y-12 animate-in fade-in duration-500 max-w-4xl mx-auto">
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-4xl font-black text-navy mb-2 tracking-tighter">Profile</h2>
                        <p className="text-gray-500">Update your global identity and preferences.</p>
                    </div>
                    {!isEditingProfile && (
                        <button 
                            onClick={() => setIsEditingProfile(true)}
                            className="bg-navy text-white px-8 py-4 rounded-full font-black text-xs uppercase flex items-center shadow-lg hover:bg-teal transition-all active:scale-95"
                        >
                            <Edit2 className="h-4 w-4 mr-2" /> Edit Profile
                        </button>
                    )}
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-1 space-y-8">
                        <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm text-center relative overflow-hidden">
                            <div className="relative inline-block mb-6">
                                <img src={user.avatar} className="w-32 h-32 rounded-[2.5rem] object-cover border-4 border-teal shadow-xl" alt="" />
                                {isEditingProfile && (
                                    <button className="absolute -bottom-2 -right-2 p-3 bg-teal text-white rounded-2xl shadow-lg hover:scale-110 transition-transform">
                                        <Camera className="h-5 w-5" />
                                    </button>
                                )}
                            </div>
                            <h4 className="text-2xl font-black text-navy">{user.name}</h4>
                            <p className="text-sm text-gray-400 font-bold mb-4 uppercase tracking-widest">{user.role}</p>
                            <div className="flex items-center justify-center space-x-2 text-teal font-black text-xs">
                                <MapPin className="h-4 w-4" />
                                <span>{user.location || 'Unknown Location'}</span>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-2">
                        {isEditingProfile ? (
                            <div className="bg-white p-12 rounded-[3rem] border border-gray-100 shadow-xl space-y-8 animate-in slide-in-from-right duration-500">
                                <div className="grid md:grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <label className="text-xs font-black uppercase text-gray-400 tracking-widest">Full Name</label>
                                        <input 
                                            type="text"
                                            className="w-full bg-light rounded-2xl p-4 font-bold border-none focus:ring-2 focus:ring-teal outline-none"
                                            value={profileForm.name}
                                            onChange={e => setProfileForm({...profileForm, name: e.target.value})}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black uppercase text-gray-400 tracking-widest">Location</label>
                                        <input 
                                            type="text"
                                            className="w-full bg-light rounded-2xl p-4 font-bold border-none focus:ring-2 focus:ring-teal outline-none"
                                            value={profileForm.location}
                                            onChange={e => setProfileForm({...profileForm, location: e.target.value})}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase text-gray-400 tracking-widest">Avatar URL</label>
                                    <input 
                                        type="text"
                                        className="w-full bg-light rounded-2xl p-4 font-bold border-none focus:ring-2 focus:ring-teal outline-none"
                                        value={profileForm.avatar}
                                        onChange={e => setProfileForm({...profileForm, avatar: e.target.value})}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase text-gray-400 tracking-widest">Short Bio</label>
                                    <textarea 
                                        rows={4}
                                        className="w-full bg-light rounded-2xl p-4 font-bold border-none focus:ring-2 focus:ring-teal outline-none"
                                        value={profileForm.bio}
                                        onChange={e => setProfileForm({...profileForm, bio: e.target.value})}
                                    />
                                </div>
                                <div className="flex gap-4">
                                    <button 
                                        onClick={() => {
                                            handleUpdateUser({...user, ...profileForm} as User);
                                            setIsEditingProfile(false);
                                        }}
                                        className="flex-grow bg-navy text-white py-5 rounded-full font-black text-lg shadow-lg hover:bg-teal transition-all flex items-center justify-center active:scale-95"
                                    >
                                        <Save className="h-5 w-5 mr-2" /> Save Profile
                                    </button>
                                    <button 
                                        onClick={() => setIsEditingProfile(false)}
                                        className="px-10 py-5 rounded-full border-2 border-light font-black text-lg hover:bg-light transition-all active:scale-95"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-white p-12 rounded-[3rem] border border-gray-100 shadow-sm space-y-10">
                                <div>
                                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-4">Bio</h4>
                                    <p className="text-lg text-gray-600 leading-relaxed italic">"{user.bio || 'Tell the network a bit about yourself...'}"</p>
                                </div>
                                <div>
                                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-4">Account Security</h4>
                                    <div className="flex items-center space-x-6">
                                        <div className="bg-light p-4 rounded-2xl font-bold text-navy flex-grow shadow-inner">{user.email}</div>
                                        <button className="text-teal font-black text-xs uppercase hover:underline transition-all">Change Password</button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    return (
      <div className="space-y-12 animate-in fade-in duration-500 max-w-5xl mx-auto">
        <div className="bg-gradient-to-r from-navy to-navy/90 rounded-[3rem] p-12 text-white relative overflow-hidden shadow-2xl">
          <div className="relative z-10 max-w-xl">
            <h2 className="text-5xl font-black mb-6 tracking-tighter">Welcome back, {user.name.split(' ')[0]}.</h2>
            <p className="text-gray-400 text-xl mb-10 leading-relaxed font-medium">You are currently at <span className="text-teal font-black">Level 2: The Explorer</span>. You need 3 more assets to unlock the UAE Relocation Strategy.</p>
            <div className="w-full h-3 bg-white/10 rounded-full mb-3 shadow-inner">
              <div className="h-full bg-teal rounded-full transition-all duration-1000" style={{ width: '65%' }}></div>
            </div>
            <div className="flex justify-between text-xs font-black uppercase tracking-[0.2em] text-gray-500">
              <span>Readiness Journey</span>
              <span className="text-white">65% Progress</span>
            </div>
          </div>
          <div className="absolute right-0 top-0 p-12 opacity-10">
            <Globe className="w-64 h-64" />
          </div>
        </div>

        <div>
          <h3 className="text-2xl font-black text-navy mb-8 tracking-tighter">Recommended for You</h3>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-[3rem] border border-gray-100 flex items-center gap-6 hover:shadow-2xl hover:-translate-y-1 transition-all cursor-pointer shadow-sm group">
              <div className="w-16 h-16 bg-teal/10 rounded-2xl flex items-center justify-center shrink-0 shadow-sm group-hover:bg-teal group-hover:text-white transition-all">
                <FileText className="h-8 w-8 text-teal group-hover:text-white" />
              </div>
              <div className="flex-grow">
                <h4 className="font-black text-xl text-navy">Dubai Tax Playbook</h4>
                <p className="text-sm text-gray-400 font-bold">Master 0% income strategies</p>
              </div>
              <ArrowUpRight className="h-6 w-6 text-gray-200 group-hover:text-teal transition-all" />
            </div>
            <div className="bg-white p-8 rounded-[3rem] border border-gray-100 flex items-center gap-6 hover:shadow-2xl hover:-translate-y-1 transition-all cursor-pointer shadow-sm group">
              <div className="w-16 h-16 bg-coral/10 rounded-2xl flex items-center justify-center shrink-0 shadow-sm group-hover:bg-coral group-hover:text-white transition-all">
                <Users className="h-8 w-8 text-coral group-hover:text-white" />
              </div>
              <div className="flex-grow">
                <h4 className="font-black text-xl text-navy">Berlin Tech Meetup</h4>
                <p className="text-sm text-gray-400 font-bold">Join the next Builders circle</p>
              </div>
              <ArrowUpRight className="h-6 w-6 text-gray-200 group-hover:text-coral transition-all" />
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex bg-light min-h-screen">
      {renderSidebar()}
      <main className="flex-grow p-12 pt-28 max-w-[1600px] mx-auto">
        {user.role === 'ADMIN' && renderAdminView()}
        {user.role === 'BACK_OFFICE' && renderBackOfficeView()}
        {user.role === 'MEMBER' && renderMemberView()}
      </main>
    </div>
  );
};

export default Portal;