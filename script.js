(() => {
  "use strict";

  function initTheme() {
    const root = document.documentElement;
    const button = document.querySelector(".theme");
    if (!button) return;

    let saved = null;
    try { saved = localStorage.getItem("theme"); } catch (_) {}

    const apply = (dark) => {
      root.classList.toggle("dark", dark);
      button.textContent = dark ? "☀" : "◐";
      button.setAttribute("aria-pressed", String(dark));
      button.setAttribute("aria-label", dark ? "ライトモードに切り替え" : "ダークモードに切り替え");
    };

    apply(saved === "dark");

    button.addEventListener("click", () => {
      const dark = !root.classList.contains("dark");
      apply(dark);
      try { localStorage.setItem("theme", dark ? "dark" : "light"); } catch (_) {}
    });
  }

  function initModal() {
    const modal = document.querySelector(".modal");
    const title = document.querySelector("#modalTitle");
    const closeButton = document.querySelector(".modal-close");
    if (!modal || !title || !closeButton) return;

    const closeModal = () => {
      modal.classList.remove("open");
      modal.setAttribute("aria-hidden", "true");
      document.body.classList.remove("modal-open");
    };

    document.querySelectorAll(".project-btn").forEach((button) => {
      button.addEventListener("click", () => {
        title.textContent = button.dataset.project || "Project";
        modal.classList.add("open");
        modal.setAttribute("aria-hidden", "false");
        document.body.classList.add("modal-open");
      });
    });

    closeButton.addEventListener("click", closeModal);
    modal.addEventListener("click", (event) => {
      if (event.target === modal) closeModal();
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeModal();
    });
  }

  function initLab() {
    const canvas = document.querySelector("#labCanvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let dots = [];
    const mouse = { x: -9999, y: -9999 };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.floor(rect.width * ratio));
      canvas.height = Math.max(1, Math.floor(rect.height * ratio));
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

      dots = Array.from({ length: 70 }, () => ({
        x: Math.random() * rect.width,
        y: Math.random() * rect.height,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        r: 1 + Math.random() * 2
      }));
    };

    canvas.addEventListener("pointermove", (event) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = event.clientX - rect.left;
      mouse.y = event.clientY - rect.top;
    });
    canvas.addEventListener("pointerleave", () => {
      mouse.x = -9999;
      mouse.y = -9999;
    });

    const draw = () => {
      const rect = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, rect.height);

      for (const dot of dots) {
        const dx = mouse.x - dot.x;
        const dy = mouse.y - dot.y;
        const distance = Math.hypot(dx, dy);

        if (distance > 0 && distance < 130) {
          dot.vx += (dx / distance) * 0.012;
          dot.vy += (dy / distance) * 0.012;
        }

        dot.vx *= 0.998;
        dot.vy *= 0.998;
        dot.x += dot.vx;
        dot.y += dot.vy;

        if (dot.x < 0 || dot.x > rect.width) dot.vx *= -1;
        if (dot.y < 0 || dot.y > rect.height) dot.vy *= -1;

        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dot.r, 0, Math.PI * 2);
        ctx.fillStyle = "#d7ff3f";
        ctx.fill();
      }

      for (let i = 0; i < dots.length; i++) {
        for (let j = i + 1; j < dots.length; j++) {
          const a = dots[i], b = dots[j];
          const distance = Math.hypot(b.x - a.x, b.y - a.y);
          if (distance < 85) {
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = "rgba(215,255,63," + ((1 - distance / 85) * 0.14) + ")";
            ctx.stroke();
          }
        }
      }

      requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener("resize", resize, { passive: true });
    requestAnimationFrame(draw);
  }

  const start = () => {
    initTheme();
    initModal();
    initLab();
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start, { once: true });
  } else {
    start();
  }
})();