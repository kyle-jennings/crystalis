<script setup lang="ts">
import {
  ref,
  // computed,
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
// const selectedTool = computed(() => environmentClasses[selectedTag.value].type);
const filteredTags = ref(tags);

const getFilteredTags = (text: string) => {
  filteredTags.value = tags.filter((option) => option.toLowerCase().indexOf(text.toLowerCase()) >= 0);
};
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

    <!-- Show selected entity properties when something is clicked -->
    <div v-if="store.selectedEntity" class="selected-entity-panel mb-4">
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
      <hr />
    </div>

  </div>
</template>
