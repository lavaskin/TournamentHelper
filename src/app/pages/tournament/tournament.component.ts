import { Component, inject } from '@angular/core';
import { Contestant } from '../../models/contestant.model';
import Utils from '../../utils';
import { ContestantComponent } from '../../components/contestant/contestant.component';
import { CommonModule } from '@angular/common';
import { ContestantService } from '../../services/contestant.service';
import { RouterModule } from '@angular/router';

@Component({
	selector: 'page-tournament',
	standalone: true,
	imports: [ContestantComponent, CommonModule, RouterModule],
	templateUrl: './tournament.component.html',
	styleUrl: './tournament.component.css'
})
export class TournamentComponent {
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
		// Get contestants specified by the service
		this.contestants = this._cService.getContestants();
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
					this.roundAddendum = "Semi's";
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