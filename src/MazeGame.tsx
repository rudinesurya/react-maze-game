import React, { useEffect, useState } from "react";
import { Stage, Layer, Rect, Circle, Star } from "react-konva";
import { Position } from "./types";
import { createEmptyMaze } from "./mazeLogic";
import { aStar } from "./astar";
import { dijkstra } from "./dijkstra";

const CELL_SIZE = 40;
const COLS = 12;
const ROWS = 20;

const MazeGame: React.FC = () => {
    const [maze, setMaze] = useState(createEmptyMaze(COLS, ROWS));
    const [playerPos, setPlayerPos] = useState<Position>({ x: 1, y: 1 });
    const [playerGoalPos, setPlayerGoalPos] = useState<Position>({ x: COLS - 2, y: ROWS - 2 });
    const [path, setPath] = useState<Position[]>([]);
    const [visitedCells, setVisitedCells] = useState<Position[]>([]);
    const [algorithm, setAlgorithm] = useState<"astar" | "dijkstra">("astar");

    useEffect(() => {
        const { path, visited } =
            algorithm === "astar"
                ? aStar(maze, playerPos, playerGoalPos)
                : dijkstra(maze, playerPos, playerGoalPos);
        setPath(path);
        setVisitedCells(visited);
    }, [maze, playerPos, playerGoalPos, algorithm]);

    const toggleWall = (x: number, y: number) => {
        // Prevent toggling 
        const isPlayer = x === playerPos.x && y === playerPos.y;
        const isPlayerGoal = x === playerGoalPos.x && y === playerGoalPos.y;

        if (isPlayerGoal || isPlayer) return;

        setMaze((prevMaze) => {
            const newMaze = prevMaze.map((row) => [...row]);
            newMaze[y][x] = newMaze[y][x] === 1 ? 0 : 1;
            return newMaze;
        });
    };

    return (
        <div>
            <button
                onClick={() =>
                    setAlgorithm((prev) => (prev === "astar" ? "dijkstra" : "astar"))
                }
                style={{
                    position: "absolute",
                    top: 10,
                    right: 10,
                    zIndex: 10,
                    padding: "6px 12px",
                    fontSize: "14px",
                    backgroundColor: "#333",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                }}
            >
                Algorithm: {algorithm.toUpperCase()}
            </button>

            <Stage width={COLS * CELL_SIZE} height={ROWS * CELL_SIZE}>
                <Layer>
                    {maze.map((row, y) =>
                        row.map((cell, x) => (
                            <Rect
                                key={`${x}-${y}`}
                                x={x * CELL_SIZE}
                                y={y * CELL_SIZE}
                                width={CELL_SIZE}
                                height={CELL_SIZE}
                                fill={cell === 1 ? "#333" : "#fff"}
                                stroke="#ccc"
                                strokeWidth={1}
                                onContextMenu={(e) => {
                                    e.evt.preventDefault(); // prevent browser menu
                                    toggleWall(x, y);
                                }}
                            />
                        ))
                    )}
                    {visitedCells.map(({ x, y }) => (
                        <Rect
                            key={`visited-${x}-${y}`}
                            x={x * CELL_SIZE}
                            y={y * CELL_SIZE}
                            width={CELL_SIZE}
                            height={CELL_SIZE}
                            fill="rgba(0,0,255,0.15)"
                            onContextMenu={(e) => {
                                e.evt.preventDefault(); // prevent browser menu
                                toggleWall(x, y);
                            }}
                        />
                    ))}
                    {path.map(({ x, y }, i) => (
                        <Rect
                            key={`path-${x}-${y}`}
                            x={x * CELL_SIZE}
                            y={y * CELL_SIZE}
                            width={CELL_SIZE}
                            height={CELL_SIZE}
                            fill="rgba(0, 255, 0, 0.3)"
                            onContextMenu={(e) => {
                                e.evt.preventDefault(); // prevent browser menu
                                toggleWall(x, y);
                            }}
                        />
                    ))}

                    <Circle
                        x={playerPos.x * CELL_SIZE + CELL_SIZE / 2}
                        y={playerPos.y * CELL_SIZE + CELL_SIZE / 2}
                        radius={CELL_SIZE / 2}
                        fill="red"
                        draggable
                        onDragEnd={(e) => {
                            const rawX = e.target.x();
                            const rawY = e.target.y();

                            // Snap to nearest grid cell
                            const snappedX = Math.floor(rawX / CELL_SIZE);
                            const snappedY = Math.floor(rawY / CELL_SIZE);

                            const centerX = snappedX * CELL_SIZE + CELL_SIZE / 2;
                            const centerY = snappedY * CELL_SIZE + CELL_SIZE / 2;

                            const isValid =
                                snappedX >= 0 &&
                                snappedY >= 0 &&
                                snappedX < COLS &&
                                snappedY < ROWS &&
                                maze[snappedY][snappedX] === 0;

                            if (isValid) {
                                setPlayerPos({ x: snappedX, y: snappedY });

                                e.target.to({ x: centerX, y: centerY, duration: 0.1 });
                            } else {
                                // Animate back to current position
                                e.target.to({
                                    x: playerPos.x * CELL_SIZE + CELL_SIZE / 2,
                                    y: playerPos.y * CELL_SIZE + CELL_SIZE / 2,
                                    duration: 0.1,
                                });
                            }
                        }}
                    />

                    <Star
                        x={playerGoalPos.x * CELL_SIZE + CELL_SIZE / 2}
                        y={playerGoalPos.y * CELL_SIZE + CELL_SIZE / 2}
                        numPoints={5}
                        innerRadius={CELL_SIZE / 3}
                        outerRadius={CELL_SIZE / 2}
                        fill="green"
                        draggable
                        onDragEnd={(e) => {
                            const rawX = e.target.x();
                            const rawY = e.target.y();

                            // Snap to nearest grid cell
                            const snappedX = Math.floor(rawX / CELL_SIZE);
                            const snappedY = Math.floor(rawY / CELL_SIZE);

                            const centerX = snappedX * CELL_SIZE + CELL_SIZE / 2;
                            const centerY = snappedY * CELL_SIZE + CELL_SIZE / 2;

                            const isValid =
                                snappedX >= 0 &&
                                snappedY >= 0 &&
                                snappedX < COLS &&
                                snappedY < ROWS &&
                                maze[snappedY][snappedX] === 0;

                            if (isValid) {
                                setPlayerGoalPos({ x: snappedX, y: snappedY });

                                e.target.to({ x: centerX, y: centerY, duration: 0.1 });
                            } else {
                                // Animate back to current position
                                e.target.to({
                                    x: playerGoalPos.x * CELL_SIZE + CELL_SIZE / 2,
                                    y: playerGoalPos.y * CELL_SIZE + CELL_SIZE / 2,
                                    duration: 0.1,
                                });
                            }
                        }}
                    />
                </Layer>
            </Stage>
        </div>
    );
};

export default MazeGame;
