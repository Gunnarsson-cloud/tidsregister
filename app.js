// Enkel SPA för projekt- och tiduppföljning
// All data lagras i localStorage så att appen fungerar statiskt (t.ex. via GitHub Pages)

const STORAGE_KEY = 'hbg_projekt_tid_v2';
const DEFAULT_HOURLY_RATE = 900;

let state = {
  projects: [],
  people: [],
  entries: []
};

let charts = {
  projects: null,
  people: null
};

function loadState() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      initDemoData();
      saveState();
      return;
    }
    const parsed = JSON.parse(raw);
    state = Object.assign({ projects: [], people: [], entries: [] }, parsed);
  } catch (e) {
    console.error('Kunde inte läsa state, initierar om:', e);
    initDemoData();
    saveState();
  }
}

function saveState() {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function initDemoData() {
  // Skapa 4 projekt
  const p1 = createId();
  const p2 = createId();
  const p3 = createId();
  const p4 = createId();

  state.projects = [
    { id: p1, name: 'Översiktsplan 2040', code: 'P-001', hourlyRate: 950, status: 'active' },
    { id: p2, name: 'Ny cykelväg centrum–Väla', code: 'P-002', hourlyRate: 900, status: 'active' },
    { id: p3, name: 'Digitalisering bygglovsprocess', code: 'P-003', hourlyRate: 1000, status: 'active' },
    { id: p4, name: 'Grönområdesinventering 2025', code: 'P-004', hourlyRate: 880, status: 'active' }
  ];

  // Skapa 5 medarbetare
  const a = createId();
  const b = createId();
  const c = createId();
  const d = createId();
  const e = createId();

  state.people = [
    { id: a, name: 'Andreas Gunnarsson', role: 'Projektledare', hourlyRate: 950, active: true },
    { id: b, name: 'Anna Andersson', role: 'Planarkitekt', hourlyRate: 900, active: true },
    { id: c, name: 'Erik Nilsson', role: 'Trafikplanerare', hourlyRate: 850, active: true },
    { id: d, name: 'Maria Lindström', role: 'GIS-ingenjör', hourlyRate: 875, active: true },
    { id: e, name: 'Johan Persson', role: 'Projektcontroller', hourlyRate: 1000, active: true }
  ];

  const today = new Date();
  function dateMinusDays(days) {
    const d = new Date(today);
    d.setDate(d.getDate() - days);
    return d.toISOString().slice(0, 10);
  }

  // Demo-tidrader (ca 20 st) över de senaste dagarna
  state.entries = [
    { id: createId(), date: dateMinusDays(5), personId: a, projectId: p1, hours: 4, activity: 'Projektering', comment: 'Förberedelse inför samråd.' },
    { id: createId(), date: dateMinusDays(5), personId: b, projectId: p1, hours: 3.5, activity: 'Projektering', comment: 'Planunderlag.' },
    { id: createId(), date: dateMinusDays(5), personId: c, projectId: p2, hours: 5, activity: 'Projektering', comment: 'Sträckningsanalys.' },

    { id: createId(), date: dateMinusDays(4), personId: d, projectId: p3, hours: 4, activity: 'Möte', comment: 'Workshop digitala flöden.' },
    { id: createId(), date: dateMinusDays(4), personId: e, projectId: p3, hours: 2, activity: 'Administration', comment: 'Budgetuppföljning.' },
    { id: createId(), date: dateMinusDays(4), personId: a, projectId: p2, hours: 3, activity: 'Möte', comment: 'Avstämning med trafik.' },

    { id: createId(), date: dateMinusDays(3), personId: b, projectId: p4, hours: 6, activity: 'Projektering', comment: 'Underlag grönstruktur.' },
    { id: createId(), date: dateMinusDays(3), personId: d, projectId: p4, hours: 4, activity: 'Projektering', comment: 'GIS-analys parker.' },
    { id: createId(), date: dateMinusDays(3), personId: c, projectId: p2, hours: 2.5, activity: 'Samråd', comment: 'Dialog med boende.' },

    { id: createId(), date: dateMinusDays(2), personId: a, projectId: p1, hours: 5, activity: 'Projektering', comment: 'Revidering av planförslag.' },
    { id: createId(), date: dateMinusDays(2), personId: e, projectId: p3, hours: 3.5, activity: 'Administration', comment: 'Rapport till styrgrupp.' },
    { id: createId(), date: dateMinusDays(2), personId: c, projectId: p2, hours: 4, activity: 'Projektering', comment: 'Cykelvägssektioner.' },

    { id: createId(), date: dateMinusDays(1), personId: b, projectId: p1, hours: 3, activity: 'Möte', comment: 'Intern avstämning.' },
    { id: createId(), date: dateMinusDays(1), personId: d, projectId: p4, hours: 2.5, activity: 'Projektering', comment: 'Detaljjusteringar.' },
    { id: createId(), date: dateMinusDays(1), personId: a, projectId: p3, hours: 2, activity: 'Möte', comment: 'Styrgruppsmöte.' },

    { id: createId(), date: dateMinusDays(0), personId: c, projectId: p2, hours: 3.5, activity: 'Projektering', comment: 'Slutlig dragning.' },
    { id: createId(), date: dateMinusDays(0), personId: b, projectId: p4, hours: 4, activity: 'Samråd', comment: 'Möte med parkförvaltning.' },
    { id: createId(), date: dateMinusDays(0), personId: e, projectId: p3, hours: 2.5, activity: 'Administration', comment: 'Ekonomisammanställning.' },
    { id: createId(), date: dateMinusDays(0), personId: a, projectId: p1, hours: 1.5, activity: 'Annat', comment: 'Kort uppföljning.' }
  ];
}

function createId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

// --- DOM helpers ---

function $(selector) {
  return document.querySelector(selector);
}

function $all(selector) {
  return Array.from(document.querySelectorAll(selector));
}

// --- Init ---

document.addEventListener('DOMContentLoaded', () => {
  loadState();
  setupNav();
  setupForms();
  renderAll();
  animateOverview(); // kör på första sidan
});

function setupNav() {
  const buttons = $all('.nav-btn');
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const viewId = btn.dataset.view;
      buttons.forEach(b => b.classList.toggle('active', b === btn));
      $all('.view').forEach(v => v.classList.toggle('active', v.id === viewId));

      if (viewId === 'view-overview') {
        animateOverview();
      } else if (viewId === 'view-pps') {
        animatePPS();
      } else if (viewId === 'view-dashboard') {
        renderDashboard(); // säkerställ uppdatering och animation
      }
    });
  });
}

