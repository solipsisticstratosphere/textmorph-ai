import { NextRequest, NextResponse } from 'next/server'
import { AIService } from '@/lib/ai-service'
import { TransformationRequest } from '@/types'

export const dynamic = 'force-dynamic'

// Rate limiting storage (in production, use Redis or database)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

function getRateLimitKey(request: NextRequest): string {
  // In production, use user ID or more sophisticated identification
  const forwarded = request.headers.get('x-forwarded-for')
  const ip = forwarded ? forwarded.split(',')[0] : request.headers.get('x-real-ip')
  return ip || 'anonymous'
}

function checkRateLimit(key: string): { allowed: boolean; resetTime?: number } {
  const now = Date.now()
  const windowMs = 60 * 1000 // 1 minute
  const maxRequests = 10 // 10 requests per minute

  const current = rateLimitMap.get(key)
  
  if (!current || now > current.resetTime) {
    rateLimitMap.set(key, { count: 1, resetTime: now + windowMs })
    return { allowed: true }
  }

  if (current.count >= maxRequests) {
    return { allowed: false, resetTime: current.resetTime }
  }

  current.count++
  return { allowed: true }
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const rateLimitKey = getRateLimitKey(request)
    const rateLimit = checkRateLimit(rateLimitKey)
    
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { 
          error: 'Rate limit exceeded. Please try again later.',
          resetTime: rateLimit.resetTime 
        },
        { status: 429 }
      )
    }

    // Parse request body
    const body: TransformationRequest = await request.json()

    // Validate input
    if (!body.input_text || !body.transformation_instruction) {
      return NextResponse.json(
        { error: 'Missing required fields: input_text and transformation_instruction' },
        { status: 400 }
      )
    }

    if (body.input_text.length > 10000) {
      return NextResponse.json(
        { error: 'Input text too long. Maximum 10,000 characters allowed.' },
        { status: 400 }
      )
    }

    if (body.transformation_instruction.length > 500) {
      return NextResponse.json(
        { error: 'Transformation instruction too long. Maximum 500 characters allowed.' },
        { status: 400 }
      )
    }

    // Sanitize input
    const sanitizedRequest: TransformationRequest = {
      input_text: body.input_text.trim(),
      transformation_instruction: body.transformation_instruction.trim(),
      model_preference: body.model_preference || 'default',
      max_tokens: Math.min(body.max_tokens || 1000, 2000),
      temperature: Math.max(0, Math.min(body.temperature || 0.7, 1))
    }

    // Process transformation
    const aiService = AIService.getInstance()
    const result = await aiService.transformText(sanitizedRequest)

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Transformation failed' },
        { status: 500 }
      )
    }

    // Return successful response
    return NextResponse.json(result)

  } catch (error) {
    console.error('Transform API error:', error)
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json(
    { 
      message: 'TextMorph AI Transform API',
      version: '1.0.0',
      endpoints: {
        POST: '/api/transform - Transform text with AI'
      }
    }
  )
}

// Handle CORS for development
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}

