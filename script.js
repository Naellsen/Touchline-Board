const pitch = document.getElementById('pitch');

const roleCategories = {
  GK: ['GK','SK','BGK'],
  CB: ['CB','BPD','WCD','ACB'],
  FB: ['FB','WB','CWB','IWB','IFB','PWB'],
  DM: ['DM', 'DLP', 'BBP', 'BBM', 'HB'],
  CM: ['CM', 'WCM', 'MP', 'WM'],
  AM: ['AM','AP','FR','SS','CHM'],
  W:  ['W','IF','IW','WF','PW'],
  CF: ['CF', 'CHF','DLF','F9','P','TF']
}

const roleToCategory = {};
Object.entries(roleCategories).forEach(([category, roles]) => {
  roles.forEach(role => roleToCategory[role] = category);
});


const formations = {
  f433:[
    [5, 50, 'GK'],
    [18, 30, 'CB'],
    [18, 60, 'CB'],
    [24, 15, 'FB'],
    [24, 85, 'FB'],
    [40, 50, 'DM'],
    [50, 65, 'CM'],
    [50, 35, 'CM'],
    [70, 15, 'W'],
    [70, 85, 'W'],
    [90, 50, 'CF']
  ],
  f4231: [
    [5,50, 'GK'],
    [18, 35, 'CB'],
    [18, 65, 'CB'],
    [24, 15, 'FB'],
    [24, 85, 'FB'],
    [34, 35, 'DM'],
    [34, 65, 'DM'],
    [70, 50, 'AM'],
    [70, 15, 'W'],
    [70, 85, 'W'],
    [90, 50, 'CF']
  ]

};

let activeFormation = 'f433';

const roleMenu = document.createElement('div');
roleMenu.className = 'role-menu hidden';
document.body.appendChild(roleMenu);

let activeToken = null;

function openRoleMenu(token, clientX, clientY){
  const currentRole = token.dataset.role;
  const category = roleToCategory[currentRole];


  if (!category){
    console.warn(`No category found for role: ${currentRole}`);
    return;
  }

  roleMenu.innerHTML= '';

  roleCategories[category].forEach(role => {
    const btn = document.createElement('button');
    btn.textContent = role;
    if(role === currentRole) btn.classList.add('current');
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      setTokenRole(token, role);
      closeRoleMenu();
    });
    roleMenu.appendChild(btn);
  });
  
  roleMenu.style.left = `${clientX + 10}px`;
  roleMenu.style.top = `${clientY + 10}px`;
  roleMenu.classList.remove('hidden');
  activeToken = token;
}

function closeRoleMenu(){
  roleMenu.classList.add('hidden');
  activeToken = null;
}

function setTokenRole(token, role){
  token.dataset.role = role;
  token.textContent = role;

  if(role === 'GK'){
    token.classList.add('gk');
  }
  else{
    token.classList.remove('gk');
  }

  const index = Array.from(pitch.querySelectorAll('.tok')).indexOf(token);
  token.setAttribute('aria-label', `Player ${index + 1}, Role: ${role}`);
}

document.addEventListener('click', (e) => {
  if (!roleMenu.classList.contains('hidden')&&
      !roleMenu.contains(e.target) &&
      !e.target.closest('.tok')){
        closeRoleMenu();
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeRoleMenu();
});

function renderFormation() {
  pitch.querySelectorAll('.tok').forEach(token => token.remove());

  formations[activeFormation].forEach((player, index) => {
        const [x, y, role] = player;
        const token = document.createElement('div');
        token.className = 'tok';
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

function makeDraggable(token, index) {
  let dragging = false;
  let moved = false;
  let startX = 0;
  let startY = 0;

  token.addEventListener('pointerdown', event => {
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

        // Only start moving after passing a small threshold (3px)
      if (!moved && Math.hypot(dx, dy) > 3) {
            moved = true;
      }

      if (moved) {
            const rect = pitch.getBoundingClientRect();
            const x = ((event.clientX - rect.left) / rect.width) * 100;
            const y = ((event.clientY - rect.top) / rect.height) * 100;
            token.style.left = `${Math.max(0, Math.min(100, x))}%`;
            token.style.top = `${Math.max(0, Math.min(100, y))}%`;
      }
  });

  token.addEventListener('pointerup', () => {
        dragging = false;
  });

  token.addEventListener('click', (e) => {
        // If we just dragged, ignore the click
        if (moved) {
            moved = false;
            return;
        }

        openRoleMenu(token, e.clientX, e.clientY);
  });
}

document.getElementById('f443').addEventListener('click', () => {
  activeFormation = 'f443';
  renderFormation();
});

document.getElementById('f4231').addEventListener('click', () =>{
  activeFormation = 'f4231';
  renderFormation();
})

renderFormation();