function setupForms() {
  const dateInput = $('#time-date');
  if (dateInput) {
    const today = new Date().toISOString().slice(0, 10);
    dateInput.value = today;
  }

  $('#time-form').addEventListener('submit', handleTimeSubmit);
  $('#project-form').addEventListener('submit', handleProjectSubmit);
  $('#person-form').addEventListener('submit', handlePersonSubmit);

  $('#recent-limit').addEventListener('change', renderRecentEntries);
  $('#filter-apply').addEventListener('click', () => renderDashboard());
  $('#filter-clear').addEventListener('click', () => {
    $('#filter-from').value = '';
    $('#filter-to').value = '';
    $('#filter-project').value = '';
    $('#filter-person').value = '';
    renderDashboard();
  });
}

// --- Form handlers ---

function handleTimeSubmit(e) {
  e.preventDefault();
  const date = $('#time-date').value;
  const personId = $('#time-person').value;
  const projectId = $('#time-project').value;
  const hours = parseFloat($('#time-hours').value || '0');
  const activity = $('#time-activity').value || '';
  const comment = $('#time-comment').value || '';

  const msgEl = $('#time-message');

  if (!date || !personId || !projectId || !(hours > 0)) {
    msgEl.textContent = 'Fyll i datum, medarbetare, projekt och antal timmar.';
    msgEl.style.color = '#b91c1c';
    return;
  }

  const entry = {
    id: createId(),
    date,
    personId,
    projectId,
    hours,
    activity,
    comment
  };

  state.entries.push(entry);
  saveState();

  $('#time-hours').value = '';
  $('#time-comment').value = '';

  msgEl.textContent = 'Tidraden sparades.';
  msgEl.style.color = '#059669';
  setTimeout(() => (msgEl.textContent = ''), 2500);

  renderRecentEntries();
  renderOverview();
  renderDashboard();
}

