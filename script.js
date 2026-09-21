// SNSのURLは公開時にここへ追加できます。
// 例: { label: "Instagram", url: "https://www.instagram.com/..." }
const socialLinks = [
  // { label: "Instagram", url: "" },
  // { label: "Facebook", url: "" },
];

async function loadComponents() {
  const components = document.querySelectorAll("[data-component]");

  await Promise.all(
    [...components].map(async (container) => {
      const name = container.dataset.component;
      if (!name) return;

      const response = await fetch(`components/${name}.html`);
      if (!response.ok) throw new Error(`Failed to load component: ${name}`);
      container.outerHTML = await response.text();
    }),
  );
}

function initSocialLinks() {
  const socialContainer = document.querySelector("#social-links");
  if (!socialContainer || !socialLinks.length) return;

  socialLinks.forEach(({ label, url }) => {
    if (!url) return;
    const a = document.createElement("a");
    a.href = url;
    a.textContent = label;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    socialContainer.appendChild(a);
  });
}

function initDesktopPhoneCopy() {
  const phoneLink = document.querySelector(".contact-phone");
  if (!phoneLink || ("ontouchstart" in window)) return;

  phoneLink.setAttribute("href", "#");
  phoneLink.addEventListener("click", async (event) => {
    event.preventDefault();
    const phoneNumber = phoneLink.dataset.phone;

    try {
      await navigator.clipboard.writeText(phoneNumber);
      const label = phoneLink.querySelector(".phone-label");
      if (label) label.textContent = "電話番号をコピーしました";
      window.setTimeout(() => {
        if (label) label.textContent = "電話番号をコピー";
      }, 1800);
    } catch {
      window.prompt("電話番号をコピーしてください", phoneNumber);
    }
  });
}

loadComponents()
  .then(() => {
    initSocialLinks();
    initDesktopPhoneCopy();
  })
  .catch((error) => {
    console.error(error);
  });
