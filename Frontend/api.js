// All frontend API requests are handled here.

async function request(path, options = {}) {

    const response = await fetch(API_BASE_URL + path, options);

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || "Request failed");
    }

    return data;
}

const api = {

    // Get backend health
    getHealth: () => request("/api/health"),

    // Get team details
    getTeam: () => request("/api/team")

};