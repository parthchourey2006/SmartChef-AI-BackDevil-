export async function fetchRecipes(ingredients: string[]) {
  const query = ingredients.join(",")

  const res = await fetch(
    `https://cosylab.iiitd.edu.in/recipe2-api/recipebyingredient/by-ingredients-categories-title?includeIngredients=${query}&page=1&limit=10`,
    {
      headers: {
        "X-Api-Key": process.env.NEXT_PUBLIC_RECIPE_KEY!,
      },
    }
  )

  const data = await res.json()
  return data.payload?.data || []
}