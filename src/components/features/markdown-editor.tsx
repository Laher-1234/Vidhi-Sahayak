import { useActionState, useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useToast } from '@/hooks/use-toast';
import { handleSummarizeMarkdown, type MarkdownSummarizerState } from '@/app/actions';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { SubmitButton } from '@/components/ui/submit-button';

const initialState: MarkdownSummarizerState = { type: 'success' };
const defaultMarkdown = `# Welcome to the Markdown Editor!

This is a live preview of your Markdown text. You can use standard Markdown syntax here.

## Features

- Real-time preview
- GitHub Flavored Markdown (GFM) support for tables, strikethrough, etc.
- AI-powered summarization

### Example Table

| Feature         | Status      |
| --------------- | ----------- |
| Live Preview    | ✅ Complete |
| AI Summarizer   | ✅ Complete |
| More Features   | 🚀 Coming Soon |

### Example Code Block

\`\`\`javascript
function greet() {
  console.log("Hello, Markdown!");
}
greet();
\`\`\`

Start typing in the editor to see the magic happen!
`;

export default function MarkdownEditor() {
  const [state, formAction] = useActionState(handleSummarizeMarkdown, initialState);
  const [markdownText, setMarkdownText] = useState(defaultMarkdown);
  const { toast } = useToast();

  useEffect(() => {
    if (state?.type === 'error') {
      toast({
        variant: 'destructive',
        title: 'Summarization Failed',
        description: state.message,
      });
    }
  }, [state, toast]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Markdown Editor & Summarizer</CardTitle>
        <CardDescription>
          Write Markdown and see the live preview. Use the AI button to generate a summary.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="markdown-input" className="text-sm font-medium">
              Markdown Input
            </label>
            <form action={formAction}>
              <Textarea
                id="markdown-input"
                name="markdownText"
                value={markdownText}
                onChange={(e) => setMarkdownText(e.target.value)}
                className="min-h-[400px] font-mono text-sm"
                placeholder="Type your Markdown here..."
              />
              <SubmitButton className="mt-4">Summarize with AI</SubmitButton>
            </form>
          </div>
          <div className="space-y-2">
            <label htmlFor="markdown-output" className="text-sm font-medium">
              Live Preview
            </label>
            <Card className="min-h-[400px] bg-muted/50">
                <CardContent className="p-4">
                    <article className="prose dark:prose-invert max-w-none">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {markdownText}
                        </ReactMarkdown>
                    </article>
                </CardContent>
            </Card>
          </div>
        </div>

        {state?.type === 'success' && state.summary && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">AI Generated Summary</h3>
            <Card className="bg-muted/50">
              <CardContent className="p-4">
                <p className="whitespace-pre-wrap text-sm">{state.summary}</p>
              </CardContent>
            </Card>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
