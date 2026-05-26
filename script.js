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
    return "Botox pricing is usually customized by treatment plan, but Beauty Bank-style pricing on Aromas' public offers starts around $9 to $10 per unit. Reply with your name, preferred location, and area of concern to request a tailored quote.";
  }

  if (normalized.includes("morpheus8") || normalized.includes("downtime")) {
    return "Morpheus8 typically has light downtime such as redness, warmth, and texture for a few days, although exact recovery depends on treatment depth and skin goals. I can have the team follow up with a personalized prep and recovery guide.";
  }

  if (normalized.includes("lip filler") || normalized.includes("which location")) {
    return `Lip filler consultations can be booked at any Aromas office, and ${locationLabels[selectedLocation]} is currently selected for you. Share your name and phone number here and the team can match you with the best injector availability.`;
  }

  return `Thanks. This is where the AI concierge would capture your message, preferred location (${locationLabels[selectedLocation]}), and contact details for 24/7 lead routing. Leave your name + phone number and the front desk can follow up.`;
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
