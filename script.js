(() => {
  "use strict";

  const init = () => {
    const root = document.documentElement;
    const themeButton = document.querySelector(".theme-toggle");
    const themeIcon = document.querySelector(".theme-icon");

    const getTheme = () => {
      try { return localStorage.getItem("4534-theme"); } catch (_) { return null; }
    };

    const setTheme = (dark, save = true) => {
      root.classList.toggle("dark", dark);
      if (themeButton) {
        themeButton.setAttribute("aria-pressed", String(dark));
        themeButton.setAttribute("aria-label", dark ? "ライトモードに切り替え" : "ダークモードに切り替え");
      }
      if (themeIcon) themeIcon.textContent = dark ? "☀" : "◐";
      if (save) {
        try { localStorage.setItem("4534-theme", dark ? "dark" : "light"); } catch (_) {}
      }
    };

    setTheme(getTheme() === "dark", false);
    themeButton?.addEventListener("click", () => setTheme(!root.classList.contains("dark")));

    const modal = document.querySelector(".modal");
    const modalTitle = document.querySelector("#modalTitle");
    const closeButton = document.querySelector(".modal-close");

    const closeModal = () => {
      modal?.classList.remove("open");
      modal?.setAttribute("aria-hidden", "true");
      document.body.classList.remove("modal-open");
    };

    document.querySelectorAll(".case-button").forEach((button) => {
      button.addEventListener("click", () => {
        if (!modal || !modalTitle) return;
        modalTitle.textContent = button.dataset.project || "Project";
        modal.classList.add("open");
        modal.setAttribute("aria-hidden", "false");
        document.body.classList.add("modal-open");
      });
    });

    closeButton?.addEventListener("click", closeModal);
    modal?.addEventListener("click", (event) => {
      if (event.target === modal) closeModal();
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeModal();
    });

    const canvas = document.querySelector("#labCanvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let dots = [];
    let width = 0;
    let height = 0;
    const pointer = { x: -9999, y: -9999 };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      canvas.width = Math.floor(width * ratio);
      canvas.height = Math.floor(height * ratio);
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      dots = Array.from({ length: 65 }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - .5) * .42,
        vy: (Math.random() - .5) * .42,
        r: 1 + Math.random() * 2
      }));
    };

    const updatePointer = (event) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = event.clientX - rect.left;
      pointer.y = event.clientY - rect.top;
    };

    canvas.addEventListener("pointermove", updatePointer);
    canvas.addEventListener("pointerleave", () => { pointer.x = -9999; pointer.y = -9999; });
    canvas.addEventListener("pointerdown", updatePointer);

    const frame = () => {
      ctx.clearRect(0, 0, width, height);

      for (const dot of dots) {
        const dx = pointer.x - dot.x;
        const dy = pointer.y - dot.y;
        const distance = Math.hypot(dx, dy);

        if (distance > 0 && distance < 145) {
          const force = (145 - distance) / 145 * .012;
          dot.vx += dx / distance * force;
          dot.vy += dy / distance * force;
        }

        dot.vx *= .998;
        dot.vy *= .998;
        dot.x += dot.vx;
        dot.y += dot.vy;

        if (dot.x < 0 || dot.x > width) dot.vx *= -1;
        if (dot.y < 0 || dot.y > height) dot.vy *= -1;

        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dot.r, 0, Math.PI * 2);
        ctx.fillStyle = "#d7ff3f";
        ctx.fill();
      }

      for (let i = 0; i < dots.length; i++) {
        for (let j = i + 1; j < dots.length; j++) {
          const a = dots[i], b = dots[j];
          const distance = Math.hypot(a.x - b.x, a.y - b.y);
          if (distance < 82) {
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = "rgba(215,255,63," + ((1 - distance / 82) * .13) + ")";
            ctx.stroke();
          }
        }
      }

      requestAnimationFrame(frame);
    };

    resize();
    window.addEventListener("resize", resize, { passive: true });
    requestAnimationFrame(frame);
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();