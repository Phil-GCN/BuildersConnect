import React from 'react';
import { Link } from 'react-router-dom';
import { Globe, Heart, Shield, Users, ArrowRight, Mail, Instagram, Linkedin, Twitter, Facebook, Share2, MessageCircle } from 'lucide-react';

const About = () => {
  const shareUrl = window.location.href;
  const shareText = "Designing my life beyond default settings with Builders Connect.";

  const shareLinks = [
    { name: 'Twitter', icon: Twitter, color: 'hover:bg-[#1DA1F2]', url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}` },
    { name: 'LinkedIn', icon: Linkedin, color: 'hover:bg-[#0077B5]', url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}` },
    { name: 'Facebook', icon: Facebook, color: 'hover:bg-[#4267B2]', url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}` },
  ];

  return (
    <div className="bg-white">
      {/* Hero / Founder Section */}
      <section className="py-24 pt-32 bg-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h1 className="text-5xl md:text-6xl font-extrabold text-navy mb-8 leading-tight uppercase">
                Empowering ambitious people to <span className="text-teal">design lives beyond default.</span>
              </h1>
              <div className="prose prose-lg text-gray-600 space-y-6">
                <p>
                  Builders Connect was born from a simple observation: ambitious people refuse to accept their current circumstances as their final destination.
                </p>
                <p>
                  Whether you're a professional looking for a tax-efficient base in Dubai, a tech lead moving to Berlin, or a digital nomad exploring the world, the challenges are universal: mobility, wealth creation, and personal evolution.
                </p>
                <p className="font-bold text-navy">
                  Our mission is to empower you to design a life with real options, not just dreams. We provide the strategies, tools, and community to help you live, earn, and grow beyond borders.
                </p>
              </div>
              <div className="mt-10 flex space-x-6">
                <div className="text-center">
                  <div className="text-4xl font-bold text-navy">50k+</div>
                  <div className="text-sm text-gray-500">Members</div>
                </div>
                <div className="text-center border-l border-gray-200 pl-6">
                  <div className="text-4xl font-bold text-navy">120</div>
                  <div className="text-sm text-gray-500">Countries</div>
                </div>
                <div className="text-center border-l border-gray-200 pl-6">
                  <div className="text-4xl font-bold text-navy">15k</div>
                  <div className="text-sm text-gray-500">Resources Sent</div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="aspect-[4/5] bg-navy rounded-[3rem] overflow-hidden shadow-2xl relative">
                <img 
                  src="https://images.unsplash.com/photo-1507152832244-10d45c7eda57?auto=format&fit=crop&q=80&w=800" 
                  alt="Phil E.A - Founder" 
                  className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" 
                />
                <div className="absolute bottom-10 left-10 right-10 bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20 text-white">
                  <h3 className="text-xl font-bold">Phil E.A</h3>
                  <p className="text-sm text-gray-300">Founder & Chief Globalist</p>
                </div>
              </div>
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-teal/20 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-coral/20 rounded-full blur-3xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Community First Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-navy rounded-[4rem] p-12 md:p-20 text-white relative overflow-hidden shadow-2xl">
            <div className="relative z-10 grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-4xl font-black mb-8 tracking-tighter">Community First, <br/>Infrastructure Second.</h2>
                <p className="text-gray-400 text-lg mb-10 leading-relaxed">
                  We aren't just a database. We are a living, breathing network. Our strength comes from the collective intelligence of thousands of members who have navigated the most complex relocations.
                </p>
                <div className="space-y-6">
                  <Link to="/community" className="flex items-center space-x-4 group cursor-pointer">
                    <div className="w-12 h-12 bg-teal/20 rounded-2xl flex items-center justify-center border border-teal/30 group-hover:bg-teal transition-all">
                      <MessageCircle className="h-6 w-6 text-teal group-hover:text-navy" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg group-hover:text-teal transition-colors">Peer-to-Peer Support</h4>
                      <p className="text-sm text-gray-500">Real-time answers from members who are already on the ground.</p>
                    </div>
                  </Link>
                  <Link to="/community" className="flex items-center space-x-4 group cursor-pointer">
                    <div className="w-12 h-12 bg-coral/20 rounded-2xl flex items-center justify-center border border-coral/30 group-hover:bg-coral transition-all">
                      <Users className="h-6 w-6 text-coral group-hover:text-navy" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg group-hover:text-coral transition-colors">Global Circles</h4>
                      <p className="text-sm text-gray-500">Local city-based groups for networking and integration.</p>
                    </div>
                  </Link>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 p-6 rounded-[2.5rem] border border-white/10 text-center">
                  <div className="text-3xl font-black text-teal mb-2">180k+</div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-gray-500">Monthly Messages</div>
                </div>
                <div className="bg-white/5 p-6 rounded-[2.5rem] border border-white/10 text-center">
                  <div className="text-3xl font-black text-coral mb-2">45</div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-gray-500">Local Meetups/Mo</div>
                </div>
                <Link to="/community" className="col-span-2 bg-white/5 p-8 rounded-[2.5rem] border border-white/10 flex items-center justify-center space-x-4 hover:bg-white/10 transition-all cursor-pointer">
                  <div className="flex -space-x-3">
                    {[1, 2, 3, 4].map(i => (
                      <img key={i} src={`https://i.pravatar.cc/100?u=${i+10}`} className="w-10 h-10 rounded-full border-2 border-navy shadow-lg" alt="" />
                    ))}
                  </div>
                  <span className="text-sm font-bold">Join the Conversation →</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Share Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-light rounded-[3rem] p-12 text-center border border-gray-100 shadow-sm">
            <div className="w-12 h-12 bg-navy text-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-md">
              <Share2 className="h-6 w-6" />
            </div>
            <h2 className="text-3xl font-black text-navy mb-4">Share the Vision</h2>
            <p className="text-gray-500 mb-8 font-medium">Help us build a borderless world by sharing our mission with your network.</p>
            <div className="flex justify-center flex-wrap gap-4">
              {shareLinks.map(link => (
                <a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center space-x-2 bg-white px-6 py-3 rounded-2xl shadow-sm border border-gray-100 font-black text-xs uppercase tracking-widest transition-all hover:text-white hover:scale-105 ${link.color}`}
                >
                  <link.icon className="h-4 w-4" />
                  <span>{link.name}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Our Core Values</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">The principles that guide everything we build at Builders Connect.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-10">
            {[
              { icon: Globe, title: 'Radical Openness', desc: 'We believe borders should be bridges, not walls. We celebrate diversity of thought and geography.' },
              { icon: Shield, title: 'Practical Ambition', desc: 'We don\'t just dream; we do. Our resources are grounded in data and real-world experience.' },
              { icon: Heart, title: 'Global Community', desc: 'Success is better shared. We foster a network where members help each other rise.' }
            ].map(value => (
              <div key={value.title} className="p-10 bg-light rounded-[2rem] hover:-translate-y-1 transition-all group">
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-8 shadow-sm group-hover:bg-teal group-hover:text-white transition-all">
                  <value.icon className="h-7 w-7 text-teal group-hover:text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partnerships / Press */}
      <section className="py-24 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">As seen in & trusted by</h3>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-40 grayscale">
            <div className="text-2xl font-black italic">TechCrunch</div>
            <div className="text-2xl font-black italic">Forbes</div>
            <div className="text-2xl font-black italic">NomadList</div>
            <div className="text-2xl font-black italic">WIRED</div>
            <div className="text-2xl font-black italic">Sifted</div>
          </div>
        </div>
      </section>

      {/* Contact & CTA */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-navy rounded-[4rem] p-12 md:p-20 text-white relative overflow-hidden">
            <div className="relative z-10 grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-4xl md:text-5xl font-bold mb-8">Let's build a life beyond default settings together.</h2>
                <div className="space-y-6 text-gray-300">
                  <p className="flex items-center">
                    <Mail className="h-5 w-5 mr-4 text-teal" /> hello@buildersconnect.org
                  </p>
                  <p className="flex items-center">
                    <Users className="h-5 w-5 mr-4 text-teal" /> Partnership inquiries welcome.
                  </p>
                  <div className="flex space-x-6 pt-6">
                    <Twitter className="h-6 w-6 hover:text-teal cursor-pointer transition-colors" />
                    <Instagram className="h-6 w-6 hover:text-teal cursor-pointer transition-colors" />
                    <Linkedin className="h-6 w-6 hover:text-teal cursor-pointer transition-colors" />
                  </div>
                </div>
              </div>
              <div className="bg-white/5 backdrop-blur-xl p-10 rounded-[2.5rem] border border-white/10 shadow-2xl">
                <h3 className="text-2xl font-bold mb-6">Contact Us</h3>
                <form className="space-y-4">
                  <input type="text" placeholder="Full Name" className="w-full bg-white/10 border border-white/20 rounded-xl px-6 py-4 focus:ring-2 focus:ring-teal outline-none" />
                  <input type="email" placeholder="Email Address" className="w-full bg-white/10 border border-white/20 rounded-xl px-6 py-4 focus:ring-2 focus:ring-teal outline-none" />
                  <textarea placeholder="How can we help?" rows={4} className="w-full bg-white/10 border border-white/20 rounded-xl px-6 py-4 focus:ring-2 focus:ring-teal outline-none"></textarea>
                  <button className="w-full bg-teal text-navy font-black py-4 rounded-full hover:bg-opacity-90 transition-all shadow-xl shadow-teal/10">Send Message</button>
                </form>
              </div>
            </div>
            <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-coral/20 rounded-full blur-[100px]"></div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;