
const EPIS_PADRAO = [
  { epi: "Respirador PFF2", marca: "3M", ca: "9626", validade: "5" },
  { epi: "Respirador PFF2", marca: "Delta plus", ca: "38503", validade: "5" },
  { epi: "Respirador PFF2", marca: "Delta plus", ca: "38507", validade: "5" },
  { epi: "Respirador Semi Facial", marca: "3M", ca: "4115", validade: "360" },
  { epi: "Respirador Semi Facial", marca: "Moldex", ca: "11017", validade: "360" },
  { epi: "Creme de Proteção da Pele", marca: "Nutriex", ca: "43802", validade: "15" },
  { epi: "Brusão de PVC", marca: "Plastseg", ca: "34420", validade: "15" },
  { epi: "Brusão de PVC", marca: "Plast Cor", ca: "36254", validade: "15" },
  { epi: "Brusão de PVC", marca: "Maicol do Brasil", ca: "37537", validade: "15" },
  { epi: "Calça Impermeável ( PVC)", marca: "Maicol do Brasil", ca: "37536", validade: "15" },
  { epi: "Capa de Chuva (PVC)", marca: "Standard", ca: "28449", validade: "15" },
  { epi: "Cartucho Mecânico para pintura", marca: "3M", ca: "4115", validade: "15" },
  { epi: "Cartucho Mecânico para pintura", marca: "Moldex", ca: "11017", validade: "7" },
  { epi: "Cinta Ergonômica", marca: "STEELFLEX", ca: "STEELFLEX", validade: "180" },
  { epi: "Cinto de Segurança Paraquedista", marca: "Camper", ca: "45433", validade: "360" },
  { epi: "Talabarte Duplo", marca: "Camper", ca: "45433", validade: "360" },
  { epi: "Filtro VO - Pintura", marca: "3M", ca: "4115", validade: "3" },
  { epi: "Filtro VO - Pintura", marca: "Moldex", ca: "11017", validade: "3" },
  { epi: "Protetor Facial", marca: "Plastcor", ca: "15019", validade: "60" },
  { epi: "Perneira - Corvim", marca: "Sayro", ca: "14750", validade: "360" },
  { epi: "Capacete de segurança com jugular", marca: "MSA", ca: "498", validade: "360" },
  { epi: "Brusão de PVC", marca: "Plast Car", ca: "36254", validade: "15" },
  { epi: "Capacete de segurança com jugular", marca: "Ultra Plug", ca: "12.354 -12.389", validade: "360" },
  { epi: "Bota de Segurança B. aço", marca: "Marluvas", ca: "43339", validade: "180" },
  { epi: "Bota de Segurança B. composite /plástico", marca: "Marluvas", ca: "43377", validade: "180" },
  { epi: "Bota de Segurança B. composite /plástico", marca: "Carton", ca: "29391", validade: "180" },
  { epi: "Bota de Segurança B. aço", marca: "Kadesh", ca: "36935", validade: "180" },
  { epi: "Bota 7 Leguas", marca: "Marluvas", ca: "48254", validade: "120" },
  { epi: "Oculos de segurança sobrepor – Art móvel", marca: "Uvex", ca: "18833", validade: "60" },
  { epi: "Oculos de segurança Incolor", marca: "Volk Brasil", ca: "42716", validade: "60" },
  { epi: "Oculos de segurança Incolor", marca: "Kalypso", ca: "11268", validade: "60" },
  { epi: "Oculos de segurança escuro", marca: "Volk Brasil", ca: "42717", validade: "60" },
  { epi: "Oculos de segurança sobrepor", marca: "Volk Brasil", ca: "42718", validade: "60" },
  { epi: "Oculos de segurança Incolor – AMPLA VISÃO", marca: "Volk Brasil", ca: "42919", validade: "60" },
  { epi: "-----------colher inox", marca: "talheres brasil", ca: "433919", validade: "60" }
];
/* Ficha por colaborador (modelo da planilha Google) + Kits de EPIs.
   Carregar DEPOIS do script principal do planilha.html. Não altera a planilha existente. */
