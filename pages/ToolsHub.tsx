
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Calculator, Search, ShieldCheck, CheckCircle, 
  ArrowRight, Globe, TrendingUp, Zap, FileText, X, Info, Users,
  ShoppingBag, Star
} from 'lucide-react';
import { COUNTRIES, SHOP_PRODUCTS } from '../constants';

const ToolsHub = () => {
  const [activeTool, setActiveTool] = useState<string | null>(null);

  // --- Tool State: Cost of Living Matcher ---
  const [colCityA, setColCityA] = useState(COUNTRIES[0].id);
  const [colCityB, setColCityB] = useState(COUNTRIES[1].id);

  // --- Tool State: Wealth Calculator ---
  const [annualIncome, setAnnualIncome] = useState(120000);

  const getCity = (id: string) => COUNTRIES.find(c => c.id === id);

  const renderToolContent = () => {
    if (!activeTool) return null;

    return (
      <div className="fixed inset-0 z-[60] flex items-center justify-center px-4 bg-navy/90 backdrop-blur-md animate-in fade-in duration-300">
        <div className="bg-white w-full max-w-3xl rounded-[3rem] shadow-2xl p-8 md:p-12 relative max-h-[90vh] overflow-y-auto">
          <button 
            onClick={() => setActiveTool(null)}
            className="absolute top-8 right-8 p-3 hover:bg-light rounded-full transition-colors"
          >
            <X className="h-6 w-6 text-gray-400" />
          </button>

          {activeTool === 'col' && (
            <div className="space-y-8">
              <div className="text-center">
                <div className="w-20 h-20 bg-teal/10 rounded-3xl flex items-center justify-center mx-auto mb-6">
                  <Calculator className="h-10 w-10 text-teal" />
                </div>
                <h2 className="text-4xl font-bold mb-2">Cost of Living Matcher</h2>
                <p className="text-gray-500 text-lg">Compare purchasing power and expenses across borders.</p>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-navy uppercase tracking-tighter">Origin City</label>
                  <select 
                    value={colCityA} 
                    onChange={(e) => setColCityA(e.target.value)}
                    className="w-full bg-light border-none rounded-2xl px-5 py-4 font-bold text-navy focus:ring-2 focus:ring-teal"
                  >
                    {COUNTRIES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-navy uppercase tracking-tighter">Target City</label>
                  <select 
                    value={colCityB} 
                    onChange={(e) => setColCityB(e.target.value)}
                    className="w-full bg-light border-none rounded-2xl px-5 py-4 font-bold text-navy focus:ring-2 focus:ring-teal"
                  >
                    {COUNTRIES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
              </div>

              <div className="bg-light rounded-3xl p-8 space-y-6">
                {['Housing', 'Food', 'Transport', 'Healthcare'].map(item => {
                  const key = item.toLowerCase() as keyof typeof COUNTRIES[0]['costs'];
                  const valA = getCity(colCityA)?.costs[key] || 0;
                  const valB = getCity(colCityB)?.costs[key] || 0;
                  const ratio = valA / (valA + valB);
                  return (
                    <div key={item}>
                      <div className="flex justify-between mb-2 font-bold text-sm">
                        <span>{item}</span>
                        <span className="text-teal">${valA} / ${valB}</span>
                      </div>
                      <div className="h-3 bg-white rounded-full overflow-hidden flex shadow-inner">
                        <div className="bg-navy h-full transition-all duration-500" style={{ width: `${ratio * 100}%` }}></div>
                        <div className="bg-teal h-full transition-all duration-500" style={{ width: `${(1 - ratio) * 100}%` }}></div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="flex items-center justify-center space-x-4">
                <div className="flex items-center"><div className="w-3 h-3 bg-navy rounded-full mr-2"></div><span className="text-xs font-bold text-gray-500">{getCity(colCityA)?.name}</span></div>
                <div className="flex items-center"><div className="w-3 h-3 bg-teal rounded-full mr-2"></div><span className="text-xs font-bold text-gray-500">{getCity(colCityB)?.name}</span></div>
              </div>
            </div>
          )}

          {activeTool === 'wealth' && (
            <div className="space-y-8">
              <div className="text-center">
                <div className="w-20 h-20 bg-navy/10 rounded-3xl flex items-center justify-center mx-auto mb-6">
                  <ShieldCheck className="h-10 w-10 text-navy" />
                </div>
                <h2 className="text-4xl font-bold mb-2">Wealth Simulator</h2>
                <p className="text-gray-500 text-lg">Compare net income and savings potential globally.</p>
              </div>

              <div className="bg-light p-8 rounded-[2.5rem] space-y-4">
                <label className="text-sm font-black text-navy uppercase tracking-widest">Gross Annual Household Income (USD)</label>
                <div className="relative">
                  <span className="absolute left-6 top-1/2 -translate-y-1/2 text-3xl font-bold text-gray-400">$</span>
                  <input 
                    type="number" 
                    value={annualIncome}
                    onChange={(e) => setAnnualIncome(Number(e.target.value))}
                    className="w-full bg-white border-none rounded-2xl px-12 py-6 text-4xl font-black text-navy focus:ring-2 focus:ring-navy"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {[
                  { name: 'Dubai, UAE', tax: 0, cost: 45000, color: 'teal' },
                  { name: 'Berlin, GER', tax: 0.42, cost: 28000, color: 'navy' },
                  { name: 'Singapore', tax: 0.15, cost: 52000, color: 'coral' }
                ].map(r => {
                  const afterTax = annualIncome * (1 - r.tax);
                  const surplus = afterTax - r.cost;
                  return (
                    <div key={r.name} className="bg-white border-2 border-light rounded-3xl p-6 hover:border-navy transition-all">
                      <h4 className="font-black text-navy mb-4 border-b border-light pb-2">{r.name}</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between text-xs font-bold text-gray-400 uppercase">
                          <span>After Tax</span>
                          <span className="text-navy">${Math.max(0, Math.round(afterTax)).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-xs font-bold text-gray-400 uppercase">
                          <span>Est. Living</span>
                          <span className="text-coral">-${r.cost.toLocaleString()}</span>
                        </div>
                        <div className="pt-3 mt-3 border-t-2 border-dashed border-light">
                          <div className="text-[10px] font-black uppercase text-gray-400 mb-1">Annual Surplus</div>
                          <div className="text-2xl font-black text-teal">${Math.max(0, Math.round(surplus)).toLocaleString()}</div>
                        </div>
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

  const tools = [
    {
      id: 'quiz',
      title: 'Readiness Quiz',
      desc: 'Our flagship 3-minute assessment to identify your life-design blind spots.',
      icon: CheckCircle,
      color: 'teal',
      path: '/tools/quiz',
      featured: true
    },
    {
      id: 'col',
      title: 'Cost of Living Matcher',
      desc: 'Deep data comparison of your current home vs. potential destinations.',
      icon: Calculator,
      color: 'navy',
      interactive: true
    },
    {
      id: 'wealth',
      title: 'Wealth Calculator',
      desc: 'A realistic simulation of taxes, cost of living, and savings surplus.',
      icon: ShieldCheck,
      color: 'navy',
      interactive: true
    }
  ];

  return (
    <div className="bg-light min-h-screen pt-32 pb-24">
      {renderToolContent()}
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <span className="inline-block px-4 py-1 rounded-full bg-teal/10 text-teal text-[10px] font-black uppercase tracking-widest mb-6">
            Decision Engineering
          </span>
          <h1 className="text-5xl md:text-7xl font-extrabold text-navy mb-8 leading-[1.1]">
            Plan Your Life with <br/><span className="text-teal">Precision.</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Stop relying on blogs and Reddit threads. Our interactive tools use real-time market data to give you the exact numbers you need to design your life beyond default settings.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-32">
          {tools.map((tool) => (
            <div 
              key={tool.id} 
              onClick={() => tool.interactive && setActiveTool(tool.id)}
              className={`bg-white rounded-[3rem] p-10 border border-gray-100 shadow-lg hover:shadow-2xl transition-all group flex flex-col cursor-pointer ${tool.featured ? 'md:col-span-1 bg-navy text-white border-none scale-[1.02]' : ''}`}
            >
              <div className={`w-16 h-16 rounded-3xl ${tool.featured ? 'bg-teal' : `bg-${tool.color}/10`} flex items-center justify-center mb-8 group-hover:rotate-12 transition-transform`}>
                <tool.icon className={`h-8 w-8 ${tool.featured ? 'text-navy' : `text-${tool.color}`}`} />
              </div>
              <h3 className={`text-2xl font-bold mb-4 ${tool.featured ? 'text-3xl' : ''}`}>{tool.title}</h3>
              <p className={`mb-8 flex-grow ${tool.featured ? 'text-gray-300' : 'text-gray-600'}`}>{tool.desc}</p>
              
              <div className={`inline-flex items-center font-bold transition-all ${tool.featured ? 'text-teal group-hover:text-white' : 'text-navy group-hover:text-teal'}`}>
                {tool.id === 'quiz' ? (
                  <Link to="/tools/quiz" className="flex items-center">Start Assessment <ArrowRight className="ml-2 h-5 w-5" /></Link>
                ) : (
                  <span className="flex items-center">Launch Tool <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" /></span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Shop Section */}
        <div className="mb-32">
          <div className="flex justify-between items-end mb-16">
            <div>
              <span className="text-[10px] font-black text-teal uppercase tracking-widest mb-4 block">The Builder's Toolkit</span>
              <h2 className="text-4xl md:text-5xl font-black text-navy tracking-tighter uppercase">Premium Resources</h2>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-12">
            {SHOP_PRODUCTS.map((product) => (
              <div key={product.id} className="group flex flex-col">
                <Link to={`/shop/${product.id}`} className="block relative aspect-[3/4] rounded-[3rem] overflow-hidden mb-8 shadow-2xl hover:shadow-teal/20 transition-all duration-500">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-navy/20 group-hover:bg-navy/0 transition-colors duration-500"></div>
                  <div className="absolute top-6 right-6">
                    <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl text-navy font-black text-xs uppercase tracking-widest shadow-xl">
                      {product.category}
                    </div>
                  </div>
                </Link>
                
                <div className="px-4">
                  <div className="flex items-center space-x-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 text-coral fill-coral" />
                    ))}
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">5.0 (2,400+)</span>
                  </div>
                  <h3 className="text-2xl font-black text-navy mb-3 tracking-tight group-hover:text-teal transition-colors uppercase">
                    {product.name}
                  </h3>
                  <div className="flex items-center justify-between">
                    <div className="text-xl font-black text-navy">${product.price}</div>
                    <Link 
                      to={`/shop/${product.id}`}
                      className="inline-flex items-center text-[10px] font-black uppercase tracking-widest text-teal hover:text-navy transition-colors"
                    >
                      Details <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Support Section */}
        <section className="mt-24 bg-navy rounded-[4rem] p-12 md:p-20 shadow-2xl relative overflow-hidden text-white">
          <div className="relative z-10 grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6 leading-tight">Complex Life Design? <br/>Get a Custom Strategy.</h2>
              <p className="text-lg text-gray-400 mb-10 leading-relaxed">
                Tools are great for initial planning, but complex wealth structures and multi-stage mobility processes often require human expertise.
              </p>
              <div className="grid sm:grid-cols-2 gap-6 mb-10">
                <div className="flex items-center space-x-4 bg-white/5 p-4 rounded-2xl border border-white/10">
                  <div className="w-10 h-10 bg-teal/20 rounded-xl flex items-center justify-center">
                    <Zap className="h-5 w-5 text-teal" />
                  </div>
                  <span className="font-bold text-sm">Strategy Calls</span>
                </div>
                <div className="flex items-center space-x-4 bg-white/5 p-4 rounded-2xl border border-white/10">
                  <div className="w-10 h-10 bg-coral/20 rounded-xl flex items-center justify-center">
                    <FileText className="h-5 w-5 text-coral" />
                  </div>
                  <span className="font-bold text-sm">Tax Planning</span>
                </div>
              </div>
              <button className="bg-white text-navy px-10 py-5 rounded-full font-black text-lg hover:bg-teal hover:text-navy transition-all shadow-xl">
                Book a Global Strategist
              </button>
            </div>
            
            <div className="bg-white/5 backdrop-blur-xl p-10 rounded-[3rem] border border-white/10 flex flex-col items-center text-center">
              <Users className="h-16 w-16 text-teal mb-6 opacity-40" />
              <h3 className="text-2xl font-black mb-4 uppercase tracking-tighter">Elite Membership</h3>
              <p className="text-gray-400 mb-10 text-sm italic">"The concierge service for your personal evolution. We handle the complexity, you handle the living."</p>
              <div className="w-full h-1 bg-white/10 rounded-full mb-10">
                 <div className="h-full bg-teal w-3/4 rounded-full"></div>
              </div>
              <div className="text-xs font-bold uppercase tracking-widest text-teal">Enrollment 75% Full for Q1</div>
            </div>
          </div>
          {/* Decorative blurs */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-teal/10 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-coral/10 rounded-full blur-[100px]"></div>
        </section>
      </div>
    </div>
  );
};

export default ToolsHub;
