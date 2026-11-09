import { TestBed } from '@angular/core/testing';
import { BracketComponent } from './bracket.component';
import { bracketSize, createBracket, getChampion, getMatch, getNextMatch, pickWinner } from '../../bracket';
import { Bracket, MatchPosition } from '../../models/bracket.model';
import { Contestant } from '../../models/contestant.model';

function makeContestants(count: number, seeds: number = 0): Contestant[] {
	return Array.from({ length: count }, (_, i) => ({
		name: `Contestant ${i + 1}`,
		thumbnailUrl: `${i + 1}.png`,
		...(i < seeds ? { seed: i + 1 } : {}),
	}));
}

function render(bracket: Bracket, current: MatchPosition | null = null): HTMLElement {
	const fixture = TestBed.createComponent(BracketComponent);
	fixture.componentRef.setInput('bracket', bracket);
	fixture.componentRef.setInput('current', current);
	fixture.detectChanges();
	return fixture.nativeElement;
}

function playAll(bracket: Bracket) {
	for (let position = getNextMatch(bracket); position; position = getNextMatch(bracket)) {
		pickWinner(bracket, position, 0);
	}
}

const texts = (el: HTMLElement, selector: string) => [...el.querySelectorAll(selector)].map(e => e.textContent!.trim());

describe('BracketComponent', () => {
	for (const count of [2, 5, 24, 40, 64]) {
		it(`draws every match, slot and bye for ${count} contestants`, () => {
			const size = bracketSize(count);
			const el = render(createBracket(makeContestants(count, Math.min(count, 4)), true));

			expect(el.querySelectorAll('.match')).toHaveLength(size - 1);
			expect(el.querySelectorAll('.slot')).toHaveLength((size - 1) * 2);
			expect(el.querySelectorAll('.slot.bye')).toHaveLength(size - count);
			expect(texts(el, '.slot.bye .name').every(t => t === 'BYE')).toBe(true);
			expect(el.querySelectorAll('.column')).toHaveLength(2 * Math.log2(size) - 1);

			// Round 1 holds every contestant exactly once
			const firstRound = [...el.querySelectorAll('.side:not(.right) .column:first-child .name, .right .column:last-child .name')]
				.map(n => n.textContent!.trim())
				.filter(n => n !== 'BYE');
			const expectedFirstRound = size === 2 ? [] : makeContestants(count).map(c => c.name);
			expect(firstRound.sort()).toEqual(expectedFirstRound.sort());
		});
	}

	it('names rounds like the play screen, mirrored either side of the final', () => {
		const el = render(createBracket(makeContestants(40)));

		expect(texts(el, '.round-name')).toEqual([
			'Round of 64', 'Round of 32', 'Round of 16', 'Quarterfinals', 'Semifinals',
			'Final',
			'Semifinals', 'Quarterfinals', 'Round of 16', 'Round of 32', 'Round of 64',
		]);
	});

	it('shows seed badges only for seeded contestants', () => {
		const el = render(createBracket(makeContestants(8, 3)));
		expect(texts(el, '.seed').sort()).toEqual(['1', '2', '3']);
	});

	it('highlights the current match', () => {
		const bracket = createBracket(makeContestants(6));
		const current = getNextMatch(bracket)!;
		const el = render(bracket, current);

		const highlighted = el.querySelectorAll('.match.current');
		expect(highlighted).toHaveLength(1);
		const [a, b] = getMatch(bracket, current).slots as Contestant[];
		expect(texts(highlighted[0] as HTMLElement, '.name')).toEqual([a.name, b.name]);
	});

	it('marks winners and losers, but not byes, and the champion in gold', () => {
		const bracket = createBracket(makeContestants(5));
		playAll(bracket);
		const el = render(bracket);

		// 5 contestants: 4 votes, each with one winner and one loser
		expect(el.querySelectorAll('.slot.won')).toHaveLength(4);
		expect(el.querySelectorAll('.slot.lost')).toHaveLength(4);
		expect(el.querySelectorAll('.slot.bye.won, .slot.bye.lost')).toHaveLength(0);
		expect(texts(el, '.final .slot.champion .name')).toEqual([getChampion(bracket)!.name]);
	});

	it("doesn't change the bracket", () => {
		const bracket = createBracket(makeContestants(24, 4), true);
		pickWinner(bracket, getNextMatch(bracket)!, 1);
		const before = structuredClone(bracket);

		render(bracket, getNextMatch(bracket));
		expect(bracket).toEqual(before);
	});
});
