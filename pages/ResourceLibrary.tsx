import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Star, Download, ChevronRight, X, Check, Globe, Mic, Youtube, Music } from 'lucide-react';
import { RESOURCES } from '../constants';

const ResourceLibrary = () => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [activePillar, setActivePillar] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Collect all unique tags
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    RESOURCES.forEach(r => r.tags.forEach(t => tags.add(t)));
    return Array.from(tags).sort();
  }, []);

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const filteredResources = RESOURCES.filter(res => {
    const pillarMatch = activePillar === 'All' || res.pillar === activePillar;
    const formatMatch = activeFilter === 'All' || res.format === activeFilter;
    const searchMatch = res.title.toLowerCase().includes(searchQuery.toLowerCase()) || res.description.toLowerCase().includes(searchQuery.toLowerCase());
    const tagMatch = selectedTags.length === 0 || selectedTags.every(t => res.tags.includes(t));
    return pillarMatch && formatMatch && searchMatch && tagMatch;
  });

  const clearFilters = () => {
    setActiveFilter('All');
    setActivePillar('All');
    setSearchQuery('');
    setSelectedTags([]);
  };

  const isFiltered = activeFilter !== 'All' || activePillar !== 'All' || searchQuery !== '' || selectedTags.length > 0;

  return (
    <div className="bg-light min-h-screen pt-28 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="animate-in fade-in slide-in-from-left duration-500">
            <h1 className="text-5xl font-extrabold mb-6 tracking-tighter text-navy">Resource Library</h1>
            <p className="text-xl text-gray-600 max-w-2xl leading-relaxed">
              Download the blueprints, playbooks, and courses to design your life beyond default settings.
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            {isFiltered && (
              <button 
                onClick={clearFilters}
                className="flex items-center space-x-2 bg-coral text-white px-6 py-3 rounded-full font-black text-xs uppercase tracking-widest hover:bg-navy transition-all shadow-lg hover:scale-105 active:scale-95"
              >
                <X className="h-4 w-4" />
                <span>Clear All Filters</span>
              </button>
            )}
          </div>
        </div>

        {/* Podcast Spotlight Section */}
        <section className="mb-20 animate-in fade-in duration-700">
          <div className="bg-navy rounded-[3.5rem] p-8 md:p-14 text-white shadow-2xl relative overflow-hidden flex flex-col lg:flex-row gap-12 items-center">
            <div className="lg:w-1/2 relative z-10">
              <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-teal/20 text-teal border border-teal/30 text-[10px] font-black uppercase tracking-widest mb-6">
                <Mic className="h-3 w-3 mr-2" /> Featured Audio
              </div>
              <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tighter">Future Foundations: <br/><span className="text-teal">Strategic Life Design</span></h2>
              <p className="text-gray-400 text-lg mb-10 leading-relaxed font-medium">
                Our definitive podcast series where we interview ambitious builders who have successfully designed lives beyond default settings.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <a 
                  href="https://www.youtube.com/@BuildersConnect/podcasts" 
                  target="_blank" 
                  className="bg-white/10 hover:bg-white text-white hover:text-navy px-8 py-4 rounded-full font-black text-xs uppercase tracking-widest transition-all flex items-center"
                >
                  <Youtube className="h-4 w-4 mr-2" /> YouTube
                </a>
                <a 
                  href="https://open.spotify.com/show/6yUjD35JA5VRfHzHw2gCX9?si=DslTiXtUQJSa1hlXFNO4lQ" 
                  target="_blank" 
                  className="bg-white/10 hover:bg-white text-white hover:text-navy px-8 py-4 rounded-full font-black text-xs uppercase tracking-widest transition-all flex items-center"
                >
                  <Music className="h-4 w-4 mr-2" /> Spotify
                </a>
              </div>
            </div>
            
            <div className="lg:w-1/2 w-full relative z-10">
              <div className="rounded-3xl overflow-hidden shadow-2xl border border-white/10">
                <iframe 
                  allow="autoplay *; encrypted-media *; fullscreen *; clipboard-write" 
                  frameBorder="0" 
                  height="450" 
                  style={{ width: '100%', maxWidth: '660px', overflow: 'hidden', borderRadius: '10px' }} 
                  sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-storage-access-by-user-activation allow-top-navigation-by-user-activation" 
                  src="https://embed.podcasts.apple.com/us/podcast/future-foundations-strategic-life-design/id1874863146"
                ></iframe>
              </div>
            </div>
            
            {/* Background elements */}
            <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
              <Mic className="w-64 h-64" />
            </div>
            <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-teal/10 rounded-full blur-[100px] pointer-events-none"></div>
          </div>
        </section>

        <div className="grid lg:grid-cols-4 gap-12">
          {/* Sidebar Filters */}
          <aside className="lg:col-span-1 space-y-10 animate-in fade-in slide-in-from-left duration-700">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 space-y-10">
              {/* Search */}
              <div>
                <h3 className="text-[10px] font-black text-navy uppercase tracking-[0.2em] mb-4">Search Content</h3>
                <div className="relative group">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-teal transition-colors" />
                  <input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Keywords..." 
                    className="w-full pl-10 pr-4 py-3 rounded-xl border-none ring-1 ring-gray-100 focus:ring-2 focus:ring-teal bg-light/50 font-bold text-sm outline-none"
                  />
                </div>
              </div>

              {/* By Pillar */}
              <div>
                <h3 className="text-[10px] font-black text-navy uppercase tracking-[0.2em] mb-4">Strategy Pillar</h3>
                <div className="grid grid-cols-2 gap-2">
                  {['All', 'Live', 'Earn', 'Grow'].map(p => (
                    <button
                      key={p}
                      onClick={() => setActivePillar(p)}
                      className={`text-center px-4 py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all ${activePillar === p ? 'bg-navy text-white shadow-md' : 'bg-light text-gray-400 hover:bg-gray-100'}`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              {/* Format */}
              <div>
                <h3 className="text-[10px] font-black text-navy uppercase tracking-[0.2em] mb-4">Format</h3>
                <div className="space-y-2">
                  {['All', 'Guide', 'Template', 'Course', 'Tool'].map(f => (
                    <button
                      key={f}
                      onClick={() => setActiveFilter(f)}
                      className={`w-full text-left px-4 py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all flex justify-between items-center ${activeFilter === f ? 'bg-teal text-white shadow-md' : 'bg-light text-gray-400 hover:bg-gray-100'}`}
                    >
                      {f}
                      {activeFilter === f && <Check className="h-3 w-3" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Multiple Tag Selection */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-[10px] font-black text-navy uppercase tracking-[0.2em]">Tags (Select Multi)</h3>
                  {selectedTags.length > 0 && (
                    <button 
                      onClick={() => setSelectedTags([])}
                      className="text-[8px] font-black text-coral uppercase hover:underline"
                    >
                      Clear
                    </button>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {allTags.map(tag => (
                    <button
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className={`px-3 py-2 rounded-lg text-[8px] font-black uppercase tracking-widest transition-all border ${selectedTags.includes(tag) ? 'bg-navy border-navy text-white shadow-md' : 'bg-white text-gray-400 border-gray-100 hover:border-teal hover:text-teal'}`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* CTA Sidebar card */}
            <div className="bg-navy rounded-[2.5rem] p-8 text-white relative overflow-hidden group">
              <div className="relative z-10">
                <h4 className="text-xl font-bold mb-4">Can't find something?</h4>
                <p className="text-gray-400 text-xs mb-6 leading-relaxed">Request a specific guide or tool from our expert community.</p>
                <Link to="/contact" className="inline-block bg-teal text-navy px-6 py-3 rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-white transition-all">
                  Request Asset
                </Link>
              </div>
              <div className="absolute top-0 right-0 p-4 opacity-5">
                <Globe className="w-24 h-24" />
              </div>
            </div>
          </aside>

          {/* Resource Grid */}
          <div className="lg:col-span-3">
            {filteredResources.length > 0 ? (
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8 animate-in fade-in duration-700">
                {filteredResources.map(res => (
                  <div key={res.id} className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all group flex flex-col border border-gray-100 hover:-translate-y-2">
                    <div className="relative h-56 overflow-hidden">
                      <img src={res.thumbnail} alt={res.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                      <div className="absolute top-4 left-4 flex gap-2">
                        <span className="bg-white/90 backdrop-blur px-2.5 py-1 rounded-lg text-[9px] font-black text-navy uppercase tracking-tighter">{res.pillar}</span>
                        <span className="bg-teal text-white px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-tighter">{res.format}</span>
                      </div>
                      {res.price !== 'Free' && (
                        <div className="absolute bottom-4 right-4 bg-navy text-white px-3 py-1.5 rounded-xl font-black text-xs shadow-lg">
                          ${res.price}
                        </div>
                      )}
                    </div>
                    
                    <div className="p-8 flex-grow flex flex-col">
                      <h3 className="text-xl font-black mb-3 leading-tight group-hover:text-teal transition-colors tracking-tight text-navy">{res.title}</h3>
                      <p className="text-gray-500 text-sm mb-6 flex-grow leading-relaxed font-medium line-clamp-3">{res.description}</p>
                      
                      <div className="flex flex-wrap gap-2 mb-6">
                        {res.tags.map(t => (
                          <span key={t} className="text-[8px] font-black text-gray-400 uppercase tracking-widest bg-light px-2 py-0.5 rounded">#{t}</span>
                        ))}
                      </div>

                      <div className="flex items-center justify-between mt-auto pt-6 border-t border-gray-50">
                        {res.rating ? (
                          <div className="flex items-center text-yellow-500 font-bold text-xs">
                            <Star className="h-3.5 w-3.5 fill-current mr-1" />
                            {res.rating}
                          </div>
                        ) : (
                          <span className="text-[9px] text-teal font-black uppercase tracking-[0.1em]">Verified Community Asset</span>
                        )}
                        <button className="flex items-center text-navy font-black text-[10px] uppercase tracking-widest group-hover:text-teal transition-colors">
                          {res.price === 'Free' ? 'Access' : 'Enroll Now'}
                          <ChevronRight className="ml-1 h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-[4rem] p-24 text-center shadow-sm border border-dashed border-gray-200 animate-in zoom-in duration-500">
                <div className="w-20 h-20 bg-light rounded-full flex items-center justify-center mx-auto mb-8">
                  <Filter className="h-10 w-10 text-gray-200" />
                </div>
                <h3 className="text-3xl font-black text-navy mb-4">No content matches your filters</h3>
                <p className="text-gray-500 mb-10 text-lg font-medium max-w-md mx-auto">We couldn't find any resources that meet all your criteria. Try widening your search or removing some tags.</p>
                <button 
                  onClick={clearFilters} 
                  className="bg-teal text-navy px-10 py-4 rounded-full font-black text-xs uppercase tracking-widest hover:bg-navy hover:text-white transition-all shadow-xl"
                >
                  Reset Library Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourceLibrary;