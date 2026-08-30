const pitch = document.getElementById('pitch');
const zoomContainer = document.getElementById('pitch-zoom-container');

// ---------- ZOOM SYSTEM ----------
let currentZoom = 1;
const minZoom = 0.6;
const maxZoom = 1.6;
const zoomStep = 0.15;

document.getElementById('zoom-in').addEventListener('click', () => {
  if (currentZoom < maxZoom) {
    currentZoom += zoomStep;
    zoomContainer.style.transform = `scale(${currentZoom})`;
  }
});

document.getElementById('zoom-out').addEventListener('click', () => {
  if (currentZoom > minZoom) {
    currentZoom -= zoomStep;
    zoomContainer.style.transform = `scale(${currentZoom})`;
  }
});

// ---------- ZONE SYSTEM ----------
let activeZoneSystem = 'none';

const zoneConfigurations = {
  // Standard 18-Zone Layout (Numbered 1-18 from Left to Right, Top to Bottom)
  18: {
    className: 'grid-18',
    label: '18 Zones',
    zones: [
      { id: 1, col: 1, row: 1 },  { id: 4, col: 2, row: 1 },  { id: 7, col: 3, row: 1 },  { id: 10, col: 4, row: 1 }, { id: 13, col: 5, row: 1 }, { id: 16, col: 6, row: 1 },
      { id: 2, col: 1, row: 2 },  { id: 5, col: 2, row: 2 },  { id: 8, col: 3, row: 2 },  { id: 11, col: 4, row: 2 }, { id: 14, col: 5, row: 2 }, { id: 17, col: 6, row: 2 },
      { id: 3, col: 1, row: 3 },  { id: 6, col: 2, row: 3 },  { id: 9, col: 3, row: 3 },  { id: 12, col: 4, row: 3 }, { id: 15, col: 5, row: 3 }, { id: 18, col: 6, row: 3 }
    ]
  },

  // 20-Zone Layout
  // 20-Zone Layout (Phase of Play matching the reference image)
  // 20-Zone Layout (Exact Phase of Play rotation)
  // 20-Zone Layout (Exact Phase of Play rotation)
  20: {
    className: 'grid-20',
    label: 'Pep Zone',
    zones: [
      // Left Goal / Defensive Third (Zones 1-3)
      { id: 3, col: 1, row: 5 },
      { id: 2, col: 1, row: '2 / span 3' },
      { id: 1, col: 1, row: 1 },

      // Middle Defensive Phases (Zones 4-10)
      { id: 9, col: 2, row: 5 },
      { id: 8, col: '2/ span 2', row: 4 },
      { id: 7, col: '2 / span 2', row: 3 },
      { id: 6, col: '2/ span 2', row: 2 },
      { id: 10, col: 3, row: 5 },
      { id: 4, col:2, row: 1 },
      { id: 5, col: 3, row: 1 },

      // Middle Attacking Phases (Zones 11-17)
      { id: 16, col: 4, row: 5 },
      { id: 11, col: 4, row: 1 },
      { id: 17, col: 5, row: 5 },
      { id: 15, col: '4 / span 2', row: 4 },
      { id: 14, col: '4 / span 2', row: 3 },
      { id: 13, col: '4 / span 2', row: 2 },
      { id: 12, col: 5, row: 1 },

      // Right Goal / Attacking Third (Zones 18-20)
      { id: 19, col: 6, row: 5 },
      { id: 20, col: 6, row: '2 / span 3' },
      { id: 18, col: 6, row: 1 }
    ]
  },

  // 5 Tactical Channels Layout
  channels: {
    className: 'grid-channels',
    label: '5 Channels',
    zones: [
      { text: 'Channel', col: 1, row: 1 },
      { text: 'Half Space', col: 1, row: 2, customClass: 'half-space' },
      { text: 'Central Zone', col: 1, row: 3, customClass: 'central-zone' },
      { text: 'Half Space', col: 1, row: 4, customClass: 'half-space' },
      { text: 'Channel', col: 1, row: 5 },

      { text: 'Channel', col: 2, row: 1 },
      { text: 'Half Space', col: 2, row: 2, customClass: 'half-space' },
      { text: 'Central Zone', col: 2, row: 3, customClass: 'central-zone' },
      { text: 'Half Space', col: 2, row: 4, customClass: 'half-space' },
      { text: 'Channel', col: 2, row: 5 }
    ]
  }
};