function handleProjectSubmit(e) {
  e.preventDefault();
  const name = $('#project-name').value.trim();
  const code = $('#project-code').value.trim();
  const rateRaw = $('#project-rate').value;
  const status = $('#project-status').value;

  const msgEl = $('#project-message');

  if (!name) {
    msgEl.textContent = 'Ange projektnamn.';
    msgEl.style.color = '#b91c1c';
    return;
  }

  const project = {
    id: createId(),
    name,
    code: code || '',
    hourlyRate: rateRaw ? parseFloat(rateRaw) : null,
    status
  };

  state.projects.push(project);
  saveState();

  $('#project-name').value = '';
  $('#project-code').value = '';
  $('#project-rate').value = '';
  $('#project-status').value = 'active';

  msgEl.textContent = 'Projektet lades till.';
  msgEl.style.color = '#059669';
  setTimeout(() => (msgEl.textContent = ''), 2500);

  renderProjects();
  renderProjectOptions();
  renderOverview();
  renderDashboard();
}

function handlePersonSubmit(e) {
  e.preventDefault();
  const name = $('#person-name').value.trim();
  const role = $('#person-role').value.trim();
  const rateRaw = $('#person-rate').value;
  const activeVal = $('#person-active').value === 'true';

  const msgEl = $('#person-message');

  if (!name) {
    msgEl.textContent = 'Ange namn.';
    msgEl.style.color = '#b91c1c';
    return;
  }

  const person = {
    id: createId(),
    name,
    role: role || '',
    hourlyRate: rateRaw ? parseFloat(rateRaw) : null,
    active: activeVal
  };

  state.people.push(person);
  saveState();

  $('#person-name').value = '';
  $('#person-role').value = '';
  $('#person-rate').value = '';
  $('#person-active').value = 'true';

  msgEl.textContent = 'Medarbetaren lades till.';
  msgEl.style.color = '#059669';
  setTimeout(() => (msgEl.textContent = ''), 2500);

  renderPeople();
  renderPersonOptions();
  renderOverview();
  renderDashboard();
}

// --- Rendering ---

function renderAll() {
  renderProjects();
  renderPeople();
  renderProjectOptions();
  renderPersonOptions();
  renderRecentEntries();
  renderOverview();
  renderDashboard();
}

function renderProjects() {
  const tbody = $('#projects-table tbody');
  tbody.innerHTML = '';

  state.projects
    .slice()
    .sort((a, b) => a.name.localeCompare(b.name, 'sv'))
    .forEach(p => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${escapeHtml(p.name)}</td>
        <td>${p.code ? escapeHtml(p.code) : '-'}</td>
        <td>${p.status === 'active' ? 'Aktivt' : 'Avslutat'}</td>
        <td>${p.hourlyRate ? p.hourlyRate.toLocaleString('sv-SE') + ' kr' : '-'}</td>
      `;
      tbody.appendChild(tr);
    });
}

function renderPeople() {
  const tbody = $('#people-table tbody');
  tbody.innerHTML = '';

  state.people
    .slice()
    .sort((a, b) => a.name.localeCompare(b.name, 'sv'))
    .forEach(p => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${escapeHtml(p.name)}</td>
        <td>${p.role ? escapeHtml(p.role) : '-'}</td>
        <td>${p.active ? 'Aktiv' : 'Inaktiv'}</td>
        <td>${p.hourlyRate ? p.hourlyRate.toLocaleString('sv-SE') + ' kr' : '-'}</td>
      `;
      tbody.appendChild(tr);
    });
}

