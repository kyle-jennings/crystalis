<script setup lang="ts">
import {
  ref,
  computed,
  watch,
  onMounted,
  nextTick,
} from 'vue';
import '@types/interfaces';
import GameEnrionmentObjects from '@game/js/lib/objectMappings';
import useLevelEditor from '@/composables/useLevelEditor';

console.log(GameEnrionmentObjects);
const selectedObject = ref<any>(null); // Store reference to currently selected object
const toolPreviewCanvas = ref<HTMLCanvasElement>();
const formValues = ref<Record<string, any>>({}); // Store form input values

// Get game instance from window - this would ideally be passed as a prop
const { game } = window as any;
const levelEditor = useLevelEditor(game);

// Use the level editor's selected tool
const { selectedTool } = levelEditor;
const { currentTool } = levelEditor;

// Computed property to check if we have a selected object
const hasSelectedObject = computed(() => selectedObject.value !== null);

// Initialize form values when tool changes
watch(selectedTool, () => {
  // Clear selected object when tool changes manually
  if (selectedObject.value && selectedObject.value.type !== selectedTool.value) {
    selectedObject.value = null;
  }

  const tool = currentTool.value;
  const initialValues: Record<string, any> = {};

  tool.args.forEach((arg) => {
    initialValues[arg.name] = arg.default !== undefined ? arg.default : '';
  });

  formValues.value = initialValues;
}, { immediate: true });

// Function to handle when an object is clicked in the canvas
const handleObjectClick = (objectData: any) => {
  // Store reference to the selected object
  selectedObject.value = objectData;

  // Update the selected tool to match the clicked object
  selectedTool.value = objectData.type;

  // Update the object palette select element
  const objectPalette = document.getElementById('objectPalette') as HTMLSelectElement;
  if (objectPalette) {
    objectPalette.value = objectData.type;
  }

  // Populate form with the object's current values
  const newFormValues: Record<string, any> = {};
  const tool = currentTool.value;

  tool.args.forEach((arg) => {
    // Use the object's actual property value if it exists, otherwise use default
    if (objectData[arg.name] !== undefined) {
      newFormValues[arg.name] = objectData[arg.name];
    } else {
      newFormValues[arg.name] = arg.default !== undefined ? arg.default : '';
    }
  });

  formValues.value = newFormValues;
};

// Watch form values and update the selected object when they change
watch(formValues, (newValues) => {
  if (selectedObject.value) {
    // Update the object's properties with the new form values
    Object.keys(newValues).forEach((key) => {
      if (selectedObject.value[key] !== undefined || newValues[key] !== '') {
        selectedObject.value[key] = newValues[key];
      }
    });
  }
}, { deep: true });

// Expose the function to the global window object so the canvas can call it
if (typeof window !== 'undefined') {
  (window as any).devPanelHandleObjectClick = handleObjectClick;
}

// Function to draw the selected tool on the preview canvas
const drawToolPreview = () => {
  if (!toolPreviewCanvas.value) return;

  const canvas = toolPreviewCanvas.value;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Clear canvas
  ctx.clearRect(0, 0, 64, 64);

  // Set background
  ctx.fillStyle = '#2d2d2d';
  ctx.fillRect(0, 0, 64, 64);

  // Draw object based on type
  const tool = currentTool.value;
  ctx.fillStyle = tool.color;

  switch (selectedTool.value) {
    case 'tree':
      // Draw a simple tree shape
      ctx.fillStyle = '#8B4513'; // Brown trunk
      ctx.fillRect(28, 40, 8, 20);
      ctx.fillStyle = tool.color; // Green foliage
      ctx.beginPath();
      ctx.arc(32, 30, 15, 0, 2 * Math.PI);
      ctx.fill();
      break;

    case 'mountain':
      // Draw mountain shape
      ctx.beginPath();
      ctx.moveTo(10, 55);
      ctx.lineTo(32, 15);
      ctx.lineTo(54, 55);
      ctx.closePath();
      ctx.fill();
      break;

    case 'house':
      // Draw house shape
      ctx.fillRect(20, 35, 24, 20); // Main structure
      ctx.fillStyle = '#8B4513'; // Roof color
      ctx.beginPath();
      ctx.moveTo(16, 35);
      ctx.lineTo(32, 20);
      ctx.lineTo(48, 35);
      ctx.closePath();
      ctx.fill();
      break;

    case 'wall':
      // Draw wall as rectangle
      ctx.fillRect(16, 20, 32, 24);
      break;

    case 'entry':
      // Draw entry as glowing portal
      ctx.globalAlpha = 0.7;
      ctx.fillRect(20, 20, 24, 24);
      ctx.globalAlpha = 1.0;
      // Add arrow
      ctx.fillStyle = '#000000';
      ctx.font = '14px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('→', 32, 36);
      break;

    case 'item':
      // Draw item as orb
      ctx.beginPath();
      ctx.arc(32, 32, 12, 0, 2 * Math.PI);
      ctx.fill();
      // Add shine effect
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(28, 28, 4, 0, 2 * Math.PI);
      ctx.fill();
      break;

    default:
      // Default rectangle
      ctx.fillRect(20, 20, 24, 24);
  }
};

// Watch for tool changes and redraw
watch(selectedTool, () => {
  nextTick(() => {
    drawToolPreview();
  });
});

// Draw initial preview when component mounts
onMounted(() => {
  nextTick(() => {
    drawToolPreview();
  });
});

