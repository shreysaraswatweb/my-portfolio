const THREE = require('three');
console.log('THREE revision:', THREE.REVISION);

// Check if Three.js has what Vanta expects
const geom = new THREE.BufferGeometry();
const points = [new THREE.Vector3(0,0,0), new THREE.Vector3(1,0,0), new THREE.Vector3(0,1,0)];
geom.setFromPoints(points);
geom.setIndex([0,1,2]);
console.log('Geometry created, attributes:', Object.keys(geom.attributes));

// Check MeshPhongMaterial
const mat = new THREE.MeshPhongMaterial({
  color: 0x081e16,
  shininess: 38.0,
  flatShading: true,
  side: THREE.DoubleSide
});
console.log('Material created:', !!mat);

// Check dynamic draw usage
console.log('THREE.DynamicDrawUsage:', THREE.DynamicDrawUsage);
geom.attributes.position.setUsage(THREE.DynamicDrawUsage);
geom.computeVertexNormals();
console.log('computeVertexNormals passed');
