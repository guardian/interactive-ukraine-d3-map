import * as d3 from 'd3'
import * as topojson from 'topojson'
/*import countries from 'assets/countries.json'
import sightings from 'assets/sightings.json'
import roads from 'assets/roads-buffer.json'
import disputed from 'assets/disputed.json'
import dnieper from 'assets/dnieper.json'*/
import Map from 'shared/js/Map'
import geo from 'assets/output.json'
import ScrollyTeller from "shared/js/scrollyteller";
import deployments from 'shared/data/units.csv'


const cities = [
{name:'Kiev', coordinates:[30.523399,50.450100], type:'capital'},
{name:'Moscow', coordinates:[37.617298,55.755825], type:'capital'}/*,
{name:'Rostov', coordinates:[39.6576475,47.2391005], type:'city'}*/
]

const troops = deployments.map(d => {return {coordinates:[d.Longitude, d.Latitude], type:'city', class:d['Simplified type']}})

console.log(troops)

const isMobile = window.matchMedia('(max-width: 600px)').matches;

const atomEl = d3.select('.gv-wrapper').node();
const width = 860
const height = isMobile ? width * 1.2 : width * .6;

const svg = d3.select('.gv-wrapper').append("svg")
.attr("class","svg")
.attr("viewBox", `${isMobile ? 1500 : 900} ${isMobile ? 400 : 170} ${width} ${height}`)
.classed("svg-content", true);


const map = new Map(width, height, geo, geo.objects.countries, isMobile ? 7 : 8.5)

map.makeBackground(svg, `<%= path %>/ukraine.png`)

map.makePath(svg, topojson.feature(geo,geo.objects.water), 'water')

map.makePath(svg, topojson.mesh(geo, geo.objects.boundaries), 'border')

map.makePath(svg, topojson.feature(geo, geo.objects.disputed), 'disputed')

map.makePath(svg, topojson.mesh(geo, geo.objects.roads), 'road')

map.makeDots(svg, 3, cities)

map.makeDots(svg, isMobile ? 6 : 3, troops)

/*

map.makePath(svg, topojson.feature(disputed, disputed.objects.disputed), 'disputed')

map.makePath(svg, topojson.mesh(countries, countries.objects.countries, (a,b) =>  a !== b ), 'border')

map.makePath(svg, topojson.mesh(roads, roads.objects['roads-buffer']), 'road')

map.makeDots(svg, 3, cities)

map.makeDots(svg, isMobile ? 6 : 3, troops)
*/
const scrolly = new ScrollyTeller({
	parent: document.querySelector("#scrolly-1"),
    triggerTop: .5, // percentage from the top of the screen that the trigger should fire
    triggerTopMobile: 0.75,
    transparentUntilActive: isMobile ? false : true
});

scrolly.watchScroll();


