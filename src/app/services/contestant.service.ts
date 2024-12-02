import { Injectable } from "@angular/core";
import { Contestant } from "../models/contestant.model";
import { Tournament } from "../models/tournament.model";
import { dinnerTournament } from "../data/tournaments.data";

@Injectable({
	providedIn: 'root',
})
export class ContestantService {
	// CHANGE THIS TO SWAP WHICH TOURNAMENT IS BEING RAN
	private tournament: Tournament = dinnerTournament;

	public getContestants(): Contestant[] {
		// Check if the amount of contestants is, 2, 4, 81, 16, 32, 64, 128, etc. (power of 2)
		const powerOfTwo = Math.log2(this.tournament.contestants.length);
		if (!Number.isInteger(powerOfTwo)) {
			throw new Error('Contestants must be a power of 2');
		}

		// Fix Data
		this.fixNullWeights();
		this.fixLocalThumbnails();

		return this.tournament.contestants;
	}

	private fixNullWeights() {
		this.tournament.contestants.forEach(c => {
			if (c.weight === undefined) {
				c.weight = 1;
			}
		});
	}

	private fixLocalThumbnails() {
		this.tournament.contestants.forEach(c => {
			if (c.thumbnailUrl.includes('http')) return;

			c.thumbnailUrl = `/contestants/${this.tournament.thumbnailPath}/${c.thumbnailUrl}`;
		});
	}
}