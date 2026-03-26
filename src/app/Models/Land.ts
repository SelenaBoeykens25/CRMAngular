export interface Land {
    landCode: string;
    landNaam: string;
}

export function createLand(overrides: Partial<Land> = {}): Land {
    return {
        landCode: '',
        landNaam: '',
        ...overrides,
    };
}
