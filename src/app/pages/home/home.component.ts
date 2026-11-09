import tournaments from '../../data/tournaments.data';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Tournament } from '../../models/tournament.model';
import { ButtonComponent } from '../../components/button/button.component';

@Component({
	selector: 'page-home',
	standalone: true,
	imports: [CommonModule, RouterModule, ButtonComponent],
	templateUrl: './home.component.html',
	// styleUrl: './home.component.scss'
})
export class HomeComponent {
	public tournaments: Tournament[] = tournaments;
}
