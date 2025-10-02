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
  } catch (error) {
    console.error('Translation failed:', error);
    return {
      translatedText: '',
      detectedSourceLanguage: '',
      error: 'Translation failed. Please try again later.',
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
  } catch (error) {
    console.error('OCR failed:', error);
    return {
      extractedText: '',
      error: 'Failed to extract text from the image.',
    };
  }
}
