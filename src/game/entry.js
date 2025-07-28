import CrystalisGame from "./js/CrystalisGame";
// Start the game when page loads
window.addEventListener('load', () => {
  window.CrystalisGame = new CrystalisGame({
    $elm: '#app',
  });
});