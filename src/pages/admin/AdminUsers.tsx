import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../lib/api';

interface User {
  id: number;
  email: string;
  full_name: string | null;
  role: string;
  registration_source: string;
  last_login: string | null;
  is_active: boolean;
  is_premium: boolean;
  created_at: string;
}

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await api.get<User[]>('/v1/admin/users');
      setUsers(data);
    } catch (err) {
      console.error('Failed to fetch users', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(u => 
    u.email.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (u.full_name && u.full_name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
        <h3 className="font-bold text-slate-800">User Management</h3>
        <div className="flex gap-2">
           <div className="relative">
             <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm"></i>
             <input 
                type="text" 
                placeholder="Search email or name..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none w-64 bg-white" 
             />
           </div>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 text-slate-500 text-[10px] font-bold uppercase tracking-widest border-b border-slate-200">
              <th className="px-6 py-4">User</th>
              <th className="px-6 py-4">Source</th>
              <th className="px-6 py-4">Role / Plan</th>
              <th className="px-6 py-4">Last Login</th>
              <th className="px-6 py-4">Joined</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                  <i className="fa-solid fa-circle-notch fa-spin mr-2"></i> Loading users...
                </td>
              </tr>
            ) : filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                  {searchQuery ? 'No users matching your search.' : 'No users found.'}
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                <tr 
                    key={user.id} 
                    onClick={() => navigate(`/admin/users/${user.id}`)}
                    className={`hover:bg-indigo-50/30 transition-all cursor-pointer group ${!user.is_active ? 'bg-rose-50/30' : ''}`}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-slate-500 font-bold border border-slate-200 shadow-sm overflow-hidden group-hover:border-indigo-200 transition-colors">
                        <img 
                            src={`https://ui-avatars.com/api/?name=${(user.full_name || user.email).replace(' ', '+')}&background=random`} 
                            className="w-full h-full object-cover"
                            alt="Avatar"
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                            <p className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{user.full_name || 'Anonymous'}</p>
                            {!user.is_active && <span className="px-1.5 py-0.5 bg-rose-100 text-rose-600 text-[8px] font-black uppercase rounded">Banned</span>}
                        </div>
                        <p className="text-xs text-slate-500">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <i className={`fa-brands ${
                        user.registration_source === 'google' ? 'fa-google text-rose-500' :
                        user.registration_source === 'github' ? 'fa-github text-slate-900' :
                        user.registration_source === 'linkedin' ? 'fa-linkedin text-blue-600' :
                        'fa-envelope text-slate-400'
                      }`}></i>
                      <span className="text-xs text-slate-600 capitalize">{user.registration_source}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <span className={`px-2 py-0.5 rounded-lg text-[9px] font-bold uppercase tracking-wider w-max ${
                        user.role === 'super_admin' ? 'bg-purple-100 text-purple-700' :
                        user.role === 'admin' ? 'bg-blue-100 text-blue-700' :
                        'bg-slate-100 text-slate-600'
                      }`}>
                        {user.role}
                      </span>
                      {user.is_premium && (
                        <span className="text-[9px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md w-max border border-amber-100">
                          Premium
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                        <span className="text-xs text-slate-600 font-medium">
                            {user.last_login ? new Date(user.last_login).toLocaleDateString() : 'Never'}
                        </span>
                        {user.last_login && (
                            <span className="text-[10px] text-slate-400">
                                {new Date(user.last_login).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                        )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-[11px] text-slate-500 font-medium">
                    {new Date(user.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
