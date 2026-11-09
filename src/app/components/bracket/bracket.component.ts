import { Component, computed, input } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { Bracket, Match, MatchPosition, SlotIndex } from '../../models/bracket.model';
import { Contestant } from '../../models/contestant.model';
import { getChampion, isBye, isByeMatch, isContestant, roundName } from '../../bracket';

interface SlotView {
	contestant: Contestant | null,
	bye: boolean,
	won: boolean,
	lost: boolean,
	champion: boolean,
}

interface MatchView {
	position: MatchPosition,
	slots: SlotView[],
	current: boolean,
}

interface ColumnView {
	round: number,
	name: string,
	matches: MatchView[],
}

// Draws a whole bracket without changing it. The top half of each round is on the left flowing right,
// the bottom half on the right flowing left, and the final sits in the middle.
@Component({
	selector: 'app-bracket',
	standalone: true,
	imports: [NgTemplateOutlet],
	templateUrl: './bracket.component.html',
	styleUrl: './bracket.component.scss',
	host: {
		// Slots per side in round 1, which sets how tall the bracket is
		'[style.--rows]': 'rows()',
	},
})
export class BracketComponent {
	public bracket = input.required<Bracket>();
	// The match being voted on, highlighted while the tournament is in progress
	public current = input<MatchPosition | null>(null);
	public imageBg = input(false);

	public rows = computed(() => Math.max(2, this.bracket().rounds[0].length));

	public left = computed(() => this.side(0));
	// Reversed so round 1 is on the far right
	public right = computed(() => this.side(1).reverse());

	public final = computed(() => {
		const bracket = this.bracket();
		const round = bracket.rounds.length - 1;
		return {
			name: roundName(bracket, round),
			match: this.matchView(bracket.rounds[round][0], { round, match: 0 }),
		};
	});

	private side(half: SlotIndex): ColumnView[] {
		const bracket = this.bracket();

		return bracket.rounds.slice(0, -1).map((matches, round) => {
			const first = half * matches.length / 2;
			return {
				round,
				name: roundName(bracket, round),
				matches: matches
					.slice(first, first + matches.length / 2)
					.map((match, i) => this.matchView(match, { round, match: first + i })),
			};
		});
	}

	private matchView(match: Match, position: MatchPosition): MatchView {
		const current = this.current();
		const champion = getChampion(this.bracket());
		// A contestant getting past a bye isn't a win worth highlighting
		const decided = match.winner !== null && !isByeMatch(match);

		return {
			position,
			current: current?.round === position.round && current.match === position.match,
			slots: match.slots.map((slot, i) => {
				const contestant = isContestant(slot) ? slot : null;
				return {
					contestant,
					bye: isBye(slot),
					won: decided && match.winner === i,
					lost: decided && match.winner !== i,
					champion: contestant !== null && contestant.name === champion?.name,
				};
			}),
		};
	}
}
