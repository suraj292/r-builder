import { useState, useEffect, useMemo } from 'react';
import { api } from '../../lib/api';
import { useNavigate } from 'react-router-dom';
import { cn, formatRelativeTime } from '../../lib/utils';
import { FileText, Search, Activity, Monitor, Globe } from 'lucide-react';

interface Resume {
  id: number;
  title: string;
  user_email: string;
  template_id: string;
  created_at: string;
  updated_at: string;
}

interface AtsScan {
  id: number;
  user_id: number | null;
  user_email: string;
  ip_address: string;
  device_info: string | null;
  score: number;
  created_at: string;
}

export default function AdminResumes() {
  const [activeTab, setActiveTab] = useState<'resumes' | 'scans'>('resumes');
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [scans, setScans] = useState<AtsScan[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      setLoading(true);
      if (activeTab === 'resumes') {
        const data = await api.get<Resume[]>('/v1/admin/resumes');
        console.log('Fetched resumes:', data);
        setResumes(Array.isArray(data) ? data : []);
      } else {
        const data = await api.get<AtsScan[]>('/v1/admin/ats-scans');
        console.log('Fetched scans:', data);
        setScans(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error('Failed to fetch data', err);
      setResumes([]);
      setScans([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const handleDelete = async (id: number) => {
    if (!window.confirm(`Are you sure you want to delete resume ID ${id}? This cannot be undone.`)) return;
    
    try {
      await api.delete(`/v1/admin/resumes/${id}`);
      setResumes(prev => prev.filter(r => r.id !== id));
    } catch (err) {
      alert("Failed to delete resume");
    }
  };

  const handleView = (id: number) => {
    alert(`View/Download functionality for Resume ID ${id} would trigger here.`);
  };

  const filteredResumes = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return resumes.filter(r => 
      (r.title?.toLowerCase() || '').includes(query) || 
      (r.user_email?.toLowerCase() || '').includes(query) ||
      (r.template_id?.toLowerCase() || '').includes(query)
    );
  }, [resumes, searchQuery]);

  const filteredScans = useMemo(() => {
    return scans.filter(s => 
      s.user_email.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (s.ip_address && s.ip_address.includes(searchQuery))
    );
  }, [scans, searchQuery]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Resume Activity</h1>
          <p className="text-slate-500 text-sm">Monitor generated resumes and ATS scans.</p>
        </div>
        <div className="flex bg-slate-100 p-1 rounded-xl">
          <button 
            onClick={() => setActiveTab('resumes')}
            className={cn(
              "px-6 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 cursor-pointer",
              activeTab === 'resumes' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
            )}
          >
            <FileText className="w-4 h-4" /> Generated {resumes.length > 0 && `(${resumes.length})`}
          </button>
          <button 
            onClick={() => setActiveTab('scans')}
            className={cn(
              "px-6 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 cursor-pointer",
              activeTab === 'scans' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
            )}
          >
            <Activity className="w-4 h-4" /> ATS Scans {scans.length > 0 && `(${scans.length})`}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
          <h3 className="font-bold text-slate-800">
            {activeTab === 'resumes' ? 'Saved Resumes' : 'Scan Logs'}
          </h3>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none w-64 bg-white" 
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-[10px] font-bold uppercase tracking-widest border-b border-slate-200">
                {activeTab === 'resumes' ? (
                  <>
                    <th className="px-6 py-4">Resume Title</th>
                    <th className="px-6 py-4">Owner</th>
                    <th className="px-6 py-4">Template</th>
                    <th className="px-6 py-4">Last Updated</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </>
                ) : (
                  <>
                    <th className="px-6 py-4">User / Guest</th>
                    <th className="px-6 py-4">Score</th>
                    <th className="px-6 py-4">Device Info</th>
                    <th className="px-6 py-4">IP Address</th>
                    <th className="px-6 py-4 text-right">Date</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                    <i className="fa-solid fa-circle-notch fa-spin mr-2"></i> Loading data...
                  </td>
                </tr>
              ) : (activeTab === 'resumes' ? filteredResumes : filteredScans).length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                    No records found matching your search.
                  </td>
                </tr>
              ) : activeTab === 'resumes' ? (
                filteredResumes.map((resume) => (
                  <tr key={resume.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                          <FileText className="w-4 h-4" />
                        </div>
                        <span className="text-sm font-bold text-slate-900">{resume.title}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {resume.user_email}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 rounded-lg bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-wider">
                        {resume.template_id}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-500 font-medium">
                      {formatRelativeTime(resume.updated_at)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => handleView(resume.id)}
                          className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all cursor-pointer" 
                          title="View PDF"
                        >
                          <i className="fa-solid fa-file-pdf"></i>
                        </button>
                        <button 
                          onClick={() => handleDelete(resume.id)}
                          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all cursor-pointer" 
                          title="Delete"
                        >
                          <i className="fa-solid fa-trash-can"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                filteredScans.map((scan) => (
                  <tr key={scan.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <span className={cn(
                        "text-sm font-bold",
                        scan.user_email === 'Guest' ? 'text-slate-500' : 'text-indigo-600'
                      )}>
                        {scan.user_email}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "px-2 py-1 rounded-lg text-xs font-bold",
                        scan.score >= 80 ? 'bg-emerald-50 text-emerald-700' :
                        scan.score >= 50 ? 'bg-amber-50 text-amber-700' : 'bg-rose-50 text-rose-700'
                      )}>
                        {scan.score}/100
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-xs text-slate-500">
                        <Monitor className="w-3 h-3" />
                        <span className="truncate max-w-[150px]">{scan.device_info || 'Unknown'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-xs text-slate-500">
                        <Globe className="w-3 h-3" />
                        <span className="font-mono">{scan.ip_address || 'Unknown'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <p className="text-xs text-slate-500 font-bold">{new Date(scan.created_at).toLocaleDateString()}</p>
                      <p className="text-[10px] text-slate-400">{new Date(scan.created_at).toLocaleTimeString()}</p>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}