
'use client';

import {
  FileText,
  Newspaper,
  Languages,
  Gavel,
  BookText,
  ArrowDownToLine,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useState } from 'react';
import LegalDrafting from './features/legal-drafting';
import FactVerification from './features/fact-verification';
import MarathiTransliteration from './features/marathi-transliteration';
import LegalSimplifier from './features/legal-simplifier';
import MarkdownEditor from './features/markdown-editor';

type Feature =
  | 'legal-drafting'
  | 'fact-verification'
  | 'marathi-transliteration'
  | 'legal-simplifier'
  | 'markdown-editor'
  | 'home';

const featureDetails = {
  'legal-drafting': {
    icon: FileText,
    title: 'AI Legal Drafting',
    description: 'Generate legal documents by providing party details and clauses.',
    component: <LegalDrafting />,
  },
  'fact-verification': {
    icon: Newspaper,
    title: 'Legal News & Truth Filter',
    description: 'Verify legal headlines or browse real and AI-generated news.',
    component: <FactVerification />,
  },
  'marathi-transliteration': {
    icon: Languages,
    title: 'Marathi Transliteration',
    description: 'Type in English to get real-time Marathi transliteration.',
    component: <MarathiTransliteration />,
  },
  'legal-simplifier': {
    icon: BookText,
    title: 'Legal Lingo Simplifier',
    description: 'Translate complex legal jargon into simple, plain language.',
    component: <LegalSimplifier />,
  },
  'markdown-editor': {
    icon: ArrowDownToLine,
    title: 'Markdown Editor & Summarizer',
    description: 'Write in Markdown with a live preview and generate AI summaries.',
    component: <MarkdownEditor />,
  },
};

export default function LegalHomePage() {
  const [activeFeature, setActiveFeature] = useState<Feature>('home');

  const handleFeatureClick = (feature: Feature) => {
    setActiveFeature(feature);
  };

  const handleBack = () => {
    setActiveFeature('home');
  };

  if (activeFeature !== 'home') {
    const feature = featureDetails[activeFeature as keyof typeof featureDetails];
    return (
      <div className="container mx-auto px-4 py-8 md:py-12">
        <button onClick={handleBack} className="mb-4 text-sm font-medium text-primary hover:underline">
          &larr; Back to Features
        </button>
        {feature.component}
      </div>
    );
  }

  return (
    <div className="bg-background text-foreground min-h-screen">
      <main className="container mx-auto px-4 py-12 sm:py-16 md:py-24">
        <div className="text-center max-w-3xl mx-auto">
          <Badge
            variant="outline"
            className="mb-4 border-blue-500/50 text-blue-600"
          >
            <Gavel className="w-3 h-3 mr-2" />
            Our Features
          </Badge>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
            AI-Powered Legal Tools
          </h1>
          <p className="mt-4 text-lg md:text-xl text-muted-foreground">
            Streamline your legal work with our powerful AI features, from
            document drafting to fact verification and language tools.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {Object.entries(featureDetails).map(([key, feature]) => (
            <Card
              key={key}
              className="group cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
              onClick={() => handleFeatureClick(key as Feature)}
            >
              <CardHeader className="flex flex-col items-start gap-4">
                <div className="p-3 rounded-lg bg-secondary">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
              </CardHeader>
              <CardContent>
                <h3 className="text-lg font-semibold">{feature.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
