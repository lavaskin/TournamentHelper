import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Tournament } from '../../models/tournament.model';
import { albumCoverTournament, animalTournament, dinnerTournament, posterTournament, waifuTournament } from '../../data/tournaments.data';
import { TournamentService } from '../../services/tournament.service';
import { Router } from '@angular/router';
import { ButtonComponent } from "../../components/button/button.component";

@Component({
	selector: 'page-home',
	standalone: true,
	imports: [CommonModule, ButtonComponent],
	templateUrl: './home.component.html',
	// styleUrl: './home.component.scss'
})
export class HomeComponent {
	public tournaments: Tournament[] = [
		posterTournament,
		animalTournament,
		dinnerTournament,
		waifuTournament,
		albumCoverTournament,
	];

	private _sTournament: TournamentService = inject(TournamentService);
	private _router: Router = inject(Router);

	public selectTournament(selected: Tournament): void {
		this._sTournament.setTournament(selected);
		this._router.navigate(['/contestants']);
	};
}