/* Progressive enhancement: all profile and publication content also works without JS. */
document.documentElement.classList.add('js');
const toggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.nav');
if (toggle && nav) {
  const closeMenu = () => { nav.classList.remove('is-open'); toggle.setAttribute('aria-expanded', 'false'); toggle.textContent = 'Menu'; };
  toggle.addEventListener('click', () => { const open = nav.classList.toggle('is-open'); toggle.setAttribute('aria-expanded', String(open)); toggle.textContent = open ? 'Close' : 'Menu'; });
  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && nav.classList.contains('is-open')) { closeMenu(); toggle.focus(); } });
  document.addEventListener('click', event => { if (!event.target.closest('.site-header')) closeMenu(); });
}
const list = document.querySelector('.publication-list');
if (list) {
  const papers = [...list.querySelectorAll('.paper')];
  const search = document.querySelector('#publication-search');
  const filters = [...document.querySelectorAll('.filter')];
  const count = document.querySelector('#results-count');
  const empty = document.querySelector('#empty-state');
  const normalize = value => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  papers.forEach(paper => { paper.searchText = normalize(paper.textContent + ' ' + paper.dataset.topics); });
  let category = 'all';
  const applyFilters = () => {
    const terms = normalize(search.value.trim()).split(/\s+/).filter(Boolean);
    let visible = 0;
    papers.forEach(paper => { const matches = (category === 'all' || paper.dataset.type === category) && terms.every(term => paper.searchText.includes(term)); paper.hidden = !matches; if (matches) visible++; });
    count.textContent = `${visible} of ${papers.length} papers`;
    empty.hidden = visible !== 0;
  };
  filters.forEach(button => button.addEventListener('click', () => { category = button.dataset.filter; filters.forEach(filter => filter.setAttribute('aria-pressed', String(filter === button))); applyFilters(); }));
  search.addEventListener('input', applyFilters);
  document.querySelector('#reset-search').addEventListener('click', () => { search.value = ''; category = 'all'; filters.forEach(filter => filter.setAttribute('aria-pressed', String(filter.dataset.filter === 'all'))); applyFilters(); search.focus(); });
  applyFilters();
}
const status = document.querySelector('#copy-status');
document.querySelectorAll('.cite-button').forEach(button => button.addEventListener('click', async () => {
  const citation = button.closest('.paper').dataset.citation;
  try {
    if (!navigator.clipboard || !window.isSecureContext) throw new Error('Clipboard unavailable');
    await navigator.clipboard.writeText(citation);
    button.textContent = 'Copied';
    if (status) status.textContent = 'Citation copied to clipboard.';
    window.setTimeout(() => { button.textContent = 'Copy citation'; }, 2200);
  } catch {
    window.prompt('Copy this citation:', citation);
    if (status) status.textContent = 'Citation is available in the copy dialog.';
  }
}));