function renderProjectOptions() {
  const selects = ['#time-project', '#filter-project'];
  const projectOptions = state.projects
    .filter(p => p.status === 'active')
    .sort((a, b) => a.name.localeCompare(b.name, 'sv'));

  selects.forEach(sel => {
    const el = $(sel);
    if (!el) return;

    const current = el.value;
    el.innerHTML = '';

    if (sel === '#filter-project') {
      const optAll = document.createElement('option');
      optAll.value = '';
      optAll.textContent = 'Alla projekt';
      el.appendChild(optAll);
    }

    projectOptions.forEach(p => {
      const opt = document.createElement('option');
      opt.value = p.id;
      opt.textContent = p.name;
      el.appendChild(opt);
    });

    if (current && [...el.options].some(o => o.value === current)) {
      el.value = current;
    }
  });
}

function renderPersonOptions() {
  const selects = ['#time-person', '#filter-person'];
  const peopleOptions = state.people
    .filter(p => p.active)
    .sort((a, b) => a.name.localeCompare(b.name, 'sv'));

  selects.forEach(sel => {
    const el = $(sel);
    if (!el) return;

    const current = el.value;
    el.innerHTML = '';

    if (sel === '#filter-person') {
      const optAll = document.createElement('option');
      optAll.value = '';
      optAll.textContent = 'Alla medarbetare';
      el.appendChild(optAll);
    }

    peopleOptions.forEach(p => {
      const opt = document.createElement('option');
      opt.value = p.id;
      opt.textContent = p.name;
      el.appendChild(opt);
    });

    if (current && [...el.options].some(o => o.value === current)) {
      el.value = current;
    }
  });
}

