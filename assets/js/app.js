// Enkel klient-side datamodell med localStorage
const STORAGE_KEY = "hbg_projekt_tid_v1";

let state = {
  projects: [],
  people: [],
  timeEntries: []
};

let charts = {
  projects: null,
  people: null,
  trend: null
};

function uuid() {
  return "xxxxxx".replace(/x/g, () =>
    Math.floor(Math.random() * 36).toString(36)
  );
}

function loadState() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      initDemoData();
      return;
    }
    const parsed = JSON.parse(raw);
    state = Object.assign(
      { projects: [], people: [], timeEntries: [] },
      parsed
    );
  } catch (e) {
    console.error("Kunde inte läsa state, initierar demo-data", e);
    initDemoData();
  }
}

function saveState() {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function initDemoData() {
  const today = new Date();
  const d = (offset) => {
    const t = new Date(today);
    t.setDate(t.getDate() - offset);
    return t.toISOString().slice(0, 10);
  };

  state.projects = [
    {
      id: uuid(),
      name: "Översiktsplan 2040",
      code: "P-001",
      status: "Pågående",
      type: "Utredning",
      description: "Översiktsplan för kommunen 2040."
    },
    {
      id: uuid(),
      name: "Ny cykelväg centrum–Väla",
      code: "P-002",
      status: "Planerat",
      type: "Investering",
      description: "Planering av ny cykelväg för att öka hållbart resande."
    },
    {
      id: uuid(),
      name: "Digitalisering bygglovsprocess",
      code: "P-003",
      status: "Pågående",
      type: "Drift",
      description: "Effektivisering och digitalisering av bygglovsprocessen."
    }
  ];

  state.people = [
    {
      id: uuid(),
      name: "Andreas Gunnarsson",
      role: "Projektledare",
      active: true
    },
    {
      id: uuid(),
      name: "Anna Andersson",
      role: "Planarkitekt",
      active: true
    },
    {
      id: uuid(),
      name: "Erik Nilsson",
      role: "Trafikplanerare",
      active: true
    }
  ];

  state.timeEntries = [
    {
      id: uuid(),
      date: d(3),
      personId: state.people[0].id,
      projectId: state.projects[0].id,
      hours: 3,
      activity: "Projektering",
      comment: "Underlag till samråd."
    },
    {
      id: uuid(),
      date: d(3),
      personId: state.people[0].id,
      projectId: state.projects[2].id,
      hours: 2,
      activity: "Möte",
      comment: "Styrgruppsmöte."
    },
    {
      id: uuid(),
      date: d(2),
      personId: state.people[1].id,
      projectId: state.projects[0].id,
      hours: 6,
      activity: "Projektering",
      comment: "Kartunderlag."
    },
    {
      id: uuid(),
      date: d(1),
      personId: state.people[2].id,
      projectId: state.projects[1].id,
      hours: 5,
      activity: "Projektering",
      comment: "Sträckningsförslag."
    }
  ];

  saveState();
}

// Helpers
function getProjectById(id) {
  return state.projects.find((p) => p.id === id) || null;
}

function getPersonById(id) {
  return state.people.find((p) => p.id === id) || null;
}

function sumHours(filterFn) {
  return state.timeEntries
    .filter(filterFn || (() => true))
    .reduce((acc, t) => acc + (Number(t.hours) || 0), 0);
}

// Rendering: navigation
function setupNavigation() {
  const buttons = document.querySelectorAll(".nav-btn");
  const views = document.querySelectorAll(".view");

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const viewId = btn.dataset.view;
      buttons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      views.forEach((v) =>
        v.classList.remove("view-active")
      );
      const viewEl = document.getElementById("view-" + viewId);
      if (viewEl) {
        viewEl.classList.add("view-active");
      }
      if (viewId === "dashboard") {
        renderDashboard();
      }
      if (viewId === "overview") {
        renderOverview();
      }
    });
  });
}

