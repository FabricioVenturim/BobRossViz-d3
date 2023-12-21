export function create_scatterplot(g, projection, xScale, yScale, filteredPoints, filteredAttribute, EpisodeNames, image_urls, kmeans_data) {
  const circles = g
    .selectAll("circle.scatterplot-circle")
    .data(projection, (d) => d[2])
    .join(
      (enter) =>
        enter
          .append("circle")
          .attr("cx", (d) => xScale(d[0]))
          .attr("cy", (d) => yScale(d[1]))
          .attr("r", 5)
          .attr("class", "scatterplot-circle"),
      (update) =>
        update
          .transition()
          .duration(10000)
          .attr("cx", (d) => d[2])
          .attr("cy", (d) => d[2])
          .style("fill-opacity", 1)
          .attr("data-identifier", (d) => d[2]),
      (exit) => exit.remove()
    )
    .style("fill", (d) =>
      filteredPoints.some(
        (id) => projection[id][0] === d[0] && projection[id][1] === d[1]
      )
        ? "green"
        : "black"
    )
    .style("fill-opacity", (d) =>
      filteredPoints.some(
        (id) => projection[id][0] === d[0] && projection[id][1] === d[1]
      )
        ? "0.7"
        : "0.2"
    )
    .on("mouseover", function (event, d, i) {
      d3.select(this).style("fill", "red").style("fill-opacity", 0.7);

      const dataIndex = projection.findIndex(
        (point) => point[0] === d[0] && point[1] === d[1]
      );

      const episodeTitle = EpisodeNames[dataIndex];
      const xPosition = xScale(d[0]);
      const yPosition = yScale(d[1]);
      const episodeTitleWidth = episodeTitle.length * 8;

      tooltip
        .style("display", "block")
        .attr("transform", `translate(${xPosition},${yPosition - 25})`);

      tooltip
        .append("rect")
        .attr("width", episodeTitleWidth)
        .attr("height", 20)
        .attr("fill", "lightgray")
        .attr("stroke", "black")
        .attr("stroke-width", 1);

      tooltip
        .append("text")
        .attr("x", episodeTitleWidth / 2)
        .attr("y", 10)
        .style("text-anchor", "middle")
        .style("alignment-baseline", "middle")
        .text(episodeTitle)
        .style("font-size", 12);

      tooltip
        .append("image")
        .attr("xlink:href", `http://127.0.0.1:5000/${image_urls[dataIndex]}`)
        .attr("x", 0)
        .attr("y", -0.74888888888 * episodeTitleWidth)
        .attr("width", episodeTitleWidth);

      filteredAttribute.length = 0;

      d3.select(this).each(function (d) {
        kmeans_data.forEach((point) => {
          if (point.id === dataIndex && point.value === 1) {
            filteredAttribute.push(point.attribute);
          }
        });
      });
      updateBarsText(filteredAttribute);
    })

    .on("mouseout", function () {
      updateScatterplot(filteredPoints, projection);
      filteredAttribute.length = 0;
      updateBarsText(filteredAttribute);

      // Esconde a caixa com cor e borda ao redor do texto
      tooltip.style("display", "none");
      tooltip.selectAll("*").remove(); // Remove os elementos dentro da caixa ao esconder
    });

  const tooltip = g
    .append("g")
    .attr("class", "tooltip")
    .style("display", "none");

  // Create axes from our scales
  const xAxis = d3.axisTop(xScale).ticks(6);
  const yAxis = d3.axisLeft(yScale).ticks(6);

  // Adiciona eixo x no topo
  g.append("g").call(xAxis);

  // Adiciona eixo y
  g.append("g").call(yAxis);
}

export function create_x_loading(g, x_loading, loadingScale, attributeScale, bandwidth, attributes, loading_size, plot_size) {
    // create a single line that will span zero for our loading value, positioned at the center of the view
    g.append("line")
        .attr("y1", loading_size / 2)
        .attr("x1", 0)
        .attr("y2", loading_size / 2)
        .attr("x2", plot_size)
        .attr("stroke", "black");

    // perform data join on `x_loading` to create bars, using our band scale to position bar horizontally, and the linear scale to determine the bar's y position and height.

    const y = (d) =>
        d.loading > 0
            ? loadingScale(d.loading)
            : loadingScale(0);

        const height = (d) =>
        d.loading > 0
            ? loading_size / 2 - loadingScale(d.loading)
            : loadingScale(d.loading) - loading_size / 2;

    const bars = g
        .selectAll(".x-loading-bar")
        .data(x_loading)
        .enter()
        .append("rect")
        .attr("class", "x-loading-bar")
        .attr("x", (d) => attributeScale(d.attribute))
        .attr("y", loading_size)
        .attr("width", bandwidth)
        .attr("height", 0) // Inicialmente, a altura é zero
        .attr("fill", (d) => (d.loading < 0 ? "#AD7476" : "#488E9F"))
        .attr("y", y) // A altura final (y) conforme calculado em sua função `y`
        .attr("height", height); // A altura final (height) conforme calculado em sua função `height`

    const barsText = g
        .selectAll(".x-loading-barsText")
        .data(x_loading)
        .enter()
        .append("rect")
        .attr("class", "x-loading-barsText")
        .attr("x", (d) => attributeScale(d.attribute))
        .attr("y", loading_size)
        .attr("width", bandwidth)
        .attr("height", 120)
        .attr("fill", "white")
        .attr("stroke", "black")
        .attr("stroke-width", 1);

    g.selectAll(".x-loading-label")
        .data(attributes)
        .enter()
        .append("text")
        .attr("class", "x-loading-label")
        .attr(
            "transform",
            (d) =>
            `translate(${
                attributeScale(d) + bandwidth / 2.5
            }, ${loading_size}) rotate(90)`
        )
        .text((d) => d)
        .style("font-size", "10px");
    }

