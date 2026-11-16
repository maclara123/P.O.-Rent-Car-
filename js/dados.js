/* Funções compartilhadas do sistema. Os dados ficam no navegador (localStorage). */
const Locadora = (() => {
  const CHAVE_LOCACOES = "locadora_locacoes";
  const CHAVE_USUARIO = "locadora_usuario";

  function listar() {
    try { return JSON.parse(localStorage.getItem(CHAVE_LOCACOES)) || []; }
    catch { return []; }
  }

  function salvarLista(lista) {
    localStorage.setItem(CHAVE_LOCACOES, JSON.stringify(lista));
  }

  function usuario() {
    try { return JSON.parse(sessionStorage.getItem(CHAVE_USUARIO)); }
    catch { return null; }
  }

  function protegerPagina() {
    if (!usuario()) window.location.href = caminhoLogin();
  }

  function caminhoLogin() {
    return location.pathname.includes("/pages/") ? "../login.html" : "login.html";
  }

  function sair() {
    sessionStorage.removeItem(CHAVE_USUARIO);
    window.location.href = caminhoLogin();
  }

  function escapar(valor) {
    return String(valor ?? "").replace(/[&<>"']/g, caractere => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
    })[caractere]);
  }

  function formatarData(data) {
    if (!data) return "Não informada";
    const partes = data.split("-");
    return partes.length === 3 ? `${partes[2]}/${partes[1]}/${partes[0]}` : data;
  }

  function gerarId() {
    return "LOC-" + Date.now().toString(36).toUpperCase();
  }

  async function converterFotos(arquivos, limite = 4) {
    const selecionados = Array.from(arquivos || []).slice(0, limite);
    return Promise.all(selecionados.map(arquivo => new Promise((resolve, reject) => {
      if (!arquivo.type.startsWith("image/")) return resolve(null);
      const leitor = new FileReader();
      leitor.onload = () => {
        const imagem = new Image();
        imagem.onload = () => {
          const limite = 1200;
          const escala = Math.min(1, limite / Math.max(imagem.width, imagem.height));
          const canvas = document.createElement("canvas");
          canvas.width = Math.round(imagem.width * escala);
          canvas.height = Math.round(imagem.height * escala);
          const contexto = canvas.getContext("2d");
          contexto.drawImage(imagem, 0, 0, canvas.width, canvas.height);
          resolve({
            nome: arquivo.name,
            tipo: "image/jpeg",
            dados: canvas.toDataURL("image/jpeg", 0.72)
          });
        };
        imagem.onerror = reject;
        imagem.src = leitor.result;
      };
      leitor.onerror = reject;
      leitor.readAsDataURL(arquivo);
    }))).then(fotos => fotos.filter(Boolean));
  }

  function mostrarFotos(fotos, classe = "") {
    if (!fotos || !fotos.length) return '<p class="texto-suave">Nenhuma fotografia anexada.</p>';
    return `<div class="galeria ${classe}">${fotos.map(foto =>
      `<a href="${foto.dados}" target="_blank" rel="noopener"><img src="${foto.dados}" alt="${escapar(foto.nome)}"></a>`
    ).join("")}</div>`;
  }

  function notificarSaida() {
    document.querySelectorAll("[data-sair]").forEach(botao => botao.addEventListener("click", sair));
  }

  function hoje() {
    const agora = new Date();
    const local = new Date(agora.getTime() - agora.getTimezoneOffset() * 60000);
    return local.toISOString().slice(0, 10);
  }

  document.addEventListener("DOMContentLoaded", () => {
    notificarSaida();
    const nome = usuario()?.nome;
    document.querySelectorAll("[data-nome-usuario]").forEach(el => { if (nome) el.textContent = nome; });
  });

  return { listar, salvarLista, usuario, protegerPagina, sair, escapar, formatarData, gerarId, converterFotos, mostrarFotos, hoje };
})();
