<script setup lang="ts">
import {
  ref,
  computed,
} from 'vue';
import '@types/interfaces';
import GameEnvironmentObjects from '@game/js/lib/objectMappings';

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
const selectedTool = computed(() => environmentClasses[selectedTag.value]);
const filteredTags = ref(tags);
const showSettings = ref(false);

const getFilteredTags = (text: string) => {
  filteredTags.value = tags.filter((option) => option.toLowerCase().indexOf(text.toLowerCase()) >= 0);
};
</script>

<template>
  <div>
    <b-field>
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
    <hr />
    <h3>Selected tool: <span>{{ selectedTag }}</span></h3>
    <div
      v-if="selectedTool"
      class="form"
    >
      <b-button
        label="settings"
        @click="showSettings = !showSettings"
      />
      <b-collapse
        :model-value="showSettings"
      >
        <b-field
          v-for="(value, field) in selectedTool.fields"
          :key="field"
          :label="field"
          :message="value.description"
        >
          <!-- Boolean fields -->
          <b-checkbox
            v-if="value.type === 'boolean'"
            :name="field"
          >
            {{ field }}
          </b-checkbox>

          <!-- Number fields -->
          <b-numberinput
            v-else-if="value.type === 'number'"
            :name="field"
            :placeholder="`Enter ${field}`"
            controls-position="compact"
          />

          <!-- String fields -->
          <b-input
            v-else-if="value.type === 'string'"
            :name="field"
            :placeholder="`Enter ${field}`"
          />

          <!-- Fields with multiple types (e.g., 'number|null') -->
          <b-input
            v-else
            :name="field"
            :placeholder="`Enter ${field} (${value.type})`"
          />
        </b-field>
      </b-collapse>
    </div>
  </div>
</template>