function renderPitchZones() {
  const zonesContainer = document.getElementById('pitch-zones');
  zonesContainer.innerHTML = '';

  if (activeZoneSystem === 'none' || !zoneConfigurations[activeZoneSystem]) {
    zonesContainer.className = 'pitch-zones hidden';
    document.getElementById('zone-label').textContent = 'Zones';
    return;
  }

  const config = zoneConfigurations[activeZoneSystem];
  document.getElementById('zone-label').textContent = config.label;
  zonesContainer.className = `pitch-zones ${config.className}`;

  config.zones.forEach(zone => {
    const el = document.createElement('div');
    el.className = `zone ${zone.customClass || ''}`;
    el.textContent = zone.text || zone.id;

    if (zone.customClass) el.classList.add('channel-label');
    el.style.gridColumn = zone.col;
    el.style.gridRow = zone.row;

    zonesContainer.appendChild(el);
  });
}

// Modal Handlers for Zones
const zoneModal = document.getElementById('zone-modal');
document.getElementById('open-zone-modal').addEventListener('click', () => {
  zoneModal.classList.remove('hidden');
});

document.getElementById('close-zone-modal').addEventListener('click', () => {
  zoneModal.classList.add('hidden');
});

document.querySelectorAll('#zone-modal-grid .formation-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('#zone-modal-grid .formation-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    activeZoneSystem = btn.dataset.zone;
    renderPitchZones();
    zoneModal.classList.add('hidden');
  });
});

// ---------- ROLE DATA ----------
const roleCategories = {
  GK: ['GK','SK','BGK'],
  CB: ['CB','BPD','WCD','ACB'],
  FB: ['FB','WB','CWB','IWB','IFB','PWB'],
  DM: ['DM', 'DLP', 'BBP', 'BBM', 'HB'],
  CM: ['CM', 'WCM', 'MP', 'WM'],
  AM: ['AM','AP','FR','SS','CHM'],
  W:  ['W','IF','IW','WF','PW'],
  CF: ['CF', 'ST', 'CHF','DLF','F9','P','TF']
};

const roleToCategory = {};
Object.entries(roleCategories).forEach(([category, roles]) => {
  roles.forEach(role => roleToCategory[role] = category);
});

// ---------- FORMATIONS & LABELS ----------
const formationNames = {
  f442: '4-4-2',
  f442d: '4-4-2 Diamond',
  f433: '4-3-3',
  f4231: '4-2-3-1',
  f4141: '4-1-4-1',
  f352: '3-5-2',
  f343: '3-4-3',
  f532: '5-3-2',
  f541: '5-4-1',
  f523: '5-2-3'
};

