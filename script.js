// SNSのURLは公開時にここへ追加できます。
// 例: { label: "Instagram", url: "https://www.instagram.com/..." }
const socialLinks = [
  // { label: "Instagram", url: "" },
  // { label: "Facebook", url: "" },
];

const socialContainer = document.querySelector("#social-links");
if (socialContainer && socialLinks.length) {
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


const phoneLink = document.querySelector(".contact-phone");
if (phoneLink && !("ontouchstart" in window)) {
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
