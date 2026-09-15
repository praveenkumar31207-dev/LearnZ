import { NextResponse } from 'next/server';
import { callAIModel } from '@/lib/aiClient';

export async function POST(req: Request) {
  try {
    const { topicTitle, subjectName, difficulty } = await req.json();

    const prompt = `Suggest 4 high-quality curated learning resources for a student studying "${topicTitle || 'General Topic'}" in "${subjectName || 'Course'}".
Categorize by type: video, documentation, article, practice. Include why this resource is uniquely helpful and realistic estimated minutes.

Return ONLY a valid JSON array matching this format:
[
  {
    "title": "Resource Name",
    "resourceType": "video",
    "url": "https://example.com",
    "difficultyLevel": "Medium",
    "estimatedMins": 30,
    "recommendedReason": "Why this is great...",
    "qualityScore": 4.9,
    "sourcePlatform": "Platform Name"
  }
]`;

    const result = await callAIModel({
      prompt,
      systemInstruction: 'You are an expert educational curator. You return strictly a valid JSON array of recommended learning resources.',
      responseFormat: 'json',
    });

    if (result?.text) {
      try {
        let parsed = JSON.parse(result.text);
        if (!Array.isArray(parsed) && parsed.resources) {
          parsed = parsed.resources;
        }
        if (Array.isArray(parsed) && parsed.length > 0) {
          return NextResponse.json({ resources: parsed, source: `ai_${result.provider}` });
        }
      } catch (err) {
        console.warn('Failed to parse AI recommended resources JSON:', err);
      }
    }

    const fallbackResources = [
      {
        id: `res-${Date.now()}-1`,
        title: `Comprehensive Visual Guide to ${topicTitle}`,
        resourceType: 'video',
        url: 'https://youtube.com',
        difficultyLevel: difficulty || 'Medium',
        estimatedMins: 35,
        recommendedReason: `High-definition visual animations illustrating internal mechanics and core syntax step-by-step.`,
        qualityScore: 4.9,
        sourcePlatform: 'YouTube Learning',
      },
      {
        id: `res-${Date.now()}-2`,
        title: `Official Documentation & Specification: ${topicTitle}`,
        resourceType: 'documentation',
        url: 'https://docs.oracle.com',
        difficultyLevel: 'Hard',
        estimatedMins: 25,
        recommendedReason: `Authoritative reference covering exact language specifications and edge cases required for exams.`,
        qualityScore: 4.8,
        sourcePlatform: 'Official Docs',
      },
      {
        id: `res-${Date.now()}-3`,
        title: `Interactive Code Sandbox & Problem Sets: ${topicTitle}`,
        resourceType: 'practice',
        url: 'https://leetcode.com',
        difficultyLevel: 'Medium',
        estimatedMins: 40,
        recommendedReason: `Hands-on problem sets to test active recall and coding muscle memory before test day.`,
        qualityScore: 4.9,
        sourcePlatform: 'Interactive Sandbox',
      },
      {
        id: `res-${Date.now()}-4`,
        title: `Cheat Sheet & Key Formulas for ${topicTitle}`,
        resourceType: 'article',
        url: 'https://geeksforgeeks.org',
        difficultyLevel: 'Easy',
        estimatedMins: 15,
        recommendedReason: `Compact 2-page summary ideal for quick 10-minute revision before taking a quiz.`,
        qualityScore: 4.7,
        sourcePlatform: 'Academic Notes',
      },
    ];

    return NextResponse.json({ resources: fallbackResources, source: 'curated_fallback' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
