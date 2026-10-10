let tasks = [];
let filter = 'all';
let sort = 'newest';
let dragId = null;
try { sort = localStorage.getItem('sort') || 'newest'; } catch {}

const $ = (id) => document.getElementById(id);
const list = $('list');

const todayStr = () => {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

const persist = () => window.api.saveTasks(tasks);

function render() {
  list.textContent = '';
  const shown = tasks.filter((t) =>
    filter === 'all' ? true : filter === 'done' ? t.done : !t.done);

  if (sort === 'due') {
    // Soonest first; tasks without a due date go last. Array.sort is stable,
    // so ties keep their newest-first order.
    shown.sort((a, b) => (a.due || '9999-99-99').localeCompare(b.due || '9999-99-99'));
  }

  for (const t of shown) {
    const li = document.createElement('li');
    if (t.done) li.className = 'done';

    const cb = document.createElement('input');
    cb.type = 'checkbox';
    cb.checked = t.done;
    cb.onchange = () => { t.done = cb.checked; persist(); render(); };

    const label = document.createElement('span');
    label.textContent = t.text;

    const del = document.createElement('button');
    del.className = 'del';
    del.textContent = '✕';
    del.onclick = () => { tasks = tasks.filter((x) => x.id !== t.id); persist(); render(); };

    const due = document.createElement('input');
    due.type = 'date';
    due.className = 'due';
    due.value = t.due || '';
    if (!t.due) due.classList.add('empty');
    else if (!t.done && t.due < todayStr()) due.classList.add('overdue');
    else if (!t.done && t.due === todayStr()) due.classList.add('today');
    due.onchange = () => { t.due = due.value || null; persist(); render(); };

    li.append(cb, label, due, del);

    if (sort === 'newest') {
      li.draggable = true;
      li.ondragstart = (e) => {
        dragId = t.id;
        e.dataTransfer.effectAllowed = 'move';
        li.classList.add('dragging');
      };
      li.ondragend = () => { dragId = null; render(); };
      li.ondragover = (e) => {
        if (!dragId || dragId === t.id) return;
        e.preventDefault();
        const r = li.getBoundingClientRect();
        const after = e.clientY > r.top + r.height / 2;
        li.classList.toggle('drop-after', after);
        li.classList.toggle('drop-before', !after);
      };
      li.ondragleave = () => li.classList.remove('drop-before', 'drop-after');
      li.ondrop = (e) => {
        e.preventDefault();
        if (!dragId || dragId === t.id) return;
        const r = li.getBoundingClientRect();
        const after = e.clientY > r.top + r.height / 2;
        const from = tasks.findIndex((x) => x.id === dragId);
        const [moved] = tasks.splice(from, 1);
        const to = tasks.findIndex((x) => x.id === t.id);
        tasks.splice(after ? to + 1 : to, 0, moved);
        dragId = null;
        persist();
        render();
      };
    }
    list.append(li);
  }
  const left = tasks.filter((t) => !t.done).length;
  $('count').textContent = `${left} left`;
}

$('form').onsubmit = (e) => {
  e.preventDefault();
  const text = $('input').value.trim();
  if (!text) return;
  tasks.unshift({ id: Date.now().toString(36), text, done: false, due: $('due').value || null });
  $('input').value = '';
  $('due').value = '';
  persist();
  render();
};

$('filters').onclick = (e) => {
  if (!e.target.dataset.filter) return;
  filter = e.target.dataset.filter;
  document.querySelectorAll('#filters button').forEach((b) =>
    b.classList.toggle('active', b === e.target));
  render();
};

$('sort').value = sort;
$('sort').onchange = () => {
  sort = $('sort').value;
  try { localStorage.setItem('sort', sort); } catch {}
  render();
};

$('clear').onclick = () => { tasks = tasks.filter((t) => !t.done); persist(); render(); };

window.api.loadTasks().then((loaded) => { tasks = loaded; render(); });
