import { Component, inject } from '@angular/core';
import { AlertService } from '../../services/alert.service';
import { TournamentService } from '../../services/tournament.service';
import { Router, RouterModule } from '@angular/router';
import { Contestant } from '../../models/contestant.model';
import { CommonModule } from '@angular/common';
import { ContestantComponent } from '../../components/contestant/contestant.component';
import { ButtonComponent } from "../../components/button/button.component";

@Component({
	selector: 'page-contestants',
	standalone: true,
	imports: [CommonModule, RouterModule, ContestantComponent, ButtonComponent],
	templateUrl: './contestants.component.html',
	styleUrl: './contestants.component.scss'
})
export class ContestantsComponent {
	public contestants: Contestant[] = [];
	public numContestants: number = 0;
	
	private _sAlert: AlertService = inject(AlertService);
	private _sTournament: TournamentService = inject(TournamentService);
	private _router: Router = inject(Router);

	ngOnInit() {
		// Get contestants specified by the service
		this.contestants = this._sTournament.getContestants();
		this.numContestants = this.contestants.length;

		if (this.contestants.length === 0) {
			this._sAlert.showAlert('No contestants to display');
			this._router.navigate(['/']);
		}
	}
}
