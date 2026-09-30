/**
 * Scroll Market Landing Page Interactivity
 * Matte & Warm Cream Front-end Logic
 */

// Configuration object - Central place to customize contact data
const CONFIG = {
  // Replace with the owner's WhatsApp number (country code + number without plus or spaces)
  whatsappNumber: "5492995238355",
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
  const sumEstimate = document.getElementById("sumEstimate");
  const estimateNote = document.getElementById("estimateNote");

  // State object matching "Licencia de Por Vida con 5 días de prueba gratis"
  const state = {
    software: "Software Scroll Market: Licencia de Por Vida + 5 días de prueba",
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
        icon.classList.remove("text-[#be185d]");
        icon.classList.add("text-[#a8a29e]");
      }
    });

    selectedElement.classList.add("selected");
    
    const activeIcon = selectedElement.querySelector(".check-indicator");
    if (activeIcon) {
      activeIcon.setAttribute("data-lucide", "check-circle-2");
      activeIcon.classList.remove("text-[#a8a29e]");
      activeIcon.classList.add("text-[#be185d]");
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
        chkWrapper.classList.add("border-[#be185d]", "bg-[#fdf2f4]");
        if (!state.addons.includes(addonName)) {
          state.addons.push(addonName);
        }
      } else {
        chkWrapper.classList.remove("border-[#be185d]", "bg-[#fdf2f4]");
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

    const estimate = getPriceEstimate();
    if (sumEstimate) sumEstimate.textContent = estimate.amount;
    if (estimateNote) estimateNote.textContent = estimate.detail;
  }

  function getPriceEstimate() {
    const softwareChoice = document.querySelector('input[name="soft_plan"]:checked')?.value;
    const printerChoice = document.querySelector('input[name="printer_choice"]:checked')?.value;
    const scannerChoice = document.querySelector('input[name="scanner_choice"]:checked')?.value;
    const pcChoice = document.querySelector('input[name="pc_choice"]:checked')?.value;
    const hasAddons = state.addons.length > 0;

    if (
      softwareChoice === "definitiva" &&
      printerChoice === "none" &&
      scannerChoice === "none" &&
      pcChoice === "none" &&
      !hasAddons
    ) {
      return {
        amount: "$90.000",
        detail: "Disponible en cuotas; consultá opciones. Ya tenés PC, impresora y lector.",
      };
    }

    if (
      softwareChoice === "definitiva" &&
      ["80mm", "58mm"].includes(printerChoice) &&
      ["mano_usb", "mesa", "movible"].includes(scannerChoice) &&
      pcChoice === "none" &&
      !hasAddons
    ) {
      return {
        amount: "$250.000 a $300.000",
        detail: "Rango del Combo Starter; varía según la impresora y el lector. Disponible en cuotas.",
      };
    }

    return {
      amount: "A cotizar",
      detail: "Consultá el precio final y las opciones de pago en cuotas por WhatsApp.",
    };
  }

  // Generate WhatsApp text when clicking button
  if (sendQuoteBtn) {
    sendQuoteBtn.addEventListener("click", () => {
      const estimate = getPriceEstimate();
      const messageParts = [
        "¡Hola Scroll Market! 🛒 Configuré mi combo en la web y quiero consultar por la prueba gratis de 5 días:",
        "",
        `📌 *Software:* ${state.software}`,
        `🖨️ *Impresora:* ${state.printer}`,
        `📟 *Lector:* ${state.scanner}`,
        `💻 *Equipo PC:* ${state.pc}`,
        `💰 *Precio estimado:* ${estimate.amount}`,
        estimate.detail,
      ];

      if (state.addons.length > 0) {
        messageParts.push(`➕ *Adicionales:* ${state.addons.join(" + ")}`);
      }

      messageParts.push("", "¿Podrían confirmarme el presupuesto, el envío estimado de 3 a 7 días y cómo activar la prueba? También quisiera consultar por los medios de pago (tarjeta o Mercado Pago) y personalizar el software y el combo para mi local. ¡Gracias!");

      const finalUrl = `https://wa.me/${CONFIG.whatsappNumber}?${new URLSearchParams({ text: messageParts.join("\n") })}`;
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
  const allWhatsAppLinks = document.querySelectorAll('a[href*="wa.me/"]');
  allWhatsAppLinks.forEach((a) => {
    const whatsappUrl = new URL(a.href);
    whatsappUrl.pathname = `/${CONFIG.whatsappNumber}`;
    a.href = whatsappUrl.toString();
  });
}
