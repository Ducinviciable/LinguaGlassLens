'use server';

import { translateText } from '@/ai/flows/translate-text';
import type { TranslateTextOutput } from '@/ai/flows/translate-text';
import { extractTextFromImage } from '@/ai/flows/extract-text-from-image';

type TranslationResult = TranslateTextOutput & { error?: string };
type OcrResult = { extractedText: string; error?: string };

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
  } catch (e: any) {
    console.error('Translation failed:', e);
    const errorMessage = e.message || 'Translation failed. Please try again later.';
    return {
      translatedText: '',
      detectedSourceLanguage: '',
      error: errorMessage,
    };
  }
}

export async function performOcr(imageDataUri: string): Promise<OcrResult> {
  if (!imageDataUri) {
    return { extractedText: '', error: 'No image data provided.' };
  }
  try {
    const result = await extractTextFromImage({ imageDataUri });
    return result;
  } catch (e: any) {
    console.error('OCR failed:', e);
    const errorMessage = e.message || 'Failed to extract text from the image.';
    return {
      extractedText: '',
      error: errorMessage,
    };
  }
}
