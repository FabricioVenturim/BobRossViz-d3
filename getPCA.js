export async function getPcaResults(clusterSelect, ccpca_button) {
    if (clusterSelect.length === 1) {
      if (ccpca_button % 2 === 1) {
        try {
          const the_pca = await $.ajax({
            url: "http://127.0.0.1:5000/ccpca",
            dataType: "json",
            contentType: "application/json;charset=UTF-8",
            type: "POST",
            data: JSON.stringify({ target_label: clusterSelect[0] })
          });
          return the_pca;
        } catch (error) {
          console.error("Error fetching ccpca:", error);
          // Handle error appropriately
        }
      } else {
        try {
          const the_pca = await $.ajax({
            url: "http://127.0.0.1:5000/initial_pca",
            dataType: "json",
            contentType: "application/json;charset=UTF-8",
            type: "GET"
          });
          return the_pca;
        } catch (error) {
          console.error("Error fetching initial_pca:", error);
          // Handle error appropriately
        }
      }
    } else {
      try {
        const the_pca = await $.ajax({
          url: "http://127.0.0.1:5000/initial_pca",
          dataType: "json",
          contentType: "application/json;charset=UTF-8",
          type: "GET"
        });
        return the_pca;
      } catch (error) {
        console.error("Error fetching initial_pca:", error);
        // Handle error appropriately
      }
    }
  }
  
export async function getClusterResults() {
    let kmeans = await $.ajax({
        url: "http://127.0.0.1:5000/kmeans",
        dataType: "json",
        contentType: "application/json;charset=UTF-8",
        type: "GET"
    });

    return kmeans;
}

export async function getImageUrls() {
    let urls = await $.ajax({
        url: "http://127.0.0.1:5000/get_painting_urls",
        dataType: "json",
        contentType: "application/json;charset=UTF-8",
        type: "GET"
    });
    return urls;
}

export async function getEpisodeNames() {
    let episode_names = await $.ajax({
        url: "http://127.0.0.1:5000/get_episode_names",
        dataType: "json",
        contentType: "application/json;charset=UTF-8",
        type: "GET"
    });
    return episode_names;
}
