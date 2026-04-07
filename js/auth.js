export function checkAuth() {
  const token = localStorage.getItem("token");

  if (!token) {
    document.getElementById("error").textContent = "You are not logged in!";
    window.location.href = "index.html";
  }

  return token;
}

export function setupLogout() {
  document.getElementById("logoutBtn").addEventListener("click", () => {
    localStorage.removeItem("token");
    window.location.href = "index.html";
  });
}