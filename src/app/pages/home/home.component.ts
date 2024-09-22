import { Component, inject } from '@angular/core';
import { Contestant } from '../../models/contestant.model';
import Utils from '../../utils';
import { ContestantComponent } from '../../components/contestant/contestant.component';
import { CommonModule } from '@angular/common';
import { ContestantService } from '../../services/contestant.service';

@Component({
	selector: 'app-home',
	standalone: true,
	imports: [ContestantComponent, CommonModule],
	templateUrl: './home.component.html',
	styleUrl: './home.component.css'
})
export class HomeComponent {
	private utils: Utils = new Utils();

	public contestants: Contestant[] = [];
	private passedContestants: Contestant[] = [];
	public winner: Contestant | null = null;

	public leftSideSelected: boolean | null = null;

	public currentIndexOffset: number = 0;
	public round: number = 1;
	public roundAddendum: string | null = null;

	private _cService: ContestantService = inject(ContestantService);

	ngOnInit() {
		// CHANGE THIS TO SWAP WHICH TOURNAMENT IS BEING RAN
		const rawContestants = this._cService.getContestants();
		////////////////////////////////////////////////////

		// Shuffle the contestants
		const lowWeightContestants = this.utils.shuffleArray(rawContestants.filter(c => c.weight === 1));
		const highWeightContestants = this.utils.shuffleArray(rawContestants.filter(c => c.weight === 2));

		// Evenly distribute the high weight contestants between the low weight contestants
		const lowHighSplit: number = Math.floor(lowWeightContestants.length / highWeightContestants.length);
		lowWeightContestants.forEach((c, i) => {
			this.contestants.push(c);

			// If evenly divisible by the split, add a high weight contestant
			if ((i+1) % lowHighSplit === 0) {
				const highWeightContestant = highWeightContestants.pop();
				if (highWeightContestant) {
					this.contestants.push(highWeightContestant);
				}
			}
		});

		console.log(`Contestants (${this.contestants.length}):`, this.contestants);
	}

	public handleVote(isLeftSide: boolean) {
		if (isLeftSide === this.leftSideSelected) {
			this.leftSideSelected = null;
		} else {
			this.leftSideSelected = isLeftSide;
		}
	}

	public nextRound() {
		if (this.leftSideSelected === null) return;

		// Add the winner to the passed contestants
		this.passedContestants.push(
			this.leftSideSelected ?
				this.getLeftContestant() :
				this.getRightContestant()
		);
		
		this.currentIndexOffset += 2;
		this.leftSideSelected = null;

		// Check if there are no more contestants
		if (this.currentIndexOffset >= this.contestants.length) {
			// Check if there is only one contestant left (aka a winner)
			if (this.passedContestants.length === 1) {
				this.winner = this.passedContestants[0];
			} else {
				// Reset the contestants
				this.contestants = this.passedContestants;
				this.passedContestants = [];
				this.currentIndexOffset = 0;
				this.round++;
				console.log('Moving on to round ' + this.round + ' with ' + this.contestants.length + ' contestants');

				if (this.contestants.length === 8) {
					this.roundAddendum = "Quarters";
			 	} else if (this.contestants.length === 4) {
					this.roundAddendum = "Semis's";
				} else if (this.contestants.length === 2) {
					this.roundAddendum = "Finals";
				}
			}
		}
	}

	public getLeftContestant(): Contestant {
		return this.contestants[this.currentIndexOffset];
	}
	public getRightContestant(): Contestant {
		return this.contestants[this.currentIndexOffset + 1];
	}
}