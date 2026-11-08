import { Component, inject } from '@angular/core';
import { Contestant } from '../../models/contestant.model';
import { ContestantComponent } from '../../components/contestant/contestant.component';
import { CommonModule } from '@angular/common';
import { TournamentService } from '../../services/tournament.service';
import { Router, RouterModule } from '@angular/router';
import { ButtonComponent } from '../../components/button/button.component';
import { Bracket, MatchPosition } from '../../models/bracket.model';
import { getChampion, getMatch, getNextMatch, pickWinner } from '../../bracket';

@Component({
	selector: 'page-tournament',
	standalone: true,
	imports: [ContestantComponent, ButtonComponent, CommonModule, RouterModule],
	templateUrl: './tournament.component.html',
	// styleUrl: './tournament.component.scss'
})
export class TournamentComponent {
	private bracket: Bracket | null = null;
	private position: MatchPosition | null = null;

	public leftContestant: Contestant | null = null;
	public rightContestant: Contestant | null = null;
	public winner: Contestant | null = null;
	public imageBg: boolean = false;

	public leftSideSelected: boolean | null = null;

	public round: number = 1;
	public roundAddendum: string | null = null;

	private _sTournament: TournamentService = inject(TournamentService);
	private _router: Router = inject(Router);

	ngOnInit() {
		this.bracket = this._sTournament.createBracket();
		this.imageBg = this._sTournament.imageBg;

		if (!this.bracket) {
			this._router.navigate(['/']);
			return;
		}

		this.showNextMatch();
	}

	public handleVote(isLeftSide: boolean) {
		if (isLeftSide === this.leftSideSelected) {
			this.leftSideSelected = null;
		} else {
			this.leftSideSelected = isLeftSide;
		}
	}

	public nextRound() {
		if (this.leftSideSelected === null || !this.bracket || !this.position) return;

		pickWinner(this.bracket, this.position, this.leftSideSelected ? 0 : 1);
		this.leftSideSelected = null;
		this.showNextMatch();
	}

	private showNextMatch() {
		const bracket = this.bracket!;
		this.position = getNextMatch(bracket);

		if (!this.position) {
			this.winner = getChampion(bracket);
			return;
		}

		// Bye matches are decided when the bracket is made, so both slots hold contestants here
		const [left, right] = getMatch(bracket, this.position).slots;
		this.leftContestant = left as Contestant;
		this.rightContestant = right as Contestant;

		this.round = this.position.round + 1;

		const slotsInRound = bracket.rounds[this.position.round].length * 2;
		if (slotsInRound === 8) {
			this.roundAddendum = "Quarters";
		} else if (slotsInRound === 4) {
			this.roundAddendum = "Semi's";
		} else if (slotsInRound === 2) {
			this.roundAddendum = "Finals";
		} else {
			this.roundAddendum = null;
		}
	}
}
