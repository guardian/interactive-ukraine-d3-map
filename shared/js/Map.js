import * as d3 from 'd3'
import * as topojson from 'topojson'


export default class Map {

	constructor(width, height, feature, address, scale) {

		this.width = width;
		this.height = height;
		this.projection =  d3.geoMercator().translate([0,0]).scale(1);
		this.path = d3.geoPath().projection(this.projection);
		this.feature = feature;
		this.address = address;
		this.scale = scale;
	}

	makeBackground(node, image) {

		//based on https://datawanderings.com/2020/08/08/raster-backgrounds/   

		const b = this.path.bounds(topojson.feature(this.feature, this.address));

		// scale
		const s = this.scale / Math.min((b[1][0] - b[0][0]) / this.width, (b[1][1] - b[0][1]) / this.height);  
		//const s = projection.scale()

		// transform
		const t = [(this.width - s * (b[1][0] + b[0][0])) / 2, (this.height - s * (b[1][1] + b[0][1])) / 2];

		// update projection
		this.projection
		.scale(s)
		.translate(t)

		// scale and postion
		const raster_width = (b[1][0] - b[0][0]) * s;
		const raster_height = (b[1][1] - b[0][1]) * s;

		const rtranslate_x = (this.width - raster_width) / 2;
		const rtranslate_y = (this.height - raster_height) / 2;

		let defs = node.append('defs')

		defs
		.append('clipPath')
		.attr("id", "clip")
		.attr("width", raster_width)
		.attr("height", raster_height)
		.attr("transform", "translate(" + -rtranslate_x + ", " + -rtranslate_y + ")")
		.append('path')
		.datum(topojson.merge(this.feature, this.address.geometries))
		.attr("d", this.path)

		node.append("image")
		.attr('class', 'raster')
		.attr('clip-path', 'url(#clip)')
		.attr("xlink:href", image)
		.attr("width", raster_width)
		.attr("height", raster_height)
		.attr("transform", "translate(" + rtranslate_x + ", " + rtranslate_y + ")");

	}


	makePath(node, datum, className = null){

		node.append("path")
		.datum(datum)
		.attr('class',className)
		.attr("d", this.path)
	}

	makeDots(node, radius = 5, object = [{name:'', coordinates:[], type:'city', class: 'className'}]){

		object.forEach(o => {


			let geometry = o.type === 'city' ? node.append('circle') : node.append('rect');

			geometry.node().tagName === 'circle'

			?

			geometry
			.attr('class', o.class)
			.attr('r', radius)
			.attr('cx', this.projection(o.coordinates)[0])
			.attr('cy', this.projection(o.coordinates)[1] - radius / 2)

			:

			geometry
			.attr('class', o.class)
			.attr('width', radius * 2)
			.attr('height', radius * 2)
			.attr('x', this.projection(o.coordinates)[0] - radius / 2)
			.attr('y', this.projection(o.coordinates)[1] - radius / 2)
 

		})
	}

	makeLabels(node, object = [{name:'', coordinates:[], type:'city', class: 'className'}]){

		object.forEach(o => {

			switch(o.type){
				case 'country':
				break;
				case '':
				break;
			}


		})

	}
}









