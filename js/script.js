const keys = document.getElementsByClassName("key");
const audioMap = {};

function removeTransition(event) {
    if (event.propertyName !== 'transform') return;
    this.classList.remove('active');
}

async function preloadSounds() {
    const keyCodesToPreload = [65, 83, 68, 70, 71, 72, 74, 75, 76]; // Keycodes for A, S, D, F, G, H, J, K, and L
    for (let keyCode of keyCodesToPreload) {
        const response = await fetch(`sounds/${keyCode}.wav`);
        if (response.ok) {
            const audio = new Audio();
            audio.src = `sounds/${keyCode}.wav`;
            audioMap[keyCode] = audio;
        } else {
            console.error(`Sound file for keycode ${keyCode} not found.`);
        }
    }
}

async function playSound(event) {
    const keyCode = event.keyCode;
    const keyElement = document.querySelector(`.key[data-key="${keyCode}"]`);
    if (!keyElement) return;

    keyElement.classList.add('active');

    const audio = audioMap[keyCode];
    if (audio) {
        audio.currentTime = 0;
        audio.play();
    }

    setTimeout(() => {
        keyElement.classList.remove('active');
    }, 150);
}

Array.from(keys).forEach(key => {
    key.addEventListener('transitionend', removeTransition);
});

window.addEventListener('keydown', playSound);

Array.from(keys).forEach(key => {
    key.addEventListener('click', function () {
        const keyCode = this.getAttribute('data-key');
        playSound({ keyCode: parseInt(keyCode) });
    });
});

// Preload sound files for specific keycodes when the page loads
preloadSounds();
