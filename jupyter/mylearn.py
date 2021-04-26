import librosa
import numpy as np
import sklearn.cluster
import sklearn.mixture
from sklearn.preprocessing import scale
from sklearn.metrics.cluster import homogeneity_completeness_v_measure
from sklearn.metrics import silhouette_score
from itertools import groupby

import myhelpers

def normaliseFeatures(features):
    (nr_keystrokes, nr_mfcc_features, nr_frames) = features.shape
    print (f'Normalising {nr_keystrokes} keystrokes, with {nr_mfcc_features} features and {nr_frames} frames per sample')
    
    # features have shape (nr_keystrokes, nr_mfcc_features, nr_frames)
    # first move nr_mfcc_features axis to the front so we get (nr_mfcc_features, nr_keystrokes, nr_frames)
    X1 = np.moveaxis(features, 1, 0)
    # then reshape to make it a 2D (nr_mfcc_features, nr_keystrokes*nr_frames) array
    X2 = X1.reshape(nr_mfcc_features, nr_keystrokes*nr_frames)
    # Normalise
    X3 = scale(X2, axis=1, with_mean=True, with_std=True, copy=True)
    # back to (nr_mfcc_features, nr_keystrokes, nr_frames)
    X4 = X3.reshape(nr_mfcc_features, nr_keystrokes, nr_frames)
    # back to (nr_keystrokes, nr_mfcc_features, nr_frames)
    X5 = np.moveaxis(X4, 0, 1)
    
    return X5

def addFeatures(data):
    sr = data['sr']
    wavs = data['keystroke_wavs']
    srms = int(sr/1000)

    hop_length = int(2.5*srms)
    window_length = int(10*srms)
    
    print('getFeatures: mfcc')
    data['mfcc_features'] = np.array([librosa.feature.mfcc(wav, sr, n_mfcc=32, win_length=window_length, hop_length=hop_length) for wav in wavs])
    print('getFeatures: Normalise')
    data['normalised_mfcc_features'] = normaliseFeatures(data['mfcc_features'])
    print('getFeatures: Get mfcc_max')
    data['mfcc_max'] = scale(np.max(data['normalised_mfcc_features'], axis=2))
    print('getFeatures: Get mfcc_mean')
    data['mfcc_mean'] = scale(np.mean(data['normalised_mfcc_features'], axis=2))
    print('getFeatures: Get mfcc_std')
    data['mfcc_std'] = scale(np.std(data['normalised_mfcc_features'], axis=2))
    print('getFeatures: Get mfcc_argmax_time')
    data['mfcc_argmax_time'] = scale(np.argmax(data['normalised_mfcc_features'], axis=2))
    print('getFeatures: mfcc_argmax_channel')
    data['mfcc_argmax_channel'] = scale(np.argmax(data['normalised_mfcc_features'], axis=1))
    print('getFeatures: Done')
    

def getConcatenatedFeatures(data, features):
    missing_features = [x for x in features if x not in data.keys()]
    if len(missing_features) > 0:
        print (f'Missing features: {", ".join(missing_features)}. Calling addFeatures to add them.')
        addFeatures(data)
    print (f'Concatenating these features: {features}')
    f = np.concatenate([data[feature] for feature in features], axis=1)
    n = np.concatenate([[f'{feature}_{i}' for i in range(data[feature].shape[1])] for feature in features])
    print (f'Resulting shape: {f.shape}')
    return f, n

def printClusteringResult(clustering, labels, method=None):
    if method != None:
        print (f'Clustering results using {method}')
    print (f'homogeneity_completeness_v_measure: {homogeneity_completeness_v_measure(labels, clustering)}')
    def cluster(x):
        return x[0]
    def label(x):
        return x[1]

    print (f'by cluster')
    data=list(zip(clustering, labels))
    data = sorted(data, key=cluster)
    for k, g in groupby(data, cluster):
        group = [label(x) for x in g]
        group.sort()
        print (f'\t{k} ({len(group)}): {myhelpers.getListGroupPercentages(group)}')
    print (f'by key')
    data=list(zip(clustering, labels))
    data = sorted(data, key=label)
    for k, g in groupby(data, label):
        group = [cluster(x) for x in g]
        group.sort()
        print (f'\t{k} ({len(group)}): {myhelpers.getListGroupPercentages(group)}')
        
def testClustering(data, features, keep=None):
    def filterLabels(labels, keep):
        return [label if label in keep else 'Other' for label in labels]
    
    labels = data['keystroke_labels']
    print(len(labels))
    features, featurenames = getConcatenatedFeatures(data, features)
#     print (featurenames)
    
    if keep != None:
        filtered_labels = filterLabels(labels, keep=keep)
    else:
        filtered_labels = labels

    n_clusters = len(set(filtered_labels)) + 1

    clustering=sklearn.cluster.k_means(features, n_clusters=n_clusters)[1]
    print()
    printClusteringResult(clustering, filtered_labels, 'k_means')

    gm = sklearn.mixture.GaussianMixture(n_clusters)
    gm.fit(features)
    clustering = gm.predict(features)
    print()
    printClusteringResult(clustering, filtered_labels, 'GaussianMixture')
