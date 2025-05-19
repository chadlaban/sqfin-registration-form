<template>
  <div class="registration-container">
    <NuxtImg
      src="/squaredfinancial-logo-dark-lg.png"
      alt="sqfin-logo"
      class="sqfin-logo"
    />
    <form @submit.prevent="validateForm">
      <div class="form-group">
        <label for="firstName">First Name</label>
        <input
          type="text"
          id="firstName"
          v-model="formData.firstName"
          placeholder="First Name"
          :class="{ error: hasError('firstName') }"
        />
        <p class="error-msg" :class="{ invisible: !hasError('firstName') }">
          {{ errors.firstName || " " }}
        </p>
      </div>

      <div class="form-group">
        <label for="lastName">Last Name</label>
        <input
          type="text"
          id="lastName"
          v-model="formData.lastName"
          placeholder="Last Name"
          :class="{ error: hasError('lastName') }"
        />
        <p class="error-msg" :class="{ invisible: !hasError('lastName') }">
          {{ errors.lastName || " " }}
        </p>
      </div>

      <div class="form-group">
        <label for="email">Email</label>
        <input
          type="email"
          id="email"
          v-model="formData.email"
          placeholder="Email"
          :class="{ error: hasError('email') }"
        />
        <p class="error-msg" :class="{ invisible: !hasError('email') }">
          {{ errors.email || " " }}
        </p>
      </div>

      <div class="form-group">
        <label for="password">Password</label>
        <input
          type="password"
          id="password"
          v-model="formData.password"
          placeholder="Password"
          :class="{ error: hasError('password') }"
        />
        <p class="error-msg" :class="{ invisible: !hasError('password') }">
          {{ errors.password || " " }}
        </p>
      </div>

      <div class="form-group">
        <label for="confirmPassword">Confirm Password</label>
        <input
          type="password"
          id="confirmPassword"
          v-model="formData.confirmPassword"
          placeholder="Confirm Password"
          :class="{ error: hasError('confirmPassword') }"
        />
        <p
          class="error-msg"
          :class="{ invisible: !hasError('confirmPassword') }"
        >
          {{ errors.confirmPassword || " " }}
        </p>
      </div>

      <div class="form-group autocomplete">
        <label for="country">Country</label>
        <input
          type="text"
          id="country"
          v-model="formData.country"
          @input="filterCountries"
          placeholder="Enter your country..."
          :class="{ error: hasError('country') }"
        />
        <ul
          v-if="filteredCountries.length && showSuggestions"
          class="suggestions"
        >
          <li
            v-for="(country, index) in filteredCountries"
            :key="index"
            @click="selectCountry(country)"
          >
            {{ country }}
          </li>
        </ul>
        <p class="error-msg" :class="{ invisible: !hasError('country') }">
          {{ errors.country || " " }}
        </p>
      </div>

      <div class="form-group">
        <label for="phoneNumber">Phone Number</label>
        <input
          type="text"
          id="phoneNumber"
          v-model="formData.phoneNumber"
          placeholder="Phone Number"
          :class="{ error: hasError('phoneNumber') }"
        />
        <p class="error-msg" :class="{ invisible: !hasError('phoneNumber') }">
          {{ errors.phoneNumber || " " }}
        </p>
      </div>

      <button
        type="submit"
        class="submit-btn"
        :class="{ loading: isLoading }"
        :disabled="hasErrors || isLoading"
      >
        <LoadingSpinner :isVisible="isLoading" />
        <span v-if="!isLoading">Register</span>
      </button>
    </form>

    <Modal
      v-if="showModal"
      :title="modalTitle"
      :message="modalMessage"
      @close="closeModal"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from "vue";
import { z } from "zod";
import {
  firstNameSchema,
  lastNameSchema,
  emailSchema,
  passwordSchema,
  confirmPasswordSchema,
  countrySchema,
  phoneNumberSchema,
  registrationSchema,
} from "@/schemas/registrationSchema";
import { countries } from "~/src/data/countries";
import Modal from "./Modal.vue";
import LoadingSpinner from "./LoadingSpinner.vue";
import { registerUser } from "~/src/services/registerUser";

// --- Reactive state ---

const formData = ref({
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirmPassword: "",
  country: "",
  phoneNumber: "",
});

const errors = ref<Record<string, string>>({});
const isLoading = ref(false);

const showModal = ref(false);
const modalTitle = ref("");
const modalMessage = ref("");

const filteredCountries = ref<string[]>([]);
const showSuggestions = ref(false);

// --- Computed properties ---

const hasErrors = computed(() => Object.keys(errors.value).length > 0);

// --- Field schemas for live validation ---

