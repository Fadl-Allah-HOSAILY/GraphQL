const token = localStorage.getItem("token")

if (!token) {
    document.getElementById("error").textContent = "You are not logged in!"
    window.location.href = "index.html"
}

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
    console.log(data)
    const user = data.data.user[0]
    document.getElementById("userInfo").innerHTML = `
        <p>ID: ${user.id}</p>
        <p>Login: ${user.login}</p>
    `
})
.catch(err => {
    document.getElementById("error").textContent = "Failed to load user data"
    window.location.href = "index.html"
})