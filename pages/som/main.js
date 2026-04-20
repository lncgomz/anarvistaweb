import { loadGLTF } from "../../libs/loader.js";

const capture = (mindarThree) => {
  const { video, renderer, scene, camera } = mindarThree;
  const renderCanvas = renderer.domElement;
  // output canvas
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  canvas.width = renderCanvas.width;
  canvas.height = renderCanvas.height;

  const sx = (video.clientWidth - renderCanvas.clientWidth) / 2 * video.videoWidth / video.clientWidth;
  const sy = (video.clientHeight - renderCanvas.clientHeight) / 2 * video.videoHeight / video.clientHeight;
  const sw = video.videoWidth - sx * 2;
  const sh = video.videoHeight - sy * 2;

  context.drawImage(video, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height);

  renderer.preserveDrawingBuffer = true;
  renderer.render(scene, camera); // empty if not run
  context.drawImage(renderCanvas, 0, 0, canvas.width, canvas.height);
  renderer.preserveDrawingBuffer = false;

  const data = canvas.toDataURL('image/png');

  const link = document.createElement('a');
  link.download = 'photo.png';
  link.href = data;
  link.click();
}

document.addEventListener('DOMContentLoaded', () => {
  const loadingOverlay = document.querySelector('#loading-overlay');
  const arContainer = document.querySelector('#ar-container');
  const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    || window.innerWidth <= 900;
  const modelPath = isMobileDevice
    ? '../../assets/models/sxoxm/sxoxm.gltf'
    : '../../assets/models/sxoxm/sxoxm.gltf';

  const isVisible = (element) => {
    if (!element) return false;
    const styles = window.getComputedStyle(element);
    return !element.classList.contains('hidden') && styles.display !== 'none' && styles.visibility !== 'hidden' && styles.opacity !== '0';
  };

  const waitForMindAR = (timeout = 15000) => new Promise((resolve, reject) => {
    const startTime = Date.now();

    const check = () => {
      const threeInstance = window.MINDAR?.IMAGE?.THREE;
      if (threeInstance) {
        resolve(threeInstance);
        return;
      }

      if (Date.now() - startTime > timeout) {
        reject(new Error('MindAR library did not finish loading in time.'));
        return;
      }

      window.requestAnimationFrame(check);
    };

    check();
  });

  const hideLoaderWhenScanningReady = (onReady) => {
    let readyTriggered = false;

    const finish = () => {
      if (readyTriggered) return true;
      readyTriggered = true;
      loadingOverlay?.classList.add('hidden');
      onReady?.();
      return true;
    };

    const checkOverlay = () => {
      const scanningOverlay = document.querySelector('.mindar-ui-overlay.mindar-ui-scanning');
      const video = arContainer?.querySelector('video');
      const videoReady = !!video && video.readyState >= 2 && video.videoWidth > 0;

      if (videoReady) {
        video.setAttribute('playsinline', '');
        video.style.zIndex = '1';
        video.style.objectFit = 'cover';
        video.style.background = 'transparent';
        video.play?.().catch(() => {});
      }

      if (isVisible(scanningOverlay) || videoReady) {
        return finish();
      }

      return false;
    };

    if (checkOverlay()) return;

    const observer = new MutationObserver(() => {
      if (checkOverlay()) {
        observer.disconnect();
      }
    });

    observer.observe(arContainer || document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class', 'style'],
    });

    window.setTimeout(() => {
      if (!readyTriggered) {
        finish();
        observer.disconnect();
      }
    }, isMobileDevice ? 3000 : 1800);
  };

  const start = async () => {
    const THREE = await waitForMindAR();

    const mindarThree = new window.MINDAR.IMAGE.MindARThree({
      container: arContainer,
      imageTargetSrc: '../../assets/targets/sxoxm.mind',
      maxTrack: 1,
    });
    const { renderer, scene, camera } = mindarThree;

    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isMobileDevice ? 1.2 : 2));
    renderer.domElement.style.background = 'transparent';
    renderer.domElement.style.zIndex = '2';

    // Keep GLTF colors closer to authored values.
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1;

    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x222233, 0.9);
    const keyLight = new THREE.DirectionalLight(0xffffff, 0.85);
    keyLight.position.set(0.5, 1, 0.7);
    const fillLight = new THREE.DirectionalLight(0xffffff, 0.35);
    fillLight.position.set(-0.7, 0.5, -0.4);
    scene.add(hemiLight, keyLight, fillLight);

    const anchor = mindarThree.addAnchor(0);
    const clock = new THREE.Clock();
    let gltf = null;
    let mixer = null;

    document.querySelector("#capture").addEventListener("click", () => {
      capture(mindarThree);
    });

    await mindarThree.start();

    const loadModel = () => {
      if (gltf) return;

      loadGLTF(modelPath).then((loadedGltf) => {
        gltf = loadedGltf;
        gltf.scene.scale.set(0.5, 0.5, 0.5);
        gltf.scene.position.set(0, 0, 0);

        gltf.scene.traverse((obj) => {
          if (!obj.isMesh || !obj.material) return;
          const materials = Array.isArray(obj.material) ? obj.material : [obj.material];
          materials.forEach((mat) => {
            if (mat.map) mat.map.encoding = THREE.sRGBEncoding;
            if (mat.isMeshStandardMaterial && !mat.envMap) {
              mat.metalness = Math.min(mat.metalness ?? 0, 0.2);
              mat.roughness = Math.max(mat.roughness ?? 1, 0.6);
            }
            mat.needsUpdate = true;
          });
        });

        anchor.group.add(gltf.scene);

        if (gltf.animations?.length) {
          mixer = new THREE.AnimationMixer(gltf.scene);
          const action = mixer.clipAction(gltf.animations[0]);
          action.play();
        }
      }).catch((error) => {
        console.error('Failed to load model:', error);
      });
    };

    hideLoaderWhenScanningReady(() => {
      loadModel();
    });

    renderer.setAnimationLoop(() => {
      const delta = clock.getDelta();

      if (gltf) {
        gltf.scene.rotation.y += delta;
        mixer?.update(delta);
      }

      renderer.render(scene, camera);
    });
  }

  start().catch((error) => {
    console.error(error);
  });
});