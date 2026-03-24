import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, MessageSquare, Phone, MapPin, Send, CheckCircle, Heart, Star, Globe, Shield } from 'lucide-react';
import { DONATION_TIERS } from '../constants';

const Contact = () => {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    subject: 'General Inquiry',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate API call
    setIsSubmitted(true);
    setTimeout(() => {
      setFormState({ name: '', email: '', subject: 'General Inquiry', message: '' });
      setIsSubmitted(false);
    }, 5000);
  };

  return (
    <div className="bg-white min-h-screen pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-20 mb-32">
          {/* Contact Info */}
          <div className="animate-in fade-in slide-in-from-left duration-700">
            <h1 className="text-5xl md:text-6xl font-extrabold text-navy mb-8 leading-tight tracking-tighter uppercase">
              Get in touch with the <span className="text-teal">Builders Connect Team.</span>
            </h1>
            <p className="text-xl text-gray-500 mb-12 leading-relaxed">
              Have questions about mobility, wealth creation, or personal evolution? Our team is here to help you design a life beyond default settings.
            </p>

            <div className="grid sm:grid-cols-2 gap-6">
              <div className="flex flex-col items-start p-6 bg-light rounded-3xl border border-gray-100 group hover:border-teal transition-all shadow-sm">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm group-hover:bg-teal group-hover:text-white transition-all mb-4">
                  <Mail className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="text-lg font-black text-navy mb-1 uppercase tracking-tight">General Support</h4>
                  <p className="text-gray-500 font-medium text-sm">hello@buildersconnect.org</p>
                  <p className="text-[10px] text-gray-400 mt-1">Response: ~4 hours</p>
                </div>
              </div>

              <div className="flex flex-col items-start p-6 bg-light rounded-3xl border border-gray-100 group hover:border-teal transition-all shadow-sm">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm group-hover:bg-teal group-hover:text-white transition-all mb-4">
                  <Mail className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="text-lg font-black text-navy mb-1 uppercase tracking-tight">Podcast Inquiries</h4>
                  <p className="text-gray-500 font-medium text-sm">ff_podcast@buildersconnect.org</p>
                  <p className="text-[10px] text-gray-400 mt-1">Guest requests</p>
                </div>
              </div>

              <div className="flex flex-col items-start p-6 bg-light rounded-3xl border border-gray-100 group hover:border-teal transition-all shadow-sm">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm group-hover:bg-teal group-hover:text-white transition-all mb-4">
                  <MessageSquare className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="text-lg font-black text-navy mb-1 uppercase tracking-tight">Strategy Chat</h4>
                  <p className="text-gray-500 font-medium text-sm">Elite Members Only</p>
                  <p className="text-[10px] text-gray-400 mt-1">Mon-Fri, 9am-6pm</p>
                </div>
              </div>

              <div className="flex flex-col items-start p-6 bg-light rounded-3xl border border-gray-100 group hover:border-teal transition-all shadow-sm">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm group-hover:bg-teal group-hover:text-white transition-all mb-4">
                  <MapPin className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="text-lg font-black text-navy mb-1 uppercase tracking-tight">Global Presence</h4>
                  <p className="text-gray-500 font-medium text-sm">Dubai • Berlin • Singapore</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="animate-in fade-in slide-in-from-right duration-700">
            <div className="bg-navy rounded-[3rem] p-10 md:p-14 text-white shadow-2xl relative overflow-hidden">
              <div className="relative z-10">
                {isSubmitted ? (
                  <div className="text-center py-20 animate-in zoom-in duration-500">
                    <div className="w-20 h-20 bg-teal rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl">
                      <CheckCircle className="h-10 w-10 text-navy" />
                    </div>
                    <h2 className="text-3xl font-black mb-4">Message Received!</h2>
                    <p className="text-gray-400 text-lg">We'll get back to you shortly. A global strategist has been notified.</p>
                  </div>
                ) : (
                  <>
                    <h3 className="text-3xl font-bold mb-8">Send a Message</h3>
                    <form className="space-y-6" onSubmit={handleSubmit}>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-teal uppercase tracking-widest">Full Name</label>
                          <input 
                            required
                            type="text" 
                            className="w-full bg-white/10 border border-white/20 rounded-xl px-6 py-4 focus:ring-2 focus:ring-teal outline-none transition-all placeholder:text-white/20" 
                            placeholder="John Doe"
                            value={formState.name}
                            onChange={(e) => setFormState({...formState, name: e.target.value})}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-teal uppercase tracking-widest">Email Address</label>
                          <input 
                            required
                            type="email" 
                            className="w-full bg-white/10 border border-white/20 rounded-xl px-6 py-4 focus:ring-2 focus:ring-teal outline-none transition-all placeholder:text-white/20" 
                            placeholder="john@example.com"
                            value={formState.email}
                            onChange={(e) => setFormState({...formState, email: e.target.value})}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-teal uppercase tracking-widest">Inquiry Type</label>
                        <select 
                          className="w-full bg-white/10 border border-white/20 rounded-xl px-6 py-4 focus:ring-2 focus:ring-teal outline-none transition-all appearance-none"
                          value={formState.subject}
                          onChange={(e) => setFormState({...formState, subject: e.target.value})}
                        >
                          <option className="bg-navy" value="General Inquiry">General Inquiry</option>
                          <option className="bg-navy" value="Press">Press & Media Request</option>
                          <option className="bg-navy" value="Podcast">Podcast Guest Request</option>
                          <option className="bg-navy" value="Speaking">Speaking Request</option>
                          <option className="bg-navy" value="Partner">Partner with Us</option>
                          <option className="bg-navy" value="Resource Request">Resource Request</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-teal uppercase tracking-widest">Your Message</label>
                        <textarea 
                          required
                          rows={5} 
                          className="w-full bg-white/10 border border-white/20 rounded-xl px-6 py-4 focus:ring-2 focus:ring-teal outline-none transition-all placeholder:text-white/20" 
                          placeholder="How can we help?"
                          value={formState.message}
                          onChange={(e) => setFormState({...formState, message: e.target.value})}
                        ></textarea>
                      </div>
                      <button 
                        type="submit"
                        className="w-full bg-teal text-navy font-black py-5 rounded-full hover:bg-white hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center shadow-xl shadow-teal/20"
                      >
                        Send Message <Send className="ml-2 h-4 w-4" />
                      </button>
                    </form>
                  </>
                )}
              </div>
              <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-teal/10 rounded-full blur-[100px]"></div>
              <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-coral/10 rounded-full blur-[100px]"></div>
            </div>
          </div>
        </div>

        {/* Donate / Sustain Section */}
        <section className="bg-light rounded-[4rem] p-12 md:p-20 shadow-sm border border-gray-100">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="w-16 h-16 bg-coral/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="h-8 w-8 text-coral fill-coral/20" />
            </div>
            <h2 className="text-4xl font-black text-navy mb-4 tracking-tighter">Sustain the Mission</h2>
            <p className="text-gray-500 text-lg leading-relaxed">
              We provide 90% of our strategy content for free. Your support helps us keep the mission alive and the research expanding.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {DONATION_TIERS.map(tier => (
              <div key={tier.id} className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-50 hover:shadow-xl hover:-translate-y-2 transition-all flex flex-col group">
                <div className="flex justify-between items-start mb-6">
                  <h3 className={`text-xl font-black uppercase tracking-tight text-${tier.color}`}>{tier.name}</h3>
                  <div className="text-3xl font-black text-navy">${tier.amount}</div>
                </div>
                <p className="text-gray-500 text-sm mb-8 flex-grow leading-relaxed">{tier.description}</p>
                <div className="space-y-3 mb-10">
                  {tier.perks.map(perk => (
                    <div key={perk} className="flex items-center text-xs font-bold text-navy">
                      <CheckCircle className={`h-3.5 w-3.5 mr-2 text-${tier.color}`} /> {perk}
                    </div>
                  ))}
                </div>
                <Link to="/donate" className={`w-full py-4 rounded-full font-black text-xs uppercase tracking-widest bg-${tier.color} text-white shadow-lg hover:brightness-110 transition-all text-center`}>
                  Support Now
                </Link>
              </div>
            ))}
          </div>

          <div className="mt-16 pt-16 border-t border-gray-200 grid md:grid-cols-2 gap-12 items-center">
            <div className="flex items-start space-x-6">
              <div className="w-14 h-14 bg-navy rounded-2xl flex items-center justify-center shrink-0 shadow-lg">
                <Shield className="h-7 w-7 text-teal" />
              </div>
              <div>
                <h4 className="text-xl font-black text-navy mb-2">Transparency First</h4>
                <p className="text-gray-500 text-sm leading-relaxed">
                  Every dollar goes directly into technical infrastructure, visa guide updates, and the "Future Foundations" research fund. No hidden agent commissions.
                </p>
              </div>
            </div>
            <div className="bg-navy p-8 rounded-[2.5rem] text-white flex items-center justify-between shadow-2xl">
              <div>
                <div className="text-[10px] font-black text-teal uppercase tracking-widest mb-1">Impact to Date</div>
                <div className="text-3xl font-black">$145,280</div>
              </div>
              <div className="text-right">
                <div className="text-[10px] font-black text-coral uppercase tracking-widest mb-1">Target Met</div>
                <div className="text-3xl font-black">75%</div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Contact;