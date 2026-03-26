import type { Factuur } from './Factuur';

export interface FactuurLijn {
    id: number;
    factuurId: number;
    factuur: Factuur | null;
    omschrijving: string;
    nettoPrijs: number;
    btwPercentage: number;
    brutoPrijs: number;
}

export function createFactuurLijn(
    overrides: Partial<FactuurLijn> = {}
): FactuurLijn {
    return {
        id: 0,
        factuurId: 0,
        factuur: null,
        omschrijving: '',
        nettoPrijs: 0,
        btwPercentage: 21,
        brutoPrijs: 0,
        ...overrides,
    };
}
