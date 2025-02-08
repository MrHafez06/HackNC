# Recipe Cost Calculator - Development Notes

## Application Overview
This application helps users find recipes based on their dietary preferences and compares ingredient prices across different stores. The unique value proposition is combining recipe search with price comparison to help users make cost-effective meal decisions.

## Core Features
1. Recipe Search
   - Input: Number of people, dietary restrictions
   - Uses Tavily API for comprehensive recipe search
   - Extracts structured recipe data using regex patterns
   - Returns: Recipe title, ingredients, instructions, servings, images

2. Price Comparison
   - Takes recipe ingredients as input
   - TODO: Integrate with grocery store price comparison API
   - Currently using mock data for store prices

## Current Progress

### Completed
- ✅ Basic UI implementation with Next.js and Tailwind
- ✅ Dietary restrictions selection
- ✅ Recipe search using Tavily API
- ✅ Recipe parsing from search results
- ✅ Recipe display with images and source links

### In Progress
- 🟡 Price comparison API integration
- 🟡 Recipe parsing improvements
- 🟡 Error handling and edge cases

### TODO
- Store selection for price comparison
- Save favorite recipes
- Meal planning features
- User authentication
- Shopping list generation

## API Integration Notes

### Tavily API
- Currently used for recipe search
- Search query format: "{restrictions} recipe for {numPeople} people"
- Parsing patterns:
  ```typescript
  // Servings
  /serves?\s+(\d+)/i
  /servings?:?\s*(\d+)/i

  // Ingredients
  /ingredients:?([\s\S]*?)(?:instructions|directions|method|steps|preparation)/i

  // Instructions
  /(?:instructions|directions|method|steps|preparation):?([\s\S]*?)(?:notes|nutrition|$)/i
  ```

### Price Comparison API
Options to consider:
1. Rapid API Grocery Store APIs
2. Walmart API
3. Target API
4. Kroger API

## Testing Notes
- Test different dietary restrictions combinations
- Verify recipe parsing accuracy
- Check price comparison logic
- Test responsive design
- Verify error handling

## Next Steps
1. Implement real price comparison API
2. Improve recipe parsing accuracy
3. Add loading states and error messages
4. Implement recipe filtering and sorting
5. Add user preferences storage
