
import { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../../lib/api';
import { useResumeStore } from '../../store/useResumeStore';
import { formatRelativeTime } from '../../lib/utils';
import { 
  Plus, 
  Search, 
  MoreVertical, 
  Trash2, 
  Copy, 
  Edit3, 
  Download, 
  BarChart2,
  Clock
} from 'lucide-react';

interface Resume {
  id: number;
  title: string;
  template_id: string;
  created_at: string;
  updated_at: string;
  data: any;
}

export default function MyResumes() {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeMenu, setActiveMenu] = useState<number | null>(null);
  
  const setFullResume = useResumeStore(state => state.setFullResume);
  const setResumeId = useResumeStore(state => state.setResumeId);
  const navigate = useNavigate();

  const fetchResumes = async () => {
    try {
      setLoading(true);
      const data = await api.get<Resume[]>('/v1/resumes');
      setResumes(data);
    } catch (err) {
      console.error("Failed to fetch resumes", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResumes();
  }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this resume?")) return;
    try {
      await api.delete(`/v1/resumes/${id}`);
      setResumes(prev => prev.filter(r => r.id !== id));
      setActiveMenu(null);
    } catch (err) {
      alert("Failed to delete resume");
    }
  };

  const handleEdit = (resume: Resume) => {
    setResumeId(resume.id);
    setFullResume(resume.data);
    navigate('/builder');
  };

  const filteredResumes = useMemo(() => {
    return resumes.filter(r => 
      r.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [resumes, searchQuery]);

  const averageAtsScore = useMemo(() => {
    if (resumes.length === 0) return 0;
    // Mocking score from data if exists, else 0
    return 78; 
  }, [resumes]);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50/50">
      <main className="flex-grow container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">My Resumes</h1>
            <p className="text-slate-500 text-sm mt-1">Manage and optimize your career documents.</p>
          </div>
          <div className="flex gap-3">
            <Link to="/builder"
              className="px-5 py-2.5 bg-indigo-600 text-white text-sm font-bold rounded-xl hover:bg-indigo-700 transition-all flex items-center gap-2 shadow-lg shadow-indigo-200 hover:-translate-y-0.5"
            >
              <Plus className="w-4 h-4" /> New Resume
            </Link>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search resumes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            />
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Sort By:</span>
            <select className="text-sm bg-transparent font-bold text-slate-700 focus:ring-0 cursor-pointer outline-none">
              <option>Last Edited</option>
              <option>Name (A-Z)</option>
              <option>ATS Score</option>
            </select>
          </div>
        </div>

        {/* ATS Insight Bar */}
        {resumes.length > 0 && (
          <div className="mb-8 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl border border-indigo-100 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-white shadow-sm text-indigo-600 flex items-center justify-center">
                <BarChart2 className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800">Resume Performance</p>
                <p className="text-xs text-slate-500">Your average ATS score is <span className="text-emerald-600 font-bold">{averageAtsScore}/100</span>. Aim for 85+.</p>
              </div>
            </div>
            <Link to="/ats-checker" className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
              Check ATS Score <Plus className="w-3 h-3 rotate-45" />
            </Link>
          </div>
        )}

        {/* Resume Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <Link to="/builder"
            className="border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center p-8 hover:border-indigo-400 hover:bg-indigo-50/30 transition-all group h-[340px] cursor-pointer"
          >
            <div className="w-14 h-14 rounded-full bg-slate-100 group-hover:bg-white text-slate-400 group-hover:text-indigo-600 flex items-center justify-center mb-4 shadow-sm transition-all text-xl">
              <Plus className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-600 group-hover:text-slate-900">Create New Resume</h3>
            <p className="text-xs text-slate-400 mt-1">Start from scratch or template</p>
          </Link>

          {loading ? (
            [1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-2xl border border-slate-200 h-[340px] animate-pulse p-4 flex flex-col gap-4">
                <div className="h-40 bg-slate-100 rounded-xl" />
                <div className="h-4 bg-slate-100 rounded w-2/3" />
                <div className="h-3 bg-slate-100 rounded w-1/3" />
                <div className="mt-auto h-8 bg-slate-100 rounded-lg" />
              </div>
            ))
          ) : (
            filteredResumes.map((resume) => (
              <div key={resume.id} className="group bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col h-[340px] hover:shadow-xl hover:shadow-indigo-50 transition-all relative">
                {/* Thumbnail / Preview Area */}
                <div className="h-44 bg-slate-50 relative overflow-hidden flex items-center justify-center p-4">
                  <div className="w-full h-full bg-white shadow-sm rounded-t-lg p-3 overflow-hidden border border-slate-100 select-none">
                    <div className="w-1/3 h-2 bg-slate-200 rounded mb-2" />
                    <div className="space-y-1">
                      <div className="w-full h-1 bg-slate-100 rounded" />
                      <div className="w-full h-1 bg-slate-100 rounded" />
                      <div className="w-2/3 h-1 bg-slate-100 rounded" />
                    </div>
                  </div>
                  
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 backdrop-blur-[2px]">
                    <button 
                      onClick={() => handleEdit(resume)}
                      className="px-6 py-2 bg-white text-slate-900 rounded-xl text-xs font-bold shadow-lg hover:bg-indigo-50 transition-all transform hover:scale-105 flex items-center gap-2"
                    >
                      <Edit3 className="w-3.5 h-3.5" /> Edit Resume
                    </button>
                    <button className="px-6 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold shadow-lg hover:bg-indigo-700 transition-all transform hover:scale-105 flex items-center gap-2">
                      <Download className="w-3.5 h-3.5" /> Download PDF
                    </button>
                  </div>
                </div>

                {/* Content Info */}
                <div className="p-5 flex flex-col flex-grow">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-bold text-slate-800 text-sm truncate pr-2 flex-grow" title={resume.title}>
                      {resume.title}
                    </h3>
                    <div className="relative">
                      <button 
                        onClick={() => setActiveMenu(activeMenu === resume.id ? null : resume.id)}
                        className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-50 transition-all"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>
                      
                      {activeMenu === resume.id && (
                        <div className="absolute right-0 top-full mt-1 bg-white border border-slate-100 shadow-xl rounded-xl w-36 py-1 z-20 animate-in fade-in slide-in-from-top-2">
                          <button className="w-full text-left px-4 py-2 text-xs text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 flex items-center gap-2">
                            <Copy className="w-3 h-3" /> Duplicate
                          </button>
                          <button className="w-full text-left px-4 py-2 text-xs text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 flex items-center gap-2">
                            <Edit3 className="w-3 h-3" /> Rename
                          </button>
                          <div className="h-px bg-slate-100 my-1" />
                          <button 
                            onClick={() => handleDelete(resume.id)}
                            className="w-full text-left px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2 font-bold"
                          >
                            <Trash2 className="w-3 h-3" /> Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-4">
                    <Clock className="w-3 h-3" />
                    <span>Edited {formatRelativeTime(resume.updated_at)}</span>
                  </div>

                  <div className="mt-auto flex items-center justify-between">
                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded-lg border border-emerald-100 flex items-center gap-1">
                      <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" /> 85/100 ATS
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-100 px-2 py-0.5 rounded-lg">
                      {resume.template_id}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
