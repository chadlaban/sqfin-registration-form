<template>
  <div class="spinner" v-if="isVisible"></div>
</template>

<script setup lang="ts">
defineProps<{
  isVisible: boolean;
}>();
</script>

<style scoped lang="sass">
@use "~/assets/styles/variables"
@use "~/assets/styles/typography" as typography
@use "sass:color"

.spinner
  width: 20px
  height: 20px
  border: 3px solid color.scale(variables.$color-white, $lightness: -10%)
  border-top: 3px solid variables.$color-crimson-pink
  border-radius: 50%
  animation: spin 0.8s linear infinite

@keyframes spin
  from
    transform: rotate(0deg)
  to
    transform: rotate(360deg)
</style>
