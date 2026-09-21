(() => {
  "use strict";

  const init = () => {
    const root = document.documentElement;
    const theme = document.querySelector(".theme");
    const icon = theme?.querySelector("span");

    const setTheme = (dark, save = true) => {
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
    setTheme(saved === "dark", false);
    theme?.addEventListener("click", () => setTheme(!root.classList.contains("dark")));

    const modal = document.querySelector(".modal");
    const openModal = () => {
      modal?.classList.add("open");
      modal?.setAttribute("aria-hidden", "false");
      document.body.classList.add("lock");
    };
    const closeModal = () => {
      modal?.classList.remove("open");
      modal?.setAttribute("aria-hidden", "true");
      document.body.classList.remove("lock");
    };

    document.querySelector(".command")?.addEventListener("click", openModal);
    document.querySelector("[data-open-command]")?.addEventListener("click", openModal);
    document.querySelector(".close")?.addEventListener("click", closeModal);
    modal?.addEventListener("click", e => { if (e.target === modal) closeModal(); });
    document.addEventListener("keydown", e => {
      if (e.key === "Escape") closeModal();
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); openModal(); }
    });

    document.querySelectorAll("[data-jump]").forEach(button => {
      button.addEventListener("click", () => {
        closeModal();
        document.querySelector(button.dataset.jump)?.scrollIntoView({behavior:"smooth"});
      });
    });

    const cursor = document.querySelector(".cursor");
    if (cursor && window.matchMedia("(pointer:fine)").matches) {
      window.addEventListener("pointermove", e => {
        cursor.style.left = e.clientX + "px";
        cursor.style.top = e.clientY + "px";
        cursor.style.opacity = "1";
      }, {passive:true});
      document.querySelectorAll("a,button").forEach(el => {
        el.addEventListener("mouseenter", () => { cursor.style.width="28px"; cursor.style.height="28px"; });
        el.addEventListener("mouseleave", () => { cursor.style.width="16px"; cursor.style.height="16px"; });
      });
    }

    const reveals = document.querySelectorAll(".reveal");
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add("visible"); observer.unobserve(entry.target); } });
    }, {threshold:.12});
    reveals.forEach(el => observer.observe(el));

    const canvas = document.querySelector("#canvas");
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    let width=0, height=0, dots=[];
    const pointer={x:-9999,y:-9999};

    const resize=()=>{
      const rect=canvas.getBoundingClientRect();
      const ratio=Math.min(window.devicePixelRatio||1,2);
      width=Math.max(1,rect.width); height=Math.max(1,rect.height);
      canvas.width=Math.floor(width*ratio); canvas.height=Math.floor(height*ratio);
      ctx.setTransform(ratio,0,0,ratio,0,0);
      dots=Array.from({length:65},()=>({x:Math.random()*width,y:Math.random()*height,vx:(Math.random()-.5)*.45,vy:(Math.random()-.5)*.45,r:1+Math.random()*2}));
    };
    const move=e=>{
      const rect=canvas.getBoundingClientRect();
      pointer.x=e.clientX-rect.left; pointer.y=e.clientY-rect.top;
    };
    canvas.addEventListener("pointermove",move);
    canvas.addEventListener("pointerleave",()=>{pointer.x=-9999;pointer.y=-9999});
    canvas.addEventListener("pointerdown",move);

    const frame=()=>{
      ctx.clearRect(0,0,width,height);
      for(const dot of dots){
        const dx=pointer.x-dot.x,dy=pointer.y-dot.y,dist=Math.hypot(dx,dy);
        if(dist>0&&dist<170){const force=(170-dist)/170*.018;dot.vx+=dx/dist*force;dot.vy+=dy/dist*force}
        dot.vx*=.998;dot.vy*=.998;dot.x+=dot.vx;dot.y+=dot.vy;
        if(dot.x<0||dot.x>width)dot.vx*=-1;
        if(dot.y<0||dot.y>height)dot.vy*=-1;
        ctx.beginPath();ctx.arc(dot.x,dot.y,dot.r,0,Math.PI*2);ctx.fillStyle="#d8ff3f";ctx.fill();
      }
      for(let i=0;i<dots.length;i++)for(let j=i+1;j<dots.length;j++){
        const a=dots[i],b=dots[j],dist=Math.hypot(a.x-b.x,a.y-b.y);
        if(dist<90){ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.strokeStyle="rgba(216,255,63,"+((1-dist/90)*.16)+")";ctx.stroke()}
      }
      requestAnimationFrame(frame);
    };
    resize();
    window.addEventListener("resize",resize,{passive:true});
    requestAnimationFrame(frame);
  };

  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",init,{once:true});
  else init();
})();