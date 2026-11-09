import { Component, computed, inject } from '@angular/core';
import { TournamentService } from '../../services/tournament.service';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ContestantComponent } from '../../components/contestant/contestant.component';
import { ButtonComponent } from '../../components/button/button.component';
import { getDraw } from '../../bracket';

@Component({
	selector: 'page-contestants',
	standalone: true,
	imports: [CommonModule, RouterModule, ContestantComponent, ButtonComponent],
	templateUrl: './contestants.component.html',
	// styleUrl: './contestants.component.scss'
})
export class ContestantsComponent {
	private _sTournament: TournamentService = inject(TournamentService);

	// The route resolver opens the tournament before this page loads
	public contestants = computed(() => getDraw(this._sTournament.bracket()!));
	public imageBg = computed(() => this._sTournament.tournament()!.imageBg ?? false);
}
