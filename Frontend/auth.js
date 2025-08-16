console.log("🔒 auth.js loaded");

const token = localStorage.getItem("token");
const publicPages = ["login.html", "register.html", "index.html"];

const currentPage = window.location.pathname.split("/").pop();
console.log("📄 Current page:", currentPage);
console.log("🪪 Token exists?", !!token);

if (!token && !publicPages.includes(currentPage)) {
  console.warn("🚨 Not logged in, redirecting to login.html");
  window.location.href = "login.html";
}
