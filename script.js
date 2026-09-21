const root=document.documentElement;
const body=document.body;
const themeButton=document.querySelector('.theme-button');
const progress=document.querySelector('.scroll-progress');
const year=document.querySelector('#year');
const copyButton=document.querySelector('#copy-link');

const savedTheme=localStorage.getItem('4534-theme');
if(savedTheme==='dark') body.classList.add('dark');
if(themeButton) themeButton.addEventListener('click',()=>{
  body.classList.toggle('dark');
  localStorage.setItem('4534-theme',body.classList.contains('dark')?'dark':'light');
});

const updateProgress=()=>{
  const max=document.documentElement.scrollHeight-window.innerHeight;
  progress.style.width=(max>0?(window.scrollY/max)*100:0)+'%';
};
window.addEventListener('scroll',updateProgress,{passive:true});
updateProgress();

if(year) year.textContent=new Date().getFullYear();

const observer=new IntersectionObserver(entries=>{
  entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target);}});
},{threshold:.12});
document.querySelectorAll('.section,.work-card,.skill-grid>div,.feature-card').forEach(el=>el.classList.add('reveal'));
document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));

if(copyButton) copyButton.addEventListener('click',async()=>{
  try{
    await navigator.clipboard.writeText(location.href);
    copyButton.textContent='コピーしました';
    setTimeout(()=>copyButton.textContent='URLをコピー',1600);
  }catch{
    copyButton.textContent='コピーできません';
    setTimeout(()=>copyButton.textContent='URLをコピー',1600);
  }
});
