import { inject } from '@angular/core';
import { RedirectCommand, ResolveFn, Router } from '@angular/router';
import { Tournament } from './models/tournament.model';
import { TournamentService } from './services/tournament.service';
import { AlertService } from './services/alert.service';

// Opens the tournament named by the :slug param, or sends an unknown slug back home
export const tournamentResolver: ResolveFn<Tournament> = route => {
	const slug = route.paramMap.get('slug') ?? '';
	const tournament = inject(TournamentService).open(slug);
	if (tournament) return tournament;

	inject(AlertService).show(`No tournament called "${slug}"`);
	const router = inject(Router);
	return new RedirectCommand(router.parseUrl('/home'));
};
