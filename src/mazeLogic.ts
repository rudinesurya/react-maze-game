import { MazeCell, Position } from "./types";

export const cost = (a: Position, b: Position) =>
    a.x !== b.x && a.y !== b.y ? Math.SQRT2 : 1;

export const getNeighbors = (pos: Position, maze: MazeCell[][]): Position[] => {
    const directions = [
        { dx: -1, dy: 0 },  // left
        { dx: 1, dy: 0 },   // right
        { dx: 0, dy: -1 },  // up
        { dx: 0, dy: 1 },   // down
        { dx: -1, dy: -1 }, // up-left
        { dx: 1, dy: -1 },  // up-right
        { dx: -1, dy: 1 },  // down-left
        { dx: 1, dy: 1 },   // down-right
    ];

    const neighbors: Position[] = [];

    const ROWS = maze.length;
    const COLS = maze[0].length;

    for (const { dx, dy } of directions) {
        const nx = pos.x + dx;
        const ny = pos.y + dy;

        // skip out-of-bounds
        if (nx < 0 || ny < 0 || nx >= COLS || ny >= ROWS) continue;

        // skip walls
        if (maze[ny][nx] === 1) continue;

        // check for diagonal wall rule
        if (dx !== 0 && dy !== 0) {
            const adj1 = maze[pos.y][pos.x + dx]; // horizontal neighbor
            const adj2 = maze[pos.y + dy][pos.x]; // vertical neighbor
            if (adj1 === 1 && adj2 === 1) continue; // block diagonal
        }

        neighbors.push({ x: nx, y: ny });
    }

    return neighbors;
};

export const heuristic = (a: Position, b: Position) => {
    const dx = Math.abs(a.x - b.x);
    const dy = Math.abs(a.y - b.y);
    return dx + dy + (Math.SQRT2 - 2) * Math.min(dx, dy); // Octile distance
};

export const createEmptyMaze = (cols: number, rows: number): MazeCell[][] => {
    const maze: MazeCell[][] = Array.from({ length: rows }, () =>
        Array(cols).fill(0)
    );
    return maze;
};
