// OWNER: Web student 3
// Connects the buttons and lists on the page to the api functions.
// We use textContent (not innerHTML) so typed text can never run as code.

const statusPill = document.getElementById("status-pill");
const statusText = document.getElementById("status-text");
const teamList = document.getElementById("team-list");
const messageList = document.getElementById("message-list");
const form = document.getElementById("message-form");
const formNote = document.getElementById("form-note");

function setStatus(state, text) {
  statusPill.dataset.state = state; // "checking" | "online" | "offline"
  statusText.textContent = text;
}

async function checkBackend() {
  try {
    await api.getHealth();
    setStatus("online", "Backend connected");
  } catch (error) {
    setStatus("offline", "Backend not reachable. Is it running on " + API_BASE_URL + "?");
  }
}

async function loadTeam() {
  try {
    const { students } = await api.getStudents();
    teamList.replaceChildren();
    students.forEach((student) => {
      const item = document.createElement("li");
      const name = document.createElement("strong");
      name.textContent = student.name;
      const role = document.createElement("span");
      role.textContent = student.role;
      item.append(name, role);
      teamList.append(item);
    });
  } catch (error) {
    teamList.textContent = "Could not load the team. Start the backend and refresh.";
  }
}

async function loadMessages() {
  try {
    const { messages } = await api.getMessages();
    messageList.replaceChildren();
    if (messages.length === 0) {
      messageList.textContent = "No messages yet. Send the first one.";
      return;
    }
    messages.forEach((message) => {
      const item = document.createElement("li");
      const who = document.createElement("strong");
      who.textContent = message.name;
      const text = document.createElement("span");
      text.textContent = message.text;
      item.append(who, text);
      messageList.append(item);
    });
  } catch (error) {
    messageList.textContent = "Could not load messages.";
  }
}

form.addEventListener("submit", async (event) => {
  event.preventDefault(); // stop the page from reloading
  const name = form.elements.name.value;
  const text = form.elements.text.value;

  try {
    await api.sendMessage(name, text);
    form.reset();
    formNote.textContent = "Message sent.";
    await loadMessages();
  } catch (error) {
    formNote.textContent = error.message;
  }
});

checkBackend();
loadTeam();
loadMessages();
