'use server';

import { translateText } from '@/ai/flows/automatically-detect-source-language';
import type { TranslateTextOutput } from '@/ai/flows/automatically-detect-source-language';

type TranslationResult = TranslateTextOutput & { error?: string };

export async function getTranslation(
  text: string,
  targetLanguage: string
): Promise<TranslationResult> {
  if (!text.trim()) {
    return { translatedText: '', detectedSourceLanguage: '' };
  }
  try {
    const result = await translateText({ text, targetLanguage });
    return result;
  } catch (error) {
    console.error('Translation failed:', error);
    return {
      translatedText: '',
      detectedSourceLanguage: '',
      error: 'Translation failed. Please try again later.',
    };
  }
}
