import React from 'react';
import { Heart, Shield, Star, Globe, CheckCircle, ArrowRight } from 'lucide-react';
import { DONATION_TIERS } from '../constants';

const Donate = () => {
  return (
    <div className="bg-white min-h-screen pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-24 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-coral/10 text-coral text-[10px] font-black uppercase tracking-widest mb-6">
            Support the Mission
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-navy tracking-tighter leading-[1.1] mb-8">
            Fuel the <span className="text-teal">Borderless</span> Movement.
          </h1>
          <p className="text-xl text-gray-500 leading-relaxed">
            Builders Connect is community-powered. 90% of our research is free, and your support keeps it that way while expanding our reach.
          </p>
        </div>

        {/* Tiers Grid */}
        <div className="grid lg:grid-cols-3 gap-8 mb-24">
          {DONATION_TIERS.map(tier => (
            <div key={tier.id} className="bg-white p-12 rounded-[4rem] border border-gray-100 shadow-lg hover:shadow-2xl transition-all flex flex-col group relative overflow-hidden">
              <div className="relative z-10 flex-grow">
                <h3 className={`text-2xl font-black mb-2 text-${tier.color}`}>{tier.name}</h3>
                <div className="flex items-end mb-6">
                  <span className="text-5xl font-black text-navy">${tier.amount}</span>
                  <span className="text-gray-400 text-sm mb-2 ml-2 font-bold">One-time</span>
                </div>
                <p className="text-gray-500 text-sm leading-relaxed mb-10">{tier.description}</p>
                <div className="space-y-4 mb-12">
                  {tier.perks.map(perk => (
                    <div key={perk} className="flex items-center text-xs font-bold text-navy">
                      <CheckCircle className="h-4 w-4 text-teal mr-3 shrink-0" />
                      <span>{perk}</span>
                    </div>
                  ))}
                </div>
              </div>
              <button className={`w-full py-5 rounded-full font-black text-sm uppercase tracking-widest bg-${tier.color} text-white shadow-xl hover:scale-105 active:scale-95 transition-all`}>
                Choose Tier
              </button>
              <div className={`absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform`}>
                <Heart className="w-32 h-32" />
              </div>
            </div>
          ))}
        </div>

        {/* Impact Visualization */}
        <div className="bg-navy rounded-[4rem] p-16 md:p-24 text-white relative overflow-hidden shadow-2xl">
          <div className="relative z-10 grid lg:grid-cols-2 gap-20 items-center">
            <div>
              <h2 className="text-4xl font-black mb-8 tracking-tighter leading-tight">Your Support <br/>Builds the Future.</h2>
              <div className="space-y-8">
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-teal rounded-2xl flex items-center justify-center mr-6 shrink-0 shadow-lg">
                    <Globe className="h-6 w-6 text-navy" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold mb-2">Unbiased Research</h4>
                    <p className="text-gray-400 text-sm leading-relaxed">We stay independent from government agencies to give you the raw truth about visas and taxes.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-coral rounded-2xl flex items-center justify-center mr-6 shrink-0 shadow-lg">
                    <Shield className="h-6 w-6 text-navy" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold mb-2">Secure Platforms</h4>
                    <p className="text-gray-400 text-sm leading-relaxed">Funding for encrypted community spaces where members can share sensitive legal data safely.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white/5 backdrop-blur-xl p-12 rounded-[3rem] border border-white/10 text-center">
              <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-8">
                <Star className="h-10 w-10 text-teal" />
              </div>
              <h3 className="text-3xl font-black mb-4">Total Impact</h3>
              <div className="text-5xl font-black text-teal mb-6">$145,280</div>
              <p className="text-gray-400 text-sm mb-10">100% of contributions are re-invested into Builders Connect open-access resources.</p>
              <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-teal w-3/4 rounded-full"></div>
              </div>
              <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-gray-500 mt-4">
                <span>Annual Goal</span>
                <span className="text-white">75% Achieved</span>
              </div>
            </div>
          </div>
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-teal/10 rounded-full blur-[100px]"></div>
        </div>
      </div>
    </div>
  );
};

export default Donate;