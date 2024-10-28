document.addEventListener("DOMContentLoaded", async () => {
    // Retrieve the recipe ID from the URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const recipeId = urlParams.get("id");

    if (recipeId) {
        try {
            // Fetch the recipe details using the ID
            const response = await fetch(
                `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${recipeId}`
            );
            const data = await response.json();
            const recipe = data.meals[0];

            // Construct HTML content for the recipe
            const recipeHTML = `
                <div class="recipe-detail">
                    <h2 class="recipe-title">${recipe.strMeal}</h2>
                    <img class="recipe-img" src="${recipe.strMealThumb}" alt="Image of ${recipe.strMeal}">
                    
                    <p class="recipe-prep-time">${estimatePrepTime(recipe.strInstructions)} minutes</p>
                    
                    <div class="recipe-ingredients">
                        <h3>Ingredients</h3>
                        <ul>${getIngredients(recipe)}</ul>
                    </div>
                    
                    <div class="recipe-instructions">
                        <h3>Instructions</h3>
                        ${getNumberedInstructions(recipe.strInstructions)}
                    </div>
                </div>
            `;

            // Insert the HTML content into a container element
            document.querySelector(".recipe-container").innerHTML = recipeHTML;

        } catch (error) {
            console.error("Error fetching recipe details:", error);
        }
    } else {
        document.querySelector(".recipe-container").innerHTML = "Recipe not found.";
    }

    // Function to format ingredients
    function getIngredients(recipe) {
        const ingredientsList = [];
        for (let i = 1; i <= 20; i++) {
            const ingredient = recipe[`strIngredient${i}`];
            const measure = recipe[`strMeasure${i}`];
            if (ingredient) ingredientsList.push(`<li>${measure} ${ingredient}</li>`);
        }
        return ingredientsList.join("");
    }

    // Function to number instructions
    function getNumberedInstructions(instructions) {
        return instructions
            .split(". ")
            .map((step, index) => `<p><strong>Step ${index + 1}:</strong> ${step.trim()}</p>`)
            .join("");
    }

    // Function to estimate prep time based on instruction length
    function estimatePrepTime(instructions) {
        const words = instructions.split(" ").length;
        return Math.ceil(words / 3); // Rough estimate: 3 words per second
    }
});
