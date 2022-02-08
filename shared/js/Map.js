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
		this.image;
		this.b;
		this.s;
		this.t;
	}

	makeBackground(node, image) {

		//based on https://datawanderings.com/2020/08/08/raster-backgrounds/   

		this.b = this.path.bounds(topojson.feature(this.feature, this.address));

		// scale
		this.s = this.scale / Math.min((this.b[1][0] - this.b[0][0]) / this.width, (this.b[1][1] - this.b[0][1]) / this.height);  
		//const s = projection.scale()

		// transform
		this.t = [(this.width - this.s * (this.b[1][0] + this.b[0][0])) / 2, (this.height - this.s * (this.b[1][1] + this.b[0][1])) / 2];

		// update projection
		this.projection
		.scale(this.s)
		.translate(this.t)

		// scale and postion
		const raster_width = (this.b[1][0] - this.b[0][0]) * this.s;
		const raster_height = (this.b[1][1] - this.b[0][1]) * this.s;

		const rtranslate_x = (this.width - raster_width) / 2;
		const rtranslate_y = (this.height - raster_height) / 2;


		this.image = node.append("image")
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


	scaleImage(scale, callback = null){

		const s = scale / Math.min((this.b[1][0] - this.b[0][0]) / this.width, (this.b[1][1] - this.b[0][1]) / this.height);  
		//const s = projection.scale()

		// transform
		const t = [(this.width - s * (this.b[1][0] + this.b[0][0])) / 2, (this.height - s * (this.b[1][1] + this.b[0][1])) / 2];

		// update projection
		this.projection
		.scale(s)
		.translate(t)

		// scale and postion
		const raster_width = (this.b[1][0] - this.b[0][0]) * s;
		const raster_height = (this.b[1][1] - this.b[0][1]) * s;

		const rtranslate_x = (this.width - raster_width) / 2;
		const rtranslate_y = (this.height - raster_height) / 2;

		this.image
		.transition()
		.duration(500)
		.attr("width", raster_width)
		.attr("height", raster_height)
		.attr("transform", "translate(" + rtranslate_x + ", " + rtranslate_y + ")");

		d3.selectAll('path')
		.transition()
		.duration(500)
		.attr("d", this.path)
		.on('end', callback != null ? callback('end') : null )


	}

	scalePath(){

		

	}


	

	/*makeDots(node, radius = 5, object = [{name:'', coordinates:[], type:'city', class: 'className'}]){

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
				case 'capital':
				break;
				case 'city':
				break;
			}


		})

	}

	getPoints(longLat){

		return this.projection(longLat)
	}*/
}









