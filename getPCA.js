export function changeDatabase(useCcpca, clusterSelect) {
    if (clusterSelect.length === 1) {
        useCcpca = !useCcpca;
    } else {
        useCcpca = false;
    }
    return useCcpca;
}

async function fetchData(url, method, data) {
    try {
        const response = await $.ajax({
            url,
            dataType: "json",
            contentType: "application/json;charset=UTF-8",
            type: method,
            data: data ? JSON.stringify(data) : undefined,
        });
        return response;
    } catch (error) {
        console.error('Error fetching data:', error);
        alert('Error fetching data. Note: To generate the data and create the chart, you need to run the server.py file.');
        throw error;
    }
}

export async function getPcaResults(clusterSelect, useCcpca) {
    const apiUrl = useCcpca ? "http://127.0.0.1:5000/ccpca" : "http://127.0.0.1:5000/initial_pca";
    return fetchData(apiUrl, useCcpca ? "POST" : "GET", useCcpca ? { target_label: clusterSelect[0] } : undefined);
}

export async function getClusterResults() {
    const apiUrl = "http://127.0.0.1:5000/kmeans";
    return fetchData(apiUrl, "GET");
}

export async function getImageUrls() {
    const apiUrl = "http://127.0.0.1:5000/get_painting_urls";
    return fetchData(apiUrl, "GET");
}

export async function getEpisodeNames() {
    const apiUrl = "http://127.0.0.1:5000/get_episode_names";
    return fetchData(apiUrl, "GET");
}
