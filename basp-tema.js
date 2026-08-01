/* =====================================================================
 * BASP — fundo compartilhado do ecossistema
 *
 * A foto de fundo é escolhida uma vez, no hub, e vale para o Copilot
 * inteiro. Ela mora em localStorage sob a MESMA chave usada pelo Studio e
 * pelo index.html (`basp_bg_image`) — por isso trocar a foto lá muda aqui
 * sem nenhum passo extra.
 *
 * Se o Bruno nunca escolheu uma, cai na foto padrão do Studio, já em cache
 * (`basp_copilot_bg_default`). Sem nenhuma das duas, o CSS resolve com o
 * ambiente dourado — nunca fica um retângulo vazio.
 *
 * Este script não faz requisição de rede, não depende da API e não quebra
 * a página se o localStorage estiver bloqueado.
 * ===================================================================== */

(function () {
  'use strict';

  var LS_BG = 'basp_bg_image';               // escolha do Bruno (Studio/hub)
  var LS_BG_DEFAULT = 'basp_copilot_bg_default'; // padrão herdado do Studio

  function camadas() {
    if (document.getElementById('basp-bg')) return;
    var bg = document.createElement('div');
    bg.id = 'basp-bg';
    var veu = document.createElement('div');
    veu.id = 'basp-bg-veu';
    // no início do body, para ficarem atrás de todo o conteúdo
    document.body.insertBefore(veu, document.body.firstChild);
    document.body.insertBefore(bg, document.body.firstChild);
  }

  function aplicar(dados) {
    camadas();
    var bg = document.getElementById('basp-bg');
    if (dados) {
      bg.style.backgroundImage = 'url(' + dados + ')';
      document.body.classList.add('tem-foto');
    } else {
      bg.style.backgroundImage = '';
      document.body.classList.remove('tem-foto');
    }
  }

  function carregar() {
    var foto = null;
    try { foto = localStorage.getItem(LS_BG) || localStorage.getItem(LS_BG_DEFAULT); }
    catch (e) { foto = null; }
    aplicar(foto);
  }

  /** Link discreto de volta ao hub, para não ficar preso dentro do módulo. */
  function voltar() {
    if (document.querySelector('.basp-voltar')) return;
    var alvo = document.querySelector('#app') || document.body;
    var a = document.createElement('a');
    a.className = 'basp-voltar';
    a.href = 'index.html';
    a.textContent = '← Copilot';
    a.style.margin = '18px 0 0';
    alvo.appendChild(a);
  }

  function iniciar() { carregar(); voltar(); }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', iniciar);
  } else {
    iniciar();
  }

  // Trocou a foto noutra aba do Copilot? esta acompanha.
  window.addEventListener('storage', function (e) {
    if (e.key === LS_BG || e.key === LS_BG_DEFAULT) carregar();
  });
})();
