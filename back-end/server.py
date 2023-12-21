import os
import flask
import numpy as np
import argparse
import json
import csv

from flask import Flask
from flask_cors import CORS
import math
from flask import jsonify
import pandas as pd


from ccpca import CCPCA
from opt_sign_flip import OptSignFlip
from mat_reorder import MatReorder

# run kmeans
from sklearn.cluster import KMeans

# create Flask app
app = Flask(__name__)
CORS(app)

# --- these will be populated in the main --- #

# list of attribute names of size m
attribute_names=None

# a 2D numpy array containing binary attributes - it is of size n x m, for n paintings and m attributes
painting_attributes=None

# a list of epsiode names of size n
episode_names=None

# a list of painting image URLs of size n
painting_image_urls=None


def get_pca_data():
    painting_attributes = np.load('painting_attributes.npy')
    attribute_names = json.load(open('attribute_names.json', 'r'))

    # center the data
    mean = np.mean(painting_attributes, axis=0)
    centered = painting_attributes - mean

    # calculate covariance matrix
    cov = np.cov(centered.T)

    # calculate eigenvalues and eigenvectors
    eigvals, eigvecs = np.linalg.eig(cov)

    # sort eigenvectors by eigenvalues
    idx = eigvals.argsort()[::-1]
    eigvecs = -eigvecs[:, idx]
    eigvals = eigvals[idx]

    # project data in 2D
    proj = np.dot(centered, eigvecs[:, :2])

    # create DataFrame for PCA data
    pca_df = pd.DataFrame(proj, columns=['PCA_x', 'PCA_y'])

    return pca_df

def get_kmeans_data():
    painting_attributes = np.load('painting_attributes.npy')
    attribute_names = json.load(open('attribute_names.json', 'r'))

    # Run KMeans clustering
    kmeans = KMeans(n_clusters=6, random_state=42)  # You can adjust the number of clusters as needed
    kmeans.fit(painting_attributes)

    # Get cluster labels
    labels = kmeans.labels_

    # create DataFrame for KMeans data
    kmeans_df = pd.DataFrame({'label': labels})

    return kmeans_df

@app.route('/combined_data', methods=['GET'])
def combined_data():
    # Get PCA and KMeans data
    pca_df = get_pca_data()
    kmeans_df = get_kmeans_data()
    painting_attributes = np.load('painting_attributes.npy')
    painting_attributes = pd.DataFrame(painting_attributes, columns=attribute_names)

    # Combine data
    combined_df = pd.concat([painting_attributes, kmeans_df, pca_df], axis=1)

    return combined_df

'''
This will return an array of strings containing the episode names -> these should be displayed upon hovering over circles.
'''
@app.route('/get_episode_names', methods=['GET'])
def get_episode_names():
    return flask.jsonify(episode_names)
#

'''
This will return an array of URLs containing the paths of images for the paintings
'''
@app.route('/get_painting_urls', methods=['GET'])
def get_painting_urls():
    return flask.jsonify(painting_image_urls)
#

'''
TODO: implement PCA, this should return data in the same format as you saw in the first part of the assignment:
    * the 2D projection
    * x loadings, consisting of pairs of attribute name and value
    * y loadings, consisting of pairs of attribute name and value
'''


@app.route('/initial_pca', methods=['GET'])
def initial_pca():
    painting_attributes = np.load('painting_attributes.npy')
    attribute_names = json.load(open('attribute_names.json','r'))

    with app.app_context():
        # center the data
        mean = np.mean(painting_attributes, axis=0)
        centered = painting_attributes - mean
        # calculate covariance matrix
        cov = np.cov(centered.T)    
        # calculate eigenvalues and eigenvectors
        eigvals, eigvecs = np.linalg.eig(cov)
        # sort eigenvectors by eigenvalues
        idx = eigvals.argsort()[::-1]
        eigvecs =  - eigvecs[:, idx]
        eigvals = eigvals[idx]
        # project data in 2D
        proj = np.dot(centered, eigvecs[:, :2])
        # calculate loadings
        x_loadings = []
        y_loadings = []
        for i in range(len(attribute_names)):
            x_loadings.append({'attribute': attribute_names[i], 'loading': eigvecs[i, 0]})
            y_loadings.append({'attribute': attribute_names[i], 'loading': eigvecs[i, 1]})
        # add index to each data point in proj
        proj = np.hstack((proj, np.arange(len(proj)).reshape(-1, 1)))
    # return data   
        return flask.jsonify({'projection': proj.tolist(), 'x_loadings': x_loadings, 'y_loadings': y_loadings})


'''
TODO: implement ccPCA here. This should return data in _the same format_ as initial_pca above.
It will take in a list of data items, corresponding to the set of items selected in the visualization. This can be acquired from `flask.request.json`. This should be a list of data item indices - the **target set**.
The alpha value, from the paper, should be set to 1.1 to start, though you are free to adjust this parameter.
'''
@app.route('/ccpca', methods=['GET','POST'])
def ccpca():

    if flask.request.method == 'POST':  
        target_label = flask.request.json['target_label']

    # load data
    data = pd.read_csv('data.csv')

    X = data.iloc[:, :-3]
    y = np.int_(data.iloc[:, -3])

    with app.app_context():
        attribute_names = json.load(open('attribute_names.json','r'))
    
        # apply ccpca
        ccpca = CCPCA(n_components=2)
        ccpca.fit(
            X[y == target_label],
            X[y != target_label],
            var_thres_ratio=0.5,
            n_alphas=40,
            max_log_alpha=0.5)

        # get results
        cpca_result = ccpca.transform(X)
        cpca_fcs = ccpca.get_feat_contribs()
        x_loadings = []
        y_loadings = []
        for i in range(len(attribute_names)):
            x_loadings.append({'attribute': attribute_names[i], 'loading': cpca_fcs.tolist()[i]})
            y_loadings.append({'attribute': attribute_names[i], 'loading': cpca_fcs.tolist()[i]})
        
        # add index to each data point in cpca_result
        cpca_result = np.hstack((cpca_result, np.arange(len(cpca_result)).reshape(-1, 1)))

        return flask.jsonify({'projection': cpca_result.tolist(), 'x_loadings': x_loadings, 'y_loadings': y_loadings})


'''
TODO: run kmeans on painting_attributes, returning data in the same format as in the first part of the assignment. Namely, an array of objects containing the following properties:
    * label - the cluster label
    * id: the data item's id, simply its index
    * attribute: the attribute name
    * value: the binary attribute's value
'''
@app.route('/kmeans', methods=['GET'])
def kmeans():
    # Load data
    painting_attributes = np.load('painting_attributes.npy')
    attribute_names = json.load(open('attribute_names.json','r'))

    with app.app_context():
        # Run KMeans clustering
        kmeans = KMeans(n_clusters=6, random_state=42)  # You can adjust the number of clusters as needed
        kmeans.fit(painting_attributes)

        # Get cluster labels
        labels = kmeans.labels_

        # Prepare the result in the desired format
        result = []
        for i in range(len(labels)):
            for j in range(len(attribute_names)):
                result.append({
                    'label': int(labels[i]),
                    'id': i,
                    'attribute': attribute_names[j],
                    'value': int(painting_attributes[i, j])
                })

        return jsonify(result)

#

if __name__=='__main__':
    painting_image_urls = json.load(open('painting_image_urls.json','r'))
    attribute_names = json.load(open('attribute_names.json','r'))
    episode_names = json.load(open('episode_names.json','r'))
    painting_attributes = np.load('painting_attributes.npy')
    app.run()
#
