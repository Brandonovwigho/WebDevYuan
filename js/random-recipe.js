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
      // Create a recipe card container
      const recipeCard = document.createElement("div");
      recipeCard.classList.add("recipe-card");
  
      // Create image element
      const recipeImage = document.createElement("img");
      recipeImage.src = recipe.strMealThumb;
      recipeImage.alt = `Image of ${recipe.strMeal}`;
  
      // Create title element
      const recipeTitle = document.createElement("h3");
      recipeTitle.textContent = recipe.strMeal;
  
      // Create ingredients element
      const recipeIngredients = document.createElement("p");
      recipeIngredients.innerHTML = `<strong>Ingredients:</strong> ${getIngredients(recipe)}`;
  
      // Create prep time element (estimated based on instructions length)
      const prepTime = document.createElement("p");
      prepTime.innerHTML = `<strong>Prep time:</strong> ${estimatePrepTime(recipe.strInstructions)} minutes`;
  
      // Append all elements to the recipe card
      recipeCard.appendChild(recipeImage);
      recipeCard.appendChild(recipeTitle);
      recipeCard.appendChild(recipeIngredients);
      recipeCard.appendChild(prepTime);
  
      // Append the recipe card to the container
      recipesContainer.appendChild(recipeCard);
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