const formations = {
  f442: [
    [6, 50, 'GK', 'Player 1'],
    [24, 85, 'WB', 'Player 2'], [20, 62, 'CB', 'Player 3'], [20, 38, 'CB', 'Player 4'], [24, 15, 'WB', 'Player 5'],
    [58, 85, 'W', 'Player 6'], [50, 60, 'CM', 'Player 7'], [50, 40, 'CM', 'Player 8'], [58, 15, 'W', 'Player 9'],
    [78, 50, 'ST', 'Player 10'], [78, 30, 'CF', 'Player 11']
  ],
  f442d: [
    [6, 50, 'GK', 'Player 1'],
    [24, 85, 'WB', 'Player 2'], [20, 62, 'CB', 'Player 3'], [20, 38, 'CB', 'Player 4'], [24, 15, 'WB', 'Player 5'],
    [40, 50, 'DM', 'Player 6'], [54, 70, 'CM', 'Player 7'], [54, 30, 'CM', 'Player 8'], [68, 50, 'AM', 'Player 9'],
    [80, 60, 'ST', 'Player 10'], [80, 40, 'CF', 'Player 11']
  ],
  f433: [
    [6, 50, 'GK', 'Player 1'],
    [24, 85, 'WB', 'Player 2'], [20, 62, 'CB', 'Player 3'], [20, 38, 'CB', 'Player 4'], [24, 15, 'WB', 'Player 5'],
    [42, 50, 'DM', 'Player 6'], [55, 65, 'CM', 'Player 7'], [55, 35, 'CM', 'Player 8'],
    [78, 85, 'W', 'Player 9'], [82, 50, 'ST', 'Player 10'], [78, 15, 'W', 'Player 11']
  ],
  f4231: [
    [6, 50, 'GK', 'Player 1'],
    [24, 85, 'WB', 'Player 2'], [20, 62, 'CB', 'Player 3'], [20, 38, 'CB', 'Player 4'], [24, 15, 'WB', 'Player 5'],
    [45, 62, 'CM', 'Player 6'], [45, 38, 'CM', 'Player 7'],
    [70, 80, 'W', 'Player 8'], [68, 50, 'AM', 'Player 9'], [70, 20, 'W', 'Player 10'],
    [84, 50, 'ST', 'Player 11']
  ],
  f4141: [
    [6, 50, 'GK', 'Player 1'],
    [24, 85, 'WB', 'Player 2'], [20, 62, 'CB', 'Player 3'], [20, 38, 'CB', 'Player 4'], [24, 15, 'WB', 'Player 5'],
    [40, 50, 'DM', 'Player 6'],
    [60, 85, 'W', 'Player 7'], [58, 62, 'CM', 'Player 8'], [58, 38, 'CM', 'Player 9'], [60, 15, 'W', 'Player 10'],
    [82, 50, 'ST', 'Player 11']
  ],
  f352: [
    [6, 50, 'GK', 'Player 1'],
    [20, 72, 'CB', 'Player 2'], [18, 50, 'CB', 'Player 3'], [20, 28, 'CB', 'Player 4'],
    [45, 88, 'WB', 'Player 5'], [50, 65, 'CM', 'Player 6'], [42, 50, 'DM', 'Player 7'], [50, 35, 'CM', 'Player 8'], [45, 12, 'WB', 'Player 9'],
    [78, 60, 'ST', 'Player 10'], [78, 40, 'CF', 'Player 11']
  ],
  f343: [
    [6, 50, 'GK', 'Player 1'],
    [20, 72, 'CB', 'Player 2'], [18, 50, 'CB', 'Player 3'], [20, 28, 'CB', 'Player 4'],
    [48, 88, 'WB', 'Player 5'], [48, 60, 'CM', 'Player 6'], [48, 40, 'CM', 'Player 7'], [48, 12, 'WB', 'Player 8'],
    [78, 82, 'W', 'Player 9'], [82, 50, 'ST', 'Player 10'], [78, 18, 'W', 'Player 11']
  ],
  f532: [
    [6, 50, 'GK', 'Player 1'],
    [24, 88, 'WB', 'Player 2'], [20, 68, 'CB', 'Player 3'], [18, 50, 'CB', 'Player 4'], [20, 32, 'CB', 'Player 5'], [24, 12, 'WB', 'Player 6'],
    [48, 65, 'CM', 'Player 7'], [42, 50, 'DM', 'Player 8'], [48, 35, 'CM', 'Player 9'],
    [78, 60, 'ST', 'Player 10'], [78, 40, 'CF', 'Player 11']
  ],
  f541: [
    [6, 50, 'GK', 'Player 1'],
    [24, 88, 'WB', 'Player 2'], [20, 68, 'CB', 'Player 3'], [18, 50, 'CB', 'Player 4'], [20, 32, 'CB', 'Player 5'], [24, 12, 'WB', 'Player 6'],
    [54, 82, 'W', 'Player 7'], [50, 62, 'CM', 'Player 8'], [50, 38, 'CM', 'Player 9'], [54, 18, 'W', 'Player 10'],
    [80, 50, 'ST', 'Player 11']
  ],
  f523: [
    [6, 50, 'GK', 'Player 1'],
    [24, 88, 'WB', 'Player 2'], [20, 68, 'CB', 'Player 3'], [18, 50, 'CB', 'Player 4'], [20, 32, 'CB', 'Player 5'], [24, 12, 'WB', 'Player 6'],
    [48, 62, 'CM', 'Player 7'], [48, 38, 'CM', 'Player 8'],
    [76, 82, 'W', 'Player 9'], [82, 50, 'ST', 'Player 10'], [76, 18, 'W', 'Player 11']
  ]
};

