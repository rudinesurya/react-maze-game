import { MazeCell, Position } from "./types";

export function dijkstra(
    maze: MazeCell[][],
    start: Position,
    goal: Position
): { path: Position[]; visited: Position[] } {
    const ROWS = maze.length;
    const COLS = maze[0].length;

    const key = (pos: Position) => `${pos.x},${pos.y}`;
    const visitedSet = new Set<string>();
    const visited: Position[] = [];

    const distances = new Map<string, number>();
    const prev = new Map<string, Position>();
    const queue: Position[] = [start];
    distances.set(key(start), 0);

    const cost = (a: Position, b: Position) =>
        a.x !== b.x && a.y !== b.y ? Math.SQRT2 : 1;

    const getNeighbors = (pos: Position): Position[] => {
        const dirs = [
            { x: -1, y: 0 },  // left
            { x: 1, y: 0 },   // right
            { x: 0, y: -1 },  // up
            { x: 0, y: 1 },   // down
            { x: -1, y: -1 }, // top-left
            { x: 1, y: -1 },  // top-right
            { x: -1, y: 1 },  // bottom-left
            { x: 1, y: 1 },   // bottom-right
        ];
        return dirs
            .map((d) => ({ x: pos.x + d.x, y: pos.y + d.y }))
            .filter(
                (p) =>
                    p.x >= 0 &&
                    p.y >= 0 &&
                    p.x < COLS &&
                    p.y < ROWS &&
                    maze[p.y][p.x] === 0
            );
    };

    while (queue.length > 0) {
        queue.sort(
            (a, b) =>
                (distances.get(key(a)) ?? Infinity) - (distances.get(key(b)) ?? Infinity)
        );
        const current = queue.shift()!;
        const currentKey = key(current);

        if (!visitedSet.has(currentKey)) {
            visitedSet.add(currentKey);
            visited.push(current);
        }

        if (current.x === goal.x && current.y === goal.y) {
            const path: Position[] = [];
            let node: Position | undefined = current;
            while (node) {
                path.push(node);
                node = prev.get(key(node));
            }
            return { path: path.reverse(), visited };
        }

        for (const neighbor of getNeighbors(current)) {
            const neighborKey = key(neighbor);
            const newDist = (distances.get(currentKey) ?? Infinity) + cost(current, neighbor);

            if (newDist < (distances.get(neighborKey) ?? Infinity)) {
                distances.set(neighborKey, newDist);
                prev.set(neighborKey, current);
                queue.push(neighbor);
            }
        }
    }

    return { path: [], visited };
}
