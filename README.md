# LinguaLens - Real-time Screen Translator

This is a Next.js application built with Firebase Studio that provides real-time translation of on-screen text. It's perfect for translating text while gaming, watching videos, or any other activity where you need quick translations.

## How it works

1.  **Screen Capture**: The application uses the browser's `getDisplayMedia` API to capture the content of a selected screen or window.
2.  **Text Extraction (OCR)**: Periodically, it captures a frame from the video stream, sends it to a Genkit AI flow which uses a multimodal Gemini model to extract any visible text.
3.  **Translation**: The extracted text is then sent to another Genkit AI flow that automatically detects the source language and translates it to your chosen target language.
4.  **Display**: The translated text is shown in a separate, customizable overlay window that you can position over your game or application.

## Prerequisites

- [Node.js](https://nodejs.org/en) (v18 or later recommended)
- [npm](https://www.npmjs.com/) (usually comes with Node.js)

## Getting Started

Follow these steps to get the application running on your local machine.

### 1. Installation

First, open your terminal, navigate to the project directory, and install the necessary dependencies:

```bash
npm install
```

### 2. Set up Environment Variables

The application uses Genkit and Google AI for its OCR and translation capabilities, which requires an API key.

1.  Create a new file named `.env` in the root of your project directory.
2.  Obtain a Gemini API key from [Google AI Studio](https://aistudio.google.com/app/apikey).
3.  Add the API key to your `.env` file like this:

```
GEMINI_API_KEY=your_google_api_key_here
```

**Important**: Remember to keep your API key private and never commit the `.env` file to version control.

### 3. Running the Application

Once the dependencies are installed and your environment variables are set, you can start the development server:

```bash
npm run dev
```

This will start the Next.js application, typically on `http://localhost:9002`. You can open this URL in your web browser to use LinguaLens.

## Available Scripts

- `npm run dev`: Starts the Next.js development server with Turbopack.
- `npm run build`: Builds the application for production.
- `npm run start`: Starts a production server.
- `npm run lint`: Lints the code to check for errors.
