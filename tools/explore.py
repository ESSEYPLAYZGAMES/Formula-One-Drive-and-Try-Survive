"""Exploration: build a road graph from the OSM GeoJSON and test routing the circuit loop."""
import json, math, heapq, sys
from collections import defaultdict

gj = json.load(open(sys.argv[1], encoding='utf-8'))
feats = gj['features']

# Local projection anchored on the raceway S/F straight midpoint (approx), refined later
LAT0, LON0 = 36.1093, -115.1621
R = 6378137.0
def proj(lon, lat):
    x = math.radians(lon - LON0) * R * math.cos(math.radians(LAT0))
    z = -math.radians(lat - LAT0) * R
    return (x, z)

ROADS = {'Koval Lane', 'Sands Avenue', 'South Las Vegas Boulevard', 'East Harmon Avenue', 'Las Vegas Strip Circuit', 'Spring Mountain Road'}

def key(c):
    return (round(c[0], 7), round(c[1], 7))

graph = defaultdict(list)
way_of_edge = {}
for f in feats:
    if f['geometry']['type'] != 'LineString':
        continue
    name = f['properties'].get('name')
    hw = f['properties'].get('highway')
    if name not in ROADS:
        continue
    cs = f['geometry']['coordinates']
    for a, b in zip(cs, cs[1:]):
        ka, kb = key(a), key(b)
        pa, pb = proj(*a), proj(*b)
        d = math.dist(pa, pb)
        graph[ka].append((kb, d, name))
        graph[kb].append((ka, d, name))

print('nodes', len(graph))

def nearest(lon, lat):
    p = proj(lon, lat)
    return min(graph.keys(), key=lambda k: math.dist(proj(*k), p))

def dijkstra(src, dst, allowed):
    dist = {src: 0}; prev = {}
    pq = [(0, src)]
    while pq:
        d, u = heapq.heappop(pq)
        if u == dst: break
        if d > dist.get(u, 1e18): continue
        for v, w, nm in graph[u]:
            if nm not in allowed: continue
            nd = d + w
            if nd < dist.get(v, 1e18):
                dist[v] = nd; prev[v] = u
                heapq.heappush(pq, (nd, v))
    if dst not in dist: return None
    path = [dst]
    while path[-1] != src: path.append(prev[path[-1]])
    return path[::-1], dist[dst]

# Raceway S/F straight: from SW end to NE end (Koval)
sf_start = nearest(-115.1639015, 36.1079696)
sf_end = nearest(-115.160364, 36.1107004)
# Corner anchors (approx real-world)
koval_sands = nearest(-115.1596, 36.1215)   # Koval & Sands (T5 area)
sands_strip = nearest(-115.1700, 36.1245)   # Sands & LV Blvd (T12)
strip_harmon = nearest(-115.1723, 36.1090)  # LV Blvd & Harmon (T14)
harmon_sf = sf_start

legs = [
    ('S/F straight', sf_start, sf_end, {'Las Vegas Strip Circuit'}),
    ('Koval north', sf_end, koval_sands, {'Koval Lane', 'Las Vegas Strip Circuit'}),
    ('Sands west', koval_sands, sands_strip, {'Sands Avenue', 'Koval Lane', 'Las Vegas Strip Circuit'}),
    ('Strip south', sands_strip, strip_harmon, {'South Las Vegas Boulevard', 'Sands Avenue', 'Spring Mountain Road'}),
    ('Harmon east', strip_harmon, harmon_sf, {'East Harmon Avenue', 'South Las Vegas Boulevard', 'Las Vegas Strip Circuit'}),
]
total = 0
for nm, a, b, allowed in legs:
    r = dijkstra(a, b, allowed)
    if r is None:
        print(nm, 'NO ROUTE', a, b)
    else:
        path, d = r
        total += d
        print(f'{nm}: {d:.0f} m, {len(path)} nodes, from {a} to {b}')
print('total', total)
