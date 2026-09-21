(() => {
  "use strict";

  const start = () => {
    const root = document.documentElement;
    const theme = document.querySelector(".theme");
    const icon = theme?.querySelector("span");

    const applyTheme = (dark, save) => {
      root.classList.toggle("dark", dark);
      theme?.setAttribute("aria-pressed", String(dark));
      theme?.setAttribute("aria-label", dark ? "ライトモードに切り替え" : "ダークモードに切り替え");
      if (icon) icon.textContent = dark ? "☀" : "◐";
      if (save) {
        try { localStorage.setItem("4534-theme", dark ? "dark" : "light"); } catch (_) {}
      }
    };

    let saved = "light";
    try { saved = localStorage.getItem("4534-theme") || "light"; } catch (_) {}
    applyTheme(saved === "dark", false);
    theme?.addEventListener("click", () => applyTheme(!root.classList.contains("dark"), true));

    const modal = document.querySelector(".modal");
    const modalTitle = document.querySelector("#modal-title");
    const close = () => {
      modal?.classList.remove("open");
      modal?.setAttribute("aria-hidden", "true");
      document.body.classList.remove("lock");
    };

    document.querySelectorAll(".work-text button").forEach((button) => {
      button.addEventListener("click", () => {
        if (!modal || !modalTitle) return;
        modalTitle.textContent = button.dataset.project || "Project";
        modal.classList.add("open");
        modal.setAttribute("aria-hidden", "false");
        document.body.classList.add("lock");
      });
    });
    document.querySelector(".close")?.addEventListener("click", close);
    modal?.addEventListener("click", (event) => { if (event.target === modal) close(); });
    document.addEventListener("keydown", (event) => { if (event.key === "Escape") close(); });

    const canvas = document.querySelector("#canvas");
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    let width = 0, height = 0, dots = [];
    const pointer = {x:-9999,y:-9999};

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      canvas.width = Math.floor(width * ratio);
      canvas.height = Math.floor(height * ratio);
      ctx.setTransform(ratio,0,0,ratio,0,0);
      dots = Array.from({length:65}, () => ({
        x:Math.random()*width,y:Math.random()*height,
        vx:(Math.random()-.5)*.42,vy:(Math.random()-.5)*.42,
        r:1+Math.random()*2
      }));
    };

    const move = (event) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = event.clientX - rect.left;
      pointer.y = event.clientY - rect.top;
    };
    canvas.addEventListener("pointermove", move);
    canvas.addEventListener("pointerleave", () => {pointer.x=-9999;pointer.y=-9999});

    const frame = () => {
      ctx.clearRect(0,0,width,height);
      for (const dot of dots) {
        const dx=pointer.x-dot.x, dy=pointer.y-dot.y, dist=Math.hypot(dx,dy);
        if(dist>0 && dist<145){const f=(145-dist)/145*.012;dot.vx+=dx/dist*f;dot.vy+=dy/dist*f}
        dot.vx*=.998;dot.vy*=.998;dot.x+=dot.vx;dot.y+=dot.vy;
        if(dot.x<0||dot.x>width)dot.vx*=-1;
        if(dot.y<0||dot.y>height)dot.vy*=-1;
        ctx.beginPath();ctx.arc(dot.x,dot.y,dot.r,0,Math.PI*2);ctx.fillStyle="#d7ff3f";ctx.fill();
      }
      for(let i=0;i<dots.length;i++)for(let j=i+1;j<dots.length;j++){
        const a=dots[i],b=dots[j],dist=Math.hypot(a.x-b.x,a.y-b.y);
        if(dist<82){ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.strokeStyle="rgba(215,255,63,"+((1-dist/82)*.13)+")";ctx.stroke()}
      }
      requestAnimationFrame(frame);
    };

    resize();
    window.addEventListener("resize", resize, {passive:true});
    requestAnimationFrame(frame);
  };

  if(document.readyState === "loading") document.addEventListener("DOMContentLoaded",start,{once:true});
  else start();
})();