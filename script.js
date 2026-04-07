/**
 * Project: Excel Pro Webinar Landing Page
 * Task: Recruitment Assignment for GoIT
 * Description: Vanilla JS with localStorage timer, modal logic, form validation and POST request.
 */

document.addEventListener("DOMContentLoaded", () => {
  // --- 1. ИНИЦИАЛИЗАЦИЯ ФОРМ ИЗ ТЕМПЛЕЙТА ---
  const template = document.getElementById("form-template");
  const mainSlot = document.getElementById("main-form-slot");
  const modalSlot = document.getElementById("modal-form-slot");

  if (template) {
    if (mainSlot) mainSlot.appendChild(template.content.cloneNode(true));
    if (modalSlot) modalSlot.appendChild(template.content.cloneNode(true));
  }

  // --- 2. ЛОГИКА МОДАЛЬНОГО ОКНА ---
  const modal = document.getElementById("modal");
  const openBtn = document.getElementById("openModalBtn");
  const closeBtn = document.getElementById("closeBtn");

  if (openBtn) {
    openBtn.onclick = () => {
      modal.style.display = "flex";
      document.body.style.overflow = "hidden";
    };
  }

  if (closeBtn) {
    closeBtn.onclick = () => {
      modal.style.display = "none";
      document.body.style.overflow = "auto";
    };
  }

  // Закрытие по клику на фон
  window.onclick = (e) => {
    if (e.target === modal) {
      modal.style.display = "none";
      document.body.style.overflow = "auto";
    }
  };

  // --- 3. ДИНАМИЧЕСКИЙ ТАЙМЕР (localStorage) ---
  function initTimer() {
    const TIMER_KEY = "goit_webinar_deadline";
    let deadline = localStorage.getItem(TIMER_KEY);

    if (!deadline) {
      deadline = new Date().getTime() + 24 * 60 * 60 * 1000; // +24 часа
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

  document.querySelectorAll(".reg-form").forEach((form) => {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      let isValid = true;

      // Получаем элементы полей
      const nameInput = form.querySelector('[name="name"]');
      const emailInput = form.querySelector('[name="email"]');
      const phoneInput = form.querySelector('[name="phone"]');
      const agreeCheckbox = form.querySelector('[name="agree"]');

      // Функция проверки
      const check = (el, condition) => {
        if (condition) {
          el.classList.add("error");
          isValid = false;
        } else {
          el.classList.remove("error");
        }
      };

      // Выполняем проверки
      check(nameInput, nameInput.value.trim().length < 2);
      check(emailInput, !emailRegex.test(emailInput.value.trim()));
      check(phoneInput, !phoneRegex.test(phoneInput.value.replace(/\s+/g, "")));
      check(agreeCheckbox, !agreeCheckbox.checked);

      if (isValid) {
        // 1. Остановка таймера
        if (window.timerInterval) {
          clearInterval(window.timerInterval);
        }

        // 2. Сбор данных
        const formData = {
          name: nameInput.value,
          email: emailInput.value,
          phone: phoneInput.value,
          agree: agreeCheckbox.checked,
        };

        // 3. POST-запрос на не существующий URL
        fetch("https://example.com/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        })
          .then((response) => {
            console.log("Запит імітовано: дані відправлено", formData);
          })
          .catch((error) => {
            console.error("Очікувана помилка мережі для example.com:", error);
          });

        // 4. Замена формы на сообщение об успехе
        const successMessage = `
          <div style="text-align: center; padding: 40px; background: #fff; border-radius: 4px;">
            <h3 style="color: #107c41; font-size: 24px; margin-bottom: 15px;">Дякуємо!</h3>
            <p style="font-size: 16px; color: #4f4f4f;">Ваша реєстрація успішно завершена.</p>
          </div>
        `;

        // Проверяем, где была форма (в модалке или на странице) и заменяем контент
        if (modal.style.display === "flex") {
          modalSlot.innerHTML = successMessage;
          // Закрываем модалку через 3 секунды (опционально)
          setTimeout(() => {
            modal.style.display = "none";
            document.body.style.overflow = "auto";
          }, 3000);
        } else if (mainSlot) {
          mainSlot.innerHTML = successMessage;
        }

        form.reset();
      }
    });

    // Живая очистка ошибок
    form.querySelectorAll("input").forEach((input) => {
      input.addEventListener("input", () => input.classList.remove("error"));
    });
  });
});
