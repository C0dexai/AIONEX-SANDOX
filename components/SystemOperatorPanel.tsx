import React, { useState, useMemo } from 'react';
import type { FileSystemState, HandoverLog } from '../types';
import { registry, createContainer } from '../services/systemOperatorService';
import { CpuIcon, PlayIcon, TrashIcon, ChevronDownIcon } from './Icons';

interface SystemOperatorPanelProps {
    fileSystem: FileSystemState;
    onCreateContainer: (newFiles: FileSystemState, rootPath: string) => void;
    onSetPreviewRoot: (path: string) => void;
    onDeleteContainer: (path: string) => void;
}

const TemplateSelector: React.FC<{
    title: string;
    templates: Record<string, any>;
    selected: string | string[] | null;
    onSelect: (selection: string | string[]) => void;
    isMultiSelect?: boolean;
}> = ({ title, templates, selected, onSelect, isMultiSelect = false }) => {
    
    const handleSelect = (key: string) => {
        if (isMultiSelect && Array.isArray(selected)) {
            const newSelection = selected.includes(key)
                ? selected.filter(item => item !== key)
                : [...selected, key];
            onSelect(newSelection);
        } else {
            onSelect(key);
        }
    };

    return (
        <div>
            <h4 className="text-sm font-semibold text-[var(--neon-blue)] mb-2">{title}</h4>
            <div className="grid grid-cols-2 gap-2">
                {Object.entries(templates).map(([key, template]) => {
                    const isSelected = isMultiSelect 
                        ? Array.isArray(selected) && selected.includes(key)
                        : selected === key;
                    
                    return (
                        <button
                            key={key}
                            onClick={() => handleSelect(key)}
                            className={`p-2 text-xs text-left rounded-md transition-all border ${isSelected ? 'bg-[var(--neon-green)]/20 border-[var(--neon-green)] text-white' : 'bg-black/20 hover:bg-black/40 border-transparent hover:border-gray-600'}`}
                            title={template.description}
                        >
                           <p className="font-bold">{key}</p>
                           <p className="text-gray-400">{template.description}</p>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};


const ContainerCard: React.FC<{
    log: HandoverLog;
    path: string;
    onSetPreview: (path: string) => void;
    onDelete: (path: string) => void;
}> = ({ log, path, onSetPreview, onDelete }) => {
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);
    return (
        <div className="bg-black/30 p-3 rounded-md border border-[var(--card-border)]">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-xs text-gray-400 font-mono truncate" title={log.container_id}>{log.container_id.split('-')[0]}</p>
                    <p className="font-semibold text-sm">{log.prompt}</p>
                </div>
                <div className="flex gap-1 flex-shrink-0">
                    <button onClick={() => onSetPreview(path)} title="Set as Preview Root" className="p-1.5 text-gray-300 hover:text-[var(--neon-green)]"><PlayIcon className="h-4 w-4" /></button>
                    <button onClick={() => onDelete(path)} title="Delete Container" className="p-1.5 text-gray-300 hover:text-[var(--neon-pink)]"><TrashIcon className="h-4 w-4" /></button>
                </div>
            </div>
             <div className="text-xs mt-2 space-y-1">
                <p><span className="font-semibold text-gray-400">Base:</span> {log.chosen_templates.base}</p>
                <p><span className="font-semibold text-gray-400">UI:</span> {log.chosen_templates.ui.join(', ') || 'None'}</p>
                {log.environment && Object.values(log.environment).some(v => v) && (
                     <p><span className="font-semibold text-gray-400">Env:</span> {Object.keys(log.environment).filter(k => log.environment?.[k]).join(', ')}</p>
                )}
            </div>
            <button onClick={() => setIsHistoryOpen(!isHistoryOpen)} className="text-xs text-[var(--neon-blue)] hover:underline mt-2 flex items-center gap-1">
                <span>{isHistoryOpen ? 'Hide' : 'Show'} History</span>
                <ChevronDownIcon className={`w-3 h-3 transition-transform ${isHistoryOpen ? 'rotate-180' : ''}`} />
            </button>
            {isHistoryOpen && (
                <div className="mt-2 pt-2 border-t border-[var(--card-border)] text-xs text-gray-400 font-mono space-y-1 max-h-24 overflow-y-auto">
                    {log.history.map((entry, i) => (
                        <p key={i}>[{new Date(entry.at).toLocaleTimeString()}] {entry.action}: {entry.details.command || JSON.stringify(entry.details.templates)}</p>
                    ))}
                </div>
            )}
        </div>
    );
};

const SystemOperatorPanel: React.FC<SystemOperatorPanelProps> = ({ fileSystem, onCreateContainer, onSetPreviewRoot, onDeleteContainer }) => {
    const [prompt, setPrompt] = useState('Build a fancy to-do app');
    const [selectedBase, setSelectedBase] = useState<string>('REACT');
    const [selectedUi, setSelectedUi] = useState<string[]>(['TAILWIND']);
    const [apiName, setApiName] = useState('');
    const [apiKey, setApiKey] = useState('');

    const existingContainers = useMemo(() => {
        return Object.keys(fileSystem)
            .filter(path => path.match(/^\/containers\/container_[a-zA-Z0-9-]+\/handover.json$/))
            .map(path => {
                try {
                    const log = JSON.parse(fileSystem[path]);
                    const containerPath = path.replace('/handover.json', '');
                    return { path: containerPath, log };
                } catch (e) {
                    console.error(`Failed to parse handover.json at ${path}`, e);
                    return null;
                }
            })
            .filter(Boolean) as { path: string; log: HandoverLog }[];
    }, [fileSystem]);
    

    const handleCreateContainer = () => {
        if (!prompt.trim() || !selectedBase) {
            alert("Please provide a prompt and select a base template.");
            return;
        }
        
        const environment: Record<string, string> = {};
        if (apiName.trim()) {
            environment['API_NAME'] = apiName.trim();
        }
        if (apiKey.trim()) {
            environment['API_KEY'] = apiKey.trim();
        }

        const { newFiles, rootPath } = createContainer(
            'system_operator',
            prompt,
            { base: selectedBase, ui: selectedUi, datastore: null },
            environment
        );
        onCreateContainer(newFiles, rootPath);
        setApiName('');
        setApiKey('');
    };

    return (
        <div className="space-y-4 text-sm">
            <div className="space-y-3 p-2 bg-black/20 rounded-md">
                <h3 className="text-base font-bold text-[var(--neon-pink)]">New Container</h3>
                <div>
                     <label className="block text-xs font-medium text-gray-400 mb-1">Operator Prompt</label>
                     <input
                        type="text"
                        value={prompt}
                        onChange={e => setPrompt(e.target.value)}
                        className="w-full bg-black/30 border border-[var(--card-border)] rounded-md p-2 text-xs focus:outline-none focus:ring-1 focus:ring-[var(--neon-purple)]"
                        placeholder="Describe the app's goal..."
                     />
                </div>
                 <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1">Environment Variables</label>
                    <div className="flex flex-col gap-2">
                        <input
                            type="text"
                            value={apiName}
                            onChange={e => setApiName(e.target.value)}
                            className="w-full bg-black/30 border border-[var(--card-border)] rounded-md p-2 text-xs focus:outline-none focus:ring-1 focus:ring-[var(--neon-purple)]"
                            placeholder="API_NAME value (e.g. 'gemini-2.5-flash')"
                         />
                        <input
                            type="password"
                            value={apiKey}
                            onChange={e => setApiKey(e.target.value)}
                            className="w-full bg-black/30 border border-[var(--card-border)] rounded-md p-2 text-xs focus:outline-none focus:ring-1 focus:ring-[var(--neon-purple)]"
                            placeholder="API_KEY value"
                         />
                     </div>
                </div>
                <TemplateSelector 
                    title="Base Template"
                    templates={registry.TEMPLATES}
                    selected={selectedBase}
                    onSelect={(s) => setSelectedBase(s as string)}
                />
                 <TemplateSelector 
                    title="UI"
                    templates={registry.UI}
                    selected={selectedUi}
                    onSelect={(s) => setSelectedUi(s as string[])}
                    isMultiSelect
                />
                <button 
                    onClick={handleCreateContainer}
                    className="w-full flex items-center justify-center gap-2 text-sm bg-[var(--neon-green)] hover:brightness-125 text-black font-bold py-2 px-3 rounded-md transition-all"
                >
                    <CpuIcon className="h-4 w-4"/>
                    Create Container
                </button>
            </div>
            
            {existingContainers.length > 0 && (
                 <div className="space-y-2">
                    <h3 className="text-base font-bold text-[var(--neon-pink)] px-2">Existing Containers</h3>
                    <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                       {existingContainers.map(container => (
                            <ContainerCard 
                                key={container.path}
                                path={container.path}
                                log={container.log}
                                onSetPreview={onSetPreviewRoot}
                                onDelete={onDeleteContainer}
                            />
                       ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SystemOperatorPanel;