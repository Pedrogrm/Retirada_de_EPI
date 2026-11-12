  // >>> Ajuste aqui a rota da sua página de planilha (CRUD) <<<
  const sheetUrl = (year) => `planilha.html?ano=${year}`;

  const STORAGE_KEY = 'anos-cards';
  const grid = document.getElementById('grid');
  const dialog = document.getElementById('yearDialog');
  const yearInput = document.getElementById('yearInput');
  const yearError = document.getElementById('yearError');

  // Lista simples de anos, ex.: [2025, 2026]
  // Troque load()/save() por chamadas à sua API quando tiver o backend.
  let years = load();

  function load() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (Array.isArray(saved)) return saved;
    } catch (e) {}
    return [new Date().getFullYear()];
  }
  function save() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(years)); } catch (e) {}
  }

  function el(tag, props = {}, children = []) {
    const node = Object.assign(document.createElement(tag), props);
    children.forEach(c => node.append(c));
    return node;
  }

  function render() {
    grid.replaceChildren();
    [...years].sort((a, b) => a - b).forEach(year => {
      const link = el('a', { href: sheetUrl(year), ariaLabel: `Abrir planilha de ${year}` }, [
        el('h2', { textContent: year }),
        el('span', { textContent: 'Abrir planilha →' })
      ]);
      const remove = el('button', { className: 'remove', textContent: '×', title: 'Remover ano', type: 'button' });
      remove.onclick = () => {
        if (confirm(`Remover o ano ${year}?`)) {
          years = years.filter(y => y !== year); save(); render();
        }
      };
      const edit = el('button', { className: 'edit', textContent: '✎', title: 'Editar ano', type: 'button' });
      edit.onclick = () => openDialog(year);
      grid.append(el('div', { className: 'card' }, [link, edit, remove]));
    });

    const newCard = el('button', { className: 'new-card', textContent: '+ Novo ano', type: 'button' });
    newCard.onclick = () => openDialog();
    grid.append(newCard);
  }

  let editingYear = null; // null = criando; número = editando esse ano

  function openDialog(editYear = null) {
    editingYear = editYear;
    document.getElementById('dialogTitle').textContent = editYear === null ? 'Novo ano' : 'Editar ano';
    document.getElementById('submitBtn').textContent = editYear === null ? 'Criar' : 'Salvar';
    yearInput.value = editYear !== null
      ? editYear
      : Math.max(new Date().getFullYear(), ...years.map(y => y + 1));
    yearError.textContent = '';
    dialog.showModal();
    yearInput.select();
  }

  document.getElementById('openYear').onclick = () => openDialog();
  document.getElementById('cancelYear').onclick = () => dialog.close();
  document.getElementById('yearForm').addEventListener('submit', e => {
    const year = parseInt(yearInput.value, 10);
    if (year !== editingYear && years.includes(year)) {
      e.preventDefault();
      yearError.textContent = 'Esse ano já existe.';
      return;
    }
    if (editingYear !== null) {
      // Se o seu backend guarda os dados por ano, atualize o ano lá também (ex.: PUT /anos/{editingYear})
      years = years.map(y => (y === editingYear ? year : y));
    } else {
      years.push(year);
    }
    save(); render();
  });

  render();