// Overview
function renderOverview() {
  const kpiProj = document.getElementById("kpi-total-projects");
  const kpiPeople = document.getElementById("kpi-total-people");
  const kpiHours = document.getElementById("kpi-total-hours");
  if (!kpiProj) return;

  kpiProj.textContent = state.projects.length;
  kpiPeople.textContent = state.people.length;
  kpiHours.textContent = sumHours().toFixed(1).replace(".", ",");

  // Projekt-tabell
  const projTbody = document.getElementById("overview-project-table");
  projTbody.innerHTML = "";
  const projMap = {};
  state.timeEntries.forEach((t) => {
    projMap[t.projectId] =
      (projMap[t.projectId] || 0) + (Number(t.hours) || 0);
  });
  state.projects.forEach((p) => {
    const tr = document.createElement("tr");
    const hours = projMap[p.id] || 0;
    tr.innerHTML = `
      <td>${p.name}</td>
      <td>${p.code || ""}</td>
      <td>${hours.toFixed(1).replace(".", ",")}</td>
    `;
    projTbody.appendChild(tr);
  });

  // People-tabell
  const pplTbody = document.getElementById("overview-people-table");
  pplTbody.innerHTML = "";
  const personMap = {};
  state.timeEntries.forEach((t) => {
    personMap[t.personId] =
      (personMap[t.personId] || 0) + (Number(t.hours) || 0);
  });
  state.people.forEach((p) => {
    const tr = document.createElement("tr");
    const hours = personMap[p.id] || 0;
    tr.innerHTML = `
      <td>${p.name}</td>
      <td>${p.role || ""}</td>
      <td>${hours.toFixed(1).replace(".", ",")}</td>
    `;
    pplTbody.appendChild(tr);
  });
}

// Projects view
function renderProjects() {
  const tbody = document.getElementById("project-table-body");
  const search = document.getElementById("project-search");
  if (!tbody) return;

  const filterText = (search?.value || "").toLowerCase();
  const projHours = {};
  state.timeEntries.forEach((t) => {
    projHours[t.projectId] =
      (projHours[t.projectId] || 0) + (Number(t.hours) || 0);
  });

  tbody.innerHTML = "";
  state.projects
    .filter((p) => {
      if (!filterText) return true;
      return (
        p.name.toLowerCase().includes(filterText) ||
        (p.code || "").toLowerCase().includes(filterText)
      );
    })
    .forEach((p) => {
      const tr = document.createElement("tr");
      const hours = projHours[p.id] || 0;
      tr.innerHTML = `
        <td>${p.name}</td>
        <td>${p.code || ""}</td>
        <td>${p.status || ""}</td>
        <td>${p.type || ""}</td>
        <td>${hours.toFixed(1).replace(".", ",")}</td>
        <td>
          <button class="table-action-btn" data-action="edit" data-id="${p.id}">Redigera</button>
          <button class="table-action-btn" data-action="delete" data-id="${p.id}">Ta bort</button>
        </td>
      `;
      tbody.appendChild(tr);
    });

  tbody.querySelectorAll("button.table-action-btn").forEach((btn) => {
    const id = btn.dataset.id;
    const action = btn.dataset.action;
    btn.addEventListener("click", () => {
      if (action === "edit") {
        loadProjectIntoForm(id);
      } else if (action === "delete") {
        deleteProject(id);
      }
    });
  });
}

function loadProjectIntoForm(id) {
  const p = getProjectById(id);
  if (!p) return;
  document.getElementById("project-id").value = p.id;
  document.getElementById("project-name").value = p.name;
  document.getElementById("project-code").value = p.code || "";
  document.getElementById("project-status").value = p.status || "Planerat";
  document.getElementById("project-type").value = p.type || "";
  document.getElementById("project-desc").value = p.description || "";
}

function deleteProject(id) {
  const hasTime = state.timeEntries.some((t) => t.projectId === id);
  if (hasTime && !window.confirm("Det finns tidrader kopplade till projektet. Vill du verkligen ta bort det?")) {
    return;
  }
  state.projects = state.projects.filter((p) => p.id !== id);
  state.timeEntries = state.timeEntries.filter((t) => t.projectId !== id);
  saveState();
  renderAll();
}

