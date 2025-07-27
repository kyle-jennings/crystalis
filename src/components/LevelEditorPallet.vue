<script setup lang="ts">
import {
  ref,
  watch,
  computed,
} from 'vue';
import '@types/interfaces';
import GameEnvironmentObjects from '@game/js/lib/objectMappings';
import useLevelEditorStore from '@/stores/levelEditorStore';

// Use the Pinia store
const store = useLevelEditorStore();

interface PlaceableObjectFields {
  [key: string]: {
    fields: {
      [key: string]: {
        type: string,
        description: string,
      }
    }
  }
}

const environmentClasses = Object.keys(GameEnvironmentObjects)
  .reduce((collector, key) => {
    // eslint-disable-next-line no-param-reassign
    collector[key] = {
      fields: GameEnvironmentObjects[key as keyof typeof GameEnvironmentObjects].constructorParams,
    };
    return collector;
  }, {} as PlaceableObjectFields);

const tags = Object.keys(environmentClasses);
const selectedTag = ref('');
const filteredTags = ref(tags);

// Computed property for placeholder dimensions and color
const selectedObjectPreview = computed(() => {
  if (!selectedTag.value || !GameEnvironmentObjects[selectedTag.value as keyof typeof GameEnvironmentObjects]) {
    return null;
  }

  const objectClass = GameEnvironmentObjects[selectedTag.value as keyof typeof GameEnvironmentObjects];
  const params = objectClass.constructorParams || {};

  // Get dimensions from constructor params or use defaults
  const width = params.width?.default || 32;
  const height = params.height?.default || 32;
  const color = params.color?.default || '#666666';

  return {
    width,
    height,
    color,
    name: selectedTag.value,
  };
});

const getFilteredTags = (text: string) => {
  filteredTags.value = tags.filter((option) => option.toLowerCase().indexOf(text.toLowerCase()) >= 0);
};

// Drag and drop functionality
const handleDragStart = (event: DragEvent) => {
  if (!selectedObjectPreview.value) return;

  // Store the object type and properties in the drag data
  const dragData = {
    objectType: selectedTag.value,
    width: selectedObjectPreview.value.width,
    height: selectedObjectPreview.value.height,
    color: selectedObjectPreview.value.color,
  };

  if (event.dataTransfer) {
    const { dataTransfer } = event;
    dataTransfer.setData('application/json', JSON.stringify(dragData));
    dataTransfer.effectAllowed = 'copy';
  }
};

const handleDragEnd = () => {
  // Optional: Add visual feedback when drag ends
};

// Delete selected entity
const deleteSelectedEntity = () => {
  if (!store.selectedEntity || !store.gameInstance) {
    /* eslint-disable-next-line no-console */
    console.warn('No entity selected or game instance not available');
    return;
  }

  const gameInstance = store.gameInstance as any;
  const selectedEntity = store.selectedEntity as any;

  // Try to use EntityManager if available
  const entityManager = gameInstance?.entityManager;
  if (entityManager && entityManager.deleteSelectedEntity) {
    const success = entityManager.deleteSelectedEntity();
    if (!success) {
      /* eslint-disable-next-line no-console */
      console.error('Failed to delete selected entity');
    }
    return;
  }

  // Fallback: Manual deletion for current implementation
  const entityArrays = [
    { name: 'houses', array: gameInstance.houses },
    { name: 'walls', array: gameInstance.walls },
    { name: 'trees', array: gameInstance.trees },
    { name: 'mountains', array: gameInstance.mountains },
    { name: 'stalactites', array: gameInstance.stalactites },
    { name: 'caves', array: gameInstance.caves },
    { name: 'entries', array: gameInstance.entries },
  ];

  const entityInfo = entityArrays.find(({ array }) => {
    if (array) {
      const index = array.indexOf(selectedEntity);
      if (index !== -1) {
        array.splice(index, 1);
        return true;
      }
    }
    return false;
  });

  if (entityInfo) {
    /* eslint-disable-next-line no-console */
    console.log(`Deleted ${selectedEntity.type || 'entity'} from ${entityInfo.name}`);
    // Clear selection
    store.clearSelectedEntity();
    // Trigger re-render
    gameInstance.render();
  } else {
    /* eslint-disable-next-line no-console */
    console.error('Selected entity not found in any array');
  }
};

