import * as THREE from 'three';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0f172a); 
scene.fog = new THREE.FogExp2(0x0f172a, 0.04);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

const lightAmbient = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(lightAmbient);

const lightDirect = new THREE.DirectionalLight(0xf2cd37, 1.2); 
lightDirect.position.set(5, 15, 7);
lightDirect.castShadow = true;
scene.add(lightDirect);

const grid3D = new THREE.GridHelper(400, 80, 0xf2cd37, 0x334155);
grid3D.position.y = -1.6; 
scene.add(grid3D);

const laysBagGroup = new THREE.Group();
const bagGeometry = new THREE.BoxGeometry(0.24, 0.36, 0.06);
const bagMaterial = new THREE.MeshStandardMaterial({ color: 0xc91a09, roughness: 0.2, metalness: 0.1 });
const bagMesh = new THREE.Mesh(bagGeometry, bagMaterial);
bagMesh.castShadow = true;
laysBagGroup.add(bagMesh);

const logoGeometry = new THREE.CylinderGeometry(0.07, 0.07, 0.01, 32);
const logoMaterial = new THREE.MeshStandardMaterial({ color: 0xf2cd37, roughness: 0.4 });
const logoMesh = new THREE.Mesh(logoGeometry, logoMaterial);
logoMesh.rotation.x = Math.PI / 2;
logoMesh.position.set(0, 0, 0.031); 
laysBagGroup.add(logoMesh);
scene.add(laysBagGroup);

const handGroup = new THREE.Group();
const handGeo = new THREE.BoxGeometry(0.08, 0.15, 0.08);
const handMat = new THREE.MeshStandardMaterial({ color: 0xffdbac, roughness: 0.8 }); 
const handMesh = new THREE.Mesh(handGeo, handMat);
handGroup.add(handMesh);

const heldChipGeo = new THREE.CylinderGeometry(0.025, 0.025, 0.005, 8);
const heldChipMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.6 });
const heldChipMesh = new THREE.Mesh(heldChipGeo, heldChipMat);
heldChipMesh.position.set(0, 0.08, 0); 
handGroup.add(heldChipMesh);
scene.add(handGroup);

let isEatingAnimation = false;
let animationProgress = 0; 

const crunchSound = new Audio('/crunching.mp3');

interface ChipParticle {
    mesh: THREE.Mesh;
    velocity: THREE.Vector3;
    rotationSpeed: THREE.Vector3;
    life: number;
}
const activeChips: ChipParticle[] = [];

function spawnChipParticle() {
    const chipGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.005, 8);
    const chipMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.6 });
    const chipMesh = new THREE.Mesh(chipGeo, chipMat);

    chipMesh.position.copy(laysBagGroup.position);
    chipMesh.position.y += 0.1;

    const direction = new THREE.Vector3(0, 0.5, -1).applyQuaternion(camera.quaternion).normalize();
    const speed = 3.0 + Math.random() * 2.0;
    
    const velocity = direction.multiplyScalar(speed);
    velocity.x += (Math.random() - 0.5) * 0.5;
    velocity.y += (Math.random() - 0.5) * 0.5;

    const rotationSpeed = new THREE.Vector3(
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10
    );

    scene.add(chipMesh);
    activeChips.push({ mesh: chipMesh, velocity, rotationSpeed, life: 1.0 });
}

let cameraPosition = new THREE.Vector3(0, 0, 4);
let rotationYaw = 0;
let rotationPitch = 0;
const activeKeys: { [key: string]: boolean } = { w: false, a: false, s: false, d: false };

let isPointerLocked = false;
document.body.addEventListener('click', () => {
    if (!isPointerLocked) document.body.requestPointerLock();
});

document.addEventListener('mousemove', (event) => {
    if (document.pointerLockElement !== document.body) return;
    isPointerLocked = true;

    rotationYaw -= event.movementX * 0.0025;
    rotationPitch -= event.movementY * 0.0025;
    rotationPitch = Math.max(-Math.PI / 2.1, Math.min(Math.PI / 2.1, rotationPitch)); 
});

document.addEventListener('pointerlockchange', () => {
    isPointerLocked = (document.pointerLockElement === document.body);
});

