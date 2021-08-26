//precision  mediump float;  //for_raw_shadermaterial
//precision  highp float;    //for_raw_shadermaterial
uniform vec3 ucolor;
uniform sampler2D uTexture;

varying float vRandom;
varying vec2 vUv;

float random (vec2 st) {
    return fract(sin(dot(st.xy,
                         vec2(12.9898,78.233)))*
        43758.5453123);
}

vec4 permute(vec4 x) 
{ 
    return mod(((x*34.0)+1.0)*x, 289.0);
}
vec2 fade(vec2 t) {return t*t*t*(t*(t*6.0-15.0)+10.0);}

float cnoise(vec2 P){
  vec4 Pi = floor(P.xyxy) + vec4(0.0, 0.0, 1.0, 1.0);
  vec4 Pf = fract(P.xyxy) - vec4(0.0, 0.0, 1.0, 1.0);
  Pi = mod(Pi, 289.0); // To avoid truncation effects in permutation
  vec4 ix = Pi.xzxz;
  vec4 iy = Pi.yyww;
  vec4 fx = Pf.xzxz;
  vec4 fy = Pf.yyww;
  vec4 i = permute(permute(ix) + iy);
  vec4 gx = 2.0 * fract(i * 0.0243902439) - 1.0; // 1/41 = 0.024...
  vec4 gy = abs(gx) - 0.5;
  vec4 tx = floor(gx + 0.5);
  gx = gx - tx;
  vec2 g00 = vec2(gx.x,gy.x);
  vec2 g10 = vec2(gx.y,gy.y);
  vec2 g01 = vec2(gx.z,gy.z);
  vec2 g11 = vec2(gx.w,gy.w);
  vec4 norm = 1.79284291400159 - 0.85373472095314 * 
    vec4(dot(g00, g00), dot(g01, g01), dot(g10, g10), dot(g11, g11));
  g00 *= norm.x;
  g01 *= norm.y;
  g10 *= norm.z;
  g11 *= norm.w;
  float n00 = dot(g00, vec2(fx.x, fy.x));
  float n10 = dot(g10, vec2(fx.y, fy.y));
  float n01 = dot(g01, vec2(fx.z, fy.z));
  float n11 = dot(g11, vec2(fx.w, fy.w));
  vec2 fade_xy = fade(Pf.xy);
  vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);
  float n_xy = mix(n_x.x, n_x.y, fade_xy.y);
  return 2.3 * n_xy;
}

void main()
{
    //pattern1
    //float strength = vUv.x;
    
    //pattern2
    //float strength = vUv.y*vUv.x;

    //pattern3
    //float strength = mod(vUv.y*vUv.x * 10.0,1.0);

    //pattern4
    //float strength = mod(vUv.y* 10.0,1.0) ;

    //pattern5
    //float strength = mod(vUv.y* 10.0,1.0) ;
    //strength = step(0.5,strength);
    
    //strength = strength < 0.5 ? 0.0 : 1.0; //alternative

    /**alternative
    if (strength<0.5)
       strength =1.0-strength;
    else
      strength = strength;  
    */

    //pattern6
    //float strength = mod(vUv.y* 10.0,1.0) ;
    //strength += mod(vUv.x * 10.0,1.0);
    //strength = step(0.9,strength);
    
    //pattern6
    //float strength = step(0.9,mod(vUv.y* 10.0,1.0));
    //strength += step(0.9,mod(vUv.x* 10.0,1.0));

    //pattern 7
    //float strength = min(abs(vUv.x -0.5),abs(vUv.y -0.5));
    //strength *= max(abs(vUv.x -0.5),abs(vUv.y -0.5));

    //pattern8
    //float strength =step(0.3, max(abs(vUv.x -0.5),abs(vUv.y -0.5)));

    //pattern9
    //float strength =floor(vUv.x*vUv.y *10.0)/10.0 ;
    //strength *=floor(vUv.x *10.0)/10.0 ;
    //strength *= floor(vUv.y *10.0)/10.0 ;

    //pattern10
    //float strength = random(vUv);

    //pattern11
    /**
    vec2 griduv = vec2(
        floor(vUv.y *10.0)/10.0,
        floor(vUv.x *10.0)/10.0

    );
    float strength = random(griduv);

    gl_FragColor = vec4( strength,strength,strength, 1.0);
    */

    //pattern12
    //float strength = length(vUv);
    //float strength = distance(vUv,vec2(0.5));
    //float strength = 1.0 - distance(vUv,vec2(0.5));
    //float strength = 0.02 /distance(vUv,vec2(0.5));

    //pattern13
    //float angle = atan(vUv.x -0.5,vUv.y -0.5);
    //angle /=3.14 *2.0;
    //angle += 0.5;
    //angle *= 50.0;
    //angle = mod(angle,1.0);
    //float strength = angle;

    //pattern 14 perlin noise
    // strength = abs(cnoise(vUv * 5.0));
    //float strength = sin(abs(cnoise(vUv * 10.0))*20.0);
    float strength = step(0.9,sin(abs(cnoise(vUv * 2.0))*50.0));

    //clamp the strength
    strength = clamp(strength,0.0,1.0);

    // color version
    vec3 blackcolor = vec3(0.15,0.5,0.22);
    vec3 uvcolor = vec3(0.85,0.85,0.85);
    vec3 mixedcolor = mix(blackcolor,uvcolor,strength);
    gl_FragColor = vec4(mixedcolor,1.0);

    // black and white version

    //gl_FragColor = vec4( strength*0.6,strength,strength*0.6, 1.0);

    //gl_FragColor = vec4( 1, 0.4,1, 1.0);
    //ec4 textureColor = texture2D(uTexture, vUv);
    //gl_FragColor = vec4( 1, vRandom*0.9,0.1, 1.0);
    //gl_FragColor = vec4( vUv,0.5, 1.0);
    //gl_FragColor = textureColor;
}