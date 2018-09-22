import { Component, ElementRef, OnInit, Input } from "@angular/core";
import * as d3 from "d3";

@Component({
	selector: "app-star",
	templateUrl: "./star.component.html",
	styleUrls: ["./star.component.css"]
})
export class StarComponent implements OnInit {
	@Input()
	parcial: string;
	numPoints = 5;

	constructor(private element: ElementRef) {}

	ngOnInit() {
		console.log(this.parcial);
		this.generate();
	}

	drawStar(svg, points, parcial, i) {
		const polygon = svg.append("polygon");
		polygon.data([points]);

		polygon.style("stroke", "gold");
		if (parcial * 5 <= i + 0.9) {
			polygon.style("fill", "none");
		} else {
			polygon.style("fill", "gold");
		}

		polygon.attr("points", function(pointsData) {
			return pointsData
				.map(function(point) {
					return [point.x, point.y].join(",");
				})
				.join(" ");
		});
	}

	generate() {
		const width = 50;
		const height = 50;

		const centerX = width / 2;
		const centerY = height / 2;
		const radius = height / 5.2;

		const svg = d3
			.select(this.element.nativeElement)
			.append("svg")
			.attr("width", width)
			.attr("height", height);

		const points = d3.range(this.numPoints).map(i => {
			const angle = -((i / this.numPoints) * Math.PI * 2 + Math.PI + 2.5);
			console.log(angle);
			return {
				x: Math.sin(angle) * radius + centerX,
				y: 2 * centerY - (Math.cos(angle) * radius + centerY)
			};
		});

		points.map((point, i) => {
			const pointsArray = Array();

			pointsArray.push({
				x: centerX,
				y: centerY
			});

			pointsArray.push({
				x: points[i].x,
				y: points[i].y
			});

			pointsArray.push(this.getLineIntersection(points, i));

			pointsArray.push({
				x: points[(i + 1) % this.numPoints].x,
				y: points[(i + 1) % this.numPoints].y
			});

			this.drawStar(svg, pointsArray, this.parcial, i);
		});
	}

	getLineIntersection(points, i) {
		const l1x1 = points[(i + 1) % this.numPoints].x;
		const l1y1 = points[(i + 1) % this.numPoints].y;
		const l1x2 = points[(i + 2) % this.numPoints].x;
		const l1y2 = points[(i + 2) % this.numPoints].y;

		const l2x1 = points[(i + this.numPoints - 0) % this.numPoints].x;
		const l2y1 = points[(i + this.numPoints - 0) % this.numPoints].y;
		const l2x2 = points[(i + this.numPoints - 1) % this.numPoints].x;
		const l2y2 = points[(i + this.numPoints - 1) % this.numPoints].y;

		let denominator, a, b, numerator1, numerator2;
		const result = { x: null, y: null };

		denominator =
			(l2y2 - l2y1) * (l1x2 - l1x1) - (l2x2 - l2x1) * (l1y2 - l1y1);

		if (denominator === 0) {
			return result;
		}

		a = l1y1 - l2y1;
		b = l1x1 - l2x1;
		numerator1 = (l2x2 - l2x1) * a - (l2y2 - l2y1) * b;
		numerator2 = (l1x2 - l1x1) * a - (l1y2 - l1y1) * b;
		a = numerator1 / denominator;
		b = numerator2 / denominator;

		result.x = l1x1 + a * (l1x2 - l1x1);
		result.y = l1y1 + a * (l1y2 - l1y1);

		return result;
	}
}
