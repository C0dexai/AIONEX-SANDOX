export type FileSystemState = Record<string, string>;

export interface DraggableComponent {
  id: string;
  name: string;
  html: string;
}

export interface ChatMessage {
  role: 'user' | 'model' | 'system';
  content: string; // For user message, system message, or model's brief conversational text
  explanation?: string; // For model's detailed explanation of code, formatted in markdown
  code?: { path: string; content: string; }[]; // Can contain updates for multiple files
  suggestions?: string[]; // Optional array of suggested next prompts
}

export interface AjaxTemplate {
  id: string;
  name: string;
  description: string;
  files: FileSystemState;
  blockquote?: string;
}

export interface SavedUrl {
  id: string;
  title: string;
  url: string;
}


// System Operator Types
export interface Template {
    path: string;
    tags: string[];
    description: string;
}

export interface TemplateRegistry {
    TEMPLATES: Record<string, Template>;
    UI: Record<string, Template>;
    DATASTORE: Record<string, Template>;
}

export interface HandoverLogEntry {
    action: string;
    by: string;
    at: string;
    details: Record<string, any>;
}

export interface HandoverLog {
    container_id: string;
    operator: string;
    prompt: string;
    chosen_templates: {
        base: string;
        ui: string[];
        datastore: string | null;
    };
    environment?: Record<string, string>;
    status: string;
    created_at: string;
    history: HandoverLogEntry[];
}