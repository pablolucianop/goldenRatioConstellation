if (WEBGL.isWebGLAvailable() === false) {
  document.body.appendChild(WEBGL.getWebGLErrorMessage())
}

var container, stats, clock
var camera, scene, renderer, star, positionX, positionY, angle, radious
positionX = 0
positionY = 0
positionZ = 2
angle = 4
radious = 1.9

init()
animate()

function twistXy(hypo, angle) {
  // var opo = (Math.sin(angle * (Math.PI / 180))) * hypo
  // var adja = (Math.cos(angle * (Math.PI / 180))) * hypo
  var opo = Math.sin(angle) * hypo
  var adja = Math.cos(angle) * hypo
  var xY = [opo, adja]
  return xY
}

function init() {
  container = document.getElementById("container")
  camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    2000
  )

  camera.position.set(
    0.4230411162467691,
    0.6643687214518752,
    -3.9961529578031163
  )

  camera.lookAt(0, 3, 0)
  var controls = new THREE.OrbitControls(camera)
  scene = new THREE.Scene()
  clock = new THREE.Clock()

  //adding stars
  // loading manager
  var loadingManager = new THREE.LoadingManager()

  // collada
  var loader = new THREE.ColladaLoader(loadingManager)
  loader.load("src/collada/star.dae", function (collada) {
    star = collada.scene
    scene.add(star)
  })
  function createStars() {
    loader.load("src/collada/star.dae", function (collada) {
      star = collada.scene
      scene.add(star)
      star.position.x = twistXy(radious, angle)[0]
      star.position.y = twistXy(radious, angle)[1]
      star.angle = angle
      star.radious = radious
      angle = angle + 1.61803398875
      radious = radious + 0.02
      star.position.z = positionZ
      positionZ = Math.cos(radious / 2) * 3
    })
  }

  for (i = 0; i < 497; i++) {
    createStars()
  }
  loader.load("src/collada/ml3.dae", function (collada) {
    handTable = collada.scene
    scene.add(handTable)
    handTable.rotation.y = 4
    handTable.position.z = 1
    handTable.position.y = -1.1
  })

  var ambientLight = new THREE.AmbientLight(0xcccccc, 0.7)
  scene.add(ambientLight)

  var directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
  directionalLight.position.set(1, 1, 0).normalize()
  scene.add(directionalLight)

  renderer = new THREE.WebGLRenderer()
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setClearColor(0xf2ebc2, 1)
  container.appendChild(renderer.domElement)

  stats = new Stats()
  container.appendChild(stats.dom)

  window.addEventListener("resize", onWindowResize, false)
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
}

function animate() {
  requestAnimationFrame(animate)
  render()
  stats.update()
}

function render() {
  var delta = clock.getDelta()
  if (star !== undefined) {
  }
  if (angle < 1000) {
    camera.position.z = camera.position.z - 0.01
  } else if (angle > 1000 && angle < 1500) {
    camera.position.z = camera.position.z - 0.1
  }

  setInterval(function () {
    angle = angle + 0.1
  }, 300)

  for (let index = 2; index < 500; index++) {
    radious = radious - 0.0001
    if (scene.children[index] !== undefined) {
      scene.children[index].position.x = twistXy(
        scene.children[index].radious + radious / 333333,
        (scene.children[index].angle + radious) / 5
      )[0]
      scene.children[index].position.y = twistXy(
        scene.children[index].radious + radious / 3333,
        (scene.children[index].angle + radious) / 5
      )[1]
    }
  }
  renderer.render(scene, camera)
}
