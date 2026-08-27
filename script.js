const pitch = document.getElementById('pitch');

// ---------- ROLE DATA ----------
const roleCategories = {
  GK: ['GK','SK','BGK'],
  CB: ['CB','BPD','WCD','ACB'],
  FB: ['FB','WB','CWB','IWB','IFB','PWB'],
  DM: ['DM', 'DLP', 'BBP', 'BBM', 'HB'],
  CM: ['CM', 'WCM', 'MP', 'WM'],
  AM: ['AM','AP','FR','SS','CHM'],
  W:  ['W','IF','IW','WF','PW'],
  CF: ['CF', 'CHF','DLF','F9','P','TF']
};

const roleToCategory = {};
Object.entries(roleCategories).forEach(([category, roles]) => {
  roles.forEach(role => roleToCategory[role] = category);
});

// ---------- FORMATIONS ----------
const formations = {
  f442: [
    [5, 50, 'GK'],
    [25, 85, 'FB'], [22, 60, 'CB'], [22, 40, 'CB'], [25, 15, 'FB'],
    [55, 85, 'W'], [50, 60, 'CM'], [50, 40, 'CM'], [55, 15, 'W'],
    [80, 60, 'CF'], [80, 40, 'CF']
  ],
  f433: [
    [5, 50, 'GK'],
    [25, 85, 'FB'], [22, 60, 'CB'], [22, 40, 'CB'], [25, 15, 'FB'],
    [45, 50, 'DM'], [55, 65, 'CM'], [55, 35, 'CM'],
    [82, 85, 'W'], [85, 50, 'CF'], [82, 15, 'W']
  ],
  f4231: [
    [5, 50, 'GK'],
    [25, 85, 'FB'], [22, 60, 'CB'], [22, 40, 'CB'], [25, 15, 'FB'],
    [48, 62, 'DM'], [48, 38, 'DM'],
    [70, 80, 'W'], [68, 50, 'AM'], [70, 20, 'W'],
    [88, 50, 'CF']
  ],
  f4141: [
    [5, 50, 'GK'],
    [25, 85, 'FB'], [22, 60, 'CB'], [22, 40, 'CB'], [25, 15, 'FB'],
    [45, 50, 'DM'],
    [65, 85, 'W'], [62, 62, 'CM'], [62, 38, 'CM'], [65, 15, 'W'],
    [85, 50, 'CF']
  ],
  f442d: [ // diamond narrow
    [5, 50, 'GK'],
    [25, 85, 'FB'], [22, 60, 'CB'], [22, 40, 'CB'], [25, 15, 'FB'],
    [45, 50, 'DM'],
    [58, 68, 'CM'], [58, 32, 'CM'],
    [70, 50, 'AM'],
    [88, 60, 'CF'], [88, 40, 'CF']
  ],
  f4411: [
    [5, 50, 'GK'],
    [25, 85, 'FB'], [22, 60, 'CB'], [22, 40, 'CB'], [25, 15, 'FB'],
    [55, 85, 'W'], [50, 60, 'CM'], [50, 40, 'CM'], [55, 15, 'W'],
    [72, 50, 'CF'],
    [88, 50, 'CF']
  ],
  f424: [
    [5, 50, 'GK'],
    [25, 85, 'FB'], [22, 60, 'CB'], [22, 40, 'CB'], [25, 15, 'FB'],
    [50, 60, 'CM'], [50, 40, 'CM'],
    [82, 88, 'W'], [85, 62, 'CF'], [85, 38, 'CF'], [82, 12, 'W']
  ],
  f352: [
    [5, 50, 'GK'],
    [22, 68, 'CB'], [20, 50, 'CB'], [22, 32, 'CB'],
    [48, 88, 'WB'], [50, 65, 'CM'], [45, 50, 'DM'], [50, 35, 'CM'], [48, 12, 'WB'],
    [82, 60, 'CF'], [82, 40, 'CF']
  ],
  f343: [
    [5, 50, 'GK'],
    [22, 68, 'CB'], [20, 50, 'CB'], [22, 32, 'CB'],
    [50, 88, 'WB'], [52, 62, 'CM'], [52, 38, 'CM'], [50, 12, 'WB'],
    [82, 80, 'W'], [85, 50, 'CF'], [82, 20, 'W']
  ],
  f3241: [
    [5, 50, 'GK'],
    [22, 68, 'CB'], [20, 50, 'CB'], [22, 32, 'CB'],
    [46, 62, 'DM'], [46, 38, 'DM'],
    [68, 88, 'W'], [66, 62, 'AM'], [66, 38, 'AM'], [68, 12, 'W'],
    [88, 50, 'CF']
  ],
  f532: [
    [5, 50, 'GK'],
    [28, 88, 'WB'], [22, 68, 'CB'], [20, 50, 'CB'], [22, 32, 'CB'], [28, 12, 'WB'],
    [52, 65, 'CM'], [48, 50, 'DM'], [52, 35, 'CM'],
    [82, 60, 'CF'], [82, 40, 'CF']
  ],
  f541: [
    [5, 50, 'GK'],
    [28, 88, 'WB'], [22, 68, 'CB'], [20, 50, 'CB'], [22, 32, 'CB'], [28, 12, 'WB'],
    [56, 82, 'W'], [52, 62, 'CM'], [52, 38, 'CM'], [56, 18, 'W'],
    [85, 50, 'CF']
  ]
};

