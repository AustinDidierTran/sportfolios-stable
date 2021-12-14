import { applyAllRules } from '../src/server/helper/rankingsRules.js'

// Phase rankings
const phaseRankings = [
    {
        roster_id: '8118b664-0cbe-4698-acd7-a1c1517edfc5',
        current_phase: 'f21ebbb1-e456-4d53-a7c0-25d1eb0b0417',
        ranking_id: '1',
        teamRoster: {
            id: '8118b664-0cbe-4698-acd7-a1c1517edfc5',
            team_id: '40f69779-9976-4c67-849d-72ea3db7136e',
            entitiesGeneralInfos: {
                entity_id: '40f69779-9976-4c67-849d-72ea3db7136e',
                name: 'Les loups',
            },
        },
    },
    {
        roster_id: '8118b664-0cbe-4698-acd7-a1c1517edfc5',
        current_phase: 'f21ebbb1-e456-4d53-a7c0-25d1eb0b0417',
        ranking_id: '2',
        teamRoster: {
            id: '8118b664-0cbe-4698-acd7-a1c1517edfc5',
            team_id: '40f69779-9976-4c67-849d-72ea3db7136e',
            entitiesGeneralInfos: {
                entity_id: '40f69779-9976-4c67-849d-72ea3db7136e',
                name: 'Olivier est une superstar',
            },
        },
    },
    {
        roster_id: '8118b664-0cbe-4698-acd7-a1c1517edfc5',
        current_phase: 'f21ebbb1-e456-4d53-a7c0-25d1eb0b0417',
        ranking_id: '3',
        teamRoster: {
            id: '8118b664-0cbe-4698-acd7-a1c1517edfc5',
            team_id: '40f69779-9976-4c67-849d-72ea3db7136e',
            entitiesGeneralInfos: {
                entity_id: '40f69779-9976-4c67-849d-72ea3db7136e',
                name: 'Didier est cool',
            },
        },
    },
    {
        roster_id: '8118b664-0cbe-4698-acd7-a1c1517edfc5',
        current_phase: 'f21ebbb1-e456-4d53-a7c0-25d1eb0b0417',
        ranking_id: '4',
        teamRoster: {
            id: '8118b664-0cbe-4698-acd7-a1c1517edfc5',
            team_id: '40f69779-9976-4c67-849d-72ea3db7136e',
            entitiesGeneralInfos: {
                entity_id: '40f69779-9976-4c67-849d-72ea3db7136e',
                name: 'Salut Loanne',
            },
        },
    },
];

const scenario1 = [
    // 1 vs 2
    {
        id: '3678b847-e540-4d43-a3d0-d1fa720b6740',
        gameTeams: [
            {
                score: 5,
                ranking_id: '1',
            },
            {
                score: 0,
                ranking_id: '2',
            },
        ],
    },
    // 1 vs 3
    {
        id: '3678b847-e540-4d43-a3d0-d1fa720b6740',
        gameTeams: [
            {
                score: 5,
                ranking_id: '1',
            },
            {
                score: 0,
                ranking_id: '3',
            },
        ],
    },
    // 1 vs 4
    {
        id: '3678b847-e540-4d43-a3d0-d1fa720b6740',
        gameTeams: [
            {
                score: 5,
                ranking_id: '1',
            },
            {
                score: 0,
                ranking_id: '4',
            },
        ],
    },
    // 2 vs 3
    {
        id: '3678b847-e540-4d43-a3d0-d1fa720b6740',
        gameTeams: [
            {
                score: 5,
                ranking_id: '2',
            },
            {
                score: 0,
                ranking_id: '3',
            },
        ],
    },
    // 2 vs 4
    {
        id: '3678b847-e540-4d43-a3d0-d1fa720b6740',
        gameTeams: [
            {
                score: 5,
                ranking_id: '2',
            },
            {
                score: 0,
                ranking_id: '4',
            },
        ],
    },
    // 3 vs 4
    {
        id: '3678b847-e540-4d43-a3d0-d1fa720b6740',
        gameTeams: [
            {
                score: 5,
                ranking_id: '3',
            },
            {
                score: 0,
                ranking_id: '4',
            },
        ],
    },
];

const scenario2 = [
    // 1 vs 2
    {
        id: '3678b847-e540-4d43-a3d0-d1fa720b6740',
        gameTeams: [
            {
                score: 0,
                ranking_id: '1',
            },
            {
                score: 1,
                ranking_id: '2',
            },
        ],
    },
    // 1 vs 3
    {
        id: '3678b847-e540-4d43-a3d0-d1fa720b6740',
        gameTeams: [
            {
                score: 2,
                ranking_id: '1',
            },
            {
                score: 0,
                ranking_id: '3',
            },
        ],
    },
    // 1 vs 4
    {
        id: '3678b847-e540-4d43-a3d0-d1fa720b6740',
        gameTeams: [
            {
                score: 2,
                ranking_id: '1',
            },
            {
                score: 0,
                ranking_id: '4',
            },
        ],
    },
    // 2 vs 3
    {
        id: '3678b847-e540-4d43-a3d0-d1fa720b6740',
        gameTeams: [
            {
                score: 0,
                ranking_id: '2',
            },
            {
                score: 1,
                ranking_id: '3',
            },
        ],
    },
    // 2 vs 4
    {
        id: '3678b847-e540-4d43-a3d0-d1fa720b6740',
        gameTeams: [
            {
                score: 4,
                ranking_id: '2',
            },
            {
                score: 0,
                ranking_id: '4',
            },
        ],
    },
    // 3 vs 4
    {
        id: '3678b847-e540-4d43-a3d0-d1fa720b6740',
        gameTeams: [
            {
                score: 6,
                ranking_id: '3',
            },
            {
                score: 0,
                ranking_id: '4',
            },
        ],
    },
];

