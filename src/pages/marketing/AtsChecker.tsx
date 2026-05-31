import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../lib/api';
import { useAuthStore } from '../../store/useAuthStore';
import { cn } from '../../lib/utils';
import type { ATSAnalysis } from '../../hooks/useAIOptimizer';

export default function AtsChecker() {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'upload' | 'paste'>('upload');
  const [file, setFile] = useState<File | null>(null);
  const [pastedText, setPastedText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [loadingText, setLoadingText] = useState('Parsing keywords and formatting...');
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [analysisResults, setAnalysisResults] = useState<ATSAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Handle score counting animation when results are displayed
  useEffect(() => {
    if (!showResults || !analysisResults) return;
    
    setScore(0);
    const targetScore = analysisResults.score;
    let current = 0;
    
    const interval = setInterval(() => {
      if (current >= targetScore) {
        clearInterval(interval);
      } else {
        current++;
        setScore(current);
      }
    }, 20);
    
    return () => clearInterval(interval);
  }, [showResults, analysisResults]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError(null);
    }
  };

  const startAnalysis = async () => {
    if (activeTab === 'upload' && !file) {
        setError("Please select a file to upload.");
        return;
    }

    if (activeTab === 'paste' && !pastedText.trim()) {
        setError("Please paste your resume text.");
        return;
    }

    // Scroll to top smoothly
    window.scrollTo({ top: 0, behavior: 'smooth' });

    setIsAnalyzing(true);
    setShowResults(false);
    setError(null);
    setLoadingText('Parsing keywords and formatting...');

    try {
        let results: ATSAnalysis;
        const deviceInfo = `${navigator.platform} - ${navigator.vendor}`;

        if (!user) {
            // Guest Flow
            setLoadingText('Running guest analysis (1/day)...');
            
            let payload: any = {
                target_profession: "Professional",
                device_info: deviceInfo
            };

            if (activeTab === 'upload' && file) {
                // For guest upload, we still need to parse text first or use a combined guest endpoint
                // Let's assume for simplicity we parse text as guest if possible, but our current 
                // parse-resume requires login. Let's stick to pasted text for guests for now
                // OR we can make parse-resume public too. 
                // Let's stick to the prompt's intent: "user can use AtsChecker.tsx once per ip a day"
                
                const formData = new FormData();
                formData.append('file', file);
                const parseResp = await api.post<{parsed_resume: any}>('/v1/ai/parse-resume', formData);
                payload.resume_data = parseResp.parsed_resume;
            } else {
                payload.resume_text = pastedText;
            }

            results = await api.post<ATSAnalysis>('/v1/ai/guest-analyze-ats', payload);
        } else {
            // Authenticated Flow
            let resumeData: any;

            if (activeTab === 'upload' && file) {
                setLoadingText('Uploading and extracting text...');
                const formData = new FormData();
                formData.append('file', file);
                const parseResp = await api.post<{parsed_resume: any}>('/v1/ai/parse-resume', formData);
                resumeData = parseResp.parsed_resume;
            } else {
                resumeData = { blocks: { "text-1": { type: 'text', data: { content: pastedText } } } };
            }

            setLoadingText('Running deep-scan for ATS compatibility...');
            results = await api.post<ATSAnalysis>('/v1/ai/analyze-ats', {
                resume_data: resumeData,
                target_profession: "Professional",
                device_info: deviceInfo
            });
        }

        setAnalysisResults(results);
        setIsAnalyzing(false);
        setShowResults(true);
    } catch (err: any) {
        console.error("ATS Analysis failed", err);
        if (err.status === 429) {
            setError("You have reached your daily guest limit. Please login for unlimited scans.");
        } else {
            setError("Analysis failed. Please try again or login.");
        }
        setIsAnalyzing(false);
    }
  };

  const handleNewScan = () => {
    setFile(null);
    setPastedText('');
    setShowResults(false);
    setAnalysisResults(null);
    setScore(0);
    setActiveTab('upload');
    setError(null);
  };

  // SVG progress ring calculations
  const circumference = 264; 
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <>
      <main className="flex-grow">
        {/* HERO & INPUT VIEW (Initial View) */}
        {!isAnalyzing && !showResults && (
          <div id="initial-view" className="animate-slide-up">
            {/* Hero Section */}
            <section id="hero-section" className="pt-16 pb-12 text-center px-6 max-w-4xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-display font-bold text-slate-900 mb-4 leading-tight">
                Check How <span className="text-indigo-600">ATS-Friendly</span><br />Your Resume Is
              </h1>
              <p className="text-slate-500 text-lg mb-8 max-w-2xl mx-auto font-medium">
                Don't let a bot reject your application. Upload your resume to get an instant analysis of your
                keywords, formatting, and readability.
              </p>

              {error && (
                  <div className="max-w-md mx-auto mb-8 p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm font-bold flex items-center justify-center gap-2 animate-shake">
                      <i className="fa-solid fa-circle-exclamation"></i>
                      <span>{error}</span>
                      {!user && (
                          <Link to="/login" className="underline ml-2">Login Now</Link>
                      )}
                  </div>
              )}

              <div className="flex flex-wrap justify-center gap-6 mb-10 text-sm font-semibold text-slate-600">
                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-slate-200 animate-pulse-slow">
                  <i className="fa-solid fa-check-circle text-green-500"></i> Keyword Match
                </div>
                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-slate-200 animate-pulse-slow">
                  <i className="fa-solid fa-check-circle text-green-500"></i> Formatting Check
                </div>
                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-slate-200 animate-pulse-slow">
                  <i className="fa-solid fa-check-circle text-green-500"></i> Readability Score
                </div>
              </div>
            </section>

            {/* Resume Input Section */}
            <section id="input-section" className="px-6 pb-20">
              <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden transform hover:scale-[1.01] transition-transform duration-500">
                {/* Tabs Header */}
                <div className="flex border-b border-slate-100 bg-slate-50/50">
                  <button
                    type="button"
                    className={`flex-1 py-4 text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer ${
                      activeTab === 'upload'
                        ? 'font-bold text-indigo-600 border-b-2 border-indigo-600 bg-white'
                        : 'font-medium text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                    }`}
                    onClick={() => setActiveTab('upload')}
                  >
                    <i className="fa-solid fa-cloud-arrow-up"></i> Upload Resume
                  </button>
                  <button
                    type="button"
                    className={`flex-1 py-4 text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer ${
                      activeTab === 'paste'
                        ? 'font-bold text-indigo-600 border-b-2 border-indigo-600 bg-white'
                        : 'font-medium text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                    }`}
                    onClick={() => setActiveTab('paste')}
                  >
                    <i className="fa-solid fa-paste"></i> Paste Text
                  </button>
                </div>

                <div className="p-8">
                  {/* Tab A: Upload */}
                  {activeTab === 'upload' && (
                    <div id="tab-upload" className="tab-content active">
                      <div
                        className="border-2 border-dashed border-slate-300 rounded-xl h-64 flex flex-col items-center justify-center bg-slate-50/50 hover:bg-indigo-50/20 hover:border-indigo-400 transition-all cursor-pointer group relative"
                        id="dropzone"
                      >
                        <input
                          type="file"
                          accept=".pdf,.docx,.txt"
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                          onChange={handleFileUpload}
                        />

                        {file ? (
                          /* Success State */
                          <div className="text-center" id="upload-success">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600 text-2xl animate-bounce">
                              <i className="fa-solid fa-check"></i>
                            </div>
                            <h3 className="text-lg font-bold text-slate-800" id="filename-display">
                              {file.name}
                            </h3>
                            <p className="text-green-600 text-sm mt-1 font-medium">Ready for analysis</p>
                          </div>
                        ) : (
                          /* Default State */
                          <div className="text-center group-hover:-translate-y-1 transition-transform duration-300" id="upload-prompt">
                            <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center mx-auto mb-4 text-indigo-600 text-2xl group-hover:scale-110 transition-transform shadow-indigo-100">
                              <i className="fa-solid fa-file-arrow-up"></i>
                            </div>
                            <h3 className="text-lg font-bold text-slate-800">Drag & Drop or Click to Upload</h3>
                            <p className="text-slate-500 text-sm mt-1">Supports PDF, DOCX, TXT (Max 5MB)</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Tab B: Paste */}
                  {activeTab === 'paste' && (
                    <div id="tab-paste" className="tab-content active animate-fade-in">
                      <textarea
                        value={pastedText}
                        onChange={(e) => setPastedText(e.target.value)}
                        className="w-full h-64 p-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none resize-none text-sm leading-relaxed text-slate-700"
                        placeholder="Copy and paste your resume content here..."
                      ></textarea>
                    </div>
                  )}

                  {/* ANALYZE BUTTON */}
                  <div className="mt-8">
                    <button
                      type="button"
                      onClick={startAnalysis}
                      className="w-full py-4 rounded-xl bg-gradient-to-r from-slate-900 to-slate-800 hover:from-slate-800 hover:to-slate-700 text-white font-bold text-lg shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-3 relative overflow-hidden group cursor-pointer"
                    >
                      <span className="relative z-10 group-hover:hidden">Analyze Resume</span>
                      <span className="relative z-10 hidden group-hover:inline">
                        Start Free Scan <i className="fa-solid fa-arrow-right ml-1"></i>
                      </span>
                      <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                    </button>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* LOADING STATE (Overlay) */}
        {isAnalyzing && (
          <div id="loading-overlay" className="fixed inset-0 bg-white z-50 flex flex-col items-center justify-center animate-fade-in">
            <div className="relative w-64 h-80 border-2 border-slate-200 rounded-lg bg-white shadow-xl overflow-hidden mb-8 scale-75 md:scale-100">
              {/* Mock Resume Lines */}
              <div className="p-6 space-y-4">
                <div className="w-20 h-20 bg-slate-100 rounded-full mb-4"></div>
                <div className="w-3/4 h-4 bg-slate-200 rounded"></div>
                <div className="w-1/2 h-4 bg-slate-200 rounded"></div>
                <div className="space-y-2 pt-4">
                  <div className="w-full h-2 bg-slate-100 rounded"></div>
                  <div className="w-full h-2 bg-slate-100 rounded"></div>
                  <div className="w-full h-2 bg-slate-100 rounded"></div>
                  <div className="w-3/4 h-2 bg-slate-100 rounded"></div>
                </div>
                <div className="space-y-2 pt-4">
                  <div className="w-full h-2 bg-slate-100 rounded"></div>
                  <div className="w-full h-2 bg-slate-100 rounded"></div>
                </div>
              </div>
              {/* Scanning Line */}
              <div className="absolute top-0 left-0 w-full h-1 bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.8)] animate-scan-line"></div>
            </div>

            <h2 className="text-2xl font-display font-bold text-slate-900 mb-2">Analyzing Resume...</h2>
            <div id="loading-text" className="text-slate-500 text-sm font-bold h-6 overflow-hidden animate-pulse">
              {loadingText}
            </div>
          </div>
        )}

        {/* RESULTS DASHBOARD */}
        {showResults && analysisResults && (
          <section id="results-dashboard" className="container mx-auto px-6 py-12 pb-24 animate-fade-in">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 animate-slide-up">
              <div>
                <h2 className="text-3xl font-bold text-slate-900">Analysis Report</h2>
                <p className="text-slate-500 text-sm">Scan completed just now</p>
              </div>
              <div className="mt-4 md:mt-0 flex gap-3">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <i className="fa-solid fa-download mr-2"></i> Print Report
                </button>
                <button
                  type="button"
                  onClick={handleNewScan}
                  className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors shadow-lg cursor-pointer"
                >
                  <i className="fa-solid fa-plus mr-2"></i> New Scan
                </button>
              </div>
            </div>

            {/* Top Row: Score & Summary */}
            <div className="grid lg:grid-cols-3 gap-8 mb-8">
              {/* Score Card */}
              <div className="bg-white rounded-2xl p-8 card-shadow text-center border border-slate-100 animate-slide-up relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 via-yellow-500 to-green-500"></div>
                <h3 className="text-slate-500 font-bold text-xs uppercase tracking-wider mb-6">Overall ATS Score</h3>

                <div className="relative w-48 h-48 mx-auto mb-6">
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    <circle className="text-slate-100" strokeWidth="8" stroke="currentColor" fill="transparent" r="42" cx="50" cy="50" />
                    <circle
                      className="progress-ring__circle text-indigo-600 transition-all duration-300"
                      strokeWidth="8"
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="transparent"
                      r="42"
                      cx="50"
                      cy="50"
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeDashoffset}
                      id="score-ring"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-6xl font-display font-bold text-slate-900 tracking-tighter" id="score-counter">
                      {score}
                    </span>
                    <span className="text-sm font-medium text-slate-400">/100</span>
                  </div>
                </div>

                <div className={cn(
                    "inline-block px-4 py-1.5 rounded-full font-bold text-sm mb-4",
                    score >= 80 ? "bg-green-100 text-green-800" : score >= 50 ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800"
                )}>
                  {score >= 80 ? 'Good' : score >= 50 ? 'Needs Improvement' : 'Critical Issues'}
                </div>
                <p className="text-sm text-slate-500 leading-relaxed font-medium">
                  {score >= 80 ? 'Your resume is highly optimized for ATS systems.' : 'Your resume is parseable but could be better optimized.'}
                </p>
              </div>

              {/* Executive Summary & Quick Fixes */}
              <div className="lg:col-span-2 flex flex-col gap-6">
                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-4 h-full">
                  <div className="bg-white p-6 rounded-2xl border border-slate-100 card-shadow flex flex-col justify-center animate-slide-up">
                    <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-lg mb-3">
                      <i className="fa-solid fa-check"></i>
                    </div>
                    <span className="text-2xl font-bold text-slate-900">{analysisResults.keywordDensity}%</span>
                    <span className="text-xs text-slate-500 font-bold uppercase mt-1">Keyword Density</span>
                  </div>
                  <div className="bg-white p-6 rounded-2xl border border-slate-100 card-shadow flex flex-col justify-center animate-slide-up">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-lg mb-3">
                      <i className="fa-solid fa-book-open"></i>
                    </div>
                    <span className="text-2xl font-bold text-slate-900">{analysisResults.readability}%</span>
                    <span className="text-xs text-slate-500 font-bold uppercase mt-1">Readability</span>
                  </div>
                  <div className="bg-white p-6 rounded-2xl border border-slate-100 card-shadow flex flex-col justify-center animate-slide-up">
                    <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-lg mb-3">
                      <i className="fa-solid fa-triangle-exclamation"></i>
                    </div>
                    <span className="text-2xl font-bold text-slate-900">{analysisResults.issues.length}</span>
                    <span className="text-xs text-slate-500 font-bold uppercase mt-1">Total Issues</span>
                  </div>
                </div>

                {/* Critical Issues Box */}
                <div className="bg-red-50 border border-red-100 rounded-2xl p-6 flex-grow animate-slide-up">
                  <h4 className="font-bold text-red-800 mb-4 flex items-center gap-2 text-sm">
                    <i className="fa-solid fa-circle-exclamation"></i> Top Priorities to Fix
                  </h4>
                  <ul className="space-y-3">
                    {analysisResults.issues.slice(0, 3).map((issue, idx) => (
                        <li key={idx} className="flex items-start gap-3 bg-white p-3 rounded-lg border border-red-100 shadow-sm">
                            <i className={cn(
                                "fa-solid mt-1",
                                issue.severity === 'high' ? "fa-circle-xmark text-red-500" : "fa-circle-exclamation text-amber-500"
                            )}></i>
                            <div>
                                <span className="block text-sm font-bold text-slate-800 capitalize">{issue.type.replace(/_/g, ' ')}</span>
                                <span className="text-xs text-slate-600 font-medium">{issue.message}</span>
                            </div>
                        </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Deep Dive Section */}
            <div className="grid lg:grid-cols-2 gap-8 mb-8">
              {/* Skills Gap Analysis */}
              <div className="bg-white rounded-2xl p-8 card-shadow border border-slate-100 animate-slide-up">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-bold text-lg text-slate-900">Keywords Analysis</h3>
                  <span className="text-xs font-bold bg-slate-100 px-2 py-1 rounded text-slate-600">{analysisResults.keywordDensity}% Match</span>
                </div>

                <div className="space-y-6">
                  <div className="border-t border-slate-100 pt-6">
                    <h4 className="text-xs font-bold text-red-500 uppercase mb-3 flex items-center gap-2">
                      <i className="fa-solid fa-xmark"></i> Missing (Add These!)
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {analysisResults.missingKeywords.length > 0 ? (
                          analysisResults.missingKeywords.map(kw => (
                            <span key={kw} className="px-3 py-1.5 bg-red-50 text-red-600 text-sm font-semibold rounded-lg border border-red-100 border-dashed">
                                {kw}
                            </span>
                          ))
                      ) : (
                          <span className="text-sm text-slate-400">No major keywords missing.</span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 mt-3 font-semibold italic">
                      <i className="fa-solid fa-lightbulb text-yellow-400 mr-1"></i> Tip: Add these to your "Skills" section or
                      weave them into bullet points.
                    </p>
                  </div>
                </div>
              </div>

              {/* Formatting & Parseability */}
              <div className="bg-white rounded-2xl p-8 card-shadow border border-slate-100 animate-slide-up">
                <h3 className="font-bold text-lg text-slate-900 mb-6">Health Check</h3>

                <div className="space-y-4">
                    {analysisResults.issues.map((issue, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors">
                            <div className="flex items-center gap-4">
                            <div className={cn(
                                "w-10 h-10 rounded-full flex items-center justify-center",
                                issue.severity === 'high' ? "bg-red-100 text-red-600" : "bg-amber-100 text-amber-600"
                            )}>
                                <i className="fa-solid fa-circle-info"></i>
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-800 text-sm capitalize">{issue.type.replace(/_/g, ' ')}</h4>
                                <p className="text-xs text-slate-500 font-semibold">{issue.message}</p>
                            </div>
                            </div>
                            <span className={cn(
                                "font-bold text-sm",
                                issue.severity === 'high' ? "text-red-600" : "text-amber-600"
                            )}>
                            <i className={cn("fa-solid mr-1", issue.severity === 'high' ? "fa-xmark" : "fa-triangle-exclamation")}></i> 
                            {issue.severity === 'high' ? 'Fail' : 'Warn'}
                            </span>
                        </div>
                    ))}
                    {analysisResults.issues.length === 0 && (
                         <div className="p-8 text-center text-slate-400 italic">No formatting issues detected.</div>
                    )}
                </div>
              </div>
            </div>

            {/* Fix Actions */}
            <div className="mt-8 flex justify-center animate-slide-up">
              <Link
                to="/builder"
                className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-white transition-all duration-200 bg-indigo-600 border border-transparent rounded-full shadow-lg hover:bg-indigo-700 hover:shadow-indigo-500/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600 transform hover:-translate-y-1"
              >
                <i className="fa-solid fa-wrench mr-2"></i> Fix These Issues in Resume Builder
              </Link>
            </div>
          </section>
        )}
      </main>
    </>
  );
}

