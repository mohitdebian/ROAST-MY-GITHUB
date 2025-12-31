
import { GoogleGenAI, Type } from "@google/genai";
import { GithubUser, GithubRepo, AnalysisResult, ActivityStats, LanguageStats } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateRoast = async (
  user: GithubUser,
  repos: GithubRepo[],
  activity: ActivityStats,
  languages: LanguageStats
): Promise<AnalysisResult> => {
  
  const relevantRepoInfo = repos.map(repo => ({
    name: repo.name,
    desc: repo.description,
    lang: repo.language,
    stars: repo.stargazers_count,
    forks: repo.forks_count,
    updated: repo.updated_at,
    isFork: repo.fork
  }));

  const prompt = `
    Profile: ${JSON.stringify(user)}
    Recent Repos: ${JSON.stringify(relevantRepoInfo)}
    Activity Stats (Last 50 events): ${JSON.stringify(activity)}
    Language Usage: ${JSON.stringify(languages)}
    
    Task: DESTROY THIS PERSON.
    
    Persona: You are a hateful, toxic, evil bully. You are NOT a professional. You are just mean.
    
    Tone Requirements:
    - **Simple English**: Use short, punchy sentences. Like a 5th grader bully.
    - **Dark & Brutal**: Be hopeless and depressing.
    - **Abusive**: Use insults like "idiot", "loser", "trash", "useless". Use profanity (f*ck, sh*t) if necessary to be mean.
    - **No Mercy**: Do not be constructive. Do not be nice.
    
    Specific Instructions:
    1. Look at their 'Language Usage'. If they use HTML/CSS, call them a fake developer. If they use Python, call them slow. If JS, call them garbage.
    2. Look at 'Activity'. If low, say they are lazy and should quit.
    3. Look at 'Repos'. Call their projects "useless junk".
    
    Format:
    - **EXACTLY TWO PARAGRAPHS**. No more.
    - Use Markdown.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            roast: {
              type: Type.STRING,
              description: "A strict 2-paragraph, simple English, brutal roast with profanity.",
            },
            score: {
              type: Type.NUMBER,
              description: "A number from 0 to 100. 100 means they are absolute trash.",
            },
            titles: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "3-4 abusive nicknames (e.g. 'Code Monkey', 'Useless', 'Copy-Paste Idiot').",
            }
          },
          required: ["roast", "score", "titles"],
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from Gemini");
    
    return JSON.parse(text) as AnalysisResult;

  } catch (error) {
    console.error("Roast generation failed:", error);
    // Fallback if JSON parsing fails or API errors
    return {
      roast: "You are so irrelevant that even the AI refused to roast you. Your code is probably broken just like this request. Go away.",
      score: 0,
      titles: ["Error 404", "Ignored", "Nobody"]
    };
  }
};