const scenario3 = [
    // 1 vs 2
    {
        id: '3678b847-e540-4d43-a3d0-d1fa720b6740',
        gameTeams: [
            {
                score: 1,
                ranking_id: '1',
            },
            {
                score: 0,
                ranking_id: '2',
            },
        ],
    },
    // 1 vs 3
    {
        id: '3678b847-e540-4d43-a3d0-d1fa720b6740',
        gameTeams: [
            {
                score: 0,
                ranking_id: '1',
            },
            {
                score: 1,
                ranking_id: '3',
            },
        ],
    },
    // 1 vs 4
    {
        id: '3678b847-e540-4d43-a3d0-d1fa720b6740',
        gameTeams: [
            {
                score: 5,
                ranking_id: '1',
            },
            {
                score: 0,
                ranking_id: '4',
            },
        ],
    },
    // 2 vs 3
    {
        id: '3678b847-e540-4d43-a3d0-d1fa720b6740',
        gameTeams: [
            {
                score: 1,
                ranking_id: '2',
            },
            {
                score: 0,
                ranking_id: '3',
            },
        ],
    },
    // 2 vs 4
    {
        id: '3678b847-e540-4d43-a3d0-d1fa720b6740',
        gameTeams: [
            {
                score: 4,
                ranking_id: '2',
            },
            {
                score: 0,
                ranking_id: '4',
            },
        ],
    },
    // 3 vs 4
    {
        id: '3678b847-e540-4d43-a3d0-d1fa720b6740',
        gameTeams: [
            {
                score: 3,
                ranking_id: '3',
            },
            {
                score: 0,
                ranking_id: '4',
            },
        ],
    },
];

describe('ValidateApplyRules', () => {
    /**
     * Expected output:
     * 1: 3 wins, 0 loses, 15 points for, 0 against
     * 2: 2 wins, 1 loses, 10 points for, 5 against
     * 3: 1 wins, 2 loses, 5 points for, 10 against
     * 4: 0 win, 3 loses, 0 points for, 15 against
     */
    it('Scenario1', () => {
        const result = applyAllRules(scenario1, phaseRankings);
        expect([result[0].wins, result[0].loses, result[0].pointFor, result[0].pointAgainst]).toEqual(expect.arrayContaining([3, 0, 15, 0]));
        expect([result[1].wins, result[1].loses, result[1].pointFor, result[1].pointAgainst]).toEqual(expect.arrayContaining([2, 1, 10, 5]));
        expect([result[2].wins, result[2].loses, result[2].pointFor, result[2].pointAgainst]).toEqual(expect.arrayContaining([1, 2, 5, 10]));
        expect([result[3].wins, result[3].loses, result[3].pointFor, result[3].pointAgainst]).toEqual(expect.arrayContaining([0, 3, 0, 15]));
    });

    /**
     * Expected output:
     * 1: 2 wins, 1 loses, 4 points for, 1 against
     * 2: 2 wins, 1 loses, 5 points for, 1 against
     * 3: 2 wins, 1 loses, 7 points for, 2 against
     * 4: 0 win, 3 loses, 0 points for, 12 against
     */
    it('Scenario2', () => {
        const result = applyAllRules(scenario2, phaseRankings);
        expect([result[0].wins, result[0].loses, result[0].pointFor, result[0].pointAgainst]).toEqual(expect.arrayContaining([2, 1, 4, 1]));
        expect([result[1].wins, result[1].loses, result[1].pointFor, result[1].pointAgainst]).toEqual(expect.arrayContaining([2, 1, 5, 1]));
        expect([result[2].wins, result[2].loses, result[2].pointFor, result[2].pointAgainst]).toEqual(expect.arrayContaining([2, 1, 7, 2]));
        expect([result[3].wins, result[3].loses, result[3].pointFor, result[3].pointAgainst]).toEqual(expect.arrayContaining([0, 3, 0, 12]));
    });

    /**
     * Expected output:
     * 1: 2 wins, 1 loses, 6 points for, 1 against
     * 2: 2 wins, 1 loses, 5 points for, 1 against
     * 3: 2 wins, 1 loses, 4 points for, 1 against
     * 4: 0 win, 3 loses, 0 points for, 12 against
     */
    it('Scenario3', () => {
        const result = applyAllRules(scenario3, phaseRankings);
        expect([result[0].wins, result[0].loses, result[0].pointFor, result[0].pointAgainst]).toEqual(expect.arrayContaining([2, 1, 6, 1]));
        expect([result[1].wins, result[1].loses, result[1].pointFor, result[1].pointAgainst]).toEqual(expect.arrayContaining([2, 1, 5, 1]));
        expect([result[2].wins, result[2].loses, result[2].pointFor, result[2].pointAgainst]).toEqual(expect.arrayContaining([2, 1, 4, 1]));
        expect([result[3].wins, result[3].loses, result[3].pointFor, result[3].pointAgainst]).toEqual(expect.arrayContaining([0, 3, 0, 12]));
    });
})
