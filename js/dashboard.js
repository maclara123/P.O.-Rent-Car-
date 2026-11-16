Locadora.protegerPagina();

const usuarioAtual = Locadora.usuario();
if (usuarioAtual) {
  document.querySelector("#nome-usuario").textContent = usuarioAtual.nome;
  document.querySelector("#saudacao-usuario").textContent = usuarioAtual.nome;
}
document.querySelector("#data-atual").textContent = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "full"
}).format(new Date());

function atualizarPainel() {
  const locacoes = Locadora.listar();
  const pendentes = locacoes.filter(item => item.status === "pendente");
  const finalizadas = locacoes.filter(item => item.status === "finalizada");
  document.querySelector("#total-pendentes").textContent = pendentes.length;
  document.querySelector("#total-checkins").textContent = locacoes.length;
  document.querySelector("#total-checkouts").textContent = finalizadas.length;

  const corpo = document.querySelector("#ultimas-locacoes");
  const recentes = [...locacoes].reverse().slice(0, 5);
  corpo.innerHTML = recentes.length ? recentes.map(item => `
    <tr>
      <td>${Locadora.escapar(item.id)}</td>
      <td>${Locadora.escapar(item.nomeCliente)}</td>
      <td>${Locadora.escapar(item.marca)} ${Locadora.escapar(item.modelo)}</td>
      <td>${Locadora.escapar(item.placa)}</td>
      <td><span class="status ${item.status === "pendente" ? "status-pendente" : "status-finalizada"}">${item.status === "pendente" ? "Pendente" : "Finalizada"}</span></td>
    </tr>`).join("") : '<tr><td colspan="5" class="tabela-vazia">Nenhuma locação cadastrada.</td></tr>';
}
atualizarPainel();
