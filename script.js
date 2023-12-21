import { getPcaResults, getClusterResults, getImageUrls, getEpisodeNames } from './getPCA.js';
import { scaleScatterplot, scalePcaLoadings, scaleClustering } from './scales.js';
import { create_scatterplot, create_x_loading, create_y_loading, create_clustering} from './plot.js';

const margin = 40;
const attribute_pad = 20;
const plot_size = 500;
const loading_size = 80;
const clustering_size = 160;
const total_height = plot_size+loading_size+clustering_size+5*margin;

let clusterSelect = [];
let filteredPoints = [];
let filteredAttribute = [];

let ccpca_button = 0;

// PCA
const pca = await getPcaResults(clusterSelect, ccpca_button);
let projection = pca.projection;
let x_loading = pca.x_loadings;
let y_loading = pca.y_loadings;
const kmeans = await getClusterResults();
const urls = await getImageUrls();
const EpisodeNames = await getEpisodeNames();
const attributes = x_loading.map((d) => d.attribute);

// Scales
const { xScale, yScale } = scaleScatterplot(projection, plot_size);
const { loadingScale, attributeScale } = scalePcaLoadings(x_loading, y_loading, loading_size, plot_size);
const { clusterScale, colorScale } = scaleClustering(kmeans, clustering_size);
const bandwidth = attributeScale.bandwidth();

console.log(attributeScale());

// SVG

let svg = d3.create("svg").attr("height", total_height).attr("width", plot_size + loading_size + 2 * margin);
// central plot: provide for margins for drawing axes
let central_plot = svg
    .append("g")
    .attr("transform", `translate(${margin},${margin})`);

// loading view for x axis
let x_loading_g = central_plot
    .append("g")
    .attr("transform", `translate(0,${plot_size})`);
// loading view for y axis
let y_loading_g = central_plot
    .append("g")
    .attr("transform", `translate(${plot_size},0)`);

// scatterplot view
let scatterplot_g = central_plot.append("g");

// cluster view
let cluster_g = central_plot
    .append("g")
    .attr(
        "transform",
        `translate(0,${
        plot_size + 2 * attribute_pad + loading_size + 2 * margin
        })`
    );

// frame our views, so we can see what we are working with
x_loading_g
    .append("rect")
    .attr("width", plot_size)
    .attr("height", loading_size)
    .attr("fill", "none")
    .attr("stroke", d3.hcl(0, 0, 30))
    .attr("stroke-width", 0.8);

y_loading_g
    .append("rect")
    .attr("width", loading_size)
    .attr("height", plot_size)
    .attr("fill", "none")
    .attr("stroke", d3.hcl(0, 0, 30))
    .attr("stroke-width", 0.8);
scatterplot_g
    .append("rect")
    .attr("width", plot_size)
    .attr("height", plot_size)
    .attr("fill", "none")
    .attr("stroke", d3.hcl(0, 0, 30))
    .attr("stroke-width", 0.8);
cluster_g
    .append("rect")
    .attr("width", plot_size)
    .attr("height", clustering_size)
    .attr("fill", "none")
    .attr("stroke", d3.hcl(0, 0, 30))
    .attr("stroke-width", 0.8);

// Anexe o SVG ao corpo do HTML
document.body.appendChild(svg.node());

// scatterplot
create_scatterplot(scatterplot_g, projection, xScale, yScale, filteredPoints, filteredAttribute, EpisodeNames, urls, kmeans);

// // x loading
create_x_loading(x_loading_g, x_loading, loadingScale, attributeScale, bandwidth, attributes, loading_size, plot_size);

// y loading
create_y_loading(y_loading_g, y_loading, loadingScale, attributeScale, bandwidth, attributes, loading_size, plot_size);

// clustering
create_clustering(cluster_g, kmeans, projection, clusterScale, colorScale, attributeScale, bandwidth, clusterSelect, filteredPoints);