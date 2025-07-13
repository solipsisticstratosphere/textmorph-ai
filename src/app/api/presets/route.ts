import { NextResponse } from "next/server";
import { TransformationPreset } from "@/types";

export const dynamic = "force-dynamic";

interface EnhancedTransformationPreset extends TransformationPreset {
  recommended_temperature?: number;
}

const TRANSFORMATION_PRESETS: EnhancedTransformationPreset[] = [
  {
    id: "professional",
    name: "Make Professional",
    description: "Transform casual text into professional communication",
    instruction_template:
      "Rewrite this text in a professional, formal tone suitable for business communication",
    category: "tone",
    icon: "💼",
    recommended_temperature: 0.6,
  },
  {
    id: "casual",
    name: "Make Casual",
    description: "Convert formal text to casual, friendly language",
    instruction_template: "Rewrite this text in a casual, friendly tone",
    category: "tone",
    icon: "😊",
    recommended_temperature: 0.7,
  },
  {
    id: "bullet-points",
    name: "Bullet Points",
    description: "Convert text into clear, structured bullet points",
    instruction_template:
      "Convert this text into clear, well-organized bullet points",
    category: "format",
    icon: "📝",
    recommended_temperature: 0.4,
  },
  {
    id: "summary",
    name: "Summarize",
    description: "Create a concise summary of the main points",
    instruction_template:
      "Create a concise summary of the main points in this text",
    category: "length",
    icon: "📄",
    recommended_temperature: 0.5,
  },
  {
    id: "expand",
    name: "Expand",
    description: "Add more detail and explanation to the text",
    instruction_template:
      "Expand this text with more detail and explanation while maintaining the core message",
    category: "length",
    icon: "📈",
    recommended_temperature: 0.8,
  },
  {
    id: "simplify",
    name: "Simplify",
    description: "Make complex text easier to understand",
    instruction_template:
      "Simplify this text to make it easier to understand for a general audience",
    category: "length",
    icon: "🎯",
    recommended_temperature: 0.5,
  },
  {
    id: "academic",
    name: "Academic Style",
    description: "Convert to academic writing style",
    instruction_template:
      "Rewrite this text in an academic style with proper citations and formal language",
    category: "tone",
    icon: "🎓",
    recommended_temperature: 0.4,
  },
  {
    id: "creative",
    name: "Creative Writing",
    description: "Transform into creative, engaging prose",
    instruction_template:
      "Rewrite this text in a creative, engaging style with vivid descriptions",
    category: "tone",
    icon: "✨",
    recommended_temperature: 0.9,
  },
  {
    id: "email",
    name: "Email Format",
    description: "Structure as a professional email",
    instruction_template:
      "Format this text as a professional email with proper greeting and closing",
    category: "format",
    icon: "📧",
    recommended_temperature: 0.6,
  },
  {
    id: "social-media",
    name: "Social Media",
    description: "Optimize for social media platforms",
    instruction_template:
      "Rewrite this text to be engaging and suitable for social media platforms",
    category: "format",
    icon: "📱",
    recommended_temperature: 0.8,
  },
  {
    id: "technical",
    name: "Technical Documentation",
    description: "Convert to technical documentation style",
    instruction_template:
      "Rewrite this text as clear, precise technical documentation",
    category: "tone",
    icon: "⚙️",
    recommended_temperature: 0.3,
  },
  {
    id: "persuasive",
    name: "Persuasive",
    description: "Make the text more convincing and persuasive",
    instruction_template:
      "Rewrite this text to be more persuasive and compelling",
    category: "tone",
    icon: "🎯",
    recommended_temperature: 0.7,
  },
];

export async function GET() {
  try {
    const responseHeaders = new Headers();
    responseHeaders.set("Content-Type", "application/json");
    responseHeaders.set("X-Content-Type-Options", "nosniff");
    responseHeaders.set("X-Frame-Options", "DENY");
    responseHeaders.set("X-XSS-Protection", "1; mode=block");
    responseHeaders.set("Content-Security-Policy", "default-src 'self'");

    return NextResponse.json(
      {
        success: true,
        presets: TRANSFORMATION_PRESETS,
        total: TRANSFORMATION_PRESETS.length,
        categories: [...new Set(TRANSFORMATION_PRESETS.map((p) => p.category))],
      },
      {
        headers: responseHeaders,
      }
    );
  } catch (error) {
    console.error("Presets API error:", error);

    return NextResponse.json(
      { error: "Failed to fetch presets" },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "X-Content-Type-Options": "nosniff",
      "X-Frame-Options": "DENY",
      "X-XSS-Protection": "1; mode=block",
    },
  });
}
