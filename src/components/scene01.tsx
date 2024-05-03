import { useRef, useState, type ReactElement } from "react";
import { DirectionalLightHelper, Mesh } from "three";
import { useFrame } from "@react-three/fiber";
import { useControls, folder } from "leva";
import {
  OrbitControls,
  useHelper,
  MeshWobbleMaterial,
} from "@react-three/drei";

const TorusK = ({ position, size, color }) => {
  const torusK = useRef<Mesh>();
  const [rotate, setRotate] = useState<Boolean>(true);

  useFrame((state, delta) => {
    if (torusK.current && rotate) {
      torusK.current.rotation.x += delta;
      torusK.current.rotation.y -= delta;
      // torusK.current.position.z = Math.sin(state.clock.elapsedTime);
    }
  });
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
      {/* <meshBasicMaterial /> */}
      <MeshWobbleMaterial color={color} wireframe />
    </mesh>
  );
};

const Scene01 = () => {
  const MainLightHelperRef = useRef();
  const cube = useRef<Mesh>();
  const { Radius, Tube, TubularSegments, RadiusSegments, TorusColor } =
    useControls({
      Torus: folder({
        Radius: {
          value: 0.9,
          min: 0,
          max: 5,
        },
        Tube: {
          value: 0.15,
          min: 0,
          max: 5,
        },
        TubularSegments: {
          value: 20,
          min: 0,
          max: 50,
        },
        RadiusSegments: {
          value: 20,
          min: 0,
          max: 50,
        },
        TorusColor: {
          value: "White",
        },
      }),
    });

  useHelper(MainLightHelperRef, DirectionalLightHelper, 0.5, "white");

  return (
    <>
      <directionalLight position={[0, 1, 3]} ref={MainLightHelperRef} />
      <ambientLight />

      <mesh position={[1, 2, 3]} ref={cube}>
        <boxGeometry />
        <meshStandardMaterial />
      </mesh>
      {/* <Cube /> */}
      <TorusK position={[0, 0, 0]} size={[0.9, 0.1, 20, 20]} color={"White"} />
      <OrbitControls />
    </>
  );
};

export default Scene01;
