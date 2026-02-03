// ==========================================
// THREE.JS 3D BACKGROUND SCENE
// ==========================================

let scene, camera, renderer, hearts3D = [];

function init3DScene() {
    const canvas = document.getElementById('canvas3d');
    scene = new THREE.Scene();
    
    camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    camera.position.z = 30;
    
    renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true,
        antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    
    // Create 3D Hearts
    createFloating3DHearts();
    
    // Add ambient lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);
    
    // Add point light
    const pointLight = new THREE.PointLight(0xff4f81, 2, 100);
    pointLight.position.set(0, 10, 10);
    scene.add(pointLight);
    
    // Animation loop
    animate3D();
}

function createFloating3DHearts() {
    const heartShape = new THREE.Shape();
    
    // Create heart shape path
    heartShape.moveTo(0, 0);
    heartShape.bezierCurveTo(0, -0.3, -0.6, -0.3, -0.6, 0);
    heartShape.bezierCurveTo(-0.6, 0.3, 0, 0.6, 0, 1);
    heartShape.bezierCurveTo(0, 0.6, 0.6, 0.3, 0.6, 0);
    heartShape.bezierCurveTo(0.6, -0.3, 0, -0.3, 0, 0);
    
    const extrudeSettings = {
        depth: 0.3,
        bevelEnabled: true,
        bevelThickness: 0.1,
        bevelSize: 0.1,
        bevelSegments: 3
    };
    
    const geometry = new THREE.ExtrudeGeometry(heartShape, extrudeSettings);
    
    // Create multiple hearts
    for (let i = 0; i < 25; i++) {
        const material = new THREE.MeshPhongMaterial({
            color: i % 2 === 0 ? 0xff4f81 : 0xff8fb1,
            shininess: 100,
            transparent: true,
            opacity: 0.7
        });
        
        const heart = new THREE.Mesh(geometry, material);
        
        // Random position
        heart.position.x = (Math.random() - 0.5) * 60;
        heart.position.y = (Math.random() - 0.5) * 60;
        heart.position.z = (Math.random() - 0.5) * 60;
        
        // Random rotation
        heart.rotation.x = Math.random() * Math.PI;
        heart.rotation.y = Math.random() * Math.PI;
        heart.rotation.z = Math.random() * Math.PI;
        
        // Random scale
        const scale = Math.random() * 1.5 + 0.5;
        heart.scale.set(scale, scale, scale);
        
        // Store animation data
        heart.userData = {
            rotationSpeed: {
                x: (Math.random() - 0.5) * 0.02,
                y: (Math.random() - 0.5) * 0.02,
                z: (Math.random() - 0.5) * 0.02
            },
            floatSpeed: Math.random() * 0.02 + 0.01,
            floatRange: Math.random() * 3 + 2,
            initialY: heart.position.y
        };
        
        hearts3D.push(heart);
        scene.add(heart);
    }
}

function animate3D() {
    requestAnimationFrame(animate3D);
    
    // Animate each heart
    hearts3D.forEach(heart => {
        // Rotate
        heart.rotation.x += heart.userData.rotationSpeed.x;
        heart.rotation.y += heart.userData.rotationSpeed.y;
        heart.rotation.z += heart.userData.rotationSpeed.z;
        
        // Float up and down
        heart.position.y = heart.userData.initialY + 
            Math.sin(Date.now() * heart.userData.floatSpeed * 0.001) * heart.userData.floatRange;
    });
    
    // Slowly rotate camera
    camera.position.x = Math.sin(Date.now() * 0.0001) * 5;
    camera.position.y = Math.cos(Date.now() * 0.00015) * 3;
    camera.lookAt(scene.position);
    
    renderer.render(scene, camera);
}

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// ==========================================
// 2D FLOATING HEARTS
// ==========================================

function createFloatingHeart() {
    const heart = document.createElement('div');
    heart.className = 'heart';
    heart.innerHTML = ['💗', '💖', '💕', '💓', '❤️'][Math.floor(Math.random() * 5)];
    heart.style.left = Math.random() * 100 + 'vw';
    heart.style.animationDuration = (Math.random() * 3 + 5) + 's';
    heart.style.fontSize = (Math.random() * 15 + 15) + 'px';
    
    const heartsContainer = document.getElementById('hearts-container');
    heartsContainer.appendChild(heart);
    
    setTimeout(() => heart.remove(), 8000);
}

