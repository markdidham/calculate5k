// 5K Time Predictor using Jack Daniels' Formula
// Optimized for GitHub Pages and Google Sites embedding

/**
 * Function to predict 5K time based on VO2 max, gender, and age.
 * Uses Jack Daniels' methodology with refined pace scaling.
 * @param {number} vo2Max - The VO2 max score.
 * @param {string} gender - The gender of the runner ('male' or 'female').
 * @param {number} age - The age of the runner.
 * @returns {string} - Predicted 5K time in HH:MM:SS format.
 */
function predict5KTime(vo2Max, gender, age) {
  const GENDER_MULTIPLIER = {
    male: 1.0,
    female: 0.94 // Adjusted gender performance multiplier
  };

  // Adjust VO2 max for gender
  let adjustedVO2 = vo2Max * (GENDER_MULTIPLIER[gender.toLowerCase()] || 1.0);

  // Apply age adjustment (VO2 max declines ~0.3% per year after 30, capped at 85% of original value)
  if (age > 30) {
    adjustedVO2 *= Math.max(1 - ((age - 30) * 0.003), 0.85);
  }

  // Jack Daniels' VO2 max to running performance model
  const VO2_AT_5K_PACE = 58; // Adjusted for more accurate trained runner pace
  const BASE_5K_TIME_SECONDS = 1365; // 22:45 min for adjusted trained runners

  // Adjusted 5K time based on performance scaling
  const predictedTimeSeconds = BASE_5K_TIME_SECONDS * (VO2_AT_5K_PACE / adjustedVO2);

  // Convert to HH:MM:SS format
  const hours = Math.floor(predictedTimeSeconds / 3600);
  const minutes = Math.floor((predictedTimeSeconds % 3600) / 60);
  const seconds = Math.round(predictedTimeSeconds % 60);

  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// Function to create the UI and allow embedding in GitHub Pages and Google Sites
document.addEventListener("DOMContentLoaded", function() {
  const container = document.createElement("div");
  container.style.cssText = "font-family: Arial, sans-serif; max-width: 400px; margin: 20px auto; padding: 20px; border: 1px solid #ccc; border-radius: 8px; text-align: center;";
  container.innerHTML = `
    <h3>5K Time Predictor</h3>
    <label for="vo2Max">VO2 Max:</label>
    <input type="number" id="vo2Max" placeholder="Enter VO2 Max" step="0.1" style="width: 100%; padding: 8px; margin-bottom: 10px;">
    <br>
    <label for="age">Age:</label>
    <input type="number" id="age" placeholder="Enter Age" style="width: 100%; padding: 8px; margin-bottom: 10px;">
    <br>
    <label for="gender">Gender:</label>
    <select id="gender" style="width: 100%; padding: 8px; margin-bottom: 10px;">
      <option value="male">Male</option>
      <option value="female">Female</option>
    </select>
    <br>
    <button id="calculateButton" style="width: 100%; padding: 10px; background-color: #007bff; color: white; border: none; border-radius: 5px; cursor: pointer;">Predict 5K Time</button>
    <p id="result" style="margin-top: 20px; font-weight: bold; font-size: 16px;"></p>
  `;

  document.body.appendChild(container);

  document.getElementById('calculateButton').addEventListener('click', function() {
    const vo2Max = parseFloat(document.getElementById('vo2Max').value);
    const age = parseInt(document.getElementById('age').value);
    const gender = document.getElementById('gender').value;

    if (isNaN(vo2Max) || isNaN(age) || !gender) {
      document.getElementById('result').textContent = 'Please enter valid inputs for VO2 Max, age, and gender.';
      return;
    }

    const predictedTime = predict5KTime(vo2Max, gender, age);
    document.getElementById('result').textContent = `Predicted 5K Time: ${predictedTime}`;
  });
});
