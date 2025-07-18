// Navbar Fixed
window.onscroll = function(){
    const header = document.querySelector('header');
    const fixedNav = header.offsetTop;

    if(window.pageYOffset > fixedNav){
        header.classList.add('navbar-fixed');
    } else {
        header.classList.remove('navbar-fixed');
    }
}


// Hamburger
const hamburger = document.querySelector('#hamburger');
const navMenu = document.querySelector('#nav-menu');

hamburger.addEventListener('click', function(){
    hamburger.classList.toggle('hamburger-active');
    navMenu.classList.toggle('hidden');
})

// Typewriting Animation
const typewriterText = document.querySelector(".typewriter");
const phrases = [
  "අයුබෝවන්   🙏",
  "Hello 👋",
  "Bonjour 👋",
  "你好 🙌",
  "Привет 🙏",
  "こんにちは 🙏",
  "வணக்கம் 🖐"
];

let phraseIndex = 0;
let characterIndex = 0;

function type() {
  if (characterIndex < phrases[phraseIndex].length) {
    typewriterText.textContent += phrases[phraseIndex][characterIndex];
    characterIndex++;
    setTimeout(type, 100);
  } else {
    setTimeout(erase, 1000);
  }
}

function erase() {
  if (characterIndex > 0) {
    typewriterText.textContent = phrases[phraseIndex].substring(0, characterIndex - 1);
    characterIndex--;
    setTimeout(erase, 50);
  } else {
    phraseIndex = (phraseIndex + 1) % phrases.length;
    setTimeout(type, 250);
  }
}

type();

//Language Switcher
const translations = {
  en: {
    beranda: "Home",
    tentang_saya: "About Me",
    pengalaman: "Experience",
    pengalaman_terbaru: "Latest Experience",
    portfolio: "Portfolio",
    project_terbaru: "Latest Project",
    greeting: "Hello 👋, I am",
    kontak: "Contact",
    hubungi_saya: "Contact Me",
    yapping: "As an Informatics Engineering undergraduate, I am passionate about using technology to solve real-world problems and create meaningful impact. I have a strong foundation in Android development, with proficiency in Kotlin, and hands-on experience integrating machine learning solutions using TensorFlow Lite and ML Kit. My experience also includes working as a Web Developer Intern, where I built responsive web applications using Vue and FastAPI for backend development, ensuring cross-browser compatibility and performance optimization. I thrive in collaborative environments, enjoy solving complex problems, and am committed to delivering high-quality, user-centric solutions. I'm always eager to connect with fellow tech professionals and explore opportunities in mobile and backend development.",
  },
  id: {
    beranda: "Beranda",
    tentang_saya: "Tentang Saya",
    pengalaman: "Pengalaman",
    pengalaman_terbaru: "Pengalaman Terbaru",
    portfolio: "Portfolio",
    project_terbaru: "Proyek Terbaru",
    greeting: "Halo 👋, Saya",
    kontak: "Kontak",
    hubungi_saya: "Hubungi Saya",
    yapping: "Sebagai mahasiswa Teknik Informatika, saya memiliki semangat untuk menggunakan teknologi dalam menyelesaikan masalah dunia nyata dan menciptakan dampak yang berarti. Saya memiliki dasar yang kuat dalam pengembangan Android, dengan keahlian dalam Kotlin, serta pengalaman praktis dalam mengintegrasikan solusi pembelajaran mesin menggunakan TensorFlow Lite dan ML Kit. Pengalaman saya juga mencakup bekerja sebagai Magang Pengembang Web, di mana saya membangun aplikasi web responsif menggunakan Vue dan FastAPI untuk pengembangan backend, memastikan kompatibilitas lintas browser dan optimasi kinerja. Saya berkembang dalam lingkungan kolaboratif, menikmati memecahkan masalah kompleks, dan berkomitmen untuk memberikan solusi berkualitas tinggi yang berfokus pada pengguna. Saya selalu ingin terhubung dengan profesional teknologi lainnya dan menjelajahi peluang dalam pengembangan mobile dan backend.",
  }
}

const langToggle = document.querySelector('#lang-toggle');
let currLang = localStorage.getItem('lang') || 'id';

const setLang = (lang) => {
  document.querySelectorAll('[data-lang').forEach(el => {
    const key = el.getAttribute('data-lang');
    if (translations[lang][key]) {
      el.textContent = translations[lang][key];
    }
  });
  langToggle.textContent = currLang === 'id' ? 'Switch to EN' : 'Ganti ke ID';
  localStorage.setItem('lang', lang);
};

langToggle.addEventListener('click', () => {
  currLang = currLang === 'id' ? 'en' : 'id';
  setLang(currLang);
});

document.addEventListener('DOMContentLoaded', () => {
  setLang(currLang)
})