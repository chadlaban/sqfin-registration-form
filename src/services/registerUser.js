// export async function registerUser(formData) {
//   try {
//     const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/users/new`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(formData),
//     });

//     if (!response.ok) {
//       const errorData = await response.json();
//       throw new Error(errorData.message);
//     }

//     return await response.json();
//   } catch (error) {
//     throw new Error(error.message);
//   }
// }

// ---------------------------------------------

//  Could not find base URL from documentation, made a request simulation instead for UX (loading spinner)

export async function registerUser(formData) {
  //   console.log("Sending form:", formData);

  // delay
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // success or failure
  const isSuccess = Math.random() > 0.3;

  if (isSuccess) {
    return {
      message: "Registration successful",
      user: {
        id: Math.floor(Math.random() * 1000),
        ...formData,
      },
    };
  } else {
    throw new Error("Simulated API error: Registration failed.");
  }
}
