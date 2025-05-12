"use client";
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Navbar from '@/app/components/navbar';
import Footer from '@/app/components/footer';
interface Article {
    id: string;
    title: string;
    content: string;
    author: string;
    date: string;
}
const ArticlePage = () => {
    const { id } = useParams();
    const [article, setArticle] = useState<Article | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate fetching article data based on the ID
        const fetchArticle = async () => {
            // Replace this with your actual data fetching logic
            const mockArticle = {
                id: id,
                title: 'Sample Article Title',
                content: 'This is the content of the sample article...',
                author: 'John Doe',
                date: '2023-10-01',
            };
            // Convert id to string to match Article interface
            const articleWithStringId = {
                ...mockArticle,
                id: String(id)
            };
            setArticle(articleWithStringId);
            setLoading(false);
        };

        fetchArticle();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-stone-light">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brown"></div>
            </div>
        );
    }

    if (!article) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-stone-light">
                <div className="text-xl text-brown-dark">Article not found</div>
            </div>
        );
    }

    return (
        <div>
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 py-8 bg-stone-light">
                <h1 className="text-4xl font-semibold text-brown-dark mb-4">{article.title}</h1>
                <div className="text-brown-dark mb-4">
                    <span className="font-semibold">By {article.author}</span> - {article.date}
                </div>
                <div className="text-brown-dark text-lg">
                    {article.content}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default ArticlePage;
