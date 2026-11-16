Locadora.protegerPagina();
const formCheckin = document.querySelector("#form-checkin");
const partesVistoria = ["Frente","Traseira","Lateral direita","Lateral esquerda","Parte superior (teto)","Interior dianteiro","Interior traseiro","Porta-malas"];
let fotosPartes = [];
let fotosAvarias = [];

function valorRadio(nome) { return document.querySelector(`input[name="${nome}"]:checked`)?.value || ""; }
async function carregarFotoParte(indice) {
  const input = document.querySelector(`#checkin-foto-${indice}`);
  if (!input.files[0]) return null;
  const fotos = await Locadora.converterFotos([input.files[0]], 1);
  document.querySelector(`#checkin-preview-${indice}`).innerHTML = Locadora.mostrarFotos(fotos);
  return fotos[0] || null;
}
partesVistoria.forEach((nome, i) => document.querySelector(`#checkin-foto-${i}`).addEventListener("change", () => carregarFotoParte(i).catch(() => alert("Não foi possível carregar a imagem."))));
document.querySelector("#checkin-fotos-avarias").addEventListener("change", async e => {
  if (e.target.files.length > 4) alert("Você pode selecionar no máximo 4 fotos das avarias.");
  try { fotosAvarias = await Locadora.converterFotos(Array.from(e.target.files).slice(0,4),4); document.querySelector("#checkin-preview-avarias").innerHTML = Locadora.mostrarFotos(fotosAvarias); } catch { alert("Não foi possível carregar uma das imagens."); }
});
document.querySelector("#dataRetirada").value = Locadora.hoje();
document.querySelector("#checkin-ir-etapa2").addEventListener("click", async () => {
  try {
    fotosPartes = await Promise.all(partesVistoria.map((_,i)=>carregarFotoParte(i)));
    if (fotosPartes.some(x=>!x)) { alert("Anexe uma foto para cada uma das oito partes do veículo."); return; }
    document.querySelector("#checkin-etapa1").classList.add("oculto"); document.querySelector("#checkin-etapa2").classList.remove("oculto"); window.scrollTo({top:0,behavior:"smooth"});
  } catch { alert("Não foi possível processar as fotografias."); }
});
document.querySelector("#checkin-voltar-etapa1").addEventListener("click",()=>{document.querySelector("#checkin-etapa2").classList.add("oculto");document.querySelector("#checkin-etapa1").classList.remove("oculto");window.scrollTo({top:0,behavior:"smooth"});});
formCheckin.addEventListener("submit", async event => {
  event.preventDefault();
  if (document.querySelector("#checkin-etapa2").classList.contains("oculto")) { alert("Conclua as duas etapas da vistoria."); return; }
  const respostas = [valorRadio("checkin-tem-avaria"),valorRadio("checkin-tem-batida"),valorRadio("checkin-tem-riscos"),valorRadio("checkin-tem-outros")];
  if (respostas.some(x=>!x)) { alert("Responda todas as perguntas sobre as condições do veículo."); return; }
  const botao=formCheckin.querySelector('button[type="submit"]'); botao.disabled=true; botao.textContent="Salvando...";
  try {
    const locacoes=Locadora.listar(); const placa=document.querySelector("#placa").value.trim().toUpperCase();
    if(locacoes.some(item=>item.placa.toUpperCase()===placa&&item.status==="pendente")){alert("Já existe uma locação pendente para esta placa.");botao.disabled=false;botao.textContent="Salvar Check-in e visualizar relatório";return;}
    const vistoria={partes:partesVistoria.map((nome,i)=>({nome,foto:fotosPartes[i],observacao:document.querySelector(`#checkin-obs-${i}`).value.trim()})),avarias:{temAvaria:respostas[0],temBatida:respostas[1],temRiscos:respostas[2],temOutros:respostas[3],descricao:document.querySelector("#checkin-descricao-avarias").value.trim(),fotos:fotosAvarias}};
    const locacao={id:Locadora.gerarId(),criadoEm:new Date().toISOString(),status:"pendente",dataRetirada:document.querySelector("#dataRetirada").value,horaRetirada:document.querySelector("#horaRetirada").value,funcionario:document.querySelector("#funcionario").value.trim(),nomeCliente:document.querySelector("#nomeCliente").value.trim(),cpf:document.querySelector("#cpf").value.trim(),telefone:document.querySelector("#telefone").value.trim(),cnh:document.querySelector("#cnh").value.trim(),emailCliente:document.querySelector("#emailCliente").value.trim(),placa,marca:document.querySelector("#marca").value.trim(),modelo:document.querySelector("#modelo").value.trim(),ano:document.querySelector("#ano").value,cor:document.querySelector("#cor").value.trim(),kmSaida:document.querySelector("#kmSaida").value,combustivel:document.querySelector("#combustivel").value,nivelCombustivel:document.querySelector("#nivelCombustivel").value,observacoes:"",fotosCheckin:fotosPartes.filter(Boolean),vistoriaCheckin:vistoria,checkout:null};
    locacoes.push(locacao);Locadora.salvarLista(locacoes);window.location.href=`relatorios.html?id=${encodeURIComponent(locacao.id)}`;
  }catch(erro){console.error(erro);document.querySelector("#mensagem-checkin").textContent="Não foi possível salvar. O armazenamento do navegador pode estar cheio. Reduza o tamanho ou a quantidade das fotos.";botao.disabled=false;botao.textContent="Salvar Check-in e visualizar relatório";}
});
