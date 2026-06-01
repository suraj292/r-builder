import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useBlogEditorStore } from '../../store/useBlogEditorStore';
import { api } from '../../lib/api';
import Swal from 'sweetalert2';
import HeadingBlock from '../../components/admin/blog/blocks/HeadingBlock';
import ParagraphBlock from '../../components/admin/blog/blocks/ParagraphBlock';
import ImageBlock from '../../components/admin/blog/blocks/ImageBlock';
import MediaLibrary from '../../components/admin/MediaLibrary';
import BlogRenderer from '../../components/blog/BlogRenderer';
import CategoryManager from '../../components/admin/CategoryManager';

export default function BlogEditor() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { 
        title, setTitle, 
        slug, setSlug, 
        excerpt, setExcerpt,
        status, setStatus,
        category_id, setCategoryId,
        featured_image, setFeaturedImage,
        blocks, addBlock, updateBlock, removeBlock, moveBlock, loadPost, reset 
    } = useBlogEditorStore();

    const [isSaving, setIsSaving] = useState(false);
    const [isAILoading, setIsAILoading] = useState(false);
    const [isMediaOpen, setIsMediaOpen] = useState(false);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [isCategoryManagerOpen, setIsCategoryManagerOpen] = useState(false);
    const [categories, setCategories] = useState<any[]>([]);

    useEffect(() => {
        fetchCategories();
        if (id && id !== 'create') {
            fetchPost(id);
        } else {
            reset();
        }
    }, [id]);

    const handleOptimizeTitle = async () => {
        if (!title) return Swal.fire('Wait', 'Enter a draft title first.', 'info');
        setIsAILoading(true);
        try {
            const data = await api.post<any>('/v1/admin/blog/ai/optimize-title', { current_title: title });
            Swal.fire({
                title: 'Title Suggestions',
                text: data.suggestion,
                icon: 'info',
                confirmButtonText: 'Great'
            });
        } catch (error) {
            Swal.fire('Error', 'Failed to get suggestions', 'error');
        } finally {
            setIsAILoading(false);
        }
    };

    const handleGenerateOutline = async () => {
        if (!title) return Swal.fire('Wait', 'Enter a title to guide the AI.', 'info');
        setIsAILoading(true);
        try {
            const data = await api.post<any>('/v1/admin/blog/ai/generate-outline', { title });
            const result = await Swal.fire({
                title: 'Post Outline',
                html: `
                    <div class="text-left text-sm overflow-y-auto max-h-96 whitespace-pre-wrap mb-4">${data.suggestion}</div>
                    <div class="p-3 bg-indigo-50 rounded-xl text-[10px] text-indigo-700 font-bold uppercase tracking-wider">
                        Next Step: Generate Full Draft?
                    </div>
                `,
                width: '600px',
                showCancelButton: true,
                confirmButtonText: 'Generate Full Draft',
                cancelButtonText: 'Just Save Outline'
            });

            if (result.isConfirmed) {
                handleGenerateDraft(data.suggestion);
            }
        } catch (error) {
            Swal.fire('Error', 'Failed to generate outline', 'error');
        } finally {
            setIsAILoading(false);
        }
    };

    const handleGenerateDraft = async (outline: string) => {
        setIsAILoading(true);
        try {
            const data = await api.post<any>('/v1/admin/blog/ai/generate-draft', { title, outline });
            // Add the generated content as a paragraph block or split into multiple? 
            // For now, let's add it as a new paragraph block at the end
            addBlock('paragraph');
            // We need a way to target the specific block we just added. 
            // For this prototype, let's just alert the content and let user copy-paste or auto-inject.
            // Better: Let's find the last block and update it.
            Swal.fire({
                title: 'Draft Generated!',
                html: `<div class="text-left text-xs overflow-y-auto max-h-96 whitespace-pre-wrap">${data.suggestion}</div>`,
                width: '700px',
                confirmButtonText: 'Awesome'
            });
        } catch (error) {
            Swal.fire('Error', 'Failed to generate draft', 'error');
        } finally {
            setIsAILoading(false);
        }
    };

    const handleSEOSuggestions = async () => {
        setIsAILoading(true);
        try {
            const content_preview = blocks.map(b => b.data.text || '').join('\n');
            const data = await api.post<any>('/v1/admin/blog/ai/seo-suggestions', { 
                title, 
                excerpt, 
                content_preview 
            });
            Swal.fire({
                title: 'SEO-GPT Enterprise Audit',
                html: `<div class="text-left text-xs overflow-y-auto max-h-[70vh] whitespace-pre-wrap prose-sm">${data.suggestion}</div>`,
                width: '800px',
                confirmButtonText: 'Implementation Ready'
            });
        } catch (error) {
            Swal.fire('Error', 'Failed to get recommendations', 'error');
        } finally {
            setIsAILoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const data = await api.get<any[]>('/v1/admin/blog/categories');
            setCategories(data);
        } catch (error) {
            console.error('Failed to fetch categories');
        }
    };

    const fetchPost = async (postId: string) => {
        try {
            // Logic to find specific post in list or separate GET by ID
            // For now, let's assume we find it in the list for simplicity in this prototype phase
            const posts = await api.get<any[]>('/v1/admin/blog/posts');
            const post = posts.find(p => p.id === parseInt(postId));
            if (post) {
                loadPost(post);
            }
        } catch (error) {
            Swal.fire('Error', 'Failed to load post', 'error');
        }
    };

    const handleSave = async () => {
        if (!title) return Swal.fire('Error', 'Title is required', 'error');
        if (!slug) return Swal.fire('Error', 'Slug is required', 'error');

        setIsSaving(true);
        const payload = {
            title,
            slug,
            excerpt,
            status,
            category_id,
            featured_image,
            content_blocks: blocks,
        };

        try {
            if (id && id !== 'create') {
                await api.put(`/v1/admin/blog/posts/${id}`, payload);
                Swal.fire('Saved!', 'Article updated successfully.', 'success');
            } else {
                await api.post('/v1/admin/blog/posts', payload);
                Swal.fire('Published!', 'New article created.', 'success');
                navigate('/admin/blog');
            }
        } catch (error: any) {
            Swal.fire('Error', error.message || 'Failed to save post', 'error');
        } finally {
            setIsSaving(false);
        }
    };

    const renderBlock = (block: any, index: number) => {
        const commonProps = {
            data: block.data,
            onChange: (data: any) => updateBlock(block.id, data)
        };

        let component = null;
        switch (block.type) {
            case 'heading': component = <HeadingBlock {...commonProps} />; break;
            case 'paragraph': component = <ParagraphBlock {...commonProps} />; break;
            case 'image': component = <ImageBlock {...commonProps} />; break;
            default: component = <div className="p-4 bg-slate-100 rounded">Unsupported Block: {block.type}</div>;
        }

        return (
            <div key={block.id} className="relative group/block mb-6">
                <div className="absolute -left-12 top-0 bottom-0 flex flex-col items-center justify-center gap-1 opacity-0 group-hover/block:opacity-100 transition-opacity">
                    <button onClick={() => moveBlock(block.id, 'up')} className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-slate-400 hover:text-indigo-600 flex items-center justify-center">
                        <i className="fa-solid fa-chevron-up text-xs"></i>
                    </button>
                    <button onClick={() => removeBlock(block.id)} className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-slate-400 hover:text-rose-600 flex items-center justify-center">
                        <i className="fa-solid fa-trash-can text-xs"></i>
                    </button>
                    <button onClick={() => moveBlock(block.id, 'down')} className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-slate-400 hover:text-indigo-600 flex items-center justify-center">
                        <i className="fa-solid fa-chevron-down text-xs"></i>
                    </button>
                </div>
                {component}
                <div className="absolute -bottom-4 left-0 right-0 flex justify-center opacity-0 group-hover/block:opacity-100 transition-opacity z-20">
                    <button 
                        onClick={() => addBlock('paragraph', index)}
                        className="w-8 h-8 rounded-full bg-indigo-600 text-white shadow-lg flex items-center justify-center hover:scale-110 transition-transform"
                    >
                        <i className="fa-solid fa-plus text-xs"></i>
                    </button>
                </div>
            </div>
        );
    };

    const currentPostPreview = {
        title,
        excerpt,
        content_blocks: blocks,
        featured_image,
        category: categories.find(c => c.id === category_id) || (category_id ? { name: 'Selected Category' } : null),
        created_at: new Date().toISOString()
    };

    return (
        <div className="flex flex-col h-[calc(100vh-64px)] -m-8">
            {/* Editor Toolbar */}
            <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 z-30">
                <div className="flex items-center gap-4">
                    <Link to="/admin/blog" className="w-10 h-10 flex items-center justify-center rounded-xl border border-slate-200 text-slate-400 hover:bg-slate-50 transition-colors">
                        <i className="fa-solid fa-arrow-left"></i>
                    </Link>
                    <h1 className="font-bold text-slate-900 truncate max-w-md">{title || 'New Article'}</h1>
                </div>
                <div className="flex items-center gap-3">
                    <button 
                        onClick={() => setIsPreviewOpen(true)}
                        className="px-6 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-50 transition-all flex items-center gap-2"
                    >
                        <i className="fa-solid fa-eye"></i>
                        Preview
                    </button>
                    <button 
                        onClick={handleSave}
                        disabled={isSaving}
                        className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-indigo-600/20 hover:bg-indigo-500 transition-all flex items-center gap-2 disabled:opacity-50"
                    >
                        {isSaving ? <i className="fa-solid fa-spinner animate-spin"></i> : <i className="fa-solid fa-cloud-arrow-up"></i>}
                        {id && id !== 'create' ? 'Update' : 'Publish'}
                    </button>
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden">
                {/* Main Canvas */}
                <main className="flex-1 overflow-y-auto bg-slate-50 py-12 px-6">
                    <div className="max-w-3xl mx-auto space-y-8 bg-white p-12 md:p-20 rounded-[40px] shadow-sm border border-slate-100 min-h-full relative">
                        {/* Featured Image Header */}
                        {featured_image ? (
                            <div className="relative group mb-12 -mt-10 mx-[-20px] md:mx-[-60px]">
                                <img src={featured_image} className="w-full aspect-[21/9] object-cover rounded-3xl shadow-lg" alt="" />
                                <button 
                                    onClick={() => setIsMediaOpen(true)}
                                    className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-3xl text-white font-bold"
                                >
                                    Change Cover
                                </button>
                            </div>
                        ) : (
                            <button 
                                onClick={() => setIsMediaOpen(true)}
                                className="w-full aspect-[21/9] bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center gap-3 text-slate-400 hover:bg-slate-100 hover:border-indigo-300 hover:text-indigo-500 transition-all mb-12"
                            >
                                <i className="fa-solid fa-image text-3xl"></i>
                                <span className="font-bold text-sm">Add Cover Image</span>
                            </button>
                        )}

                        {/* Article Title */}
                        <div className="relative group/title mb-4">
                            <textarea 
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Article Title..."
                                rows={1}
                                className="w-full bg-transparent border-none focus:outline-none text-4xl md:text-5xl font-display font-extrabold text-slate-900 placeholder:text-slate-200 resize-none overflow-hidden"
                                onInput={(e: any) => {
                                    e.target.style.height = 'auto';
                                    e.target.style.height = e.target.scrollHeight + 'px';
                                }}
                            />
                            <button 
                                onClick={handleOptimizeTitle}
                                disabled={isAILoading}
                                className="absolute -right-12 top-2 w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center opacity-0 group-hover/title:opacity-100 transition-opacity hover:bg-indigo-100 shadow-sm"
                                title="Optimize Title with AI"
                            >
                                {isAILoading ? <i className="fa-solid fa-spinner animate-spin text-xs"></i> : <i className="fa-solid fa-wand-magic-sparkles text-xs"></i>}
                            </button>
                        </div>

                        {/* Blocks */}
                        <div className="space-y-4">
                            {blocks.map((block, idx) => renderBlock(block, idx))}
                        </div>

                        {/* Add Block Bottom */}
                        <div className="pt-12 border-t border-slate-100 flex flex-wrap justify-center gap-4">
                            <button onClick={() => addBlock('heading')} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-50 text-slate-600 font-bold text-xs hover:bg-indigo-50 hover:text-indigo-600 transition-colors">
                                <i className="fa-solid fa-heading"></i> Heading
                            </button>
                            <button onClick={() => addBlock('paragraph')} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-50 text-slate-600 font-bold text-xs hover:bg-indigo-50 hover:text-indigo-600 transition-colors">
                                <i className="fa-solid fa-paragraph"></i> Paragraph
                            </button>
                            <button onClick={() => addBlock('image')} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-50 text-slate-600 font-bold text-xs hover:bg-indigo-50 hover:text-indigo-600 transition-colors">
                                <i className="fa-solid fa-image"></i> Image
                            </button>
                            <button 
                                onClick={handleGenerateOutline}
                                disabled={isAILoading}
                                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-50 text-indigo-600 font-bold text-xs hover:bg-indigo-600 hover:text-white transition-all disabled:opacity-50"
                            >
                                {isAILoading ? <i className="fa-solid fa-spinner animate-spin"></i> : <i className="fa-solid fa-wand-magic-sparkles"></i>}
                                Generate Outline
                            </button>
                        </div>
                    </div>
                </main>

                {/* Sidebar Settings */}
                <aside className="w-80 bg-white border-l border-slate-200 overflow-y-auto p-6 space-y-8 z-20">
                    <div>
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Post Settings</h4>
                        
                        <div className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-slate-500 uppercase">Slug</label>
                                <input 
                                    type="text" 
                                    value={slug}
                                    onChange={(e) => setSlug(e.target.value)}
                                    placeholder="url-slug-here"
                                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500/20"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <div className="flex justify-between items-center">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase">Category</label>
                                    <button 
                                        onClick={() => setIsCategoryManagerOpen(true)}
                                        className="text-[9px] font-bold text-indigo-600 hover:text-indigo-700 uppercase tracking-wider"
                                    >
                                        Manage
                                    </button>
                                </div>
                                <select 
                                    value={category_id || ''}
                                    onChange={(e) => setCategoryId(parseInt(e.target.value) || null)}
                                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500/20"
                                >
                                    <option value="">Uncategorized</option>
                                    {categories.map(c => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-slate-500 uppercase">Status</label>
                                <select 
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500/20"
                                >
                                    <option value="draft">Draft</option>
                                    <option value="published">Published</option>
                                    <option value="scheduled">Scheduled</option>
                                    <option value="archived">Archived</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-slate-100">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">SEO & Social</h4>
                        <div className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-slate-500 uppercase">Excerpt</label>
                                <textarea 
                                    value={excerpt}
                                    onChange={(e) => setExcerpt(e.target.value)}
                                    rows={4}
                                    placeholder="Brief summary for search results..."
                                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500/20 resize-none"
                                />
                            </div>
                            <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
                                <div className="flex items-center gap-2 text-indigo-600 mb-2">
                                    <i className="fa-solid fa-wand-magic-sparkles text-xs"></i>
                                    <span className="text-[10px] font-bold uppercase">AI SEO Assistant</span>
                                </div>
                                <p className="text-[10px] text-slate-500 leading-relaxed mb-4">
                                    Get real-time SEO title suggestions, meta descriptions, and keyword ideas based on your current content.
                                </p>
                                <button 
                                    onClick={handleSEOSuggestions}
                                    disabled={isAILoading}
                                    className="w-full py-2 bg-indigo-600 text-white rounded-xl font-bold text-[10px] uppercase tracking-wider hover:bg-indigo-500 transition-all shadow-md shadow-indigo-600/20 disabled:opacity-50"
                                >
                                    {isAILoading ? 'Analyzing...' : 'Run SEO Audit'}
                                </button>
                            </div>
                        </div>
                    </div>
                </aside>
            </div>

            {isMediaOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-12 bg-slate-900/60 backdrop-blur-sm">
                    <MediaLibrary 
                        selectionMode 
                        onClose={() => setIsMediaOpen(false)}
                        onSelect={(media) => {
                            setFeaturedImage(media.file_path);
                            setIsMediaOpen(false);
                        }}
                    />
                </div>
            )}

            {/* Live Preview Modal */}
            {isPreviewOpen && (
                <div className="fixed inset-0 z-[70] flex flex-col bg-slate-900/90 backdrop-blur-md">
                    <header className="h-16 bg-white flex items-center justify-between px-8 shadow-xl">
                        <div className="flex items-center gap-3">
                            <span className="px-2 py-1 bg-indigo-100 text-indigo-700 text-[10px] font-bold rounded uppercase">Preview Mode</span>
                            <p className="text-sm text-slate-500 italic">This is how your post will look to readers.</p>
                        </div>
                        <button 
                            onClick={() => setIsPreviewOpen(false)}
                            className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
                        >
                            <i className="fa-solid fa-xmark"></i>
                        </button>
                    </header>
                    <div className="flex-1 overflow-y-auto bg-white mx-auto w-full max-w-7xl shadow-2xl">
                        <BlogRenderer post={currentPostPreview as any} />
                    </div>
                </div>
            )}

            {/* Category Manager Modal */}
            {isCategoryManagerOpen && (
                <div className="fixed inset-0 z-[80] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm">
                    <CategoryManager 
                        onClose={() => setIsCategoryManagerOpen(false)}
                        onUpdate={fetchCategories}
                    />
                </div>
            )}
        </div>
    );
}
