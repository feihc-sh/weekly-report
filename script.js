// Hermes Weekly Report Renderer
// Loads data.json, renders 6 sections. Vanilla JS, no deps.

async function loadData() {
  const res = await fetch('data.json', { cache: 'no-store' });
  if (!res.ok) throw new Error(`data.json fetch failed: ${res.status}`);
  return res.json();
}

function el(tag, attrs = {}, children = []) {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === 'class') node.className = v;
    else if (k === 'text') node.textContent = v;
    else node.setAttribute(k, v);
  }
  for (const c of [].concat(children)) {
    if (c == null) continue;
    node.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
  }
  return node;
}

function renderMeta(meta) {
  document.title = meta.title || 'Hermes 团队周报';
  document.getElementById('report-title').textContent = meta.title || 'Hermes 团队周报';
  document.getElementById('date-range').textContent = meta.date_range || '';

  const s = meta.summary || {};
  const parts = [];
  if (s.total_sessions) parts.push(`${s.total_sessions} sessions`);
  if (s.profiles_active) parts.push(`${s.profiles_active} profiles`);
  if (s.real_projects) parts.push(`${s.real_projects} 项目`);
  if (s.rolling_projects) parts.push(`${s.rolling_projects} 滚动`);
  if (s.real_problems) parts.push(`${s.real_problems} 真问题`);
  if (s.new_skills_count) parts.push(`${s.new_skills_count} 新 skill`);
  document.getElementById('meta-summary').textContent = parts.join(' · ');
}

function renderOverview(rows) {
  const tbody = document.querySelector('#overview-table tbody');
  tbody.innerHTML = '';
  for (const r of rows) {
    tbody.appendChild(el('tr', {}, [
      el('td', { text: r.profile, class: 'mono' }),
      el('td', { text: String(r.sessions), class: 'num' }),
      el('td', { text: r.focus }),
    ]));
  }
}

function renderRealProjects(projects) {
  document.getElementById('real-projects-count').textContent = String(projects.length);
  const root = document.getElementById('real-projects');
  root.innerHTML = '';
  for (const p of projects) {
    const card = el('div', { class: 'card' }, [
      el('div', { class: 'card-title' }, [
        el('span', { text: p.phase_emoji || '📌' }),
        el('span', { text: p.name }),
        el('span', { class: `badge ${p.active_status}`, text: p.active_status }),
      ]),
      el('div', { class: 'card-desc', text: p.description }),
      el('div', { class: 'card-row' }, [
        el('span', { class: 'label', text: 'phase' }),
        el('span', { class: 'value phase', text: p.phase }),
      ]),
      el('div', { class: 'card-row' }, [
        el('span', { class: 'label', text: 'last' }),
        el('span', { class: 'value', text: p.last_active }),
      ]),
      el('div', { class: 'card-row' }, [
        el('span', { class: 'label', text: 'progress' }),
        el('span', { class: 'value', text: p.progress }),
      ]),
      p.problem ? el('div', { class: 'card-row' }, [
        el('span', { class: 'label', text: '问题' }),
        el('span', { class: 'value', text: p.problem }),
      ]) : null,
      p.solution ? el('div', { class: 'card-row' }, [
        el('span', { class: 'label', text: '方案' }),
        el('span', { class: 'value', text: p.solution }),
      ]) : null,
    ]);
    root.appendChild(card);
  }
}

function renderRolling(projects) {
  document.getElementById('rolling-count').textContent = String(projects.length);
  const root = document.getElementById('rolling-projects');
  root.innerHTML = '';
  for (const p of projects) {
    const card = el('div', { class: 'card' }, [
      el('div', { class: 'card-title' }, [
        el('span', { text: '🔁' }),
        el('span', { text: p.name }),
        el('span', { class: `badge ${p.active_status}`, text: p.active_status }),
      ]),
      el('div', { class: 'card-row' }, [
        el('span', { class: 'label', text: '进展' }),
        el('span', { class: 'value', text: p.progress }),
      ]),
      el('div', { class: 'card-row' }, [
        el('span', { class: 'label', text: '问题' }),
        el('span', { class: 'value', text: p.problem }),
      ]),
      el('div', { class: 'card-row' }, [
        el('span', { class: 'label', text: '方案' }),
        el('span', { class: 'value', text: p.solution }),
      ]),
    ]);
    root.appendChild(card);
  }
}

function renderProblems(rows) {
  document.getElementById('problems-count').textContent = String(rows.length);
  const tbody = document.querySelector('#problems-table tbody');
  tbody.innerHTML = '';
  for (const r of rows) {
    const cls = (r.priority || '').toLowerCase();
    tbody.appendChild(el('tr', {}, [
      el('td', {}, [el('span', { class: `prio ${cls}`, text: r.priority })]),
      el('td', { text: r.project, class: 'mono' }),
      el('td', { text: r.issue }),
      el('td', { text: r.solution }),
      el('td', { text: r.time, class: 'mono' }),
    ]));
  }
}

function renderSkills(skillsObj) {
  const entries = Object.entries(skillsObj);
  const total = entries.reduce((s, [, v]) => s + (v.count || 0), 0);
  document.getElementById('skills-count').textContent = String(total);
  const tbody = document.querySelector('#skills-table tbody');
  tbody.innerHTML = '';
  for (const [key, v] of entries) {
    tbody.appendChild(el('tr', {}, [
      el('td', { text: v.category, class: 'mono' }),
      el('td', { text: String(v.count), class: 'num' }),
      el('td', { text: v.trigger }),
      el('td', { text: v.impact }),
    ]));
  }
}

function renderHotTopics(items) {
  const ul = document.getElementById('hot-topics-list');
  ul.innerHTML = '';
  for (const t of items) {
    ul.appendChild(el('li', { text: t }));
  }
}

(async function main() {
  try {
    const data = await loadData();
    if (data.meta) renderMeta(data.meta);
    if (Array.isArray(data.overview)) renderOverview(data.overview);
    if (Array.isArray(data.real_projects)) renderRealProjects(data.real_projects);
    if (Array.isArray(data.rolling_projects)) renderRolling(data.rolling_projects);
    if (Array.isArray(data.problems)) renderProblems(data.problems);
    if (data.new_skills) renderSkills(data.new_skills);
    if (Array.isArray(data.hot_topics)) renderHotTopics(data.hot_topics);
  } catch (e) {
    document.body.innerHTML = `<div style="padding:40px;color:#ef4444;font-family:monospace;">❌ Render failed: ${e.message}<br><br>检查 data.json 是否存在且有效 JSON</div>`;
    console.error(e);
  }
})();
