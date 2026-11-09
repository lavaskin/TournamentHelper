import { Component, computed, inject } from '@angular/core';
import { TournamentService } from '../../services/tournament.service';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../components/button/button.component';
import { BracketComponent } from '../../components/bracket/bracket.component';
import { BracketStatus, getDraw, getNextMatch, getStatus } from '../../bracket';

const START_LABELS: Record<BracketStatus, string> = {
	'not-started': 'Start the Tournament',
	'in-progress': 'Resume',
	'finished': 'View results',
};

@Component({
	selector: 'page-contestants',
	standalone: true,
	imports: [CommonModule, RouterModule, ButtonComponent, BracketComponent],
	templateUrl: './contestants.component.html',
	styleUrl: './contestants.component.scss'
})
export class ContestantsComponent {
	private _sTournament: TournamentService = inject(TournamentService);

	// The route resolver opens the tournament before this page loads
	public bracket = computed(() => this._sTournament.bracket()!);
	public imageBg = computed(() => this._sTournament.tournament()!.imageBg ?? false);

	public numContestants = computed(() => getDraw(this.bracket()).length);
	private status = computed(() => getStatus(this.bracket()));
	public startLabel = computed(() => START_LABELS[this.status()]);
	public current = computed(() => this.status() === 'in-progress' ? getNextMatch(this.bracket()) : null);
}
