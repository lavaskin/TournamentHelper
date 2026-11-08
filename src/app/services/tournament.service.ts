import { inject, Injectable } from "@angular/core";
import { Contestant } from "../models/contestant.model";
import { Tournament } from "../models/tournament.model";
import { Bracket } from "../models/bracket.model";
import { createBracket } from "../bracket";
import { AlertService } from "./alert.service";

@Injectable({
	providedIn: 'root',
})
export class TournamentService {
	private _tournament?: Tournament;

	private _sAlert: AlertService = inject(AlertService);

	public setTournament(tournament: Tournament): void {
		this._tournament = tournament;
		this.storeTournament(tournament);
	}

	public get imageBg(): boolean {
		return this._tournament?.imageBg ?? false;
	}

	public getContestants(): Contestant[] {
		if (this.validateTournament() === false) {
			return [];
		}
		
		// Deep copy the contestants
		const contestants: Contestant[] = JSON.parse(JSON.stringify(this._tournament!.contestants));
		this.fixLocalThumbnails(contestants);

		return contestants;
	}

	public createBracket(): Bracket | null {
		const contestants = this.getContestants();
		if (contestants.length === 0) {
			return null;
		}

		return createBracket(contestants, this._tournament!.shuffle ?? false);
	}

	private validateTournament(): boolean {
		// Check that the tournament exists
		if (!this._tournament) {
			this._tournament = this.retrieveTournament();

			if (!this._tournament) {
				this._sAlert.show('No tournament found');
				return false;
			}
		}

		// A bracket needs at least 2 contestants, byes fill out the rest
		if (!this._tournament!.contestants || this._tournament!.contestants.length < 2) {
			this._sAlert.show('A tournament needs at least 2 contestants');
			return false;
		}

		return true;
	}

	private fixLocalThumbnails(contestants: Contestant[]) {
		contestants.forEach(c => {
			if (c.thumbnailUrl.includes('http')) return;

			c.thumbnailUrl = `/contestants/${this._tournament!.thumbnailPath}/${c.thumbnailUrl}`;
		});
	}

	private storeTournament(tournament: Tournament): void {
		localStorage.setItem('tournament', JSON.stringify(tournament));
	}
	private retrieveTournament(): Tournament | undefined {
		const tournament = localStorage.getItem('tournament');
		if (!tournament) {
			return undefined;
		}

		return JSON.parse(tournament);
	}
}