const fieldSchemas = {
  firstName: firstNameSchema,
  lastName: lastNameSchema,
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: confirmPasswordSchema,
  country: countrySchema,
  phoneNumber: phoneNumberSchema,
};

// --- Functions ---

function hasError(field: string) {
  return !!errors.value[field];
}

function filterCountries() {
  const query = formData.value.country.toLowerCase();
  if (query.length) {
    filteredCountries.value = countries.filter((country) =>
      country.toLowerCase().includes(query)
    );
    showSuggestions.value = true;
  } else {
    filteredCountries.value = [];
    showSuggestions.value = false;
  }
}

function selectCountry(country: string) {
  formData.value.country = country;
  filteredCountries.value = [];
  showSuggestions.value = false;
}

function closeModal() {
  showModal.value = false;
}

async function validateForm() {
  errors.value = {}; // reset errors

  try {
    isLoading.value = true;

    registrationSchema.parse(formData.value);
    await registerUser(formData.value);

    modalTitle.value = "Registration Successful";
    modalMessage.value = "You have been successfully registered!";
    showModal.value = true;
  } catch (error) {
    if (error instanceof z.ZodError) {
      error.errors.forEach((err) => {
        if (err.path.length) {
          errors.value[err.path[0]] = err.message;
        }
      });
    } else {
      modalTitle.value = "Registration Failed";
      modalMessage.value =
        "An error occurred while trying to register. Please try again later.";
      showModal.value = true;
    }
  } finally {
    isLoading.value = false;
  }
}

// --- Watchers for live validation ---

Object.keys(fieldSchemas).forEach((key) => {
  watch(
    () => formData.value[key as keyof typeof formData.value],
    (newValue) => {
      try {
        fieldSchemas[key as keyof typeof fieldSchemas].parse(newValue);
        delete errors.value[key]; // clear error
      } catch (err) {
        if (err instanceof z.ZodError) {
          errors.value[key] = err.errors[0].message;
        }
      }
    }
  );
});
</script>

<style scoped lang="sass">
@use "~/assets/styles/variables"
@use "~/assets/styles/typography" as typography
@use "sass:color"

.registration-container
  max-width: 500px
  margin: 3rem auto
  padding: 2.5rem
  background-color: variables.$color-white
  border-radius: 15px
  box-shadow: 0 15px 40px color.scale(variables.$color-black, $alpha: -85%)
  box-sizing: border-box
  text-align: center

  .sqfin-logo
    max-width: 250px
    margin-bottom: 1.5rem

  form
    display: flex
    flex-direction: column

    .form-group
      text-align: left

      label
        display: block
        margin-bottom: 0.5rem
        font-weight: 600
        color: variables.$color-dark
        @include typography.text-sm

      input, select
        width: 410px
        padding: 0.5rem 0.75rem
        font-size: variables.$font-size-sm
        border: 1px solid variables.$color-light-gray
        border-radius: 8px
        box-sizing: border-box
        transition: border-color 0.3s, box-shadow 0.3s

        &:focus
          border-color: variables.$color-deep-blue
          box-shadow: 0 0 0 4px color.scale(variables.$color-deep-blue, $alpha: -80%)
          outline: none

    .submit-btn
      width: 100%
      padding: 0.875rem
      background-color: variables.$color-crimson-pink
      color: variables.$color-white
      border: none
      border-radius: 8px
      font-size: variables.$font-size-lg
      cursor: pointer
      transition: background-color 0.3s, transform 0.2s
      position: relative
      display: inline-flex
      justify-content: center
      align-items: center

      &:hover
        background-color: color.scale(variables.$color-american-pink, $lightness: -20%)
        transform: scale(1.02)

      &:active
        transform: scale(0.98)

      &:disabled
        background-color: variables.$color-light-gray
        cursor: not-allowed
        color: variables.$color-gray

.autocomplete
  position: relative

  .suggestions
    position: absolute
    width: 100%
    max-height: 200px
    overflow-y: auto
    background-color: variables.$color-alt-light-gray
    border: 1px solid variables.$color-light-gray
    border-radius: 5px
    margin-top: 5px
    padding: 0
    list-style: none
    z-index: 1000

    li
      padding: 0.5rem
      cursor: pointer

      &:hover
        background-color: variables.$color-deep-blue
        color: variables.$color-white

.error
  border-color: variables.$color-crimson-pink
  box-shadow: 0 0 8px 2px color.scale(variables.$color-crimson-pink, $alpha: -70%)
  outline: none

.invisible
  visibility: hidden
  height: 1rem
  margin-top: 0.25rem

.error-msg
  color: variables.$color-crimson-pink
  font-size: variables.$font-size-sm
  margin-top: 0.25rem
</style>
