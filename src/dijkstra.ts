import { MazeCell, Position } from "./types";
import { cost, getNeighbors } from "./mazeLogic";

export function dijkstra(
    maze: MazeCell[][],
    start: Position,
    goal: Position
): { path: Position[]; visited: Position[] } {
    const key = (pos: Position) => `${pos.x},${pos.y}`;
    const visitedSet = new Set<string>();
    const visited: Position[] = [];
    const distances = new Map<string, number>();
    const prev = new Map<string, Position>();
    const queue: Position[] = [start];
    distances.set(key(start), 0);

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

        for (const neighbor of getNeighbors(current, maze)) {
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