let activeFormation = 'f4231';
let activeEnemyFormation = 'f433';
let enemyManMarking = false;

// ---------- ROLE MENU ----------
const roleMenu = document.createElement('div');
roleMenu.className = 'role-menu hidden';
document.body.appendChild(roleMenu);
let activeToken = null;

function openRoleMenu(token, clientX, clientY) {
  const currentRole = token.dataset.role;
  const category = roleToCategory[currentRole];
  if (!category) {
    console.warn(`No category found for role: ${currentRole}`);
    return;
  }

  roleMenu.innerHTML = '';
  roleCategories[category].forEach(role => {
    const btn = document.createElement('button');
    btn.textContent = role;
    if (role === currentRole) btn.classList.add('current');
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      setTokenRole(token, role);
      closeRoleMenu();
    });
    roleMenu.appendChild(btn);
  });

  // Show menu temporarily to measure its size
  roleMenu.classList.remove('hidden');
  roleMenu.style.visibility = 'hidden';
  roleMenu.style.left = `${clientX + 10}px`;
  roleMenu.style.top = `${clientY + 10}px`;

  const menuRect = roleMenu.getBoundingClientRect();
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  let left = clientX + 10;
  let top = clientY + 10;

  // Flip horizontally if needed
  if (left + menuRect.width > viewportWidth) {
    left = clientX - menuRect.width - 10;
  }
  // Flip vertically if needed
  if (top + menuRect.height > viewportHeight) {
    top = clientY - menuRect.height - 10;
  }

  // Keep within boundaries
  left = Math.max(5, Math.min(left, viewportWidth - menuRect.width - 5));
  top = Math.max(5, Math.min(top, viewportHeight - menuRect.height - 5));

  roleMenu.style.left = `${left}px`;
  roleMenu.style.top = `${top}px`;
  roleMenu.style.visibility = 'visible';
  activeToken = token;
}

function closeRoleMenu() {
  roleMenu.classList.add('hidden');
  activeToken = null;
}

function setTokenRole(token, role) {
  token.dataset.role = role;
  token.textContent = role;
  if (role === 'GK') token.classList.add('gk');
  else token.classList.remove('gk');
  const index = Array.from(pitch.querySelectorAll('.tok.own')).indexOf(token);
  token.setAttribute('aria-label', `Player ${index + 1}, Role: ${role}`);
}

document.addEventListener('click', (e) => {
  if (!roleMenu.classList.contains('hidden') &&
      !roleMenu.contains(e.target) &&
      !e.target.closest('.tok')) {
    closeRoleMenu();
  }
});

