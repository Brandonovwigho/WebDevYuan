document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM fully loaded and parsed");
    const recipesContainer = document.querySelector(".recipes-container");

  // Function to fetch a random recipe from the API
    async function fetchRecipe() {
        console.log("fetch function");
        try {
            const response = await fetch('/api/random-recipe');
            const data = await response.json();
            console.log("Data here:");
            console.log(data);
            return data.meals[0];
        } catch (error) {
            console.error("Error fetching recipe:", error);
        }
    }

  // Function to display a recipe card
  function displayRecipe(recipe) {
      const recipeId = recipe.idMeal;

      // Create a div element for the recipe card
      const recipeCard = document.createElement("div");
      recipeCard.classList.add("recipe-card");
      recipeCard.setAttribute("data-id", recipeId);

      // Set innerHTML for the card
      recipeCard.innerHTML = `
          <img src="${recipe.strMealThumb}" alt="Image of ${recipe.strMeal}">
          <h3>${recipe.strMeal}</h3>
          <p><strong>Ingredients:</strong> ${getIngredients(recipe)}</p>
          <p><strong>Prep time:</strong> ${estimatePrepTime(recipe.strInstructions)} minutes</p>
      `;

      // Add a click event listener for each card
      recipeCard.addEventListener("click", () => {
        window.location.href = `/recipe.html?id=${recipeId}`;
      });

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
      return Math.ceil(words / 3);
  }

  // Load 3 random recipes on page load
  for (let i = 0; i < 3; i++) {
      fetchRecipe().then(recipe => displayRecipe(recipe));
  }
});