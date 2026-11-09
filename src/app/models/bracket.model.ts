import { Contestant } from "./contestant.model";

export const BYE = 'bye';

// A contestant, a bye, or null while waiting on the winner of an earlier match
export type BracketSlot = Contestant | typeof BYE | null;

export interface Match {
	slots: [BracketSlot, BracketSlot],
	// Index of the winning slot, or null if the match hasn't been decided
	winner: 0 | 1 | null,
}

export interface Bracket {
	// rounds[0] is the first round, the last round is the final (a single match).
	// Match m of a round feeds slot m % 2 of match floor(m / 2) in the next round.
	rounds: Match[][],
}

export interface MatchPosition {
	round: number,
	match: number,
}