// ---------- RENDER FUNCTIONS ----------
function renderFormation() {
  pitch.querySelectorAll('.tok.own').forEach(token => token.remove());
  formations[activeFormation].forEach((player, index) => {
    const [x, y, role] = player;
    const token = document.createElement('div');
    token.className = 'tok own';
    if (role === 'GK') token.classList.add('gk');
    token.dataset.role = role;
    token.textContent = role;
    token.style.left = `${x}%`;
    token.style.top = `${y}%`;
    token.setAttribute('aria-label', `Player ${index + 1}, Role: ${role}`);
    makeDraggable(token, index);
    pitch.appendChild(token);
  });
}

function renderEnemy() {
  pitch.querySelectorAll('.tok.enemy').forEach(token => token.remove());

  let enemyData;
  if (enemyManMarking) {
    enemyData = Array.from(pitch.querySelectorAll('.tok.own')).map(token => {
      const x = parseFloat(token.style.left);
      const y = parseFloat(token.style.top);
      return [Math.min(98, 100 - x), Math.min(98, y + 1), token.dataset.role];
    });
  } else {
    const base = formations[activeEnemyFormation];
    enemyData = base.map(([x, y, role]) => [100 - x, y, role]);
  }

  enemyData.forEach(([x, y, role]) => {
    const token = document.createElement('div');
    token.className = 'tok enemy';
    if (role === 'GK') token.classList.add('gk');
    token.dataset.role = role;
    token.textContent = role;
    token.style.left = `${x}%`;
    token.style.top = `${y}%`;
    token.setAttribute('aria-label', `Enemy ${role}`);
    makeDraggable(token, -1);
    pitch.appendChild(token);
  });
}

// ---------- DRAG & CLICK (with drawing tool check) ----------
let currentTool = 'select'; // 'select', 'line', 'rect', 'arrow', 'eraser'

function makeDraggable(token, index) {
  let dragging = false;
  let moved = false;
  let startX = 0, startY = 0;

  token.addEventListener('pointerdown', event => {
    if (currentTool !== 'select') return; // disable dragging when drawing
    dragging = true;
    moved = false;
    startX = event.clientX;
    startY = event.clientY;
    token.setPointerCapture(event.pointerId);
    closeRoleMenu();
  });

  token.addEventListener('pointermove', event => {
    if (!dragging) return;
    const dx = event.clientX - startX;
    const dy = event.clientY - startY;
    if (!moved && Math.hypot(dx, dy) > 3) moved = true;
    if (moved) {
      const rect = pitch.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 100;
      const y = ((event.clientY - rect.top) / rect.height) * 100;
      token.style.left = `${Math.max(0, Math.min(100, x))}%`;
      token.style.top = `${Math.max(0, Math.min(100, y))}%`;
    }
  });

  token.addEventListener('pointerup', () => {
    if (!dragging) return;
    dragging = false;
    if (enemyManMarking && token.classList.contains('own')) {
      renderEnemy();
    }
  });

  token.addEventListener('click', (e) => {
    if (currentTool !== 'select') return; // ignore clicks when drawing
    if (moved) {
      moved = false;
      return;
    }
    openRoleMenu(token, e.clientX, e.clientY);
  });
}

// ---------- DRAWING LOGIC ----------
const drawOverlay = document.getElementById('draw-overlay');
let drawings = [];
let tempShape = null;
let drawingStart = null;

function createShapeElement(type, x1, y1, x2, y2) {
  let el;
  switch (type) {
    case 'line':
      el = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      el.setAttribute('stroke', '#ffffff');
      el.setAttribute('stroke-width', '0.5');
      el.setAttribute('vector-effect', 'non-scaling-stroke');
      break;
    case 'rect':
      el = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      el.setAttribute('fill', 'rgba(255,255,255,0.2)');
      el.setAttribute('stroke', '#ffffff');
      el.setAttribute('stroke-width', '0.5');
      el.setAttribute('vector-effect', 'non-scaling-stroke');
      break;
    case 'arrow':
      el = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      el.setAttribute('stroke', '#fbbf24');
      el.setAttribute('stroke-width', '0.5');
      el.setAttribute('vector-effect', 'non-scaling-stroke');
      el.setAttribute('marker-end', 'url(#arrowhead)');
      break;
  }
  updateShapeElement(el, type, x1, y1, x2, y2);
  return el;
}

