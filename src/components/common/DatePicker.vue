<!-- 
// This component is designed to be used as-is, should not need to modify this.  
// Refer to Forms3 or Wheels apps to see how it is implemented
-->

<template>
  <v-menu v-model="isMenuOpen" :close-on-content-click="false">
    <template v-slot:activator="{ props }">
      <v-text-field
        :label="label"
        :model-value="formattedDate"
        readonly
        v-bind="props"
        variant="outlined"
        prepend-inner-icon="mdi-calendar"
        hide-details
      ></v-text-field>
    </template>
    <v-date-picker v-model="selectedDate" hide-actions title="" :color="color">
      <template v-slot:header></template>
    </v-date-picker>
  </v-menu>
</template>

<script setup>
import { ref, computed, watch } from "vue";

const { label, color, modelValue } = defineProps([
  "label",
  "color",
  "modelValue",
]);

const emit = defineEmits("update:modelValue");

const isMenuOpen = ref(false);
const selectedDate = ref(modelValue);

const formattedDate = computed(() => {
  //return selectedDate.value ? selectedDate.value.toLocaleDateString("en") : "";
  return selectedDate.value ? selectedDate.value.toLocaleDateString("en") : "";
});

// This was causing a warning, and seems okay without it.
/*watch(modelValue, (newDate) => {
  selectedDate.value = newDate;
});*/

watch(selectedDate, (newDate) => {
  emit("update:modelValue", newDate);
  isMenuOpen.value = false; // Close the menu when a new date is picked
});
</script>
<style>
.v-overlay__content:has(> .v-date-picker) {
  min-width: auto!important;
}
.v-picker-title {
  padding: 0 !important;
}
</style>`