function setupProjectForm() {
  const form = document.getElementById("project-form");
  const resetBtn = document.getElementById("btn-reset-project-form");
  const search = document.getElementById("project-search");

  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const id = document.getElementById("project-id").value || uuid();
    const name = document.getElementById("project-name").value.trim();
    const code = document.getElementById("project-code").value.trim();
    const status = document.getElementById("project-status").value;
    const type = document.getElementById("project-type").value;
    const desc = document.getElementById("project-desc").value.trim();

    if (!name) {
      alert("Projektnamn måste anges.");
      return;
    }

    const existingIndex = state.projects.findIndex((p) => p.id === id);
    const proj = { id, name, code, status, type, description: desc };

    if (existingIndex >= 0) {
      state.projects[existingIndex] = proj;
    } else {
      state.projects.push(proj);
    }
    saveState();
    form.reset();
    document.getElementById("project-id").value = "";
    renderAll();
  });

  resetBtn?.addEventListener("click", () => {
    form.reset();
    document.getElementById("project-id").value = "";
  });

  search?.addEventListener("input", () => {
    renderProjects();
  });
}

// People view
function renderPeople() {
  const tbody = document.getElementById("people-table-body");
  const search = document.getElementById("people-search");
  if (!tbody) return;

  const filterText = (search?.value || "").toLowerCase();
  const personHours = {};
  state.timeEntries.forEach((t) => {
    personHours[t.personId] =
      (personHours[t.personId] || 0) + (Number(t.hours) || 0);
  });

  tbody.innerHTML = "";
  state.people
    .filter((p) => {
      if (!filterText) return true;
      return (
        p.name.toLowerCase().includes(filterText) ||
        (p.role || "").toLowerCase().includes(filterText)
      );
    })
    .forEach((p) => {
      const tr = document.createElement("tr");
      const hours = personHours[p.id] || 0;
      tr.innerHTML = `
        <td>${p.name}</td>
        <td>${p.role || ""}</td>
        <td>${p.active ? "Ja" : "Nej"}</td>
        <td>${hours.toFixed(1).replace(".", ",")}</td>
        <td>
          <button class="table-action-btn" data-action="edit" data-id="${p.id}">Redigera</button>
          <button class="table-action-btn" data-action="delete" data-id="${p.id}">Ta bort</button>
        </td>
      `;
      tbody.appendChild(tr);
    });

  tbody.querySelectorAll("button.table-action-btn").forEach((btn) => {
    const id = btn.dataset.id;
    const action = btn.dataset.action;
    btn.addEventListener("click", () => {
      if (action === "edit") {
        loadPersonIntoForm(id);
      } else if (action === "delete") {
        deletePerson(id);
      }
    });
  });
}

function loadPersonIntoForm(id) {
  const p = getPersonById(id);
  if (!p) return;
  document.getElementById("person-id").value = p.id;
  document.getElementById("person-name").value = p.name;
  document.getElementById("person-role").value = p.role || "";
  document.getElementById("person-active").value = p.active ? "true" : "false";
}

function deletePerson(id) {
  const hasTime = state.timeEntries.some((t) => t.personId === id);
  if (hasTime && !window.confirm("Det finns tidrader kopplade till medarbetaren. Vill du verkligen ta bort personen?")) {
    return;
  }
  state.people = state.people.filter((p) => p.id !== id);
  state.timeEntries = state.timeEntries.filter((t) => t.personId !== id);
  saveState();
  renderAll();
}

function setupPeopleForm() {
  const form = document.getElementById("people-form");
  const resetBtn = document.getElementById("btn-reset-person-form");
  const search = document.getElementById("people-search");

  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const id = document.getElementById("person-id").value || uuid();
    const name = document.getElementById("person-name").value.trim();
    const role = document.getElementById("person-role").value.trim();
    const activeVal = document.getElementById("person-active").value;
    const active = activeVal === "true";

    if (!name) {
      alert("Namn måste anges.");
      return;
    }

    const existingIndex = state.people.findIndex((p) => p.id === id);
    const person = { id, name, role, active };

    if (existingIndex >= 0) {
      state.people[existingIndex] = person;
    } else {
      state.people.push(person);
    }
    saveState();
    form.reset();
    document.getElementById("person-id").value = "";
    renderAll();
  });

  resetBtn?.addEventListener("click", () => {
    form.reset();
    document.getElementById("person-id").value = "";
  });

  search?.addEventListener("input", () => {
    renderPeople();
  });
}

