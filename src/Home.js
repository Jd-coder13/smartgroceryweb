import React, { useState } from "react";
import VoiceInput from "./VoiceInput";
import BarcodeScanner from "./BarcodeScanner";

const SPOONACULAR_API_KEY = "9520b4f67cb740ffa98014414f056f43";

export default function Home({ groceryList, addItemToGroceryList }) {
  const [ingredients, setIngredients] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [scanning, setScanning] = useState(false);

  const addIngredient = (ingredient) => {
    const cleaned = ingredient.toLowerCase().trim();
    if (!cleaned) return;
    const parts = ingredients
      .split(",")
      .map((i) => i.trim().toLowerCase());
    if (!parts.includes(cleaned)) {
      setIngredients((prev) => (prev ? prev + ", " + cleaned : cleaned));
    }
  };

  const addGroceryToIngredients = (item) => {
    addIngredient(item);
  };

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
    } catch (error) {
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
        style={{ width: "100%", padding: 10, fontSize: 16 }}
      />

      <VoiceInput onAddIngredient={addIngredient} />

      <button
        onClick={() => setScanning((prev) => !prev)}
        style={{ marginTop: 10, padding: "10px 20px", fontSize: 16 }}
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

      <button
        onClick={fetchRecipes}
        style={{ marginTop: 10, padding: "10px 20px", fontSize: 16, display: "block" }}
      >
        {loading ? "Loading..." : "Get Recipes"}
      </button>

      <div style={{ marginTop: 30 }}>
        {recipes.length === 0 && <p>No recipes to show yet</p>}
        {recipes.map((recipe) => (
          <div
            key={recipe.id}
            style={{
              border: "1px solid #ddd",
              borderRadius: 8,
              padding: 10,
              marginBottom: 20,
              boxShadow: "1px 1px 5px rgba(0,0,0,0.1)",
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

      {/* Grocery List clickable to add to ingredients */}
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
