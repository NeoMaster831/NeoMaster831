class SageLogo {
    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({
            canvas: document.querySelector('#sage-canvas'),
            alpha: true,
            antialias: false,
            powerPreference: "high-performance"
        });
        
        this.init();
    }

    init() {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        this.camera.position.z = 5;

        const geometry = new THREE.IcosahedronGeometry(1.5, 0);
        const edges = new THREE.EdgesGeometry(geometry);

        const lineGeom = new THREE.LineSegmentsGeometry().setPositions(edges.attributes.position.array);
        const lineMat = new THREE.LineMaterial({
            color: 0x68a678,
            linewidth: 2,
            transparent: true,
            opacity: 0.6,
            resolution: new THREE.Vector2(window.innerWidth, window.innerHeight)
        });

        this.mesh = new THREE.LineSegments2(lineGeom, lineMat);
        this.scene.add(this.mesh);

        this.previousWidth = window.innerWidth;
        this.previousHeight = window.innerHeight;

        window.addEventListener('resize', () => {
            if (Math.abs(this.previousWidth - window.innerWidth) > 50 || 
                Math.abs(this.previousHeight - window.innerHeight) > 50) {
                this.onWindowResize();
                this.previousWidth = window.innerWidth;
                this.previousHeight = window.innerHeight;
            }
        });

        this.lastTime = 0;
        this.animate();
    }

    animate(currentTime) {
        requestAnimationFrame((time) => this.animate(time));

        if (currentTime - this.lastTime >= 10) {
            this.mesh.rotation.x += 0.002;
            this.mesh.rotation.y += 0.003;
            this.renderer.render(this.scene, this.camera);
            this.lastTime = currentTime;
        }
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        
        if (this.mesh.material) {
            this.mesh.material.resolution.set(window.innerWidth, window.innerHeight);
        }
    }
}

let sageInstance = null;
if ('requestIdleCallback' in window) {
    window.requestIdleCallback(() => {
        if (!sageInstance) sageInstance = new SageLogo();
    });
} else {
    window.addEventListener('DOMContentLoaded', () => {
        if (!sageInstance) sageInstance = new SageLogo();
    });
}