let activeFormation = true;
let activeEnemyFormation = true;

// ---------- ROLE MENU ----------
const roleMenu = document.createElement('div');
roleMenu.className = 'role-menu hidden';
document.body.appendChild(roleMenu);

function openRoleMenu(token, clientX, clientY) {
  const currentRole = token.dataset.role;
  const category = roleToCategory[currentRole];
  if (!category) return;

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

  roleMenu.classList.remove('hidden');
  roleMenu.style.left = `${Math.min(clientX, window.innerWidth - 160)}px`;
  roleMenu.style.top = `${Math.min(clientY, window.innerHeight - 120)}px`;
}

function closeRoleMenu() {
  roleMenu.classList.add('hidden');
}

function setTokenRole(token, role) {
  token.dataset.role = role;
  const circle = token.querySelector('.tok-circle');
  if (circle) circle.textContent = role;
}

document.addEventListener('click', (e) => {
  if (!roleMenu.classList.contains('hidden') && !roleMenu.contains(e.target) && !e.target.closest('.tok')) {
    closeRoleMenu();
  }
});

// ---------- INLINE EDIT PLAYER NAME FEATURE ----------
function enableNameEditing(label, playerIndex) {
  label.addEventListener('dblclick', (e) => {
    e.stopPropagation();
    const currentName = label.textContent;

    const input = document.createElement('input');
    input.type = 'text';
    input.value = currentName;
    input.className = 'tok-name-input';

    label.replaceWith(input);
    
    setTimeout(() => {
      input.focus();
      input.select();
    }, 10);

    const saveName = () => {
      const newName = input.value.trim() || currentName;
      label.textContent = newName;
      if (input.parentNode) {
        input.replaceWith(label);
      }
      if (formations[activeFormation] && formations[activeFormation][playerIndex]) {
        formations[activeFormation][playerIndex][3] = newName;
      }
    };

    input.addEventListener('blur', saveName);
    input.addEventListener('keydown', (evt) => {
      if (evt.key === 'Enter') saveName();
      if (evt.key === 'Escape') {
        if (input.parentNode) input.replaceWith(label);
      }
    });
  });
}

// ---------- RENDER FUNCTIONS ----------
function renderFormation() {
  pitch.querySelectorAll('.tok.own').forEach(token => token.remove());
  formations[activeFormation].forEach((player, index) => {
    const [x, y, role, name] = player;
    const token = document.createElement('div');
    token.className = 'tok own';
    token.dataset.role = role;
    token.style.left = `${x}%`;
    token.style.top = `${y}%`;

    const circle = document.createElement('div');
    circle.className = 'tok-circle';
    circle.textContent = role;

    const label = document.createElement('div');
    label.className = 'tok-name';
    label.textContent = name || `Player ${index + 1}`;
    enableNameEditing(label, index);

    token.appendChild(circle);
    token.appendChild(label);

    makeDraggable(token);
    pitch.appendChild(token);
  });

  document.getElementById('home-formation-label').textContent = formationNames[activeFormation] || activeFormation.toUpperCase();
}

function renderEnemy() {
  pitch.querySelectorAll('.tok.enemy').forEach(token => token.remove());
  const base = formations[activeEnemyFormation];

  base.forEach(([x, y, role]) => {
    const token = document.createElement('div');
    token.className = 'tok enemy';
    token.dataset.role = role;
    token.style.left = `${100 - x}%`;
    token.style.top = `${y}%`;

    const circle = document.createElement('div');
    circle.className = 'tok-circle';
    token.appendChild(circle);

    makeDraggable(token);
    pitch.appendChild(token);
  });

  document.getElementById('away-formation-label').textContent = formationNames[activeEnemyFormation] || activeEnemyFormation.toUpperCase();
}