function renderRecentEntries() {
  const tbody = $('#recent-entries-table tbody');
  if (!tbody) return;
  tbody.innerHTML = '';

  const limit = parseInt($('#recent-limit').value || '10', 10);

  const entriesSorted = state.entries
    .slice()
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, limit);

  entriesSorted.forEach(e => {
    const person = state.people.find(p => p.id === e.personId);
    const project = state.projects.find(p => p.id === e.projectId);

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${e.date}</td>
      <td>${person ? escapeHtml(person.name) : '–'}</td>
      <td>${project ? escapeHtml(project.name) : '–'}</td>
      <td>${e.hours}</td>
      <td>${e.activity ? escapeHtml(e.activity) : '–'}</td>
      <td>${e.comment ? escapeHtml(e.comment) : ''}</td>
    `;
    tbody.appendChild(tr);
  });
}

// --- Översikt ---

function renderOverview() {
  const activeProjects = state.projects.filter(p => p.status === 'active');
  const activePeople = state.people.filter(p => p.active);

  const totalHours = state.entries.reduce((sum, e) => sum + e.hours, 0);
  const totalCost = state.entries.reduce((sum, e) => sum + calcCost(e), 0);

  const kpiProjEl = $('#ov-kpi-projects');
  const kpiPeopleEl = $('#ov-kpi-people');
  const kpiHoursEl = $('#ov-kpi-hours');

  if (kpiProjEl) animateCounter(kpiProjEl, activeProjects.length);
  if (kpiPeopleEl) animateCounter(kpiPeopleEl, activePeople.length);
  if (kpiHoursEl) animateCounter(kpiHoursEl, totalHours, 800, 2);

  // Aggregat per projekt
  const byProject = {};
  state.entries.forEach(e => {
    if (!byProject[e.projectId]) byProject[e.projectId] = { hours: 0, cost: 0 };
    byProject[e.projectId].hours += e.hours;
    byProject[e.projectId].cost += calcCost(e);
  });

  const projTBody = $('#ov-table-projects tbody');
  if (projTBody) {
    projTBody.innerHTML = '';
    Object.entries(byProject).forEach(([projectId, data]) => {
      const p = state.projects.find(x => x.id === projectId);
      if (!p) return;
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${escapeHtml(p.name)}</td>
        <td>${data.hours.toLocaleString('sv-SE', { maximumFractionDigits: 2 })}</td>
        <td>${data.cost.toLocaleString('sv-SE', { maximumFractionDigits: 0 })} kr</td>
      `;
      projTBody.appendChild(tr);
    });
  }

  // Aggregat per person
  const byPerson = {};
  state.entries.forEach(e => {
    if (!byPerson[e.personId]) byPerson[e.personId] = { hours: 0, cost: 0 };
    byPerson[e.personId].hours += e.hours;
    byPerson[e.personId].cost += calcCost(e);
  });

  const peopleTBody = $('#ov-table-people tbody');
  if (peopleTBody) {
    peopleTBody.innerHTML = '';
    Object.entries(byPerson).forEach(([personId, data]) => {
      const p = state.people.find(x => x.id === personId);
      if (!p) return;
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${escapeHtml(p.name)}</td>
        <td>${data.hours.toLocaleString('sv-SE', { maximumFractionDigits: 2 })}</td>
        <td>${data.cost.toLocaleString('sv-SE', { maximumFractionDigits: 0 })} kr</td>
      `;
      peopleTBody.appendChild(tr);
    });
  }
}

// --- Dashboard ---

function renderDashboard() {
  const from = $('#filter-from').value || null;
  const to = $('#filter-to').value || null;
  const projectFilter = $('#filter-project').value || null;
  const personFilter = $('#filter-person').value || null;

  const filtered = state.entries.filter(e => {
    if (from && e.date < from) return false;
    if (to && e.date > to) return false;
    if (projectFilter && e.projectId !== projectFilter) return false;
    if (personFilter && e.personId !== personFilter) return false;
    return true;
  });

  const kpiHours = filtered.reduce((sum, e) => sum + e.hours, 0);
  const kpiEntries = filtered.length;
  const kpiCost = filtered.reduce((sum, e) => sum + calcCost(e), 0);

  const kpiHoursEl = $('#kpi-hours');
  const kpiEntriesEl = $('#kpi-entries');
  const kpiCostEl = $('#kpi-cost');

  if (kpiHoursEl) animateCounter(kpiHoursEl, kpiHours, 700, 2);
  if (kpiEntriesEl) animateCounter(kpiEntriesEl, kpiEntries, 700, 0);
  if (kpiCostEl) animateCounterCurrency(kpiCostEl, kpiCost, 800);

  const byProject = {};
  filtered.forEach(e => {
    if (!byProject[e.projectId]) {
      byProject[e.projectId] = { hours: 0, cost: 0 };
    }
    byProject[e.projectId].hours += e.hours;
    byProject[e.projectId].cost += calcCost(e);
  });

  const projLabels = [];
  const projHours = [];
  const projCosts = [];

  Object.entries(byProject).forEach(([projectId, data]) => {
    const p = state.projects.find(x => x.id === projectId);
    if (!p) return;
    projLabels.push(p.name);
    projHours.push(data.hours);
    projCosts.push(data.cost);
  });

  const byPerson = {};
  filtered.forEach(e => {
    if (!byPerson[e.personId]) {
      byPerson[e.personId] = { hours: 0, cost: 0 };
    }
    byPerson[e.personId].hours += e.hours;
    byPerson[e.personId].cost += calcCost(e);
  });

  const personLabels = [];
  const personHours = [];
  const personCosts = [];

  Object.entries(byPerson).forEach(([personId, data]) => {
    const p = state.people.find(x => x.id === personId);
    if (!p) return;
    personLabels.push(p.name);
    personHours.push(data.hours);
    personCosts.push(data.cost);
  });

  renderProjectsTable(projLabels, projHours, projCosts);
  renderPeopleTable(personLabels, personHours, personCosts);
  renderCharts(projLabels, projHours, personLabels, personHours);
}

function calcCost(entry) {
  const project = state.projects.find(p => p.id === entry.projectId);
  const person = state.people.find(p => p.id === entry.personId);

  const rate =
    (person && person.hourlyRate) ||
    (project && project.hourlyRate) ||
    DEFAULT_HOURLY_RATE;

  return entry.hours * rate;
}

function renderProjectsTable(labels, hoursArr, costArr) {
  const tbody = $('#table-projects tbody');
  if (!tbody) return;
  tbody.innerHTML = '';

  labels.forEach((label, idx) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${escapeHtml(label)}</td>
      <td>${hoursArr[idx].toLocaleString('sv-SE', { maximumFractionDigits: 2 })}</td>
      <td>${costArr[idx].toLocaleString('sv-SE', { maximumFractionDigits: 0 })} kr</td>
    `;
    tbody.appendChild(tr);
  });
}

