"use server";

import { z } from "zod";
import { generateRentAgreement } from "@/ai/flows/generate-rent-agreement";
import { verifyLegalNewsFact } from "@/ai/flows/verify-legal-news-fact";
import { getLegalNews } from "@/ai/flows/get-legal-news";
import { simplifyLegalText } from "@/ai/flows/simplify-legal-text";
import { chat } from "@/ai/flows/chatbot";
import { summarizeMarkdown } from "@/ai/flows/summarize-markdown";

// State for Legal Drafting
export type LegalDraftingState = {
  type: "success" | "error";
  rentAgreement?: string;
  message?: string;
};

const legalDraftingSchema = z.object({
  template: z.string().min(1, "Template cannot be empty."),
  partyDetails: z.string().min(1, "Party details cannot be empty."),
  clauses: z.string().min(1, "Clauses cannot be empty."),
});

export async function handleGenerateAgreement(
  prevState: LegalDraftingState | undefined,
  formData: FormData
): Promise<LegalDraftingState | undefined> {
  try {
    const validatedFields = legalDraftingSchema.safeParse({
        template: formData.get("template"),
        partyDetails: formData.get("partyDetails"),
        clauses: formData.get("clauses"),
    });

    if (!validatedFields.success) {
        return {
            type: "error",
            message: "All text fields are required.",
        };
    }

    const { template, partyDetails, clauses } = validatedFields.data;

    const result = await generateRentAgreement({ template, partyDetails, clauses });

    if (result.rentAgreement) {
      return { type: "success", rentAgreement: result.rentAgreement };
    } else {
      return { type: "error", message: "Failed to generate agreement." };
    }
  } catch (e: any) {
    return {
      type: "error",
      message: e.message || "An unexpected error occurred.",
    };
  }
}

// State for Fact Verification
export type FactVerificationState = {
    type: "success" | "error";
    isVerified?: boolean;
    explanation?: string;
    relevantSections?: string[];
    message?: string;
}

const factVerificationSchema = z.object({
    newsHeadline: z.string().min(10, 'News headline must be at least 10 characters long.'),
});

export async function handleVerifyFact(
    prevState: FactVerificationState | undefined,
    formData: FormData
): Promise<FactVerificationState | undefined> {
    const newsHeadline = formData.get("newsHeadline") as string;
    const validatedFields = factVerificationSchema.safeParse({ newsHeadline });

    if (!validatedFields.success) {
        return {
            type: 'error',
            message: validatedFields.error.flatten().fieldErrors.newsHeadline?.[0] || 'Invalid input.',
        };
    }

    try {
        const result = await verifyLegalNewsFact({ newsHeadline });
        return {
            type: 'success',
            ...result,
        };
    } catch (e: any) {
        return {
            type: 'error',
            message: e.message || 'An unexpected error occurred during verification.',
        };
    }
}

// Action for fetching news
export async function handleGetNews() {
    try {
        const news = await getLegalNews();
        return {
            type: 'success',
            ...news,
        };
    } catch (e: any) {
        return {
            type: 'error',
            message: e.message || 'Failed to fetch news.',
        };
    }
}

// State for Legal Text Simplification
export type LegalSimplifierState = {
  type: "success" | "error";
  simplifiedText?: string;
  message?: string;
};

const legalSimplifierSchema = z.object({
  legalText: z.string().min(1, "Legal text cannot be empty."),
});

export async function handleSimplifyText(
  prevState: LegalSimplifierState | undefined,
  formData: FormData
): Promise<LegalSimplifierState | undefined> {
  try {
    const validatedFields = legalSimplifierSchema.safeParse({
        legalText: formData.get("legalText"),
    });

    if (!validatedFields.success) {
        return {
            type: "error",
            message: "The document text cannot be empty.",
        };
    }

    const { legalText } = validatedFields.data;

    const result = await simplifyLegalText({ legalText });

    if (result.simplifiedText) {
      return { type: "success", simplifiedText: result.simplifiedText };
    } else {
      return { type: "error", message: "Failed to simplify the text." };
    }
  } catch (e: any) {
    return {
      type: "error",
      message: e.message || "An unexpected error occurred.",
    };
  }
}

// Action for the general chatbot
export async function handleChat(message: string) {
  if (!message.trim()) {
    return { type: 'error', message: 'Message cannot be empty.' };
  }
  try {
    const result = await chat({ message });
    return { type: 'success', reply: result.reply };
  } catch (e: any) {
    return {
      type: 'error',
      message: e.message || 'An unexpected error occurred.',
    };
  }
}

// State for Markdown Summarizer
export type MarkdownSummarizerState = {
  type: "success" | "error";
  summary?: string;
  message?: string;
};

const markdownSummarizerSchema = z.object({
  markdownText: z.string().min(1, "Markdown text cannot be empty."),
});

export async function handleSummarizeMarkdown(
  prevState: MarkdownSummarizerState | undefined,
  formData: FormData
): Promise<MarkdownSummarizerState | undefined> {
  try {
    const validatedFields = markdownSummarizerSchema.safeParse({
        markdownText: formData.get("markdownText"),
    });

    if (!validatedFields.success) {
        return {
            type: "error",
            message: "The markdown text cannot be empty.",
        };
    }

    const { markdownText } = validatedFields.data;

    const result = await summarizeMarkdown({ markdownText });

    if (result.summary) {
      return { type: "success", summary: result.summary };
    } else {
      return { type: "error", message: "Failed to summarize the text." };
    }
  } catch (e: any) {
    return {
      type: "error",
      message: e.message || "An unexpected error occurred.",
    };
  }
}
