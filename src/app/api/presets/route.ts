import { NextResponse } from 'next/server'
import { TransformationPreset } from '@/types'

export const dynamic = 'force-dynamic'

const TRANSFORMATION_PRESETS: TransformationPreset[] = [
  {
    id: 'professional',
    name: 'Make Professional',
    description: 'Transform casual text into professional communication',
    instruction_template: 'Rewrite this text in a professional, formal tone suitable for business communication',
    category: 'tone',
    icon: '💼'
  },
  {
    id: 'casual',
    name: 'Make Casual',
    description: 'Convert formal text to casual, friendly language',
    instruction_template: 'Rewrite this text in a casual, friendly tone',
    category: 'tone',
    icon: '😊'
  },
  {
    id: 'bullet-points',
    name: 'Bullet Points',
    description: 'Convert text into clear, structured bullet points',
    instruction_template: 'Convert this text into clear, well-organized bullet points',
    category: 'format',
    icon: '📝'
  },
  {
    id: 'summary',
    name: 'Summarize',
    description: 'Create a concise summary of the main points',
    instruction_template: 'Create a concise summary of the main points in this text',
    category: 'length',
    icon: '📄'
  },
  {
    id: 'expand',
    name: 'Expand',
    description: 'Add more detail and explanation to the text',
    instruction_template: 'Expand this text with more detail and explanation while maintaining the core message',
    category: 'length',
    icon: '📈'
  },
  {
    id: 'simplify',
    name: 'Simplify',
    description: 'Make complex text easier to understand',
    instruction_template: 'Simplify this text to make it easier to understand for a general audience',
    category: 'complexity',
    icon: '🎯'
  },
  {
    id: 'academic',
    name: 'Academic Style',
    description: 'Convert to academic writing style',
    instruction_template: 'Rewrite this text in an academic style with proper citations and formal language',
    category: 'tone',
    icon: '🎓'
  },
  {
    id: 'creative',
    name: 'Creative Writing',
    description: 'Transform into creative, engaging prose',
    instruction_template: 'Rewrite this text in a creative, engaging style with vivid descriptions',
    category: 'tone',
    icon: '✨'
  },
  {
    id: 'email',
    name: 'Email Format',
    description: 'Structure as a professional email',
    instruction_template: 'Format this text as a professional email with proper greeting and closing',
    category: 'format',
    icon: '📧'
  },
  {
    id: 'social-media',
    name: 'Social Media',
    description: 'Optimize for social media platforms',
    instruction_template: 'Rewrite this text to be engaging and suitable for social media platforms',
    category: 'format',
    icon: '📱'
  },
  {
    id: 'technical',
    name: 'Technical Documentation',
    description: 'Convert to technical documentation style',
    instruction_template: 'Rewrite this text as clear, precise technical documentation',
    category: 'tone',
    icon: '⚙️'
  },
  {
    id: 'persuasive',
    name: 'Persuasive',
    description: 'Make the text more convincing and persuasive',
    instruction_template: 'Rewrite this text to be more persuasive and compelling',
    category: 'tone',
    icon: '🎯'
  }
]

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      presets: TRANSFORMATION_PRESETS,
      total: TRANSFORMATION_PRESETS.length,
      categories: [...new Set(TRANSFORMATION_PRESETS.map(p => p.category))]
    })
  } catch (error) {
    console.error('Presets API error:', error)
    
    return NextResponse.json(
      { error: 'Failed to fetch presets' },
      { status: 500 }
    )
  }
}

// Handle CORS for development
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}

