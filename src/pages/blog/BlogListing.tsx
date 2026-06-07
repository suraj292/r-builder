import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../lib/api';
import type { BlogPost } from '../../types/blog';

export default function BlogListing() {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            // Note: In production, this should be a public endpoint. 
            // For now, using the admin list or a separate public list endpoint if implemented.
            // Since we haven't built the public specific list yet, let's use the one we have
            // but in a real app, public posts wouldn't need admin roles.
            const data = await api.get<BlogPost[]>('/v1/admin/blog/posts');
            setPosts(data.filter(p => p.status === 'published'));
        } catch (error) {
            console.error('Failed to fetch blog posts');
        } finally {
            setIsLoading(false);
        }
    };

    const featuredPost = posts.find(post => post.is_featured) || posts[0];
    const regularPosts = posts.filter(post => post.id !== featuredPost?.id);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <>
            <main className="flex-grow">
                {/*  2. BLOG HERO  */}
                <section className="bg-white border-b border-slate-100 pt-16 pb-16 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-50 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-50 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>

                    <div className="container mx-auto px-6 text-center relative z-10 animate-fade-in">
                        <span className="inline-block py-1 px-3 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-4">The Career Blog</span>
                        <h1 className="text-4xl md:text-5xl font-display font-bold text-slate-900 mb-6">
                            Resume Tips, <span className="text-indigo-600">ATS Insights</span> & Career Advice
                        </h1>
                        <p className="text-slate-500 text-lg max-w-2xl mx-auto">
                            Master the art of job hunting with expert guides on building resumes that pass the bots and impress the humans.
                        </p>
                    </div>
                </section>

                {/*  3. FEATURED POST  */}
                {featuredPost && (
                    <section className="container mx-auto px-6 py-12">
                        <article className="relative group rounded-3xl overflow-hidden shadow-lg animate-slide-up hover:shadow-2xl transition-all duration-300">
                            <Link to={`/blog/${featuredPost.slug}`} className="block relative h-[400px] md:h-[500px]">
                                <img src={featuredPost.featured_image || 'https://picsum.photos/seed/resume/1200/600'} alt={featuredPost.title}
                                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent opacity-90"></div>
                                <div className="absolute bottom-0 left-0 p-8 md:p-12 w-full md:w-2/3">
                                    {featuredPost.category && (
                                        <span className="inline-block px-3 py-1 bg-indigo-600 text-white text-xs font-bold rounded-lg mb-4">{featuredPost.category.name}</span>
                                    )}
                                    <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4 leading-tight group-hover:text-indigo-200 transition-colors">
                                        {featuredPost.title}
                                    </h2>
                                    <p className="text-slate-300 mb-6 line-clamp-2">
                                        {featuredPost.excerpt}
                                    </p>
                                    <div className="flex items-center gap-3 text-white/80 text-sm">
                                        <img src={`https://ui-avatars.com/api/?name=Author&background=6366f1&color=fff`} className="w-8 h-8 rounded-full" alt="Author" />
                                        <span className="font-semibold">Career Expert</span>
                                        <span>•</span>
                                        <span>{new Date(featuredPost.created_at).toLocaleDateString()}</span>
                                        <span>•</span>
                                        <span>5 min read</span>
                                    </div>
                                </div>
                            </Link>
                        </article>
                    </section>
                )}

                <section className="container mx-auto px-6 py-8">
                    <div className="grid lg:grid-cols-12 gap-12">
                        {/*  4. BLOG GRID (Left)  */}
                        <div className="lg:col-span-8">
                            <div className="grid md:grid-cols-2 gap-8 mb-12">
                                {regularPosts.map((post) => (
                                    <article key={post.id} className="blog-card bg-white rounded-2xl overflow-hidden border border-slate-100 flex flex-col h-full animate-slide-up">
                                        <Link to={`/blog/${post.slug}`} className="block h-48 overflow-hidden relative">
                                            <img src={post.featured_image || 'https://picsum.photos/seed/work/600/400'} alt={post.title}
                                                className="w-full h-full object-cover transition-transform duration-500 hover:scale-110" />
                                            {post.category && (
                                                <span className="absolute top-4 left-4 bg-white/90 backdrop-blur text-slate-800 text-xs font-bold px-3 py-1 rounded-full">{post.category.name}</span>
                                            )}
                                        </Link>
                                        <div className="p-6 flex flex-col flex-grow">
                                            <h3 className="text-xl font-bold text-slate-900 mb-3 hover:text-indigo-600 transition-colors">
                                                <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                                            </h3>
                                            <p className="text-slate-500 text-sm mb-4 line-clamp-2 flex-grow">
                                                {post.excerpt}
                                            </p>
                                            <div className="flex items-center justify-between text-xs text-slate-400 mt-auto pt-4 border-t border-slate-50">
                                                <span>5 min read</span>
                                                <span>{new Date(post.created_at).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    </article>
                                ))}

                                {posts.length === 0 && (
                                    <div className="md:col-span-2 py-20 text-center text-slate-400">
                                        <p>No blog posts found. Check back soon!</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/*  6. SIDEBAR (Right)  */}
                        <aside className="lg:col-span-4 space-y-8 animate-slide-up">
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 text-center">
                                <h4 className="font-bold text-slate-900 mb-4">Join 50k Professionals</h4>
                                <p className="text-sm text-slate-500 mb-6">Get weekly career tips and resume secrets delivered to your inbox.</p>
                                <input type="email" placeholder="Email address" className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 mb-3 text-sm" />
                                <button className="w-full py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/20 hover:bg-indigo-500 transition-all">Subscribe</button>
                            </div>

                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                                <h4 className="font-bold text-slate-900 mb-4">Trending Now</h4>
                                <div className="space-y-4">
                                    {posts.slice(0, 3).map(post => (
                                        <Link key={post.id} to={`/blog/${post.slug}`} className="flex gap-4 group">
                                            <div className="w-16 h-16 rounded-lg bg-slate-200 overflow-hidden flex-shrink-0">
                                                <img src={post.featured_image || 'https://picsum.photos/seed/trend/100/100'} className="w-full h-full object-cover" alt={post.title} />
                                            </div>
                                            <div>
                                                <h5 className="text-sm font-bold text-slate-800 group-hover:text-indigo-600 transition-colors line-clamp-2">
                                                    {post.title}
                                                </h5>
                                                <span className="text-xs text-slate-400 mt-1 block">{new Date(post.created_at).toLocaleDateString()}</span>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </aside>
                    </div>
                </section>
            </main>
        </>
    );
}
