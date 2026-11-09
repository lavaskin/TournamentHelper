import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import tournaments from '../../data/tournaments.data';
import { routes } from '../../app.routes';
import { LightboxService } from '../../services/lightbox.service';
import { NavBarComponent } from '../nav-bar/nav-bar.component';
import { LightboxComponent } from './lightbox.component';

const tournament = tournaments.find(t => t.contestants.length >= 8)!;

const escape = () => document.body.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));

describe('LightboxComponent', () => {
	beforeEach(() => {
		localStorage.clear();
		TestBed.configureTestingModule({ providers: [provideRouter(routes)] });
	});

	it('shows the open image with its name, and closes on click or Escape', () => {
		const fixture = TestBed.createComponent(LightboxComponent);
		const lightbox = TestBed.inject(LightboxService);
		const el: HTMLElement = fixture.nativeElement;

		lightbox.open({ url: '/a.png', name: 'Contestant A', imageBg: true });
		fixture.detectChanges();
		expect(el.querySelector('img')!.getAttribute('src')).toBe('/a.png');
		expect(el.querySelector('img')!.classList).toContain('image-bg');
		expect(el.querySelector('.caption')!.textContent!.trim()).toBe('Contestant A');
		expect(document.body.style.overflow).toBe('hidden');

		(el.querySelector('.lightbox') as HTMLElement).click();
		fixture.detectChanges();
		expect(el.querySelector('.lightbox')).toBeNull();
		expect(document.body.style.overflow).toBe('');

		lightbox.open({ url: '/a.png', name: 'Contestant A', imageBg: false });
		fixture.detectChanges();
		escape();
		fixture.detectChanges();
		expect(el.querySelector('.lightbox')).toBeNull();
	});

	it('opens from a bracket image, and Escape closes only the lightbox over the bracket overlay', async () => {
		const nav = TestBed.createComponent(NavBarComponent);
		const lightboxFixture = TestBed.createComponent(LightboxComponent);
		await TestBed.inject(Router).navigateByUrl(`/t/${tournament.slug}/play`);
		nav.detectChanges();

		const navEl: HTMLElement = nav.nativeElement;
		[...navEl.querySelectorAll('li')].find(li => li.textContent!.trim() === 'bracket')!.click();
		nav.detectChanges();

		const image = navEl.querySelector('.bracket-overlay .slot img') as HTMLImageElement;
		image.click();
		lightboxFixture.detectChanges();

		const lightboxEl: HTMLElement = lightboxFixture.nativeElement;
		expect(lightboxEl.querySelector('.lightbox img')!.getAttribute('src')).toBe(image.getAttribute('src'));
		expect(lightboxEl.querySelector('.caption')!.textContent!.trim()).toBe(image.alt);

		escape();
		nav.detectChanges();
		lightboxFixture.detectChanges();
		expect(lightboxEl.querySelector('.lightbox')).toBeNull();
		expect(navEl.querySelector('.bracket-overlay')).not.toBeNull();

		escape();
		nav.detectChanges();
		expect(navEl.querySelector('.bracket-overlay')).toBeNull();
	});
});
