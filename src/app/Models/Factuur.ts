import type { FactuurLijn } from './FactuurLijn';
import type { Klant } from './Klant';

export type BetaalStatus = 'Openstaand' | 'InBehandeling' | 'Betaald' | 'Mislukt' | 'Geannuleerd';

export interface Factuur {
     id: number;
     klantId: number;
     klant: Klant | null;
     factuurDatum: string;
     teBetalenVoor: string;
     prijs: number;
     beschrijving: string;
     betaalStatus: BetaalStatus;
     factuurLijnen: FactuurLijn[];
}

export function createFactuur(overrides: Partial<Factuur> = {}): Factuur {
     const vandaag = new Date().toISOString().split('T')[0] ?? '';

     return {
          id: 0,
          klantId: 0,
          klant: null,
          factuurDatum: vandaag,
          teBetalenVoor: vandaag,
          prijs: 0,
          beschrijving: '',
          betaalStatus: 'Openstaand',
          factuurLijnen: [],
          ...overrides,
     };
}