import React from 'react';
import { XIcon, SaveIcon } from './Icons';

interface InstructionsPanelProps {
    isOpen: boolean;
    onClose: () => void;
    supervisorInstruction: string;
    setSupervisorInstruction: (value: string) => void;
    orchestratorInstruction: string;
    setOrchestratorInstruction: (value: string) => void;
    onSave: () => void;
}

const InstructionsPanel: React.FC<InstructionsPanelProps> = ({
    isOpen,
    onClose,
    supervisorInstruction,
    setSupervisorInstruction,
    orchestratorInstruction,
    setOrchestratorInstruction,
    onSave
}) => {
    return (
        <div className={`fixed top-0 right-0 h-full w-full md:w-1/3 lg:w-1/4 bg-black/30 backdrop-blur-2xl shadow-2xl transition-transform duration-300 ease-in-out z-[60] ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
            <div className="flex flex-col h-full border-l-2 border-[var(--neon-purple)] neon-glow-purple">
                <header className="flex items-center justify-between p-4 border-b border-[var(--card-border)] flex-shrink-0">
                    <h2 className="text-lg font-bold text-[var(--neon-pink)]">Custom Instructions</h2>
                    <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-full">
                        <XIcon className="h-5 w-5" />
                    </button>
                </header>

                <div className="p-4 flex-grow overflow-y-auto space-y-6">
                    <div>
                        <label htmlFor="supervisor-instructions" className="block text-sm font-medium text-[var(--neon-blue)] mb-2">
                            AI Supervisor (Core Directives)
                        </label>
                        <textarea
                            id="supervisor-instructions"
                            rows={12}
                            value={supervisorInstruction}
                            onChange={(e) => setSupervisorInstruction(e.target.value)}
                            className="w-full bg-black/30 border border-[var(--card-border)] rounded-lg p-3 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[var(--neon-purple)] transition-all resize-y"
                        />
                         <p className="text-xs text-gray-400 mt-1">Defines the AI's core rules, persona, and output format. Editing this can significantly alter AI behavior.</p>
                    </div>

                    <div>
                        <label htmlFor="orchestrator-instructions" className="block text-sm font-medium text-[var(--neon-blue)] mb-2">
                            System Orchestrator (User Instructions)
                        </label>
                        <textarea
                            id="orchestrator-instructions"
                            rows={10}
                            value={orchestratorInstruction}
                            onChange={(e) => setOrchestratorInstruction(e.target.value)}
                            className="w-full bg-black/30 border border-[var(--card-border)] rounded-lg p-3 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[var(--neon-purple)] transition-all resize-y"
                        />
                        <p className="text-xs text-gray-400 mt-1">Your custom goals and design guidelines for the AI. This content is also synced with <strong>/instructions.md</strong>.</p>
                    </div>
                </div>

                <footer className="p-4 border-t border-[var(--card-border)] flex-shrink-0">
                    <button
                        onClick={onSave}
                        className="w-full flex items-center justify-center gap-2 text-sm bg-[var(--neon-green)] hover:brightness-125 text-black font-bold py-2.5 px-3 rounded-md transition-all"
                    >
                        <SaveIcon className="h-5 w-5" />
                        <span>Save & Apply Instructions</span>
                    </button>
                </footer>
            </div>
        </div>
    );
};

export default InstructionsPanel;