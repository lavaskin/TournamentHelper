import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject, takeUntil, timer } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class AlertService {
	private alertSubject = new BehaviorSubject<string | null >(null);
	private closeSubject = new Subject<void>();
	public alert$ = this.alertSubject.asObservable();

	public showAlert(message: string, destruct: number = 2000): void {
		this.alertSubject.next(message);

		if (destruct) {
			timer(destruct)
				.pipe(takeUntil(this.closeSubject))
				.subscribe(() => {
					this.closeAlert();
				});
		}
	}

	public closeAlert(): void {
		this.closeSubject.next();
		this.alertSubject.next(null);
	}
}