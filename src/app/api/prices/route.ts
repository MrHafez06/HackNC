import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { ingredients, servings } = await req.json();

    // TODO: Implement Rapid API grocery store price comparison
    // For now, returning mock data
    const mockPrices = {
      stores: [
        {
          storeName: "Walmart",
          totalPrice: 25.99,
          items: [
            { ingredient: "pasta", price: 2.99 },
            { ingredient: "tomatoes", price: 3.99 },
            { ingredient: "basil", price: 2.49 },
            { ingredient: "olive oil", price: 8.99 },
            { ingredient: "garlic", price: 1.99 }
          ]
        },
        {
          storeName: "Target",
          totalPrice: 28.99,
          items: [
            { ingredient: "pasta", price: 3.49 },
            { ingredient: "tomatoes", price: 4.49 },
            { ingredient: "basil", price: 2.99 },
            { ingredient: "olive oil", price: 9.99 },
            { ingredient: "garlic", price: 2.49 }
          ]
        },
        {
          storeName: "Whole Foods",
          totalPrice: 35.99,
          items: [
            { ingredient: "pasta", price: 4.99 },
            { ingredient: "tomatoes", price: 5.99 },
            { ingredient: "basil", price: 3.49 },
            { ingredient: "olive oil", price: 12.99 },
            { ingredient: "garlic", price: 2.99 }
          ]
        }
      ]
    };

    return NextResponse.json(mockPrices);
  } catch (error) {
    console.error('Price comparison error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch prices' },
      { status: 500 }
    );
  }
}
