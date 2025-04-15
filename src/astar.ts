export type Position = { x: number; y: number };
export type MazeCell = 0 | 1;

export function aStar(
    maze: MazeCell[][],
    start: Position,
    goal: Position
): { path: Position[]; visited: Position[] } {
    const ROWS = maze.length;
    const COLS = maze[0].length;

    const key = (pos: Position) => `${pos.x},${pos.y}`;
    const cameFrom = new Map<string, Position>();
    const gScore = new Map<string, number>();
    const fScore = new Map<string, number>();
    const openSet: Position[] = [start];
    const visitedSet = new Set<string>();
    const visited: Position[] = [];

    const heuristic = (a: Position, b: Position) => {
        const dx = Math.abs(a.x - b.x);
        const dy = Math.abs(a.y - b.y);
        return dx + dy + (Math.SQRT2 - 2) * Math.min(dx, dy); // Octile distance
    };

    const cost = (a: Position, b: Position) =>
        a.x !== b.x && a.y !== b.y ? Math.SQRT2 : 1;

    gScore.set(key(start), 0);
    fScore.set(key(start), heuristic(start, goal));

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

    while (openSet.length > 0) {
        openSet.sort(
            (a, b) =>
                (fScore.get(key(a)) ?? Infinity) - (fScore.get(key(b)) ?? Infinity)
        );
        const current = openSet.shift()!;
        const currentKey = key(current);

        if (!visitedSet.has(currentKey)) {
            visitedSet.add(currentKey);
            visited.push(current);
        }

        if (current.x === goal.x && current.y === goal.y) {
            const path: Position[] = [];
            let curr: Position | undefined = current;
            while (curr) {
                path.push(curr);
                curr = cameFrom.get(key(curr));
            }
            return { path: path.reverse(), visited };
        }

        for (const neighbor of getNeighbors(current)) {
            const neighborKey = key(neighbor);
            const tentativeG = (gScore.get(currentKey) ?? Infinity) + cost(current, neighbor);

            if (tentativeG < (gScore.get(neighborKey) ?? Infinity)) {
                cameFrom.set(neighborKey, current);
                gScore.set(neighborKey, tentativeG);
                fScore.set(neighborKey, tentativeG + heuristic(neighbor, goal));
                if (!openSet.some((n) => key(n) === neighborKey)) {
                    openSet.push(neighbor);
                }
            }
        }
    }

    return { path: [], visited };
}
