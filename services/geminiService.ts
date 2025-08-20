import { GoogleGenAI, Type } from "@google/genai";
import type { FileSystemState, ChatMessage } from '../types';

function formatFileSystemForPrompt(fileSystem: FileSystemState, previewRoot: string | null): string {
    const fileEntries = Object.entries(fileSystem)
        .sort(([pathA], [pathB]) => pathA.localeCompare(pathB))
        .map(([path, content]) => {
            const language = path.split('.').pop() || '';
            return `
---
File: ${path}
\`\`\`${language}
${content}
\`\`\`
`;
        });
    
    const previewContext = previewRoot ? `The user is currently previewing the project from the "${previewRoot}" directory.` : 'The user is currently previewing the root directory.';

    return `Here is the current state of all files in the project. Use this as context for the user's request.
${previewContext}
${fileEntries.join('')}
---
`;
}

export async function chatWithAgent(
    history: ChatMessage[], 
    fileSystem: FileSystemState, 
    previewRoot: string | null,
    supervisorInstruction: string,
    orchestratorInstruction: string
): Promise<{ text: string, explanation: string, code?: { path: string, content: string }[], suggestions?: string[] }> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
    const model = "gemini-2.5-flash";

    const systemInstruction = `${supervisorInstruction}

## User's Custom Instructions (System Orchestrator)
${orchestratorInstruction}

## Project File System Context
${formatFileSystemForPrompt(fileSystem, previewRoot)}
`;

    const contents = history
        .filter(msg => msg.role === 'user' || msg.role === 'model')
        .map(msg => ({
            role: msg.role,
            parts: [{ text: msg.content }],
        }));

    try {
        const response = await ai.models.generateContent({
            model,
            contents,
            config: {
                systemInstruction,
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        text: {
                            type: Type.STRING,
                            description: 'A brief, friendly, conversational reply to the user. Keep it short.'
                        },
                        explanation: {
                            type: Type.STRING,
                            description: "A detailed explanation of any code changes, including what was done, why it was done, and suggestions for the user's next steps. Use markdown for formatting (e.g., lists, bold text)."
                        },
                        code: {
                            type: Type.ARRAY,
                            description: "An array of objects, where each object has a 'path' and 'content' key. Represents all files modified by the agent.",
                            nullable: true,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    path: { type: Type.STRING },
                                    content: { type: Type.STRING }
                                },
                                required: ['path', 'content']
                            }
                        },
                        suggestions: {
                            type: Type.ARRAY,
                            description: "An array of 3-4 short, practical, and creative next-step suggestions for the user to try. Each suggestion should be a prompt the user can send.",
                            nullable: true,
                            items: {
                                type: Type.STRING
                            }
                        }
                    },
                    required: ['text', 'explanation']
                }
            },
        });

        const responseText = response.text.trim();
        const parsedJson = JSON.parse(responseText);

        if (parsedJson && parsedJson.text && parsedJson.explanation) {
             const { text, explanation, code, suggestions } = parsedJson;
             return { text, explanation, code, suggestions };
        }
        
        console.error("Gemini API returned unexpected JSON structure:", responseText);
        throw new Error("Received an invalid response from the AI agent.");

    } catch (error) {
        console.error("Error calling Gemini API:", error);
        if (error instanceof Error) {
            if (error.message.includes('API key')) {
                 throw new Error(`Invalid Gemini API key. Please ensure it is correctly configured in the environment.`);
            }
            throw new Error(`Gemini API request failed: ${error.message}`);
        }
        throw new Error("An unknown error occurred while communicating with the Gemini API.");
    }
}

export async function getAiHint(history: ChatMessage[]): Promise<string> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
    const model = "gemini-2.5-flash";

    const systemInstruction = `You are a helpful AI assistant. The user is in a web development sandbox. Based on the last few messages of the conversation, suggest one single, concise, and practical next step for the user.
- The suggestion should be a prompt the user can give to an AI.
- Return ONLY the suggested prompt text.
- Do NOT include any preamble, explanation, or markdown formatting.
- Be creative and helpful. For example, if the user just added a button, suggest styling it or adding a click handler.
- Keep the suggestion under 15 words.`;

    // Take the last 4 messages for context, it's enough for a hint.
    const lastMessages = history.slice(-4);
    
    const contents = lastMessages
        .filter(msg => msg.role === 'user' || msg.role === 'model')
        .map(msg => ({
            role: msg.role,
            // Use the main content for hints, not the detailed explanation
            parts: [{ text: msg.content }],
        }));

    if (contents.length === 0) {
        // No user/model messages to generate a hint from.
        return '';
    }

    try {
        const response = await ai.models.generateContent({
            model,
            contents,
            config: {
                systemInstruction,
                temperature: 0.8, // Higher temperature for more creative hints
                stopSequences: ['\n'] // Stop at the first newline to keep it concise
            },
        });

        return response.text.trim();
    } catch (error) {
        console.error("Error fetching AI hint:", error);
        // Fail silently, a missing hint is not a critical error.
        return '';
    }
}


export async function refineCodeWithAgent(code: string, language: string, instruction: string): Promise<string> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
    const model = "gemini-2.5-flash";

    const systemInstruction = `You are a world-class software engineer. Your task is to modify the user's code based on their instruction.
You MUST only return the complete, raw code for the specified language.
Do NOT include any markdown formatting like \`\`\`${language} or \`\`\`.
Do NOT include any explanations, comments about your changes, or any other text that is not valid code.
Your output will be directly placed into a code editor, so it must be perfect.
`;

    const userPrompt = `Instruction: "${instruction}"

Language: ${language}

Current Code:
---
${code}
---
`;

    try {
        const response = await ai.models.generateContent({
            model,
            contents: userPrompt,
            config: {
                systemInstruction,
                temperature: 0.2, // Lower temperature for more deterministic code output
            }
        });

        const refinedCode = response.text.trim();
        return refinedCode;

    } catch (error) {
        console.error("Error calling Gemini API for code refinement:", error);
        if (error instanceof Error) {
            if (error.message.includes('API key')) {
                 throw new Error(`Invalid Gemini API key. Please ensure it is correctly configured in the environment.`);
            }
            throw new Error(`Gemini API request failed: ${error.message}`);
        }
        throw new Error("An unknown error occurred while communicating with the Gemini API.");
    }
}
