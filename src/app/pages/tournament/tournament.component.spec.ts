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

	// Votes for the left contestant and moves on
	const pickLeft = () => {
		(el.querySelector('app-contestant img') as HTMLElement).click();
		fixture.detectChanges();
		(el.querySelector('app-button') as HTMLElement).click();
		fixture.detectChanges();
	};

	return { service, el, text, texts, pickLeft };
}

describe('TournamentComponent', () => {
	for (const count of [5, 24, 40, 64]) {
		it(`shows the round, match progress, seeds and next match through a ${count}-contestant playthrough`, () => {
			const contestants = makeContestants(count, 4);
			const { service, el, text, texts, pickLeft } = render(contestants);
			const bracket = () => service.bracket()!;

			// Round names by the slots in the round, from the full bracket size down
			const names: string[] = [];
			for (let slots = bracket().rounds[0].length * 2; slots >= 2; slots /= 2) {
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

				const seeds = current.map(name => contestants.find(c => c.name === name)!.seed).filter(s => s !== undefined).map(String);
				expect(texts('app-contestant .seed-badge')).toEqual(seeds);

				const isFinal = round === bracket().rounds.length - 1;
				expect(el.querySelector('.up-next') === null).toBe(isFinal);

				preview = texts('.up-next .name').map(name => name === 'Winner of this match' ? current[0] : name);
				pickLeft();
			}

			expect(text('.h1')).toBe('Winner!');
		});
	}

	it('names the round the next match starts, and only when it changes', () => {
		const { text, pickLeft } = render(makeContestants(8));

		expect(text('.up-next .label')).toBe('Up next');
		pickLeft();
		pickLeft();
		pickLeft();
		expect(text('.up-next .label')).toBe('Up next · Semifinals');
	});
});
