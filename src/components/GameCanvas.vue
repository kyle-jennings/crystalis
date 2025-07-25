<script>
import {
  onMounted,
} from 'vue';
import '@game/css/styles.css';
import '@game/js/index.js';
// import { CrystalisGame } from './js/index.js';

onMounted(() => {
  // eslint-disable-next-line no-new
  // new CrystalisGame();
});
</script>

<template>
  <div id="canvasFlexWrapper">
    <div id="gameContainer">
      <canvas id="gameCanvas" width="512" height="480"></canvas>

      <div id="ui">
        <div class="stat">Level: <span id="level">1</span></div>
        <div class="stat">Area: <span id="currentArea">1</span></div>
        <div class="stat">HP: <span id="hp">16</span>/<span id="maxHp">16</span></div>
        <div class="hp-bar">
          <div class="hp-fill" id="hpFill"></div>
        </div>
        <div class="stat">MP: <span id="mp">4</span>/<span id="maxMp">4</span></div>
        <div class="mp-bar">
          <div class="mp-fill" id="mpFill"></div>
        </div>
        <div class="stat">EXP: <span id="exp">0</span></div>
        <div class="stat">Sword: <span id="currentSword">Wind</span></div>
      </div>

      <div id="instructions">
        <div
          id="instructionsHeader"
          class="collapsed"
          onclick="toggleInstructions()"
        >
          <span id="instructionsToggle">▼</span>
          <span>Controls (Click to toggle, or press H)</span>
        </div>
        <div id="instructionsContent" class="collapsed">
          <div class="controls">WASD/Arrows: Move</div>
          <div class="controls">Z: Attack (Hold to charge)</div>
          <div class="controls">Shift: Dash</div>
          <div class="controls">X: Magic/Heal</div>
          <div class="controls">T: Toggle Enemy Movement</div>
          <div class="controls">[ / ] : Switch Levels</div>
          <div class="controls">H: Toggle Instructions</div>
          <div id="devControls">
            <div class="controls">Dev Mode Controls:</div>
            <div class="controls">G: Toggle God Mode</div>
            <div class="controls">L: Log Level Debug Info</div>
          </div>
        </div>
      </div>

    </div>

    <!-- New editor canvas container -->
    <div id="editorContainer">
      <canvas id="editorCanvas" width="512" height="480"></canvas>
      <div id="editorUI">
        <h4>Level Editor</h4>
        <div id="objectPalette">
          <!-- Object buttons will be generated here -->
        </div>
      </div>
    </div>

  </div>
</template>
