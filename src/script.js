import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { ARButton } from 'three/examples/jsm/webxr/ARButton.js'
import floorVertexShader from './Shader/floorShader/vertex.glsl'
import floorFragmentShader from './Shader/floorShader/fragment.glsl'
import { Scene } from 'three'



/**
 * Base
 */
// Debug
const gui = new dat.GUI()
const debugobject = {}

// Canvas
const canvas = document.querySelector('canvas.webgl')

//domeelement
const container = document.createElement('div')
document.body.appendChild(container)

// Scene
const scene = new THREE.Scene()

// udate material
debugobject.envMapIntensity = 4

const updateAllMaterial = () =>
{
    scene.traverse((child) =>{
        if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial)
        {
            //child.material.envMap = environmentMapTexture
            child.material.envMapIntensity = debugobject.envMapIntensity
            child.material.needsUpdate = true
            child.castShadow = true
            child.receiveShadow = true
        }

    })
}

/**
 * Textures Floor
 */
 const textureLoader = new THREE.TextureLoader()
 const floorTexture = textureLoader.load('/textures/floortexture.jpg')
 

/**
 * texture loader 
*/
 const cubeTextureLoader = new THREE.CubeTextureLoader()

 const environmentMapTexture = cubeTextureLoader.load([
    '/environmentMaps/1/px.jpg',
    '/environmentMaps/1/nx.jpg',
    '/environmentMaps/1/py.jpg',
    '/environmentMaps/1/ny.jpg',
    '/environmentMaps/1/pz.jpg',
    '/environmentMaps/1/nz.jpg' 
])

environmentMapTexture.encoding = THREE.sRGBEncoding
//scene.background =environmentMapTexture
scene.environment = environmentMapTexture

gui
 .add(debugobject,'envMapIntensity',0,10,0.1)
 .name('modellight')
 .onChange(updateAllMaterial)

/**
 * Models
*/
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('/draco/')

const gltfLoader = new GLTFLoader()
gltfLoader.setDRACOLoader(dracoLoader)

/**
 * sneaker
 */
const sneaker = new THREE.Group()
scene.add(sneaker)


let mixer = null

gltfLoader.load(
    '/models/sneaker/testSneaker.glb',
    (gltf) =>
    {
        console.log(gltf)
        //gltf.scene.scale.set(0.025, 0.025, 0.025)
        sneaker.add(gltf.scene)
        updateAllMaterial()
        /**
        const children = [... gltf.scene.children] // duplicating array
        for(const child of gltf.scene.children)
        {
            child.scale.set(0.02,0.02,0.02)
            scene.add(child)
        }
        */

        // Animation
        mixer = new THREE.AnimationMixer(gltf.scene)
        const action = mixer.clipAction(gltf.animations[0])
        action.play()

    }
)

// Floor
const floorGeometry = new THREE.PlaneBufferGeometry(10, 10, 10, 10)
const count = floorGeometry.attributes.position.count
const randoms = new Float32Array(count)

for(let i =0 ;i< count; i++)
{
    randoms[i] = Math.random()
}
floorGeometry.setAttribute('aRandom',new THREE.BufferAttribute(randoms, 1))
//console.log(geometry)

//shader Material
const floorMaterial = new THREE.ShaderMaterial({
    vertexShader:floorVertexShader,
    fragmentShader:floorFragmentShader,
    //wireframe:true,
    uniforms:
    {
        ufrequency:{value:new THREE.Vector2(5,5)},
        uTime:{value: 0},
        ucolor:{value:new THREE.Color('white')},
        uTexture:{value:floorTexture}
    },
    //side:THREE.DoubleSide
    
})

const floor = new THREE.Mesh(floorGeometry,floorMaterial)
//floor.receiveShadow = true
floor.rotation.x = - Math.PI * 0.5
scene.add(floor)

//fog

const fog =new THREE.Fog('#2B8940',2,10)
scene.fog=fog
gui
 .add(fog,'far',1,50,1)
 .name('fog')

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.4)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.normalBias = 0.03
directionalLight.shadow.camera.far = 15
directionalLight.shadow.camera.left = - 7
directionalLight.shadow.camera.top = 7
directionalLight.shadow.camera.right = 7
directionalLight.shadow.camera.bottom = - 7

directionalLight.position.set(- 2.5, 2.5, 2.5)
scene.add(directionalLight)

gui.add(directionalLight,'intensity',0,5,0.1).name('lightIntensity')
gui.add(directionalLight.position,'x',-5,5,0.1).name('lightX')
gui.add(directionalLight.position,'y',-5,5,0.1).name('lightY')
gui.add(directionalLight.position,'z',-5,5,0.1).name('lightZ')

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(1.8,0.7, 0.2)
scene.add(camera)
gui.add(camera.position,'x',-5,5,0.1).name('cameraX')
gui.add(camera.position,'y',-5,5,0.1).name('cameraY')
gui.add(camera.position,'z',-5,5,0.1).name('cameraZ')


// Controls
const controls = new OrbitControls(camera, canvas)
controls.target.set(0, 0.75, 0)
controls.enableDamping = true

//
//ARscene
//

const initScene = () =>
{
   const geometry = sneaker
   const Meshes = []
}


/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias:true,
    alpha:true
})
renderer.shadowMap.enabled = true
//renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.physicallyCorrectLights = true
renderer.outputEncoding = THREE.sRGBEncoding   // for giving gamma
renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.toneMappingExposure = 1
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setClearColor('#2B8940')

/*
* ARcontroller and render scene 
*/

renderer.xr.enabled = true; // New!
container.appendChild(renderer.domElement)

let controller // controller

function onSelect()
{
    const mesh = sneaker
    mesh.position.set(0, 0,-1).applyMatrix4(controller.matrixWorld)
    mesh.quaternion.setFromRotationMatrix(controller.matrixWorld)
    Scene.add(mesh)
    meshes.push(mesh)
    
}
controller = renderer.xr.getController(0)
controller.addEventListener('select',onSelect)
scene.add(controller)

renderer.setAnimationLoop()


gui
 .add(renderer,'toneMapping',{
   No:THREE.NoToneMapping,
   linear:THREE.LinearToneMapping,
   Reinhard: THREE.ReinhardToneMapping,
   Cineon:THREE.CineonToneMapping,
   ACESFilmic:THREE.ACESFilmicToneMapping
   })
   .onFinishChange(() =>{
       renderer.toneMapping = Number(renderer.toneMapping)
       updateAllMaterial()
   }) 

gui.add(renderer,'toneMappingExposure',0,5,0.1).name('Exposure')



/**
 * AR session 
*/
// Add the AR button to the body of the DOM
document.body.appendChild(ARButton.createButton(renderer));


//const setupXR = () =>
{
   // renderer.setAnimationLoop()
}




/**
 * Animate
 */
const clock = new THREE.Clock()
let previousTime = 0

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime
    floorMaterial.uniforms.uTime.value = elapsedTime

    // Model animation
    if(mixer)
    {
        mixer.update(deltaTime)
    }

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()