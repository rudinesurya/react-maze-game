import { MazeCell } from "./types";

export const createEmptyMaze = (cols: number, rows: number): MazeCell[][] => {
    const maze: MazeCell[][] = Array.from({ length: rows }, () =>
        Array(cols).fill(0)
    );
    return maze;
};