// ---------- DRAGGABLE SYSTEM ----------
let currentTool = 'select';

function makeDraggable(token) {
  let dragging = false;
  let moved = false;
  let startX = 0, startY = 0;

  token.addEventListener('pointerdown', event => {
    if (
      currentTool !== 'select' || 
      event.target.classList.contains('tok-name') || 
      event.target.tagName === 'INPUT'
    ) {
      return;
    }

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
      token.style.left = `${Math.max(2, Math.min(98, x))}%`;
      token.style.top = `${Math.max(2, Math.min(98, y))}%`;
    }
  });

  token.addEventListener('pointerup', () => {
    dragging = false;
  });

  token.addEventListener('click', (e) => {
    if (
      currentTool !== 'select' || 
      moved || 
      !token.classList.contains('own') || 
      e.target.classList.contains('tok-name') || 
      e.target.tagName === 'INPUT'
    ) {
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
let activePassPoints = [];

function getSnapPoint(x, y) {
  const tokens = pitch.querySelectorAll('.tok');
  let closest = null;
  let minDist = 5;

  tokens.forEach(tok => {
    const tx = parseFloat(tok.style.left);
    const ty = parseFloat(tok.style.top);
    const dist = Math.hypot(x - tx, y - ty);
    if (dist < minDist) {
      minDist = dist;
      closest = { x: tx, y: ty };
    }
  });

  return closest || { x, y };
}

function createShapeElement(type, x1, y1, x2, y2) {
  let el;
  switch (type) {
    case 'line':
    case 'pass-chain':
      el = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
      el.setAttribute('fill', 'rgba(251, 191, 36, 0.15)');
      el.setAttribute('stroke', '#fbbf24');
      el.setAttribute('stroke-width', '0.6');
      el.setAttribute('stroke-dasharray', '2,2');
      el.setAttribute('stroke-linejoin', 'round');
      el.setAttribute('vector-effect', 'non-scaling-stroke');
      break;
    case 'rect':
      el = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      el.setAttribute('fill', 'rgba(255,255,255,0.15)');
      el.setAttribute('stroke', '#ffffff');
      el.setAttribute('stroke-width', '0.5');
      el.setAttribute('vector-effect', 'non-scaling-stroke');
      break;
    case 'arrow':
      el = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      el.setAttribute('stroke', '#fbbf24');
      el.setAttribute('stroke-width', '0.8');
      el.setAttribute('stroke-dasharray', '3,3');
      el.setAttribute('vector-effect', 'non-scaling-stroke');
      el.setAttribute('marker-end', 'url(#arrowhead)');
      break;
  }
  updateShapeElement(el, type, x1, y1, x2, y2);
  return el;
}

function updateShapeElement(el, type, x1, y1, x2, y2, passPoints = []) {
  if (type === 'line' || type === 'pass-chain') {
    if (passPoints.length > 0) {
      el.setAttribute('points', passPoints.map(p => `${p.x},${p.y}`).join(' '));
    } else {
      el.setAttribute('points', `${x1},${y1} ${x2},${y2}`);
    }
  } else if (type === 'arrow') {
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

document.querySelectorAll('.sidebar [data-tool]').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.sidebar [data-tool]').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentTool = btn.dataset.tool;
    if (currentTool === 'select') drawOverlay.classList.remove('active');
    else drawOverlay.classList.add('active');
  });
});

document.getElementById('clear-drawings').addEventListener('click', () => {
  drawings.forEach(d => d.element.remove());
  drawings = [];
});

drawOverlay.addEventListener('pointerdown', (e) => {
  if (currentTool === 'select') return;
  e.preventDefault();
  const rect = pitch.getBoundingClientRect();
  const rawX = ((e.clientX - rect.left) / rect.width) * 100;
  const rawY = ((e.clientY - rect.top) / rect.height) * 100;
  
  const snap = getSnapPoint(rawX, rawY);
  drawingStart = snap;

  if (currentTool === 'line') {
    if (!activePassPoints.length) activePassPoints.push(snap);
    activePassPoints.push(snap);
    tempShape = createShapeElement('pass-chain', snap.x, snap.y, snap.x, snap.y);
    updateShapeElement(tempShape, 'pass-chain', 0, 0, 0, 0, activePassPoints);
    drawOverlay.appendChild(tempShape);
  } else {
    tempShape = createShapeElement(currentTool, snap.x, snap.y, snap.x, snap.y);
    drawOverlay.appendChild(tempShape);
  }
});

drawOverlay.addEventListener('pointermove', (e) => {
  if (!drawingStart || !tempShape) return;
  const rect = pitch.getBoundingClientRect();
  const snap = getSnapPoint(((e.clientX - rect.left) / rect.width) * 100, ((e.clientY - rect.top) / rect.height) * 100);

  if (currentTool === 'line' && activePassPoints.length > 1) {
    activePassPoints[activePassPoints.length - 1] = snap;
    updateShapeElement(tempShape, 'pass-chain', 0, 0, 0, 0, activePassPoints);
  } else {
    updateShapeElement(tempShape, currentTool, drawingStart.x, drawingStart.y, snap.x, snap.y);
  }
});

drawOverlay.addEventListener('pointerup', () => {
  if (tempShape) drawings.push({ type: currentTool, element: tempShape });
  activePassPoints = [];
  tempShape = null;
  drawingStart = null;
});

// ---------- MODAL MANAGEMENT ----------
function getDefenderCount(key) {
  return parseInt(key.slice(1)[0]);
}

function renderModalGrid(gridEl, activeKey, onSelect) {
  gridEl.innerHTML = '';
  const sortedKeys = Object.keys(formations).sort((a, b) => getDefenderCount(a) - getDefenderCount(b));
  const groups = {};
  
  sortedKeys.forEach(key => {
    const back = getDefenderCount(key);
    if (!groups[back]) groups[back] = [];
    groups[back].push(key);
  });

  Object.keys(groups).forEach(back => {
    const groupDiv = document.createElement('div');
    groupDiv.className = 'formation-group';
    
    const title = document.createElement('p');
    title.className = 'formation-group-title';
    title.textContent = `${back}-back Formations`;
    groupDiv.appendChild(title);

    const gridDiv = document.createElement('div');
    gridDiv.className = 'formation-group-grid';

    groups[back].forEach(key => {
      const btn = document.createElement('button');
      btn.className = 'formation-btn';
      btn.textContent = formationNames[key] || key.toUpperCase();
      if (key === activeKey) btn.classList.add('active');
      btn.addEventListener('click', () => onSelect(key));
      gridDiv.appendChild(btn);
    });

    groupDiv.appendChild(gridDiv);
    gridEl.appendChild(groupDiv);
  });
}

const fModal = document.getElementById('formation-modal');
const eModal = document.getElementById('enemy-modal');

document.getElementById('open-formation-modal').addEventListener('click', () => {
  renderModalGrid(document.getElementById('formation-grid'), activeFormation, (key) => {
    activeFormation = key;
    renderFormation();
    fModal.classList.add('hidden');
  });
  fModal.classList.remove('hidden');
});

document.getElementById('open-enemy-modal').addEventListener('click', () => {
  renderModalGrid(document.getElementById('enemy-formation-grid'), activeEnemyFormation, (key) => {
    activeEnemyFormation = key;
    renderEnemy();
    eModal.classList.add('hidden');
  });
  eModal.classList.remove('hidden');
});

document.getElementById('close-formation-modal').addEventListener('click', () => fModal.classList.add('hidden'));
document.getElementById('close-enemy-modal').addEventListener('click', () => eModal.classList.add('hidden'));

// ---------- INIT ----------
renderFormation();
renderEnemy();
renderPitchZones();