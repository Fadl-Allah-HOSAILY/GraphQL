const token = localStorage.getItem("token")

if (!token) {
  document.getElementById("error").textContent = "You are not logged in!"
  window.location.href = "index.html"
}

document.getElementById("logoutBtn").addEventListener("click", () => {

  // delete token
  localStorage.removeItem("token")

  // redirect to login page
  window.location.href = "index.html"
})

const query = `
query {
  user {
    id
    login
  }

  totalXP: transaction_aggregate(
    where: { type: { _eq: "xp" }, event: { object: { name: { _eq: "Module" } } } }
  ) {
    aggregate {
      sum {
        amount
      }
    }
  }

  lvl: transaction_aggregate(
    where: { type: { _eq: "level" }, event: { object: { name: { _eq: "Module" } } } }
  ) {
    aggregate {
      max {
        amount
      }
    }
  }
  skills: transaction(
        where: { type: {_ilike: "%skill%"} }
        order_by: { amount: desc }
      ) {
        type
        amount
      }
}
`

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

    // USER
    const user = data.data.user[0]

    document.getElementById("welcomeText").textContent =
      "Welcome " + user.login

    // XP
    const totalXPBytes = data.data.totalXP.aggregate.sum.amount || 0

    let xpDisplay = ""

    if (totalXPBytes >= 1000000) {
      xpDisplay = (totalXPBytes / 1000000).toFixed(1) + " MB"
    } else {
      xpDisplay = (totalXPBytes / 1000).toFixed(1) + " KB"
    }

    document.getElementById("totalXP").textContent = xpDisplay

    // LEVEL
    const currentLevel = data.data.lvl.aggregate.max.amount || 0

    document.getElementById("currentLevel").textContent =
      currentLevel

    const skills = data.data.skills;

    const skillsType = {}
    for (let skill of skills) {
      if (skillsType[skill.type]) {
        if (skillsType[skill.type] < skill.amount) {
          skillsType[skill.type] = skill.amount
        }
      } else {
        skillsType[skill.type] = skill.amount
      }
    }
    console.log(skillsType);


    const skillsChart = document.getElementById("skillsChart")
    const svgNS = "http://www.w3.org/2000/svg";

    for (let skill in skillsType) {
      const skillDiv = document.createElement("div")
      skillDiv.classList.add("chart")

      // Wrap skill name in a span
      const skillName = document.createElement("span")
      skillName.classList.add("skill-name")
      skillName.textContent = skill.replace("skill_","")
      skillDiv.appendChild(skillName)

      const svg = document.createElementNS(svgNS, "svg");
      svg.setAttribute("height", "100%")
      svg.setAttribute("width", "100%")

      const rect = document.createElementNS(svgNS, "rect");
      rect.setAttribute("x", 0)
      rect.setAttribute("y", 0)
      rect.setAttribute("height", "100%")
      rect.setAttribute("width", `${skillsType[skill]}%`)
      rect.setAttribute("fill", "#00bfff")

      // set CSS variable for animation
      rect.style.setProperty('--bar-width', `${skillsType[skill]}%`)

      svg.appendChild(rect)
      skillDiv.appendChild(svg)
      skillsChart.appendChild(skillDiv)
    }
  })
  .catch(err => {
    document.getElementById("error").textContent = "Failed to load user data"
    window.location.href = "index.html"
  })