import { useState } from "react";
import axios from 'axios';
type ShortenedResponse = {
    message: string,
    short_url: string
}
export default function EntryBox(){
    const [longUrl, setLongUrl] = useState('');
    const [shortUrl, setShorturl] = useState<string |null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [copySuccess, setCopySuccess] = useState('');
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setShorturl(null);
        setCopySuccess('');
        setIsLoading(true);

        if(!longUrl){
            setError('Please enter a URL');
            setIsLoading(false);
            return;
        }

        try{
            const resp = await axios.post<ShortenedResponse>(
                'http://127.0.0.1:3000/api/shorten',
                {url: longUrl}
            );
            setShorturl(resp.data.short_url);
        } catch(err: any){
            console.log(err);
            const errorMessage = err.response?.data?.message || 'Something went wrong';
            setError(errorMessage);
        } finally{
            setIsLoading(false);
        }
    }
    const handleCopy = async()=>{
        if(shortUrl){
            try{
                await navigator.clipboard.writeText(shortUrl);
                setCopySuccess('Copied!');
                setTimeout(()=>setCopySuccess(''),2000);
            } catch(err){
                setCopySuccess('Failed to copy');
            }
        }
    }
    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md border border-gray-200">
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">URL Shortener</h2>
            
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                    <input
                        type="url"
                        placeholder="Paste your long URL here..."
                        value={longUrl}
                        onChange={(e) => setLongUrl(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={isLoading}
                    />
                </div>

                <button 
                    type="submit" 
                    disabled={isLoading}
                    className={`w-full p-3 text-white font-semibold rounded transition-colors ${
                        isLoading ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                >
                    {isLoading ? 'Shortening...' : 'Shorten URL'}
                </button>
            </form>

            {error && (
                <div className="mt-4 p-3 bg-red-100 text-red-700 rounded text-sm text-center">
                    {error}
                </div>
            )}

            {/* Success / Result Display */}
            {shortUrl && (
                <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded flex flex-col items-center">
                    <p className="text-sm text-gray-500 mb-1">Your short link:</p>
                    
                    <div className="flex items-center gap-2 w-full">
                        <a 
                            href={shortUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex-1 text-blue-600 font-medium truncate underline"
                        >
                            {shortUrl}
                        </a>
                        
                        <button 
                            onClick={handleCopy}
                            className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded text-sm font-medium transition"
                        >
                            {copySuccess || 'Copy'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}