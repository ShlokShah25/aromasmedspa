const preloader = document.querySelector("#preloader");
const body = document.body;
const conciergeToggle = document.querySelector("[data-concierge-toggle]");
const conciergeClose = document.querySelector("[data-concierge-close]");
const conciergePanel = document.querySelector("#concierge-panel");
const conciergeMessages = document.querySelector("[data-concierge-messages]");
const conciergeForm = document.querySelector("[data-concierge-form]");
const conciergeInput = document.querySelector("#concierge-input");
const promptChips = Array.from(document.querySelectorAll("[data-prompt]"));
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const PRELOADER_EXIT_MS = 1720;
const PRELOADER_DONE_MS = 2140;

function finishPreloader() {
  body.classList.remove("is-preloading", "is-preload-exiting");
  body.classList.add("is-ready", "is-hero-reveal");

  if (preloader) {
    preloader.hidden = true;
  }
}

function startPreloader() {
  if (!preloader || prefersReducedMotion) {
    finishPreloader();
    return;
  }

  body.classList.add("is-preloading");

  window.setTimeout(() => {
    body.classList.add("is-preload-exiting", "is-hero-reveal");
  }, PRELOADER_EXIT_MS);

  window.setTimeout(() => {
    finishPreloader();
  }, PRELOADER_DONE_MS);
}

function appendMessage(content, role) {
  if (!conciergeMessages) {
    return;
  }

  const bubble = document.createElement("article");
  bubble.className = `chat-bubble chat-bubble--${role}`;
  bubble.textContent = content;
  conciergeMessages.appendChild(bubble);
  conciergeMessages.scrollTop = conciergeMessages.scrollHeight;
}

function getConciergeReply(message) {
  const normalized = message.toLowerCase();

  if (normalized.includes("jawline") || normalized.includes("definition")) {
    return "For elegant jawline definition, Hochstein MedSpa would typically guide you toward a tailored injectable plan using advanced neuromodulators or luxury fillers depending on structure, tension, and your desired level of refinement.";
  }

  if (normalized.includes("morpheus8") || normalized.includes("halo")) {
    return "Morpheus8 is often favored for tightening and deeper remodeling, while Halo is ideal for luminous resurfacing, pigment correction, and refined skin texture. A private consultation would determine which technology best fits your skin goals and social downtime.";
  }

  if (normalized.includes("private") || normalized.includes("vip")) {
    return "Absolutely. Hochstein MedSpa is designed around a private consultation experience. Leave your name and phone number, and the concierge team can route you to a discreet VIP scheduling path in Coconut Grove.";
  }

  if (normalized.includes("body") || normalized.includes("emsculpt") || normalized.includes("contouring")) {
    return "For body architecture, the concierge would typically recommend a private assessment to determine whether Emsculpt Neo or a more targeted contouring protocol is the best fit for your silhouette and timeline.";
  }

  return "Thank you. The AI Concierge can capture your preferences, treatment goals, and contact details so the Hochstein MedSpa team can follow up with a tailored recommendation and private consultation options.";
}

function openConcierge() {
  if (!conciergePanel || !conciergeToggle) {
    return;
  }

  conciergePanel.hidden = false;
  conciergeToggle.setAttribute("aria-expanded", "true");
}

function closeConcierge() {
  if (!conciergePanel || !conciergeToggle) {
    return;
  }

  conciergePanel.hidden = true;
  conciergeToggle.setAttribute("aria-expanded", "false");
}

function sendConciergeMessage(message) {
  const trimmed = message.trim();

  if (!trimmed) {
    return;
  }

  appendMessage(trimmed, "user");

  window.setTimeout(() => {
    appendMessage(getConciergeReply(trimmed), "assistant");
  }, 240);
}

startPreloader();

if (conciergeToggle) {
  conciergeToggle.addEventListener("click", () => {
    const isOpen = conciergeToggle.getAttribute("aria-expanded") === "true";

    if (isOpen) {
      closeConcierge();
    } else {
      openConcierge();
    }
  });
}

if (conciergeClose) {
  conciergeClose.addEventListener("click", closeConcierge);
}

promptChips.forEach((chip) => {
  chip.addEventListener("click", () => {
    openConcierge();
    sendConciergeMessage(chip.dataset.prompt || "");
  });
});

if (conciergeForm && conciergeInput) {
  conciergeForm.addEventListener("submit", (event) => {
    event.preventDefault();
    sendConciergeMessage(conciergeInput.value);
    conciergeInput.value = "";
    conciergeInput.focus();
  });
}
