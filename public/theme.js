/* AnaniasCode — tema claro/escuro (usado em todas as páginas) */
(() => {
  const root = document.documentElement;
  const btn = document.getElementById("themeToggle");
  const meta = document.querySelector('meta[name="theme-color"]');
  const apply = (t) => {
    root.setAttribute("data-theme", t);
    btn.setAttribute("aria-pressed", String(t === "dark"));
    btn.setAttribute("aria-label", t === "dark" ? "Mudar para tema claro" : "Mudar para tema escuro");
    if (meta) meta.setAttribute("content", t === "dark" ? "#0c0617" : "#6d28d9");
  };
  apply(root.getAttribute("data-theme") === "dark" ? "dark" : "light");
  btn.addEventListener("click", () => {
    const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    apply(next);
    try { localStorage.setItem("theme", next); } catch (e) {}
  });
  // acompanha o sistema enquanto o visitante não escolher manualmente
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
    let saved = null;
    try { saved = localStorage.getItem("theme"); } catch (_) {}
    if (!saved) apply(e.matches ? "dark" : "light");
  });
})();

