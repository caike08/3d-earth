(function () {
  var background, earth, moon, clouds;
  const radius = 0.5,
  segments = 50,
  rotation = 6;
  const width = window.innerWidth,
  height = window.innerHeight;
  var scene, camera, renderer, controls;
  var r = 2;
  var theta = 0;
  var dTheta = 2 * Math.PI / 1000;

  var webglEl = document.getElementById('webgl');

	if (!Detector.webgl) {
		Detector.addGetWebGLMessage(webglEl);
		return;
	}

  setScene();
  setCamera();
  renderScenario();

  function setScene() {
    scene = new THREE.Scene();
  };

  function setCamera() {
    camera = new THREE.PerspectiveCamera(45, width / height, 0.01, 1000);
    camera.position.z = 4;
  };

  function renderScenario() {
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(width, height);

    setLights();

    clouds = createClouds(radius, segments);
    clouds.rotation.y = rotation;
    scene.add(clouds);

    earth = createEarth(radius, segments);
    earth.rotation.y = rotation;
    scene.add(earth);

    background = createStars(90, 64);
    scene.add(background);

    moon = createMoon(0.1, 32, 32);
    moon.rotation.y = rotation;
    scene.add(moon);


    document.body.appendChild(renderer.domElement);

    controls = new THREE.TrackballControls(camera);

    render();
  };

  function setLights() {
    scene.add(new THREE.AmbientLight(0x888888));

    var light = new THREE.DirectionalLight( 0xfdfcf0, 1 )
    light.position.set(20,10,20)
    scene.add(light);
  };

  function createEarth(radius, segments) {
    return new THREE.Mesh(
      new THREE.SphereGeometry(radius, segments, segments),
      new THREE.MeshPhongMaterial({
        map: new THREE.TextureLoader().load("img/earthmap1k.jpg"),
        bumpMap: new THREE.TextureLoader().load("img/earthbump1k.jpg"),
        bumpScale: 0.008,
        specularMap: new THREE.TextureLoader().load("img/earthspec1k.png"),
        specular: new THREE.Color('grey'),
        needsUpdate: true
      })
    );
  };

  function createClouds(radius, segments) {
    return new THREE.Mesh(
      new THREE.SphereGeometry(radius + 0.009, segments, segments),
      new THREE.MeshPhongMaterial({
        map: new THREE.TextureLoader().load("img/earthcloudmaptrans.jpg"),
        transparent: true,
        opacity: 0.5,
        needsUpdate: true
      })
    );
  };

  function createStars(radius, segments) {
    return new THREE.Mesh(
      new THREE.SphereGeometry(radius, segments, segments),
      new THREE.MeshBasicMaterial({
        map: new THREE.TextureLoader().load("/img/stars.jpg"),
        side: THREE.BackSide
      })
    );
  };

  function createMoon(radius, segmentA, segmentB) {
    return new THREE.Mesh(
      new THREE.SphereGeometry(radius, segmentA, segmentB),
      new THREE.MeshPhongMaterial({
        map: new THREE.TextureLoader().load("img/moonmap1k.jpg"),
        bumpMap: new THREE.TextureLoader().load("img/moonbump1k.jpg"),
        bumpScale: 0.005,
        needsUpdate: true
      })
    );
  };

  function render() {
    controls.update();

    earth.rotation.y += 0.0005;
    clouds.rotation.y += 0.00025;
    moon.rotation.y += 0.0005;

    theta += dTheta;
    moon.position.x = r * Math.cos(theta);
    moon.position.z = r * Math.sin(theta);

    requestAnimationFrame(render);

    renderer.render(scene, camera);
  }

}());