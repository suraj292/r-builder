import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../lib/api';
import type { BlogPost } from '../../types/blog';
import Swal from 'sweetalert2';

export default function AdminBlog() {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        setIsLoading(true);
        try {
            const data = await api.get<BlogPost[]>('/v1/admin/blog/posts');
            setPosts(data);
        } catch (error: any) {
            Swal.fire('Error', error.message || 'Failed to fetch posts', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = (id: number) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#4f46e5',
            cancelButtonColor: '#f43f5e',
            confirmButtonText: 'Yes, delete it!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await api.delete(`/v1/admin/blog/posts/${id}`);
                    setPosts(posts.filter(p => p.id !== id));
                    Swal.fire('Deleted!', 'Post has been deleted.', 'success');
                } catch (error: any) {
                    Swal.fire('Error', error.message || 'Failed to delete post', 'error');
                }
            }
        });
    };

    const handleToggleFeatured = async (post: BlogPost) => {
        try {
            const updated = await api.put<BlogPost>(`/v1/admin/blog/posts/${post.id}`, {
                is_featured: !post.is_featured
            });
            setPosts(posts.map(p => p.id === updated.id ? updated : p));
        } catch (error: any) {
            Swal.fire('Error', error.message || 'Failed to toggle featured status', 'error');
        }
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Blog Management</h1>
                    <p className="text-slate-500 text-sm">Create, edit and manage your career blog articles.</p>
                </div>
                <Link 
                    to="/admin/blog/create"
                    className="px-4 py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-indigo-600/20 hover:bg-indigo-500 transition-all flex items-center gap-2"
                >
                    <i className="fa-solid fa-plus"></i>
                    New Article
                </Link>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                {isLoading ? (
                    <div className="py-20 flex flex-col items-center justify-center">
                        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                        <p className="text-slate-500 font-medium">Loading articles...</p>
                    </div>
                ) : (
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200">
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Article</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Category</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {posts.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-slate-400">
                                        No articles found. Create your first post!
                                    </td>
                                </tr>
                            ) : posts.map((post) => (
                                <tr key={post.id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-lg bg-slate-100 overflow-hidden flex-shrink-0">
                                                {post.featured_image ? (
                                                    <img src={post.featured_image} className="w-full h-full object-cover" alt="" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-slate-300">
                                                        <i className="fa-solid fa-image"></i>
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-900 text-sm line-clamp-1">{post.title}</p>
                                                <p className="text-xs text-slate-500 line-clamp-1">{post.excerpt || 'No excerpt'}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold uppercase">
                                            {post.category?.name || 'Uncategorized'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col gap-1">
                                            <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold uppercase ${
                                                post.status === 'published' ? 'text-emerald-600' : 
                                                post.status === 'draft' ? 'text-slate-400' : 'text-amber-600'
                                            }`}>
                                                <i className={`fa-solid fa-circle text-[6px]`}></i>
                                                {post.status}
                                            </span>
                                            {post.is_featured && (
                                                <span className="flex items-center gap-1 text-amber-500 text-[10px] font-bold">
                                                    <i className="fa-solid fa-star"></i> Featured
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button 
                                                onClick={() => handleToggleFeatured(post)}
                                                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${post.is_featured ? 'text-amber-500 bg-amber-50' : 'text-slate-400 hover:bg-slate-100'}`}
                                                title="Toggle Featured"
                                            >
                                                <i className="fa-solid fa-star text-xs"></i>
                                            </button>
                                            <Link 
                                                to={`/admin/blog/edit/${post.id}`}
                                                className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 hover:bg-indigo-600 hover:text-white transition-all flex items-center justify-center"
                                            >
                                                <i className="fa-solid fa-pen text-xs"></i>
                                            </Link>
                                            <button 
                                                onClick={() => handleDelete(post.id)}
                                                className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 hover:bg-rose-600 hover:text-white transition-all flex items-center justify-center"
                                            >
                                                <i className="fa-solid fa-trash text-xs"></i>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
