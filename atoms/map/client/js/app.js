import * as d3 from 'd3'
import * as topojson from 'topojson'
import Map from 'shared/js/Map'
import geo from 'assets/ukraine-moscow.json'
//import disputed from 'assets/disputed.json'
//import output from 'assets/output.json'
import ScrollyTeller from "shared/js/scrollyteller";
import deployments from 'assets/deployments.json'

console.log(deployments)


const cities = [
{name:'Kiev', coordinates:[30.523399,50.450100], type:'capital'},
{name:'Moscow', coordinates:[37.617298,55.755825], type:'capital'},
{name:'Kaliningrad', coordinates:[20.5,54.7], type:'city', class:'Kaliningrad'}
]

const countries = [
{name:'Ukraine', coordinates:[30.523399,50.450100], type:'country'},
{name:'Belarus', coordinates:[30.523399,50.450100], type:'country'}
]

//const troops = deployments.map(d => {return {coordinates:[d.Longitude, d.Latitude], type:'city', class:d['Simplified type']}})

const isMobile = window.matchMedia('(max-width: 600px)').matches;

const atomEl = d3.select('.gv-wrapper').node();
const width = 860
const height = isMobile ? width * 1.2 : width * .6;

const svg = d3.select('.gv-wrapper').append("svg")
.attr("class","svg")
/*.attr('width', width)
.attr('height', height)*/
.attr("viewBox", `0 -50 ${width} ${height}`)
//.attr("viewBox", `0 0 ${width} ${height}`)
//.attr("viewBox", `${isMobile ? 1500 : 900} ${isMobile ? 400 : 170} ${width} ${height}`)
//.classed("svg-content", true);


const map = new Map(width, height, geo, geo.objects.countries, 1.4)
//const map = new Map(width, height, geo, geo.objects.countries, 1.4)
//const map = new Map(width, height, geo, geo.objects.countries, 1)

map.makeBackground(svg, `<%= path %>/map.jpg`)

d3.select('raster').style('display', 'none')

/*map.makePath(svg, topojson.mesh(geo, geo.objects['clipped-4326'], (a,b) => a !== b), 'border')

map.makePath(svg, topojson.mesh(disputed, disputed.objects.disputed), 'disputed')

map.makePath(svg, topojson.feature(output, output.objects.water), 'water')*/

//map.makePath(svg, topojson.feature(geo, geo.objects.countries), 'country')

map.makePath(svg, topojson.feature(geo,geo.objects.water), 'water')

map.makePath(svg, topojson.mesh(geo, geo.objects.borders), 'border')

map.makePath(svg, topojson.feature(geo, geo.objects.disputed), 'disputed')

map.makePath(svg, topojson.mesh(geo, geo.objects.roads), 'road')

//map.makeDots(svg, 3, cities)



/*svg.selectAll('vlah')
.data(topojson.feature(deployments, deployments.objects['Troop deployments']).features)
.enter()
.append('circle')
.attr('r', 3)
.attr('class', d => d.properties.Simplified)
.attr('cx', d => map.getPoints([d.properties.Longitude, d.properties.Latitude])[0])
.attr('cy', d => map.getPoints([d.properties.Longitude, d.properties.Latitude])[1])
.style('stroke-width', d => d.properties.Status === 'New' ? 2 : 0 )
.style('stroke', 'black' )*/
//.attr('cy', d => map.getProjection([d.properties.Latitude, d.properties.])[1])
//map.makeDots(svg, isMobile ? 6 : 3, troops)

const scrolly = new ScrollyTeller({
	parent: document.querySelector("#scrolly-1"),
    triggerTop: .5, // percentage from the top of the screen that the trigger should fire
    triggerTopMobile: 0.75,
    transparentUntilActive: isMobile ? false : true
});

scrolly.addTrigger({num: 1, do: () => {

	map.scaleImage(1.4)
	svg.attr("viewBox", `0 -50 ${width} ${height}`)

	
}})

scrolly.addTrigger({num: 2, do: () => {

	//svg.attr("viewBox", `0 0 ${width} ${height}`)

	map.scaleImage(1, d => {

		svg.attr("viewBox", `0 0 ${width} ${height}`)

	})

	
}})

scrolly.watchScroll();


