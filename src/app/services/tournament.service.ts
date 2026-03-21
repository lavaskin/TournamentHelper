import { inject, Injectable } from "@angular/core";
import { Contestant } from "../models/contestant.model";
import { Tournament } from "../models/tournament.model";
import Utils from "../utils";
import { AlertService } from "./alert.service";

@Injectable({
	providedIn: 'root',
})
export class TournamentService {
	// CHANGE THIS TO SWAP WHICH TOURNAMENT IS BEING RAN
	private _tournament?: Tournament;

	private _utils: Utils = new Utils();
	private _sAlert: AlertService = inject(AlertService);

	public setTournament(tournament: Tournament): void {
		this._tournament = tournament;
		this.storeTournament(tournament);
	}

	public getContestants(): Contestant[] {
		if (this.validateTournament() === false) {
			return [];
		}
		
		// Deep copy the contestants
		let contestants: Contestant[] = JSON.parse(JSON.stringify(this._tournament!.contestants));

		// Fix Data
		this.fixNullWeights(contestants);
		this.fixLocalThumbnails(contestants);

		// Shuffle the contestants if tournament shuffle is enabled (and deep copy results)
		if (this._tournament!.shuffle == true) {
			contestants = JSON.parse(JSON.stringify(this.shuffleArray(contestants)));
		}

		return contestants;
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

		// Check it has contestants
		if (!this._tournament!.contestants || this._tournament!.contestants.length === 0) {
			this._sAlert.show('No contestants found');
			return false;
		}

		// Check if the amount of contestants is, 2, 4, 81, 16, 32, 64, 128, etc. (power of 2)
		const powerOfTwo = Math.log2(this._tournament!.contestants.length);
		if (!Number.isInteger(powerOfTwo)) {
			this._sAlert.show('Contestants must be a power of 2');
			return false;
		}

		return true;
	}

	private fixNullWeights(contestants: Contestant[]) {
		contestants.forEach(c => {
			if (c.weight === undefined) {
				c.weight = 1;
			}
		});
	}

	private fixLocalThumbnails(contestants: Contestant[]) {
		contestants.forEach(c => {
			if (c.thumbnailUrl.includes('http')) return;

			c.thumbnailUrl = `/contestants/${this._tournament!.thumbnailPath}/${c.thumbnailUrl}`;
		});
	}

	private shuffleArray(contestants: Contestant[]): Contestant[] {
		// Separate default-weight contestants from paired contestants
		const defaultContestants = this._utils.shuffleArray(contestants.filter(c => c.weight === 1));
		const pairedContestants = contestants.filter(c => c.weight! > 1);

		// Group paired contestants by weight, then shuffle within each group
		const weightGroups = new Map<number, Contestant[]>();
		pairedContestants.forEach(c => {
			if (!weightGroups.has(c.weight!)) {
				weightGroups.set(c.weight!, []);
			}
			weightGroups.get(c.weight!)!.push(c);
		});

		// Build paired slots: each weight group becomes adjacent pairs in the final array
		const pairedSlots: Contestant[] = [];
		const sortedWeights = [...weightGroups.keys()].sort((a, b) => a - b);
		const shuffledWeights = this._utils.shuffleArray(sortedWeights);

		for (const weight of shuffledWeights) {
			const group = this._utils.shuffleArray(weightGroups.get(weight)!);
			pairedSlots.push(...group);
		}

		// Interleave: place paired slots evenly throughout the default contestants
		const shuffledContestants: Contestant[] = [...defaultContestants];
		const totalPairs = pairedSlots.length / 2;

		if (totalPairs > 0) {
			// Space pairs evenly; each pair occupies 2 adjacent slots
			const spacing = Math.floor(shuffledContestants.length / totalPairs);
			for (let i = 0; i < totalPairs; i++) {
				const insertAt = Math.min(i * spacing + spacing, shuffledContestants.length);
				shuffledContestants.splice(insertAt, 0, pairedSlots[i * 2], pairedSlots[i * 2 + 1]);
			}
		}

		return shuffledContestants;
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