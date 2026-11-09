import { Component, computed, inject, linkedSignal } from '@angular/core';
import { Contestant } from '../../models/contestant.model';
import { ContestantComponent } from '../../components/contestant/contestant.component';
import { CommonModule } from '@angular/common';
import { TournamentService } from '../../services/tournament.service';
import { RouterModule } from '@angular/router';
import { ButtonComponent } from '../../components/button/button.component';
import { BracketComponent } from '../../components/bracket/bracket.component';
import { Bracket } from '../../models/bracket.model';
import { getChampion, getMatch, getMatchAfter, getMatchProgress, getNextMatch, isContestant, roundName } from '../../bracket';

@Component({
	selector: 'page-tournament',
	standalone: true,
	imports: [ContestantComponent, ButtonComponent, BracketComponent, CommonModule, RouterModule],
	templateUrl: './tournament.component.html',
	styleUrl: './tournament.component.scss'
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

	public roundName = computed(() => {
		const position = this.position();
		return position ? roundName(this.bracket(), position.round) : null;
	});

	// Left out when the round has only one real match (the final, or a first round of nearly all byes), as "Match 1 of 1" says nothing
	public progress = computed(() => {
		const position = this.position();
		const progress = position && getMatchProgress(this.bracket(), position);
		return progress && progress.of > 1 ? progress : null;
	});

	// The match after this one, with null for a slot waiting on this match's winner. There's none during the final.
	public upNext = computed(() => {
		const bracket = this.bracket();
		const position = this.position();
		const next = position && getMatchAfter(bracket, position);
		if (!next) return null;

		return {
			// Only named when it starts a new round
			round: next.round !== position.round ? roundName(bracket, next.round) : null,
			slots: getMatch(bracket, next).slots.map(slot => isContestant(slot) ? slot : null),
		};
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
