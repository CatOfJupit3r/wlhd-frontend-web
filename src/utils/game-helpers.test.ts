import { isDescriptor, splitDescriptor } from '@utils/game-helpers';
import { describe, expect, it } from 'vitest';

describe('descriptorTools', () => {
    it('should split descriptor', () => {
        expect(splitDescriptor('builtins:hero')).toEqual(['builtins', 'hero']);
        expect(splitDescriptor('builtins:hero_sword')).toEqual(['builtins', 'hero_sword']);
        expect(splitDescriptor('local:hero_sword')).toEqual(['local', 'hero_sword']);
        expect(splitDescriptor('hero_sword')).toEqual(['builtins', 'hero_sword']);
    });

    it('should detect descriptor', () => {
        expect(isDescriptor('builtins:hero')).toBe(true);
        expect(isDescriptor('builtins:hero_sword')).toBe(true);
        expect(isDescriptor('local:hero_sword')).toBe(true);
        expect(isDescriptor('hero_sword')).toBe(false);
        expect(isDescriptor(undefined)).toBe(false);
        expect(isDescriptor(null)).toBe(false);
        expect(isDescriptor('')).toBe(false);
        expect(isDescriptor('builtins:')).toBe(false);
        expect(isDescriptor('builtins:hero:')).toBe(false);
        expect(isDescriptor('builtins:hero_sword:')).toBe(false);
    });
});
