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

