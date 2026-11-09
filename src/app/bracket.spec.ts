import { bracketSize, createBracket, getChampion, getDraw, getMatch, getMatchWinner, getNextMatch, isBye, isByeMatch, isDrawnFrom, pickWinner, seedOrder } from './bracket';
import { Bracket, SlotIndex } from './models/bracket.model';
import { Contestant } from './models/contestant.model';

function makeContestants(count: number, seeds: number = 0): Contestant[] {
	return Array.from({ length: count }, (_, i) => ({
		name: `Contestant ${i + 1}`,
		thumbnailUrl: `${i + 1}.png`,
		...(i < seeds ? { seed: i + 1 } : {}),
	}));
}

// Plays every match, returning the matches that were put to a vote
function playThrough(bracket: Bracket, choose: (a: Contestant, b: Contestant) => SlotIndex = () => (Math.random() < 0.5 ? 0 : 1)) {
	const played: { round: number, a: Contestant, b: Contestant }[] = [];

	for (let position = getNextMatch(bracket); position; position = getNextMatch(bracket)) {
		const match = getMatch(bracket, position);
		expect(isByeMatch(match), 'a bye match was put to a vote').toBe(false);

		const [a, b] = match.slots as [Contestant, Contestant];
		played.push({ round: position.round, a, b });
		pickWinner(bracket, position, choose(a, b));
	}

	return played;
}

// Index of a seed's slot in the first round
function slotOf(bracket: Bracket, seed: number): number {
	return bracket.rounds[0]
		.flatMap(m => m.slots)
		.findIndex(s => s !== null && !isBye(s) && s.seed === seed);
}

const SIZES = [2, 3, 5, 24, 40, 64];

describe('seedOrder', () => {
	it('builds the standard bracket order', () => {
		expect(seedOrder(2)).toEqual([1, 2]);
		expect(seedOrder(4)).toEqual([1, 4, 2, 3]);
		expect(seedOrder(8)).toEqual([1, 8, 4, 5, 2, 7, 3, 6]);
	});
});

