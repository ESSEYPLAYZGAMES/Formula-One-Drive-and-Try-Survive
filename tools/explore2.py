import json, math, sys
from collections import defaultdict
gj = json.load(open(sys.argv[1], encoding='utf-8'))
feats = gj['features']
lons=[];lats=[]
for f in feats:
    g=f['geometry']; t=g['type']
    def walk(c):
        if isinstance(c[0], (int,float)): lons.append(c[0]); lats.append(c[1])
        else:
            for x in c: walk(x)
    walk(g['coordinates'])
print('bbox lon', min(lons), max(lons), 'lat', min(lats), max(lats))

for road in ['Koval Lane','Sands Avenue','South Las Vegas Boulevard','Spring Mountain Road','East Harmon Avenue','Las Vegas Strip Circuit']:
    print('===', road)
    ws=[f for f in feats if f['geometry']['type']=='LineString' and f['properties'].get('name')==road]
    for f in sorted(ws, key=lambda f: (f['geometry']['coordinates'][0][1], f['geometry']['coordinates'][0][0])):
        c=f['geometry']['coordinates']; p=f['properties']
        print(f"  {f['id']:>16} n={len(c):3d} ({c[0][0]:.5f},{c[0][1]:.5f})->({c[-1][0]:.5f},{c[-1][1]:.5f}) oneway={p.get('oneway')} lanes={p.get('lanes')} layer={p.get('layer')} bridge={p.get('bridge')}")
