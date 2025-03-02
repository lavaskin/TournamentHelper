import { Component, inject } from '@angular/core';
import { Contestant } from '../../models/contestant.model';
import { ContestantComponent } from '../../components/contestant/contestant.component';
import { CommonModule } from '@angular/common';
import { TournamentService } from '../../services/tournament.service';
import { Router, RouterModule } from '@angular/router';
import { ButtonComponent } from '../../components/button/button.component';

@Component({
	selector: 'page-tournament',
	standalone: true,
	imports: [ContestantComponent, ButtonComponent, CommonModule, RouterModule],
	templateUrl: './tournament.component.html',
	// styleUrl: './tournament.component.scss'
})
export class TournamentComponent {
	public contestants: Contestant[] = [];
	private passedContestants: Contestant[] = [];
	public winner: Contestant | null = null;

	public leftSideSelected: boolean | null = null;

	public currentIndexOffset: number = 0;
	public round: number = 1;
	public roundAddendum: string | null = null;

	private _sTournament: TournamentService = inject(TournamentService);
	private _router: Router = inject(Router);

	ngOnInit() {
		// Get contestants specified by the service
		this.contestants = this._sTournament.getContestants();

		if (this.contestants.length === 0) {
			this._router.navigate(['/']);
		}
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