document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contact-form");
  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");
  const messageInput = document.getElementById("message");

  const nameError = document.getElementById("error-name");
  const emailError = document.getElementById("error-email");
  const messageError = document.getElementById("error-message");

  const forbiddenEmailDomains = [];

  async function loadForbiddenDomains() {
    try {
      const response = await fetch("forbidden-domains.txt");
      if (response.ok) {
        const text = await response.text();
        forbiddenEmailDomains.push(
          ...text.split("\n").map((line) => line.trim())
        );
      } else {
        console.error("Не удалось загрузить файл с доменами...");
      }
    } catch (error) {
      console.error("Ошибка при загрузке файла...");
    }
  }

  function validateName(name) {
    const nameRegex = /^[a-zA-ZА-Яа-яЁё\s]{1,100}$/;
    return nameRegex.test(name);
  }

  function validateEmail(email) {
    const emailParts = email.split("@");
    if (emailParts.length !== 2) return false;
    const domain = emailParts[1].toLowerCase();
    return !forbiddenEmailDomains.includes(domain);
  }

  function containsUnsafeCode(value) {
    const unsafeCodeRegex =
      /<\/?[A-Za-z][\s\S]*>|<script[\s\S]*?>[\s\S]*?<\/script>|<\?php[\s\S]*?\?>/;
    return unsafeCodeRegex.test(value);
  }

  function showError(input, errorElement, message) {
    input.classList.add("error");
    errorElement.textContent = message;
    errorElement.style.display = "block";
  }

  function clearError(input, errorElement) {
    input.classList.remove("error");
    errorElement.textContent = "";
    errorElement.style.display = "none";
  }

  function validateForm() {
    let isValid = true;

    if (nameInput.value) {
      if (!validateName(nameInput.value)) {
        showError(
          nameInput,
          nameError,
          "Имя должно содержать только буквы и пробелы и не более 100 символов."
        );
        isValid = false;
      } else {
        clearError(nameInput, nameError);
      }
    }

    if (emailInput.value) {
      if (!validateEmail(emailInput.value)) {
        showError(
          emailInput,
          emailError,
          "Пожалуйста, используйте корректный домен для электронной почты."
        );
        isValid = false;
      } else {
        clearError(emailInput, emailError);
      }
    }

    if (messageInput.value) {
      if (containsUnsafeCode(messageInput.value)) {
        showError(
          messageInput,
          messageError,
          "Код и скрипт использовать нельзя."
        );
        isValid = false;
      } else {
        clearError(messageInput, messageError);
      }
    }

    return isValid;
  }

  loadForbiddenDomains().then(() => {
    nameInput.addEventListener("input", validateForm);
    emailInput.addEventListener("input", validateForm);
    messageInput.addEventListener("input", validateForm);

    form.addEventListener("submit", function (event) {
      event.preventDefault();

      if (validateForm()) {
        alert(`Спасибо, ${nameInput.value}! Ваше сообщение отправлено.`);

        form.reset();
      } else {
        alert("Пожалуйста, исправьте ошибки в форме.");
      }
    });
  });

  document.querySelectorAll("nav a").forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      document
        .querySelector(this.getAttribute("href"))
        .scrollIntoView({ behavior: "smooth" });
    });
  });
});
