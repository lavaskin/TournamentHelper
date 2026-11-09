import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import tournaments from '../../data/tournaments.data';
import { routes } from '../../app.routes';
import { getDraw, getNextMatch } from '../../bracket';
import { TournamentService } from '../../services/tournament.service';

const tournament = tournaments.find(t => t.contestants.length >= 8)!;

async function open() {
	const harness = await RouterTestingHarness.create();
	await harness.navigateByUrl(`/t/${tournament.slug}`);

	const el = harness.routeNativeElement!;
	const service = TestBed.inject(TournamentService);
	const button = () => el.querySelector('app-button')!.textContent!.trim();
	const outlined = () => el.querySelectorAll('app-bracket .match.current');
	const firstRound = () => [...el.querySelectorAll('app-bracket .side:not(.right) .column:first-child .slot:not(.bye) .name')].map(n => n.textContent!.trim());
	return { harness, el, service, button, outlined, firstRound };
}

function playAll(service: TournamentService) {
	for (let position = getNextMatch(service.bracket()!); position; position = getNextMatch(service.bracket()!)) {
		service.pickWinner(position, 0);
	}
}

describe('ContestantsComponent', () => {
	beforeEach(() => {
		localStorage.clear();
		TestBed.configureTestingModule({ providers: [provideRouter(routes)] });
	});

	it('shows the draw and the contestant count before the tournament starts', async () => {
		const { el, service, button, outlined } = await open();

		expect(el.querySelector('.h1')!.textContent).toContain(`(${tournament.contestants.length})`);
		expect(el.querySelectorAll('app-bracket .match')).toHaveLength(service.bracket()!.rounds.flat().length);
		expect(button()).toBe('Start the Tournament');
		expect(outlined()).toHaveLength(0);
	});

	it('shows picks so far and outlines the next match while in progress', async () => {
		const { harness, service, button, outlined, el } = await open();
		service.pickWinner(getNextMatch(service.bracket()!)!, 0);
		harness.detectChanges();

		expect(button()).toBe('Resume');
		expect(el.querySelectorAll('app-bracket .slot.won')).toHaveLength(1);
		expect(outlined()).toHaveLength(1);
	});

	it('offers the results once finished', async () => {
		const { harness, service, button, outlined, el } = await open();
		playAll(service);
		harness.detectChanges();

		expect(button()).toBe('View results');
		expect(outlined()).toHaveLength(0);
		expect(el.querySelectorAll('app-bracket .final .slot.champion')).toHaveLength(1);
	});

	it('links the button to the play page', async () => {
		const { harness, el } = await open();
		(el.querySelector('app-button') as HTMLElement).click();
		await harness.fixture.whenStable();

		expect(TestBed.inject(TournamentService).tournament()).toBe(tournament);
		expect(harness.routeNativeElement!.tagName.toLowerCase()).toBe('page-tournament');
	});

	it('redraws in place on restart', async () => {
		const { harness, service, firstRound, button } = await open();
		service.pickWinner(getNextMatch(service.bracket()!)!, 0);
		harness.detectChanges();

		service.restart();
		harness.detectChanges();

		const leftHalf = getDraw(service.bracket()!).slice(0, firstRound().length).map(c => c.name);
		expect(firstRound()).toEqual(leftHalf);
		expect(button()).toBe('Start the Tournament');
	});
});
