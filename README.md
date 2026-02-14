SmartChef AI - Backend API

Reducing household food waste through intelligent recipe matching**

[Live Demo](#) • [Report Bug](https://github.com/parthchourey2006/SmartChef-AI-BackDevil-/issues) • [Request Feature](https://github.com/parthchourey2006/SmartChef-AI-BackDevil-/issues)

---

 Table of Contents

- [About](#about-the-project)
- [Problem Statement](#problem-statement)
- [Solution](#solution)
- [Tech Stack](#tech-stack)
- [API Endpoints](#api-endpoints)
- [Getting Started](#getting-started)
- [Installation](#installation)
- [Deployment](#deployment)
- [Usage](#usage-examples)
- [Algorithms](#key-algorithms)
- [Contributing](#contributing)

---
 About The Project

SmartChef AI reduces household food waste by suggesting recipes based on ingredients you already have. Instead of searching for recipes and checking ingredients, you tell us what you have, and we find what you can cook.
 Key Features

✅ Ingredient-first search  
✅ Smart match scoring  
✅ Step-by-step instructions  
✅ Automatic ingredient extraction  
✅ Fridge utilization metrics  
✅ RESTful API  

---
Problem Statement

40% of household food waste** occurs because people don't know what to cook with available ingredients.

Traditional recipe sites: Search recipe → Check ingredients → Missing item? → Give up → Food expires

This causes:
- Food waste
- Wasted money  
- Decision fatigue
- Environmental impact

---
 Solution

Ingredient-first approach:

1. User enters available ingredients
2. System finds matching recipes (118,000+ database)
3. Recipes ranked by match percentage
4. Clear cooking instructions provided
5. Utilization score shows efficiency

---
 Tech Stack

- Python 3.8+ - Core language
- Flask 3.0.0 - Web framework  
- Gunicorn** - Production server
- RecipeDB API - 118,000+ recipes
- FlavorDB API - Flavor compounds (disabled currently)

---

 API Endpoints

 Health Check
```http
GET /api/health
```

 Get Recipes
```http
POST /api/recipes
Content-Type: application/json

{
  "ingredients": ["tomato", "chicken", "rice"]
}
```

Response:
```json
{
  "recipes": [{
    "id": "100002",
    "title": "Heirloom Tomato Salad",
    "match_score": 75.0,
    "calories": "467.6",
    "total_time": "10",
    "servings": "4",
    "ingredients": ["tomato", "salt", "pepper"],
    "instructions": ["step 1", "step 2"],
    "missing_ingredients": ["arugula"]
  }],
  "fridge_utilization": 75.0,
  "total_found": 5
}
```

---

Getting Started
 Prerequisites
- Python 3.8+
- pip
- RecipeDB API key from [Foodoscope](https://www.foodoscope.com/)

 Installation

```bash
1. Clone repo
git clone https://github.com/parthchourey2006/SmartChef-AI-BackDevil-.git
cd SmartChef-AI-BackDevil-
 2. Create virtual environment
python -m venv .venv
.venv\Scripts\activate  # Windows
source .venv/bin/activate  # Mac/Linux

 3. Install dependencies
pip install -r requirements.txt

 4. Create .env file
echo "RECIPEDB_API_KEY=your_key_here" > .env
echo "FLAVORDB_API_KEY=your_key_here" >> .env

 5. Run
python app.py
```

Server runs on `http://localhost:5000`

---
 

## 📖 Usage Examples

Python
```python
import requests

response = requests.post('http://localhost:5000/api/recipes', 
    json={'ingredients': ['tomato', 'chicken']})
    
recipes = response.json()
print(f"Found {recipes['total_found']} recipes")
```

JavaScript
```javascript
const response = await fetch('http://localhost:5000/api/recipes', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({ingredients: ['pasta', 'tomato']})
});
const data = await response.json();
```

cURL
```bash
curl -X POST http://localhost:5000/api/recipes \
  -H "Content-Type: application/json" \
  -d '{"ingredients": ["chicken", "rice"]}'
```

---

Key Algorithms

1. Match Score
```python
score = (matching_ingredients / total_recipe_ingredients) * 100
```

Example: Recipe needs 4 ingredients, you have 3 → 75% match

 2. Ingredient Extraction
Parses cooking instructions to extract ingredients:
- "add 2 cups flour" → extracts "flour"
- "season with salt and pepper" → extracts "salt", "pepper"

 3. Utilization Score
```python
avg_match_score = average of top 3 recipes
```

---

Project Structure

```
SmartChef-AI-BackDevil-/
├── app.py              Main Flask app
├── requirements.txt    Dependencies
├── .env               API keys (create this)
├── .gitignore         Git ignore
└── README.md           This file
```

---

Troubleshooting

"Module not found"
```bash
pip install -r requirements.txt
```

"Connection timeout"
- RecipeDB server might be slow
- Check internet connection
- Verify API key

"Port already in use"
```bash
Kill process on port 5000
lsof -i :5000  # Get PID
kill -9 <PID>
```
Acknowledgments

- RecipeDB (IIIT Delhi Cosylab)
- Foodoscope (API provider)
- Render (hosting)
- Flask framework

---

<div align="center">

Made with ❤️ for reducing food waste**

One recipe at a time

</div>
