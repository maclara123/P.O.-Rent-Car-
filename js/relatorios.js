Locadora.protegerPagina();

const listaRelatorios = document.querySelector("#lista-relatorios");
const detalheRelatorio = document.querySelector("#detalhe-relatorio");
const busca = document.querySelector("#busca-relatorio");
const filtro = document.querySelector("#filtro-status");
const idInicial = new URLSearchParams(location.search).get("id");

function renderizarLista() {
  const termo = busca.value.trim().toLowerCase();
  const status = filtro.value;
  const locacoes = Locadora.listar().filter(item => {
    const correspondeBusca = [item.id, item.placa, item.nomeCliente, item.modelo, item.marca].join(" ").toLowerCase().includes(termo);
    const correspondeStatus = status === "todos" || item.status === status;
    return correspondeBusca && correspondeStatus;
  }).reverse();

  listaRelatorios.innerHTML = locacoes.length ? locacoes.map(item => `
    <article class="relatorio-card">
      <div class="relatorio-card-topo"><span class="status ${item.status === "pendente" ? "status-pendente" : "status-finalizada"}">${item.status === "pendente" ? "Pendente" : "Finalizada"}</span><small>${Locadora.escapar(item.id)}</small></div>
      <h3>${Locadora.escapar(item.marca)} ${Locadora.escapar(item.modelo)} · ${Locadora.escapar(item.placa)}</h3>
      <p><strong>Cliente:</strong> ${Locadora.escapar(item.nomeCliente)} · <strong>Retirada:</strong> ${Locadora.formatarData(item.dataRetirada)}</p>
      <div class="relatorio-card-acoes"><button class="btn btn-principal" data-ver="${Locadora.escapar(item.id)}">Visualizar relatório</button>${item.status === "pendente" ? `<a class="btn btn-secundario" href="checkout.html?id=${encodeURIComponent(item.id)}">Fazer check-out</a>` : ""}</div>
    </article>`).join("") : '<div class="estado-vazio"><span>▤</span><h3>Nenhum relatório encontrado</h3><p>Altere os filtros ou registre um novo check-in.</p></div>';

  listaRelatorios.querySelectorAll("[data-ver]").forEach(botao => botao.addEventListener("click", () => visualizarRelatorio(botao.dataset.ver)));
}

function renderizarVistoria(vistoria, titulo) {
  if (!vistoria) return '<p class="texto-suave">Vistoria detalhada não disponível neste registro.</p>';
  const partes = (vistoria.partes || []).map(parte => `
    <article class="vistoria-item"><strong>${Locadora.escapar(parte.nome)}</strong>
      ${parte.foto ? Locadora.mostrarFotos([parte.foto]) : '<p>Sem foto.</p>'}
      <p class="relatorio-observacao"><strong>Observação:</strong> ${Locadora.escapar(parte.observacao || 'Nenhuma observação.')}</p>
    </article>`).join('');
  const a = vistoria.avarias || {};
  return `<h3 class="subtitulo-form">${titulo} — 8 partes do veículo</h3><div class="vistoria-grid">${partes}</div>
    <h3 class="subtitulo-form">Questionário de avarias</h3>
    <div class="dados-resumo">
      <div><small>Possui avaria?</small><strong>${Locadora.escapar(a.temAvaria || 'Não informado')}</strong></div>
      <div><small>Batida ou amassado?</small><strong>${Locadora.escapar(a.temBatida || 'Não informado')}</strong></div>
      <div><small>Riscos ou arranhões?</small><strong>${Locadora.escapar(a.temRiscos || 'Não informado')}</strong></div>
      <div><small>Danos em vidros, pneus ou faróis?</small><strong>${Locadora.escapar(a.temOutros || 'Não informado')}</strong></div>
    </div>
    <p class="relatorio-observacao"><strong>Descrição:</strong> ${Locadora.escapar(a.descricao || 'Nenhuma avaria descrita.')}</p>
    <h4>Fotos das avarias</h4>${Locadora.mostrarFotos(a.fotos || [])}`;
}

