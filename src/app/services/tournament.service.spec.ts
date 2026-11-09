import { TestBed } from '@angular/core/testing';
import tournaments from '../data/tournaments.data';
import { getChampion, getDraw, getNextMatch } from '../bracket';
import { Bracket } from '../models/bracket.model';
import { TournamentService } from './tournament.service';

const [first, second] = tournaments;

// A fresh service, as after a page refresh
function reload(): TournamentService {
	TestBed.resetTestingModule();
	return TestBed.inject(TournamentService);
}

function pickNext(service: TournamentService, times: number = 1) {
	for (let i = 0; i < times; i++) {
		service.pickWinner(getNextMatch(service.bracket()!)!, 0);
	}
}

function countPicks(bracket: Bracket): number {
	return bracket.rounds.flat().filter(m => m.winner !== null).length;
}

describe('TournamentService', () => {
	beforeEach(() => localStorage.clear());

	it('returns null for an unknown slug', () => {
		expect(reload().open('no-such-tournament')).toBeNull();
	});

	it('resumes a saved bracket with its picks after a refresh', () => {
		const service = reload();
		service.open(first.slug);
		pickNext(service, 3);
		const before = service.bracket();

		const resumed = reload();
		resumed.open(first.slug);

		expect(resumed.bracket()).toEqual(before);
		expect(getNextMatch(resumed.bracket()!)).toEqual(getNextMatch(before!));
	});

	it('gives each pick a new bracket so signals update', () => {
		const service = reload();
		service.open(first.slug);
		const before = service.bracket();
		pickNext(service);

		expect(service.bracket()).not.toBe(before);
		expect(countPicks(service.bracket()!)).toBe(countPicks(before!) + 1);
	});

	it('saves each tournament separately', () => {
		const service = reload();
		service.open(first.slug);
		pickNext(service, 2);
		const firstBracket = service.bracket();

		service.open(second.slug);
		const secondPicks = countPicks(service.bracket()!);

		service.open(first.slug);
		expect(service.bracket()).toEqual(firstBracket);

		service.open(second.slug);
		expect(countPicks(service.bracket()!)).toBe(secondPicks);
	});

	it('keeps a finished tournament until it is restarted', () => {
		const service = reload();
		service.open(first.slug);
		pickNext(service, first.contestants.length - 1);
		const champion = getChampion(service.bracket()!);
		expect(champion).not.toBeNull();

		const resumed = reload();
		resumed.open(first.slug);
		expect(getChampion(resumed.bracket()!)).toEqual(champion);

		resumed.restart();
		expect(getChampion(resumed.bracket()!)).toBeNull();
	});

	it('restarts with a fresh bracket and saves it', () => {
		const service = reload();
		service.open(first.slug);
		const byes = countPicks(service.bracket()!);
		pickNext(service, 2);

		service.restart();
		expect(countPicks(service.bracket()!)).toBe(byes);

		const fresh = service.bracket();
		const resumed = reload();
		resumed.open(first.slug);
		expect(resumed.bracket()).toEqual(fresh);
	});

	it('draws a new bracket when the saved one has different contestants', () => {
		const service = reload();
		service.open(first.slug);
		pickNext(service, 2);
		const byes = countPicks(service.bracket()!) - 2;

		// Rename a contestant in the save, as if the tournament data had changed since
		const saved: Bracket = JSON.parse(localStorage.getItem(`bracket:${first.slug}`)!);
		getDraw(saved)[0].name = 'Renamed';
		localStorage.setItem(`bracket:${first.slug}`, JSON.stringify(saved));

		const resumed = reload();
		resumed.open(first.slug);
		expect(countPicks(resumed.bracket()!)).toBe(byes);
		expect(getDraw(resumed.bracket()!).map(c => c.name)).not.toContain('Renamed');
	});

	it('draws a new bracket when the save is unreadable', () => {
		localStorage.setItem(`bracket:${first.slug}`, '{ not json');
		const service = reload();
		service.open(first.slug);
		expect(getDraw(service.bracket()!)).toHaveLength(first.contestants.length);

		localStorage.setItem(`bracket:${first.slug}`, '{ "rounds": [[{}]] }');
		const again = reload();
		again.open(first.slug);
		expect(getDraw(again.bracket()!)).toHaveLength(first.contestants.length);
	});
});
