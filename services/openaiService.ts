/*
This file has been disabled because the '@openai/agents' library it depends on
is not fully compatible with the browser environment and was causing the application
to fail on load. The web search functionality is currently unavailable.

import { Agent, run, webSearchTool } from '@openai/agents';
import OpenAI from 'openai';

let searchAgent: Agent | null = null;

const initializeAgent = (): Agent => {
    if (searchAgent) return searchAgent;

    // The OpenAI SDK will automatically look for the OPENAI_API_KEY environment variable.
    // The dangerouslyAllowBrowser flag is required to use the SDK in a browser environment.
    const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
        dangerouslyAllowBrowser: true,
    });

    searchAgent = new Agent({
        name: 'Web Searcher Agent (Kara)',
        instructions: 'You are a helpful agent that searches the web to answer questions. Provide concise answers and include source URLs if available.',
        tools: [webSearchTool()],
        model: 'gpt-4o-mini',
    });
    return searchAgent;
};

/**
 * Performs a web search using an OpenAI agent.
 * @param query The search query.
 * @returns A promise that resolves to the search results as a string.
 * /
export async function webSearch(query: string): Promise<string> {
    const agent = initializeAgent();

    if (!query) {
        return "Query was empty. Please provide something to search for.";
    }

    try {
        const result = await run(agent, query);
        return result.finalOutput || "No results found.";
    } catch (error) {
        console.error("Error performing web search with OpenAI agent:", error);
        if (error instanceof Error && error.message.includes('API key')) {
            return "Error: OpenAI API key is invalid or missing.";
        }
        return "An error occurred during the web search.";
    }
}
*/
