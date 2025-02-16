import { Injectable } from "@angular/core";
import { Contestant } from "../models/contestant.model";
import { Tournament } from "../models/tournament.model";
import { dinnerTournament, waifuTournament } from "../data/tournaments.data";
import Utils from "../utils";

@Injectable({
	providedIn: 'root',
})
export class ContestantService {
	// CHANGE THIS TO SWAP WHICH TOURNAMENT IS BEING RAN
	private _tournament: Tournament = dinnerTournament;

	private _utils: Utils = new Utils();

	public getContestants(): Contestant[] {
		// Check if the amount of contestants is, 2, 4, 81, 16, 32, 64, 128, etc. (power of 2)
		const powerOfTwo = Math.log2(this._tournament.contestants.length);
		if (!Number.isInteger(powerOfTwo)) {
			throw new Error('Contestants must be a power of 2');
		}

		// Deep copy the contestants
		const contestants: Contestant[] = JSON.parse(JSON.stringify(this._tournament.contestants));

		// Fix Data
		this.fixNullWeights(contestants);
		this.fixLocalThumbnails(contestants);

		// Shuffle the contestants if tournament shuffle is enabled
		if (this._tournament.shuffle == true) {
			this.shuffleArray(contestants);
		}

		return contestants;
	}

	private fixNullWeights(contestants: Contestant[]) {
		this._tournament.contestants.forEach(c => {
			if (c.weight === undefined) {
				c.weight = 1;
			}
		});
	}

	private fixLocalThumbnails(contestants: Contestant[]) {
		this._tournament.contestants.forEach(c => {
			if (c.thumbnailUrl.includes('http')) return;

			c.thumbnailUrl = `/contestants/${this._tournament.thumbnailPath}/${c.thumbnailUrl}`;
		});
	}

	private shuffleArray(contestants: Contestant[]): void {
		const shuffledContestants: Contestant[] = [];
		
		// Shuffle the contestants
		const lowWeightContestants = this._utils.shuffleArray(contestants.filter(c => c.weight === 1));
		const highWeightContestants = this._utils.shuffleArray(contestants.filter(c => c.weight === 2));

		// Evenly distribute the high weight contestants between the low weight contestants
		const lowHighSplit: number = Math.floor(lowWeightContestants.length / highWeightContestants.length);
		lowWeightContestants.forEach((c, i) => {
			shuffledContestants.push(c);

			// If evenly divisible by the split, add a high weight contestant
			if ((i+1) % lowHighSplit === 0) {
				const highWeightContestant = highWeightContestants.pop();
				if (highWeightContestant) {
					shuffledContestants.push(highWeightContestant);
				}
			}
		});

		this._tournament.contestants = shuffledContestants;
	}
}