import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
	selector: 'app-root',
	standalone: true,
	imports: [RouterOutlet],
	template:`
		<div class="app-wrapper">
			<router-outlet></router-outlet>
		</div>
	`,
	styles: `
		.app-wrapper {
			background-color: #090909;
			min-height: 100vh;
		}
	`,
})
export class AppComponent { }
