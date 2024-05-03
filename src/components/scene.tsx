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
import { DirectionalLightHelper, AxesHelper, Mesh } from "three";

import Scene01 from "./scene01";

type board = number[][];

function createBoard(rows: number, cols: number): board {
  return Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => (Math.random() - 0.3 > 0.5 ? 1 : 0))
  );
}

function clearBoard(rows: number, cols: number): board {
  return Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => 0)
  );
}

const Scene02 = () => {
  const LightHelperRefScene02 = useRef();
  const LightHelperRefScene03 = useRef();
  const LightHelperRefScene04 = useRef();

  useHelper(LightHelperRefScene02, DirectionalLightHelper, 0.5, "yellow");
  useHelper(LightHelperRefScene03, DirectionalLightHelper, 0.5, "red");
  useHelper(LightHelperRefScene04, DirectionalLightHelper, 0.5, "blue");

  const rows = 20;
  const cols = 20;
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

  useEffect(() => {
    if (boardState) {
      setTimeout(() => {
        computeNextBoard();
      }, 50);
    }
  }, [boardState]);

  function countNeighbors(x: number, y: number) {
    let sum = 0;
    for (let i = -1; i <= 1; ++i) {
      for (let j = -1; j <= 1; ++j) {
        if (i === 0 && j === 0) {
          continue;
        }
        const row = (x + i + rows) % rows;
        const col = (y + j + cols) % cols;
        if (boardState[row][col] === 1) {
          sum++;
        }
      }
    }
    return sum;
  }

  function computeNextBoard() {
    const nextBoard = clearBoard(rows, cols);
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        const neighbors = countNeighbors(i, j);
        if (boardState[i][j] === 1) {
          if (neighbors < 2 || neighbors > 3) {
            nextBoard[i][j] = 0;
          } else {
            nextBoard[i][j] = 1;
          }
        } else {
          if (neighbors === 3) {
            nextBoard[i][j] = 1;
          }
        }
      }
    }
    setBoardState(nextBoard);
  }

  return (
    <>
      <directionalLight
        position={[0, 1, 4]}
        ref={LightHelperRefScene02}
        color={"yellow"}
      />
      <directionalLight
        position={[5, 4, 0]}
        ref={LightHelperRefScene03}
        color={"red"}
      />
      <directionalLight
        position={[-5, 4, 0]}
        ref={LightHelperRefScene04}
        color={"blue"}
      />
      <ambientLight intensity={0.5} color={"#444444"} />
      {boardState.map((row, i) =>
        row.map((cell, j) => (
          <mesh
            onClick={computeNextBoard}
            position={[i * cellSize, j * cellSize, 0]}
            key={`${i}-${j}`}
          >
            {cell === 1 ? (
              <>
                <boxGeometry args={[cellSize, cellSize, cellSize]} />
                <meshStandardMaterial color={"white"} />
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
