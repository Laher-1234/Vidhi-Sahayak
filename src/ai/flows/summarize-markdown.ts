/**
 * @fileOverview An AI agent for summarizing markdown text.
 *
 * - summarizeMarkdown - A function that summarizes a given markdown document.
 * - SummarizeMarkdownInput - The input type for the summarizeMarkdown function.
 * - SummarizeMarkdownOutput - The return type for the summarizeMarkdown function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeMarkdownInputSchema = z.object({
  markdownText: z.string().describe('The markdown text to be summarized.'),
});
export type SummarizeMarkdownInput = z.infer<typeof SummarizeMarkdownInputSchema>;

const SummarizeMarkdownOutputSchema = z.object({
  summary: z
    .string()
    .describe('A concise summary of the provided markdown text.'),
});
export type SummarizeMarkdownOutput = z.infer<typeof SummarizeMarkdownOutputSchema>;

export async function summarizeMarkdown(
  input: SummarizeMarkdownInput
): Promise<SummarizeMarkdownOutput> {
  return summarizeMarkdownFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeMarkdownPrompt',
  input: {schema: SummarizeMarkdownInputSchema},
  output: {schema: SummarizeMarkdownOutputSchema},
  prompt: `You are an expert at summarizing technical and non-technical documents. Your task is to read the following text, provided in Markdown format, and generate a concise summary.

The summary should capture the main points and key takeaways from the document.

Original Markdown Text:
{{{markdownText}}}

Summary:`,
});

const summarizeMarkdownFlow = ai.defineFlow(
  {
    name: 'summarizeMarkdownFlow',
    inputSchema: SummarizeMarkdownInputSchema,
    outputSchema: SummarizeMarkdownOutputSchema,
  },
  async input => {
    if (!input.markdownText.trim()) {
      return { summary: '' };
    }
    const {output} = await prompt(input);
    return output!;
  }
);
