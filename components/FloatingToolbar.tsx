import React from 'react';
import { 
    TextAlignLeftIcon, TextAlignCenterIcon, TextAlignRightIcon, 
    BoldIcon, ItalicIcon, UndoIcon, RedoIcon, SaveIcon, MagicWandIcon, 
    UnderlineIcon, QuoteIcon, CodeIcon 
} from './Icons';

interface FloatingToolbarProps {
    position: { top: number; left: number };
    onCommand: (command: string, value?: string) => void;
    onUndo: () => void;
    onRedo: () => void;
    onSave: () => void;
    onRefine: () => void;
    canUndo: boolean;
    canRedo: boolean;
}

const FloatingToolbar: React.FC<FloatingToolbarProps> = ({ 
    position, onCommand, onUndo, onRedo, onSave, onRefine, canUndo, canRedo 
}) => {
    
    const toolbarStyle: React.CSSProperties = {
        top: `${position.top}px`,
        left: `${position.left}px`,
        transform: 'translate(-50%, calc(-100% - 8px))', // Center above the element with a small gap
    };

    const buttonClass = "p-2 text-gray-300 hover:bg-black/50 hover:text-[var(--neon-pink)] rounded-md transition-colors disabled:text-gray-600 disabled:cursor-not-allowed disabled:hover:bg-transparent";

    return (
        <div 
            style={toolbarStyle}
            data-toolbar="true"
            className="absolute z-50 flex items-center gap-1 p-1 bg-[var(--card-bg)] backdrop-blur-xl border border-[var(--neon-purple)] rounded-lg shadow-2xl neon-glow-purple"
            // Prevent clicks on the toolbar from de-selecting the element in the iframe
            onMouseDown={(e) => e.preventDefault()} 
        >
            <button onClick={onUndo} disabled={!canUndo} className={buttonClass} title="Undo"><UndoIcon className="h-5 w-5"/></button>
            <button onClick={onRedo} disabled={!canRedo} className={buttonClass} title="Redo"><RedoIcon className="h-5 w-5"/></button>
            <div className="w-px h-5 bg-[var(--card-border)] mx-1"></div>
            <button onClick={() => onCommand('bold')} className={buttonClass} title="Bold"><BoldIcon className="h-5 w-5"/></button>
            <button onClick={() => onCommand('italic')} className={buttonClass} title="Italic"><ItalicIcon className="h-5 w-5"/></button>
            <button onClick={() => onCommand('underline')} className={buttonClass} title="Underline"><UnderlineIcon className="h-5 w-5"/></button>
            <div className="w-px h-5 bg-[var(--card-border)] mx-1"></div>
            <button onClick={() => onCommand('justifyLeft')} className={buttonClass} title="Align Left"><TextAlignLeftIcon className="h-5 w-5"/></button>
            <button onClick={() => onCommand('justifyCenter')} className={buttonClass} title="Align Center"><TextAlignCenterIcon className="h-5 w-5"/></button>
            <button onClick={() => onCommand('justifyRight')} className={buttonClass} title="Align Right"><TextAlignRightIcon className="h-5 w-5"/></button>
            <div className="w-px h-5 bg-[var(--card-border)] mx-1"></div>
            <button onClick={() => onCommand('formatBlock', 'blockquote')} className={buttonClass} title="Blockquote"><QuoteIcon className="h-5 w-5"/></button>
            <button onClick={() => onCommand('formatBlock', 'pre')} className={buttonClass} title="Code Block"><CodeIcon className="h-5 w-5"/></button>
            <div className="w-px h-5 bg-[var(--card-border)] mx-1"></div>
            <button onClick={onRefine} className={buttonClass} title="Refine with AI"><MagicWandIcon className="h-5 w-5"/></button>
            <button onClick={onSave} className={`${buttonClass} !text-[var(--neon-green)]`} title="Save Text Changes"><SaveIcon className="h-5 w-5"/></button>
        </div>
    );
};

export default FloatingToolbar;