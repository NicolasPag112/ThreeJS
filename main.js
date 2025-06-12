// Configuração básica da cena, câmera e renderizador
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true }); // antialias para suavizar as bordas
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement); // Adiciona o canvas ao corpo do documento

camera.position.z = 5; // Posiciona a câmera para ver os objetos

// Adiciona uma luz ambiente para iluminar a cena uniformemente
const ambientLight = new THREE.AmbientLight(0x404040, 2); // Cor branca, intensidade 2
scene.add(ambientLight);

// Adiciona uma luz direcional para dar mais profundidade e sombras (opcional, mas recomendado)
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(0, 1, 1).normalize();
scene.add(directionalLight);

// Array para armazenar os botões (cubos ou esferas)
const buttons = [];

// --- Cria os 3 botões com animação de entrada (escala) ---
for (let i = 0; i < 3; i++) {
    // Escolha a geometria: BoxGeometry para cubos, SphereGeometry para esferas
    const geometry = new THREE.BoxGeometry(0.7, 0.7, 0.7); // Tamanho do cubo/esfera
    // const geometry = new THREE.SphereGeometry(0.4, 32, 32); // Exemplo de esfera

    const material = new THREE.MeshStandardMaterial({ color: 0x0077ff, roughness: 0.5, metalness: 0.8 }); // Material com cor e propriedades de luz
    const mesh = new THREE.Mesh(geometry, material);

    // Posiciona os botões horizontalmente no centro da tela
    mesh.position.x = (i - 1) * 1.5; // Espaçamento entre os botões
    mesh.position.y = 0; // Posição Y inicial (onde a flutuação será centrada)
    mesh.scale.set(0, 0, 0); // Começa com escala zero para a animação de entrada

    scene.add(mesh);
    buttons.push(mesh);

    // Animação de entrada (escala): cresce do zero para o tamanho normal
    new TWEEN.Tween(mesh.scale)
        .to({ x: 1, y: 1, z: 1 }, 1000) // Duração de 1 segundo
        .easing(TWEEN.Easing.Elastic.Out) // Efeito elástico para uma entrada mais dinâmica
        .delay(i * 200) // Pequeno atraso para cada botão aparecer sequencialmente
        .start();
}

// --- Aplica o efeito de flutuação contínua a cada botão ---
buttons.forEach((btn, index) => {
    const originalY = btn.position.y;
    const floatAmount = 0.2; // Quantidade de flutuação para cima e para baixo

    const up = { y: originalY + floatAmount };
    const down = { y: originalY - floatAmount };

    function floatUp() {
        new TWEEN.Tween(btn.position)
            .to(up, 1800 + index * 200) // Duração da flutuação, ligeiramente diferente para cada botão
            .easing(TWEEN.Easing.Sinusoidal.InOut) // Movimento suave de vai e vem
            .onComplete(floatDown) // Quando termina de subir, começa a descer
            .start();
    }

    function floatDown() {
        new TWEEN.Tween(btn.position)
            .to(down, 1800 + index * 200) // Duração da flutuação
            .easing(TWEEN.Easing.Sinusoidal.InOut)
            .onComplete(floatUp) // Quando termina de descer, começa a subir
            .start();
    }

    // Inicia o ciclo de flutuação para cada botão
    floatUp();
});

// --- Detecção de clique e interpolação de cor ---
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

window.addEventListener('click', (event) => {
    // Calcula as coordenadas do mouse normalizadas (-1 a +1)
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // Atualiza o raycaster com a câmera e as coordenadas do mouse
    raycaster.setFromCamera(mouse, camera);

    // Encontra objetos que intersectam o raio (clique)
    const intersects = raycaster.intersectObjects(buttons);

    if (intersects.length > 0) {
        // Se houver interseção, o primeiro objeto é o que foi clicado
        const clickedMesh = intersects[0].object;
        const originalColor = clickedMesh.material.color.clone(); // Clona a cor original antes de mudar

        // Interpolação para a nova cor (vermelho neste caso)
        new TWEEN.Tween(clickedMesh.material.color)
            .to({ r: 1, g: 0, b: 0 }, 300) // Muda para vermelho (r=1, g=0, b=0) em 300ms
            .easing(TWEEN.Easing.Quadratic.Out)
            .onComplete(() => {
                // Após a cor mudar, interpola de volta para a cor original
                new TWEEN.Tween(clickedMesh.material.color)
                    .to(originalColor, 500) // Volta para a cor original em 500ms
                    .easing(TWEEN.Easing.Quadratic.Out)
                    .start();
            })
            .start();
    }
});

// --- Loop de renderização (animate) ---
function animate(time) {
    requestAnimationFrame(animate); // Chama a função animate no próximo frame
    TWEEN.update(time); // Atualiza todas as animações TWEEN
    renderer.render(scene, camera); // Renderiza a cena
}

animate(); // Inicia o loop de animação

// Lida com o redimensionamento da janela para manter a responsividade
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
