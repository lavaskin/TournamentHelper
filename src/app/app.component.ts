import { Component, ElementRef, inject, Renderer2, signal, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AlertService } from './services/alert.service';
import { CommonModule } from '@angular/common';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { LightboxComponent } from './components/lightbox/lightbox.component';

@Component({
	selector: 'app-root',
	standalone: true,
	imports: [CommonModule, RouterOutlet, NavBarComponent, LightboxComponent],
	template:`
		<div class="app-wrapper">
			<app-nav-bar></app-nav-bar>

			<router-outlet></router-outlet>

			<app-lightbox />

			<!-- Global Alert Display -->
			@if (showAlert()) {
				<div #alert
					class="alert p"
					(click)="closeAlert()"
					tabindex="0">

					<span>{{ alertMessage() }}</span>
				</div>
			}
		</div>
	`,
	styles: `
		.app-wrapper {
			position: relative;
			background-color: var(--background);
			min-height: 100vh;
		}

		.alert {
			position: fixed;
			top: 1.5rem;

			color: var(--background);
			background-color: var(--text);
			box-shadow: 0 0 0.5rem var(--text);
			padding: 0.75rem 1.25rem;
			border-radius: 0.5rem;
			cursor: pointer;

			left: 50%;
			transform: translateX(-50%);
			z-index: 101;

			animation: slideIn 0.5s ease-in-out;
		}

		.slideOut {
			animation: slideOut 0.5s ease-in-out;
		}

		@keyframes slideIn {
			from {
				top: -10rem;
			}
			to {
				top: 1rem;
			}
		}
		@keyframes slideOut {
			from {
				top: 1rem;
			}
			to {
				top: -10rem;
			}
		}
	`,
})
export class AppComponent {
	private _alertService = inject(AlertService);
	private _renderer = inject(Renderer2);

	public showAlert = signal(false);
	public alertMessage = signal<string | null>(null);
	@ViewChild('alert') alert!: ElementRef;

	ngOnInit() {
		// Subscribe to alert service
		this._alertService.alert$.subscribe((message: string | null) => {
			if (message) {
				this.alertMessage.set(message);
				this.showAlert.set(true);
			} else {
				// Only slide out if there is an alert to slide out
				if (this.alertMessage()) this.slideOutAlert();
			}
		});
	}

	public closeAlert(): void {
		this._alertService.closeAlert();
	}

	private slideOutAlert(): void {
		// Add slideOut class to alert
		this._renderer.addClass(this.alert.nativeElement, 'slideOut');

		// In 500ms, remove the alert from the DOM
		setTimeout(() => {
			this.showAlert.set(false);
		}, 500);
	}
}
