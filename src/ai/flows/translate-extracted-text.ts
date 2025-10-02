'use server';

/**
 * @fileOverview Translates extracted text into the user's chosen language.
 *
 * - translateExtractedText - A function that handles the translation process.
 * - TranslateExtractedTextInput - The input type for the translateExtractedText function.
 * - TranslateExtractedTextOutput - The return type for the translateExtractedText function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TranslateExtractedTextInputSchema = z.object({
  text: z.string().describe('The text to translate.'),
  targetLanguage: z.string().describe('The target language code (e.g., \"en\", \"vi\").'),
});
export type TranslateExtractedTextInput = z.infer<typeof TranslateExtractedTextInputSchema>;

const TranslateExtractedTextOutputSchema = z.object({
  translatedText: z.string().describe('The translated text.'),
});
export type TranslateExtractedTextOutput = z.infer<typeof TranslateExtractedTextOutputSchema>;

export async function translateExtractedText(
  input: TranslateExtractedTextInput
): Promise<TranslateExtractedTextOutput> {
  return translateExtractedTextFlow(input);
}

const translateExtractedTextPrompt = ai.definePrompt({
  name: 'translateExtractedTextPrompt',
  input: {schema: TranslateExtractedTextInputSchema},
  output: {schema: TranslateExtractedTextOutputSchema},
  prompt: `Translate the following text into {{{targetLanguage}}}:\n\n{{{text}}}`,
});

const translateExtractedTextFlow = ai.defineFlow(
  {
    name: 'translateExtractedTextFlow',
    inputSchema: TranslateExtractedTextInputSchema,
    outputSchema: TranslateExtractedTextOutputSchema,
  },
  async input => {
    const {output} = await translateExtractedTextPrompt(input);
    return output!;
  }
);
