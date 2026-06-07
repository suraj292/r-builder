import type { BlogPost } from '../../types/blog';

interface BlogRendererProps {
    post: Partial<BlogPost>;
}

export default function BlogRenderer({ post }: BlogRendererProps) {
    const renderBlocks = (blocks: any[]) => {
        if (!blocks || !Array.isArray(blocks)) return null;
        
        return blocks.map((block) => {
            switch (block.type) {
                case 'heading':
                    const Tag = `h${block.data.level || 2}` as 'h1' | 'h2' | 'h3';
                    const sizes = { 1: 'text-4xl', 2: 'text-3xl', 3: 'text-2xl' };
                    return (
                        <Tag key={block.id} className={`${sizes[block.data.level as keyof typeof sizes] || 'text-2xl'} font-display font-bold text-slate-900 mt-12 mb-6 leading-tight`}>
                            {block.data.text}
                        </Tag>
                    );
                case 'paragraph':
                    return (
                        <p key={block.id} className="text-slate-600 leading-relaxed text-lg mb-6 whitespace-pre-wrap">
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
                    return (
                        <div key={block.id} className="p-4 bg-slate-50 border border-dashed border-slate-200 rounded-xl text-slate-400 text-xs mb-6">
                            Unsupported Block Type: {block.type}
                        </div>
                    );
            }
        });
    };

    return (
        <div className="bg-white">
            {/* Header Hero */}
            <div className="container mx-auto px-6 max-w-5xl py-10">
                <div className="text-center mb-8">
                    {post.category && (
                        <span className="inline-block px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs font-bold uppercase tracking-wide mb-4">
                            {typeof post.category === 'string' ? post.category : post.category.name}
                        </span>
                    )}
                    <h1 className="text-3xl md:text-5xl font-display font-bold text-slate-900 mb-6 leading-tight">
                        {post.title || 'Untitled Post'}
                    </h1>

                    <div className="flex items-center justify-center gap-6 text-sm text-slate-500">
                        <div className="flex items-center gap-2">
                            <img src={`https://ui-avatars.com/api/?name=Author&background=6366f1&color=fff`}
                                className="w-8 h-8 rounded-full" alt="Author" />
                            <span className="font-semibold text-slate-700">Career Expert</span>
                        </div>
                        <span>{post.created_at ? new Date(post.created_at).toLocaleDateString() : new Date().toLocaleDateString()}</span>
                        <span>5 min read</span>
                    </div>
                </div>

                {post.featured_image && (
                    <div className="w-full h-[300px] md:h-[450px] rounded-3xl overflow-hidden shadow-xl">
                        <img src={post.featured_image} className="w-full h-full object-cover" alt={post.title} />
                    </div>
                )}
            </div>

            {/* Content Area */}
            <div className="container mx-auto px-6 py-12 max-w-3xl">
                <article className="prose prose-lg prose-indigo max-w-none text-slate-600">
                    {post.excerpt && (
                        <p className="lead text-xl text-slate-500 font-light mb-12 italic border-l-4 border-indigo-500 pl-6">
                            {post.excerpt}
                        </p>
                    )}
                    
                    {renderBlocks(post.content_blocks || [])}
                </article>
            </div>
        </div>
    );
}