// Time view
function populateTimeSelectors() {
  const personSelect = document.getElementById("time-person");
  const projSelect = document.getElementById("time-project");
  const filterPerson = document.getElementById("time-filter-person");
  const filterProj = document.getElementById("time-filter-project");
  if (!personSelect || !projSelect) return;

  personSelect.innerHTML = '<option value="">– Välj medarbetare –</option>';
  state.people
    .filter((p) => p.active)
    .forEach((p) => {
      const opt = document.createElement("option");
      opt.value = p.id;
      opt.textContent = p.name;
      personSelect.appendChild(opt);
    });

  projSelect.innerHTML = '<option value="">– Välj projekt –</option>';
  state.projects.forEach((p) => {
    const opt = document.createElement("option");
    opt.value = p.id;
    opt.textContent = p.name;
    projSelect.appendChild(opt);
  });

  if (filterPerson) {
    const current = filterPerson.value;
    filterPerson.innerHTML = '<option value="">Alla medarbetare</option>';
    state.people.forEach((p) => {
      const opt = document.createElement("option");
      opt.value = p.id;
      opt.textContent = p.name;
      filterPerson.appendChild(opt);
    });
    filterPerson.value = current;
  }

  if (filterProj) {
    const currentP = filterProj.value;
    filterProj.innerHTML = '<option value="">Alla projekt</option>';
    state.projects.forEach((p) => {
      const opt = document.createElement("option");
      opt.value = p.id;
      opt.textContent = p.name;
      filterProj.appendChild(opt);
    });
    filterProj.value = currentP;
  }
}

