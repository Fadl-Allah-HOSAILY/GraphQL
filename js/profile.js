import { formatXP } from "./formatXp.js";

const token = localStorage.getItem("token");

if (!token) {
  document.getElementById("error").textContent = "You are not logged in!";
  window.location.href = "index.html";
}

document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("token");
  window.location.href = "index.html";
});

const query = `
query {
  user {
    id
    login
    auditRatio
    totalDown
    totalUp
    success: audits_aggregate(where: { closureType: { _eq: succeeded } }) {
      aggregate { count }
    }
    failed: audits_aggregate(where: { closureType: { _eq: failed } }) {
      aggregate { count }
    }
  }
  totalXP: transaction_aggregate(
    where: { type: { _eq: "xp" }, event: { object: { name: { _eq: "Module" } } } }
  ) { aggregate { sum { amount } } }
  lvl: transaction_aggregate(
    where: { type: { _eq: "level" }, event: { object: { name: { _eq: "Module" } } } }
  ) { aggregate { max { amount } } }
  skills: transaction(
    where: { type: { _ilike: "%skill%" } }
    order_by: { amount: desc }
  ) { type amount }
}
`;

fetch("https://learn.zone01oujda.ma/api/graphql-engine/v1/graphql", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": "Bearer " + token
  },
  body: JSON.stringify({ query })
})
  .then(res => res.json())
  .then(data => {
    const user = data.data.user[0]
    console.log("user:", user);


    // ---- Welcome ----
    document.getElementById("welcomeText").textContent = "Welcome " + user.login;

    // ---- XP ----
    const totalXPBytes = data.data.totalXP.aggregate.sum?.amount || 0;
    document.getElementById("totalXP").textContent = formatXP(totalXPBytes);

    // ---- Level ----
    const currentLevel = data.data.lvl.aggregate.max?.amount || 0;
    document.getElementById("currentLevel").textContent = currentLevel;

    // ---- Skills Chart ----
    const skills = data.data.skills;
    const skillsType = {};

    for (let skill of skills) {
      if (!skillsType[skill.type] || skill.amount > skillsType[skill.type]) {
        skillsType[skill.type] = skill.amount;
      }
    }

    const skillsChart = document.getElementById("skillsChart");
    const svgNS = "http://www.w3.org/2000/svg";

    for (let skill in skillsType) {
      const skillDiv = document.createElement("div");
      skillDiv.classList.add("chart");

      const skillName = document.createElement("span");
      skillName.classList.add("skill-name");
      skillName.textContent = skill.replace("skill_", "") + ": " + `${skillsType[skill]}%`;
      skillDiv.appendChild(skillName);

      const svg = document.createElementNS(svgNS, "svg");
      svg.setAttribute("height", "100%");
      svg.setAttribute("width", "100%");

      const rect = document.createElementNS(svgNS, "rect");
      rect.setAttribute("x", 0);
      rect.setAttribute("y", 0);
      rect.setAttribute("height", "100%");
      rect.setAttribute("width", `${skillsType[skill]}%`);
      rect.setAttribute("fill", "#00bfff");
      rect.style.setProperty("--bar-width", `${skillsType[skill]}%`);

      svg.appendChild(rect);
      skillDiv.appendChild(svg);
      skillsChart.appendChild(skillDiv);
    }

    // ---- Audit Donut ----
    const successfulAudits = user.success.aggregate.count;
    const failedAudits = user.failed.aggregate.count;
    const totalAudit = successfulAudits + failedAudits;

    if (totalAudit > 0) {
      const successPercent = (successfulAudits / totalAudit) * 100;
      const failedPercent = (failedAudits / totalAudit) * 100;

      const radius = 90;
      const circumference = 2 * Math.PI * radius;

      const successCircle = document.getElementById("success");
      const failedCircle = document.getElementById("failed");

      // Portion visible et portion restante
      const successDash = (successPercent / 100) * circumference;
      const failedDash = (failedPercent / 100) * circumference;

      // Dasharray correct
      successCircle.setAttribute("stroke-dasharray", `${successDash} ${circumference - successDash}`);
      failedCircle.setAttribute("stroke-dasharray", `${failedDash} ${circumference - failedDash}`);

      // Décalage du cercle d'échec pour qu'il commence après succès
      failedCircle.setAttribute("stroke-dashoffset", `-${successDash}`);

      // Texte au centre
      document.getElementById("auditText").textContent = `Ratio :${user.auditRatio.toFixed(2)}`;

      const failedText = document.getElementById("fail");
      const validedText = document.getElementById("valided");
      const totalDown = document.getElementById("totalDown")
      const totalUp = document.getElementById("totalUp")
      failedText.textContent = `Failed: ${failedPercent.toFixed(2)}%`;
      validedText.textContent = `Succeeded: ${successPercent.toFixed(2)}%`;
      totalDown.textContent = `totalDown: ${formatXP(user.totalDown)}`;
      totalUp.textContent = `totalUp: ${formatXP(user.totalUp)}`;
    }


  })
  .catch(err => {
    console.error(err);
    document.getElementById("error").textContent = "Failed to load user data";
    window.location.href = "index.html";
  });