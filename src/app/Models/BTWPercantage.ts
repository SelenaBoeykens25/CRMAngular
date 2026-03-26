export interface BTWPercantage {
    id: number;
    percentage: number;
}

export function createBTWPercantage(
    overrides: Partial<BTWPercantage> = {}
): BTWPercantage {
    return {
        id: 0,
        percentage: 21,
        ...overrides,
    };
}