from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import os
from collections import Counter

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

# API Configuration
RECIPEDB_BASE = "http://cosylab.iiitd.edu.in:6969/recipe2-api"
FLAVORDB_BASE = "https://cosylab.iiitd.edu.in/flavordb"
RECIPEDB_KEY = os.getenv("RECIPEDB_API_KEY", "XGs6daxLcJWNyswD3NmRNwbA8S3O7mXa_OE5UIW-gp81G5OX")
FLAVORDB_KEY = os.getenv("FLAVORDB_API_KEY", "XGs6daxLcJWNyswD3NmRNwbA8S3O7mXa_OE5UIW-gp81G5OX")

def get_recipe_details(recipe_id):
    """
    Fetch detailed recipe information including ingredients
    """
    try:
        url = f"{RECIPEDB_BASE}/search-recipe/{recipe_id}"
        headers = {
            "Authorization": f"Bearer {RECIPEDB_KEY}",
            "Content-Type": "application/json"
        }
        
        response = requests.get(url, headers=headers, timeout=10)
        
        if response.status_code == 200:
            return response.json()
        else:
            print(f"RecipeDB Details Error: {response.status_code}")
            return None
            
    except Exception as e:
        print(f"Error fetching recipe details: {e}")
        return None

def get_recipe_instructions(recipe_id):
    """
    Fetch recipe instructions
    """
    try:
        url = f"{RECIPEDB_BASE}/instructions/{recipe_id}"
        headers = {
            "Authorization": f"Bearer {RECIPEDB_KEY}",
            "Content-Type": "application/json"
        }
        
        response = requests.get(url, headers=headers, timeout=10)
        
        if response.status_code == 200:
            return response.json()
        else:
            return None
            
    except Exception as e:
        return None

