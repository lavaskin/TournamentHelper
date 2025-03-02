import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { TournamentComponent } from './pages/tournament/tournament.component';
import { ContestantsComponent } from './pages/contestants/contestants.component';

export const routes: Routes = [
	{ path: '', redirectTo: 'home', pathMatch: 'full' },
	{ path: 'home', component: HomeComponent },
	{ path: 'contestants', component: ContestantsComponent },
	{ path: 'tournament', component: TournamentComponent },
	{ path: '**', redirectTo: 'home' }
];
