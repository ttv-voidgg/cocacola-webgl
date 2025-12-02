import * as THREE from "three";

export const generageCirclePoints = (numPoints = 100, radius = 50) => {
    const points = [];

    for (let i = 0; i < numPoints; i++) {
        const angle = (i / numPoints) * 2 * Math.PI;
        const x = radius * Math.cos(angle);
        const y = 0;
        const z = radius * Math.sin(angle);
        points.push(new THREE.Vector3(x, y, z));
    }

    return points;
}