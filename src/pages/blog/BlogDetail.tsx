import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../../lib/api';
import type { BlogPost } from '../../types/blog';
import BlogRenderer from '../../components/blog/BlogRenderer';

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
        <div className="min-h-screen flex flex-col">
            <main className="flex-grow">
                <BlogRenderer post={post} />
                
                {/*  CTA SIDEBAR (Moved below or kept within if needed, but for simplicity let's keep the renderer focused) */}
                <section className="container mx-auto px-6 py-12 max-w-6xl border-t border-slate-100 mt-12">
                    <div className="grid lg:grid-cols-12 gap-12">
                        <div className="lg:col-span-8">
                            <div className="bg-slate-50 p-8 rounded-[32px] border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6">
                                <div>
                                    <h4 className="font-bold text-slate-900 text-xl mb-2">Build your professional resume today</h4>
                                    <p className="text-slate-500 text-sm">Join 50k+ job seekers landing interviews at top tech companies.</p>
                                </div>
                                <Link to="/builder" className="px-8 py-3 bg-indigo-600 text-white text-center font-bold rounded-xl shadow-lg shadow-indigo-600/20 hover:bg-indigo-500 transition-all whitespace-nowrap">Get Started Free</Link>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}
