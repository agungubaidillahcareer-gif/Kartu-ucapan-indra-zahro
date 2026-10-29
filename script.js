// =========================================================
// INISIALISASI AOS (Animasi Scroll)
// =========================================================
AOS.init({
  duration: 900,
  once: true,
  offset: 90,
  easing: "ease-out-cubic",
});

// =========================================================
// PARTIKEL EMAS (Canvas Native)
// =========================================================
(function () {
  const canvas = document.getElementById("partikel");
  const ctx = canvas.getContext("2d");
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let particles = [];
  let w, h;

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }

  function buatPartikel() {
    const jumlah = Math.min(70, Math.floor(w / 22));
    particles = [];
    for (let i = 0; i < jumlah; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.8 + 0.4,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        alpha: Math.random() * 0.5 + 0.2,
        pulse: Math.random() * Math.PI * 2,
      });
    }
  }

  function gambar() {
    ctx.clearRect(0, 0, w, h);

    particles.forEach(function (p) {
      p.x += p.vx;
      p.y += p.vy;
      p.pulse += 0.02;

      if (p.x < 0) p.x = w;
      if (p.x > w) p.x = 0;
      if (p.y < 0) p.y = h;
      if (p.y > h) p.y = 0;

      const cahaya = p.alpha + Math.sin(p.pulse) * 0.15;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(201, 162, 90, " + Math.max(0.05, cahaya) + ")";
      ctx.fill();
    });

    requestAnimationFrame(gambar);
  }

  resize();
  buatPartikel();
  window.addEventListener("resize", function () {
    resize();
    buatPartikel();
  });

  if (!reduced) {
    gambar();
  } else {
    // Gambar statis jika reduced motion
    ctx.clearRect(0, 0, w, h);
    particles.forEach(function (p) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(201, 162, 90, " + p.alpha + ")";
      ctx.fill();
    });
  }
})();

// =========================================================
// TOMBOL BUKA UCAPAN + CONFETTI EMAS
// =========================================================
const btnBuka = document.getElementById("btnBuka");
const sectionUcapan = document.getElementById("ucapan");
const reducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;

btnBuka.addEventListener("click", function () {
  if (!reducedMotion && typeof confetti === "function") {
    const goldColors = ["#c9a25a", "#e6c98a", "#8a6d3b", "#f3ede2"];

    // Confetti dari kiri
    confetti({
      particleCount: 60,
      angle: 60,
      spread: 65,
      origin: { x: 0, y: 0.65 },
      colors: goldColors,
      disableForReducedMotion: true,
    });

    // Confetti dari kanan
    confetti({
      particleCount: 60,
      angle: 120,
      spread: 65,
      origin: { x: 1, y: 0.65 },
      colors: goldColors,
      disableForReducedMotion: true,
    });
  }

  sectionUcapan.scrollIntoView({ behavior: "smooth" });
});

// =========================================================
// AUDIO PLAYER (Lagu Spesial)
// =========================================================
const audio = document.getElementById("audioLagu");
const btnPlay = document.getElementById("btnPlay");
const iconPlay = document.getElementById("iconPlay");
const progress = document.getElementById("progress");
const waktuMulai = document.getElementById("waktuMulai");
const waktuTotal = document.getElementById("waktuTotal");

// Format detik -> mm:ss
function formatWaktu(detik) {
  if (isNaN(detik) || !isFinite(detik)) return "00:00";
  const m = Math.floor(detik / 60);
  const d = Math.floor(detik % 60);
  return String(m).padStart(2, "0") + ":" + String(d).padStart(2, "0");
}

// Play / Pause
btnPlay.addEventListener("click", function () {
  if (audio.paused) {
    audio.play().catch(function () {
      console.warn("File audio belum tersedia atau gagal dimuat.");
    });
    iconPlay.classList.remove("fa-play");
    iconPlay.classList.add("fa-pause");
  } else {
    audio.pause();
    iconPlay.classList.remove("fa-pause");
    iconPlay.classList.add("fa-play");
  }
});

// Update total durasi saat metadata siap
audio.addEventListener("loadedmetadata", function () {
  waktuTotal.textContent = formatWaktu(audio.duration);
});

// Update progress & waktu saat lagu berjalan
audio.addEventListener("timeupdate", function () {
  if (audio.duration) {
    const persen = (audio.currentTime / audio.duration) * 100;
    progress.value = persen;
    waktuMulai.textContent = formatWaktu(audio.currentTime);
  }
});

// Geser progress bar (Seek)
progress.addEventListener("input", function () {
  if (audio.duration) {
    audio.currentTime = (progress.value / 100) * audio.duration;
  }
});

// Reset saat lagu selesai
audio.addEventListener("ended", function () {
  iconPlay.classList.remove("fa-pause");
  iconPlay.classList.add("fa-play");
  progress.value = 0;
  waktuMulai.textContent = "00:00";
});

// =========================================================
// PARALLAX HALUS PADA HERO
// =========================================================
if (!reducedMotion) {
  const heroOrnamen = document.querySelectorAll(".hero-ornamen");
  window.addEventListener(
    "scroll",
    function () {
      const y = window.scrollY;
      if (y < window.innerHeight) {
        heroOrnamen.forEach(function (el, i) {
          const arah = i === 0 ? 1 : -1;
          el.style.transform =
            "rotate(45deg) translate(" +
            y * 0.08 * arah +
            "px, " +
            y * 0.08 * arah +
            "px)";
        });
      }
    },
    { passive: true },
  );
}
