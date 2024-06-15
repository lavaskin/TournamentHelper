import { Component } from '@angular/core';
import { Contestant } from '../../models/contestant';
import contestants from '../../data/contestants';
import Utils from '../../utils';
import { ContestantComponent } from '../../components/contestant/contestant.component';
import { CommonModule } from '@angular/common';

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
	private round: number = 1;

	ngOnInit() {
		const contestantWeightMap = new Map<number, Contestant[]>();

		// Add each contestant to the map based on their weight
		contestants.forEach(contestant => {
			if (!contestantWeightMap.has(contestant.weight)) {
				contestantWeightMap.set(contestant.weight, []);
			}

			contestantWeightMap.get(contestant.weight)!.push(contestant);
		});

		// Randomize the contestants within each weight and add to the contestants array
		contestantWeightMap.forEach(values => {
			// Randomize the array
			const randomized = this.utils.shuffleArray(values);
			this.contestants.push(...randomized);
		});
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