function updateShapeElement(el, type, x1, y1, x2, y2) {
  if (type === 'line' || type === 'arrow') {
    el.setAttribute('x1', x1);
    el.setAttribute('y1', y1);
    el.setAttribute('x2', x2);
    el.setAttribute('y2', y2);
  } else if (type === 'rect') {
    el.setAttribute('x', Math.min(x1, x2));
    el.setAttribute('y', Math.min(y1, y2));
    el.setAttribute('width', Math.abs(x2 - x1));
    el.setAttribute('height', Math.abs(y2 - y1));
  }
}

function eraseShapeAt(x, y) {
  for (let i = drawings.length - 1; i >= 0; i--) {
    const d = drawings[i];
    if (isPointOnShape(x, y, d)) {
      d.element.remove();
      drawings.splice(i, 1);
      break;
    }
  }
}

function isPointOnShape(x, y, drawing) {
  const { start, end, type } = drawing;
  if (type === 'rect') {
    const rx = Math.min(start.x, end.x);
    const ry = Math.min(start.y, end.y);
    const rw = Math.abs(end.x - start.x);
    const rh = Math.abs(end.y - start.y);
    return x >= rx && x <= rx + rw && y >= ry && y <= ry + rh;
  } else {
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const lengthSq = dx*dx + dy*dy;
    if (lengthSq === 0) return Math.hypot(x - start.x, y - start.y) < 1;
    let t = ((x - start.x)*dx + (y - start.y)*dy) / lengthSq;
    t = Math.max(0, Math.min(1, t));
    const projX = start.x + t*dx;
    const projY = start.y + t*dy;
    return Math.hypot(x - projX, y - projY) < 1;
  }
}

// Tool selection – sidebar buttons
document.querySelectorAll('.sidebar [data-tool]').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.sidebar [data-tool]').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentTool = btn.dataset.tool;
    if (currentTool === 'select') {
      drawOverlay.classList.remove('active');
    } else {
      drawOverlay.classList.add('active');
    }
  });
});

// Clear drawings
document.getElementById('clear-drawings').addEventListener('click', () => {
  drawings.forEach(d => d.element.remove());
  drawings = [];
});

// Drawing interactions
drawOverlay.addEventListener('pointerdown', (e) => {
  if (currentTool === 'select') return;
  e.preventDefault();
  const rect = pitch.getBoundingClientRect();
  const x = ((e.clientX - rect.left) / rect.width) * 100;
  const y = ((e.clientY - rect.top) / rect.height) * 100;
  drawingStart = { x, y };

  if (currentTool === 'eraser') {
    eraseShapeAt(x, y);
    return;
  }

  tempShape = createShapeElement(currentTool, x, y, x, y);
  drawOverlay.appendChild(tempShape);
});

drawOverlay.addEventListener('pointermove', (e) => {
  if (!drawingStart || !tempShape) return;
  const rect = pitch.getBoundingClientRect();
  const x = ((e.clientX - rect.left) / rect.width) * 100;
  const y = ((e.clientY - rect.top) / rect.height) * 100;
  updateShapeElement(tempShape, currentTool, drawingStart.x, drawingStart.y, x, y);
});

drawOverlay.addEventListener('pointerup', (e) => {
  if (!drawingStart) return;
  const rect = pitch.getBoundingClientRect();
  const x = ((e.clientX - rect.left) / rect.width) * 100;
  const y = ((e.clientY - rect.top) / rect.height) * 100;
  if (tempShape) {
    drawings.push({
      type: currentTool,
      start: drawingStart,
      end: { x, y },
      element: tempShape
    });
  }
  tempShape = null;
  drawingStart = null;
});

// ---------- OWN FORMATION MODAL ----------
const formationModal = document.getElementById('formation-modal');
const formationGrid = document.getElementById('formation-grid');
const openFormationBtn = document.getElementById('open-formation-modal');
const closeFormationBtn = document.getElementById('close-formation-modal');

