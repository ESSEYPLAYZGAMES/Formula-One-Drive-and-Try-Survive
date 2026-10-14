// Fabric: how each cloth answers the light (world/People.js's clothes) - a denim's twill and the slub of its warp, a
// leather's pebbled grain and its hide's soft unevenness, sequins each tilted their own way and catching the light on
// their own, a lame's crinkled foil, a rib knit's ribs, satin's sheen drawn along its warp (anisotropic: long highlights
// down its folds), a mesh's or a lace's net. All of it worked out in the shader from where on the person a point is (its
// own model-space position: nothing needs texture coordinates, nothing is drawn per frame) - each behind a define of its
// own on the material (PPL_WEAVE: its kind; PPL_SATIN: its sheen's strength; PPL_NET: 1 mesh, 2 lace), so every person
// in the same cloth shares one program. Every pattern finer than a pixel fades to its average - no shimmer at a
// distance: what reads there is the cloth's colour (a denim's streaks, a knit's ribs) and its sheen.
import * as THREE from 'three';

const SC = THREE.ShaderChunk;
// (the point's place on the person and its way out, in the body's own frame - a cloth's pattern stays on it as it moves)
if (!SC.common.includes('PPL_WEAVE')) SC.common += `
#if defined( PPL_WEAVE ) || defined( PPL_NET ) || defined( PPL_SATIN )
varying vec3 vPplP;
varying vec3 vPplN;
float pplHash( vec2 p ) { vec3 q = fract( vec3( p.xyx ) * 0.1031 ); q += dot( q, q.yzx + 33.33 ); return fract( ( q.x + q.y ) * q.z ); }
float pplNoise( vec2 p ) { vec2 i = floor( p ), f = fract( p ); f = f * f * ( 3.0 - 2.0 * f ); return mix( mix( pplHash( i ), pplHash( i + vec2( 1.0, 0.0 ) ), f.x ), mix( pplHash( i + vec2( 0.0, 1.0 ) ), pplHash( i + vec2( 1.0, 1.0 ) ), f.x ), f.y ); }
#endif
#ifdef PPL_WEAVE
// (a cloth's own relief (m) and its colour's share, at q - across it (x) and down it (y), metres - px: a pixel's
// footprint there: each detail fading out as it grows finer than a pixel)
vec2 pplWeave( vec2 q, float px ) {
	float h = 0.0, c = 1.0;
	#if PPL_WEAVE == 1
	// (denim: a 3x1 twill - fine diagonal wales a millimetre apart, the white weft between them - and the slub of its
	// indigo warp: uneven streaks down the leg, finer and broader)
	float fT = 900.0, wT = 1.0 - smoothstep( 0.25, 0.5, px * fT ), t = abs( fract( ( q.y + 0.55 * q.x ) * fT ) - 0.5 ) * 2.0;
	float s1 = pplNoise( vec2( q.x * 330.0, q.y * 6.0 ) ) * pplNoise( vec2( q.x * 170.0 + 1.3, q.y * 11.0 ) ), s2 = pplNoise( vec2( q.x * 60.0 + 3.1, q.y * 2.2 ) );
	h = 0.00007 * t * wT;
	c = 1.0 + 0.16 * ( s1 - 0.25 ) * ( 1.0 - smoothstep( 0.4, 0.8, px * 330.0 ) ) + 0.09 * ( s2 - 0.5 ) + 0.1 * ( t - 0.5 ) * wT;
	#elif PPL_WEAVE == 2
	// (leather: a fine pebbled grain, and the hide's soft unevenness - its sheen broken up, never a mirror)
	float n1 = pplNoise( q * 1100.0 ), n2 = pplNoise( q * 28.0 + 7.7 ), n3 = pplNoise( q * 90.0 + 2.3 );
	h = 0.00005 * n1 * ( 1.0 - smoothstep( 0.3, 0.6, px * 1100.0 ) ) + 0.0011 * n2 + 0.00018 * n3 * ( 1.0 - smoothstep( 0.4, 0.8, px * 90.0 ) );
	c = 1.0 - 0.06 * n2;
	#elif PPL_WEAVE == 4
	// (lame: its metal foil crinkled)
	h = 0.0004 * pplNoise( q * 150.0 ) * ( 1.0 - smoothstep( 0.4, 0.8, px * 150.0 ) ) + 0.0008 * pplNoise( q * 40.0 + 1.7 );
	#elif PPL_WEAVE == 5
	// (rib knit: its ribs down the cloth, three millimetres apart, the furrows between them in shadow)
	float r = 0.5 + 0.5 * cos( 6.2832 * q.x * 330.0 ), w = 1.0 - smoothstep( 0.3, 0.6, px * 330.0 );
	h = 0.0003 * r * w; c = 1.0 - 0.14 * ( 1.0 - r ) * w;
	#elif PPL_WEAVE == 6
	// (ruched: the cloth gathered in soft folds across it, a centimetre and a half apart - bunched closer toward the middle
	// of its front, where it is drawn in, each curving a little up toward the sides; the folds' crowns catching the light,
	// the furrows between them in shadow)
	// (its lines warped, never scaled by where on her they are: each dipping a little toward the middle, drawn in there)
	float g = exp( - q.x * q.x / 0.0028 ), ph = ( q.y + 0.006 * g - 1.6 * q.x * q.x ) * 70.0 + 0.45 * pplNoise( q * 40.0 );
	float r = 0.5 + 0.5 * cos( 6.2832 * ph ), w = 1.0 - smoothstep( 0.3, 0.6, px * 70.0 );
	h = 0.0008 * pow( r, 1.5 ) * w; c = 1.0 - 0.08 * ( 1.0 - r ) * w;
	#elif PPL_WEAVE == 7
	// (crinkle: a crinkle swimsuit's, a seersucker's, a linen's - small soft puckers every few millimetres, uneven, and the
	// broader slub through it)
	float n1 = pplNoise( vec2( q.x * 260.0, q.y * 150.0 ) ), n2 = pplNoise( q * 70.0 + 4.1 ), w = 1.0 - smoothstep( 0.3, 0.6, px * 260.0 );
	h = 0.00022 * n1 * w + 0.00035 * n2 * ( 1.0 - smoothstep( 0.4, 0.8, px * 70.0 ) );
	c = 1.0 - 0.07 * ( n1 - 0.5 ) * w - 0.05 * ( n2 - 0.5 );
	#elif PPL_WEAVE == 8
	// (a print - c: the share of the cloth's own colour, the rest its ink: awning stripes round her, two centimetres each,
	// their edges soft by a pixel; at a distance their average)
	float s = abs( fract( q.y * 26.0 ) - 0.5 ) * 2.0, aa = min( 1.0, px * 52.0 );
	float m = smoothstep( 0.5 - 0.5 * aa - 0.03, 0.5 + 0.5 * aa + 0.03, s );
	c = 1.0 - mix( m, 0.5, smoothstep( 0.3, 0.6, px * 26.0 ) );
	#elif PPL_WEAVE == 9
	// (a palm print: fronds a hand long, scattered and turned every way, each frond's leaflets parted - a tropical print's;
	// at a distance their average)
	vec2 p2 = q * 9.0, pw = p2 + 0.65 * vec2( pplNoise( p2 * 1.7 + 2.3 ), pplNoise( p2 * 1.7 + 7.1 ) );
	float leaf = pplNoise( vec2( pw.x * 2.6, pw.y * 0.9 ) ), vein = abs( fract( ( pw.x * 1.3 + pw.y * 3.2 ) * 3.0 ) - 0.5 );
	float m = smoothstep( 0.57, 0.61, leaf ) * smoothstep( 0.07, 0.15, vein );
	c = 1.0 - mix( m, 0.2, smoothstep( 0.25, 0.6, px * 40.0 ) );
	#endif
	return vec2( h, c );
}
#endif
`;
if (!SC.begin_vertex.includes('PPL_WEAVE')) SC.begin_vertex += `
#if defined( PPL_WEAVE ) || defined( PPL_NET ) || defined( PPL_SATIN )
vPplP = position; vPplN = objectNormal;
#endif
`;
// (the relief: the normal tilted by the slope of its height across the pixel - its place's own derivatives on the
// screen, in metres - the same bump at any distance; sequins: each a flat disc of its own tilt, a little brighter or
// darker than the next)
if (!SC.normal_fragment_maps.includes('PPL_WEAVE')) SC.normal_fragment_maps += `
#ifdef PPL_WEAVE
{
	vec3 pplWn = abs( normalize( vPplN ) ); pplWn *= pplWn;
	float pplFr = pplWn.x / max( 1e-4, pplWn.x + pplWn.z );
	vec2 pplQF = vec2( - vPplP.z, - vPplP.y ), pplQS = vec2( vPplP.x, - vPplP.y );
	float pplPx = max( length( fwidth( vPplP ) ), 1e-5 );
	#if PPL_WEAVE == 3 || PPL_WEAVE == 4
	{
		// (sequins: round discs in staggered rows, overlapping as scales do, the cloth between them in shadow; a lame's
		// glints finer and fainter, its foil whole)
		float sz = PPL_WEAVE == 3 ? 0.0045 : 0.0024;
		vec2 q = ( pplFr > 0.5 ? pplQF : pplQS ) / sz;
		float row = floor( q.y / 0.866 );
		vec2 cq = vec2( q.x + 0.5 * mod( row, 2.0 ), q.y / 0.866 ), id = floor( cq ), fq = fract( cq ) - 0.5;
		float far = smoothstep( 0.5 * sz, 2.0 * sz, pplPx );
		float disc = PPL_WEAVE == 3 ? mix( 1.0 - smoothstep( 0.42, 0.56, length( fq * vec2( 1.0, 0.866 ) ) ), 0.88, far ) : 1.0;
		vec3 r = vec3( pplHash( id ), pplHash( id + 17.13 ), pplHash( id + 41.71 ) ) - 0.5;
		float a = ( PPL_WEAVE == 3 ? 1.1 : 0.3 ) * disc * ( 1.0 - 0.45 * far );
		normal = normalize( normal + a * ( r - normal * dot( normal, r ) ) );
		diffuseColor.rgb *= PPL_WEAVE == 3 ? ( 0.84 + 0.3 * pplHash( id + 5.3 ) ) * ( 0.5 + 0.5 * disc ) : 1.0;
	}
	#endif
	#if PPL_WEAVE != 3
	{
		vec2 pplHc = mix( pplWeave( pplQS, pplPx ), pplWeave( pplQF, pplPx ), pplFr );
		#if PPL_WEAVE >= 8
		// (a print's ink: cream on a dark cloth, deep navy on a light one)
		{ float pplL = dot( diffuseColor.rgb, vec3( 0.2126, 0.7152, 0.0722 ) ); vec3 pplInk = pplL > 0.3 ? vec3( 0.025, 0.04, 0.1 ) * ( 0.3 + pplL ) : vec3( 0.8, 0.76, 0.68 ) * ( 0.25 + 1.5 * pplL ); diffuseColor.rgb = mix( pplInk, diffuseColor.rgb, pplHc.y ); }
		#else
		diffuseColor.rgb *= pplHc.y;
		#endif
		vec3 pplSx = dFdx( - vViewPosition ), pplSy = dFdy( - vViewPosition ), pplR1 = cross( pplSy, normal ), pplR2 = cross( normal, pplSx );
		float pplDet = dot( pplSx, pplR1 ) * faceDirection;
		if ( abs( pplDet ) > 1e-14 ) normal = normalize( abs( pplDet ) * normal - sign( pplDet ) * ( dFdx( pplHc.x ) * pplR1 + dFdy( pplHc.x ) * pplR2 ) );
	}
	#endif
}
#endif
`;
// (satin's drape (PPL_DRAPE): the cloth's soft ripples down it - every six or seven centimetres across, long down it, a
// little gentler over a fitted bodice than in a skirt - so its sheen, a lamp's and its own, runs in the long soft streaks
// a bias-cut satin is known by: a flat panel never prints one even patch of light with hard edges. Smooth and broad -
// nothing finer than a pixel, nothing to shimmer)
if (!SC.normal_fragment_maps.includes('PPL_DRAPE')) SC.normal_fragment_maps += `
#if defined( PPL_SATIN ) && !defined( PPL_WEAVE )
{ // PPL_DRAPE
	vec2 pplQd = vec2( 0.8 * vPplP.x + 0.6 * vPplP.z, vPplP.y );
	float pplHd = ( pplNoise( vec2( pplQd.x * 15.0, pplQd.y * 1.7 ) ) + 0.45 * pplNoise( vec2( pplQd.x * 34.0 + 3.1, pplQd.y * 3.2 + 1.3 ) ) ) * mix( 0.0034, 0.0017, smoothstep( 0.95, 1.25, vPplP.y ) );
	vec3 pplSx = dFdx( - vViewPosition ), pplSy = dFdy( - vViewPosition ), pplR1 = cross( pplSy, normal ), pplR2 = cross( normal, pplSx );
	float pplDet = dot( pplSx, pplR1 ) * faceDirection;
	if ( abs( pplDet ) > 1e-14 ) normal = normalize( abs( pplDet ) * normal - sign( pplDet ) * ( dFdx( pplHd ) * pplR1 + dFdy( pplHd ) * pplR2 ) );
}
#endif
`;
// (a net: its threads and its holes - a power mesh's fine diamond net, a lace's net with its motifs denser in it - the
// whole a little more or less sheer; finer than a pixel, its average)
if (!SC.alphamap_fragment.includes('PPL_NET')) SC.alphamap_fragment += `
#ifdef PPL_NET
{
	vec3 pplWn = abs( normalize( vPplN ) );
	vec2 q = pplWn.x > pplWn.z ? vPplP.zy : vPplP.xy;
	float px = max( length( fwidth( vPplP ) ), 1e-5 ), k = PPL_NET == 1 ? 330.0 : 420.0;
	vec2 l = abs( fract( vec2( q.x + q.y, q.x - q.y ) * k * 0.7071 ) - 0.5 );
	// (a mesh's diamonds - four millimetres or so - seen while each still spans three pixels or more (px: fwidth's length,
	// some one and a half pixels' width), its average by two - no moire; a lace's net finer, gone sooner)
	float th = smoothstep( 0.34, 0.44, max( l.x, l.y ) ), cov = mix( 0.4, th, PPL_NET == 1 ? 1.0 - smoothstep( 0.6, 1.0, px * k ) : 1.0 - smoothstep( 0.2, 0.45, px * k ) );
	#if PPL_NET == 2
	// (lace: small flowers clustered in sprays, fine vines winding between them, all in the net - finer than a pixel,
	// the share of it they cover)
	// (each motif a corded outline - a contour of its own pattern - round a small filled heart, in sprays; the vines a
	// fine cord winding between them)
	float n1 = pplNoise( q * 120.0 ) * 0.65 + pplNoise( q * 260.0 + 3.7 ) * 0.35, n2 = pplNoise( q * 26.0 + 5.1 ), vn = abs( pplNoise( q * 70.0 + 9.3 ) - 0.5 );
	float sp = smoothstep( 0.32, 0.58, n2 ), ln = 1.0 - smoothstep( 0.012, 0.03, abs( n1 - 0.56 ) );
	float m = max( max( ln, 0.85 * smoothstep( 0.66, 0.7, n1 ) ) * sp, 0.8 * ( 1.0 - smoothstep( 0.012, 0.03, vn ) ) * ( 1.0 - sp ) );
	m = mix( m, 0.24, smoothstep( 0.3, 0.6, px * 260.0 ) );
	cov = mix( cov, 0.95, m );
	#elif PPL_NET == 3
	// (crochet: rounds of open stitches - a hole every centimetre or so, each ringed by its stitches and a ring of small
	// holes round it, the thread between; finer than a pixel, its average)
	{
		vec2 cf = fract( q * 105.0 ) - 0.5;
		float r = length( cf ), an = atan( cf.y, cf.x );
		float hole = 1.0 - smoothstep( 0.2, 0.26, r ), pet = smoothstep( 0.33, 0.37, r ) * ( 1.0 - smoothstep( 0.44, 0.48, r ) ) * smoothstep( 0.25, 0.65, abs( sin( an * 4.0 ) ) );
		cov = mix( 1.0 - max( hole, 0.85 * pet ), 0.62, smoothstep( 0.3, 0.6, px * 105.0 ) );
	}
	#endif
	// (a mesh's holes still a little veiled - a subtle net, not a fishnet's; a lace's open; a crochet's open)
	diffuseColor.a *= PPL_NET == 1 ? 0.45 + 0.55 * cov : PPL_NET == 3 ? cov : 0.28 + 0.72 * cov;
}
#endif
`;
// (satin: the light caught in a long highlight across its warp - down the body - wherever a fold turns it toward a broad
// light from above (a room's ceiling, a softbox): as bright as the light falling on it there, a little of the cloth's
// own colour in it)
if (!SC.lights_fragment_end.includes('PPL_SATIN')) SC.lights_fragment_end += `
#ifdef PPL_SATIN
{
	vec3 pplUp = normalize( ( viewMatrix * vec4( 0.0, 1.0, 0.0, 0.0 ) ).xyz ), pplT = pplUp - normal * dot( normal, pplUp );
	pplT = normalize( pplT + vec3( 1e-5 ) );
	vec3 pplLd = normalize( ( viewMatrix * vec4( 0.35, 0.88, 0.32, 0.0 ) ).xyz ), pplHv = normalize( pplLd + geometryViewDir );
	float pplTH = dot( pplT, pplHv ), pplS = pow( max( 0.0, 1.0 - pplTH * pplTH ), 36.0 ) * smoothstep( -0.1, 0.35, dot( normal, pplLd ) );
	#if defined( PPL_LACEON ) && defined( USE_ALPHAMAP )
	pplS *= 1.0 - pplLaceCov; // (under a lace laid on it, its streaks only between the lace's threads - world/Lace.js)
	#endif
	float pplA = max( 0.04, dot( diffuseColor.rgb, vec3( 0.2126, 0.7152, 0.0722 ) ) ), pplE = min( 2.5, dot( reflectedLight.directDiffuse + reflectedLight.indirectDiffuse, vec3( 0.2126, 0.7152, 0.0722 ) ) / pplA );
	vec3 pplTint = mix( vec3( 1.0 ), diffuseColor.rgb / max( 1e-3, max( diffuseColor.r, max( diffuseColor.g, diffuseColor.b ) ) ), 0.45 );
	reflectedLight.directSpecular += pplTint * pplS * pplE * PPL_SATIN;
}
#endif
`;

/** the weaves (PPL_WEAVE's kinds): denim, leather, sequin, lame (metallic), rib (a rib knit), ruche, crinkle; prints: stripe, palm */
export const WEAVES = Object.freeze({ denim: 1, leather: 2, sequin: 3, lame: 4, rib: 5, ruche: 6, crinkle: 7, stripe: 8, palm: 9 });
/**
 * A person's cloth material made to answer the light as its cloth does (o: { weave (WEAVES' key), satin (its sheen's
 * strength, ~0.1..0.5), net (1 a mesh, 2 a lace: the material transparent) }) -> m (its defines added: one program for
 * every material alike)
 */
export function fabricOn(m, o = {}) {
  if (!m || !o) return m;
  const d = (m.defines = { ...(m.defines || {}) });
  if (WEAVES[o.weave]) d.PPL_WEAVE = String(WEAVES[o.weave]);
  if (o.satin > 0) d.PPL_SATIN = (+o.satin).toFixed(2);
  if (o.net === 1 || o.net === 2 || o.net === 3) d.PPL_NET = String(o.net);
  m.needsUpdate = true;
  return m;
}
