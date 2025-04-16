import { MazeCell, Position } from "./types";
import { cost, getNeighbors, heuristic } from "./mazeLogic";

export function aStar(
    maze: MazeCell[][],
    start: Position,
    goal: Position
): { path: Position[]; visited: Position[] } {
    const key = (pos: Position) => `${pos.x},${pos.y}`;
    const cameFrom = new Map<string, Position>();
    const gScore = new Map<string, number>();
    const fScore = new Map<string, number>();
    const openSet: Position[] = [start];
    const visitedSet = new Set<string>();
    const visited: Position[] = [];

    gScore.set(key(start), 0);
    fScore.set(key(start), heuristic(start, goal));

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

        for (const neighbor of getNeighbors(current, maze)) {
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
