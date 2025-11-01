import networkx as nx
import folium

import matplotlib.pyplot as plt
import random ; random.seed(42)
import itertools

from shapely.geometry import MultiPoint
from geopy.distance import geodesic

# import geonamescache
from geopy.geocoders import Nominatim
from geopy.geocoders import Photon

geocoder = Photon(user_agent="myapp", timeout=3).geocode

cities = {
    "Montreal": (45.50567327826325, -73.57661589326177),
    "Québec": (46.81051882879134, -71.22339061144275),
    "Sherbrooke": (45.40459379623924, -71.891790856079)
} # (latitude, longitude)

other = [
    "Magog",
    "Saguenay",
    "Trois-Riviere"
]

for name in other:
    res = geocoder(name)
    cities[name] = (res.latitude, res.longitude)


################################################################################
### Utils ######################################################################
################################################################################

def invertPos(G):
    """
    Useful to use nx.draw as the positions are inverted.
    """
    H = G.copy()
    for city in H.nodes:
        inv = H.nodes[city].get("pos")[::-1]
        H.nodes[city]["pos"] = inv
    return H

def distance(G, a, b):
    """
    Returns the distance between two cities "a" and "b" with "pos" G attribute.
    """
    return geodesic(G.nodes[a]["pos"], G.nodes[b]["pos"])

def centroid(G):
    """
    Coordinate mean of the whole cluster.
    """
    coordinates = [city["pos"] for _, city in G.nodes(data=True)]
    mid = MultiPoint(coordinates).centroid
    return (mid.x, mid.y)

def randomizeEdges(G):
    """
    Initializes edges randomly.
    """
    nodes = list(G.nodes)
    for a, b in itertools.combinations(nodes, 2):
        if random.random() < 0.5:
            G.add_edge(a,b)


################################################################################
### Graphe construction ########################################################
################################################################################

G = nx.Graph()

for city, (la, lo) in cities.items():
    G.add_node(city, pos=(la,lo))

d = distance(G, "Montreal", "Sherbrooke")
print(f'Example distance: {d.kilometers:.2f} km')

randomizeEdges(G)


################################################################################
### Visualization ##############################################################
################################################################################

# NX integrated plot
pos = nx.get_node_attributes(invertPos(G), "pos")
nx.draw(G, pos)
# plt.show()

map = folium.Map(centroid(G), zoom_start=7, tiles="CartoDB Voyager")

mark = folium.Icon(color="red", icon="cloud")

for city in G.nodes:
    folium.Marker(
        location=G.nodes[city]["pos"],
        popup=city,
        tooltip="click!",
        icon=mark
    ).add_to(map)

for a, b in G.edges:
    pos_a = G.nodes[a]["pos"]
    pos_b = G.nodes[b]["pos"]

    folium.PolyLine(
        locations=[pos_a, pos_b],
        color="blue",
        weight=3,
        opacity=0.7
    ).add_to(map)

map.save("frontend/map.html")