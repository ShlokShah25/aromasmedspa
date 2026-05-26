const BOOKING_LINKS = {
  // Replace these public-location placeholders with the exact Zenoti URLs before launch.
  default: "https://aromaslaser.com/contact/",
  doral: "https://aromaslaser.com/doral-location/",
  kendall: "https://aromaslaser.com/kendall-location/",
  weston: "https://aromaslaser.com/weston-location/"
};

const locationLabels = {
  doral: "Doral",
  kendall: "Kendall",
  weston: "Weston"
};

const tabs = Array.from(document.querySelectorAll("[data-tab]"));
const navTabLinks = Array.from(document.querySelectorAll("[data-tab-target]"));
const panels = Array.from(document.querySelectorAll(".service-panel"));
const locationCards = Array.from(document.querySelectorAll("[data-location-card]"));
const selectedLocationLabels = Array.from(
  document.querySelectorAll("[data-selected-location-label]")
);
const bookingAnchors = Array.from(document.querySelectorAll("[data-booking-key]"));
const mobileBookingButton = document.querySelector("[data-mobile-booking]");
const conciergeToggle = document.querySelector("[data-concierge-toggle]");
const conciergeClose = document.querySelector("[data-concierge-close]");
const conciergePanel = document.querySelector(".concierge-panel");
const conciergeMessages = document.querySelector("[data-concierge-messages]");
const conciergeForm = document.querySelector("[data-concierge-form]");
const conciergeInput = document.querySelector("#concierge-input");
const promptChips = Array.from(document.querySelectorAll("[data-prompt]"));
const preloader = document.querySelector("#preloader");
const body = document.body;
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

let selectedLocation = "doral";
const PRELOADER_EXIT_MS = 2500;
const PRELOADER_DONE_MS = 2980;

function finishPreloader() {
  if (!body) {
    return;
  }

  body.classList.remove("is-preloading", "is-preload-exiting");
  body.classList.add("is-ready", "is-hero-reveal");

  if (preloader) {
    preloader.hidden = true;
  }
}

function startPreloader() {
  if (!body) {
    return;
  }

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

function applyBookingLinks() {
  bookingAnchors.forEach((anchor) => {
    const key = anchor.dataset.bookingKey || "default";
    anchor.href = BOOKING_LINKS[key] || BOOKING_LINKS.default;
    anchor.target = "_blank";
    anchor.rel = "noreferrer";
  });
}

function updateSelectedLocation(location) {
  if (!locationLabels[location]) {
    return;
  }

  selectedLocation = location;

  locationCards.forEach((card) => {
    card.classList.toggle("is-selected", card.dataset.location === location);
  });

  selectedLocationLabels.forEach((label) => {
    label.textContent = locationLabels[location];
  });

  if (mobileBookingButton) {
    mobileBookingButton.href = BOOKING_LINKS[location] || BOOKING_LINKS.default;
    mobileBookingButton.dataset.bookingKey = location;
  }
}

function activateTab(tabName) {
  tabs.forEach((tab) => {
    const isActive = tab.dataset.tab === tabName;
    tab.classList.toggle("is-active", isActive);
    tab.setAttribute("aria-selected", String(isActive));
  });

  panels.forEach((panel) => {
    const shouldShow = panel.id === `panel-${tabName}`;
    panel.classList.toggle("is-active", shouldShow);
    panel.hidden = !shouldShow;
  });
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

  if (normalized.includes("botox")) {
    return "At Aromas Medspa, Botox pricing is tailored to your treatment plan, with Beauty Bank pricing publicly promoted from about $9 to $10 per unit. Share your preferred location and your name + phone number, and the team can help you schedule a personalized consultation.";
  }

  if (normalized.includes("morpheus8") || normalized.includes("downtime")) {
    return "Morpheus8 usually involves a few days of redness, warmth, and mild texture while the skin renews, though recovery varies based on treatment depth and your goals. If you would like, Aromas Medspa can follow up with guidance on downtime, prep, and the best location for your consultation.";
  }

  if (normalized.includes("fotona") || normalized.includes("4d")) {
    return "Fotona 4D is a wonderful option for clients who want smoother texture, firmer skin, and a brighter, more refined look without surgery. Share your age range, primary skin concerns, and preferred Aromas Medspa location, and the team can recommend whether Fotona 4D is the right fit.";
  }

  if (normalized.includes("lip filler") || normalized.includes("which location")) {
    return `Lip filler consultations are available at every Aromas Medspa location, and ${locationLabels[selectedLocation]} is currently selected for you. Leave your name and phone number here, and the team can help match you with the right injector and the soonest availability.`;
  }

  return `Thank you for reaching out to Aromas Medspa. I can note your preferred location (${locationLabels[selectedLocation]}) and pass along your details so the team can follow up with treatment guidance, availability, and next steps.`;
}

function sendConciergeMessage(message) {
  const trimmed = message.trim();

  if (!trimmed) {
    return;
  }

  appendMessage(trimmed, "user");

  window.setTimeout(() => {
    appendMessage(getConciergeReply(trimmed), "assistant");
  }, 280);
}

function openConcierge() {
  if (!conciergePanel || !conciergeToggle) {
    return;
  }

  conciergePanel.hidden = false;
  conciergeToggle.setAttribute("aria-expanded", "true");
}

function closeConciergePanel() {
  if (!conciergePanel || !conciergeToggle) {
    return;
  }

  conciergePanel.hidden = true;
  conciergeToggle.setAttribute("aria-expanded", "false");
}

startPreloader();
applyBookingLinks();
updateSelectedLocation(selectedLocation);
activateTab("injectables");

tabs.forEach((tab) => {
  tab.addEventListener("click", () => activateTab(tab.dataset.tab));
});

navTabLinks.forEach((link) => {
  link.addEventListener("click", () => {
    const targetTab = link.dataset.tabTarget;

    if (targetTab) {
      activateTab(targetTab);
    }
  });
});

locationCards.forEach((card) => {
  const updateFromCard = () => updateSelectedLocation(card.dataset.location);

  card.addEventListener("click", updateFromCard);

  card.querySelectorAll("a").forEach((anchor) => {
    anchor.addEventListener("click", () => updateFromCard());
  });
});

if (conciergeToggle) {
  conciergeToggle.addEventListener("click", () => {
    const isOpen = conciergeToggle.getAttribute("aria-expanded") === "true";
    if (isOpen) {
      closeConciergePanel();
    } else {
      openConcierge();
    }
  });
}

if (conciergeClose) {
  conciergeClose.addEventListener("click", closeConciergePanel);
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
