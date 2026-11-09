import { Component, computed, inject, linkedSignal } from '@angular/core';
import { Contestant } from '../../models/contestant.model';
import { ContestantComponent } from '../../components/contestant/contestant.component';
import { CommonModule } from '@angular/common';
import { TournamentService } from '../../services/tournament.service';
import { RouterModule } from '@angular/router';
import { ButtonComponent } from '../../components/button/button.component';
import { BracketComponent } from '../../components/bracket/bracket.component';
import { Bracket } from '../../models/bracket.model';
import { getChampion, getMatch, getNextMatch } from '../../bracket';

@Component({
	selector: 'page-tournament',
	standalone: true,
	imports: [ContestantComponent, ButtonComponent, BracketComponent, CommonModule, RouterModule],
	templateUrl: './tournament.component.html',
	// styleUrl: './tournament.component.scss'
})
export class TournamentComponent {
	private _sTournament: TournamentService = inject(TournamentService);

	// The route resolver opens the tournament before this page loads
	public bracket = computed(() => this._sTournament.bracket()!);
	private position = computed(() => getNextMatch(this.bracket()));

	public imageBg = computed(() => this._sTournament.tournament()!.imageBg ?? false);
	public winner = computed(() => getChampion(this.bracket()));

	// Bye matches are decided when the bracket is made, so both slots hold contestants here
	private slots = computed(() => {
		const position = this.position();
		return position ? getMatch(this.bracket(), position).slots as [Contestant, Contestant] : null;
	});
	public leftContestant = computed(() => this.slots()?.[0] ?? null);
	public rightContestant = computed(() => this.slots()?.[1] ?? null);

	// Cleared whenever the bracket changes (a pick or a restart)
	public leftSideSelected = linkedSignal<Bracket, boolean | null>({
		source: this.bracket,
		computation: () => null,
	});

	public round = computed(() => (this.position()?.round ?? 0) + 1);
	public roundAddendum = computed(() => {
		const position = this.position();
		if (!position) return null;

		const contestantsInRound = this.bracket().rounds[position.round].length * 2;
		if (contestantsInRound === 8) return 'Quarters';
		if (contestantsInRound === 4) return "Semi's";
		if (contestantsInRound === 2) return 'Finals';
		return null;
	});

	public handleVote(isLeftSide: boolean) {
		this.leftSideSelected.update(selected => selected === isLeftSide ? null : isLeftSide);
	}

	public nextRound() {
		const position = this.position();
		const leftSideSelected = this.leftSideSelected();
		if (leftSideSelected === null || !position) return;

		this._sTournament.pickWinner(position, leftSideSelected ? 0 : 1);
	}
}
