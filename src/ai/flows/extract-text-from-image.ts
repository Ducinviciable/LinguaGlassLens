'use server';

/**
 * @fileOverview Extracts text from an image using a multimodal AI model.
 *
 * - extractTextFromImage - A function that handles the text extraction process.
 * - ExtractTextFromImageInput - The input type for the extractTextFromImage function.
 * - ExtractTextFromImageOutput - The return type for the extractTextFromImage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';

const ExtractTextFromImageInputSchema = z.object({
  imageDataUri: z
    .string()
    .describe(
      "A photo of the screen to extract text from, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type ExtractTextFromImageInput = z.infer<typeof ExtractTextFromImageInputSchema>;

const ExtractTextFromImageOutputSchema = z.object({
  extractedText: z
    .string()
    .describe('The text extracted from the image. If no text is found, return an empty string.'),
});
export type ExtractTextFromImageOutput = z.infer<typeof ExtractTextFromImageOutputSchema>;

export async function extractTextFromImage(
  input: ExtractTextFromImageInput
): Promise<ExtractTextFromImageOutput> {
  return extractTextFromImageFlow(input);
}

const extractTextFromImageFlow = ai.defineFlow(
  {
    name: 'extractTextFromImageFlow',
    inputSchema: ExtractTextFromImageInputSchema,
    outputSchema: ExtractTextFromImageOutputSchema,
  },
  async ({ imageDataUri }) => {
    const model = googleAI.model('gemini-1.5-flash-latest');
    
    const { output } = await ai.generate({
        model: model,
        prompt: [
            { text: 'You are an Optical Character Recognition (OCR) expert. Extract all text from the provided image. If there is no text in the image, you must return an empty string for the extractedText field.'},
            { media: { url: imageDataUri }},
        ],
        output: {
            schema: ExtractTextFromImageOutputSchema,
        }
    });
    return output!;
  }
);
