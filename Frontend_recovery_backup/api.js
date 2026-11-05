// OWNER: Web student 2
// All talking to the backend happens here. The page (app.js) never
// calls fetch() directly. It only uses the functions in "api".
// Every function matches an endpoint in docs/api.md.

async function request(path, options) {
  const response = await fetch(API_BASE_URL + path, options);
  const data = await response.json();

  if (!response.ok) {
    // The backend sends { error: "..." } when something is wrong.
    throw new Error(data.error || "Request failed");
  }
  return data;
}

const api = {
  getHealth: () => request("/api/health"),
  getStudents: () => request("/api/students"),
  getMessages: () => request("/api/messages"),
  sendMessage: (name, text) =>
    request("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, text }),
    }),
};
