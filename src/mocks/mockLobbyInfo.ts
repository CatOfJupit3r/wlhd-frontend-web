import { iLobbyInformation } from '@models/Redux';

export const mockLobbyInfo: iLobbyInformation = {
    lobbyId: '123456',
    name: "Dragon's Lair Adventure",
    combats: [
        {
            _id: 'combat1',
            nickname: 'Battle at the Gates',
            isActive: true,
            roundCount: 3,
            activePlayers: [
                { username: 'player1', nickname: 'Thorin' },
                { username: 'player2', nickname: 'Legolas' },
                { username: 'player3', nickname: 'Gimli' },
            ],
        },
        {
            _id: 'combat2',
            nickname: 'Dungeon Crawl',
            isActive: false,
            roundCount: 1,
            activePlayers: [
                { username: 'player4', nickname: 'Gandalf' },
                { username: 'player5', nickname: 'Frodo' },
            ],
        },
    ],
    characters: [
        {
            descriptor: 'Dwarf Warrior',
            decorations: {
                name: 'Axe of the Mountain King',
                description: 'A mighty axe passed down through generations of dwarven kings',
                sprite: 'axe_sprite.png',
            },
        },
        {
            descriptor: 'Elven Archer',
            decorations: {
                name: 'Bow of the Woodland Realm',
                description: 'A finely crafted bow imbued with elven magic',
                sprite: 'bow_sprite.png',
            },
        },
        {
            descriptor: 'Human Wizard',
            decorations: {
                name: 'Staff of the Wise',
                description: 'An ancient staff crackling with arcane energy',
                sprite: 'staff_sprite.png',
            },
        },
    ],
    gm: 'Dungeon Master',
    players: [
        {
            username: 'player1',
            nickname: 'Thorin',
            userId: 'user1',
            characters: [['coordinator:hero', 'builtins:characters.hero.name']],
        },
        {
            username: 'player2',
            nickname: 'Legolas',
            userId: 'user2',
            characters: [],
        },
        {
            username: 'player5',
            nickname: 'Frodo',
            userId: 'user5',
            characters: [],
        },
    ],
    waitingApproval: [
        {
            username: 'player4',
            userId: 'user4',
        },
        {
            username: 'player3',
            userId: 'user3',
        },
    ],
    layout: 'gm',
};
