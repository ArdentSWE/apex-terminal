import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

// Initialize the Anthropic client using your secret key
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    // The System Prompt: This is where we brainwash Claude into becoming Ace AI
    const systemPrompt = `You are Ace AI, an elite quantitative trading and sports betting assistant built exclusively for Ace's House. 
    You are sharp, highly analytical, and speak like a Wall Street quant. You do not mention Anthropic or Claude. 
    Your primary goal is to help users analyze options flow, GEX, and sports arbitrage models.`;

    // Call Claude 3 Opus
    const msg = await anthropic.messages.create({
      model: "claude-3-opus-20240229",
      max_tokens: 1000,
      system: systemPrompt,
      messages: messages,
    });

    // Extract the text response safely to satisfy TypeScript strict mode
    const responseBlock = msg.content[0];
    const replyText = responseBlock.type === 'text' ? responseBlock.text : "Neural link returned non-text data.";
    
    return NextResponse.json({ reply: replyText });
    
  } catch (error) {
    console.error("Ace AI Error:", error);
    return NextResponse.json({ error: "Neural link disrupted." }, { status: 500 });
  }
}