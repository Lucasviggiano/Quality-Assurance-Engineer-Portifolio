document.addEventListener("DOMContentLoaded", () => {
  const revealElements = document.querySelectorAll(".reveal");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  revealElements.forEach((element) => observer.observe(element));

  const currentYearTarget = document.querySelector("[data-current-year]");
  if (currentYearTarget) {
    currentYearTarget.textContent = new Date().getFullYear();
  }

  const menuToggle = document.querySelector(".menu-toggle");
  const navLinks = document.querySelector(".nav-links");

  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
      const isOpen = navLinks.classList.toggle("is-open");
      menuToggle.setAttribute("aria-expanded", String(isOpen));
      document.body.classList.toggle("menu-open", isOpen);
    });

    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("is-open");
        menuToggle.setAttribute("aria-expanded", "false");
        document.body.classList.remove("menu-open");
      });
    });
  }

  const form = document.getElementById("leadForm");
  const whatsappNumber = "5531999999999";

  if (!form) return;

  const fields = {
    nome: {
      element: document.getElementById("nome"),
      validate: (value) => value.trim().length >= 3,
      message: "Informe um nome valido."
    },
    email: {
      element: document.getElementById("email"),
      validate: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()),
      message: "Informe um email valido."
    },
    telefone: {
      element: document.getElementById("telefone"),
      validate: (value) => value.replace(/\D/g, "").length >= 10,
      message: "Informe um telefone valido com DDD."
    },
    tipoProjeto: {
      element: document.getElementById("tipoProjeto"),
      validate: (value) => value.trim() !== "",
      message: "Selecione o tipo de projeto."
    }
  };

  function setError(input, message) {
    const field = input.closest(".form-field");
    const error = field.querySelector(".error-message");
    field.classList.add("has-error");
    if (error) error.textContent = message;
  }

  function clearError(input) {
    const field = input.closest(".form-field");
    const error = field.querySelector(".error-message");
    field.classList.remove("has-error");
    if (error) error.textContent = "";
  }

  function validateField(config) {
    const value = config.element.value;
    const isValid = config.validate(value);

    if (!isValid) {
      setError(config.element, config.message);
      return false;
    }

    clearError(config.element);
    return true;
  }

  Object.values(fields).forEach((config) => {
    config.element.addEventListener("input", () => validateField(config));
    config.element.addEventListener("blur", () => validateField(config));
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const results = Object.values(fields).map((config) => validateField(config));
    const isFormValid = results.every(Boolean);

    if (!isFormValid) return;

    const nome = fields.nome.element.value.trim();
    const email = fields.email.element.value.trim();
    const telefone = fields.telefone.element.value.trim();
    const tipoProjeto = fields.tipoProjeto.element.value.trim();
    const mensagem = document.getElementById("mensagem").value.trim();

    const text = [
      "Ola Lucas, vi seu portfolio QA e quero conversar sobre um projeto.",
      "",
      `Nome: ${nome}`,
      `Email: ${email}`,
      `Telefone: ${telefone}`,
      `Tipo de projeto: ${tipoProjeto}`,
      mensagem ? `Mensagem: ${mensagem}` : null
    ]
      .filter(Boolean)
      .join("\n");

    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  });
});
