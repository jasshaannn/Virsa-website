import { firebaseConfig } from "./firebase-config.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

document.addEventListener("DOMContentLoaded", () => {
  // ---------- Event carousel ----------
  const slider = document.getElementById("eventSlider");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  const scrollAmount = 300;

  if (nextBtn && prevBtn && slider) {
    nextBtn.addEventListener("click", () => {
      slider.scrollBy({ left: scrollAmount, behavior: "smooth" });
    });
    prevBtn.addEventListener("click", () => {
      slider.scrollBy({ left: -scrollAmount, behavior: "smooth" });
    });
  }

  // ---------- Registration form ----------
  const form = document.querySelector(".virsa-form");
  const submitBtn = form ? form.querySelector(".submit-btn") : null;
  const statusMsg = document.getElementById("formStatus");

  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const data = {
        batch: form.batch.value.trim(),
        fullName: form.fullName.value.trim(),
        rollNumber: form.rollNumber.value.trim(),
        email: form.email.value.trim(),
        phone: form.phone.value.trim(),
        reason: form.reason.value.trim(),
        submittedAt: serverTimestamp()
      };

      submitBtn.disabled = true;
      submitBtn.textContent = "Submitting...";
      showStatus("", null);

      try {
        await addDoc(collection(db, "registrations"), data);
        form.reset();
        form.batch.value = "2030"; // restore readonly default
        showStatus("✅ Registration submitted successfully! We'll be in touch.", "success");
      } catch (err) {
        console.error("Error saving registration:", err);
        showStatus("❌ Something went wrong. Please try again in a moment.", "error");
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = "Register Now";
      }
    });
  }

  function showStatus(text, type) {
    if (!statusMsg) return;
    statusMsg.textContent = text;
    statusMsg.className = "form-status" + (type ? ` ${type}` : "");
  }
});