window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        document.exitPointerLock();
        isPointerLocked = false;
    }
    if (e.key.toLowerCase() in activeKeys) activeKeys[e.key.toLowerCase()] = true; 
});
window.addEventListener('keyup', (e) => { if (e.key.toLowerCase() in activeKeys) activeKeys[e.key.toLowerCase()] = false; });

let totalChipsCrunchCount = 0;
const counterUiElement = document.getElementById("counter");

window.addEventListener('mousedown', () => {
    if (!isPointerLocked || isEatingAnimation) return; 
    
    isEatingAnimation = true;
    animationProgress = 0;

    laysBagGroup.position.z += 0.06;
    setTimeout(() => { laysBagGroup.position.z -= 0.06; }, 60);
});

const processClock = new THREE.Clock();

function engineUpdateLoop() {
    requestAnimationFrame(engineUpdateLoop);
    const timeDelta = processClock.getDelta();

    for (let i = activeChips.length - 1; i >= 0; i--) {
        const chip = activeChips[i];
        chip.mesh.position.addScaledVector(chip.velocity, timeDelta);
        chip.mesh.rotation.x += chip.rotationSpeed.x * timeDelta;
        chip.mesh.rotation.y += chip.rotationSpeed.y * timeDelta;
        chip.velocity.y -= 9.8 * timeDelta; 
        chip.life -= timeDelta * 0.8;
        
        if (chip.life <= 0 || chip.mesh.position.y < -1.6) {
            scene.remove(chip.mesh);
            activeChips.splice(i, 1);
        }
    }

    const cameraEulerAngle = new THREE.Euler(rotationPitch, rotationYaw, 0, 'YXZ');
    camera.quaternion.setFromEuler(cameraEulerAngle);
    camera.position.copy(cameraPosition);

    const forwardDirectionVector = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion);
    forwardDirectionVector.y = 0; forwardDirectionVector.normalize();
    const rightDirectionVector = new THREE.Vector3(1, 0, 0).applyQuaternion(camera.quaternion);
    rightDirectionVector.y = 0; rightDirectionVector.normalize();

    const currentMoveSpeed = 4.5 * timeDelta;
    if (activeKeys.w) cameraPosition.addScaledVector(forwardDirectionVector, currentMoveSpeed);
    if (activeKeys.s) cameraPosition.addScaledVector(forwardDirectionVector, -currentMoveSpeed);
    if (activeKeys.d) cameraPosition.addScaledVector(rightDirectionVector, currentMoveSpeed);
    if (activeKeys.a) cameraPosition.addScaledVector(rightDirectionVector, -currentMoveSpeed);

    const offsetVectorViewmodel = new THREE.Vector3(0.2, -0.25, -0.45).applyQuaternion(camera.quaternion);
    laysBagGroup.position.copy(camera.position).add(offsetVectorViewmodel);
    laysBagGroup.quaternion.copy(camera.quaternion);

    if (isEatingAnimation) {
        animationProgress += timeDelta * 2.5; 

        let handOffset = new THREE.Vector3();

        if (animationProgress < 0.4) {
            const t = animationProgress / 0.4;
            handOffset.set(0.2, -0.6 + (0.35 * t), -0.45);
        } else if (animationProgress < 0.8) {
            const t = (animationProgress - 0.4) / 0.4;
            handOffset.set(0.2 - (0.2 * t), -0.25 + (0.25 * t), -0.45 + (0.25 * t));
        } else if (animationProgress >= 1.0) {
            isEatingAnimation = false;
            
            totalChipsCrunchCount++;
            if (counterUiElement) counterUiElement.innerText = totalChipsCrunchCount.toString();
            
            crunchSound.currentTime = 0;
            crunchSound.play().catch(() => {});
            
            spawnChipParticle();
        }

        if (isEatingAnimation) {
            handGroup.position.copy(camera.position).add(handOffset.applyQuaternion(camera.quaternion));
            handGroup.quaternion.copy(camera.quaternion);
            handGroup.visible = true;
        }
    } else {
        handGroup.visible = false;
    }

    renderer.render(scene, camera);
}

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

engineUpdateLoop();
