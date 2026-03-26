export type SecurityLevel = 'User' | 'Admin' | 'Owner';

export interface GebruikersAccount {
    id: number;
    email: string;
    wachtwoord: string;
    aanmaakDatum: Date;
    securityLevel: SecurityLevel;
}

export function createGebruikersAccount(
    overrides: Partial<GebruikersAccount> = {}
): GebruikersAccount {

    return {
        id: 0,
        email: '',
        wachtwoord: '',
        aanmaakDatum: new Date(),
        securityLevel: 'User',
        ...overrides,
    };
}
