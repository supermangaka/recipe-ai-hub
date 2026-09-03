import Groq from 'groq-sdk';
import { Recipe, Difficulty } from '@/types/recipe';

if (!process.env.GROQ_API_KEY) {
  throw new Error('GROQ_API_KEY is not set in environment variables');
}

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const MODEL = 'openai/gpt-oss-120b';

export type GenerateRecipeInput =
  | { mode: 'list'; ingredients: string[]; cuisine: string; difficulty: Difficulty; locale: string }
  | { mode: 'freeform'; description: string; cuisine: string; difficulty: Difficulty; locale: string };

const localeNames: Record<string, string> = {
  en: 'English',
  ru: 'Russian',
  pt: 'Portuguese',
};

function buildPrompt(input: GenerateRecipeInput): string {
  const languageName = localeNames[input.locale] ?? 'English';

  const sourceInstruction =
    input.mode === 'list'
      ? `Create a recipe using these ingredients: ${input.ingredients.join(', ')}.`
      : `The user described what they have available in loose, informal terms: "${input.description}". Infer a reasonable, specific ingredient list from this description (assume common pantry staples like salt, oil, and water are available unless the description suggests otherwise).`;

  return `You are a recipe generator. ${sourceInstruction}
Cuisine preference: ${input.cuisine === 'any' ? 'no preference' : input.cuisine}.
Difficulty: ${input.difficulty}.

Respond ONLY with valid JSON, no markdown formatting, no code fences, no extra text. The JSON must match this exact shape:
{
  "title": string,
  "cuisine": string,
  "difficulty": "easy" | "medium" | "hard",
  "cookTimeMinutes": number,
  "servings": number,
  "ingredients": string[],
  "instructions": string[],
  "locale": string
}

IMPORTANT: All text fields (title, instructions, ingredients) must be written entirely in ${languageName}. The "locale" field must be exactly "${input.locale}".`;
}

function parseRecipeResponse(rawText: string): (Recipe & { locale: string }) | null {
  try {
    const cleaned = rawText.trim().replace(/^```json\s*/i, '').replace(/```$/, '');
    const parsed = JSON.parse(cleaned);

    if (
      typeof parsed.title !== 'string' ||
      typeof parsed.cuisine !== 'string' ||
      !['easy', 'medium', 'hard'].includes(parsed.difficulty) ||
      typeof parsed.cookTimeMinutes !== 'number' ||
      typeof parsed.servings !== 'number' ||
      !Array.isArray(parsed.ingredients) ||
      !Array.isArray(parsed.instructions) ||
      typeof parsed.locale !== 'string'
    ) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

export async function generateRecipe(input: GenerateRecipeInput): Promise<Recipe> {
  const prompt = buildPrompt(input);
  const maxAttempts = 2;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const completion = await groq.chat.completions.create({
      model: MODEL,
      max_tokens: 1500,
      response_format: { type: 'json_object' },
      messages: [{ role: 'user', content: prompt }],
    });

    const rawText = completion.choices[0]?.message?.content;
    if (!rawText) continue;

    const parsed = parseRecipeResponse(rawText);

    if (parsed && parsed.locale === input.locale) {
      const { locale, ...recipe } = parsed;
      return recipe;
    }
  }

  throw new Error('Failed to generate a valid recipe after multiple attempts');
}