// Watch for changes in selected entity and sync with selectedTag
// watch(() => store.selectedEntity, (newEntity) => {
//   if (newEntity && (newEntity as any).type) {
//     // Capitalize first letter to match the tag format
//     const entityType = (newEntity as any).type.charAt(0).toUpperCase() + (newEntity as any).type.slice(1);
//     selectedTag.value = entityType;
//   } else {
//     selectedTag.value = '';
//   }
// }, { immediate: true });

// Watch for manual tag selection and clear selected entity
watch(selectedTag, (newTag) => {
  // Only clear if the tag was manually changed and doesn't match current entity
  if (store.selectedEntity && (store.selectedEntity as any).type) {
    const entityType = (store.selectedEntity as any).type;
    const currentEntityType = entityType.charAt(0).toUpperCase() + entityType.slice(1);
    if (newTag !== currentEntityType) {
      store.clearSelectedEntity();
    }
  }
});
</script>

<template>
  <div>
    <h2 class="title is-4">Level Editor Pallet</h2>

    <b-field label="Tiles">
      <b-autocomplete
        v-model="selectedTag"
        field="name"
        placeholder="Select element tag"
        icon="label"
        clearable
        :data="filteredTags"
        :open-on-focus="true"
        @typing="getFilteredTags"
      />
    </b-field>

    <!-- Object Preview Placeholder -->
    <div v-if="selectedObjectPreview" class="object-preview mb-4">
      <h6 class="title is-6">{{ selectedObjectPreview.name }} Preview</h6>
      <div class="preview-container">
        <div
          class="preview-rectangle draggable"
          draggable="true"
          :style="{
            width: selectedObjectPreview.width + 'px',
            height: selectedObjectPreview.height + 'px',
            backgroundColor: selectedObjectPreview.color,
            border: '1px solid #333'
          }"
          @dragstart="handleDragStart"
          @dragend="handleDragEnd"
        ></div>
        <p class="help">
          {{ selectedObjectPreview.width }}px × {{ selectedObjectPreview.height }}px
          <br><small>Drag to canvas to place</small>
        </p>
      </div>
    </div>

    <hr />
    <!-- Show selected entity properties when something is clicked -->
    <div
      v-if="store.selectedEntity"
      class="selected-entity-panel mb-4"
    >
      <h5 class="title is-6">Selected Entity</h5>

      <div v-for="(paramInfo, key) in (store.selectedEntity as any)?.constructor?.constructorParams || {}" :key="key">
        <b-field :label="key" :message="paramInfo.description">
          <!-- Boolean fields -->
          <b-checkbox
            v-if="paramInfo.type === 'boolean'"
            v-model="(store.selectedEntity as any)[key]"
          >
            {{ key }}
          </b-checkbox>

          <!-- Number fields -->
          <b-numberinput
            v-else-if="paramInfo.type === 'number'"
            v-model="(store.selectedEntity as any)[key]"
            controls-position="compact"
            :placeholder="`Enter ${key}`"
          />

          <!-- String fields -->
          <b-input
            v-else
            v-model="(store.selectedEntity as any)[key]"
            :placeholder="`Enter ${key} (${paramInfo.type})`"
          />
        </b-field>
      </div>

      <!-- Delete Entity Button -->
      <b-field>
        <b-button
          type="is-danger"
          size="is-small"
          icon-left="delete"
          @click="deleteSelectedEntity"
        >
          Delete Entity
        </b-button>
      </b-field>

      <hr />

    </div>

  </div>
</template>

<style lang="scss" scoped>
.object-preview {
  padding: 10px;
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 4px;

  .preview-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
  }

  .preview-rectangle {
    display: block;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

    &.draggable {
      cursor: grab;
      transition: transform 0.2s ease;

      &:hover {
        transform: scale(1.05);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
      }

      &:active {
        cursor: grabbing;
        transform: scale(0.95);
      }
    }
  }

  .help {
    font-size: 0.75rem;
    color: #6c757d;
    margin: 0;
  }
}
</style>
