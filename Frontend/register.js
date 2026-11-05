const form = document.getElementById("registerForm");
const message = document.getElementById("message");

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const firstName = document.getElementById("firstname").value.trim();
  const lastName = document.getElementById("lastname").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  if (!/^[A-Za-z]+$/.test(firstName) || !/^[A-Za-z]+$/.test(lastName)) {
    message.textContent = "First name aur last name mein sirf letters enter karein.";
    return;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    message.textContent = "Valid email enter karein.";
    return;
  }

  if (password.length < 8) {
    message.textContent = "Password kam se kam 8 characters ka hona chahiye.";
    return;
  }

  message.textContent = "Registering...";

  try {
    const response = await fetch("http://localhost:5000/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ firstName, lastName, email, password })
    });

    const result = await response.json();
    message.textContent = response.ok
      ? (result.message || "Registration successful.")
      : (result.message || "Registration failed.");
  } catch (error) {
    message.textContent = "Backend se connect nahi ho pa raha.";
  }
});