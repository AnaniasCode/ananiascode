/* =========================================================
   AnaniasCode — scripts
   ========================================================= */

/**
 * CONFIGURAÇÃO DO WHATSAPP
 * Coloque aqui o número do seu WhatsApp comercial com DDI + DDD, só números.
 * Ex: "5511987654321". Com o número preenchido, o pré-cadastro abre o
 * WhatsApp já com a mensagem pronta para você.
 * Se ficar vazio, o site copia a mensagem e abre o seu link comercial
 * (o cliente só precisa colar e enviar).
 */
const WHATSAPP_NUMBER = "5517981084794";
const WHATSAPP_LINK = "https://api.whatsapp.com/message/RUU6A45G6QD7J1?autoload=1&app_absent=0";

/* ---------- Header ---------- */
const header = document.getElementById("header");
const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 40);
onScroll();
window.addEventListener("scroll", onScroll, { passive: true });

/* ---------- Menu mobile ---------- */
const burger = document.getElementById("burger");
const nav = document.getElementById("nav");
burger.addEventListener("click", () => {
  const open = nav.classList.toggle("is-open");
  burger.setAttribute("aria-expanded", String(open));
});
nav.querySelectorAll("a").forEach((a) =>
  a.addEventListener("click", () => {
    nav.classList.remove("is-open");
    burger.setAttribute("aria-expanded", "false");
  })
);

/* ---------- Carrossel ---------- */
(() => {
  const hero = document.getElementById("inicio");
  const slides = [...document.querySelectorAll(".slide")];
  const dotsWrap = document.getElementById("heroDots");
  const progress = document.getElementById("heroProgress");
  const DURATION = 6000;
  let index = 0;
  let start = performance.now();
  let paused = false;
  let elapsedBeforePause = 0;

  const dots = slides.map((_, i) => {
    const b = document.createElement("button");
    b.type = "button";
    b.setAttribute("role", "tab");
    b.setAttribute("aria-label", `Ir para o slide ${i + 1}`);
    b.addEventListener("click", () => go(i));
    dotsWrap.appendChild(b);
    return b;
  });

  function go(i, dir = i >= index ? 1 : -1) {
    const next = (i + slides.length) % slides.length;
    const prevSlide = slides[index];
    const nextSlide = slides[next];
    if (next !== index) {
      // posiciona o próximo slide do lado certo antes de deslizar
      nextSlide.style.transition = "none";
      nextSlide.style.transform = `translateX(${dir * 100}%)`;
      void nextSlide.offsetWidth;
      nextSlide.style.transition = "";
      nextSlide.style.transform = "";
      prevSlide.style.transform = `translateX(${-dir * 100}%)`;
    }
    index = next;
    slides.forEach((s, n) => {
      s.classList.toggle("is-active", n === index);
      s.setAttribute("aria-hidden", String(n !== index));
      if (n === index) s.style.transform = "";
    });
    dots.forEach((d, n) => d.setAttribute("aria-selected", String(n === index)));
    start = performance.now();
    elapsedBeforePause = 0;
  }

  function tick(now) {
    if (!paused) {
      const p = Math.min((now - start) / DURATION, 1);
      progress.style.width = `${p * 100}%`;
      if (p >= 1) go(index + 1, 1);
    }
    requestAnimationFrame(tick);
  }

  const pause = () => { if (!paused) { paused = true; elapsedBeforePause = performance.now() - start; } };
  const resume = () => { if (paused) { paused = false; start = performance.now() - elapsedBeforePause; } };

  document.getElementById("heroPrev").addEventListener("click", () => go(index - 1, -1));
  document.getElementById("heroNext").addEventListener("click", () => go(index + 1, 1));
  document.addEventListener("visibilitychange", () => (document.hidden ? pause() : resume()));
  document.addEventListener("keydown", (e) => {
    if (window.scrollY > window.innerHeight / 2) return;
    if (e.key === "ArrowRight") go(index + 1, 1);
    if (e.key === "ArrowLeft") go(index - 1, -1);
  });

  // swipe
  let x0 = null;
  hero.addEventListener("touchstart", (e) => { x0 = e.touches[0].clientX; }, { passive: true });
  hero.addEventListener("touchend", (e) => {
    if (x0 === null) return;
    const dx = e.changedTouches[0].clientX - x0;
    if (Math.abs(dx) > 50) go(index + (dx < 0 ? 1 : -1), dx < 0 ? 1 : -1);
    x0 = null;
  });

  slides.forEach((s, n) => s.classList.toggle("is-active", n === 0));
  go(0, 1);
  requestAnimationFrame(tick);
})();

/* ---------- Reveal ao rolar ---------- */
const io = new IntersectionObserver(
  (entries) => entries.forEach((e) => {
    if (e.isIntersecting) { e.target.classList.add("is-visible"); io.unobserve(e.target); }
  }),
  { threshold: 0.12 }
);
document.querySelectorAll(".reveal").forEach((el, i) => {
  el.style.transitionDelay = `${(i % 3) * 0.08}s`;
  io.observe(el);
});

