import { checkAuth, setupLogout } from "./auth.js";
import { fetchUserData } from "./api.js";
import { displayUserInfo } from "./user.js";
import { renderSkills } from "./skills.js";
import { renderAudit } from "./audit.js";

async function initProfile() {
  try {
    const token = checkAuth();
    setupLogout();

    const data = await fetchUserData(token);

    const user = displayUserInfo(data);

    renderSkills(data.data.skills);
    renderAudit(user);

  } catch (err) {
    console.error(err);
    document.getElementById("error").textContent =
      "Failed to load user data";
    window.location.href = "index.html";
  }
}

initProfile();