
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { CheckCircle, ArrowLeft, ArrowRight, RotateCcw, Share2, Mail, Lock } from 'lucide-react';
import { QUIZ_QUESTIONS } from '../constants';

const Quiz = () => {
  const [step, setStep] = useState(0); // 0: Start, 1: Questions, 2: Email Gate, 3: Results
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [answers, setAnswers] = useState<Record<string, number>>({
    financial: 0,
    career: 0,
    cultural: 0,
    language: 0,
    mindset: 0
  });

  const totalQuestions = QUIZ_QUESTIONS.length;

  const handleAnswer = (score: number) => {
    const question = QUIZ_QUESTIONS[currentQuestionIndex];
    setAnswers(prev => ({
      ...prev,
      [question.category]: prev[question.category] + score
    }));

    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setStep(2); // Move to Email Gate
    }
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setStep(3); // Move to Results
    }
  };

  const resetQuiz = () => {
    setStep(0);
    setCurrentQuestionIndex(0);
    setEmail('');
    setName('');
    setAnswers({ financial: 0, career: 0, cultural: 0, language: 0, mindset: 0 });
  };

  const chartData = [
    { subject: 'Financial', A: answers.financial * 10, fullMark: 100 },
    { subject: 'Career', A: answers.career * 10, fullMark: 100 },
    { subject: 'Cultural', A: (answers.cultural || 5) * 10, fullMark: 100 },
    { subject: 'Language', A: 40, fullMark: 100 },
    { subject: 'Mindset', A: 60, fullMark: 100 },
  ];

  const overallScore = Math.round(chartData.reduce((acc, curr) => acc + curr.A, 0) / 5);

  return (
    <div className="min-h-screen bg-light py-20">
      <div className="max-w-3xl mx-auto px-4">
        {step === 0 && (
          <div className="bg-white rounded-[2rem] p-12 text-center shadow-xl border border-gray-100">
            <div className="w-20 h-20 bg-teal/10 rounded-3xl flex items-center justify-center mx-auto mb-8">
              <CheckCircle className="h-10 w-10 text-teal" />
            </div>
            <h1 className="text-4xl font-extrabold mb-6">Builders Readiness Quiz</h1>
            <p className="text-gray-600 text-lg mb-10 leading-relaxed">
              Find out how prepared you are to design your life beyond default settings. Receive a personalized action plan and score based on financial readiness, career mobility, and mindset.
            </p>
            <button 
              onClick={() => setStep(1)}
              className="bg-navy text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-opacity-95 transition-all w-full sm:w-auto"
            >
              Start Assessment (Takes 3 mins)
            </button>
          </div>
        )}

        {step === 1 && (
          <div className="bg-white rounded-[2rem] p-12 shadow-xl border border-gray-100">
            <div className="flex justify-between items-center mb-10">
              <span className="text-sm font-bold text-teal uppercase tracking-widest">Question {currentQuestionIndex + 1} of {totalQuestions}</span>
              <div className="w-32 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-teal transition-all duration-300" 
                  style={{ width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` }}
                ></div>
              </div>
            </div>
            
            <h2 className="text-3xl font-bold mb-10">{QUIZ_QUESTIONS[currentQuestionIndex].question}</h2>
            
            <div className="space-y-4">
              {QUIZ_QUESTIONS[currentQuestionIndex].options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAnswer(option.score)}
                  className="w-full text-left p-6 rounded-2xl border-2 border-gray-100 hover:border-teal hover:bg-teal/5 transition-all duration-200 group flex justify-between items-center"
                >
                  <span className="font-semibold text-lg text-gray-700 group-hover:text-navy">{option.text}</span>
                  <ArrowRight className="h-5 w-5 text-gray-300 group-hover:text-teal group-hover:translate-x-1 transition-all" />
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="bg-white rounded-[2rem] p-12 text-center shadow-xl border border-gray-100">
            <div className="w-16 h-16 bg-coral/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Lock className="h-8 w-8 text-coral" />
            </div>
            <h2 className="text-3xl font-extrabold mb-4">Assessment Complete!</h2>
            <p className="text-gray-600 text-lg mb-8 leading-relaxed">
              We've calculated your Readiness Score. Where should we send your personalized Builders Action Plan?
            </p>
            
            <form onSubmit={handleEmailSubmit} className="max-w-md mx-auto space-y-4">
              <input 
                type="text" 
                placeholder="Your First Name" 
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-6 py-4 rounded-2xl bg-light border-none focus:ring-2 focus:ring-teal focus:outline-none"
              />
              <input 
                type="email" 
                placeholder="Email Address" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-6 py-4 rounded-2xl bg-light border-none focus:ring-2 focus:ring-teal focus:outline-none"
              />
              <button 
                type="submit"
                className="w-full bg-navy text-white py-4 rounded-full font-bold text-lg hover:bg-opacity-95 transition-all flex items-center justify-center group"
              >
                <span>Reveal My Results</span>
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <p className="text-xs text-gray-400 mt-4">
                By clicking, you agree to receive the Builders Report and resources. 
                Your data is safe with us. No spam, ever.
              </p>
            </form>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="bg-white rounded-[2rem] p-12 shadow-xl text-center border border-gray-100">
              <h2 className="text-sm font-bold text-teal uppercase tracking-widest mb-2">Welcome {name || 'Builder'}</h2>
              <h3 className="text-4xl font-extrabold mb-8">Ready to Thrive!</h3>
              
              <div className="flex flex-col md:flex-row items-center justify-around mb-12">
                <div className="w-full md:w-1/2 h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                      <PolarGrid stroke="#E5E7EB" />
                      <PolarAngleAxis dataKey="subject" tick={{ fill: '#4B5563', fontSize: 12 }} />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                      <Radar
                        name="Score"
                        dataKey="A"
                        stroke="#00BFA6"
                        fill="#00BFA6"
                        fillOpacity={0.4}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="bg-navy text-white p-10 rounded-3xl w-full md:w-1/3 mt-8 md:mt-0">
                  <div className="text-sm uppercase tracking-widest text-gray-400 mb-2">Overall Preparedness</div>
                  <div className="text-6xl font-black mb-4">{overallScore}%</div>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    You're in a great position! Your career and mindset are strong. Focus on boosting your financial buffer to 6 months.
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <button className="flex items-center justify-center space-x-2 bg-navy text-white py-4 rounded-full font-bold hover:bg-opacity-90">
                  <Mail className="h-5 w-5" />
                  <span>Email Full Action Plan</span>
                </button>
                <button className="flex items-center justify-center space-x-2 bg-light text-navy py-4 rounded-full font-bold hover:bg-gray-200">
                  <Share2 className="h-5 w-5" />
                  <span>Share Results Badge</span>
                </button>
              </div>

              <button 
                onClick={resetQuiz}
                className="mt-8 text-gray-500 hover:text-teal font-semibold flex items-center mx-auto"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Retake Assessment
              </button>
            </div>

            <div className="bg-white rounded-[2rem] p-10 shadow-lg border border-gray-100">
              <h4 className="text-xl font-bold mb-6">Recommended Starter Guides for {name}</h4>
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="p-6 bg-light rounded-2xl flex flex-col justify-between">
                  <div>
                    <h5 className="font-bold mb-2">Digital Nomad Visa Guide</h5>
                    <p className="text-sm text-gray-600 mb-4">Perfect for your current career mobility score.</p>
                  </div>
                  <Link to="/resources" className="text-teal font-bold text-sm hover:underline">Download Free →</Link>
                </div>
                <div className="p-6 bg-light rounded-2xl flex flex-col justify-between">
                  <div>
                    <h5 className="font-bold mb-2">Expat Savings Playbook</h5>
                    <p className="text-sm text-gray-600 mb-4">Learn to manage dual-currency accounts.</p>
                  </div>
                  <Link to="/resources" className="text-teal font-bold text-sm hover:underline">Download Free →</Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Quiz;