(() => {
  const $ = id => document.getElementById(id);
  const MESES = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
  const KITS_KEY = 'epis-kits';
  const itemKey = c => [c.epi, c.marca || '', c.ca || ''].join('|');
  const newId = () => (crypto.randomUUID ? crypto.randomUUID() : String(Date.now() + Math.random()));
  let kits = loadJSON(KITS_KEY); // [{ id, nome, itens: [{epi, marca, ca}] }]
  const saveKits = () => { try { localStorage.setItem(KITS_KEY, JSON.stringify(kits)); } catch (e) {} };
  const names = () => [...new Set(records.map(r => r.nome).filter(Boolean))].sort((a, b) => a.localeCompare(b, 'pt'));

  document.head.append(el('style', { textContent: `
    .foot td { font-weight: 700; background: var(--green-banner); }
    #fcTable td { text-align: center; } #fcTable td.l { text-align: left; }
    #fcTable th[colspan] { text-align: left; background: #fff; }
    #kitChecks { max-height: 200px; overflow: auto; display: grid; gap: 6px; }
    .chk { flex-direction: row; font-weight: 400; gap: 8px; align-items: center; }` }));

  document.body.insertAdjacentHTML('beforeend', `
<datalist id="nomesList"></datalist>
<dialog id="fichaDlg" style="width:min(1200px,96vw)">
  <h3>Ficha do colaborador</h3>
  <div class="fields">
    <label>Colaborador <select id="fcNome"></select></label>
    <label>Kit para conferir <select id="fcKit"></select></label>
    <label class="full chk"><input type="checkbox" id="fcAll"> Mostrar todos os EPIs da planilha (senão, só os retirados e os do kit)</label>
  </div>
  <div class="venc-box" id="fcInfo" style="margin:14px 0"></div>
  <div class="table-wrap" style="max-height:55vh;overflow:auto"><table id="fcTable" style="min-width:1000px"></table></div>
  <p class="hint" style="margin-top:10px">Nas células aparecem os <strong>dias</strong> do mês em que o EPI foi retirado. ★ = EPI do kit selecionado.</p>
  <div class="form-actions"><button type="button" class="btn" id="closeFicha">Fechar</button></div>
</dialog>
<dialog id="kitDlg">
  <h3>Kits de EPIs</h3>
  <p class="hint">Kit é o conjunto de EPIs que o colaborador geralmente retira. Crie o kit uma vez e registre tudo de uma só vez.</p>
  <div class="fields">
    <label class="full">Nome do kit <input id="kitName" placeholder="Ex.: Kit Pintor"></label>
    <div class="full pick" id="kitChecks"></div>
  </div>
  <div class="form-actions"><button type="button" class="btn primary" id="saveKit">Salvar kit</button></div>
  <h3 style="margin:22px 0 12px">Registrar retirada de kit</h3>
  <div class="fields">
    <label>Kit <select id="rkKit"></select></label>
    <label>Data de retirada <input id="rkData" type="date"></label>
    <label>Nome <input id="rkNome" list="nomesList"></label>
    <label>Cargo <input id="rkCargo"></label>
    <label>Empresa <input id="rkEmpresa"></label>
    <label>Assinou? <select id="rkAssinou"><option>Sim</option><option>Não</option></select></label>
  </div>
  <div class="cat-msg" id="kitMsg" style="margin-top:12px"></div>
  <div class="form-actions">
    <button type="button" class="btn danger" id="delKit">Excluir kit selecionado</button>
    <button type="button" class="btn primary" id="regKit">Registrar kit</button>
    <button type="button" class="btn" id="closeKit">Fechar</button>
  </div>
</dialog>`);

  const tools = document.querySelector('.tools');
  tools.insertBefore(el('button', { className: 'btn', id: 'fichaBtn', type: 'button', textContent: 'Ficha por colaborador' }), $('catBtn'));
  tools.insertBefore(el('button', { className: 'btn', id: 'kitBtn', type: 'button', textContent: 'Kits' }), $('catBtn'));

  /* ---------- Ficha (EPI x mês, mostrando os dias) ---------- */
  function renderFicha() {
    const nome = $('fcNome').value;
    const mine = records.filter(r => r.nome === nome);
    const kit = kits.find(k => k.id === $('fcKit').value);
    const kitKeys = new Set((kit ? kit.itens : []).map(itemKey));
    const first = mine[0] || {};
    $('fcInfo').textContent = nome ? `${nome} · ${first.cargo || '—'} · ${first.empresa || '—'} · ${year}` : 'Nenhum colaborador com registros neste ano.';

    const grade = {}; // chave do EPI -> [mês] -> [dias]
    mine.forEach(r => {
      if (!r.retirada) return;
      const k = itemKey(r), m = +r.retirada.slice(5, 7) - 1;
      grade[k] = grade[k] || []; grade[k][m] = grade[k][m] || [];
      grade[k][m].push(r.retirada.slice(8, 10));
    });

    const rows = catalog.map(c => ({ ...c, grupo: c.grupo || 'Outros' }));
    const known = new Set(rows.map(itemKey));
    mine.forEach(r => { const k = itemKey(r); if (!known.has(k)) { known.add(k); rows.push({ epi: r.epi, marca: r.marca, ca: r.ca, grupo: 'Outros' }); } });
    const show = rows.filter(c => $('fcAll').checked || grade[itemKey(c)] || kitKeys.has(itemKey(c)));

    const body = el('tbody'); let g = null;
    show.forEach(c => {
      const k = itemKey(c), cells = grade[k] || []; let total = 0;
      if (c.grupo !== g) { g = c.grupo; body.append(el('tr', {}, [el('th', { colSpan: 16, textContent: g })])); }
      const tds = MESES.map((_, m) => {
        const d = cells[m] || []; total += d.length;
        return el('td', { textContent: d.join(', '), title: d.length ? `${d.length} unidade(s)` : '' });
      });
      body.append(el('tr', {}, [
        el('td', { className: 'l', textContent: c.epi + (kitKeys.has(k) ? ' ★' : '') }),
        el('td', { className: 'l', textContent: c.marca || '—' }),
        el('td', { className: 'l', textContent: c.ca || '—' }),
        ...tds, el('td', { textContent: total || '' })
      ]));
    });

    const keys = Object.keys(grade), at = (k, m) => (grade[k] && grade[k][m]) || [];
    const unid = MESES.map((_, m) => keys.reduce((s, k) => s + at(k, m).length, 0));
    const tipos = MESES.map((_, m) => keys.filter(k => at(k, m).length).length);
    const kitOk = MESES.map((_, m) => !kit ? '' : [...kitKeys].every(k => at(k, m).length) ? '✓' : '—');
    const foot = (label, arr, tot) => el('tr', { className: 'foot' }, [
      el('td', { className: 'l', colSpan: 3, textContent: label }),
      ...arr.map(v => el('td', { textContent: v })), el('td', { textContent: tot })
    ]);
    body.append(
      foot('TOTAL DE UNIDADES NO MÊS', unid, unid.reduce((a, b) => a + b, 0)),
      foot('TIPOS DE EPI RETIRADOS NO MÊS', tipos, ''),
      foot(kit ? `KIT COMPLETO NO MÊS (${kit.nome})` : 'KIT COMPLETO NO MÊS (escolha um kit)', kitOk, '')
    );

    $('fcTable').replaceChildren(
      el('thead', {}, [el('tr', {}, ['EPI', 'Marca', 'CA', ...MESES, 'Total'].map(t => el('th', { textContent: t })))]),
      body
    );
  }

  $('fichaBtn').onclick = () => {
    $('fcNome').replaceChildren(...names().map(n => el('option', { value: n, textContent: n })));
    $('fcKit').replaceChildren(el('option', { value: '', textContent: 'Sem kit' }), ...kits.map(k => el('option', { value: k.id, textContent: k.nome })));
    renderFicha(); $('fichaDlg').showModal();
  };
  ['fcNome', 'fcKit', 'fcAll'].forEach(id => $(id).addEventListener('change', renderFicha));
  $('closeFicha').onclick = () => $('fichaDlg').close();

  /* ---------- Kits ---------- */
  const kitMsg = (t, kind = '') => { $('kitMsg').textContent = t; $('kitMsg').className = `cat-msg ${kind}`; };

  function renderKitUI() {
    $('kitChecks').replaceChildren(...catalog.map((c, i) => el('label', { className: 'chk' }, [
      Object.assign(el('input'), { type: 'checkbox', value: String(i) }), labelOf(c)
    ])));
    $('rkKit').replaceChildren(...kits.map(k => el('option', { value: k.id, textContent: `${k.nome} (${k.itens.length} EPIs)` })));
    $('nomesList').replaceChildren(...names().map(n => el('option', { value: n })));
  }

  $('kitBtn').onclick = () => { renderKitUI(); kitMsg(''); $('rkData').value = todayISO; $('kitDlg').showModal(); };
  $('closeKit').onclick = () => $('kitDlg').close();

  $('saveKit').onclick = () => {
    const nome = $('kitName').value.trim();
    const itens = [...$('kitChecks').querySelectorAll('input:checked')].map(i => {
      const c = catalog[+i.value]; return { epi: c.epi, marca: c.marca, ca: c.ca };
    });
    if (!nome || !itens.length) return kitMsg('Informe o nome do kit e marque ao menos um EPI.', 'err');
    kits.push({ id: newId(), nome, itens }); saveKits();
    $('kitName').value = ''; renderKitUI(); kitMsg(`Kit "${nome}" salvo com ${itens.length} EPI(s).`, 'ok');
  };

  $('delKit').onclick = () => {
    const k = kits.find(x => x.id === $('rkKit').value);
    if (k && confirm(`Excluir o kit "${k.nome}"? Os registros já feitos não são afetados.`)) {
      kits = kits.filter(x => x !== k); saveKits(); renderKitUI(); kitMsg('Kit excluído.', 'ok');
    }
  };

  $('rkNome').addEventListener('change', () => {
    const r = records.find(x => x.nome === $('rkNome').value);
    if (r) { $('rkCargo').value = r.cargo || ''; $('rkEmpresa').value = r.empresa || ''; }
  });

  $('regKit').onclick = () => {
    const kit = kits.find(k => k.id === $('rkKit').value);
    const nome = $('rkNome').value.trim(), data = $('rkData').value;
    if (!kit || !nome || !data) return kitMsg('Escolha o kit, o nome do colaborador e a data.', 'err');
    kit.itens.forEach(it => {
      const c = catalog.find(x => itemKey(x) === itemKey(it));
      const validade = c ? c.validade : '';
      records.push({
        id: newId(), nome, cargo: $('rkCargo').value.trim(), empresa: $('rkEmpresa').value.trim(), situacao: 'Ativo',
        epi: it.epi, marca: it.marca, ca: it.ca, retirada: data, assinou: $('rkAssinou').value,
        validade, vencimento: computeVenc(validade, data), kit: kit.nome
      });
    });
    saveRecords(); render(); renderKitUI();
    kitMsg(`${kit.itens.length} EPI(s) do kit "${kit.nome}" registrados para ${nome}.`, 'ok');
  };
})();

