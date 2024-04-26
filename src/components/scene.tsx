import { Canvas, useFrame } from "@react-three/fiber";
import {
  Environment,
  Lightformer,
  MeshDistortMaterial,
  MeshWobbleMaterial,
  OrbitControls,
  useHelper,
} from "@react-three/drei";
import { useRef, useState, type ReactElement } from "react";
import { DirectionalLightHelper, Mesh } from "three";
import { useControls, folder } from "leva";
import type { color } from "three/examples/jsm/nodes/Nodes.js";

import nj from "numjs";

const Cube = ({ position, size, color }) => {
  return (
    <mesh position={position}>
      <boxGeometry args={size} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
};

const TorusK = ({ position, size, color }) => {
  const torusK = useRef<Mesh>();
  const [rotate, setRotate] = useState<Boolean>(true);

  // useFrame((state, delta) => {
  //   if (torusK.current && rotate) {
  //     torusK.current.rotation.x += delta;
  //     torusK.current.rotation.y -= delta;
  //     // torusK.current.position.z = Math.sin(state.clock.elapsedTime);
  //   }
  // });
  return (
    <mesh
      position={position}
      ref={torusK}
      onPointerEnter={(event) => {
        event.stopPropagation();
        setRotate(true);
      }}
      onPointerLeave={(event) => {
        event.stopPropagation();
        setRotate(false);
      }}
    >
      <torusKnotGeometry args={size} />
      <meshBasicMaterial />
      {/* <MeshWobbleMaterial color={color} wireframe /> */}
    </mesh>
  );
};

const Scene01 = () => {
  const MainLightHelperRef = useRef();
  const cube = useRef<Mesh>();
  // const { Radius, Tube, TubularSegments, RadiusSegments, TorusColor } =
  //   useControls({
  //     Torus: folder({
  //       Radius: {
  //         value: 0.9,
  //         min: 0,
  //         max: 5,
  //       },
  //       Tube: {
  //         value: 0.15,
  //         min: 0,
  //         max: 5,
  //       },
  //       TubularSegments: {
  //         value: 20,
  //         min: 0,
  //         max: 50,
  //       },
  //       RadiusSegments: {
  //         value: 20,
  //         min: 0,
  //         max: 50,
  //       },
  //       TorusColor: {
  //         value: "White",
  //       },
  //     }),
  //   });

  useHelper(MainLightHelperRef, DirectionalLightHelper, 0.5, "white");

  useFrame((state, delta) => {
    cube.current.position.z += delta;
    console.log(delta);
  });

  return (
    <>
      <directionalLight position={[0, 1, 3]} ref={MainLightHelperRef} />
      <ambientLight />

      <mesh position={[1, 2, 3]} ref={cube}>
        <boxGeometry />
        <meshStandardMaterial />
      </mesh>
      {/* <Cube /> */}
      {/* <TorusK position={[0, 0, 0]} size={[0.9, 0.1, 20, 20]} color={"White"} /> */}
      <OrbitControls />
    </>
  );
};

const Scene02 = () => {
  const [matrixPlane, setMatrixPlane] = useState<Array<Array<ReactElement>>>(
    []
  );
  const [matrixBuffer, setmatrixBuffer] = useState<Array<ReactElement>>([]);

  const LightHelperRefScene02 = useRef();
  useHelper(LightHelperRefScene02, DirectionalLightHelper, 0.5, "white");

  for (let i=0; i<4; i++) {
    for (let j=0; j<4; j++) {
      setMatrixPlane((prev: ReactElement>) => [
        ...prev,
        <Cube position={[i, j, 0]} size={[1, 1, 1]} color={"red"} />,
      ]);   
    }
  }
  useFrame((delta: any) => {
    nj.random([4,4])
  })

  return (
    <>
      <directionalLight position={[0, 1, 4]} ref={LightHelperRefScene02} />
      <ambientLight intensity={0.5} />
      {matrixPlane.map((buffer) => buffer.map((cube) => cube))}
      <OrbitControls />
    </>
  );
};

export default function Scene() {
  return (
    <div className="flex items-center py-10 h-screen w-full space-x-2">
      <div className="w-1/3 border h-full border-white rounded-[40px]">
        <Canvas>
          <Scene01 />
        </Canvas>
      </div>
      <div className="w-1/3 border h-full border-white rounded-[40px]">
        <Canvas>
          <Scene02 />
        </Canvas>
      </div>
    </div>
  );
}
