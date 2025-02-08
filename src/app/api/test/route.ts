import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    // Get the host from the request
    const host = req.headers.get('host') || 'localhost:3000';
    const protocol = host.includes('localhost') ? 'http' : 'https';

    // Test recipe search
    const recipeResponse = await fetch(`${protocol}://${host}/api/recipes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        numPeople: 4,
        restrictions: ['vegetarian'],
      }),
      cache: 'no-store',
    });

    if (!recipeResponse.ok) {
      throw new Error(`Failed to fetch recipes: ${await recipeResponse.text()}`);
    }

    const data = await recipeResponse.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Test error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Test failed' },
      { status: 500 }
    );
  }
}
