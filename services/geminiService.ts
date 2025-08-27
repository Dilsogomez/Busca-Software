import { GoogleGenAI, Type } from "@google/genai";
import type { Software, FilterOption, NewsArticle } from '../types';
import { VALID_ICON_NAMES } from '../constants';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const softwareSchema = {
    type: Type.ARRAY,
    items: {
        type: Type.OBJECT,
        properties: {
            name: {
                type: Type.STRING,
                description: "The official name of the software."
            },
            description: {
                type: Type.STRING,
                description: "A concise, one-sentence description of the software in Brazilian Portuguese."
            },
            tags: {
                type: Type.ARRAY,
                items: {
                    type: Type.STRING,
                },
                description: "A list of 3 to 5 relevant tags (keywords) for the software."
            },
            price: {
                type: Type.STRING,
                description: "The pricing model. Examples: 'Gratuito', 'Gratuito + R$ X/mês', 'R$ X/mês', 'Sob consulta', 'Uso Pago', 'Gratuito (Open Source)'."
            },
            iconClass: {
                type: Type.STRING,
                enum: VALID_ICON_NAMES,
                description: "The most appropriate icon category for the software from the provided list."
            },
            brazilian: {
                type: Type.BOOLEAN,
                description: "Set to true if the software is originally from Brazil, otherwise false."
            },
            website: {
                type: Type.STRING,
                description: "The official, full URL (including https://) of the software's main website."
            },
            rating: {
                type: Type.NUMBER,
                description: "The software's average user rating out of 5, based on Google or other popular review sites. Should be a number (e.g., 4.5). If no rating is found, return 0."
            }
        },
        required: ["name", "description", "tags", "price", "iconClass", "brazilian", "website", "rating"],
    },
};

const newsSchema = {
    type: Type.ARRAY,
    items: {
        type: Type.OBJECT,
        properties: {
            title: {
                type: Type.STRING,
                description: "The headline of the news article in Brazilian Portuguese."
            },
            summary: {
                type: Type.STRING,
                description: "A brief, one or two-sentence summary of the article in Brazilian Portuguese."
            },
            url: {
                type: Type.STRING,
                description: "The direct URL to the full news article."
            },
            imageUrl: {
                type: Type.STRING,
                description: "A valid, public, and direct URL to a relevant high-quality image for the article. This must be a direct image link (e.g., ending in .jpg, .png), not a webpage."
            },
            category: {
                type: Type.STRING,
                description: "A single, relevant category for the news (e.g., 'Inteligência Artificial', 'Startups', 'Desenvolvimento', 'Negócios')."
            },
            source: {
                type: Type.STRING,
                description: "The name of the news publication or source (e.g., 'TechCrunch', 'Wired', 'The Verge')."
            }
        },
        required: ["title", "summary", "url", "imageUrl", "category", "source"],
    },
};

const buildPrompt = (searchTerm: string, filter: FilterOption): string => {
    let prompt = `You are an expert software discovery engine. Your task is to find software based on the user's query and filters.
    Always respond in Brazilian Portuguese. Prioritize well-known Brazilian solutions when possible.
    
    User Query: "${searchTerm || 'popular software'}"
    
    Apply the following filter: `;

    switch (filter) {
        case 'ia':
            prompt += "'AI Tools'. Find software that uses or is related to Artificial Intelligence.";
            break;
        case 'empresarial':
            prompt += "'Business Solutions'. Find software focused on business management, productivity, and operations, excluding purely consumer or highly specialized AI tools unless they solve a core business problem (like a CRM with AI).";
            break;
        case 'gratuitos':
            prompt += "'Free'. Find software that has a completely free tier or is open source.";
            break;
        case 'pagos':
            prompt += "'Paid'. Find software that has a paid subscription or license model. It can have a free trial.";
            break;
        case 'brasileiros':
            prompt += "'Brazilian Apps Only'. Find ONLY software that was created and is maintained by Brazilian companies.";
            break;
        case 'todos':
        default:
            prompt += "'All'. No specific filter, show a diverse range of results.";
            break;
    }

    prompt += "\n\nReturn a JSON array of up to 12 results that strictly follows the provided schema. For each software, include its average user rating out of 5 (e.g., from Google Reviews). For the 'iconClass', choose the most fitting category from the list. Ensure the 'website' URL is the official homepage.";
    
    return prompt;
};

export const findSoftware = async (searchTerm: string, filter: FilterOption): Promise<Software[]> => {
    try {
        const prompt = buildPrompt(searchTerm, filter);
        
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: softwareSchema,
                temperature: 0.2,
                thinkingConfig: { thinkingBudget: 0 }, // Disable thinking for lower latency
            },
        });
        
        const jsonText = response.text.trim();
        const result = JSON.parse(jsonText);

        if (Array.isArray(result)) {
            return result as Software[];
        }
        
        console.warn("Gemini API did not return a valid array for software. Response:", result);
        return [];

    } catch (error) {
        console.error("Error fetching software from Gemini API:", error);
        throw new Error("Failed to communicate with Gemini API.");
    }
};

export const findNews = async (): Promise<NewsArticle[]> => {
    try {
        const prompt = `You are a technology news curator. Your task is to find 12 recent, relevant, and diverse technology news articles.
        Cover topics like Artificial Intelligence, Startups, Big Tech, Software Development, and Business Tech.
        For each article, provide a valid, public, and direct URL to a high-quality, relevant image. This must be a direct image link (e.g., ending in .jpg, .png, .webp), not a link to a webpage.
        
        Return a JSON array of 12 news articles in Brazilian Portuguese that strictly follows the provided schema.`;
        
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: newsSchema,
                temperature: 0.5,
                thinkingConfig: { thinkingBudget: 0 }, // Disable thinking for lower latency
            },
        });
        
        const jsonText = response.text.trim();
        const result = JSON.parse(jsonText);

        if (Array.isArray(result)) {
            return result as NewsArticle[];
        }
        
        console.warn("Gemini API did not return a valid array for news. Response:", result);
        return [];

    } catch (error) {
        console.error("Error fetching news from Gemini API:", error);
        throw new Error("Failed to communicate with Gemini API.");
    }
};