// Create hearts periodically
setInterval(createFloatingHeart, 300);

// ==========================================
// SCROLL ANIMATIONS
// ==========================================

const fadeElements = document.querySelectorAll('.fade');

function checkScroll() {
    fadeElements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementBottom = element.getBoundingClientRect().bottom;
        
        if (elementTop < window.innerHeight - 100 && elementBottom > 0) {
            element.classList.add('show');
        }
    });
}

window.addEventListener('scroll', checkScroll);
window.addEventListener('load', checkScroll);

// ==========================================
// BUTTON INTERACTIONS
// ==========================================

const yesBtn = document.getElementById('yes');
const noBtn = document.getElementById('no');
const card = document.getElementById('valentine-card');

// "No" button dodge effect
let dodgeCount = 0;

noBtn.addEventListener('mouseover', () => {
    dodgeCount++;
    const maxMovement = Math.min(dodgeCount * 20, 200);
    
    const randomX = (Math.random() - 0.5) * maxMovement;
    const randomY = (Math.random() - 0.5) * maxMovement;
    
    noBtn.style.transform = `translate(${randomX}px, ${randomY}px)`;
    
    // Make "Yes" button bigger each time
    const newScale = 1 + (dodgeCount * 0.1);
    yesBtn.style.transform = `scale(${newScale})`;
    
    // Add shake to card
    card.style.animation = 'shake 0.5s';
    setTimeout(() => {
        card.style.animation = '';
    }, 500);
});

// Shake animation
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
        20%, 40%, 60%, 80% { transform: translateX(5px); }
    }
