import type { Land } from './Land';

export interface Adres {
    id: number;
    straat: string;
    huisnummer: string;
    busnummer: string;
    postcode: string;
    gemeente: string;
    stad: string;
    provincie: string;
    landcode: string;
    land: Land | null;
}

export function createAdres(overrides: Partial<Adres> = {}): Adres {
    return {
        id: 0,
        straat: '',
        huisnummer: '',
        busnummer: '',
        postcode: '',
        gemeente: '',
        stad: '',
        provincie: '',
        landcode: '',
        land: null,
        ...overrides,
    };
}