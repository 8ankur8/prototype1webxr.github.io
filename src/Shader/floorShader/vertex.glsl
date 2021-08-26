//uniform mat4 projectionMatrix; //for_raw_shadermaterial
//uniform mat4 viewMatrix;  //for_raw_shadermaterial
//uniform mat4 modelMatrix; //for_raw_shadermaterial
 //uniform mat4 modelviewMatrix;  //for_raw_shadermaterial
uniform vec2 ufrequency;
uniform float uTime;
        
//attribute vec3 position; //for_raw_shadermaterial
attribute float aRandom;
 
// attribute vec2 uv; //for_raw_shadermaterial

 varying vec2 vUv;
 varying float vRandom;


void main()
{
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    modelPosition.x += sin(modelPosition.x * ufrequency.x + uTime)*0.05;
    modelPosition.z += sin(modelPosition.z * ufrequency.y - uTime)*0.05;
    modelPosition.xz += aRandom * 0.01 ;

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;

    gl_Position = projectedPosition;
    
    vRandom = aRandom;
    vUv = uv;
    //gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0) ;
}