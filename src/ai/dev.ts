import { config } from 'dotenv';
config();

import '@/ai/flows/automatically-detect-source-language.ts';
import '@/ai/flows/translate-extracted-text.ts';
import '@/ai/flows/extract-text-from-image.ts';
