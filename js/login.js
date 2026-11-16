Locadora.protegerPagina = (() => {
  // Na tela de login não há redirecionamento automático.
  return Locadora.protegerPagina;
})();

document.querySelector("#form-login").addEventListener("submit", function(event) {
  event.preventDefault();
  const email = document.querySelector("#email").value.trim().toLowerCase();
  const senha = document.querySelector("#senha").value;
  const mensagem = document.querySelector("#mensagem-login");

  if (email === "admin@locadora.com" && senha === "123456") {
    sessionStorage.setItem("locadora_usuario", JSON.stringify({ nome: "Administrador", email }));
    window.location.href = "dashboard.html";
  } else {
    mensagem.textContent = "E-mail ou senha incorretos. Confira os dados de demonstração.";
    mensagem.className = "mensagem-formulario erro";
  }
});
