'use server';

import { marked } from 'marked';

export async function GeneratePostContent(prompt) {
  if (!prompt?.trim()) {
    return { error: 'Please enter a topic!' };
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [{ text: prompt }],
            },
          ],
          generationConfig: {
            temperature: 0.8,
            maxOutputTokens: 2000,
          },
        }),
      }
    );

    if (!response.ok) {
      const err = await response.json();
      return { error: err.error?.message || 'API request failed' };
    }

    const data = await response.json();
    const markdown = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

    if (!markdown) {
      return { error: 'No content generated' };
    }

    const html = await marked.parse(markdown);

    return { content: html };
  } catch (err) {
    console.error(err);
    return { error: 'Something went wrong' };
  }
}