def get_recipes_by_ingredients(ingredients, limit=5):
    """
    Fetch recipes matching given ingredients using RecipeDB
    
    Note: RecipeDB doesn't have a direct ingredient-matching endpoint.
    We use the by-ingredients-categories-title endpoint with includeIngredients.
    """
    try:
        # Use the by-ingredients endpoint
        include_ingredients = ",".join(ingredients)
        
        url = f"{RECIPEDB_BASE}/recipebyingredient/by-ingredients-categories-title"
        params = {
            "includeIngredients": include_ingredients,
            "page": 1,
            "limit": limit
        }
        headers = {
            "Authorization": f"Bearer {RECIPEDB_KEY}",
            "Content-Type": "application/json"
        }
        
        response = requests.get(url, params=params, headers=headers, timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            # Fetch detailed info for each recipe
            if data.get('payload') and data['payload'].get('data'):
                recipes = data['payload']['data']
                for recipe in recipes:
                    recipe_id = recipe.get('Recipe_id')
                    if recipe_id:
                        # Get detailed ingredients
                        details = get_recipe_details(recipe_id)
                        if details:
                            recipe['details'] = details
            return data
        else:
            print(f"RecipeDB Error: {response.status_code} - {response.text}")
            return None
            
    except Exception as e:
        print(f"Error fetching recipes: {e}")
        return None

def extract_ingredients_from_steps(steps):
    """
    Extract potential ingredients from cooking instruction steps
    """
    import re
    
    if not steps:
        return []
    
    # Common cooking verbs to help identify ingredients
    cooking_verbs = ['add', 'mix', 'stir', 'cook', 'heat', 'boil', 'fry', 'bake', 
                     'grill', 'roast', 'place', 'combine', 'season', 'sprinkle', 
                     'drizzle', 'toss', 'slice', 'chop', 'dice', 'mince', 'pour',
                     'spread', 'blend', 'whisk', 'beat', 'arrange', 'press']
    
    ingredients = set()
    
    for step in steps:
        step_lower = step.lower()
        
        # Look for ingredient patterns like "1 cup flour", "2 tablespoons oil", etc.
        # Pattern: number + unit + ingredient
        pattern1 = r'\d+\s*(?:cups?|tablespoons?|teaspoons?|tbsp|tsp|ounces?|oz|pounds?|lbs?|grams?|g|ml|liters?)\s+([a-z\s]+?)(?:,|\.|and|to|into|in|on|with|until|\d|$)'
        matches1 = re.findall(pattern1, step_lower)
        for match in matches1:
            ingredient = match.strip()
            if len(ingredient) > 2 and len(ingredient.split()) <= 4:
                ingredients.add(ingredient)
        
        # Pattern: ingredient names after cooking verbs
        for verb in cooking_verbs:
            if verb in step_lower:
                # Get text after the verb
                parts = step_lower.split(verb, 1)
                if len(parts) > 1:
                    after_verb = parts[1].strip()
                    # Extract first few words as potential ingredient
                    words = after_verb.split()[:5]
                    potential = ' '.join(words)
                    
                    # Clean up
                    potential = re.sub(r'\d+', '', potential)  # Remove numbers
                    potential = re.sub(r'[,;.].*', '', potential)  # Remove everything after punctuation
                    potential = potential.strip()
                    
                    if len(potential) > 3 and len(potential.split()) <= 3:
                        ingredients.add(potential)
        
        # Common ingredient words that often appear
        common_ingredients = ['salt', 'pepper', 'oil', 'butter', 'water', 'flour', 'sugar',
                            'garlic', 'onion', 'tomato', 'cheese', 'milk', 'egg', 'rice',
                            'chicken', 'beef', 'pork', 'fish', 'lemon', 'lime', 'basil',
                            'oregano', 'thyme', 'parsley', 'cream', 'wine', 'vinegar',
                            'stock', 'broth', 'pasta', 'potato', 'carrot', 'celery']
        
        for ing in common_ingredients:
            if ing in step_lower:
                ingredients.add(ing)
    
    # Clean up and return as sorted list
    cleaned = []
    for ing in ingredients:
        ing = ing.strip()
        if ing and not ing.startswith('and') and not ing.startswith('or'):
            cleaned.append(ing.title())
    
    return sorted(cleaned)[:15]  # Limit to 15 ingredients

def calculate_match_score(recipe_ingredients, user_ingredients):
    """
    Calculate how well recipe matches user's available ingredients
    Returns percentage and missing ingredients
    """
    user_set = set(i.lower().strip() for i in user_ingredients)
    recipe_set = set(i.lower().strip() for i in recipe_ingredients if i)
    
    if not recipe_set:
        return 0, []
    
    matches = recipe_set.intersection(user_set)
    score = (len(matches) / len(recipe_set)) * 100
    missing = list(recipe_set - user_set)
    
    return round(score, 1), missing

def get_flavor_compounds(ingredient):
    """
    Get flavor compounds for an ingredient from FlavorDB
    """
    try:
        url = f"{FLAVORDB_BASE}/food/by-alias"
        params = {"alias": ingredient.lower()}
        headers = {
            "Authorization": f"Bearer {FLAVORDB_KEY}",
            "Content-Type": "application/json"
        }
        
        response = requests.get(url, params=params, headers=headers, timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            # Extract compound names from response
            if isinstance(data, dict) and 'molecules' in data:
                return [m.get('commonName', '') for m in data['molecules']]
            return []
        else:
            print(f"FlavorDB Error for {ingredient}: {response.status_code}")
            return []
            
    except Exception as e:
        print(f"Error fetching flavor compounds: {e}")
        return []

def suggest_substitutes(missing_ingredient, available_ingredients):
    """
    Suggest substitutes based on shared flavor compounds
    """
    try:
        # Get flavor profile of missing ingredient
        missing_compounds = set(get_flavor_compounds(missing_ingredient))
        
        if not missing_compounds:
            return []
        
        # Compare with available ingredients
        substitutes = []
        for ingredient in available_ingredients:
            available_compounds = set(get_flavor_compounds(ingredient))
            
            if available_compounds:
                # Calculate overlap
                overlap = missing_compounds.intersection(available_compounds)
                score = len(overlap) / len(missing_compounds) * 100
                
                if score > 20:  # At least 20% compound overlap
                    substitutes.append({
                        "ingredient": ingredient,
                        "score": round(score, 1),
                        "shared_compounds": len(overlap)
                    })
        
        # Sort by score
        substitutes.sort(key=lambda x: x['score'], reverse=True)
        return substitutes[:3]  # Top 3 substitutes
        
    except Exception as e:
        print(f"Error suggesting substitutes: {e}")
        return []

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy", "message": "FridgeFirst API is running"})

@app.route('/api/recipes', methods=['POST', 'OPTIONS'])
def get_recipes():
    """
    Main endpoint: Get recipes matching user's ingredients
    """
    if request.method == 'OPTIONS':
        return '', 200
        
    try:
        data = request.json
        user_ingredients = data.get('ingredients', [])
        
        if not user_ingredients:
            return jsonify({"error": "No ingredients provided"}), 400
        
        # Fetch recipes from RecipeDB
        recipes_data = get_recipes_by_ingredients(user_ingredients, limit=5)
        
        if not recipes_data or 'payload' not in recipes_data:
            return jsonify({"error": "Could not fetch recipes"}), 500
        
        recipes = recipes_data['payload'].get('data', [])
        
        # Process each recipe
        processed_recipes = []
        for recipe in recipes:
            recipe_title = recipe.get('Recipe_title', 'Unknown')
            recipe_id = recipe.get('Recipe_id', recipe.get('_id', ''))
            
            # Fetch detailed instructions
            instructions_data = get_recipe_instructions(recipe_id)
            instructions = []
            ingredients_list = []
            
            if instructions_data:
                # Instructions endpoint returns data directly, not in a payload wrapper
                # Extract instructions from 'steps' field
                if 'steps' in instructions_data and instructions_data['steps']:
                    instructions = instructions_data['steps']
                elif 'Instructions' in instructions_data and instructions_data['Instructions']:
                    instructions = instructions_data['Instructions']
                
                # Try to get ingredients if available
                if 'ingredients' in instructions_data and instructions_data['ingredients']:
                    ingredients_list = instructions_data['ingredients']
                elif 'Ingredients' in instructions_data and instructions_data['Ingredients']:
                    ingredients_list = instructions_data['Ingredients']
            
            # Fallback: use processes from recipe data if instructions not available
            if not instructions and 'Processes' in recipe and recipe['Processes']:
                processes = recipe['Processes'].split('||')
                instructions = [process.capitalize() for process in processes]
            
            # If we have instructions but no ingredients, extract them from the steps
            if instructions and not ingredients_list:
                ingredients_list = extract_ingredients_from_steps(instructions)
            
            # For ingredients, we can infer from the recipe if not available
            if not ingredients_list:
                # Mark that ingredients are not available
                ingredients_list = []
            
            # Calculate match score with actual ingredients
            if ingredients_list and len(ingredients_list) > 0:
                match_score, missing = calculate_match_score(ingredients_list, user_ingredients)
            else:
                # Fallback if no ingredients data - give it a generic match score
                match_score = 75.0
                missing = []
            
            processed_recipe = {
                "id": recipe_id,
                "title": recipe_title,
                "match_score": match_score,
                "calories": recipe.get('Calories', 'N/A'),
                "total_time": recipe.get('total_time', 'N/A'),
                "servings": recipe.get('servings', 'N/A'),
                "missing_ingredients": missing,
                "ingredients": ingredients_list,
                "instructions": instructions,
                "substitutions": []
            }
            
            # Get substitutions for missing ingredients (limit to 2 for performance)
            # DISABLED: RecipeDB isn't returning ingredient data, so skip FlavorDB calls
            # if ingredients_list and len(ingredients_list) > 0:
            #     for missing_ing in missing[:2]:
            #         subs = suggest_substitutes(missing_ing, user_ingredients)
            #         if subs:
            #             processed_recipe['substitutions'].append({
            #                 "for": missing_ing,
            #                 "options": subs
            #             })
            
            processed_recipes.append(processed_recipe)
        
        # Sort by match score
        processed_recipes.sort(key=lambda x: x['match_score'], reverse=True)
        
        # Calculate fridge utilization based on average match scores
        if processed_recipes:
            # Use the average match score of top recipes as utilization metric
            avg_match_score = sum(r['match_score'] for r in processed_recipes[:3]) / min(3, len(processed_recipes))
            utilization = avg_match_score
        else:
            utilization = 0
        
        return jsonify({
            "recipes": processed_recipes,
            "fridge_utilization": round(utilization, 1),
            "total_found": len(processed_recipes)
        })
        
    except Exception as e:
        print(f"Error in get_recipes: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    import os
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)
