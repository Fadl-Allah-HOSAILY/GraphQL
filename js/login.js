
const form = document.getElementById("loginForm")

form.addEventListener("submit", function (event) {
    event.preventDefault()

    const username = document.getElementById("username").value
    const password = document.getElementById("password").value

    const credentials = btoa(username + ":" + password)

    fetch("https://learn.zone01oujda.ma/api/auth/signin", {
        method: "POST",
        headers: {
            "Authorization": "Basic " + credentials
        }
    })
        .then(response => {
            if (!response.ok) throw new Error("Invalid login")
            return response.json()
        })
        .then(data => {

            localStorage.setItem("token", data)
            console.log("token", data);
            

            window.location.href = "profile.html"
        })
        .catch(err => {
            document.getElementById("error").textContent = err.message
        })
})