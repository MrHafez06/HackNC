'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

interface DietaryRestriction {
  label: string;
  value: string;
}

interface Recipe {
  id: string;
  title: string;
  ingredients: string[];
  instructions: string[];
  servings: number;
  imageUrl?: string;
  sourceUrl?: string;
}

interface StorePrice {
  storeName: string;
  totalPrice: number;
  items: {
    ingredient: string;
    price: number;
  }[];
}

export default function Home() {
  const [numPeople, setNumPeople] = useState<number>(1);
  const [selectedRestrictions, setSelectedRestrictions] = useState<string[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [storePrices, setStorePrices] = useState<StorePrice[]>([]);

  const dietaryRestrictions: DietaryRestriction[] = [
    { label: 'Vegetarian', value: 'vegetarian' },
    { label: 'Vegan', value: 'vegan' },
    { label: 'Gluten-Free', value: 'gluten-free' },
    { label: 'Dairy-Free', value: 'dairy-free' },
    { label: 'Nut-Free', value: 'nut-free' },
    { label: 'Kosher', value: 'kosher' },
    { label: 'Halal', value: 'halal' },
  ];

  const handleRestrictionToggle = (value: string) => {
    setSelectedRestrictions(prev => 
      prev.includes(value) 
        ? prev.filter(r => r !== value)
        : [...prev, value]
    );
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/recipes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          numPeople,
          restrictions: selectedRestrictions,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch recipes');
      }

      const data = await response.json();
      setRecipes(data.recipes);
    } catch (error) {
      console.error('Error fetching recipes:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStorePrices = async (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    // TODO: Implement Rapid API grocery store price comparison
    // Mock data for now
    const mockPrices: StorePrice[] = [
      {
        storeName: "Walmart",
        totalPrice: 25.99,
        items: [
          { ingredient: "pasta", price: 2.99 },
          { ingredient: "tomatoes", price: 3.99 },
        ]
      },
      {
        storeName: "Target",
        totalPrice: 28.99,
        items: [
          { ingredient: "pasta", price: 3.99 },
          { ingredient: "tomatoes", price: 4.99 },
        ]
      }
    ];
    setStorePrices(mockPrices);
  };

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl font-bold text-gray-900 text-center mb-4">
            Recipe Cost Calculator
          </h1>
          <p className="text-lg text-gray-600 text-center max-w-2xl mx-auto">
            Find recipes that match your dietary preferences and compare ingredient prices across stores to make budget-friendly meals.
          </p>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Input Section */}
        <div className="card p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number of People
              </label>
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setNumPeople(prev => Math.max(1, prev - 1))}
                  className="btn-secondary px-3 py-1"
                >
                  -
                </button>
                <input
                  type="number"
                  min="1"
                  value={numPeople}
                  onChange={(e) => setNumPeople(parseInt(e.target.value))}
                  className="input-field w-20 text-center"
                />
                <button 
                  onClick={() => setNumPeople(prev => prev + 1)}
                  className="btn-secondary px-3 py-1"
                >
                  +
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dietary Restrictions
              </label>
              <div className="flex flex-wrap gap-2">
                {dietaryRestrictions.map((restriction) => (
                  <button
                    key={restriction.value}
                    onClick={() => handleRestrictionToggle(restriction.value)}
                    className={`btn-secondary ${
                      selectedRestrictions.includes(restriction.value)
                        ? 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                        : ''
                    }`}
                  >
                    {restriction.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-center">
            <button
              onClick={handleSearch}
              className="btn-primary"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Searching...
                </span>
              ) : (
                'Find Recipes'
              )}
            </button>
          </div>
        </div>

        {/* Results Section */}
        {recipes.length > 0 && (
          <div className="grid md:grid-cols-2 gap-8">
            {/* Recipe List */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Recipes</h2>
              <div className="space-y-4">
                {recipes.map((recipe) => (
                  <motion.div
                    key={recipe.id}
                    className={`card p-4 cursor-pointer ${
                      selectedRecipe?.id === recipe.id ? 'ring-2 ring-blue-500' : ''
                    }`}
                    whileHover={{ scale: 1.01 }}
                    onClick={() => getStorePrices(recipe)}
                  >
                    {recipe.imageUrl && (
                      <div className="aspect-video rounded-lg overflow-hidden mb-4">
                        <img 
                          src={recipe.imageUrl} 
                          alt={recipe.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{recipe.title}</h3>
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <p>Serves: {recipe.servings}</p>
                      {recipe.sourceUrl && (
                        <a 
                          href={recipe.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                          onClick={(e) => e.stopPropagation()}
                        >
                          View Recipe
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Price Comparison */}
            {selectedRecipe && storePrices.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Price Comparison</h2>
                <div className="space-y-4">
                  {storePrices.map((store, index) => (
                    <motion.div
                      key={store.storeName}
                      className="card p-4"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">{store.storeName}</h3>
                        <p className="text-2xl font-bold text-green-600">
                          ${store.totalPrice.toFixed(2)}
                        </p>
                      </div>
                      <div className="space-y-2">
                        {store.items.map((item) => (
                          <div key={item.ingredient} className="flex justify-between text-sm text-gray-600">
                            <span>{item.ingredient}</span>
                            <span>${item.price.toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
