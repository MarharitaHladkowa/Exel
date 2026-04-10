/**
 * Project: Excel Pro Webinar Landing Page
 * Task: Recruitment Assignment for GoIT
 */

document.addEventListener("DOMContentLoaded", () => {
  // --- 1. ИНИЦИАЛИЗАЦИЯ ФОРМ ИЗ ТЕМПЛЕЙТА ---
  const template = document.getElementById("form-template");
  const mainSlot = document.getElementById("main-form-slot");
  const modalSlot = document.getElementById("modal-form-slot");

  if (template) {
    // Рендерим полную форму в основной блок (для десктопа)
    if (mainSlot) mainSlot.appendChild(template.content.cloneNode(true));
    // Рендерим полную форму в модалку (она будет ждать открытия)
    if (modalSlot) modalSlot.appendChild(template.content.cloneNode(true));
  }

  // --- 2. ЛОГИКА МОДАЛЬНОГО ОКНА ---
  const modal = document.querySelector(".modal-overlay");
  const openBtn = document.getElementById("openModalBtn");
  const closeBtn = document.getElementById("closeBtn");

  if (openBtn && modal) {
    openBtn.onclick = (e) => {
      e.preventDefault();
      console.log("Кнопка нажата");
      modal.style.display = "flex";
      document.body.style.overflow = "hidden";
    };
  }

  if (closeBtn && modal) {
    closeBtn.onclick = () => {
      modal.style.display = "none";
      document.body.style.overflow = "auto";
    };
  }
  // --- 3. ДИНАМИЧЕСКИЙ ТАЙМЕР (localStorage) ---
  function initTimer() {
    const TIMER_KEY = "goit_webinar_deadline";
    let deadline = localStorage.getItem(TIMER_KEY);

    if (!deadline) {
      deadline = new Date().getTime() + 24 * 60 * 60 * 1000;
      localStorage.setItem(TIMER_KEY, deadline);
    }

    window.timerInterval = setInterval(() => {
      const diff = deadline - new Date().getTime();

      if (diff <= 0) {
        clearInterval(window.timerInterval);
        renderTime("00", "00", "00", "00");
        return;
      }

      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);

      renderTime(d, h, m, s);
    }, 1000);

    function renderTime(d, h, m, s) {
      const format = (num) => num.toString().padStart(2, "0");

      document
        .querySelectorAll(".days")
        .forEach((el) => (el.innerText = format(d)));
      document
        .querySelectorAll(".hours")
        .forEach((el) => (el.innerText = format(h)));
      document
        .querySelectorAll(".minutes")
        .forEach((el) => (el.innerText = format(m)));
      document
        .querySelectorAll(".seconds")
        .forEach((el) => (el.innerText = format(s)));
    }
  }
  initTimer();

  // --- 4. ВАЛИДАЦИЯ И ОТПРАВКА ДАННЫХ ---
  const phoneRegex = /^(?:\+38)?0\d{9}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  function setupFormValidation() {
    document.querySelectorAll(".reg-form").forEach((form) => {
      if (form.dataset.bound) return;
      form.dataset.bound = "true";

      form.addEventListener("submit", (e) => {
        e.preventDefault();
        let isValid = true;

        const nameInput = form.querySelector('[name="name"]');
        const emailInput = form.querySelector('[name="email"]');
        const phoneInput = form.querySelector('[name="phone"]');
        const agreeCheckbox = form.querySelector('[name="agree"]');

        const check = (el, condition) => {
          if (condition) {
            el.classList.add("error");
            isValid = false;
          } else {
            el.classList.remove("error");
          }
        };

        check(nameInput, nameInput.value.trim().length < 2);
        check(emailInput, !emailRegex.test(emailInput.value.trim()));
        check(
          phoneInput,
          !phoneRegex.test(phoneInput.value.replace(/\s+/g, "")),
        );
        check(agreeCheckbox, !agreeCheckbox.checked);

        if (isValid) {
          // 1. Остановка таймера (если нужно)
          if (window.timerInterval) clearInterval(window.timerInterval);

          const formData = {
            name: nameInput.value,
            email: emailInput.value,
            phone: phoneInput.value,
            agree: agreeCheckbox.checked,
          };

          fetch("https://example.com/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
          })
            .then(() => {
              console.log("Запит успішно імітовано", formData);
            })
            .catch((err) => {
              console.error("Помилка при відправці:", err);
            });

          if (modal && modal.contains(form)) {
            modal.style.display = "none";
            document.body.style.overflow = "auto";
          }

          form.reset();
        }
      });

      form.querySelectorAll("input").forEach((input) => {
        input.addEventListener("input", () => input.classList.remove("error"));
      });
    });
  }

  setupFormValidation();
});
