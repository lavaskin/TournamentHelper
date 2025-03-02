import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
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
	public showCoin: boolean = false;
	public finishedSpining: boolean = false;
	public coinText!: string;

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
		if (this.showCoin) return;

		// Random between 3 - 5 seconds
		const coinSpinTime = (Math.random() * 2) + 3;

		// Roll the outcome prior to spinning
		const predecidedText = Math.random() > 0.5 ? 'L' : 'R';
		// Choose a random side to show while spinning
		this.coinText = Math.random() > 0.5 ? 'L' : 'R';

		this.finishedSpining = false;
		this.showCoin = true;

		// Every COIN_FLIP_SPEED, flip the coin
		const flipInterval = setInterval(() => {
			this.coinText = this.coinText === 'L' ? 'R' : 'L';
		}, COIN_FLIP_SPEED);

		setTimeout(() => {
			clearInterval(flipInterval);
			this.coinText = predecidedText;
			this.finishedSpining = true;
			console.log('Coin Flipped: ', this.coinText);

			// Hide the coin in 5s
			setTimeout(() => {
				this.showCoin = false;
			}, 5000);
		}, coinSpinTime * 1000);
	}
}
