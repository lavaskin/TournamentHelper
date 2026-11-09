import { Injectable, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { TournamentComponent } from './tournament.component';
import { TournamentService } from '../../services/tournament.service';
import { createBracket, getNextMatch, isByeMatch, pickWinner } from '../../bracket';
import { Bracket, MatchPosition, SlotIndex } from '../../models/bracket.model';
import { Contestant } from '../../models/contestant.model';
import { Tournament } from '../../models/tournament.model';

function makeContestants(count: number, seeds: number = 0): Contestant[] {
	return Array.from({ length: count }, (_, i) => ({
		name: `Contestant ${i + 1}`,
		thumbnailUrl: `${i + 1}.png`,
		...(i < seeds ? { seed: i + 1 } : {}),
	}));
}

// Stands in for the service so any bracket can be played, seeds included
@Injectable()
class FakeTournamentService {
	public tournament = signal<Tournament | null>(null);
	public bracket = signal<Bracket | null>(null);

	public pickWinner(position: MatchPosition, winner: SlotIndex): void {
		const bracket = structuredClone(this.bracket()!);
		pickWinner(bracket, position, winner);
		this.bracket.set(bracket);
	}
}

function render(contestants: Contestant[]) {
	TestBed.configureTestingModule({
		providers: [provideRouter([]), { provide: TournamentService, useClass: FakeTournamentService }],
	});

	const service = TestBed.inject(TournamentService) as unknown as FakeTournamentService;
	service.tournament.set({ slug: 'test', title: 'Test', contestants, thumbnailPath: 'test' });
	service.bracket.set(createBracket(contestants, true));

	const fixture = TestBed.createComponent(TournamentComponent);
	fixture.detectChanges();
	const el: HTMLElement = fixture.nativeElement;

	const text = (selector: string) => el.querySelector(selector)?.textContent!.trim().replace(/\s+/g, ' ') ?? null;
	const texts = (selector: string) => [...el.querySelectorAll(selector)].map(e => e.textContent!.trim());

	// Votes for the contestant on that side and moves on
	const pick = (side: SlotIndex) => {
		(el.querySelectorAll('app-contestant img')[side] as HTMLElement).click();
		fixture.detectChanges();
		(el.querySelector('app-button') as HTMLElement).click();
		fixture.detectChanges();
	};

	// The seed badges expected for these names, in order
	const seedsOf = (names: string[]) => names
		.map(name => contestants.find(c => c.name === name)?.seed)
		.filter(seed => seed !== undefined)
		.map(String);

	return { service, el, text, texts, pick, seedsOf };
}

describe('TournamentComponent', () => {
	for (const count of [5, 24, 40, 64]) {
		it(`shows the round, match progress, seeds and next match through a ${count}-contestant playthrough`, () => {
			const { service, el, text, texts, pick, seedsOf } = render(makeContestants(count, 4));
			const bracket = () => service.bracket()!;

			// Round names by the slots in the round, from the next power of 2 down (40 contestants start in the Round of 64)
			const names: string[] = [];
			for (let slots = 2 ** Math.ceil(Math.log2(count)); slots >= 2; slots /= 2) {
				names.push({ 8: 'Quarterfinals', 4: 'Semifinals', 2: 'Final' }[slots] ?? `Round of ${slots}`);
			}

			let round = -1;
			let number = 0;
			let preview: string[] | null = null;

			for (let position = getNextMatch(bracket()); position; position = getNextMatch(bracket())) {
				const current = texts('app-contestant .name');

				// The last preview was this match, with the last winner in place of "Winner of this match"
				if (preview) expect(current).toEqual(preview);

				number = position.round === round ? number + 1 : 1;
				round = position.round;
				const real = bracket().rounds[round].filter(m => !isByeMatch(m)).length;

				expect(text('.round-name')).toBe(names[round]);
				expect(text('.match-progress')).toBe(real > 1 ? `Match ${number} of ${real}` : null);
				expect(el.textContent).not.toMatch(/Quarters|Semi's|Finals|Round \d/);

				expect(texts('app-contestant .seed-badge')).toEqual(seedsOf(current));

				const isFinal = round === bracket().rounds.length - 1;
				expect(el.querySelector('.up-next') === null).toBe(isFinal);

				const upNext = texts('.up-next .name');
				expect(texts('.up-next .seed-badge')).toEqual(seedsOf(upNext));

				const side: SlotIndex = Math.random() < 0.5 ? 0 : 1;
				preview = upNext.map(name => name === 'Winner of this match' ? current[side] : name);
				pick(side);
			}

			expect(text('.h1')).toBe('Winner!');
			expect(texts('app-contestant .seed-badge')).toEqual(seedsOf(texts('app-contestant .name')));
		});
	}

	it('names the round the next match starts, and only when it changes', () => {
		const { text, pick } = render(makeContestants(8));

		expect(text('.up-next .label')).toBe('Up next');
		pick(0);
		pick(0);
		pick(0);
		expect(text('.up-next .label')).toBe('Up next · Semifinals');
	});

	it('shows the seed badge on the winner screen', () => {
		const { text, texts, pick } = render(makeContestants(2, 2));

		pick(0);
		expect(text('.h1')).toBe('Winner!');
		expect(texts('app-contestant .seed-badge')).toEqual(['1']);
	});
});
