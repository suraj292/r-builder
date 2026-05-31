import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../../lib/api';
import type { BlogPost } from '../../types/blog';

export default function BlogDetail() {
    const { slug } = useParams();
    const [post, setPost] = useState<BlogPost | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchPost();
    }, [slug]);

    const fetchPost = async () => {
        setIsLoading(true);
        try {
            // Note: Should use a public GET by slug endpoint
            const posts = await api.get<BlogPost[]>('/v1/admin/blog/posts');
            const found = posts.find(p => p.slug === slug);
            setPost(found || null);
        } catch (error) {
            console.error('Failed to fetch post');
        } finally {
            setIsLoading(false);
        }
    };

    const renderBlocks = (blocks: any[]) => {
        return blocks.map((block) => {
            switch (block.type) {
                case 'heading':
                    const Tag = `h${block.data.level}` as 'h1' | 'h2' | 'h3';
                    const sizes = { 1: 'text-4xl', 2: 'text-3xl', 3: 'text-2xl' };
                    return (
                        <Tag key={block.id} className={`${sizes[block.data.level as keyof typeof sizes] || 'text-2xl'} font-display font-bold text-slate-900 mt-12 mb-6 leading-tight`}>
                            {block.data.text}
                        </Tag>
                    );
                case 'paragraph':
                    return (
                        <p key={block.id} className="text-slate-600 leading-relaxed text-lg mb-6">
                            {block.data.text}
                        </p>
                    );
                case 'image':
                    return (
                        <figure key={block.id} className="my-10">
                            <img src={block.data.url} alt={block.data.alt} className="w-full rounded-3xl shadow-lg" />
                            {block.data.caption && (
                                <figcaption className="text-center text-sm text-slate-400 mt-4 italic">{block.data.caption}</figcaption>
                            )}
                        </figure>
                    );
                default:
                    return null;
            }
        });
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!post) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-white px-6 text-center">
                <h1 className="text-4xl font-bold text-slate-900 mb-4">Post Not Found</h1>
                <p className="text-slate-500 mb-8">Sorry, the article you're looking for doesn't exist.</p>
                <Link to="/blog" className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl">Back to Blog</Link>
            </div>
        );
    }

    return (
        <>
            <main className="flex-grow">
                {/*  1. BLOG HEADER HERO  */}
                <section className="bg-white pt-10 pb-12 border-b border-slate-100">
                    <div className="container mx-auto px-6 max-w-5xl animate-fade-in">
                        <div className="text-center mb-8">
                            {post.category && (
                                <Link to="/blog"
                                    className="inline-block px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs font-bold uppercase tracking-wide mb-4 hover:bg-indigo-100 transition-colors">
                                    {post.category.name}
                                </Link>
                            )}
                            <h1 className="text-3xl md:text-5xl font-display font-bold text-slate-900 mb-6 leading-tight">
                                {post.title}
                            </h1>

                            <div className="flex items-center justify-center gap-6 text-sm text-slate-500">
                                <div className="flex items-center gap-2">
                                    <img src={`https://ui-avatars.com/api/?name=Author&background=6366f1&color=fff`}
                                        className="w-8 h-8 rounded-full" alt="Author" />
                                    <span className="font-semibold text-slate-700">Career Strategy Expert</span>
                                </div>
                                <span>{new Date(post.created_at).toLocaleDateString()}</span>
                                <span>5 min read</span>
                            </div>
                        </div>

                        {post.featured_image && (
                            <div className="w-full h-[400px] md:h-[500px] rounded-3xl overflow-hidden shadow-xl">
                                <img src={post.featured_image} className="w-full h-full object-cover" alt={post.title} />
                            </div>
                        )}
                    </div>
                </section>

                <section className="container mx-auto px-6 py-12">
                    <div className="grid lg:grid-cols-12 gap-12 max-w-6xl mx-auto">
                        {/*  2. CONTENT AREA (Main)  */}
                        <article className="lg:col-span-8 prose prose-lg prose-indigo max-w-none text-slate-600 animate-fade-in">
                            {post.excerpt && (
                                <p className="lead text-xl text-slate-500 font-light mb-12 italic border-l-4 border-indigo-500 pl-6">
                                    {post.excerpt}
                                </p>
                            )}
                            
                            {renderBlocks(post.content_blocks)}
                        </article>

                        {/*  SIDEBAR  */}
                        <aside className="lg:col-span-4 space-y-8 animate-slide-up">
                            <div className="bg-slate-50 p-8 rounded-[32px] border border-slate-100">
                                <h4 className="font-bold text-slate-900 mb-4">Start Building Your Resume</h4>
                                <p className="text-sm text-slate-500 mb-6">Join thousands of job seekers using our AI to land interviews.</p>
                                <Link to="/builder" className="block w-full py-3 bg-indigo-600 text-white text-center font-bold rounded-xl shadow-lg shadow-indigo-600/20 hover:bg-indigo-500 transition-all">Get Started Free</Link>
                            </div>
                        </aside>
                    </div>
                </section>
            </main>
        </>
    );
}
