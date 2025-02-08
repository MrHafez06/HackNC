import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { numPeople, restrictions } = await req.json();

    // Mock data for testing without Tavily API
    const mockRecipes = [
      {
        id: '1',
        title: 'Vegetarian Pasta Primavera',
        ingredients: [
          '1 pound pasta',
          '2 cups mixed vegetables (broccoli, carrots, bell peppers)',
          '3 cloves garlic',
          '1/4 cup olive oil',
          'Salt and pepper to taste',
          '1/2 cup grated Parmesan cheese'
        ],
        instructions: [
          'Cook pasta according to package instructions',
          'Sauté vegetables and garlic in olive oil',
          'Combine pasta with vegetables',
          'Season with salt and pepper',
          'Top with Parmesan cheese'
        ],
        servings: 4,
        imageUrl: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9',
        sourceUrl: 'https://example.com/pasta-primavera'
      },
      {
        id: '2',
        title: 'Quinoa Buddha Bowl',
        ingredients: [
          '1 cup quinoa',
          '1 can chickpeas',
          '2 sweet potatoes',
          '2 cups kale',
          '1/4 cup tahini',
          'Lemon juice',
          'Olive oil'
        ],
        instructions: [
          'Cook quinoa according to package instructions',
          'Roast sweet potatoes and chickpeas',
          'Massage kale with olive oil',
          'Combine all ingredients in bowls',
          'Drizzle with tahini-lemon sauce'
        ],
        servings: 4,
        imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd',
        sourceUrl: 'https://example.com/buddha-bowl'
      }
    ];

    // Filter recipes based on restrictions
    const filteredRecipes = restrictions.length > 0
      ? mockRecipes.filter(recipe => {
          return restrictions.every(restriction => {
            switch (restriction) {
              case 'vegetarian':
                return !recipe.ingredients.some(i => 
                  i.toLowerCase().includes('meat') || 
                  i.toLowerCase().includes('chicken') || 
                  i.toLowerCase().includes('fish')
                );
              case 'vegan':
                return !recipe.ingredients.some(i => 
                  i.toLowerCase().includes('meat') || 
                  i.toLowerCase().includes('cheese') || 
                  i.toLowerCase().includes('egg') ||
                  i.toLowerCase().includes('milk')
                );
              // Add more dietary restriction filters as needed
              default:
                return true;
            }
          });
        })
      : mockRecipes;

    // Adjust servings if needed
    const adjustedRecipes = filteredRecipes.map(recipe => {
      if (recipe.servings === numPeople) return recipe;
      
      const multiplier = numPeople / recipe.servings;
      return {
        ...recipe,
        servings: numPeople,
        ingredients: recipe.ingredients.map(ingredient => {
          // Try to adjust quantities in ingredients
          const match = ingredient.match(/^([\d./]+)\s+(.+)$/);
          if (match) {
            const [_, amount, rest] = match;
            const newAmount = (parseFloat(amount) * multiplier).toFixed(2);
            return `${newAmount} ${rest}`;
          }
          return ingredient;
        })
      };
    });

    return NextResponse.json({ 
      recipes: adjustedRecipes,
      debug: { restrictions, numPeople }
    });
  } catch (error) {
    console.error('Recipe search error:', error);
    return NextResponse.json(
      { error: 'Failed to search recipes' },
      { status: 500 }
    );
  }
}
