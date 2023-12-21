export function scaleScatterplot(projection, plot_size){

    let xExtent = d3.extent(projection, (d) => d[0]);
    let yExtent = d3.extent(projection, (d) => d[1]);

    let xScale = d3.scaleLinear().domain(xExtent).range([0, plot_size]);

    let yScale = d3.scaleLinear().domain(yExtent).range([plot_size, 0]);

    return {xScale, yScale};
}

export function scalePcaLoadings(x_loading, y_loading, loading_size, plot_size) {
    const xLoadingData = x_loading.map((d) => d.loading);
    const yLoadingData = y_loading.map((d) => d.loading);

    const loadingExtent = d3.extent([...xLoadingData, ...yLoadingData]);

    const maxLoadingValue = Math.max(
      Math.abs(loadingExtent[0]),
      Math.abs(loadingExtent[1])
    );
  
    const loadingScale = d3
      .scaleLinear()
      .domain([-maxLoadingValue, maxLoadingValue])
      .range([loading_size, 0]);
  
    const attributeNames = x_loading.map((d) => d.attribute);
    const attributeScale = d3
      .scaleBand()
      .domain(attributeNames)
      .range([0, plot_size]);
  
    return {loadingScale, attributeScale };
  }

export function scaleClustering(kmeans, clustering_size) {

    let clusterLabels = Array.from(new Set(kmeans.map((d) => d.label)));

    // Ordena os rótulos em ordem crescente
    clusterLabels.sort((a, b) => a - b);

    let clusterScale = d3
        .scaleBand()
        .domain(clusterLabels)
        .range([0, clustering_size])
        .padding(0.1);

    const max = d3.max(kmeans, (d) => {
        const filteredData = kmeans.filter(
            (e) => e.attribute === d.attribute && e.label === d.label
        );
            return d3.sum(filteredData, (e) => e.value);
        });

    let colorScale = d3
        .scaleSequential(d3.interpolate("#FFFFFF", "#003C08"))
        .domain([0, max]);

    return {clusterScale, colorScale};
}