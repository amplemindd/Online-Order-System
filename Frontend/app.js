// Home Page JavaScript

const fetchTeamBtn = document.getElementById("fetchTeamBtn");

const statusMessage = document.getElementById("statusMessage");

const teamContainer = document.getElementById("teamContainer");


fetchTeamBtn.addEventListener("click", async function () {

    statusMessage.textContent = "Fetching team details...";

    teamContainer.innerHTML = "";

    fetchTeamBtn.disabled = true;

    try {

        const data = await api.getTeam();

        statusMessage.textContent = data.message;

        data.members.forEach(function (member) {

            const card = document.createElement("div");

            card.className = "team-card";

            const name = document.createElement("h3");
            name.textContent = member.name;

            const role = document.createElement("p");
            role.textContent = member.role;

            card.appendChild(name);
            card.appendChild(role);

            teamContainer.appendChild(card);

        });

    } catch (error) {

        statusMessage.textContent =
            "Unable to fetch data: " + error.message;

    } finally {

        fetchTeamBtn.disabled = false;

    }

});