function getDefenderCount(key) {
  return parseInt(key.slice(1)[0]);
}

function renderFormationButtons() {
  const container = document.getElementById('formation-grid');
  container.innerHTML = '';

  const sortedKeys = Object.keys(formations).sort((a, b) => getDefenderCount(a) - getDefenderCount(b));
  const groups = {};
  sortedKeys.forEach(key => {
    const back = getDefenderCount(key);
    if (!groups[back]) groups[back] = [];
    groups[back].push(key);
  });

  Object.keys(groups)
    .sort((a, b) => a - b)
    .forEach(back => {
      const groupDiv = document.createElement('div');
      groupDiv.className = 'formation-group';

      const title = document.createElement('p');
      title.className = 'formation-group-title';
      title.textContent = `${back} back formation`;
      groupDiv.appendChild(title);

      const gridDiv = document.createElement('div');
      gridDiv.className = 'formation-group-grid';

      groups[back].forEach(key => {
        const btn = document.createElement('button');
        btn.className = 'formation-btn';
        btn.textContent = key.toUpperCase().replace('D', ' Diamond');
        btn.dataset.formation = key;
        if (key === activeFormation) btn.classList.add('active');
        btn.addEventListener('click', () => {
          activeFormation = key;
          renderFormation();
          closeFormationModal();
          renderFormationButtons();
        });
        gridDiv.appendChild(btn);
      });

      groupDiv.appendChild(gridDiv);
      container.appendChild(groupDiv);
    });
}

function openFormationModal() {
  formationModal.classList.remove('hidden');
  renderFormationButtons();
}

function closeFormationModal() {
  formationModal.classList.add('hidden');
}

openFormationBtn.addEventListener('click', openFormationModal);
closeFormationBtn.addEventListener('click', closeFormationModal);

// ---------- ENEMY MODAL ----------
const enemyModal = document.getElementById('enemy-modal');
const enemyGrid = document.getElementById('enemy-formation-grid');
const openEnemyBtn = document.getElementById('open-enemy-modal');
const closeEnemyBtn = document.getElementById('close-enemy-modal');
const manMarkingBtn = document.getElementById('man-marking-toggle');

function updateManMarkingButton() {
  if (enemyManMarking) {
    manMarkingBtn.textContent = 'Man‑to‑man marking: ON';
    manMarkingBtn.classList.add('active');
  } else {
    manMarkingBtn.textContent = 'Man‑to‑man marking: OFF';
    manMarkingBtn.classList.remove('active');
  }
}

function renderEnemyFormationButtons() {
  enemyGrid.innerHTML = '';
  Object.keys(formations).forEach(key => {
    const btn = document.createElement('button');
    btn.className = 'formation-btn';
    btn.textContent = key.toUpperCase().replace('D', ' Diamond');
    btn.dataset.formation = key;
    if (key === activeEnemyFormation) btn.classList.add('active');
    btn.addEventListener('click', () => {
      activeEnemyFormation = key;
      enemyManMarking = false;
      updateManMarkingButton();
      renderEnemy();
      closeEnemyModal();
      renderEnemyFormationButtons();
    });
    enemyGrid.appendChild(btn);
  });
}

manMarkingBtn.addEventListener('click', () => {
  enemyManMarking = !enemyManMarking;
  updateManMarkingButton();
  renderEnemy();
});

function openEnemyModal() {
  enemyModal.classList.remove('hidden');
  renderEnemyFormationButtons();
}

function closeEnemyModal() {
  enemyModal.classList.add('hidden');
}

openEnemyBtn.addEventListener('click', openEnemyModal);
closeEnemyBtn.addEventListener('click', closeEnemyModal);

// Close modals on overlay click
document.addEventListener('click', (e) => {
  if (e.target === formationModal) closeFormationModal();
  if (e.target === enemyModal) closeEnemyModal();
});

// Escape key closes everything
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeFormationModal();
    closeEnemyModal();
    closeRoleMenu();
  }
});

// ---------- INITIAL RENDER ----------
renderFormation();
renderEnemy();
renderFormationButtons();
updateManMarkingButton();