/* ---------- Prévia ao vivo dos sites (escala do iframe) ---------- */
const scaleFrames = () => {
  document.querySelectorAll(".work__frame, .shot__screen").forEach((frame) => {
    const iframe = frame.querySelector("iframe");
    if (iframe) iframe.style.transform = `scale(${frame.clientWidth / 1440})`;
  });
};
scaleFrames();
window.addEventListener("resize", scaleFrames);

/* ---------- Botões dos planos preenchem o formulário ---------- */
document.querySelectorAll("[data-plan]").forEach((btn) =>
  btn.addEventListener("click", () => {
    const radio = document.querySelector(`input[name="plano"][value="${btn.dataset.plan}"]`);
    if (radio) radio.checked = true;
  })
);

/* ---------- Máscara de telefone ---------- */
const phone = document.querySelector('input[name="telefone"]');
phone.addEventListener("input", () => {
  let d = phone.value.replace(/\D/g, "").slice(0, 11);
  if (d.length > 6) d = `(${d.slice(0, 2)}) ${d.slice(2, d.length - 4)}-${d.slice(-4)}`;
  else if (d.length > 2) d = `(${d.slice(0, 2)}) ${d.slice(2)}`;
  else if (d.length) d = `(${d}`;
  phone.value = d;
});

/* ---------- Pré-cadastro → WhatsApp ---------- */
const form = document.getElementById("quoteForm");
const errorBox = document.getElementById("formError");
const modal = document.getElementById("modal");
const modalText = document.getElementById("modalText");
const modalOpenWa = document.getElementById("modalOpenWa");

function buildMessage(data) {
  const recursos = data.getAll("recursos");
  const linhas = [
    "*🚀 NOVO PRÉ-CADASTRO — AnaniasCode*",
    "",
    `*Nome:* ${data.get("nome")}`,
    `*WhatsApp:* ${data.get("telefone")}`,
    `*Loja/Empresa:* ${data.get("empresa")}`,
    data.get("segmento") && `*Segmento:* ${data.get("segmento")}`,
    data.get("email") && `*E-mail:* ${data.get("email")}`,
    data.get("cidade") && `*Cidade:* ${data.get("cidade")}`,
    data.get("instagram") && `*Instagram:* ${data.get("instagram")}`,
    "",
    `*Plano de interesse:* ${data.get("plano")}`,
    recursos.length && `*Precisa de:* ${recursos.join(", ")}`,
    data.get("possuiSite") && `*Já possui site:* ${data.get("possuiSite")}`,
    data.get("prazo") && `*Prazo:* ${data.get("prazo")}`,
    data.get("mensagem") && `\n*Sobre a ideia:*\n${data.get("mensagem")}`,
  ];
  return linhas.filter((l) => l !== false && l !== null && l !== undefined && l !== 0 && l !== "")
    .concat([""]).join("\n").trim();
}

function validate() {
  let ok = true;
  form.querySelectorAll(".is-invalid").forEach((el) => el.classList.remove("is-invalid"));
  ["nome", "telefone", "empresa"].forEach((name) => {
    const input = form.elements[name];
    const invalid = name === "telefone" ? input.value.replace(/\D/g, "").length < 10 : !input.value.trim();
    if (invalid) { input.closest(".field").classList.add("is-invalid"); ok = false; }
  });
  if (!form.querySelector('input[name="plano"]:checked')) {
    document.getElementById("planOptions").closest(".field").classList.add("is-invalid");
    ok = false;
  }
  return ok;
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!validate()) {
    errorBox.textContent = "Preencha os campos obrigatórios (*) e escolha um plano.";
    errorBox.hidden = false;
    form.querySelector(".is-invalid")?.scrollIntoView({ behavior: "smooth", block: "center" });
    return;
  }
  errorBox.hidden = true;

  const message = buildMessage(new FormData(form));
  let url;

  if (WHATSAPP_NUMBER) {
    url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    modalText.innerHTML = "Abrimos o WhatsApp com seu pré-cadastro preenchido. É só tocar em <b>enviar</b>! 💜";
  } else {
    url = WHATSAPP_LINK;
    let copied = false;
    try { await navigator.clipboard.writeText(message); copied = true; } catch (_) {}
    modalText.innerHTML = copied
      ? "Seu pré-cadastro foi <b>copiado</b>! No WhatsApp, é só <b>colar</b> a mensagem e enviar. 💜"
      : "Abrimos o WhatsApp. Envie seus dados por lá que eu te respondo rapidinho! 💜";
  }

  modalOpenWa.href = url;
  window.open(url, "_blank", "noopener");
  modal.hidden = false;
  form.reset();
});

document.getElementById("modalClose").addEventListener("click", () => (modal.hidden = true));
modal.addEventListener("click", (e) => { if (e.target === modal) modal.hidden = true; });
document.addEventListener("keydown", (e) => { if (e.key === "Escape") modal.hidden = true; });

/* ---------- Ano no rodapé ---------- */
document.getElementById("year").textContent = new Date().getFullYear();
