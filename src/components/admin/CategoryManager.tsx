import { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import Swal from 'sweetalert2';

interface Category {
    id: number;
    name: string;
    slug: string;
    description?: string;
}

interface CategoryManagerProps {
    onClose: () => void;
    onUpdate: () => void;
}

export default function CategoryManager({ onClose, onUpdate }: CategoryManagerProps) {
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    
    // New Category Form
    const [newName, setNewName] = useState('');
    const [newSlug, setNewSlug] = useState('');

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        setIsLoading(true);
        try {
            const data = await api.get<Category[]>('/v1/admin/blog/categories');
            setCategories(data);
        } catch (error) {
            console.error('Failed to fetch categories');
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddCategory = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newName || !newSlug) return;

        setIsSaving(true);
        try {
            await api.post('/v1/admin/blog/categories', {
                name: newName,
                slug: newSlug
            });
            setNewName('');
            setNewSlug('');
            fetchCategories();
            onUpdate();
            Swal.fire('Success', 'Category added successfully', 'success');
        } catch (error: any) {
            Swal.fire('Error', error.message || 'Failed to add category', 'error');
        } finally {
            setIsSaving(false);
        }
    };

    const generateSlug = (name: string) => {
        setNewName(name);
        setNewSlug(name.toLowerCase().replace(/[^a-z0-0]+/g, '-').replace(/(^-|-$)/g, ''));
    };

    return (
        <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h3 className="font-bold text-xl text-slate-900">Manage Categories</h3>
                <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
                    <i className="fa-solid fa-xmark"></i>
                </button>
            </div>

            <div className="p-6 space-y-6">
                {/* Add New Form */}
                <form onSubmit={handleAddCategory} className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Add New Category</h4>
                    <div className="space-y-2">
                        <input 
                            type="text" 
                            placeholder="Category Name"
                            value={newName}
                            onChange={(e) => generateSlug(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500/20"
                        />
                        <input 
                            type="text" 
                            placeholder="slug-here"
                            value={newSlug}
                            onChange={(e) => setNewSlug(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-500 bg-white"
                        />
                    </div>
                    <button 
                        type="submit"
                        disabled={isSaving || !newName}
                        className="w-full py-2 bg-indigo-600 text-white rounded-xl font-bold text-xs hover:bg-indigo-500 transition-all disabled:opacity-50"
                    >
                        {isSaving ? 'Adding...' : 'Add Category'}
                    </button>
                </form>

                {/* List */}
                <div className="space-y-2">
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Existing Categories</h4>
                    <div className="max-h-60 overflow-y-auto space-y-1 pr-2">
                        {isLoading ? (
                            <div className="py-10 text-center text-slate-400 text-xs">Loading...</div>
                        ) : categories.length === 0 ? (
                            <div className="py-10 text-center text-slate-400 text-xs italic text-pretty">No categories yet.</div>
                        ) : categories.map(cat => (
                            <div key={cat.id} className="flex justify-between items-center p-2 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-100 group">
                                <span className="text-sm text-slate-700 font-medium">{cat.name}</span>
                                <span className="text-[10px] text-slate-400 font-mono">/{cat.slug}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
                <button 
                    onClick={onClose}
                    className="px-6 py-2 rounded-xl font-bold text-sm text-slate-600 hover:bg-slate-200 transition-colors"
                >
                    Close
                </button>
            </div>
        </div>
    );
}
