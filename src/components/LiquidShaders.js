export const liquidVertexShader = `
  varying vec2 vUv;
  varying float vElevation;
  uniform float uTime;
  uniform float uRotationSpeed;

  void main() {
    vUv = uv;
    
    // Calculate rotation
    float angle = uRotationSpeed * uTime;
    mat3 rotationMatrix = mat3(
      cos(angle), 0.0, -sin(angle),
      0.0, 1.0, 0.0,
      sin(angle), 0.0, cos(angle)
    );
    
    // Apply rotation to position
    vec3 rotatedPosition = rotationMatrix * position;
    
    // Create gentle waves using multiple sine waves
    float elevation = 
      sin(rotatedPosition.x * 3.0 + uTime * 0.7) * 0.05 +
      sin(rotatedPosition.z * 2.0 + uTime * 0.5) * 0.05;
    
    vElevation = elevation;
    vec3 newPosition = rotatedPosition;
    newPosition.y += elevation;
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
  }
`;

export const liquidFragmentShader = `
  uniform vec3 uColor;
  uniform float uTime;
  varying vec2 vUv;
  varying float vElevation;

  void main() {
    float mixStrength = (vElevation + 0.05) * 0.8;
    vec3 color = mix(uColor, vec3(1.0), mixStrength);
    float alpha = 0.7 - abs(vElevation) * 2.0;
    gl_FragColor = vec4(color, alpha);
  }
`;
