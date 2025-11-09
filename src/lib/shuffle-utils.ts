/**
 * Deterministic shuffling utilities to avoid hydration mismatches
 */

/**
 * Simple LCG (Linear Congruential Generator) for deterministic random numbers
 * Based on parameters from Numerical Recipes
 */
class SeededRandom {
    private seed: number;

    constructor(seed: number) {
        this.seed = seed;
    }

    next(): number {
        this.seed = (this.seed * 1664525 + 1013904223) % 4294967296;
        return this.seed / 4294967296;
    }
}

/**
 * Generate a deterministic seed from a string
 */
function hashCode(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
}

/**
 * Fisher-Yates shuffle with deterministic seeding
 * This ensures the same input always produces the same shuffled output
 */
export function deterministicShuffle<T>(array: T[], seed: string): T[] {
    const shuffled = [...array];
    const rng = new SeededRandom(hashCode(seed));

    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(rng.next() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    return shuffled;
}

/**
 * Regular Fisher-Yates shuffle for client-side only use
 */
export function clientSideShuffle<T>(array: T[]): T[] {
    const shuffled = [...array];

    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    return shuffled;
}