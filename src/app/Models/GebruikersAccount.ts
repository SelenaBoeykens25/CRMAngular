export type SecurityLevel = 'User' | 'Admin' | 'Owner';

export function normalizeSecurityLevel(level: unknown): SecurityLevel | null {
    if (level === null || level === undefined) {
        return null;
    }

    if (typeof level === 'number') {
        switch (level) {
            case 0:
                return 'User';
            case 1:
                return 'Admin';
            case 2:
                return 'Owner';
            default:
                return null;
        }
    }

    if (typeof level !== 'string') {
        return null;
    }

    const normalized = level.trim().toLowerCase();
    switch (normalized) {
        case '0':
        case 'user':
            return 'User';
        case '1':
        case 'admin':
            return 'Admin';
        case '2':
        case 'owner':
            return 'Owner';
        default:
            return null;
    }
}

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
