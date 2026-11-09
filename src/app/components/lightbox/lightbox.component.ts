import { Component, DestroyRef, effect, inject, linkedSignal } from '@angular/core';
import { LightboxService } from '../../services/lightbox.service';

// Shows the lightbox service's image fitted to the screen. Clicking anywhere or pressing Escape closes it.
@Component({
	selector: 'app-lightbox',
	standalone: true,
	templateUrl: './lightbox.component.html',
	styleUrl: './lightbox.component.scss',
	host: {
		'(document:keydown.escape)': 'onEscape($event)',
	},
})
export class LightboxComponent {
	public lightbox = inject(LightboxService);

	// Width / height of the open image once it's loaded, used to fit it to the screen
	public ratio = linkedSignal({
		source: this.lightbox.image,
		computation: (): number | null => null,
	});

	constructor() {
		// Stop the page scrolling behind the lightbox
		effect(() => {
			document.body.style.overflow = this.lightbox.image() ? 'hidden' : '';
		});
		inject(DestroyRef).onDestroy(() => document.body.style.overflow = '');
	}

	// Document listeners run before window ones, so stopping here keeps the nav bar's Escape
	// (on window) from also closing the bracket overlay underneath
	public onEscape(event: Event): void {
		if (!this.lightbox.image()) return;

		event.stopPropagation();
		this.lightbox.close();
	}

	public onLoad(image: HTMLImageElement): void {
		if (image.naturalWidth && image.naturalHeight) {
			this.ratio.set(image.naturalWidth / image.naturalHeight);
		}
	}
}