function visualizarRelatorio(id) {
  const item = Locadora.listar().find(locacao => locacao.id === id);
  if (!item) return;
  detalheRelatorio.classList.remove("oculto");
  detalheRelatorio.innerHTML = `
    <div class="relatorio-detalhe-topo"><div><span class="texto-suave">RELATÓRIO DA LOCAÇÃO</span><h2>${Locadora.escapar(item.id)}</h2></div><button class="btn btn-secundario" id="btn-imprimir">Imprimir relatório</button></div>
    <div class="relatorio-status"><span class="status ${item.status === "pendente" ? "status-pendente" : "status-finalizada"}">${item.status === "pendente" ? "Pendente de devolução" : "Locação finalizada"}</span></div>
    <h3 class="subtitulo-form">Check-in · Retirada</h3>
    <div class="dados-resumo">
      <div><small>Cliente</small><strong>${Locadora.escapar(item.nomeCliente)}</strong></div><div><small>CPF/CNPJ</small><strong>${Locadora.escapar(item.cpf)}</strong></div>
      <div><small>Telefone</small><strong>${Locadora.escapar(item.telefone)}</strong></div><div><small>CNH</small><strong>${Locadora.escapar(item.cnh)}</strong></div>
      <div><small>Veículo</small><strong>${Locadora.escapar(item.marca)} ${Locadora.escapar(item.modelo)}</strong></div><div><small>Placa</small><strong>${Locadora.escapar(item.placa)}</strong></div>
      <div><small>Ano / Cor</small><strong>${Locadora.escapar(item.ano)} / ${Locadora.escapar(item.cor || "Não informada")}</strong></div><div><small>KM de saída</small><strong>${Locadora.escapar(item.kmSaida)} km</strong></div>
      <div><small>Combustível</small><strong>${Locadora.escapar(item.nivelCombustivel)}</strong></div><div><small>Data e hora</small><strong>${Locadora.formatarData(item.dataRetirada)} às ${Locadora.escapar(item.horaRetirada)}</strong></div>
      <div><small>Funcionário</small><strong>${Locadora.escapar(item.funcionario)}</strong></div>
    </div>
    <p class="relatorio-observacao"><strong>Observações do check-in:</strong> ${Locadora.escapar(item.observacoes || "Nenhuma observação.")}</p>
    <h3 class="subtitulo-form">Fotos do Check-in</h3>${Locadora.mostrarFotos(item.fotosCheckin)}
    ${renderizarVistoria(item.vistoriaCheckin, "Vistoria do Check-in")}
    ${item.checkout ? `
      <hr class="linha-divisoria"><h3 class="subtitulo-form">Check-out · Devolução</h3>
      <div class="dados-resumo">
        <div><small>Data e hora</small><strong>${Locadora.formatarData(item.checkout.dataRetorno)} às ${Locadora.escapar(item.checkout.horaRetorno)}</strong></div>
        <div><small>KM de retorno</small><strong>${Locadora.escapar(item.checkout.kmRetorno)} km</strong></div>
        <div><small>Combustível no retorno</small><strong>${Locadora.escapar(item.checkout.combustivelRetorno)}</strong></div>
        <div><small>KM percorridos</small><strong>${Number(item.checkout.kmRetorno) - Number(item.kmSaida)} km</strong></div>
      </div>
      <p class="relatorio-observacao"><strong>Observações do check-out:</strong> ${Locadora.escapar(item.checkout.observacoesRetorno || "Nenhuma observação.")}</p>
      <h3 class="subtitulo-form">Fotos do Check-out</h3>${Locadora.mostrarFotos(item.checkout.fotosCheckout)}
      ${renderizarVistoria(item.checkout.vistoria, "Vistoria do Check-out")}
    ` : '<div class="aviso-pendente">O check-out desta locação ainda não foi realizado.</div>'}
  `;
  document.querySelector("#btn-imprimir").addEventListener("click", () => window.print());
  detalheRelatorio.scrollIntoView({ behavior: "smooth", block: "start" });
}

busca.addEventListener("input", renderizarLista);
filtro.addEventListener("change", renderizarLista);
renderizarLista();
if (idInicial) visualizarRelatorio(idInicial);
