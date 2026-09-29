/**
 * Scroll Market Landing Page Interactivity
 * Professional Front-end Application logic
 */

// Configuration object - Central place to customize contact data
const CONFIG = {
  // Replace with the owner's WhatsApp number (country code + number without plus or spaces)
  whatsappNumber: "5491100000000",
  defaultCurrencySymbol: "$",
};

document.addEventListener("DOMContentLoaded", () => {
  initMobileMenu();
  initConfigurator();
  initFAQAccordion();
  initWhatsAppButton();
});

/**
 * Mobile Navigation Menu handling
 */
function initMobileMenu() {
  const menuBtn = document.getElementById("mobileMenuBtn");
  const mobileMenu = document.getElementById("mobileMenu");
  const navLinks = document.querySelectorAll(".mobile-nav-link");

  if (!menuBtn || !mobileMenu) return;

  menuBtn.addEventListener("click", () => {
    mobileMenu.classList.toggle("hidden");
  });

  // Close mobile menu when clicking any nav item
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      mobileMenu.classList.add("hidden");
    });
  });
}

/**
 * Interactive Quote Builder & Real-time Hardware Configurator
 */
function initConfigurator() {
  const configOptions = document.querySelectorAll(".config-option");
  const checkboxOptions = document.querySelectorAll(".checkbox-option");
  const sendQuoteBtn = document.getElementById("sendQuoteBtn");

  // Summary DOM elements
  const sumSoft = document.getElementById("sumSoft");
  const sumPrinter = document.getElementById("sumPrinter");
  const sumScanner = document.getElementById("sumScanner");
  const sumPC = document.getElementById("sumPC");
  const sumAddons = document.getElementById("sumAddons");
  const sumAddonsContainer = document.getElementById("sumAddonsContainer");

  // State object matching "Licencia de Por Vida con 14 días de prueba gratis"
  const state = {
    software: "Software Scroll Market: Licencia de Por Vida (Pago Único) + 14 días de prueba gratis",
    printer: "Impresora Térmica 80mm c/ Corte Automático",
    scanner: "Lector de Mesa Fijo Omnidireccional 2D (Escaneo 360°)",
    pc: "Sin PC (Uso mi propia Computadora o Notebook)",
    addons: [],
  };

  function updateVisualSelection(groupName, selectedElement) {
    const groupItems = document.querySelectorAll(`.config-option[data-group="${groupName}"]`);
    groupItems.forEach((el) => {
      el.classList.remove("selected");
      
      const icon = el.querySelector(".check-indicator");
      if (icon) {
        icon.setAttribute("data-lucide", "circle");
        icon.classList.remove("text-rose-400");
        icon.classList.add("text-slate-600");
      }
    });

    selectedElement.classList.add("selected");
    
    const activeIcon = selectedElement.querySelector(".check-indicator");
    if (activeIcon) {
      activeIcon.setAttribute("data-lucide", "check-circle-2");
      activeIcon.classList.remove("text-slate-600");
      activeIcon.classList.add("text-rose-400");
    }

    if (window.lucide) {
      lucide.createIcons();
    }
  }

  // Handle Radio Config Options
  configOptions.forEach((option) => {
    option.addEventListener("click", () => {
      const radio = option.querySelector('input[type="radio"]');
      if (radio) radio.checked = true;

      const group = option.getAttribute("data-group");
      const name = option.getAttribute("data-name");

      if (group && name) {
        state[group] = name;
        updateVisualSelection(group, option);
        renderSummary();
      }
    });
  });

  // Handle Checkbox Addons
  checkboxOptions.forEach((chkWrapper) => {
    chkWrapper.addEventListener("click", (e) => {
      const checkbox = chkWrapper.querySelector('input[type="checkbox"]');
      if (e.target !== checkbox) {
        checkbox.checked = !checkbox.checked;
      }

      const addonName = chkWrapper.getAttribute("data-name");

      if (checkbox.checked) {
        chkWrapper.classList.add("border-rose-500/60", "bg-rose-500/10");
        if (!state.addons.includes(addonName)) {
          state.addons.push(addonName);
        }
      } else {
        chkWrapper.classList.remove("border-rose-500/60", "bg-rose-500/10");
        state.addons = state.addons.filter((item) => item !== addonName);
      }

      renderSummary();
    });
  });

  function renderSummary() {
    if (sumSoft) sumSoft.textContent = state.software;
    if (sumPrinter) sumPrinter.textContent = state.printer;
    if (sumScanner) sumScanner.textContent = state.scanner;
    if (sumPC) sumPC.textContent = state.pc;

    if (sumAddons && sumAddonsContainer) {
      if (state.addons.length > 0) {
        sumAddonsContainer.classList.remove("hidden");
        sumAddons.textContent = state.addons.join(", ");
      } else {
        sumAddonsContainer.classList.add("hidden");
        sumAddons.textContent = "-";
      }
    }
  }

  // Generate WhatsApp text when clicking button
  if (sendQuoteBtn) {
    sendQuoteBtn.addEventListener("click", () => {
      let message = `¡Hola Scroll Market! 🛒 Acabo de configurar mi combo en la web y deseo activar mi prueba gratis de 14 días y consultar cotización:%0A%0A`;
      message += `📌 *Software:* ${state.software}%0A`;
      message += `🖨️ *Impresora:* ${state.printer}%0A`;
      message += `📟 *Lector:* ${state.scanner}%0A`;
      message += `💻 *Equipo PC:* ${state.pc}%0A`;

      if (state.addons.length > 0) {
        message += `➕ *Adicionales:* ${state.addons.join(" + ")}%0A`;
      }

      message += `%0A¿Podrían brindarme el presupuesto, tiempos de entrega y cómo activamos los 14 días de prueba? ¡Muchas gracias!`;

      const finalUrl = `https://wa.me/${CONFIG.whatsappNumber}?text=${message}`;
      window.open(finalUrl, "_blank");
    });
  }

  renderSummary();
}

/**
 * FAQ Accordion Interaction
 */
function initFAQAccordion() {
  const triggers = document.querySelectorAll(".faq-trigger");

  triggers.forEach((trigger) => {
    trigger.addEventListener("click", () => {
      const parent = trigger.closest(".faq-item");
      const content = parent.querySelector(".faq-content");
      const icon = trigger.querySelector("i, svg");

      const isOpen = !content.classList.contains("hidden");

      // Close all others
      document.querySelectorAll(".faq-content").forEach((c) => c.classList.add("hidden"));
      document.querySelectorAll(".faq-trigger i, .faq-trigger svg").forEach((ic) => {
        ic.style.transform = "rotate(0deg)";
      });

      if (!isOpen) {
        content.classList.remove("hidden");
        if (icon) icon.style.transform = "rotate(180deg)";
      }
    });
  });
}

/**
 * Update all WhatsApp URLs with the configured phone number
 */
function initWhatsAppButton() {
  const allWhatsAppLinks = document.querySelectorAll('a[href*="wa.me/5491100000000"]');
  allWhatsAppLinks.forEach((a) => {
    a.href = a.href.replace("5491100000000", CONFIG.whatsappNumber);
  });
}
