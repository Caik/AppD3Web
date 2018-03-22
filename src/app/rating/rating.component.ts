import { Component, OnInit, Input } from "@angular/core";

@Component({
	selector: "app-rating",
	templateUrl: "./rating.component.html",
	styleUrls: ["./rating.component.css"]
})
export class RatingComponent implements OnInit {
	stars;
	@Input() value: number;
	Math: any;

	constructor() {
		this.Math = Math;
	}

	ngOnInit() {
		this.stars = Array(parseInt(this.value.toString(), 10)).fill(4);
	}
}
