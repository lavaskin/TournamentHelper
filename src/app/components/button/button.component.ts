import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
	selector: 'app-button',
	changeDetection: ChangeDetectionStrategy.Eager,
	standalone: true,
	imports: [CommonModule],
	templateUrl: './button.component.html',
	styleUrl: './button.component.scss'
})
export class ButtonComponent {
	@Input() label!: String;
	@Input() disabled: boolean = false;
}
