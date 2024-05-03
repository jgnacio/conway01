import { Canvas, useFrame } from "@react-three/fiber";
import {
  Environment,
  Lightformer,
  MeshDistortMaterial,
  MeshWobbleMaterial,
  OrbitControls,
  useHelper,
} from "@react-three/drei";
import { useEffect, useRef, useState, type ReactElement } from "react";
import { DirectionalLightHelper, Mesh } from "three";
import Scene01 from "./scene01";

type board = number[][];

function createBoard(rows: number, cols: number): board {
  return Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => 1)
  );
}

const Scene02 = () => {
  const LightHelperRefScene02 = useRef();
  useHelper(LightHelperRefScene02, DirectionalLightHelper, 0.5, "white");

  const rows = 8;
  const cols = 8;
  const cellSize = 0.2;
  const fill = [
    <></>,
    <>
      <boxGeometry args={[cellSize, cellSize, cellSize]} />
      <meshBasicMaterial />
    </>,
  ];
  const board = createBoard(rows, cols);
  const [boardState, setBoardState] = useState<board>(board);

  useFrame((state, delta) => {
    if (boardState) {
      // rellenar el tablero de etiquetas vacias
      for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
          // console.log(Math.abs(Math.round(Math.sin(state.clock.elapsedTime))));
          const newBoardState = [...boardState];
          newBoardState[i][j] = Math.abs(
            Math.round(Math.sin(state.clock.elapsedTime - j))
          );
          setBoardState(newBoardState);

          // console.table(boardState);
        }
      }
    }
  });

  return (
    <>
      <directionalLight position={[0, 1, 4]} ref={LightHelperRefScene02} />
      <ambientLight intensity={0.5} />
      {boardState.map((row, i) =>
        row.map((cell, j) => (
          <mesh position={[i * cellSize, j * cellSize, 0]} key={i + 1 * j + 1}>
            {cell === 1 ? (
              <>
                <boxGeometry args={[cellSize, cellSize, cellSize]} />
                <meshBasicMaterial />
              </>
            ) : (
              ""
            )}
          </mesh>
        ))
      )}
      {/* <mesh></mesh>
      <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color={"green"} />
      </mesh> */}
      <OrbitControls />
    </>
  );
};

export default function Scene() {
  return (
    <div className="flex items-center py-10 h-screen w-full space-x-2">
      {/* <div className=" w-1/3 border h-full border-white rounded-[40px]">
        <Canvas><Scene01 /></Canvas>
      </div> */}
      <div className="w-full border h-full border-white rounded-[40px]">
        <Canvas>
          <Scene02 />
        </Canvas>
      </div>
    </div>
  );
}
