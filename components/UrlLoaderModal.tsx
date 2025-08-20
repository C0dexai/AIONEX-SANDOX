import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { GlobeIcon, SaveIcon, XIcon, PlayIcon, TrashIcon } from './Icons';
import type { SavedUrl } from '../types';

interface UrlLoaderModalProps {
    isOpen: boolean;
    onClose: () => void;
    onLoadUrl: (url: string) => void;
    savedUrls: SavedUrl[];
    onSaveUrl: (url: SavedUrl) => void;
    onDeleteUrl: (id: string) => void;
}

const UrlLoaderModal: React.FC<UrlLoaderModalProps> = ({ isOpen, onClose, onLoadUrl, savedUrls, onSaveUrl, onDeleteUrl }) => {
    const [title, setTitle] = useState('');
    const [url, setUrl] = useState('');

    if (!isOpen) return null;

    const handleSave = () => {
        if (title.trim() && url.trim()) {
            // A simple check for a protocol
            const fullUrl = url.startsWith('http://') || url.startsWith('https://') ? url : `https://${url}`;
            onSaveUrl({ id: uuidv4(), title, url: fullUrl });
            setTitle('');
            setUrl('');
        }
    };
    
    const handleLoad = () => {
        if (url.trim()) {
            const fullUrl = url.startsWith('http://') || url.startsWith('https://') ? url : `https://${url}`;
            onLoadUrl(fullUrl);
            onClose();
        }
    }

    const handleLoadSaved = (savedUrl: SavedUrl) => {
        onLoadUrl(savedUrl.url);
        onClose();
    }

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100]" onClick={onClose}>
            <div className="bg-[var(--card-bg)] border-2 border-[var(--neon-purple)] rounded-xl shadow-2xl neon-glow-purple w-full max-w-lg animate-fade-in-up" onClick={e => e.stopPropagation()}>
                <header className="flex items-center justify-between p-4 border-b border-[var(--card-border)]">
                    <div className="flex items-center gap-3">
                        <GlobeIcon className="h-6 w-6 text-[var(--neon-pink)]" />
                        <h2 className="text-xl font-bold">Load from URL</h2>
                    </div>
                    <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-full">
                        <XIcon className="h-5 w-5" />
                    </button>
                </header>
                
                <div className="p-6 space-y-4">
                    <p className="text-sm text-gray-400">
                        Enter a URL to display in the live preview. Note: Many websites may not load due to security restrictions (X-Frame-Options).
                    </p>
                    <div className="space-y-3">
                         <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Title (e.g., My Deployed App)"
                            className="w-full bg-[var(--dark-bg)] border border-[var(--card-border)] rounded-lg p-3 text-base placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[var(--neon-purple)]"
                        />
                        <input
                            type="text"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            placeholder="https://example.com"
                            className="w-full bg-[var(--dark-bg)] border border-[var(--card-border)] rounded-lg p-3 text-base placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[var(--neon-purple)]"
                        />
                    </div>
                     <div className="flex gap-3">
                        <button onClick={handleSave} className="flex-1 flex items-center justify-center gap-2 text-sm bg-black/30 hover:bg-[var(--neon-blue)] hover:text-black border border-[var(--neon-blue)] font-bold py-2.5 px-3 rounded-md transition-all">
                            <SaveIcon className="h-5 w-5" />
                            <span>Save URL</span>
                        </button>
                        <button onClick={handleLoad} className="flex-1 flex items-center justify-center gap-2 text-sm bg-[var(--neon-green)] hover:brightness-125 text-black font-bold py-2.5 px-3 rounded-md transition-all">
                            <PlayIcon className="h-5 w-5" />
                            <span>Go</span>
                        </button>
                    </div>
                </div>

                {savedUrls.length > 0 && (
                     <div className="p-6 border-t border-[var(--card-border)]">
                        <h3 className="text-lg font-semibold mb-3">Saved URLs</h3>
                        <ul className="space-y-2 max-h-48 overflow-y-auto">
                            {savedUrls.map(saved => (
                                <li key={saved.id} className="flex items-center justify-between p-2 bg-black/20 rounded-md group">
                                    <div>
                                        <p className="font-semibold">{saved.title}</p>
                                        <p className="text-xs text-gray-400">{saved.url}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button onClick={() => onDeleteUrl(saved.id)} title="Delete URL" className="p-1.5 text-gray-400 hover:text-[var(--neon-pink)] opacity-0 group-hover:opacity-100 transition-opacity">
                                            <TrashIcon className="h-4 w-4" />
                                        </button>
                                        <button onClick={() => handleLoadSaved(saved)} title="Load URL" className="p-1.5 text-gray-400 hover:text-[var(--neon-green)]">
                                            <PlayIcon className="h-5 w-5" />
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UrlLoaderModal;
