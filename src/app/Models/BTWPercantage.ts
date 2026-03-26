export interface BTWPercantage {
    id: number;
    percantage: number;
}

export function createBTWPercantage(
    overrides: Partial<BTWPercantage> = {}
): BTWPercantage {
    return {
        id: 0,
        percantage: 21,
        ...overrides,
    };
}