import CrystalisGame from "./js/CrystalisGame";
// Start the game when page loads
window.addEventListener('load', () => {
  console.log('load the game!');
  window.CrystalisGame = new CrystalisGame({
    $elm: '#app',
  });
});