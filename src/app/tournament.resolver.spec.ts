import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { firstValueFrom } from 'rxjs';
import tournaments from './data/tournaments.data';
import { routes } from './app.routes';
import { AlertService } from './services/alert.service';
import { TournamentService } from './services/tournament.service';

describe('tournamentResolver', () => {
	beforeEach(() => {
		localStorage.clear();
		TestBed.configureTestingModule({ providers: [provideRouter(routes)] });
	});

	it('opens the tournament named in the URL', async () => {
		const harness = await RouterTestingHarness.create();
		await harness.navigateByUrl(`/t/${tournaments[1].slug}/play`);

		expect(TestBed.inject(Router).url).toBe(`/t/${tournaments[1].slug}/play`);
		expect(TestBed.inject(TournamentService).tournament()).toBe(tournaments[1]);
	});

	it('sends an unknown slug home with an alert', async () => {
		const harness = await RouterTestingHarness.create();
		await harness.navigateByUrl('/t/no-such-tournament');

		expect(TestBed.inject(Router).url).toBe('/home');
		expect(await firstValueFrom(TestBed.inject(AlertService).alert$)).toContain('no-such-tournament');
	});
});
