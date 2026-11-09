import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { TournamentComponent } from './pages/tournament/tournament.component';
import { ContestantsComponent } from './pages/contestants/contestants.component';
import { tournamentResolver } from './tournament.resolver';

export const routes: Routes = [
	{ path: '', redirectTo: 'home', pathMatch: 'full' },
	{ path: 'home', component: HomeComponent },
	{
		path: 't/:slug',
		resolve: { tournament: tournamentResolver },
		children: [
			{ path: '', component: ContestantsComponent },
			{ path: 'play', component: TournamentComponent },
		],
	},
	{ path: '**', redirectTo: 'home' }
];
