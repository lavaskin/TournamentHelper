import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

const COIN_FLIP_SPEED = 100; // ms

@Component({
	selector: 'app-nav-bar',
	standalone: true,
	imports: [CommonModule, RouterModule],
	templateUrl: './nav-bar.component.html',
	styleUrl: './nav-bar.component.scss'
})
export class NavBarComponent {
	public showCoin = signal(false);
	public finishedSpining = signal(false);
	public coinText = signal('');

	private _router: Router = inject(Router);

	public goHome(): void {
		// Check if on the /tournament route
		if (this._router.url === '/tournament') {
			// If so, pop up a confirmation dialog
			const confirmed = confirm('Are you sure you want to leave the tournament?');
			if (confirmed) {
				this._router.navigate(['/']);
			} else {
				return;
			}
		}

		this._router.navigate(['/']);
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
