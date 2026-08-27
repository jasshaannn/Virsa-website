import { firebaseConfig } from "./firebase-config.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
  getFirestore,
  collection,
  getDocs,
  query,
  orderBy
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const loginScreen = document.getElementById("loginScreen");
const dashboard = document.getElementById("dashboard");
const loginForm = document.getElementById("loginForm");
const loginError = document.getElementById("loginError");
const entriesBody = document.getElementById("entriesBody");
const entryCount = document.getElementById("entryCount");
const emptyState = document.getElementById("emptyState");
const searchBox = document.getElementById("searchBox");
const exportBtn = document.getElementById("exportBtn");
const logoutBtn = document.getElementById("logoutBtn");

let allEntries = [];

// ---------- Auth ----------
onAuthStateChanged(auth, (user) => {
  if (user) {
    loginScreen.style.display = "none";
    dashboard.style.display = "block";
    loadEntries();
  } else {
    loginScreen.style.display = "flex";
    dashboard.style.display = "none";
  }
});

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  loginError.textContent = "";
  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value;
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (err) {
    loginError.textContent = "Invalid email or password.";
  }
});

logoutBtn.addEventListener("click", () => signOut(auth));

// ---------- Load entries ----------
async function loadEntries() {
  entryCount.textContent = "Loading registrations...";
  try {
    const q = query(collection(db, "registrations"), orderBy("submittedAt", "desc"));
    const snapshot = await getDocs(q);
    allEntries = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    renderEntries(allEntries);
  } catch (err) {
    console.error(err);
    entryCount.textContent = "Failed to load registrations. Check console for details.";
  }
}

function renderEntries(entries) {
  entriesBody.innerHTML = "";
  entryCount.textContent = `${entries.length} registration${entries.length === 1 ? "" : "s"}`;
  emptyState.style.display = entries.length === 0 ? "block" : "none";

  entries.forEach((entry, i) => {
    const tr = document.createElement("tr");
    const date = entry.submittedAt && entry.submittedAt.toDate
      ? entry.submittedAt.toDate().toLocaleString()
      : "—";
    tr.innerHTML = `
      <td>${i + 1}</td>
      <td>${escapeHtml(entry.fullName)}</td>
      <td>${escapeHtml(entry.rollNumber)}</td>
      <td>${escapeHtml(entry.email)}</td>
      <td>${escapeHtml(entry.phone)}</td>
      <td>${escapeHtml(entry.batch)}</td>
      <td class="reason-cell">${escapeHtml(entry.reason)}</td>
      <td>${date}</td>
    `;
    entriesBody.appendChild(tr);
  });
}

function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

// ---------- Search ----------
searchBox.addEventListener("input", () => {
  const term = searchBox.value.toLowerCase();
  const filtered = allEntries.filter((e) =>
    [e.fullName, e.rollNumber, e.email, e.phone].some((field) =>
      (field || "").toLowerCase().includes(term)
    )
  );
  renderEntries(filtered);
});

// ---------- CSV export ----------
exportBtn.addEventListener("click", () => {
  if (allEntries.length === 0) return;
  const headers = ["Full Name", "Roll Number", "Email", "Phone", "Batch", "Reason", "Submitted"];
  const rows = allEntries.map((e) => [
    e.fullName, e.rollNumber, e.email, e.phone, e.batch, e.reason,
    e.submittedAt && e.submittedAt.toDate ? e.submittedAt.toDate().toLocaleString() : ""
  ]);

  const csvContent = [headers, ...rows]
    .map((row) => row.map((cell) => `"${String(cell || "").replaceAll('"', '""')}"`).join(","))
    .join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `virsa-registrations-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
});
