import { Injectable, signal } from '@angular/core';
import tournaments from '../data/tournaments.data';
import { Contestant } from '../models/contestant.model';
import { Tournament } from '../models/tournament.model';
import { Bracket, MatchPosition, SlotIndex } from '../models/bracket.model';
import { createBracket, isDrawnFrom, pickWinner } from '../bracket';

const STORAGE_PREFIX = 'bracket:';

// Holds the open tournament and its bracket. The bracket is saved per slug after every change, so a refresh resumes it.
@Injectable({
	providedIn: 'root',
})
export class TournamentService {
	private _tournament = signal<Tournament | null>(null);
	private _bracket = signal<Bracket | null>(null);

	public readonly tournament = this._tournament.asReadonly();
	public readonly bracket = this._bracket.asReadonly();

	// Opens a tournament, resuming its saved bracket or drawing a new one. Returns null if no tournament has that slug.
	public open(slug: string): Tournament | null {
		const tournament = tournaments.find(t => t.slug === slug);
		if (!tournament) return null;

		const saved = this.loadBracket(tournament);

		this._tournament.set(tournament);
		if (saved) {
			this._bracket.set(saved);
		} else {
			this.draw();
		}

		return tournament;
	}

	// Throws away the open tournament's bracket and draws a new one
	public restart(): void {
		this.draw();
	}

	public pickWinner(position: MatchPosition, winner: SlotIndex): void {
		// Picks go on a copy so the signal sees a new bracket
		const bracket = structuredClone(this.openBracket());
		pickWinner(bracket, position, winner);
		this.setBracket(bracket);
	}

	private draw(): void {
		const tournament = this.openTournament();
		this.setBracket(createBracket(this.getContestants(tournament), tournament.shuffle ?? false));
	}

	private setBracket(bracket: Bracket): void {
		this._bracket.set(bracket);
		localStorage.setItem(STORAGE_PREFIX + this.openTournament().slug, JSON.stringify(bracket));
	}

	// The saved bracket, or null if there isn't one, it can't be read, or the tournament's contestants have changed since
	private loadBracket(tournament: Tournament): Bracket | null {
		try {
			const bracket: Bracket | null = JSON.parse(localStorage.getItem(STORAGE_PREFIX + tournament.slug) ?? 'null');
			return bracket && isDrawnFrom(bracket, this.getContestants(tournament)) ? bracket : null;
		} catch {
			return null;
		}
	}

	private openTournament(): Tournament {
		const tournament = this._tournament();
		if (!tournament) throw new Error('No tournament is open');
		return tournament;
	}

	private openBracket(): Bracket {
		const bracket = this._bracket();
		if (!bracket) throw new Error('No tournament is open');
		return bracket;
	}

	// A copy of the contestants with local thumbnails resolved to their path under public/
	private getContestants(tournament: Tournament): Contestant[] {
		return tournament.contestants.map(c => ({
			...c,
			thumbnailUrl: c.thumbnailUrl.includes('http') ? c.thumbnailUrl : `/contestants/${tournament.thumbnailPath}/${c.thumbnailUrl}`,
		}));
	}
}
