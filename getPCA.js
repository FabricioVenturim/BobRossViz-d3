export function changeDatabase(useCcpca, clusterSelect) {
  if (clusterSelect.length === 1) {
      useCcpca = !useCcpca;
  } else {
      useCcpca = false;
  }
  return useCcpca;
}

export async function getPcaResults(clusterSelect, useCcpca) {
    let the_pca;  
    if (useCcpca) {
          the_pca = await $.ajax({
            url: "http://127.0.0.1:5000/ccpca",
            dataType: "json",
            contentType: "application/json;charset=UTF-8",
            type: "POST",
            data: JSON.stringify({ target_label: clusterSelect[0] })
        });
      } else {
          the_pca = await $.ajax({
            url: "http://127.0.0.1:5000/initial_pca",
            dataType: "json",
            contentType: "application/json;charset=UTF-8",
            type: "GET"
          });
        }
      
    return the_pca;
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
