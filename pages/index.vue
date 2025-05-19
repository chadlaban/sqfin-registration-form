<template>
  <RegistrationForm />
</template>

<script setup>
import RegistrationForm from "~/components/RegistrationForm.vue";

useHead({
  title: "Squared Financial - Registration Form Onboarding Technical",
  meta: [
    {
      name: "description",
      content: "This is a technical registration form test from SQ SEY Ltd.",
    },
    {
      property: "og:title",
      content: "Squared Financial - Registration Form Onboarding Technical",
    },
    {
      property: "og:description",
      content: "This is a technical registration form test from SQ SEY Ltd.",
    },
    { property: "og:type", content: "website" },
    { name: "viewport", content: "width=device-width, initial-scale=1" },
  ],
  link: [{ rel: "canonical", href: "" }],
});
</script>