function renderTimeEntries() {
  const tbody = document.getElementById("time-table-body");
  const search = document.getElementById("time-search");
  const filterPerson = document.getElementById("time-filter-person");
  const filterProj = document.getElementById("time-filter-project");
  if (!tbody) return;

  const filterText = (search?.value || "").toLowerCase();
  const personFilterVal = filterPerson?.value || "";
  const projFilterVal = filterProj?.value || "";

  tbody.innerHTML = "";
  state.timeEntries
    .slice()
    .sort((a, b) => (a.date || "").localeCompare(b.date || ""))
    .forEach((t) => {
      const person = getPersonById(t.personId);
      const proj = getProjectById(t.projectId);
      const personName = person ? person.name : "Okänd";
      const projName = proj ? proj.name : "Okänt";

      const rowText =
        `${personName} ${projName} ${t.comment || ""}`.toLowerCase();

      if (filterText && !rowText.includes(filterText)) {
        return;
      }
      if (personFilterVal && t.personId !== personFilterVal) {
        return;
      }
      if (projFilterVal && t.projectId !== projFilterVal) {
        return;
      }

      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${t.date || ""}</td>
        <td>${personName}</td>
        <td>${projName}</td>
        <td>${Number(t.hours).toFixed(1).replace(".", ",")}</td>
        <td>${t.activity || ""}</td>
        <td>${t.comment || ""}</td>
        <td>
          <button class="table-action-btn" data-action="edit" data-id="${t.id}">Redigera</button>
          <button class="table-action-btn" data-action="delete" data-id="${t.id}">Ta bort</button>
        </td>
      `;
      tbody.appendChild(tr);
    });

  tbody.querySelectorAll("button.table-action-btn").forEach((btn) => {
    const id = btn.dataset.id;
    const action = btn.dataset.action;
    btn.addEventListener("click", () => {
      if (action === "edit") {
        loadTimeIntoForm(id);
      } else if (action === "delete") {
        deleteTime(id);
      }
    });
  });
}

function loadTimeIntoForm(id) {
  const t = state.timeEntries.find((x) => x.id === id);
  if (!t) return;
  document.getElementById("time-id").value = t.id;
  document.getElementById("time-date").value = t.date || "";
  document.getElementById("time-person").value = t.personId || "";
  document.getElementById("time-project").value = t.projectId || "";
  document.getElementById("time-hours").value = t.hours;
  document.getElementById("time-activity").value = t.activity || "";
  document.getElementById("time-comment").value = t.comment || "";
}

function deleteTime(id) {
  state.timeEntries = state.timeEntries.filter((t) => t.id !== id);
  saveState();
  renderAll();
}

function setupTimeForm() {
  const form = document.getElementById("time-form");
  const resetBtn = document.getElementById("btn-reset-time-form");
  const search = document.getElementById("time-search");
  const filterPerson = document.getElementById("time-filter-person");
  const filterProj = document.getElementById("time-filter-project");

  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const id = document.getElementById("time-id").value || uuid();
    const date = document.getElementById("time-date").value;
    const personId = document.getElementById("time-person").value;
    const projectId = document.getElementById("time-project").value;
    const hoursRaw = document.getElementById("time-hours").value;
    const activity = document.getElementById("time-activity").value;
    const comment = document.getElementById("time-comment").value.trim();

    const hours = Number(hoursRaw);
    if (!date || !personId || !projectId || isNaN(hours)) {
      alert("Datum, medarbetare, projekt och timmar måste anges.");
      return;
    }

    const existingIndex = state.timeEntries.findIndex((t) => t.id === id);
    const entry = {
      id,
      date,
      personId,
      projectId,
      hours,
      activity,
      comment
    };

    if (existingIndex >= 0) {
      state.timeEntries[existingIndex] = entry;
    } else {
      state.timeEntries.push(entry);
    }
    saveState();
    form.reset();
    document.getElementById("time-id").value = "";
    renderAll();
  });

  resetBtn?.addEventListener("click", () => {
    form.reset();
    document.getElementById("time-id").value = "";
  });

  search?.addEventListener("input", () => {
    renderTimeEntries();
  });

  filterPerson?.addEventListener("change", () => {
    renderTimeEntries();
  });

  filterProj?.addEventListener("change", () => {
    renderTimeEntries();
  });
}

// Dashboard
function filterByPeriod(entries, period) {
  if (period === "all") return entries;
  const today = new Date();
  let days = period === "week" ? 7 : 30;
  const cutoff = new Date(today);
  cutoff.setDate(today.getDate() - days);
  return entries.filter((t) => {
    if (!t.date) return false;
    const d = new Date(t.date + "T00:00:00");
    return d >= cutoff;
  });
}

function renderDashboard() {
  // KPI: vecka, månad, medel per person
  const kpiWeek = document.getElementById("kpi-hours-week");
  const kpiMonth = document.getElementById("kpi-hours-month");
  const kpiAvg = document.getElementById("kpi-hours-per-person");

  const weekHours = sumHours((t) =>
    filterByPeriod([t], "week").length > 0
  );
  const monthHours = sumHours((t) =>
    filterByPeriod([t], "month").length > 0
  );
  const avgPerPerson =
    state.people.length > 0 ? monthHours / state.people.length : 0;

  if (kpiWeek) kpiWeek.textContent = weekHours.toFixed(1).replace(".", ",");
  if (kpiMonth) kpiMonth.textContent = monthHours.toFixed(1).replace(".", ",");
  if (kpiAvg)
    kpiAvg.textContent = avgPerPerson.toFixed(1).replace(".", ",");

  // Projektdiagram
  const projectPeriodSel = document.getElementById("dashboard-project-period");
  const peoplePeriodSel = document.getElementById("dashboard-people-period");

  const projectPeriod = projectPeriodSel?.value || "all";
  const peoplePeriod = peoplePeriodSel?.value || "all";

  renderProjectsChart(projectPeriod);
  renderPeopleChart(peoplePeriod);
  renderTrendChart();

  projectPeriodSel?.addEventListener("change", () => {
    renderProjectsChart(projectPeriodSel.value);
  });

  peoplePeriodSel?.addEventListener("change", () => {
    renderPeopleChart(peoplePeriodSel.value);
  });
}

function destroyChart(key) {
  if (charts[key]) {
    charts[key].destroy();
    charts[key] = null;
  }
}

function renderProjectsChart(period) {
  const ctx = document.getElementById("chart-projects");
  if (!ctx) return;
  destroyChart("projects");

  const dataEntries = filterByPeriod(state.timeEntries, period);
  const projMap = {};
  dataEntries.forEach((t) => {
    projMap[t.projectId] =
      (projMap[t.projectId] || 0) + (Number(t.hours) || 0);
  });

  const labels = [];
  const values = [];
  state.projects.forEach((p) => {
    labels.push(p.name);
    values.push(projMap[p.id] || 0);
  });

  charts.projects = new Chart(ctx.getContext("2d"), {
    type: "bar",
    data: {
      labels,
      datasets: [
        {
          label: "Timmar",
          data: values
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false }
      },
      scales: {
        x: {
          ticks: {
            maxRotation: 45,
            minRotation: 0
          }
        },
        y: {
          beginAtZero: true
        }
      }
    }
  });
}

function renderPeopleChart(period) {
  const ctx = document.getElementById("chart-people");
  if (!ctx) return;
  destroyChart("people");

  const dataEntries = filterByPeriod(state.timeEntries, period);
  const personMap = {};
  dataEntries.forEach((t) => {
    personMap[t.personId] =
      (personMap[t.personId] || 0) + (Number(t.hours) || 0);
  });

  const labels = [];
  const values = [];
  state.people.forEach((p) => {
    labels.push(p.name);
    values.push(personMap[p.id] || 0);
  });

  charts.people = new Chart(ctx.getContext("2d"), {
    type: "bar",
    data: {
      labels,
      datasets: [
        {
          label: "Timmar",
          data: values
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false }
      },
      scales: {
        x: {
          ticks: {
            maxRotation: 45,
            minRotation: 0
          }
        },
        y: {
          beginAtZero: true
        }
      }
    }
  });
}

function renderTrendChart() {
  const ctx = document.getElementById("chart-trend");
  if (!ctx) return;
  destroyChart("trend");

  // Grupp per datum
  const dateMap = {};
  state.timeEntries.forEach((t) => {
    if (!t.date) return;
    dateMap[t.date] = (dateMap[t.date] || 0) + (Number(t.hours) || 0);
  });
  const dates = Object.keys(dateMap).sort();
  const values = dates.map((d) => dateMap[d] || 0);

  charts.trend = new Chart(ctx.getContext("2d"), {
    type: "line",
    data: {
      labels: dates,
      datasets: [
        {
          label: "Timmar per dag",
          data: values,
          tension: 0.25
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false }
      },
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
}

// Export CSV
function downloadCsv(filename, rows) {
  const processRow = (row) =>
    row
      .map((value) => {
        if (value == null) return "";
        const str = String(value);
        if (/[",;\n]/.test(str)) {
          return '"' + str.replace(/"/g, '""') + '"';
        }
        return str;
      })
      .join(";");
  const csv = rows.map(processRow).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function setupExportButtons() {
  const btnProj = document.getElementById("btn-export-projects");
  const btnPeople = document.getElementById("btn-export-people");
  const btnTime = document.getElementById("btn-export-time");

  btnProj?.addEventListener("click", () => {
    const rows = [
      ["Projektnamn", "ProjektID", "Status", "Typ", "Beskrivning"]
    ];
    state.projects.forEach((p) => {
      rows.push([
        p.name,
        p.code || "",
        p.status || "",
        p.type || "",
        p.description || ""
      ]);
    });
    downloadCsv("projekt.csv", rows);
  });

  btnPeople?.addEventListener("click", () => {
    const rows = [["Namn", "Roll", "Aktiv"]];
    state.people.forEach((p) => {
      rows.push([p.name, p.role || "", p.active ? "Ja" : "Nej"]);
    });
    downloadCsv("medarbetare.csv", rows);
  });

  btnTime?.addEventListener("click", () => {
    const rows = [
      [
        "Datum",
        "Medarbetare",
        "Projekt",
        "AntalTimmar",
        "Aktivitetstyp",
        "Kommentar"
      ]
    ];
    state.timeEntries.forEach((t) => {
      const person = getPersonById(t.personId);
      const proj = getProjectById(t.projectId);
      rows.push([
        t.date || "",
        person ? person.name : "",
        proj ? proj.name : "",
        t.hours,
        t.activity || "",
        t.comment || ""
      ]);
    });
    downloadCsv("tidregistrering.csv", rows);
  });
}

// Render all views that need refresh
function renderAll() {
  renderOverview();
  renderProjects();
  renderPeople();
  populateTimeSelectors();
  renderTimeEntries();
  // Dashboard körs on-demand när vyn visas
}

// Init
document.addEventListener("DOMContentLoaded", () => {
  loadState();
  setupNavigation();
  setupProjectForm();
  setupPeopleForm();
  setupTimeForm();
  setupExportButtons();

  // default: sätt dagens datum i tidformuläret
  const dateInput = document.getElementById("time-date");
  if (dateInput && !dateInput.value) {
    dateInput.value = new Date().toISOString().slice(0, 10);
  }

  renderAll();
  // Första vyn är översikt
  renderOverview();
});
