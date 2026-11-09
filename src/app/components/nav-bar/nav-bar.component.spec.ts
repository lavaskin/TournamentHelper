import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import tournaments from '../../data/tournaments.data';
import { routes } from '../../app.routes';
import { getNextMatch } from '../../bracket';
import { TournamentService } from '../../services/tournament.service';
import { NavBarComponent } from './nav-bar.component';

const slug = tournaments[0].slug;

// Creates the nav bar, then navigates (the route resolver still opens the tournament without an outlet)
async function setup(url: string) {
	const fixture = TestBed.createComponent(NavBarComponent);
	await TestBed.inject(Router).navigateByUrl(url);
	fixture.detectChanges();

	const el: HTMLElement = fixture.nativeElement;
	const item = (label: string) => [...el.querySelectorAll('li')].find(li => li.textContent!.trim() === label);
	return { fixture, el, item };
}

describe('NavBarComponent bracket overlay', () => {
	beforeEach(() => {
		localStorage.clear();
		TestBed.configureTestingModule({ providers: [provideRouter(routes)] });
	});

	it('only offers the bracket on the play page', async () => {
		const contestants = await setup(`/t/${slug}`);
		expect(contestants.item('bracket')).toBeUndefined();
		expect(contestants.item('restart')).toBeDefined();

		const play = await setup(`/t/${slug}/play`);
		expect(play.item('bracket')).toBeDefined();
	});

	it('opens and closes without changing the bracket or its save', async () => {
		const { fixture, el, item } = await setup(`/t/${slug}/play`);
		const service = TestBed.inject(TournamentService);
		service.pickWinner(getNextMatch(service.bracket()!)!, 0);

		const bracket = service.bracket();
		const saved = localStorage.getItem(`bracket:${slug}`);

		item('bracket')!.click();
		fixture.detectChanges();
		expect(el.querySelector('.bracket-overlay app-bracket')).not.toBeNull();
		expect(el.querySelectorAll('.bracket-overlay .match.current')).toHaveLength(1);

		document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
		fixture.detectChanges();
		expect(el.querySelector('.bracket-overlay')).toBeNull();

		item('bracket')!.click();
		fixture.detectChanges();
		(el.querySelector('.bracket-overlay .close') as HTMLElement).click();
		fixture.detectChanges();
		expect(el.querySelector('.bracket-overlay')).toBeNull();

		expect(service.bracket()).toBe(bracket);
		expect(localStorage.getItem(`bracket:${slug}`)).toBe(saved);
	});
});
