
import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageSquare, Heart, Share2, Search, Filter, 
  Plus, Users, Globe, ArrowRight, X, MessageCircle,
  Zap, Sparkles, Send, ChevronLeft, Bookmark, TrendingUp,
  Brain, Quote as QuoteIcon, ChevronDown, ChevronUp, Reply,
  ChevronRight
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { COMMUNITY_POSTS } from '../constants';
import { CommunityPost, Comment } from '../types';
import { Edit2 } from 'lucide-react';

// Initialize Gemini
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const CommentNode = ({ 
  comment, 
  onReply, 
  onQuote,
  depth = 0 
}: { 
  comment: Comment, 
  onReply: (parentId: string) => void,
  onQuote: (content: string, parentId: string) => void,
  depth?: number,
  key?: React.Key // Added key to the type definition to resolve prop assignment errors in maps
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  return (
    <div className={`mt-6 ${depth > 0 ? 'ml-4 md:ml-8 pl-4 border-l-2 border-gray-100' : ''}`}>
      <div className="flex items-start group">
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="mr-3 mt-1 hover:text-teal transition-colors"
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
        
        <img src={comment.avatar} className="w-10 h-10 rounded-xl mr-4 border border-light shadow-sm shrink-0" alt="" />
        
        <div className="flex-grow">
          <div className="flex items-center space-x-2 mb-1">
            <span className="font-bold text-navy text-sm">{comment.author}</span>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{comment.date}</span>
          </div>

          {!isCollapsed && (
            <>
              <div className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap mb-4 prose-sm max-w-none">
                {comment.content.split('\n').map((line, i) => (
                  line.startsWith('>') ? (
                    <blockquote key={i} className="border-l-4 border-teal/20 pl-4 py-1 my-2 bg-teal/5 text-teal italic rounded-r-lg">
                      {line.replace(/^>+/, '').trim()}
                    </blockquote>
                  ) : (
                    <p key={i}>{line}</p>
                  )
                ))}
              </div>

              <div className="flex items-center space-x-6 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => setIsLiked(!isLiked)}
                  className={`flex items-center text-[10px] font-black uppercase tracking-widest transition-colors ${isLiked ? 'text-coral' : 'text-gray-400 hover:text-coral'}`}
                >
                  <Heart className={`h-3 w-3 mr-1.5 ${isLiked ? 'fill-coral' : ''}`} /> {comment.likes + (isLiked ? 1 : 0)}
                </button>
                <button 
                  onClick={() => onReply(comment.id)}
                  className="flex items-center text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-teal transition-colors"
                >
                  <Reply className="h-3 w-3 mr-1.5" /> Reply
                </button>
                <button 
                  onClick={() => onQuote(comment.content, comment.id)}
                  className="flex items-center text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-teal transition-colors"
                >
                  <QuoteIcon className="h-3 w-3 mr-1.5" /> Quote
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {!isCollapsed && comment.replies.map(reply => (
        <CommentNode 
          key={reply.id} 
          comment={reply} 
          onReply={onReply} 
          onQuote={onQuote}
          depth={depth + 1} 
        />
      ))}
    </div>
  );
};

const Community = () => {
  const [posts, setPosts] = useState<CommunityPost[]>(() => {
    const saved = localStorage.getItem('builders_posts');
    return saved ? JSON.parse(saved) : COMMUNITY_POSTS;
  });
  
  const [activeTopic, setActiveTopic] = useState('All');
  const [sortBy, setSortBy] = useState<'Newest' | 'Most Liked'>('Newest');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPost, setSelectedPost] = useState<CommunityPost | null>(null);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<CommunityPost | null>(null);
  
  const [replyToId, setReplyToId] = useState<string | null>(null);
  const [commentText, setCommentText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // AI Strategist States
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);

  useEffect(() => {
    localStorage.setItem('builders_posts', JSON.stringify(posts));
  }, [posts]);

  const handleLike = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setPosts(prev => prev.map(p => p.id === id ? { ...p, likes: p.likes + 1 } : p));
  };

  const findAndAddReply = (comments: Comment[], targetId: string, newReply: Comment): Comment[] => {
    return comments.map(c => {
      if (c.id === targetId) {
        return { ...c, replies: [...c.replies, newReply] };
      }
      if (c.replies.length > 0) {
        return { ...c, replies: findAndAddReply(c.replies, targetId, newReply) };
      }
      return c;
    });
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPost || !commentText.trim()) return;

    const newComment: Comment = {
      id: `c-${Date.now()}`,
      author: 'You (Builder)',
      avatar: 'https://i.pravatar.cc/150?u=you',
      content: commentText,
      date: 'Just now',
      likes: 0,
      replies: []
    };

    setPosts(prev => prev.map(p => {
      if (p.id === selectedPost.id) {
        const updatedComments = replyToId 
          ? findAndAddReply(p.comments || [], replyToId, newComment)
          : [...(p.comments || []), newComment];
        
        const updatedPost = { ...p, comments: updatedComments, replies: p.replies + 1 };
        setSelectedPost(updatedPost);
        return updatedPost;
      }
      return p;
    }));

    setCommentText('');
    setReplyToId(null);
  };

  const handleQuote = (content: string, targetId: string) => {
    setReplyToId(targetId);
    // Clean up content to remove previous quotes if any, then prepend the quote
    const cleanedContent = content.split('\n').filter(line => !line.startsWith('>')).join(' ').trim();
    setCommentText(`> ${cleanedContent.substring(0, 150)}${cleanedContent.length > 150 ? '...' : ''}\n\n`);
    setTimeout(() => textareaRef.current?.focus(), 50);
  };

  const handleReplyTo = (targetId: string) => {
    setReplyToId(targetId);
    setTimeout(() => textareaRef.current?.focus(), 50);
  };

  const handlePostThread = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newPost: CommunityPost = {
      id: `cp-${Date.now()}`,
      author: 'You (Builder)',
      avatar: 'https://i.pravatar.cc/150?u=you',
      title: formData.get('title') as string,
      content: formData.get('content') as string,
      pillar: formData.get('pillar') as any,
      likes: 0,
      replies: 0,
      date: 'Just now',
      comments: []
    };
    setPosts([newPost, ...posts]);
    setIsPostModalOpen(false);
  };

  const handleEditPost = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingPost) return;
    const formData = new FormData(e.currentTarget);
    const updatedPost = {
      ...editingPost,
      title: formData.get('title') as string,
      content: formData.get('content') as string,
      pillar: formData.get('pillar') as any,
    };
    setPosts(prev => prev.map(p => p.id === editingPost.id ? updatedPost : p));
    if (selectedPost?.id === editingPost.id) setSelectedPost(updatedPost);
    setEditingPost(null);
  };

  const askAiStrategist = async () => {
    if (!aiPrompt) return;
    setIsAiLoading(true);
    setAiResponse('');
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `You are the Lead Strategist for Builders Connect. 
        A user is asking for a community opinion on: "${aiPrompt}". 
        Provide a sophisticated, data-driven perspective covering pros, cons, and a "Network Verdict". 
        Keep it under 150 words and maintain a professional yet empowering tone.`,
      });
      // Correctly accessing text output from GenerateContentResponse as a property
      setAiResponse(response.text || "I'm having trouble connecting to the network intelligence. Please try again.");
    } catch (err) {
      setAiResponse("Network error. The strategist is currently offline.");
    } finally {
      setIsAiLoading(false);
    }
  };

  const filteredPosts = posts.filter(post => {
    const matchesTopic = activeTopic === 'All' || post.pillar === activeTopic;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         post.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTopic && matchesSearch;
  }).sort((a, b) => {
    if (sortBy === 'Most Liked') return b.likes - a.likes;
    // For Newest, we assume higher ID or later date. Since IDs are cp-timestamp, we can use that.
    return b.id.localeCompare(a.id);
  });

  return (
    <div className="bg-light min-h-screen pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {!selectedPost && (
          <div className="mb-12 flex flex-col md:flex-row justify-between items-end gap-6 animate-in fade-in slide-in-from-top-4 duration-700">
            <div>
              <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-teal/10 text-teal text-[10px] font-black uppercase tracking-widest mb-6">
                Live Intelligence Feed
              </div>
              <h1 className="text-5xl md:text-6xl font-extrabold text-navy tracking-tighter">Community Hub</h1>
              <p className="text-xl text-gray-500 max-w-2xl mt-4">
                The world's most active network for designing lives beyond default settings.
              </p>
            </div>
            <button 
              onClick={() => setIsPostModalOpen(true)}
              className="bg-navy text-white px-8 py-4 rounded-full font-black text-xs uppercase tracking-widest flex items-center shadow-xl hover:bg-teal transition-all hover:scale-105 active:scale-95"
            >
              <Plus className="h-4 w-4 mr-2" /> Start Conversation
            </button>
          </div>
        )}

        <div className="grid lg:grid-cols-4 gap-12">
          
          <aside className="lg:col-span-1 space-y-8 animate-in fade-in slide-in-from-left duration-700">
            <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-teal transition-colors" />
                <input 
                  type="text" 
                  placeholder="Search network..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-light rounded-xl border-none focus:ring-2 focus:ring-teal outline-none font-bold text-sm"
                />
              </div>
            </div>

            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
              <h3 className="text-[10px] font-black text-navy uppercase tracking-[0.2em] mb-6">Sort By</h3>
              <div className="flex gap-2">
                {['Newest', 'Most Liked'].map(opt => (
                  <button
                    key={opt}
                    onClick={() => setSortBy(opt as any)}
                    className={`flex-grow py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                      sortBy === opt ? 'bg-navy text-white shadow-lg' : 'bg-light text-gray-400 hover:text-navy'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
              <nav className="space-y-2">
                {[
                  { id: 'All', label: 'All Insights' },
                  { id: 'Live', label: 'Relocation (Live)' },
                  { id: 'Earn', label: 'Career (Earn)' },
                  { id: 'Grow', label: 'Mindset (Grow)' }
                ].map(topic => (
                  <button
                    key={topic.id}
                    onClick={() => { setActiveTopic(topic.id); setSelectedPost(null); }}
                    className={`w-full flex items-center justify-between px-5 py-4 rounded-2xl font-bold text-sm transition-all ${
                      activeTopic === topic.id 
                        ? 'bg-teal text-navy shadow-lg shadow-teal/20' 
                        : 'text-gray-400 hover:bg-light hover:text-navy'
                    }`}
                  >
                    <span>{topic.label}</span>
                    {activeTopic === topic.id && <ArrowRight className="h-4 w-4" />}
                  </button>
                ))}
              </nav>
            </div>

            <div className="bg-navy rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl group">
              <div className="relative z-10">
                <div className="flex items-center space-x-2 mb-6">
                  <Sparkles className="h-5 w-5 text-teal" />
                  <h4 className="text-xl font-black tracking-tight">AI Strategist</h4>
                </div>
                <p className="text-gray-400 text-xs mb-6 leading-relaxed italic">"Get a multi-perspective opinion on any global topic instantly."</p>
                
                <div className="space-y-4">
                  <textarea 
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    placeholder="e.g. Is Lisbon still viable for 2025?"
                    className="w-full bg-white/10 border border-white/20 rounded-xl p-4 text-xs font-medium placeholder:text-white/20 focus:ring-2 focus:ring-teal outline-none"
                    rows={2}
                  />
                  <button 
                    onClick={askAiStrategist}
                    disabled={isAiLoading || !aiPrompt}
                    className="w-full bg-teal text-navy py-3 rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-white transition-all disabled:opacity-50 flex items-center justify-center"
                  >
                    {isAiLoading ? 'Analyzing Network...' : 'Generate Opinion'}
                    {!isAiLoading && <Zap className="ml-2 h-3 w-3" />}
                  </button>
                </div>

                {aiResponse && (
                  <div className="mt-6 p-4 bg-white/5 rounded-2xl border border-white/10 animate-in zoom-in duration-300">
                    <p className="text-[11px] leading-relaxed text-gray-300 whitespace-pre-wrap">{aiResponse}</p>
                    <div className="mt-3 flex justify-between items-center text-[9px] font-black text-teal uppercase tracking-widest">
                      <span>Network Verdict</span>
                      <Sparkles className="h-3 w-3" />
                    </div>
                  </div>
                )}
              </div>
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <Brain className="w-24 h-24" />
              </div>
            </div>
          </aside>

          <div className="lg:col-span-3 space-y-6">
            {selectedPost ? (
              <div className="animate-in slide-in-from-right duration-500">
                <button 
                  onClick={() => setSelectedPost(null)}
                  className="mb-8 flex items-center text-navy font-black text-xs uppercase tracking-widest hover:text-teal transition-colors"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" /> Back to Feed
                </button>

                <div className="bg-white p-10 md:p-14 rounded-[4rem] border border-gray-100 shadow-xl relative">
                  <div className="flex items-center justify-between mb-10">
                    <div className="flex items-center">
                      <img src={selectedPost.avatar} className="w-16 h-16 rounded-[2rem] mr-5 border-4 border-light shadow-sm" alt="" />
                      <div>
                        <h4 className="text-xl font-black text-navy">{selectedPost.author}</h4>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{selectedPost.date}</p>
                      </div>
                    </div>
                    <div className="flex space-x-3">
                       <button 
                         onClick={() => setEditingPost(selectedPost)}
                         className="p-4 bg-light rounded-2xl text-navy hover:text-teal transition-all"
                       >
                         <Edit2 className="h-5 w-5" />
                       </button>
                       <button className="p-4 bg-light rounded-2xl text-navy hover:text-teal transition-all"><Bookmark className="h-5 w-5" /></button>
                       <button className="p-4 bg-light rounded-2xl text-navy hover:text-coral transition-all"><Share2 className="h-5 w-5" /></button>
                    </div>
                  </div>

                  <h2 className="text-3xl md:text-4xl font-black text-navy mb-6 tracking-tight leading-tight">
                    {selectedPost.title}
                  </h2>
                  <p className="text-xl text-gray-600 leading-relaxed mb-12 border-l-4 border-teal/20 pl-8">
                    {selectedPost.content}
                  </p>

                  <div className="flex items-center space-x-8 mb-12 py-6 border-y border-gray-50">
                    <button 
                      onClick={(e) => handleLike(selectedPost.id, e)}
                      className="flex items-center text-sm font-black text-navy hover:text-coral transition-colors"
                    >
                      <Heart className="h-5 w-5 mr-2" /> {selectedPost.likes} Endorsements
                    </button>
                    <div className="flex items-center text-sm font-black text-gray-400">
                      <MessageCircle className="h-5 w-5 mr-2" /> {selectedPost.replies} Insights
                    </div>
                  </div>

                  <div className="space-y-12">
                    <h3 className="text-2xl font-black text-navy tracking-tight">Community Intelligence</h3>
                    
                    <div className="space-y-2">
                      {selectedPost.comments && selectedPost.comments.length > 0 ? (
                        selectedPost.comments.map(c => (
                          <CommentNode 
                            key={c.id} 
                            comment={c} 
                            onReply={handleReplyTo} 
                            onQuote={handleQuote} 
                          />
                        ))
                      ) : (
                        <div className="py-12 text-center bg-light rounded-3xl border border-dashed border-gray-200">
                          <MessageCircle className="h-10 w-10 text-gray-200 mx-auto mb-4" />
                          <p className="text-gray-400 font-bold">Be the first to offer an insight.</p>
                        </div>
                      )}
                    </div>

                    <div id="reply-form" className="mt-12 bg-navy rounded-[3rem] p-8 md:p-12 text-white shadow-2xl relative overflow-hidden">
                        <div className="relative z-10">
                          <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center space-x-3">
                              <MessageSquare className="h-6 w-6 text-teal" />
                              <h4 className="text-2xl font-black tracking-tight">
                                {replyToId ? 'Add a Counter-Insight' : 'Share Your Opinion'}
                              </h4>
                            </div>
                            {replyToId && (
                              <button 
                                onClick={() => { setReplyToId(null); setCommentText(''); }}
                                className="text-xs font-black uppercase text-coral hover:text-white transition-colors flex items-center"
                              >
                                <X className="h-3 w-3 mr-1" /> Cancel Reply
                              </button>
                            )}
                          </div>
                          
                          <div className="relative">
                            <textarea 
                              ref={textareaRef}
                              value={commentText}
                              onChange={(e) => setCommentText(e.target.value)}
                              placeholder={replyToId ? "Type your reply..." : "Add your strategic insight to the network..."}
                              className="w-full bg-white/5 border border-white/10 rounded-[2rem] p-8 text-white placeholder:text-white/20 focus:ring-4 focus:ring-teal/20 outline-none transition-all mb-4 text-lg font-medium leading-relaxed shadow-inner"
                              rows={5}
                            />
                            <button 
                              onClick={handleAddComment}
                              disabled={!commentText.trim()}
                              className="absolute bottom-6 right-6 p-6 bg-teal text-navy rounded-3xl hover:scale-110 active:scale-95 transition-all shadow-2xl shadow-teal/30 disabled:opacity-50 group"
                            >
                              <Send className="h-6 w-6 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                            </button>
                          </div>
                          <div className="flex items-center justify-center space-x-6 mt-6 opacity-30">
                            <span className="text-[10px] font-black uppercase tracking-[0.3em]">No Spam</span>
                            <span className="text-[10px] font-black uppercase tracking-[0.3em]">•</span>
                            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Professional Tone Only</span>
                          </div>
                        </div>
                        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-teal/10 rounded-full blur-[120px]"></div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6 animate-in fade-in duration-1000">
                {filteredPosts.length > 0 ? (
                  filteredPosts.map(post => (
                    <div 
                      key={post.id} 
                      onClick={() => setSelectedPost(post)}
                      className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm hover:shadow-2xl transition-all group cursor-pointer relative overflow-hidden"
                    >
                      <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center">
                          <img src={post.avatar} className="w-12 h-12 rounded-2xl mr-4 border-2 border-light shadow-sm" alt="" />
                          <div>
                            <h4 className="font-bold text-navy">{post.author}</h4>
                            <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">{post.date}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button 
                            onClick={(e) => { e.stopPropagation(); setEditingPost(post); }}
                            className="p-2 bg-light rounded-lg text-navy hover:text-teal transition-all opacity-0 group-hover:opacity-100"
                          >
                            <Edit2 className="h-3 w-3" />
                          </button>
                          <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase ${
                            post.pillar === 'Live' ? 'bg-navy text-white' : post.pillar === 'Earn' ? 'bg-teal text-white' : 'bg-coral text-white'
                          }`}>
                            {post.pillar}
                          </span>
                        </div>
                      </div>
                      
                      <h3 className="text-2xl font-bold text-navy mb-4 leading-tight group-hover:text-teal transition-colors tracking-tight">
                        {post.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed mb-10 line-clamp-2">{post.content}</p>
                      
                      <div className="flex items-center space-x-6 pt-6 border-t border-gray-50">
                        <button 
                          onClick={(e) => handleLike(post.id, e)}
                          className="flex items-center text-xs font-bold text-gray-400 hover:text-coral transition-colors"
                        >
                          <Heart className={`h-4 w-4 mr-2 ${post.likes > 0 ? 'fill-coral text-coral' : ''}`} /> 
                          {post.likes}
                        </button>
                        <button className="flex items-center text-xs font-bold text-gray-400 hover:text-navy transition-colors">
                          <MessageCircle className="h-4 w-4 mr-2" /> {post.replies} Replies
                        </button>
                        <button className="flex items-center text-xs font-bold text-teal transition-colors ml-auto group-hover:translate-x-1 duration-300">
                          Join Conversation <ArrowRight className="ml-1 h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="bg-white rounded-[4rem] p-24 text-center border border-dashed border-gray-200">
                     <Users className="h-16 w-16 text-gray-200 mx-auto mb-6" />
                     <h3 className="text-2xl font-black text-navy">No threads found in {activeTopic}.</h3>
                     <p className="text-gray-500 mt-2">Try a different filter or start your own discussion.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {isPostModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-navy/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-[3rem] p-10 md:p-14 max-w-2xl w-full shadow-2xl relative">
            <button 
              onClick={() => setIsPostModalOpen(false)}
              className="absolute top-10 right-10 text-gray-400 hover:text-navy transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
            <h2 className="text-4xl font-black text-navy mb-2 tracking-tighter">New Thread</h2>
            <p className="text-gray-500 mb-10 text-lg">Contribute your wisdom to the network.</p>
            
            <form className="space-y-6" onSubmit={handlePostThread}>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Discussion Headline</label>
                <input 
                  name="title"
                  required
                  type="text" 
                  placeholder="e.g. My 2025 Strategy for Berlin Relocation..." 
                  className="w-full bg-light rounded-2xl px-6 py-5 border-none focus:ring-2 focus:ring-teal outline-none font-bold text-lg"
                />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Strategic Pillar</label>
                  <select name="pillar" className="w-full bg-light rounded-2xl px-6 py-5 border-none focus:ring-2 focus:ring-teal outline-none font-bold appearance-none">
                    <option value="Live">Relocation (Live)</option>
                    <option value="Earn">Career (Earn)</option>
                    <option value="Grow">Mindset (Grow)</option>
                  </select>
                </div>
                <div className="flex items-end">
                   <div className="p-5 bg-teal/10 rounded-2xl flex items-center space-x-3 w-full">
                      <TrendingUp className="h-5 w-5 text-teal" />
                      <span className="text-[9px] font-black text-navy uppercase">Trending Topic</span>
                   </div>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Share the Detail</label>
                <textarea 
                  name="content"
                  required
                  rows={5} 
                  placeholder="Go deep into your strategy, tips, or questions..." 
                  className="w-full bg-light rounded-2xl px-6 py-5 border-none focus:ring-2 focus:ring-teal outline-none font-medium leading-relaxed"
                ></textarea>
              </div>
              <button 
                type="submit"
                className="w-full bg-navy text-white py-6 rounded-full font-black text-xl shadow-xl hover:bg-teal transition-all flex items-center justify-center active:scale-95"
              >
                Launch Thread <ArrowRight className="ml-2 h-6 w-6" />
              </button>
            </form>
          </div>
        </div>
      )}

      {editingPost && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-navy/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-[3rem] p-10 md:p-14 max-w-2xl w-full shadow-2xl relative">
            <button 
              onClick={() => setEditingPost(null)}
              className="absolute top-10 right-10 text-gray-400 hover:text-navy transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
            <h2 className="text-4xl font-black text-navy mb-2 tracking-tighter">Edit Thread</h2>
            <p className="text-gray-500 mb-10 text-lg">Refine your strategic contribution.</p>
            
            <form className="space-y-6" onSubmit={handleEditPost}>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Discussion Headline</label>
                <input 
                  name="title"
                  required
                  type="text" 
                  defaultValue={editingPost.title}
                  className="w-full bg-light rounded-2xl px-6 py-5 border-none focus:ring-2 focus:ring-teal outline-none font-bold text-lg"
                />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Strategic Pillar</label>
                  <select name="pillar" defaultValue={editingPost.pillar} className="w-full bg-light rounded-2xl px-6 py-5 border-none focus:ring-2 focus:ring-teal outline-none font-bold appearance-none">
                    <option value="Live">Relocation (Live)</option>
                    <option value="Earn">Career (Earn)</option>
                    <option value="Grow">Mindset (Grow)</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Share the Detail</label>
                <textarea 
                  name="content"
                  required
                  rows={5} 
                  defaultValue={editingPost.content}
                  className="w-full bg-light rounded-2xl px-6 py-5 border-none focus:ring-2 focus:ring-teal outline-none font-medium leading-relaxed"
                ></textarea>
              </div>
              <button 
                type="submit"
                className="w-full bg-navy text-white py-6 rounded-full font-black text-xl shadow-xl hover:bg-teal transition-all flex items-center justify-center active:scale-95"
              >
                Save Changes <ArrowRight className="ml-2 h-6 w-6" />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Community;