function renderPeopleTable(labels, hoursArr, costArr) {
  const tbody = $('#table-people tbody');
  if (!tbody) return;
  tbody.innerHTML = '';

  labels.forEach((label, idx) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${escapeHtml(label)}</td>
      <td>${hoursArr[idx].toLocaleString('sv-SE', { maximumFractionDigits: 2 })}</td>
      <td>${costArr[idx].toLocaleString('sv-SE', { maximumFractionDigits: 0 })} kr</td>
    `;
    tbody.appendChild(tr);
  });
}

function renderCharts(projectLabels, projectHours, personLabels, personHours) {
  const ctxProjects = document.getElementById('chart-projects').getContext('2d');
  const ctxPeople = document.getElementById('chart-people').getContext('2d');

  if (charts.projects) charts.projects.destroy();
  if (charts.people) charts.people.destroy();

  charts.projects = new Chart(ctxProjects, {
    type: 'bar',
    data: {
      labels: projectLabels,
      datasets: [{
        label: 'Timmar per projekt',
        data: projectHours
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false }
      },
      scales: {
        x: { ticks: { autoSkip: false, maxRotation: 45, minRotation: 0 } },
        y: {
          beginAtZero: true,
          title: { display: true, text: 'Timmar' }
        }
      }
    }
  });

  charts.people = new Chart(ctxPeople, {
    type: 'bar',
    data: {
      labels: personLabels,
      datasets: [{
        label: 'Timmar per medarbetare',
        data: personHours
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false }
      },
      scales: {
        x: { ticks: { autoSkip: false, maxRotation: 45, minRotation: 0 } },
        y: {
          beginAtZero: true,
          title: { display: true, text: 'Timmar' }
        }
      }
    }
  });
}

// --- Animation helpers ---

function animateOverview() {
  const sections = document.querySelectorAll('.overview-section');
  sections.forEach((el, i) => {
    el.classList.remove('overview-animate');
    void el.offsetWidth; // reset animation
    el.style.animationDelay = (i * 0.12) + 's';
    el.classList.add('overview-animate');
  });
}

function animatePPS() {
  const blocks = document.querySelectorAll('.pps-section');
  blocks.forEach((el, i) => {
    el.classList.remove('pps-animate');
    void el.offsetWidth;
    el.style.animationDelay = (i * 0.12) + 's';
    el.classList.add('pps-animate');
  });
}

function animateCounter(el, value, duration = 600, decimals = 0) {
  value = Number(value) || 0;
  const start = 0;
  const startTime = performance.now();
  const endTime = startTime + duration;

  function frame(now) {
    const progress = Math.min((now - startTime) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // ease-out
    const current = start + (value - start) * eased;
    el.textContent = Number(current).toLocaleString('sv-SE', {
      maximumFractionDigits: decimals,
      minimumFractionDigits: decimals
    });
    if (progress < 1) {
      requestAnimationFrame(frame);
    }
  }

  requestAnimationFrame(frame);
}

function animateCounterCurrency(el, value, duration = 800) {
  value = Number(value) || 0;
  const start = 0;
  const startTime = performance.now();

  function frame(now) {
    const progress = Math.min((now - startTime) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = start + (value - start) * eased;
    el.textContent = Number(current).toLocaleString('sv-SE', {
      maximumFractionDigits: 0
    }) + ' kr';
    if (progress < 1) {
      requestAnimationFrame(frame);
    }
  }

  requestAnimationFrame(frame);
}

// --- Utils ---

function escapeHtml(str) {
  if (str == null) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
