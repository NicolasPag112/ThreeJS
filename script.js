// Inicializando a cena, a câmera e o renderizador
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Plano de fundo gradiente
const canvas = document.createElement('canvas');
canvas.width = 32;
canvas.height = 32;
const context = canvas.getContext('2d');
const gradient = context.createLinearGradient(0, 0, 0, 32);
gradient.addColorStop(0, '#1a2a6c');
gradient.addColorStop(0.5, '#b21f1f');
gradient.addColorStop(1, '#fdbb2d');
context.fillStyle = gradient;
context.fillRect(0, 0, 32, 32);

const backgroundTexture = new THREE.CanvasTexture(canvas);
scene.background = backgroundTexture;

// Partículas para efeito de estrelas
const particlesGeometry = new THREE.BufferGeometry();
const particleCount = 1000;

const posArray = new Float32Array(particleCount * 3);
for(let i = 0; i < particleCount * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * 50;
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

const particlesMaterial = new THREE.PointsMaterial({
    size: 0.1,
    color: 0xffffff,
    transparent: true,
    opacity: 0.8
});

const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particlesMesh);

// Configuração da posição inicial da câmera
camera.position.set(0, 0, 5);


// Cubo
const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
const cubeMaterial = new THREE.MeshBasicMaterial({color: 0x00ff00});
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
cube.position.x = -2;
scene.add(cube);

// Esfera
const sphereGeometry = new THREE.SphereGeometry(0.7, 32, 32);
const sphereMaterial = new THREE.MeshBasicMaterial({color: 0xff00ff});
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
sphere.position.x = 0;
scene.add(sphere);

// Cone
const coneGeometry = new THREE.ConeGeometry(0.7, 1.4, 32);
const coneMaterial = new THREE.MeshBasicMaterial({color: 0x0000ff});
const cone = new THREE.Mesh(coneGeometry, coneMaterial);
cone.position.x = 2;
scene.add(cone);

// OrbitControls
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

// Função de animação
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    
    // Rotação sutil das partículas (estrelas)
    particlesMesh.rotation.y += 0.0005;
    
    renderer.render(scene, camera);
}

// Tratamento de redimensionamento
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

animate();