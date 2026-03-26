import type { Adres } from './Adres';
import type { Factuur } from './Factuur';

export interface Klant {
    id: number;
    voornaam: string;
    naam: string;
    aanspreking: string;
    telefoonNummer: string;
    emailAdres: string;
    geboorteDatum: string;
    adres: Adres | null;
    adresId: number | null;
    facturen: Factuur[];
}

export function createKlant(overrides: Partial<Klant> = {}): Klant {
    const vandaag = new Date().toISOString().split('T')[0] ?? '';

    return {
        id: 0,
        voornaam: '',
        naam: '',
        aanspreking: '',
        telefoonNummer: '',
        emailAdres: '',
        geboorteDatum: vandaag,
        adres: null,
        adresId: null,
        facturen: [],
        ...overrides,
    };
}
