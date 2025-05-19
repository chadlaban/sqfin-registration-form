<template>
  <div class="modal-overlay" @click.self="closeModal">
    <div class="modal-content">
      <h2>{{ title }}</h2>
      <p>{{ message }}</p>
      <button @click="closeModal" class="close-btn">OK</button>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string;
  message: string;
}>();

const emit = defineEmits<{
  (e: "close"): void;
}>();

function closeModal() {
  emit("close");
}
</script>

<style scoped lang="sass">
@use "~/assets/styles/variables"
@use "~/assets/styles/typography" as typography
@use "sass:color"

.modal-overlay
  position: fixed
  top: 0
  left: 0
  right: 0
  bottom: 0
  background-color: color.scale(variables.$color-black, $alpha: -70%)
  display: flex
  align-items: center
  justify-content: center
  z-index: 9999

.modal-content
  background-color: variables.$color-white
  padding: 2rem
  border-radius: 10px
  width: 90%
  max-width: 400px
  text-align: center
  box-shadow: 0 5px 30px color.scale(variables.$color-black, $alpha: -70%)

  h2
    margin-bottom: 1rem
    color: variables.$color-dark
    @include typography.text-2xl

  p
    margin-bottom: 1.5rem
    color: variables.$color-gray
    @include typography.text-base

  .close-btn
    background-color: variables.$color-crimson-pink
    color: variables.$color-white
    border: none
    padding: 0.75rem 1.5rem
    border-radius: 5px
    cursor: pointer
    transition: background-color 0.3s ease
    @include typography.text-base

    &:hover
      background-color: color.scale(variables.$color-crimson-pink, $lightness: -20%)
</style>
