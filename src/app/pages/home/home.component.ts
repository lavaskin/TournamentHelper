import { Component } from '@angular/core';
import { Contestant } from '../../models/contestant';
import contestants from '../../data/contestants';
import Utils from '../../utils';
import { ContestantComponent } from '../../components/contestant/contestant.component';
import { CommonModule } from '@angular/common';

@Component({
	selector: 'app-home',
	standalone: true,
	imports: [ContestantComponent, CommonModule],
	templateUrl: './home.component.html',
	styleUrl: './home.component.css'
})
export class HomeComponent {
	private utils: Utils = new Utils();
	public contestants: Contestant[] = [];

	public leftSideSelected: boolean | null = null;

	ngOnInit() {
		const contestantWeightMap = new Map<number, Contestant[]>();

		// Add each contestant to the map based on their weight
		contestants.forEach(contestant => {
			if (!contestantWeightMap.has(contestant.weight)) {
				contestantWeightMap.set(contestant.weight, []);
			}

			contestantWeightMap.get(contestant.weight)!.push(contestant);
		});

		// Randomize the contestants within each weight and add to the contestants array
		contestantWeightMap.forEach(values => {
			// Randomize the array
			const randomized = this.utils.shuffleArray(values);
			this.contestants.push(...randomized);
		});
	}

	public handleVote(isLeftSide: boolean) {
		if (isLeftSide === this.leftSideSelected) {
			this.leftSideSelected = null;
		} else {
			this.leftSideSelected = isLeftSide;
		}
	}
}