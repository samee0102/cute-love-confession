console.log("💖 CuteOS v2.0 Initialized...");



// --- 1. Dynamic Background ---
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');
let particles = [];

function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
window.onresize = resize;
resize();



class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.speed = Math.random() * 0.5 + 0.2;
        this.char = Math.random() > 0.5 ? '💖' : '✨';
        this.size = Math.random() * 15 + 10;
    }
    update() {
        this.y -= this.speed;
        if(this.y < -20) { this.y = canvas.height + 20; this.x = Math.random() * canvas.width; }
    }
    draw() {
        ctx.font = `${this.size}px Arial`;
        ctx.fillStyle = "rgba(255,255,255,0.3)";
        ctx.fillText(this.char, this.x, this.y);
    }
}



for(let i=0; i<30; i++) particles.push(new Particle());

function animate() {
    ctx.clearRect(0,0,canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animate);
}
animate();



// --- 2. Draggable Logic ---
function makeDraggable(el) {
    let pos1=0, pos2=0, pos3=0, pos4=0;
    const header = el.querySelector('.title-bar');
    header.onmousedown = dragMouseDown;



    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
        el.style.zIndex = 100;
    }



    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        el.style.top = (el.offsetTop - pos2) + "px";
        el.style.left = (el.offsetLeft - pos1) + "px";
        el.style.transform = "translate(0,0)";
    }



    function closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;
    }
}
makeDraggable(document.getElementById('main-window'));
makeDraggable(document.getElementById('widget-music'));



// --- 3. Interaction Logic ---
const btnYes = document.getElementById('btn-yes');
const btnNo = document.getElementById('btn-no');
const teaseBubble = document.getElementById('tease-bubble');
const bubbleText = document.getElementById('bubble-text');
const hugOverlay = document.getElementById('hug-overlay');
const mainWindow = document.getElementById('main-window');



// Texts to cycle through for the "NO" button
const rejectionTexts = [
    "Click Again", 
    "Really?", 
    "Are you sure?", 
    "Think Again", 
    "Last Chance!", 
    "Pls Say Yes 🥺", 
    "Wrong Button!"
];
let rejectionIndex = 0;



// NO Button Logic - THE LOOP
btnNo.addEventListener('click', (e) => {
    e.stopPropagation();
    
    // 1. Change Text
    const text = rejectionTexts[rejectionIndex % rejectionTexts.length];
    btnNo.innerText = text;
    rejectionIndex++;



    // 2. Shake Button
    btnNo.classList.remove('shake-anim');
    void btnNo.offsetWidth; // Trigger reflow
    btnNo.classList.add('shake-anim');



    // 3. Show Bubble Tip
    bubbleText.innerText = "Click the other one! 👉";
    teaseBubble.classList.remove('hidden');
    
    // 4. Change Color slightly to indicate urgency
    btnNo.style.backgroundColor = "#ff" + Math.floor(Math.random()*99) + "b2";
    
    console.log(`⛔ Rejection Attempt #${rejectionIndex}: Blocked.`);
});



// YES Button Logic - SUCCESS
btnYes.addEventListener('click', () => {
    console.log("💖 Success! Sending Hug...");
    
    // 1. Hide the Main Window with animation
    mainWindow.style.transition = "transform 0.5s ease-in, opacity 0.5s ease-in";
    mainWindow.style.transform = "translate(-50%, -50%) scale(0.1) rotate(10deg)";
    mainWindow.style.opacity = "0";



    // 2. Show Overlay with your image
    setTimeout(() => {
        hugOverlay.classList.add('active');
        fireConfetti();
    }, 500);
});



// --- 4. Confetti Cannon ---
function fireConfetti() {
    const colors = ['#ff7eb3', '#7afcff', '#ffe66d', '#ffffff'];
    for(let i=0; i<150; i++) {
        const el = document.createElement('div');
        el.style.position = 'fixed';
        el.style.left = '50%';
        el.style.top = '50%';
        el.style.width = '8px'; 
        el.style.height = '8px';
        el.style.backgroundColor = colors[Math.floor(Math.random()*colors.length)];
        el.style.zIndex = 9999;
        document.body.appendChild(el);



        const angle = Math.random() * Math.PI * 2;
        const dist = 100 + Math.random() * 300;
        const size = Math.random() * 10 + 5;
        
        el.animate([
            { transform: 'translate(0,0) rotate(0deg)', opacity: 1 },
            { transform: `translate(${Math.cos(angle)*dist}px, ${Math.sin(angle)*dist}px) rotate(${Math.random()*360}deg)`, opacity: 0 }
        ], { duration: 1500, easing: 'cubic-bezier(0, .9, .57, 1)' }).onfinish = () => el.remove();
    }
}