export function create_y_loading(g, y_loading, loadingScale, attributeScale, bandwidth, attributes, loading_size, plot_size) {  

    g.append("line")
      .attr("x1", loading_size / 2)
      .attr("y1", 0)
      .attr("x2", loading_size / 2)
      .attr("y2", plot_size)
      .attr("stroke", "black");
  
    // perform data join on `y_loading` to create bars, using our band scale to position bar vertically, and the linear scale to determine the bar's x position and width.
  
    const x = (d) =>
      d.loading > 0
        ? loadingScale(d.loading)
        : loadingScale(0);
  
    const width = (d) =>
      d.loading > 0
        ? loading_size / 2 - loadingScale(d.loading)
        : loadingScale(d.loading) - loading_size / 2;
  
    const bars = g
      .selectAll("rect")
      .data(y_loading)
      .enter()
      .append("rect")
      .attr("x", x)
      .attr("width", width)
      .attr("y", (d) => attributeScale(d.attribute))
      .attr("height", bandwidth)
      .attr("fill", (d) => (d.loading < 0 ? "#AD7476" : "#488E9F"));
  
    // create a text label for each attribute name, can be accomplished via data join on `attribute_names`, requires specifying a transform that translates the bar
    const labels = g
      .selectAll("text")
      .data(y_loading)
      .enter()
      .append("text")
      .text((d) => d.attribute)
      .attr("x", loading_size)
      .attr(
        "y",
        (d) =>
          attributeScale(d.attribute) +
          bandwidth / 1.5
      )
      .style("font-size", "10px");
  }

export function create_clustering( g, kmeans_data, projection, clusterScale, colorScale, attributeScale, bandwidth, clusterSelect, filteredPoints) {
    const clusters = g
        .selectAll(".cluster")
        .data(kmeans_data)
        .enter()
        .append("g")
        .attr("class", "cluster")
        .attr(
        "transform",
        (d) => `translate(0, ${clusterScale(d.label)})`
        );
        

    const circles = clusters
        .append("circle")
        .attr("class", "cluster-circle")
        .attr("cx", -20)
        .attr("cy", bandwidth/2)
        .attr("r", 8)
        .style("fill", (d) => (clusterSelect.includes(d.label) ? "green" : "gray"))
        .on("click", function (event, d) {
        const isSelected = clusterSelect.includes(d.label);
    
        if (!isSelected) {
            clusterSelect.push(d.label);
        } else {
            const indexToRemove = clusterSelect.indexOf(d.label);
            if (indexToRemove !== -1) {
            clusterSelect.splice(indexToRemove, 1);
            }
        }
    
        d3.select(this).style("fill", (d) =>
            clusterSelect.includes(d.label) ? "green" : "gray"
        );
    
        togglePoints(filteredPoints, clusterSelect, kmeans_data);
        updateScatterplot(filteredPoints, projection);
        });
    
    const attributes = clusters.selectAll(".attribute").data((d) => [d]);


    const rectangles = attributes
        .enter()
        .append("rect")
        .attr("class", "attribute")
        .attr("x", (d) => attributeScale(d.attribute))
        .attr("width", bandwidth)
        .attr("y", 0)
        .attr("height", bandwidth)
        .style("fill", (d) => {
        const filteredData = kmeans_data.filter(
            (e) => e.attribute === d.attribute && e.label === d.label
        );
        return colorScale(d3.sum(filteredData, (e) => e.value));
        })
        .attr("stroke", "black")
        .attr("stroke-width", 1);
    }


function updateScatterplot(filteredPoints, projection){
    d3.selectAll("circle.scatterplot-circle")
      .style("fill", (d) => {
        // Verifique se o ponto está no array filteredPoints
        return filteredPoints.some(
          (id) => projection[id][0] === d[0] && projection[id][1] === d[1]
        )
          ? "green"
          : "black";
      })
      .style("fill-opacity", (d) => {
        // Verifique se o ponto está no array filteredPoints
        return filteredPoints.some(
          (id) => projection[id][0] === d[0] && projection[id][1] === d[1]
        )
          ? "0.7"
          : "0.2";
      });
  }


function togglePoints(filteredPoints, clusterSelect, kmeans_data) {
    // Clear the existing content of filteredPoints array
    filteredPoints.length = 0;
  
    // Use each to iterate over kmeans_data and add corresponding points
    kmeans_data.forEach((point) => {
      // Alteração: Verifica se o label está presente no array clusterSelect
      if (clusterSelect.includes(point.label)) {
        filteredPoints.push(point.id);
      }
    });
  }


function updateBarsText (filteredAttribute) {
    d3.selectAll(".x-loading-barsText")
      .attr("fill", (d) =>
        filteredAttribute.includes(d.attribute) ? "black" : "white"
      )
      .style("fill-opacity", 0.2);
  }

