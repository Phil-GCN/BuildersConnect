import React from 'react';
import { Mic, Play, ArrowRight, Youtube, Music, Calendar, Clock, User } from 'lucide-react';

const PODCAST_EPISODES = [
  {
    id: 1,
    title: "Designing a Life with Real Options",
    guest: "Sarah Jenkins",
    role: "Global Mobility Expert",
    duration: "45 min",
    date: "March 15, 2024",
    description: "Sarah breaks down the 'Option-First' framework for choosing your next destination based on long-term mobility and wealth potential.",
    image: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&q=80&w=800",
    story: "Sarah's journey began in a small town with limited prospects. By applying the 'Option-First' framework, she transformed her life, moving through three continents and building a borderless career that now empowers thousands."
  },
  {
    id: 2,
    title: "The SAP Career Playbook: From Local to Global",
    guest: "Marcus Thorne",
    role: "Enterprise Architect",
    duration: "52 min",
    date: "March 8, 2024",
    description: "How Marcus leveraged a niche technical skill to secure a tax-free remote role while living in Bali.",
    image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80&w=800",
    story: "Marcus was stuck in a corporate cycle until he identified the global demand for SAP S/4HANA. His story is one of strategic skill-stacking and the courage to relocate to a digital nomad hub while maintaining a high-tier professional income."
  },
  {
    id: 3,
    title: "Wealth Creation Beyond Borders",
    guest: "David Okafor",
    role: "Venture Capitalist",
    duration: "38 min",
    date: "March 1, 2024",
    description: "A deep dive into multi-currency investing and why your local bank account is your biggest wealth bottleneck.",
    image: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&q=80&w=800",
    story: "David's story highlights the systemic barriers to wealth in certain jurisdictions. He shares how he broke through by diversifying his legal and financial presence, proving that wealth isn't just about what you earn, but where and how you keep it."
  }
];

const Stories = () => {
  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 pb-24 bg-navy overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="animate-in fade-in slide-in-from-left duration-700">
              <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-teal/20 text-teal border border-teal/30 text-[10px] font-black uppercase tracking-widest mb-6">
                <Mic className="h-3 w-3 mr-2" /> Unique Stories
              </div>
              <h1 className="text-5xl md:text-7xl font-black text-white mb-8 tracking-tighter leading-tight">
                Builder <br/><span className="text-teal">Stories.</span>
              </h1>
              <p className="text-xl text-gray-400 mb-10 leading-relaxed max-w-xl">
                Real-world accounts of individuals who successfully designed their lives beyond default settings. These are the interviews from Future Foundations.
              </p>
            </div>
            
            <div className="relative animate-in fade-in zoom-in duration-1000">
              <div className="aspect-square bg-gradient-to-br from-teal to-navy rounded-[4rem] p-1 shadow-2xl overflow-hidden group">
                <img 
                  src="https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&q=80&w=800" 
                  className="w-full h-full object-cover rounded-[3.8rem] opacity-80 group-hover:scale-110 transition-transform duration-1000" 
                  alt="Stories Cover" 
                />
                <div className="absolute inset-0 flex items-center justify-center">
                   <div className="w-24 h-24 bg-white/10 backdrop-blur-2xl rounded-full flex items-center justify-center border border-white/20">
                      <Mic className="h-12 w-12 text-white" />
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-teal/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-coral/10 rounded-full blur-[120px]"></div>
      </section>

      {/* Stories Section */}
      <section className="py-24 bg-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-16">
            <h2 className="text-4xl font-black text-navy mb-4 tracking-tighter uppercase">The Interviews</h2>
            <p className="text-gray-600 text-lg">Deep dives into the journeys of our community members.</p>
          </div>

          <div className="grid gap-12">
            {PODCAST_EPISODES.map((ep) => (
              <div key={ep.id} className="bg-white rounded-[4rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all group border border-gray-100 grid md:grid-cols-[400px_1fr]">
                <div className="relative h-full min-h-[300px] overflow-hidden">
                  <img src={ep.image} alt={ep.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                  <div className="absolute inset-0 bg-navy/20 group-hover:bg-navy/0 transition-all"></div>
                  <div className="absolute bottom-8 left-8">
                    <button className="w-16 h-16 bg-teal text-navy rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                      <Play className="h-6 w-6 fill-navy" />
                    </button>
                  </div>
                </div>
                <div className="p-12 md:p-16 flex flex-col justify-center">
                  <div className="flex items-center space-x-4 mb-8 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    <span className="flex items-center"><Calendar className="h-3 w-3 mr-1.5" /> {ep.date}</span>
                    <span className="flex items-center"><Clock className="h-3 w-3 mr-1.5" /> {ep.duration}</span>
                  </div>
                  <h3 className="text-4xl font-black text-navy mb-6 leading-tight group-hover:text-teal transition-colors tracking-tighter uppercase">
                    {ep.title}
                  </h3>
                  <p className="text-gray-500 text-lg mb-8 leading-relaxed font-medium italic">
                    "{ep.story}"
                  </p>
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-2xl bg-light flex items-center justify-center mr-4">
                      <User className="h-6 w-6 text-gray-400" />
                    </div>
                    <div>
                      <div className="font-black text-navy text-lg uppercase tracking-tight">{ep.guest}</div>
                      <div className="text-[10px] text-gray-400 font-black uppercase tracking-widest">{ep.role}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Stories;