const editorEnabled = ref(false);
const buttonLabel = computed(() => (editorEnabled.value ? 'Disable Editor' : 'Enable Editor'));
// Handle tab change and update the global game state
const toggleEditor = () => {
  editorEnabled.value = !editorEnabled.value;
  // TypeScript safe access to window object
  if (typeof window !== 'undefined' && (window as any).CrystalisGame?.devMode) {
    (window as any).CrystalisGame.devMode.toggleLevelEditor();
  }
};

const exportSettings = () => {
  window.game.levelEditor?.exportLevel();
};

const toggleDeleteMode = () => {
  const isDeleteMode = window.game.levelEditor?.toggleDeleteMode();
  // eslint-disable-next-line no-console
  console.log(`Delete mode toggled: ${isDeleteMode ? 'ON' : 'OFF'}`);
};

const objectPaletteChange = (event: Event) => {
  const target = event.target as HTMLSelectElement;
  const key = target?.value;
  if (key) {
    // Clear selected object when manually changing tools
    selectedObject.value = null;

    levelEditor.setSelectedTool(key);
  }
};
</script>

<!-- eslint-disable vuejs-accessibility/label-has-for -->
<template>
  <div class="dev-panel">
    <!-- eslint-disable vue/require-associated-control -->
    <b-button
      type="is-is-warning"
      :label="buttonLabel"
      @click="toggleEditor"
    />

    <div v-show="editorEnabled" id="level-editor" class="editor-content">

      <h3 class="title is-5">Level Editor</h3>
      <h4 class="editor-tool-label">
          Selected Tool:<span></span>
      </h4>

      <select
        id="objectPalette"
        class="object-palette"
        @change="objectPaletteChange"
      ></select>

      <article class="media">
        <figure class="media-left">
          <div class="image is-64x64">
            <canvas
              ref="toolPreviewCanvas"
              class="tool-preview"
              width="64"
              height="64"
            ></canvas>
          </div>
        </figure>

        <div class="media-content">
          <div class="content">
            <p>
              <strong>{{ currentTool.name }}</strong>
              <span
                v-if="hasSelectedObject"
                class="tag is-info is-small"
                style="margin-left: 8px;"
              >
                Selected
              </span>
            </p>
            <div
              class="form"
              :class="{ 'selected-object': hasSelectedObject }"
            >
              <div
                v-for="arg in currentTool.args"
                :key="arg.name"
                class="field"
              >
                <div class="control">
                  <!-- Number inputs -->
                  <div v-if="arg.type === 'number'">
                    <label
                      class="label"
                      :for="`${arg.name}-input`"
                    >
                      {{ arg.name }}
                      <span
                        v-if="!arg.required"
                        class="has-text-grey-light"
                      >
                        (optional)
                      </span>
                    </label>
                    <input
                      :id="`${arg.name}-input`"
                      v-model="formValues[arg.name]"
                      class="input is-small"
                      type="number"
                      :placeholder="arg.default?.toString() || ''"
                    >
                  </div>
                  <!-- Boolean inputs -->
                  <label
                    v-else-if="arg.type === 'boolean'"
                    class="checkbox"
                  >
                    <input
                      v-model="formValues[arg.name]"
                      type="checkbox"
                    >
                    {{ arg.name }}
                    <span
                      v-if="!arg.required"
                      class="has-text-grey-light"
                    >
                      (optional)
                    </span>
                  </label>
                  <!-- Select inputs -->
                  <div v-else-if="arg.type === 'select'">
                    <label
                      class="label"
                      :for="`${arg.name}-input`"
                    >
                      {{ arg.name }}
                      <span
                        v-if="!arg.required"
                        class="has-text-grey-light"
                      >
                        (optional)
                      </span>
                    </label>
                    <div class="select is-small">
                      <select
                        :id="`${arg.name}-input`"
                        v-model="formValues[arg.name]"
                      >
                        <option
                          v-for="option in arg.options"
                          :key="option"
                          :value="option"
                        >
                          {{ option }}
                        </option>
                      </select>
                    </div>
                  </div>
                  <!-- Text inputs (fallback) -->
                  <div v-else>
                    <label
                      class="label"
                      :for="`${arg.name}-input`"
                    >
                      {{ arg.name }}
                      <span
                        v-if="!arg.required"
                        class="has-text-grey-light"
                      >
                        (optional)
                      </span>
                    </label>
                    <input
                      :id="`${arg.name}-input`"
                      v-model="formValues[arg.name]"
                      class="input is-small"
                      type="text"
                      :placeholder="arg.default?.toString() || ''"
                    >
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </article>

      <div class="buttons">
        <b-button
          @click="toggleDeleteMode"
          data-delete-btn
          class="is-warning"
          label="Delete Mode"
        />
        <b-button
          @click="exportSettings"
          class="is-success"
          label="Export Level"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.dev-panel {
  width: 100%;
  height: 100%;
}

.debug-content,
.editor-content {
  padding: 1rem;
}

.content {
  margin-top: 1rem;
}

.tool-preview {
  width: 100%;
  height: 100%;
  border-radius: 8px;
  border: 2px solid #333;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.tool-preview::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 16px;
  height: 16px;
  background-color: rgba(255, 255, 255, 0.3);
  border-radius: 2px;
}

.form {
  transition: background-color 0.2s ease;
}

.form.selected-object {
  background-color: rgba(0, 123, 255, 0.05);
  border-left: 3px solid #007bff;
  padding-left: 12px;
}
</style>
