import React from 'react';
import { MagicWandIcon, CodeIcon, PlayIcon, FolderIcon } from './Icons';

interface LandingPageProps {
  onLaunch: () => void;
}

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; children: React.ReactNode }> = ({ icon, title, children }) => (
    <div className="bg-black/30 backdrop-blur-2xl p-6 rounded-xl border border-[var(--card-border)] hover:border-[var(--neon-pink)] transition-all duration-300 transform hover:-translate-y-1 neon-glow-purple-hover">
        <div className="flex items-center gap-4 mb-3">
            <div className="flex-shrink-0 h-10 w-10 rounded-lg bg-black/30 flex items-center justify-center text-[var(--neon-pink)]">
                {icon}
            </div>
            <h3 className="text-xl font-bold">{title}</h3>
        </div>
        <p className="text-gray-300 text-sm">{children}</p>
    </div>
);


const LandingPage: React.FC<LandingPageProps> = ({ onLaunch }) => {
    return (
        <div className="overflow-y-auto h-full text-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                {/* Hero Section */}
                <section className="min-h-screen flex flex-col items-center justify-center text-center">
                    <h1 
                        className="text-5xl md:text-7xl font-extrabold tracking-tighter mb-4"
                        style={{ textShadow: '0 0 8px var(--neon-pink), 0 0 12px var(--neon-pink), 0 0 20px var(--neon-pink)' }}
                    >
                        Build at the Speed of Light
                    </h1>
                    <p className="max-w-2xl mx-auto text-lg md:text-xl text-gray-300 mb-8">
                        Your AI-powered web development sandbox. Generate, edit, and preview HTML, CSS, and JavaScript with a hyper-competent Gemini agent. From idea to deployment, instantly.
                    </p>
                    <button
                        onClick={onLaunch}
                        className="bg-[var(--neon-purple)] text-black font-bold text-lg py-4 px-10 rounded-full transition-all duration-300 transform hover:scale-105 neon-glow-purple hover:bg-[var(--neon-pink)]"
                    >
                        Launch Sandbox
                    </button>
                </section>

                {/* Features Section */}
                <section id="features" className="py-20">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold" style={{ textShadow: '0 0 5px var(--neon-blue)'}}>Everything You Need in One Place</h2>
                        <p className="text-gray-400 mt-2">A seamless environment for rapid web creation.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        <FeatureCard icon={<MagicWandIcon className="w-6 h-6" />} title="AI-Powered Agent">
                           Collaborate with a Gemini agent to write code, modify files, and implement features using natural language prompts.
                        </FeatureCard>
                        <FeatureCard icon={<PlayIcon className="w-6 h-6" />} title="Live Previews">
                           See your changes instantly. The live preview panel renders your code as you write it, creating a tight feedback loop.
                        </FeatureCard>
                         <FeatureCard icon={<CodeIcon className="w-6 h-6" />} title="Drag & Drop UI">
                           Build your initial layout in seconds. Drag components from the library and drop them directly onto your canvas.
                        </FeatureCard>
                        <FeatureCard icon={<FolderIcon className="w-6 h-6" />} title="Full File System">
                           Create, upload, and manage files and folders. Download your entire project as a ZIP archive when you're done.
                        </FeatureCard>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default LandingPage;