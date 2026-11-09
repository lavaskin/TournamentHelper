import { CommonModule } from '@angular/common';
import { Component, computed, inject, linkedSignal, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { filter, map } from 'rxjs';
import { TournamentService } from '../../services/tournament.service';
import { BracketComponent } from '../bracket/bracket.component';
import { getNextMatch } from '../../bracket';

const COIN_FLIP_SPEED = 100; // ms

@Component({
	selector: 'app-nav-bar',
	standalone: true,
	imports: [CommonModule, RouterModule, BracketComponent],
	templateUrl: './nav-bar.component.html',
	styleUrl: './nav-bar.component.scss',
	host: {
		// On window, not document, so the lightbox (on document) can stop Escape reaching here when it's open on top
		'(window:keydown.escape)': 'closeBracket()',
	},
})
export class NavBarComponent {
	public showCoin = signal(false);
	public finishedSpining = signal(false);
	public coinText = signal('');

	private _router: Router = inject(Router);
	private _sTournament: TournamentService = inject(TournamentService);

	private url = toSignal(
		this._router.events.pipe(
			filter(e => e instanceof NavigationEnd),
			map(e => e.urlAfterRedirects),
		),
		{ initialValue: '' },
	);

	// Whether a tournament's contestants or play page is showing (unknown slugs are redirected home)
	public onTournament = computed(() => this.url().startsWith('/t/'));
	public onPlay = computed(() => this.onTournament() && this.url().endsWith('/play'));

	// The bracket overlay only reads the bracket, so opening and closing it never affects progress
	public showBracket = linkedSignal({ source: this.url, computation: () => false });
	public bracket = this._sTournament.bracket;
	public currentMatch = computed(() => {
		const bracket = this.bracket();
		return bracket ? getNextMatch(bracket) : null;
	});
	public imageBg = computed(() => this._sTournament.tournament()?.imageBg ?? false);

	public closeBracket(): void {
		this.showBracket.set(false);
	}

	public restart(): void {
		if (confirm('Restart the tournament? All picks will be lost.')) {
			this._sTournament.restart();
		}
	}

	public flipCoin(): void {
		if (this.showCoin()) return;

		// Random between 3 - 5 seconds
		const coinSpinTime = (Math.random() * 2) + 3;

		// Roll the outcome prior to spinning
		const predecidedText = Math.random() > 0.5 ? 'L' : 'R';
		// Choose a random side to show while spinning
		this.coinText.set(Math.random() > 0.5 ? 'L' : 'R');

		this.finishedSpining.set(false);
		this.showCoin.set(true);

		// Every COIN_FLIP_SPEED, flip the coin
		const flipInterval = setInterval(() => {
			this.coinText.update(text => text === 'L' ? 'R' : 'L');
		}, COIN_FLIP_SPEED);

		setTimeout(() => {
			clearInterval(flipInterval);
			this.coinText.set(predecidedText);
			this.finishedSpining.set(true);
			console.log('Coin Flipped: ', predecidedText);

			// Hide the coin in 5s
			setTimeout(() => {
				this.showCoin.set(false);
			}, 5000);
		}, coinSpinTime * 1000);
	}
}
