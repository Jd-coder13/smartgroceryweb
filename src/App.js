import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  NavLink,
} from "react-router-dom";
import VoiceInput from "./VoiceInput";
import BarcodeScanner from "./BarcodeScanner";

const SPOONACULAR_API_KEY = "9520b4f67cb740ffa98014414f056f43";

// Button style for light mode only
const buttonStyle = {
  cursor: "pointer",
  padding: "10px 20px",
  fontSize: 16,
  borderRadius: 12,
  border: "none",
  background: "linear-gradient(145deg, #e0e0e0, #ffffff)",
  boxShadow: "5px 5px 10px #bebebe, -5px -5px 10px #ffffff",
  color: "#222",
  transition: "all 0.3s ease",
  userSelect: "none",
};

// Home component for ingredients + recipes
function Home({ groceryList, addItemToGroceryList }) {
  const [ingredients, setIngredients] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [scanning, setScanning] = useState(false);

  const addIngredient = (ingredient) => {
    const cleaned = ingredient.toLowerCase().trim();
    if (!cleaned) return;
    const parts = ingredients.split(",").map((i) => i.trim().toLowerCase());
    if (!parts.includes(cleaned)) {
      setIngredients((prev) => (prev ? prev + ", " + cleaned : cleaned));
    }
  };

  const addGroceryToIngredients = (item) => addIngredient(item);

  const fetchRecipes = async () => {
    if (!ingredients.trim()) return alert("Please enter some ingredients!");
    setLoading(true);
    try {
      const response = await fetch(
        `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${encodeURIComponent(
          ingredients
        )}&number=5&apiKey=${SPOONACULAR_API_KEY}`
      );
      const data = await response.json();
      setRecipes(data);
    } catch {
      alert("Error fetching recipes");
    }
    setLoading(false);
  };

  return (
    <>
      <p>Enter ingredients (comma separated):</p>
      <input
        type="text"
        placeholder="e.g. tomato, chicken, rice"
        value={ingredients}
        onChange={(e) => setIngredients(e.target.value)}
        style={{
          width: "100%",
          padding: 10,
          fontSize: 16,
          borderRadius: 8,
          border: `1.5px solid #ccc`,
          backgroundColor: "#fff",
          color: "#222",
          transition: "all 0.3s ease",
        }}
      />

      <VoiceInput onAddIngredient={addIngredient} />

      <button
        onClick={() => setScanning((prev) => !prev)}
        style={{ ...buttonStyle, marginTop: 10 }}
      >
        {scanning ? "Stop Scanning Barcode" : "Scan Barcode"}
      </button>

      {scanning && (
        <BarcodeScanner
          onDetected={(code) => {
            alert(`Barcode detected: ${code}`);
            setScanning(false);
          }}
        />
      )}

      <button onClick={fetchRecipes} style={{ ...buttonStyle, marginTop: 10 }}>
        {loading ? "Loading..." : "Get Recipes"}
      </button>

      <div style={{ marginTop: 30 }}>
        {recipes.length === 0 && <p>No recipes to show yet</p>}
        {recipes.map((recipe) => (
          <div
            key={recipe.id}
            style={{
              border: `1.5px solid #ddd`,
              borderRadius: 8,
              padding: 10,
              marginBottom: 20,
              boxShadow: "1px 1px 8px rgba(0,0,0,0.1)",
              backgroundColor: "#fff",
              color: "#222",
              transition: "all 0.3s ease",
            }}
          >
            <h3>{recipe.title}</h3>
            <img
              src={recipe.image}
              alt={recipe.title}
              style={{
                width: "100%",
                maxHeight: 200,
                objectFit: "cover",
                borderRadius: 8,
              }}
            />
            <p>Used ingredients: {recipe.usedIngredientCount}</p>
            <p>Missed ingredients: {recipe.missedIngredientCount}</p>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 40 }}>
        <h3>Grocery List (click item to add to ingredients):</h3>
        <ul>
          {groceryList.map((item, idx) => (
            <li
              key={idx}
              onClick={() => addGroceryToIngredients(item)}
              style={{
                cursor: "pointer",
                color: "blue",
                textDecoration: "underline",
                marginTop: 6,
              }}
            >
              {item}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

// Grocery List component
function GroceryList({ groceryList, setGroceryList }) {
  const [newItem, setNewItem] = useState("");

  const addItemToGroceryList = () => {
    if (!newItem.trim()) return;
    if (!groceryList.includes(newItem.trim())) {
      setGroceryList((prev) => [...prev, newItem.trim()]);
    }
    setNewItem("");
  };
  const removeItemFromGroceryList = (item) => {
    setGroceryList((prev) => prev.filter((i) => i !== item));
  };

  return (
    <div style={{ marginTop: 40 }}>
      <h2>Grocery List</h2>
      <input
        type="text"
        placeholder="Add grocery item"
        value={newItem}
        onChange={(e) => setNewItem(e.target.value)}
        style={{
          padding: 8,
          width: "70%",
          fontSize: 16,
          borderRadius: 8,
          border: `1.5px solid #ccc`,
          backgroundColor: "#fff",
          color: "#222",
          transition: "all 0.3s ease",
        }}
      />
      <button onClick={addItemToGroceryList} style={{ ...buttonStyle, marginLeft: 10 }}>
        Add
      </button>

      <ul>
        {groceryList.map((item, idx) => (
          <li
            key={idx}
            style={{
              marginTop: 8,
              color: "#222",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              backgroundColor: "#f9f9f9",
              padding: "6px 12px",
              borderRadius: 8,
              boxShadow: "2px 2px 5px rgba(0,0,0,0.1)",
              transition: "all 0.3s ease",
            }}
          >
            {item}
            <button
              onClick={() => removeItemFromGroceryList(item)}
              style={{
                ...buttonStyle,
                padding: "5px 10px",
                fontSize: 14,
                marginLeft: 10,
                background: "linear-gradient(145deg, #f0e0e0, #fff0f0)",
                color: "#a33",
                boxShadow: "3px 3px 6px #dcbcbc, -3px -3px 6px #fff0f0",
              }}
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

// Meal Planner component (updated with your full logic)
function MealPlanner() {
  // Large list of healthy meal options (you can expand this list)
  const healthyMeals = [
    "Oatmeal with berries",
    "Greek yogurt with honey and nuts",
    "Avocado toast with egg",
    "Quinoa salad with veggies",
    "Grilled chicken breast with steamed broccoli",
    "Baked salmon with asparagus",
    "Vegetable stir-fry with tofu",
    "Chickpea and spinach curry",
    "Whole grain pasta with tomato sauce",
    "Sweet potato and black bean chili",
    "Mixed greens salad with walnuts and feta",
    "Lentil soup",
    "Turkey and avocado wrap",
    "Brown rice bowl with grilled veggies",
    "Scrambled eggs with spinach",
    "Smoothie bowl with banana and chia seeds",
    "Cottage cheese with pineapple",
    "Grilled shrimp and quinoa",
    "Roasted vegetable medley",
    "Zucchini noodles with pesto",
    "Turkey meatballs with marinara",
    "Chia pudding with almond milk",
    "Baked cod with lemon and herbs",
    "Stuffed bell peppers with rice and beans",
    "Egg white omelette with mushrooms",
    "Cauliflower rice stir-fry",
    "Grilled veggie sandwich",
    "Salmon and avocado salad",
    "Black bean tacos",
    "Bulgur wheat tabbouleh",
    "Kale and sweet potato hash",
    "Minestrone soup",
    "Spinach and feta stuffed chicken",
    "Peanut butter and banana on whole wheat",
    "Roasted chickpeas",
    "Vegetable frittata",
    "Tofu scramble with veggies",
    "Almond butter and apple slices",
    "Grilled portobello mushrooms",
    "Seared tuna salad",
    "Vegetable sushi rolls",
    "Pumpkin soup",
    "Baked falafel with tzatziki",
    "Green smoothie with kale and mango",
    "Egg salad with avocado",
    "Whole grain pancakes with fruit",
    "Beef and broccoli stir-fry",
    "Vegetarian chili",
    "Cucumber and tomato salad",
    "Sweet potato toast with almond butter",
    // Add more here to reach ~500 unique meals if needed
  ];

  // Utility to pick n random meals from the list without repeats
  const getRandomMeals = (num) => {
    const shuffled = healthyMeals.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, num);
  };

  // Generate meal plan for 7 days, 3 meals per day
  const generateMealPlan = () => {
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    let planText = "";

    for (const day of days) {
      const breakfast = getRandomMeals(1)[0];
      const lunch = getRandomMeals(1)[0];
      const dinner = getRandomMeals(1)[0];

      planText += `${day}:\n  Breakfast: ${breakfast}\n  Lunch: ${lunch}\n  Dinner: ${dinner}\n\n`;
    }

    setPlan(planText.trim());
  };

  const [plan, setPlan] = useState("");

  return (
    <div style={{ marginTop: 40 }}>
      <h2>AI Meal Planner</h2>
      <p>Click the button below to generate a healthy 3 meals/day plan for the week.</p>
      <button onClick={generateMealPlan} style={buttonStyle}>
        Generate Meal Plan
      </button>
      {plan && (
        <pre
          style={{
            marginTop: 20,
            backgroundColor: "#f0f0f0",
            padding: 15,
            borderRadius: 6,
            whiteSpace: "pre-wrap",
            fontSize: 16,
            color: "#222",
            transition: "all 0.3s ease",
          }}
        >
          {plan}
        </pre>
      )}
    </div>
  );
}

// Main App
function App() {
  const [groceryList, setGroceryList] = useState(() => {
    const saved = localStorage.getItem("groceryList");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("groceryList", JSON.stringify(groceryList));
  }, [groceryList]);

  return (
    <Router>
      <div
        className="App"
        style={{
          padding: 20,
          maxWidth: 900,
          margin: "auto",
          backgroundColor: "#fefefe",
          color: "#222",
          minHeight: "100vh",
          transition: "all 0.3s ease",
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif',
        }}
      >
        <div className="App-content">
          <h1>Smart Grocery Website</h1>

          <nav
            style={{
              borderBottom: `2px solid #ccc`,
              paddingBottom: 8,
              marginBottom: 20,
            }}
          >
            <NavLink
              to="/"
              end
              style={({ isActive }) => ({
                marginRight: 15,
                textDecoration: "none",
                color: isActive ? "#007acc" : "#555",
                fontWeight: isActive ? "bold" : "normal",
                transition: "color 0.3s ease",
              })}
            >
              Home
            </NavLink>
            <NavLink
              to="/grocery-list"
              style={({ isActive }) => ({
                marginRight: 15,
                textDecoration: "none",
                color: isActive ? "#007acc" : "#555",
                fontWeight: isActive ? "bold" : "normal",
                transition: "color 0.3s ease",
              })}
            >
              Grocery List
            </NavLink>
            <NavLink
              to="/meal-planner"
              style={({ isActive }) => ({
                textDecoration: "none",
                color: isActive ? "#007acc" : "#555",
                fontWeight: isActive ? "bold" : "normal",
                transition: "color 0.3s ease",
              })}
            >
              Meal Planner
            </NavLink>
          </nav>

          <Routes>
            <Route
              path="/"
              element={
                <Home groceryList={groceryList} addItemToGroceryList={setGroceryList} />
              }
            />
            <Route
              path="/grocery-list"
              element={
                <GroceryList groceryList={groceryList} setGroceryList={setGroceryList} />
              }
            />
            <Route path="/meal-planner" element={<MealPlanner />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;

