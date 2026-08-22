const pitch = document.getElementById('pitch');

const formations = {
    f433: [
        [3, 20, 'gk'], [5, 30], [7,40], [8,60], [6,50], [8,90], [,5,90], [6, 50], [9, 100], [8, 20], [9, 90]
    ]
};

let activeFormation = 'f433';

function renderFormation() {
    pitch.querySelectorAll('.tok').forEach(token => token.remove());

    formations[activeFormation].forEach((player, index) => {
        const [x, y, type] = player;
        const token = document.createElement('div');
        token.className = `tok${type === 'gk' ? 'gk': ''}`;
        token.textContent = index + 1;
        if(type == 'gk') token.style.background = '#ffd758'
        token.style.left = `${x}%`;
        token.style.top = `${y}%`;
        token.setAttribute('arial-label', `Player ${index + 1}`);
        makeDraggable(token, index);
        pitch.appendChild(token);
    });
}

function makeDraggable(token, playerIndex){
    let dragging = false;

    token.addEventListener('pointerdown', event => {
        dragging = true;
        token.setPointerCapture(event.pointerId);
        token.style.cursor = 'grabbing';
    });

    token.addEventListener('pointermove' event => {
        if (!dragging) return;

        
    });
}

document.getElementById('f443').addEventListener('click', () => {
    activeFormation = 'f443';
    renderFormation();
});

renderFormation();