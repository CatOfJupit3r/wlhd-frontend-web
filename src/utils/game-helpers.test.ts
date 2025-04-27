import { describe, expect, it } from 'vitest';

import { getCharacterSide, getCharacterSideWithSquare, isDescriptor, splitDescriptor } from './game-helpers';

const ENEMY_LINES = [1, 2, 3];
const ALLY_LINES = [4, 5, 6];
const COLUMNS = [1, 2, 3, 4, 5, 6];

describe('is-descriptor', () => {
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

describe('split-descriptor', () => {
    it('should split descriptor', () => {
        expect(splitDescriptor('builtins:hero')).toEqual(['builtins', 'hero']);
        expect(splitDescriptor('builtins:hero_sword')).toEqual(['builtins', 'hero_sword']);
        expect(splitDescriptor('local:hero_sword')).toEqual(['local', 'hero_sword']);
        expect(splitDescriptor('hero_sword')).toEqual(['builtins', 'hero_sword']);
    });
});

describe('get-character-side-with-square', () => {
    it('should get character side', () => {
        const enemies = COLUMNS.map((column) => ENEMY_LINES.map((line) => `${line}/${column}`)).flat();
        const allies = COLUMNS.map((column) => ALLY_LINES.map((line) => `${line}/${column}`)).flat();

        enemies.forEach((enemy) => {
            expect(getCharacterSideWithSquare(enemy)).toBe('enemy');
        });
        allies.forEach((ally) => {
            expect(getCharacterSideWithSquare(ally)).toBe('ally');
        });
    });
});

describe('get-character-side', () => {
    it('should get character side from number lines', () => {
        ENEMY_LINES.forEach((enemy) => {
            expect(getCharacterSide(enemy)).toBe('enemy');
        });
        ALLY_LINES.forEach((ally) => {
            expect(getCharacterSide(ally)).toBe('ally');
        });
    });

    it('should get character side from string lines', () => {
        ENEMY_LINES.map((enemy) => `${enemy}`).forEach((enemy) => {
            expect(getCharacterSide(`${enemy}`)).toBe('enemy');
        });
        ALLY_LINES.map((ally) => `${ally}`).forEach((ally) => {
            expect(getCharacterSide(`${ally}`)).toBe('ally');
        });
    });

    it('should return null for invalid input', () => {
        [null, undefined, [], {}].forEach((invalid) => {
            expect(getCharacterSide(invalid)).toBe(null);
        });
    });
});
