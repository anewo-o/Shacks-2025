import networkx as nx
import matplotlib.pyplot as plt
import folium

from shapely.geometry import MultiPoint
from geopy.distance import geodesic

def distance(G, a, b):
    return geodesic(G.nodes[a]["pos"][::-1], G.nodes[b]["pos"][::-1])


G = nx.Graph()

cities = {
    "Montreal": (45.50567327826325, -73.57661589326177),
    "Québec": (46.81051882879134, -71.22339061144275),
    "Sherbrooke": (45.40459379623924, -71.891790856079)
} # (latitude, longitude)

for city, (la, lo) in cities.items():
    G.add_node(city, pos=(lo,la))

print(f'Example distance: {distance(G, "Montreal", "Sherbrooke").kilometers:.2f} km')

# NX integrated plot
pos = nx.get_node_attributes(G, "pos")
nx.draw(G, pos)
# plt.show()


N = len(cities)
mid = MultiPoint(cities.values()).centroid
mid = (mid.x, mid.y)

map = folium.Map(mid, zoom_start=7, tiles="CartoDB Voyager")

mark = folium.Icon(color="red", icon="cloud")

for city in cities:
    folium.Marker(
        location=cities[city],
        popup=city,
        tooltip="click!",
        icon=mark
    ).add_to(map)

map.save("frontend/map.html")