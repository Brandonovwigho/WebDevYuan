document.addEventListener("DOMContentLoaded", () => {
  const recipesContainer = document.querySelector(".recipes-container");

  // Function to fetch a random recipe from the API
  async function fetchRecipe() {
    try {
      const response = await fetch("https://www.themealdb.com/api/json/v1/1/random.php");
      const data = await response.json();
      return data.meals[0]; // Returns the first recipe in the array
    } catch (error) {
      console.error("Error fetching recipe:", error);
    }
  }

  // Function to display a recipe card
  function displayRecipe(recipe) {
    // Create HTML content as a string
    let recipeHTML = `
      <div class="recipe-card">
        <img src="${recipe.strMealThumb}" alt="Image of ${recipe.strMeal}">
        <h3>${recipe.strMeal}</h3>
        <p><strong>Ingredients:</strong> ${getIngredients(recipe)}</p>
        <p><strong>Prep time:</strong> ${estimatePrepTime(recipe.strInstructions)} minutes</p>
      </div>
    `;

    // Append the HTML content to the container
    recipesContainer.innerHTML += recipeHTML;
  }

  // Function to extract and format ingredients
  function getIngredients(recipe) {
    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
      const ingredient = recipe[`strIngredient${i}`];
      const measure = recipe[`strMeasure${i}`];
      if (ingredient) ingredients.push(`${measure} ${ingredient}`);
    }
    return ingredients.join(", ");
  }

  // Function to estimate prep time based on instruction length
  function estimatePrepTime(instructions) {
    const words = instructions.split(" ").length;
    return Math.ceil(words / 3); // Rough estimate: 3 words per second
  }

  // Load 3 random recipes on page load
  for (let i = 0; i < 3; i++) {
    fetchRecipe().then(recipe => displayRecipe(recipe));
  }
});
