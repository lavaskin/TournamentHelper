import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Contestant } from '../../models/contestant';
import { CommonModule } from '@angular/common';

@Component({
	selector: 'app-contestant',
	standalone: true,
	imports: [CommonModule],
	templateUrl: './contestant.component.html',
	styleUrl: './contestant.component.css'
})
export class ContestantComponent {
	@Input() public contestant!: Contestant;
    @Input() public isLeftSide: boolean = false;
    @Input() public isSelected: boolean = false;

    @Output() public onVote: EventEmitter<boolean> = new EventEmitter<boolean>();
    
    public onClick(): void {
        // Tell the parent it's been clicked
        this.onVote.emit(this.isLeftSide);
    }
}