`;
document.head.appendChild(style);

// "Yes" button success
yesBtn.addEventListener('click', () => {
    // Create heart explosion
    createHeartExplosion();
    
    // Change card content
    setTimeout(() => {
        card.innerHTML = `
            <div class="success-message">
                <h2>You just made me really happy 💖</h2>
                <p>I promise effort, honesty, and choosing you every day.</p>
                <p style="margin-top: 20px; font-size: 18px; opacity: 0.8;">
                    Here's to all our moments together... ✨
                </p>
            </div>
        `;
        
        // Add confetti effect
        createConfetti();
    }, 500);
});

// ==========================================
// HEART EXPLOSION EFFECT
// ==========================================

function createHeartExplosion() {
    const heartsContainer = document.getElementById('hearts-container');
    const cardRect = card.getBoundingClientRect();
    const centerX = cardRect.left + cardRect.width / 2;
    const centerY = cardRect.top + cardRect.height / 2;
    
    for (let i = 0; i < 50; i++) {
        const heart = document.createElement('div');
        heart.innerHTML = '💗';
        heart.style.position = 'fixed';
        heart.style.left = centerX + 'px';
        heart.style.top = centerY + 'px';
        heart.style.fontSize = (Math.random() * 20 + 15) + 'px';
        heart.style.pointerEvents = 'none';
        heart.style.zIndex = '10000';
        
        const angle = (Math.PI * 2 * i) / 50;
        const velocity = Math.random() * 300 + 200;
        const tx = Math.cos(angle) * velocity;
        const ty = Math.sin(angle) * velocity;
        
        heart.style.transition = 'all 2s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        heartsContainer.appendChild(heart);
        
        setTimeout(() => {
            heart.style.transform = `translate(${tx}px, ${ty}px) rotate(${Math.random() * 720}deg) scale(0)`;
            heart.style.opacity = '0';
        }, 10);
        
        setTimeout(() => heart.remove(), 2000);
    }
}

// ==========================================
// CONFETTI EFFECT
// ==========================================

function createConfetti() {
    const colors = ['#ff4f81', '#ff8fb1', '#ffc0cb', '#ffb6c1', '#ff69b4'];
    
    for (let i = 0; i < 100; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.style.position = 'fixed';
            confetti.style.left = Math.random() * 100 + 'vw';
            confetti.style.top = '-10px';
            confetti.style.width = (Math.random() * 10 + 5) + 'px';
            confetti.style.height = (Math.random() * 10 + 5) + 'px';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
            confetti.style.pointerEvents = 'none';
            confetti.style.zIndex = '10000';
            confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
            
            document.body.appendChild(confetti);
            
            const duration = Math.random() * 3 + 2;
            const tx = (Math.random() - 0.5) * 200;
            
            confetti.animate([
                { transform: `translate(0, 0) rotate(0deg)`, opacity: 1 },
                { transform: `translate(${tx}px, 100vh) rotate(${Math.random() * 720}deg)`, opacity: 0 }
            ], {
                duration: duration * 1000,
                easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
            });
            
            setTimeout(() => confetti.remove(), duration * 1000);
        }, i * 20);
    }
}

// ==========================================
// PHOTO GALLERY 3D TILT EFFECT
// ==========================================

const photoCards = document.querySelectorAll('.photo-card');

photoCards.forEach(card => {
    const photoFrame = card.querySelector('.photo-frame');
    
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;
        
        photoFrame.style.transform = `
            translateY(-15px) 
            scale(1.05) 
            rotateX(${rotateX}deg) 
            rotateY(${rotateY}deg)
        `;
    });
    
    card.addEventListener('mouseleave', () => {
        photoFrame.style.transform = 'translateY(0) scale(1) rotateX(0) rotateY(0)';
    });
});

// ==========================================
// MOUSE PARALLAX EFFECT
// ==========================================

document.addEventListener('mousemove', (e) => {
    const mouseX = e.clientX / window.innerWidth - 0.5;
    const mouseY = e.clientY / window.innerHeight - 0.5;
    
    // Move 3D hearts based on mouse
    hearts3D.forEach((heart, index) => {
        const factor = (index % 5 + 1) * 0.5;
        heart.position.x += mouseX * factor * 0.1;
        heart.position.y -= mouseY * factor * 0.1;
    });
    
    // Parallax for card
    if (card) {
        const moveX = mouseX * 20;
        const moveY = mouseY * 20;
        card.style.transform = `perspective(1000px) rotateY(${moveX * 0.5}deg) rotateX(${-moveY * 0.5}deg)`;
    }
});

// ==========================================
// CURSOR TRAIL EFFECT
// ==========================================

const cursorTrail = [];
const trailLength = 20;

document.addEventListener('mousemove', (e) => {
    const trail = document.createElement('div');
    trail.style.position = 'fixed';
    trail.style.left = e.clientX + 'px';
    trail.style.top = e.clientY + 'px';
    trail.style.width = '8px';
    trail.style.height = '8px';
    trail.style.borderRadius = '50%';
    trail.style.background = 'radial-gradient(circle, rgba(255,79,129,0.6), transparent)';
    trail.style.pointerEvents = 'none';
    trail.style.zIndex = '9998';
    trail.style.transform = 'translate(-50%, -50%)';
    
    document.body.appendChild(trail);
    cursorTrail.push(trail);
    
    if (cursorTrail.length > trailLength) {
        const oldTrail = cursorTrail.shift();
        oldTrail.remove();
    }
    
    setTimeout(() => {
        trail.style.transition = 'all 0.5s ease';
        trail.style.opacity = '0';
        trail.style.transform = 'translate(-50%, -50%) scale(2)';
    }, 10);
    
    setTimeout(() => trail.remove(), 500);
});

// ==========================================
// INITIALIZE EVERYTHING
// ==========================================

// Start 3D scene when page loads
window.addEventListener('load', () => {
    init3DScene();
    checkScroll();
    
    // Initial heart burst
    setTimeout(() => {
        for (let i = 0; i < 10; i++) {
            setTimeout(createFloatingHeart, i * 100);
        }
    }, 500);
});

// Add some sparkle to text on hover
document.querySelectorAll('h1, h2, h3').forEach(heading => {
    heading.addEventListener('mouseenter', function() {
        this.style.textShadow = '0 0 20px rgba(255, 79, 129, 0.8), 0 0 40px rgba(255, 79, 129, 0.6)';
    });
    
    heading.addEventListener('mouseleave', function() {
        this.style.textShadow = '';
    });
});