describe('createBracket', () => {
	it('rejects fewer than 2 contestants', () => {
		expect(() => createBracket(makeContestants(1))).toThrow();
	});

	for (const count of SIZES) {
		it(`plays ${count} contestants through to a single winner`, () => {
			const contestants = makeContestants(count);
			const bracket = createBracket(contestants, true);
			const played = playThrough(bracket);

			// Every real contestant is eliminated once, except the winner
			expect(played.length).toBe(count - 1);
			expect(contestants).toContain(getChampion(bracket));
			expect(getNextMatch(bracket)).toBeNull();
		});

		it(`places every one of ${count} contestants once, with no bye-vs-bye matches`, () => {
			const contestants = makeContestants(count, Math.floor(count / 3));
			const bracket = createBracket(contestants, true);
			const size = bracketSize(count);
			const firstRound = bracket.rounds[0];

			expect(firstRound.length * 2).toBe(size);
			expect(firstRound.filter(m => isBye(m.slots[0]) && isBye(m.slots[1]))).toEqual([]);

			const placed = firstRound.flatMap(m => m.slots).filter(s => !isBye(s));
			expect(new Set(placed)).toEqual(new Set(contestants));
		});
	}

	it('gives 40 contestants 24 byes, 8 real first-round matches, then a full round of 32', () => {
		const bracket = createBracket(makeContestants(40));
		const firstRound = bracket.rounds[0];

		expect(firstRound.length).toBe(32);
		expect(firstRound.filter(isByeMatch).length).toBe(24);
		expect(firstRound.filter(m => !isByeMatch(m)).length).toBe(8);

		playThrough(bracket, () => 0);
		const secondRound = bracket.rounds[1];
		expect(secondRound.length * 2).toBe(32);
		expect(secondRound.every(m => !isByeMatch(m))).toBe(true);
	});

	it('advances contestants facing a bye without a vote', () => {
		const bracket = createBracket(makeContestants(5));
		const byeMatches = bracket.rounds[0].filter(isByeMatch);

		expect(byeMatches.length).toBe(3);
		for (const match of byeMatches) {
			expect(getMatchWinner(match)).not.toBeNull();
		}
	});

	it('gives byes to seeds in order before any unseeded contestant', () => {
		// 24 contestants in a bracket of 32 means 8 byes
		for (const seeds of [0, 3, 8, 12]) {
			const bracket = createBracket(makeContestants(24, seeds), true);
			const byeRecipients = bracket.rounds[0]
				.filter(isByeMatch)
				.map(m => getMatchWinner(m)!);

			expect(byeRecipients.length).toBe(8);

			const seededRecipients = byeRecipients.filter(c => c.seed !== undefined).map(c => c.seed!).sort((a, b) => a - b);
			const expected = Array.from({ length: Math.min(seeds, 8) }, (_, i) => i + 1);
			expect(seededRecipients, `${seeds} seeds`).toEqual(expected);
		}
	});

	for (const count of SIZES.filter(c => c >= 4)) {
		it(`keeps seeds 1-2 in opposite halves and 1-4 in separate quarters (${count} contestants)`, () => {
			for (let run = 0; run < 20; run++) {
				const bracket = createBracket(makeContestants(count, 4), true);
				const size = bracket.rounds[0].length * 2;
				const half = (seed: number) => Math.floor(slotOf(bracket, seed) / (size / 2));
				const quarter = (seed: number) => Math.floor(slotOf(bracket, seed) / (size / 4));

				expect(half(1)).not.toBe(half(2));
				expect(new Set([1, 2, 3, 4].map(quarter)).size).toBe(4);
			}
		});

		it(`only lets seeds 1-4 meet in the semifinals and 1-2 in the final (${count} contestants)`, () => {
			const bracket = createBracket(makeContestants(count, 4));
			const rank = (c: Contestant) => c.seed ?? Infinity;

			// The better seed always wins, so the top seeds reach the semifinals
			const played = playThrough(bracket, (a, b) => (rank(a) <= rank(b) ? 0 : 1));
			const finalRound = bracket.rounds.length - 1;

			for (const { round, a, b } of played) {
				const seeds = [a.seed, b.seed];
				if (seeds.every(s => s !== undefined && s <= 4)) {
					expect(round, `seeds ${seeds} met early`).toBeGreaterThanOrEqual(finalRound - 1);
				}
			}

			const final = played.find(p => p.round === finalRound)!;
			expect([final.a.seed, final.b.seed].sort((a, b) => a! - b!)).toEqual([1, 2]);
			expect(getChampion(bracket)!.seed).toBe(1);
		});
	}

	it('keeps unseeded contestants in data order when shuffle is off', () => {
		const contestants = makeContestants(4);
		const bracket = createBracket(contestants, false);
		const names = bracket.rounds[0].flatMap(m => m.slots).map(s => (s as Contestant).name);

		// Ranks follow data order, placed in standard order [1, 4, 2, 3]
		expect(names).toEqual(['Contestant 1', 'Contestant 4', 'Contestant 2', 'Contestant 3']);
	});
});

describe('pickWinner', () => {
	it('refuses a match that is still waiting on an earlier one', () => {
		const bracket = createBracket(makeContestants(4));
		expect(() => pickWinner(bracket, { round: 1, match: 0 }, 0)).toThrow();
	});
});

describe('getDraw', () => {
	it('lists round-1 contestants in bracket order, without byes', () => {
		const bracket = createBracket(makeContestants(3), false);

		// Ranks [1, 4, 2, 3], with rank 4 a bye
		expect(getDraw(bracket).map(c => c.name)).toEqual(['Contestant 1', 'Contestant 2', 'Contestant 3']);
	});
});

describe('isDrawnFrom', () => {
	it('matches the contestants a bracket was drawn from, in any order and after a save', () => {
		const contestants = makeContestants(5, 2);
		const saved: Bracket = JSON.parse(JSON.stringify(createBracket(contestants, true)));

		expect(isDrawnFrom(saved, [...contestants].reverse())).toBe(true);
	});

	it('ignores the order of fields', () => {
		const contestants = makeContestants(4);
		const bracket = createBracket(contestants);
		const reordered = contestants.map(({ name, thumbnailUrl }) => ({ thumbnailUrl, name }));

		expect(isDrawnFrom(bracket, reordered)).toBe(true);
	});

	it('rejects added, removed or changed contestants', () => {
		const contestants = makeContestants(4);
		const bracket = createBracket(contestants);

		expect(isDrawnFrom(bracket, makeContestants(5))).toBe(false);
		expect(isDrawnFrom(bracket, makeContestants(3))).toBe(false);
		expect(isDrawnFrom(bracket, contestants.map((c, i) => i === 0 ? { ...c, name: 'Renamed' } : c))).toBe(false);
		expect(isDrawnFrom(bracket, contestants.map((c, i) => i === 0 ? { ...c, seed: 1 } : c))).toBe(false);
	});
});
