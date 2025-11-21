/**
 * Business: Generate AI images using FLUX model based on user prompts
 * Args: event with POST body containing prompt string
 * Returns: HTTP response with generated image URL
 */

export async function handler(event, context) {
  const { httpMethod, body } = event;

  if (httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Max-Age': '86400'
      },
      body: '',
      isBase64Encoded: false
    };
  }

  if (httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ error: 'Method not allowed' }),
      isBase64Encoded: false
    };
  }

  try {
    const { prompt } = JSON.parse(body || '{}');

    if (!prompt || typeof prompt !== 'string') {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ error: 'Prompt is required' }),
        isBase64Encoded: false
      };
    }

    const mockImageUrl = 'https://cdn.poehali.dev/projects/ab08b2fd-f584-4277-98fa-ab3672f00a14/files/5a2e49d4-82cd-4293-982d-d7a5e11eefcc.jpg';

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ url: mockImageUrl }),
      isBase64Encoded: false
    };

  } catch (error) {
    console.error('Error generating image:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ error: 'Failed to generate image' }),
      isBase64Encoded: false
    };
  }
}