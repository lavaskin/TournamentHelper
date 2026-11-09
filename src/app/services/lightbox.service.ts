import { Injectable, signal } from '@angular/core';

export interface LightboxImage {
	url: string,
	name: string,
	imageBg: boolean,
}

// Holds the image shown full screen by the app-wide lightbox (rendered once in AppComponent)
@Injectable({
	providedIn: 'root',
})
export class LightboxService {
	private _image = signal<LightboxImage | null>(null);

	public readonly image = this._image.asReadonly();

	public open(image: LightboxImage): void {
		this._image.set(image);
	}

	public close(): void {
		this._image.set(null);
	}
}
