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
{
  user {
    id
    login
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

        const user = data.data.user[0]

        document.getElementById("welcomeText").textContent =
            "Welcome " + user.login
    })
    .catch(err => {
        document.getElementById("error").textContent = "Failed to load user data"
        window.location.href = "index.html"
    })


// Combined GraphQL query to get total XP and current level
const xpAndLevelQuery = `
query {
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
}
`;

fetch("https://learn.zone01oujda.ma/api/graphql-engine/v1/graphql", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": "Bearer " + token
  },
  body: JSON.stringify({ query: xpAndLevelQuery })
})
  .then(res => res.json())
  .then(data => {
    // Extract values
    const totalXPBytes = data.data.totalXP.aggregate.sum.amount || 0;
    const currentLevel = data.data.lvl.aggregate.max.amount || 0;

    // Convert XP to KB, and divide by 3 to match platform display (as before)
    const totalXPinKB = (totalXPBytes / 1000);

    // Display in your page
    document.getElementById("totalXP").textContent = totalXPinKB.toFixed(1) + " KB";
    document.getElementById("currentLevel").textContent = currentLevel;
  })
  .catch(err => {
    document.getElementById("error").textContent = "Failed to load user data";
    window.location.href = "index.html";
  });