import { Bracket, BracketSlot, BYE, Match, MatchPosition, SlotIndex } from './models/bracket.model';
import { Contestant } from './models/contestant.model';
import Utils from './utils';

const utils = new Utils();

// Standard bracket order for `size` slots (a power of 2), as seed ranks.
// Rank r meets rank size + 1 - r in round 1, ranks 1 and 2 are in opposite halves, 1-4 in separate quarters, etc.
export function seedOrder(size: number): number[] {
	let order = [1];
	while (order.length < size) {
		const pairTotal = order.length * 2 + 1;
		order = order.flatMap(rank => [rank, pairTotal - rank]);
	}
	return order;
}

// The next power of 2 at or above the contestant count
export function bracketSize(contestantCount: number): number {
	return 2 ** Math.ceil(Math.log2(contestantCount));
}

// Builds a bracket padded with byes up to the next power of 2.
// Seeded contestants take the top ranks in seed order, unseeded contestants fill the rest (shuffled if `shuffle`).
// Byes take the bottom ranks, so they're paired with the top seeds first and never with each other.
export function createBracket(contestants: Contestant[], shuffle: boolean = false): Bracket {
	if (contestants.length < 2) {
		throw new Error('A bracket needs at least 2 contestants');
	}

	const size = bracketSize(contestants.length);

	const seeded = contestants
		.filter(c => c.seed !== undefined)
		.sort((a, b) => a.seed! - b.seed!);
	const unseeded = contestants.filter(c => c.seed === undefined);
	const ranked = [...seeded, ...(shuffle ? utils.shuffleArray(unseeded) : unseeded)];

	const slots: BracketSlot[] = seedOrder(size).map(rank => ranked[rank - 1] ?? BYE);

	const rounds: Match[][] = [];
	for (let matches = size / 2; matches >= 1; matches /= 2) {
		rounds.push(Array.from({ length: matches }, () => ({ slots: [null, null], winner: null })));
	}

	const bracket: Bracket = { rounds };

	rounds[0].forEach((match, m) => {
		match.slots = [slots[m * 2], slots[m * 2 + 1]];

		// Contestants facing a bye advance straight away
		if (match.slots[0] === BYE) match.winner = 1;
		if (match.slots[1] === BYE) match.winner = 0;
		if (match.winner !== null) advance(bracket, { round: 0, match: m });
	});

	return bracket;
}

export function isBye(slot: BracketSlot): slot is typeof BYE {
	return slot === BYE;
}

export function isContestant(slot: BracketSlot): slot is Contestant {
	return slot !== null && !isBye(slot);
}

export function isByeMatch(match: Match): boolean {
	return isBye(match.slots[0]) || isBye(match.slots[1]);
}

// Round-1 contestants in bracket order, without byes
export function getDraw(bracket: Bracket): Contestant[] {
	return bracket.rounds[0].flatMap(match => match.slots).filter(isContestant);
}

// Whether a bracket was drawn from exactly these contestants, so a saved bracket can be thrown away once the data changes
export function isDrawnFrom(bracket: Bracket, contestants: Contestant[]): boolean {
	const key = (c: Contestant) => JSON.stringify(c, Object.keys(c).sort());
	const drawn = getDraw(bracket).map(key).sort();
	const current = contestants.map(key).sort();

	return drawn.length === current.length && drawn.every((k, i) => k === current[i]);
}

export function getMatch(bracket: Bracket, position: MatchPosition): Match {
	return bracket.rounds[position.round][position.match];
}

export function getMatchWinner(match: Match): Contestant | null {
	if (match.winner === null) return null;

	const slot = match.slots[match.winner];
	return isContestant(slot) ? slot : null;
}

// The next match to vote on, in round order. Bye matches are decided when the bracket is created, so they're never returned.
export function getNextMatch(bracket: Bracket): MatchPosition | null {
	for (let round = 0; round < bracket.rounds.length; round++) {
		const match = bracket.rounds[round].findIndex(m => m.winner === null);
		if (match !== -1) return { round, match };
	}
	return null;
}

export function getChampion(bracket: Bracket): Contestant | null {
	const final = bracket.rounds[bracket.rounds.length - 1][0];
	return getMatchWinner(final);
}

export function pickWinner(bracket: Bracket, position: MatchPosition, winner: SlotIndex): void {
	const match = getMatch(bracket, position);
	const [a, b] = match.slots;

	if (a === null || b === null || isBye(a) || isBye(b)) {
		throw new Error(`Round ${position.round + 1} match ${position.match + 1} isn't ready to be played`);
	}

	match.winner = winner;
	advance(bracket, position);
}

function advance(bracket: Bracket, position: MatchPosition): void {
	const nextRound = bracket.rounds[position.round + 1];
	if (!nextRound) return;

	const winner = getMatchWinner(getMatch(bracket, position));
	nextRound[Math.floor(position.match / 2)].slots[position.match % 2] = winner;
}
