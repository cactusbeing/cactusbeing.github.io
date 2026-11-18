import{U as kt,l as Xr,N as Kt,S as Mi,C as qe,R as qr,m as tt,n as Xe,V as Lt,o as Fi,M as mn,F as Kr,q as ja,W as Bi,r as zt,u as rt,v as an,H as Yt,D as vt,B as Dt,x as Ln,y as ie,z as Yr,A as Gi,E as $r,G as Zr,J as Mn,O as Qr,K as jr,P as Jr,Q as eo,T as to,X as no,Y as io,Z as ao,$ as ro,a0 as oo,a1 as so,a2 as lo,a3 as co,a4 as fo,a5 as uo,a6 as ho,a7 as hi,a8 as Ja,a9 as ti,aa as Bt,ab as Fn,ac as po,ad as rn,ae as mo,af as go,ag as er,ah as _o,ai as tr,aj as vo,ak as nr,al as So,am as Eo,an as Mo,ao as gn,ap as xt,aq as xi,ar as xo,as as ye,at as Pn,au as To,av as pn,aw as An,ax as _n,ay as Dn,az as Qt,aA as yn,aB as ir,aC as sn,aD as pi,aE as bo,aF as ar,aG as on,aH as vn,aI as Ze,aJ as Ao,aK as ni,aL as Ro,aM as ii,aN as jt,aO as wo,aP as Po,aQ as Co,aR as un,aS as Ve,aT as nn,aU as rr,aV as or,aW as sr,aX as qn,aY as lr,aZ as cr,a_ as Lo,a$ as Do,b0 as yo,b1 as Uo,b2 as Io,b3 as No,b4 as Oo,b5 as Fo,b6 as Hi,b7 as Bo,b8 as kn,b9 as Go,ba as Vi,bb as ki,bc as zi,bd as Ho,be as Wi,bf as Vo,bg as ln,bh as mi,bi as Ct,bj as fr,bk as dr,bl as gi,bm as ur,bn as ko,bo as zo,bp as Wo,bq as Xo,br as hr,bs as qo,bt as Ko,bu as Yo,bv as ai,bw as ri,bx as oi,by as si,bz as Xi,bA as qi,bB as Ki,bC as Yi,bD as $i,bE as Zi,bF as Qi,bG as ji,bH as Ji,bI as _i,bJ as ea,bK as ta,bL as na,bM as ia,bN as aa,bO as ra,bP as oa,bQ as sa,bR as la,bS as ca,bT as fa,bU as da,bV as ua,bW as ha,bX as pa,bY as ma,bZ as ga,b_ as _a,b$ as va,c0 as Sa,c1 as vi,c2 as Ea,c3 as pr,c4 as Ma,c5 as mr,c6 as $o,c7 as Zo,c8 as xa,c9 as wt,ca as Qo,cb as gr,cc as _r,cd as vr,ce as Ti,cf as Sr,cg as Er,ch as Mr,ci as li,cj as ci,ck as xr,cl as Kn,cm as Un,cn as jo,co as Jo,cp as es,cq as ts,cr as ns,cs as is,ct as Tr,cu as as,cv as rs,cw as os,cx as ss,cy as ls,cz as Cn,cA as cs,cB as Yn,cC as fs,cD as ds,cE as at,I as ot,cF as Rn,cG as br,cH as Ar,cI as us,i as hs,s as Si,cJ as zn,cK as Rr,cL as hn,cM as ps,t as wr,cN as ms,cO as gs,cP as _s,cQ as vs,cR as Ss,cS as cn,cT as Bn,cU as Ta,cV as ba,cW as Aa,cX as Es,cY as Ms,p as Xt,e as Ra,cZ as et,c_ as xs,c$ as Ts,h as fi,d0 as wa,g as bs,b as As,d1 as Rs,d2 as ws,f as Pa,j as Ps,d3 as Cs,d4 as Ls,d5 as Ds,d6 as ys,d7 as Us,d8 as Is,d9 as Ca,d as Ns}from"./index-D0gXVGWJ.js";import{R as qt,a as $n,d as La}from"./room-art-CKrMwTXh.js";import"./base-CiR4JVRs.js";import"./preload-helper-BXl3LOEh.js";import"./useGameFullscreen-BSig4cwe.js";function Pr(){let e=null,n=!1,t=null,i=null;function a(r,o){i=e.requestAnimationFrame(a),t(r,o)}return{start:function(){n!==!0&&t!==null&&e!==null&&(i=e.requestAnimationFrame(a),n=!0)},stop:function(){e!==null&&e.cancelAnimationFrame(i),n=!1},setAnimationLoop:function(r){t=r},setContext:function(r){e=r}}}function Os(e){const n=new WeakMap;function t(s,p){const d=s.array,m=s.usage,g=d.byteLength,v=e.createBuffer();e.bindBuffer(p,v),e.bufferData(p,d,m),s.onUploadCallback();let _;if(d instanceof Float32Array)_=e.FLOAT;else if(typeof Float16Array<"u"&&d instanceof Float16Array)_=e.HALF_FLOAT;else if(d instanceof Uint16Array)s.isFloat16BufferAttribute?_=e.HALF_FLOAT:_=e.UNSIGNED_SHORT;else if(d instanceof Int16Array)_=e.SHORT;else if(d instanceof Uint32Array)_=e.UNSIGNED_INT;else if(d instanceof Int32Array)_=e.INT;else if(d instanceof Int8Array)_=e.BYTE;else if(d instanceof Uint8Array)_=e.UNSIGNED_BYTE;else if(d instanceof Uint8ClampedArray)_=e.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+d);return{buffer:v,type:_,bytesPerElement:d.BYTES_PER_ELEMENT,version:s.version,size:g}}function i(s,p,d){const m=p.array,g=p.updateRanges;if(e.bindBuffer(d,s),g.length===0)e.bufferSubData(d,0,m);else{g.sort((_,R)=>_.start-R.start);let v=0;for(let _=1;_<g.length;_++){const R=g[v],L=g[_];L.start<=R.start+R.count+1?R.count=Math.max(R.count,L.start+L.count-R.start):(++v,g[v]=L)}g.length=v+1;for(let _=0,R=g.length;_<R;_++){const L=g[_];e.bufferSubData(d,L.start*m.BYTES_PER_ELEMENT,m,L.start,L.count)}p.clearUpdateRanges()}p.onUploadCallback()}function a(s){return s.isInterleavedBufferAttribute&&(s=s.data),n.get(s)}function r(s){s.isInterleavedBufferAttribute&&(s=s.data);const p=n.get(s);p&&(e.deleteBuffer(p.buffer),n.delete(s))}function o(s,p){if(s.isInterleavedBufferAttribute&&(s=s.data),s.isGLBufferAttribute){const m=n.get(s);(!m||m.version<s.version)&&n.set(s,{buffer:s.buffer,type:s.type,bytesPerElement:s.elementSize,version:s.version});return}const d=n.get(s);if(d===void 0)n.set(s,t(s,p));else if(d.version<s.version){if(d.size!==s.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(d.buffer,s,p),d.version=s.version}}return{get:a,remove:r,update:o}}var Fs=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Bs=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,Gs=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Hs=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Vs=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,ks=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,zs=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,Ws=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Xs=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec4 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 );
	}
#endif`,qs=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,Ks=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Ys=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,$s=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,Zs=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,Qs=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,js=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,Js=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,el=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,tl=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,nl=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,il=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,al=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,rl=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec4( 1.0 );
#endif
#ifdef USE_COLOR_ALPHA
	vColor *= color;
#elif defined( USE_COLOR )
	vColor.rgb *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.rgb *= instanceColor.rgb;
#endif
#ifdef USE_BATCHING_COLOR
	vColor *= getBatchingColor( getIndirectIndex( gl_DrawID ) );
#endif`,ol=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
#define inverseTransformDirection transformDirectionByInverseViewMatrix
vec3 transformNormalByInverseViewMatrix( in vec3 normal, in mat4 viewMatrix ) {
	return normalize( ( vec4( normal, 0.0 ) * viewMatrix ).xyz );
}
vec3 transformDirectionByInverseViewMatrix( in vec3 dir, in mat4 viewMatrix ) {
	return normalize( ( vec4( dir, 0.0 ) * viewMatrix ).xyz );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,sl=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
#endif`,ll=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,cl=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,fl=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,dl=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,ul="gl_FragColor = linearToOutputTexel( gl_FragColor );",hl=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,pl=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * reflectVec );
		#ifdef ENVMAP_BLENDING_MULTIPLY
			outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_MIX )
			outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_ADD )
			outgoingLight += envColor.xyz * specularStrength * reflectivity;
		#endif
	#endif
#endif`,ml=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	uniform samplerCube envMap;
	#ifdef ENVMAP_TYPE_PMREM
		float roughnessToMip( const in float roughness ) {
			float r = clamp( roughness, 0.0, 1.0 );
			return ENVMAP_MAX_LOD * r * ( 2.0 - r );
		}
	#endif
#endif`,gl=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,_l=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,vl=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,Sl=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,El=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Ml=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,xl=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Tl=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,bl=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Al=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Rl=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,wl=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_SUN_LIGHTS > 0
	struct SunLight {
		vec3 direction;
		vec3 color;
	};
	uniform SunLight sunLights[ NUM_SUN_LIGHTS ];
	void getSunLightInfo( const in SunLight sunLight, out IncidentLight light ) {
		light.color = sunLight.color;
		light.direction = sunLight.direction;
		light.visible = true;
	}
#endif
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif
#include <lightprobes_pars_fragment>`,Pl=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_PMREM
			vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
			vec4 envMapColor = textureLod( envMap, envMapRotation * worldNormal, ENVMAP_MAX_LOD );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_PMREM
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, pow4( roughness ) ) );
			reflectVec = transformDirectionByInverseViewMatrix( reflectVec, viewMatrix );
			vec4 envMapColor = textureLod( envMap, envMapRotation * reflectVec, roughnessToMip( roughness ) );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_RETROREFLECTION
		vec3 getIBLRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
			#ifdef ENVMAP_TYPE_PMREM
				vec3 retroVec = normalize( mix( viewDir, normal, pow4( roughness ) ) );
				retroVec = transformDirectionByInverseViewMatrix( retroVec, viewMatrix );
				vec4 envMapColor = textureLod( envMap, envMapRotation * retroVec, roughnessToMip( roughness ) );
				return envMapColor.rgb * envMapIntensity;
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_PMREM
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
		#ifdef USE_RETROREFLECTION
			vec3 getIBLAnisotropyRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
				#ifdef ENVMAP_TYPE_PMREM
					vec3 bentNormal = cross( bitangent, viewDir );
					bentNormal = normalize( cross( bentNormal, bitangent ) );
					bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
					return getIBLRetroRadiance( viewDir, bentNormal, roughness );
				#else
					return vec3( 0.0 );
				#endif
			}
		#endif
	#endif
#endif`,Cl=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Ll=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Dl=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,yl=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Ul=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.diffuseContribution = diffuseColor.rgb * ( 1.0 - metalnessFactor );
material.metalness = metalnessFactor;
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.045 );
material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef USE_DIFFUSE_ROUGHNESS
	float diffuseRoughnessFactor = diffuseRoughness;
	#ifdef USE_DIFFUSE_ROUGHNESSMAP
		diffuseRoughnessFactor *= texture2D( diffuseRoughnessMap, vDiffuseRoughnessMapUv ).r;
	#endif
	material.diffuseRoughness = saturate( diffuseRoughnessFactor );
#endif
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor;
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = vec3( 0.04 );
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.045 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_RETROREFLECTION
	material.retroreflectivity = retroreflectivity;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.0001, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,Il=`uniform sampler2D dfgLUT;
struct PhysicalMaterial {
	vec3 diffuseColor;
	vec3 diffuseContribution;
	vec3 specularColor;
	vec3 specularColorBlended;
	float roughness;
	float metalness;
	float specularF90;
	float dispersion;
	vec2 dfg;
	vec3 multiScatteringCompensation;
	#ifdef USE_DIFFUSE_ROUGHNESS
		float diffuseRoughness;
	#endif
	#ifdef USE_RETROREFLECTION
		float retroreflectivity;
	#endif
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0Dielectric;
		vec3 iridescenceF0Metallic;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
#ifdef USE_DIFFUSE_ROUGHNESS
	const float EON_EPSILON = 1e-7;
	float FON_DirectionalAlbedo( const in float mu, const in float roughness, const in float A ) {
		float muComp = 1.0 - mu;
		float gOverPi = muComp * ( 0.0571085289 + muComp * ( 0.491881867 + muComp * ( - 0.332181442 + muComp * 0.0714429953 ) ) );
		return A * ( 1.0 + roughness * gOverPi );
	}
	vec3 BRDF_EON( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 diffuseColor, const in float roughness ) {
		vec3 rho = saturate( diffuseColor );
		if ( roughness <= EON_EPSILON ) return BRDF_Lambert( rho );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float s = dot( lightDir, viewDir ) - dotNL * dotNV;
		float sOverT = ( s > 0.0 ) ? s / max( max( dotNL, dotNV ), EON_EPSILON ) : s;
		float A = 1.0 / ( 1.0 + ( 0.5 - 2.0 / ( 3.0 * PI ) ) * roughness );
		vec3 singleScatter = rho * RECIPROCAL_PI * A * ( 1.0 + roughness * sOverT );
		float averageAlbedo = A * ( 1.0 + ( 2.0 / 3.0 - 28.0 / ( 15.0 * PI ) ) * roughness );
		float albedoV = FON_DirectionalAlbedo( dotNV, roughness, A );
		float albedoL = FON_DirectionalAlbedo( dotNL, roughness, A );
		vec3 rhoMultiScatter = rho * rho * averageAlbedo / max( vec3( EON_EPSILON ), vec3( 1.0 ) - rho * ( 1.0 - averageAlbedo ) );
		vec3 multiScatter = rhoMultiScatter * RECIPROCAL_PI
			* max( EON_EPSILON, 1.0 - albedoV )
			* max( EON_EPSILON, 1.0 - albedoL )
			/ max( EON_EPSILON, 1.0 - averageAlbedo );
		return singleScatter + multiScatter;
	}
	vec3 EON_DirectionalAlbedo( const in vec3 diffuseColor, const in float roughness, const in float dotNV ) {
		vec3 rho = saturate( diffuseColor );
		if ( roughness <= EON_EPSILON ) return rho;
		float A = 1.0 / ( 1.0 + ( 0.5 - 2.0 / ( 3.0 * PI ) ) * roughness );
		float directionalAlbedo = FON_DirectionalAlbedo( dotNV, roughness, A );
		float averageAlbedo = A * ( 1.0 + ( 2.0 / 3.0 - 28.0 / ( 15.0 * PI ) ) * roughness );
		vec3 rhoMultiScatter = rho * rho * averageAlbedo / max( vec3( EON_EPSILON ), vec3( 1.0 ) - rho * ( 1.0 - averageAlbedo ) );
		return rho * directionalAlbedo + rhoMultiScatter * ( 1.0 - directionalAlbedo );
	}
#endif
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		return 0.5 / max( gv + gl, EPSILON );
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = max( material.clearcoatRoughness, 0.045 );
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColorBlended;
	float f90 = material.specularF90;
	float roughness = max( material.roughness, 0.045 );
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float alphaT = max( material.alphaT, alpha );
		float V = V_GGX_SmithCorrelated_Anisotropic( alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transpose( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float rInv = 1.0 / ( roughness + 0.1 );
	float a = -1.9362 + 1.0678 * roughness + 0.4573 * r2 - 0.8469 * rInv;
	float b = -0.6014 + 0.5538 * roughness - 0.4670 * r2 - 0.1255 * rInv;
	float DG = exp( a * dotNV + b );
	return saturate( DG );
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec2 fab, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec2 fab, const in vec3 specularColor, const in float specularF90, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColorBlended * t2.x + ( material.specularF90 - material.specularColorBlended ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseContribution * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
		#ifdef USE_CLEARCOAT
			vec3 Ncc = geometryClearcoatNormal;
			vec2 uvClearcoat = LTC_Uv( Ncc, viewDir, material.clearcoatRoughness );
			vec4 t1Clearcoat = texture2D( ltc_1, uvClearcoat );
			vec4 t2Clearcoat = texture2D( ltc_2, uvClearcoat );
			mat3 mInvClearcoat = mat3(
				vec3( t1Clearcoat.x, 0, t1Clearcoat.y ),
				vec3(             0, 1,             0 ),
				vec3( t1Clearcoat.z, 0, t1Clearcoat.w )
			);
			vec3 fresnelClearcoat = material.clearcoatF0 * t2Clearcoat.x + ( material.clearcoatF90 - material.clearcoatF0 ) * t2Clearcoat.y;
			clearcoatSpecularDirect += lightColor * fresnelClearcoat * LTC_Evaluate( Ncc, viewDir, position, mInvClearcoat, rectCoords );
		#endif
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
 
 		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
 
 		float sheenAlbedoV = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
 		float sheenAlbedoL = IBLSheenBRDF( geometryNormal, directLight.direction, material.sheenRoughness );
 
 		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * max( sheenAlbedoV, sheenAlbedoL );
 
 		irradiance *= sheenEnergyComp;
 
 	#endif
	vec3 specularBRDF = BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	#ifdef USE_RETROREFLECTION
		vec3 retroViewDir = reflect( - geometryViewDir, geometryNormal );
		vec3 retroSpecularBRDF = BRDF_GGX( directLight.direction, retroViewDir, geometryNormal, material );
		specularBRDF = mix( specularBRDF, retroSpecularBRDF, saturate( material.retroreflectivity ) );
	#endif
	reflectedLight.directSpecular += irradiance * specularBRDF * material.multiScatteringCompensation;
	vec3 halfDir = normalize( directLight.direction + geometryViewDir );
	float dotVH = saturate( dot( geometryViewDir, halfDir ) );
	vec3 F = F_Schlick( material.specularColor, material.specularF90, dotVH );
	#ifdef USE_RETROREFLECTION
		vec3 retroHalfDir = normalize( directLight.direction + retroViewDir );
		float dotRetroVH = saturate( dot( retroViewDir, retroHalfDir ) );
		vec3 retroF = F_Schlick( material.specularColor, material.specularF90, dotRetroVH );
		F = mix( F, retroF, saturate( material.retroreflectivity ) );
	#endif
	#ifdef USE_DIFFUSE_ROUGHNESS
		vec3 diffuseBRDF = BRDF_EON( directLight.direction, geometryViewDir, geometryNormal, material.diffuseColor, material.diffuseRoughness ) * ( 1.0 - material.metalness );
	#else
		vec3 diffuseBRDF = BRDF_Lambert( material.diffuseContribution );
	#endif
	reflectedLight.directDiffuse += irradiance * diffuseBRDF * ( 1.0 - F );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScattering, multiScattering );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScattering, multiScattering );
	#endif
	#ifdef USE_DIFFUSE_ROUGHNESS
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		vec3 diffuseAlbedo = EON_DirectionalAlbedo( material.diffuseColor, material.diffuseRoughness, dotNV ) * ( 1.0 - material.metalness );
		vec3 diffuse = irradiance * RECIPROCAL_PI * diffuseAlbedo * ( 1.0 - singleScattering - multiScattering );
	#else
		vec3 diffuse = irradiance * BRDF_Lambert( material.diffuseContribution ) * ( 1.0 - singleScattering - multiScattering );
	#endif
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		sheenSpecularIndirect += irradiance * material.sheenColor * sheenAlbedo * RECIPROCAL_PI;
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		diffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectDiffuse += diffuse;
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness ) * RECIPROCAL_PI;
 	#endif
	vec3 singleScatteringDielectric = vec3( 0.0 );
	vec3 multiScatteringDielectric = vec3( 0.0 );
	vec3 singleScatteringMetallic = vec3( 0.0 );
	vec3 multiScatteringMetallic = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscatteringIridescence( material.dfg, material.diffuseColor, material.specularF90, material.iridescence, material.iridescenceF0Metallic, singleScatteringMetallic, multiScatteringMetallic );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscattering( material.dfg, material.diffuseColor, material.specularF90, singleScatteringMetallic, multiScatteringMetallic );
	#endif
	vec3 singleScattering = mix( singleScatteringDielectric, singleScatteringMetallic, material.metalness );
	vec3 multiScattering = mix( multiScatteringDielectric, multiScatteringMetallic, material.metalness );
	vec3 totalScatteringDielectric = singleScatteringDielectric + multiScatteringDielectric;
	#ifdef USE_DIFFUSE_ROUGHNESS
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		vec3 diffuse = EON_DirectionalAlbedo( material.diffuseColor, material.diffuseRoughness, dotNV ) * ( 1.0 - material.metalness ) * ( 1.0 - totalScatteringDielectric );
	#else
		vec3 diffuse = material.diffuseContribution * ( 1.0 - totalScatteringDielectric );
	#endif
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	vec3 indirectSpecular = radiance * singleScattering;
	indirectSpecular += multiScattering * cosineWeightedIrradiance;
	vec3 indirectDiffuse = diffuse * cosineWeightedIrradiance;
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		indirectSpecular *= sheenEnergyComp;
		indirectDiffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectSpecular += indirectSpecular;
	reflectedLight.indirectDiffuse += indirectDiffuse;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,Nl=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		vec3 iridescenceFresnelDielectric = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		vec3 iridescenceFresnelMetallic = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.diffuseColor );
		material.iridescenceFresnel = mix( iridescenceFresnelDielectric, iridescenceFresnelMetallic, material.metalness );
		material.iridescenceF0Dielectric = Schlick_to_F0( iridescenceFresnelDielectric, 1.0, dotNVi );
		material.iridescenceF0Metallic = Schlick_to_F0( iridescenceFresnelMetallic, 1.0, dotNVi );
	}
#endif
#ifdef STANDARD
	float dotNVms = saturate( dot( geometryNormal, geometryViewDir ) );
	material.dfg = texture2D( dfgLUT, vec2( material.roughness, dotNVms ) ).rg;
	#if ( NUM_SUN_LIGHTS > 0 || NUM_DIR_LIGHTS > 0 || NUM_POINT_LIGHTS > 0 || NUM_SPOT_LIGHTS > 0 )
		float EssMs = material.dfg.x + material.dfg.y;
		material.multiScatteringCompensation = 1.0 + material.specularColorBlended * ( 1.0 / EssMs - 1.0 );
	#endif
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS ) && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SUN_LIGHTS > 0 ) && defined( RE_Direct )
	SunLight sunLight;
	#if defined( USE_SHADOWMAP ) && NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHTS; i ++ ) {
		sunLight = sunLights[ i ];
		getSunLightInfo( sunLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SUN_LIGHT_SHADOWS )
		sunLightShadow = sunLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getSunShadow( sunShadowMap[ i ], sunLightShadow, UNROLLED_LOOP_INDEX ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_LIGHT_PROBE_GRIDS > 0
		vec3 probeWorldPos = ( ( vec4( geometryPosition, 1.0 ) - viewMatrix[ 3 ] ) * viewMatrix ).xyz;
		vec3 probeWorldNormal = transformNormalByInverseViewMatrix( geometryNormal, viewMatrix );
		int probeGrid = - 1;
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_LIGHT_PROBE_GRIDS; i ++ ) {
			if ( isInsideLightProbeGrid( probeWorldPos, probeWorldNormal, probesMin[ i ], probesMax[ i ], probesResolution[ i ] ) ) probeGrid = UNROLLED_LOOP_INDEX;
		}
		#pragma unroll_loop_end
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_LIGHT_PROBE_GRIDS; i ++ ) {
			if ( probeGrid == UNROLLED_LOOP_INDEX ) irradiance += getLightProbeGridIrradiance( probesSH[ i ], probesMin[ i ], probesMax[ i ], probesResolution[ i ], probeWorldPos, probeWorldNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,Ol=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( ENVMAP_TYPE_PMREM )
		#if defined( STANDARD ) || defined( LAMBERT ) || defined( PHONG )
			iblIrradiance += getIBLIrradiance( geometryNormal );
		#endif
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		vec3 iblRadiance = getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		vec3 iblRadiance = getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_RETROREFLECTION
		#ifdef USE_ANISOTROPY
			vec3 retroIBLRadiance = getIBLAnisotropyRetroRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
		#else
			vec3 retroIBLRadiance = getIBLRetroRadiance( geometryViewDir, geometryNormal, material.roughness );
		#endif
		iblRadiance = mix( iblRadiance, retroIBLRadiance, saturate( material.retroreflectivity ) );
	#endif
	radiance += iblRadiance;
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,Fl=`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Bl=`#if NUM_LIGHT_PROBE_GRIDS > 0
uniform highp sampler3D probesSH[ NUM_LIGHT_PROBE_GRIDS ];
uniform vec3 probesMin[ NUM_LIGHT_PROBE_GRIDS ];
uniform vec3 probesMax[ NUM_LIGHT_PROBE_GRIDS ];
uniform vec3 probesResolution[ NUM_LIGHT_PROBE_GRIDS ];
bool isInsideLightProbeGrid( vec3 worldPos, vec3 worldNormal, vec3 probesMin, vec3 probesMax, vec3 probesResolution ) {
	vec3 spacing = ( probesMax - probesMin ) / probesResolution;
	vec3 samplePos = worldPos + worldNormal * spacing * 0.5;
	vec3 margin = spacing * 0.01;
	return all( greaterThanEqual( samplePos, probesMin - margin ) ) && all( lessThanEqual( samplePos, probesMax + margin ) );
}
vec3 getLightProbeGridIrradiance( highp sampler3D probesSH, vec3 probesMin, vec3 probesMax, vec3 probesResolution, vec3 worldPos, vec3 worldNormal ) {
	vec3 res = probesResolution;
	vec3 gridRange = probesMax - probesMin;
	vec3 probeSpacing = gridRange / res;
	vec3 samplePos = worldPos + worldNormal * probeSpacing * 0.5;
	vec3 uvw = clamp( ( samplePos - probesMin ) / gridRange, 0.5 / res, 1.0 - 0.5 / res );
	float nz          = res.z;
	float paddedSlices = nz + 2.0;
	float atlasDepth  = 7.0 * paddedSlices;
	float uvZBase     = uvw.z * nz + 1.0;
	vec4 s0 = texture( probesSH, vec3( uvw.xy, ( uvZBase                       ) / atlasDepth ) );
	vec4 s1 = texture( probesSH, vec3( uvw.xy, ( uvZBase +       paddedSlices   ) / atlasDepth ) );
	vec4 s2 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 2.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s3 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 3.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s4 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 4.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s5 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 5.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s6 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 6.0 * paddedSlices   ) / atlasDepth ) );
	vec3 c0 = s0.xyz;
	vec3 c1 = vec3( s0.w, s1.xy );
	vec3 c2 = vec3( s1.zw, s2.x );
	vec3 c3 = s2.yzw;
	vec3 c4 = s3.xyz;
	vec3 c5 = vec3( s3.w, s4.xy );
	vec3 c6 = vec3( s4.zw, s5.x );
	vec3 c7 = s5.yzw;
	vec3 c8 = s6.xyz;
	float x = worldNormal.x, y = worldNormal.y, z = worldNormal.z;
	vec3 result = c0 * 0.886227;
	result += c1 * 2.0 * 0.511664 * y;
	result += c2 * 2.0 * 0.511664 * z;
	result += c3 * 2.0 * 0.511664 * x;
	result += c4 * 2.0 * 0.429043 * x * y;
	result += c5 * 2.0 * 0.429043 * y * z;
	result += c6 * ( 0.743125 * z * z - 0.247708 );
	result += c7 * 2.0 * 0.429043 * x * z;
	result += c8 * 0.429043 * ( x * x - y * y );
	return max( result, vec3( 0.0 ) );
}
#endif`,Gl=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,Hl=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Vl=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,kl=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,zl=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Wl=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Xl=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,ql=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Kl=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Yl=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,$l=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,Zl=`#if defined( USE_MORPHCOLORS )
	#if defined( USE_COLOR_ALPHA )
		vColor *= morphTargetBaseInfluence;
	#elif defined( USE_COLOR )
		vColor.rgb *= morphTargetBaseInfluence;
	#endif
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor.rgb += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Ql=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,jl=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,Jl=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,ec=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#ifdef DOUBLE_SIDED
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#ifdef DOUBLE_SIDED
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,tc=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#if defined( USE_PACKED_NORMALMAP )
		mapN = vec3( mapN.xy, sqrt( saturate( 1.0 - dot( mapN.xy, mapN.xy ) ) ) );
	#endif
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,nc=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,ic=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,ac=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		#ifdef FLIP_SIDED
			vBitangent = - vBitangent;
		#endif
	#endif
#endif`,rc=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,oc=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,sc=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,lc=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,cc=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,fc=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,dc=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	#ifdef USE_REVERSED_DEPTH_BUFFER
	
		return depth * ( far - near ) - far;
	#else
		return depth * ( near - far ) - near;
	#endif
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	
	#ifdef USE_REVERSED_DEPTH_BUFFER
		return ( near * far ) / ( ( near - far ) * depth - near );
	#else
		return ( near * far ) / ( ( far - near ) * depth - far );
	#endif
}`,uc=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,hc=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,pc=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,mc=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,gc=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,_c=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,vc=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		#define SUN_LIGHT_CASCADES 2
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#else
			uniform sampler2D sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#endif
		uniform mat4 sunShadowMatrix[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		uniform vec4 sunShadowCascade[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
		struct SunLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SunLightShadow sunLightShadows[ NUM_SUN_LIGHT_SHADOWS ];
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#else
			uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#endif
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#else
			uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#endif
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform samplerCubeShadow pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#elif defined( SHADOWMAP_TYPE_BASIC )
			uniform samplerCube pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#endif
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float interleavedGradientNoise( vec2 position ) {
			return fract( 52.9829189 * fract( dot( position, vec2( 0.06711056, 0.00583715 ) ) ) );
		}
		vec2 vogelDiskSample( int sampleIndex, int samplesCount, float phi ) {
			const float goldenAngle = 2.399963229728653;
			float r = sqrt( ( float( sampleIndex ) + 0.5 ) / float( samplesCount ) );
			float theta = float( sampleIndex ) * goldenAngle + phi;
			return vec2( cos( theta ), sin( theta ) ) * r;
		}
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float getShadow( sampler2DShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
				vec2 radius = shadowRadius * texelSize;
				float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
				shadow = (
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 0, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 1, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 2, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 3, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 4, 5, phi ) * radius, shadowCoord.z ) )
				) * 0.2;
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#elif defined( SHADOWMAP_TYPE_VSM )
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 distribution = texture2D( shadowMap, shadowCoord.xy ).rg;
				float mean = distribution.x;
				float variance = distribution.y * distribution.y;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					float hard_shadow = step( mean, shadowCoord.z );
				#else
					float hard_shadow = step( shadowCoord.z, mean );
				#endif
				
				if ( hard_shadow == 1.0 ) {
					shadow = 1.0;
				} else {
					variance = max( variance, 0.0000001 );
					float d = shadowCoord.z - mean;
					float p_max = variance / ( variance + d * d );
					p_max = clamp( ( p_max - 0.3 ) / 0.65, 0.0, 1.0 );
					shadow = max( hard_shadow, p_max );
				}
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#else
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				float depth = texture2D( shadowMap, shadowCoord.xy ).r;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					shadow = step( depth, shadowCoord.z );
				#else
					shadow = step( shadowCoord.z, depth );
				#endif
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#endif
	#if NUM_SUN_LIGHT_SHADOWS > 0
		float getSunShadow(
			#if defined( SHADOWMAP_TYPE_PCF )
				sampler2DShadow shadowMap,
			#else
				sampler2D shadowMap,
			#endif
			SunLightShadow sunLightShadow,
			int shadowIndex
		) {
			vec4 shadowWorldPosition = vec4( vSunShadowWorldPosition.xyz + vSunShadowWorldNormal * sunLightShadow.shadowNormalBias, 1.0 );
			float viewDepth = vSunShadowWorldPosition.w;
			int cascadeOffset = shadowIndex * SUN_LIGHT_CASCADES;
			float shadow = 1.0;
			for ( int i = SUN_LIGHT_CASCADES - 1; i >= 0; i -- ) {
				vec4 cascade = sunShadowCascade[ cascadeOffset + i ];
				if ( viewDepth >= cascade.x && viewDepth < cascade.y ) {
					float cascadeShadow = getShadow(
						shadowMap,
						sunLightShadow.shadowMapSize,
						sunLightShadow.shadowIntensity,
						sunLightShadow.shadowBias,
						sunLightShadow.shadowRadius,
						sunShadowMatrix[ cascadeOffset + i ] * shadowWorldPosition
					);
					shadow = mix( cascadeShadow, shadow, smoothstep( cascade.z, cascade.y, viewDepth ) );
				}
			}
			return shadow;
		}
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	#if defined( SHADOWMAP_TYPE_PCF )
	float getPointShadow( samplerCubeShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 bd3D = normalize( lightToPosition );
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float lightDistance = length( lightToPosition );
			float depthRange = shadowCameraFar - shadowCameraNear;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				float depthA = - shadowCameraNear / depthRange - shadowBias;
				float depthB = shadowCameraNear * shadowCameraFar / ( depthRange * lightDistance );
			#else
				float depthA = shadowCameraFar / depthRange + shadowBias;
				float depthB = - shadowCameraNear * shadowCameraFar / ( depthRange * lightDistance );
			#endif
			float texelSize = shadowRadius / shadowMapSize.x;
			vec3 absDir = abs( bd3D );
			vec3 tangent = absDir.x > absDir.z ? vec3( 0.0, 1.0, 0.0 ) : vec3( 1.0, 0.0, 0.0 );
			tangent = normalize( cross( bd3D, tangent ) );
			vec3 bitangent = cross( bd3D, tangent );
			float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
			shadow = 0.0;
			for ( int i = 0; i < 5; i ++ ) {
				vec2 offset = vogelDiskSample( i, 5, phi );
				vec3 direction = bd3D + ( tangent * offset.x + bitangent * offset.y ) * texelSize;
				vec3 absDirection = abs( direction );
				float dp = depthA + depthB / max( max( absDirection.x, absDirection.y ), absDirection.z );
				shadow += texture( shadowMap, vec4( direction, dp ) );
			}
			shadow *= 0.2;
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#elif defined( SHADOWMAP_TYPE_BASIC )
	float getPointShadow( samplerCube shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			float depth = textureCube( shadowMap, bd3D ).r;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				depth = 1.0 - depth;
			#endif
			shadow = step( dp, depth );
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#endif
	#endif
#endif`,Sc=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,Ec=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_SUN_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	#ifdef HAS_NORMAL
		vec3 shadowWorldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
	#else
		vec3 shadowWorldNormal = vec3( 0.0 );
	#endif
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_SUN_LIGHT_SHADOWS > 0
		vSunShadowWorldPosition = vec4( worldPosition.xyz, - mvPosition.z );
		vSunShadowWorldNormal = shadowWorldNormal;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,Mc=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHT_SHADOWS; i ++ ) {
		sunLight = sunLightShadows[ i ];
		shadow *= receiveShadow ? getSunShadow( sunShadowMap[ i ], sunLight, UNROLLED_LOOP_INDEX ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0 && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,xc=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Tc=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,bc=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Ac=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,Rc=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,wc=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,Pc=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,Cc=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,Lc=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseContribution, material.specularColorBlended, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,Dc=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,yc=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_DIFFUSE_ROUGHNESSMAP
	varying vec2 vDiffuseRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Uc=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_DIFFUSE_ROUGHNESSMAP
	uniform mat3 diffuseRoughnessMapTransform;
	varying vec2 vDiffuseRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Ic=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DIFFUSE_ROUGHNESSMAP
	vDiffuseRoughnessMapUv = ( diffuseRoughnessMapTransform * vec3( DIFFUSE_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,Nc=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const Oc=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,Fc=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Bc=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Gc=`uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <envmap_common_pars_fragment>
void main() {
	#ifdef ENVMAP_TYPE_PMREM
		vec4 texColor = textureLod( envMap, backgroundRotation * vWorldDirection, roughnessToMip( backgroundBlurriness ) );
	#else
		vec4 texColor = textureCube( envMap, backgroundRotation * vWorldDirection );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Hc=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Vc=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,kc=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,zc=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,Wc=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,Xc=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = vec4( dist, 0.0, 0.0, 1.0 );
}`,qc=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Kc=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Yc=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,$c=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Zc=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,Qc=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,jc=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Jc=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,ef=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,tf=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,nf=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,af=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( normalize( normal ) * 0.5 + 0.5, diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,rf=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,of=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,sf=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,lf=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DIFFUSE_ROUGHNESS
	uniform float diffuseRoughness;
	#ifdef USE_DIFFUSE_ROUGHNESSMAP
		uniform sampler2D diffuseRoughnessMap;
	#endif
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_RETROREFLECTION
	uniform float retroreflectivity;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
 
		outgoingLight = outgoingLight + sheenSpecularDirect + sheenSpecularIndirect;
 
 	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,cf=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,ff=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,df=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,uf=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,hf=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,pf=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,mf=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,gf=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Ne={alphahash_fragment:Fs,alphahash_pars_fragment:Bs,alphamap_fragment:Gs,alphamap_pars_fragment:Hs,alphatest_fragment:Vs,alphatest_pars_fragment:ks,aomap_fragment:zs,aomap_pars_fragment:Ws,batching_pars_vertex:Xs,batching_vertex:qs,begin_vertex:Ks,beginnormal_vertex:Ys,bsdfs:$s,iridescence_fragment:Zs,bumpmap_pars_fragment:Qs,clipping_planes_fragment:js,clipping_planes_pars_fragment:Js,clipping_planes_pars_vertex:el,clipping_planes_vertex:tl,color_fragment:nl,color_pars_fragment:il,color_pars_vertex:al,color_vertex:rl,common:ol,defaultnormal_vertex:sl,displacementmap_pars_vertex:ll,displacementmap_vertex:cl,emissivemap_fragment:fl,emissivemap_pars_fragment:dl,colorspace_fragment:ul,colorspace_pars_fragment:hl,envmap_fragment:pl,envmap_common_pars_fragment:ml,envmap_pars_fragment:gl,envmap_pars_vertex:_l,envmap_physical_pars_fragment:Pl,envmap_vertex:vl,fog_vertex:Sl,fog_pars_vertex:El,fog_fragment:Ml,fog_pars_fragment:xl,gradientmap_pars_fragment:Tl,lightmap_pars_fragment:bl,lights_lambert_fragment:Al,lights_lambert_pars_fragment:Rl,lights_pars_begin:wl,lights_toon_fragment:Cl,lights_toon_pars_fragment:Ll,lights_phong_fragment:Dl,lights_phong_pars_fragment:yl,lights_physical_fragment:Ul,lights_physical_pars_fragment:Il,lights_fragment_begin:Nl,lights_fragment_maps:Ol,lights_fragment_end:Fl,lightprobes_pars_fragment:Bl,logdepthbuf_fragment:Gl,logdepthbuf_pars_fragment:Hl,logdepthbuf_pars_vertex:Vl,logdepthbuf_vertex:kl,map_fragment:zl,map_pars_fragment:Wl,map_particle_fragment:Xl,map_particle_pars_fragment:ql,metalnessmap_fragment:Kl,metalnessmap_pars_fragment:Yl,morphinstance_vertex:$l,morphcolor_vertex:Zl,morphnormal_vertex:Ql,morphtarget_pars_vertex:jl,morphtarget_vertex:Jl,normal_fragment_begin:ec,normal_fragment_maps:tc,normal_pars_fragment:nc,normal_pars_vertex:ic,normal_vertex:ac,normalmap_pars_fragment:rc,clearcoat_normal_fragment_begin:oc,clearcoat_normal_fragment_maps:sc,clearcoat_pars_fragment:lc,iridescence_pars_fragment:cc,opaque_fragment:fc,packing:dc,premultiplied_alpha_fragment:uc,project_vertex:hc,dithering_fragment:pc,dithering_pars_fragment:mc,roughnessmap_fragment:gc,roughnessmap_pars_fragment:_c,shadowmap_pars_fragment:vc,shadowmap_pars_vertex:Sc,shadowmap_vertex:Ec,shadowmask_pars_fragment:Mc,skinbase_vertex:xc,skinning_pars_vertex:Tc,skinning_vertex:bc,skinnormal_vertex:Ac,specularmap_fragment:Rc,specularmap_pars_fragment:wc,tonemapping_fragment:Pc,tonemapping_pars_fragment:Cc,transmission_fragment:Lc,transmission_pars_fragment:Dc,uv_pars_fragment:yc,uv_pars_vertex:Uc,uv_vertex:Ic,worldpos_vertex:Nc,background_vert:Oc,background_frag:Fc,backgroundCube_vert:Bc,backgroundCube_frag:Gc,cube_vert:Hc,cube_frag:Vc,depth_vert:kc,depth_frag:zc,distance_vert:Wc,distance_frag:Xc,equirect_vert:qc,equirect_frag:Kc,linedashed_vert:Yc,linedashed_frag:$c,meshbasic_vert:Zc,meshbasic_frag:Qc,meshlambert_vert:jc,meshlambert_frag:Jc,meshmatcap_vert:ef,meshmatcap_frag:tf,meshnormal_vert:nf,meshnormal_frag:af,meshphong_vert:rf,meshphong_frag:of,meshphysical_vert:sf,meshphysical_frag:lf,meshtoon_vert:cf,meshtoon_frag:ff,points_vert:df,points_frag:uf,shadow_vert:hf,shadow_frag:pf,sprite_vert:mf,sprite_frag:gf},me={common:{diffuse:{value:new qe(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Ve},alphaMap:{value:null},alphaMapTransform:{value:new Ve},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Ve}},envmap:{envMap:{value:null},envMapRotation:{value:new Ve},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Ve}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Ve}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Ve},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Ve},normalScale:{value:new xt(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Ve},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Ve}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Ve}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Ve}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new qe(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},sunLights:{value:[],properties:{direction:{},color:{}}},sunLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},sunShadowMatrix:{value:[]},sunShadowCascade:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:[]},probesMin:{value:[]},probesMax:{value:[]},probesResolution:{value:[]}},points:{diffuse:{value:new qe(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Ve},alphaTest:{value:0},uvTransform:{value:new Ve}},sprite:{diffuse:{value:new qe(16777215)},opacity:{value:1},center:{value:new xt(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Ve},alphaMap:{value:null},alphaMapTransform:{value:new Ve},alphaTest:{value:0}}},Vt={basic:{uniforms:wt([me.common,me.specularmap,me.envmap,me.aomap,me.lightmap,me.fog]),vertexShader:Ne.meshbasic_vert,fragmentShader:Ne.meshbasic_frag},lambert:{uniforms:wt([me.common,me.specularmap,me.envmap,me.aomap,me.lightmap,me.emissivemap,me.bumpmap,me.normalmap,me.displacementmap,me.fog,me.lights,{emissive:{value:new qe(0)},envMapIntensity:{value:1}}]),vertexShader:Ne.meshlambert_vert,fragmentShader:Ne.meshlambert_frag},phong:{uniforms:wt([me.common,me.specularmap,me.envmap,me.aomap,me.lightmap,me.emissivemap,me.bumpmap,me.normalmap,me.displacementmap,me.fog,me.lights,{emissive:{value:new qe(0)},specular:{value:new qe(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:Ne.meshphong_vert,fragmentShader:Ne.meshphong_frag},standard:{uniforms:wt([me.common,me.envmap,me.aomap,me.lightmap,me.emissivemap,me.bumpmap,me.normalmap,me.displacementmap,me.roughnessmap,me.metalnessmap,me.fog,me.lights,{emissive:{value:new qe(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Ne.meshphysical_vert,fragmentShader:Ne.meshphysical_frag},toon:{uniforms:wt([me.common,me.aomap,me.lightmap,me.emissivemap,me.bumpmap,me.normalmap,me.displacementmap,me.gradientmap,me.fog,me.lights,{emissive:{value:new qe(0)}}]),vertexShader:Ne.meshtoon_vert,fragmentShader:Ne.meshtoon_frag},matcap:{uniforms:wt([me.common,me.bumpmap,me.normalmap,me.displacementmap,me.fog,{matcap:{value:null}}]),vertexShader:Ne.meshmatcap_vert,fragmentShader:Ne.meshmatcap_frag},points:{uniforms:wt([me.points,me.fog]),vertexShader:Ne.points_vert,fragmentShader:Ne.points_frag},dashed:{uniforms:wt([me.common,me.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Ne.linedashed_vert,fragmentShader:Ne.linedashed_frag},depth:{uniforms:wt([me.common,me.displacementmap]),vertexShader:Ne.depth_vert,fragmentShader:Ne.depth_frag},normal:{uniforms:wt([me.common,me.bumpmap,me.normalmap,me.displacementmap,{opacity:{value:1}}]),vertexShader:Ne.meshnormal_vert,fragmentShader:Ne.meshnormal_frag},sprite:{uniforms:wt([me.sprite,me.fog]),vertexShader:Ne.sprite_vert,fragmentShader:Ne.sprite_frag},background:{uniforms:{uvTransform:{value:new Ve},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Ne.background_vert,fragmentShader:Ne.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Ve}},vertexShader:Ne.backgroundCube_vert,fragmentShader:Ne.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Ne.cube_vert,fragmentShader:Ne.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Ne.equirect_vert,fragmentShader:Ne.equirect_frag},distance:{uniforms:wt([me.common,me.displacementmap,{referencePosition:{value:new ie},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Ne.distance_vert,fragmentShader:Ne.distance_frag},shadow:{uniforms:wt([me.lights,me.fog,{color:{value:new qe(0)},opacity:{value:1}}]),vertexShader:Ne.shadow_vert,fragmentShader:Ne.shadow_frag}};Vt.physical={uniforms:wt([Vt.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Ve},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Ve},clearcoatNormalScale:{value:new xt(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Ve},diffuseRoughness:{value:0},diffuseRoughnessMap:{value:null},diffuseRoughnessMapTransform:{value:new Ve},dispersion:{value:0},retroreflectivity:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Ve},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Ve},sheen:{value:0},sheenColor:{value:new qe(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Ve},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Ve},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Ve},transmissionSamplerSize:{value:new xt},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Ve},attenuationDistance:{value:0},attenuationColor:{value:new qe(0)},specularColor:{value:new qe(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Ve},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Ve},anisotropyVector:{value:new xt},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Ve}}]),vertexShader:Ne.meshphysical_vert,fragmentShader:Ne.meshphysical_frag};const Gn={r:0,b:0,g:0},_f=new mn,Cr=new Ve;Cr.set(-1,0,0,0,1,0,0,0,1);function vf(e,n,t,i,a,r){const o=new qe(0);let s=a===!0?0:1,p,d,m=null,g=0,v=null;function _(M){let b=M.isScene===!0?M.background:null;if(b&&b.isTexture){const T=M.backgroundBlurriness>0;b=n.get(b,T)}return b}function R(M){let b=!1;const T=_(M);T===null?h(o,s):T&&T.isColor&&(h(T,1),b=!0);const D=e.xr.getEnvironmentBlendMode();D==="additive"?t.buffers.color.setClear(0,0,0,1,r):D==="alpha-blend"&&t.buffers.color.setClear(0,0,0,0,r),(e.autoClear||b)&&(t.buffers.depth.setTest(!0),t.buffers.depth.setMask(!0),t.buffers.color.setMask(!0),e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil))}function L(M,b){const T=_(b);T&&T.isCubeTexture?(d===void 0&&(d=new ye(new ln(1,1,1),new gn({name:"BackgroundCubeMaterial",uniforms:mi(Vt.backgroundCube.uniforms),vertexShader:Vt.backgroundCube.vertexShader,fragmentShader:Vt.backgroundCube.fragmentShader,side:Dt,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),d.geometry.deleteAttribute("normal"),d.geometry.deleteAttribute("uv"),d.onBeforeRender=function(D,w,c){this.matrixWorld.copyPosition(c.matrixWorld)},Object.defineProperty(d.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),i.update(d)),d.material.uniforms.envMap.value=T,d.material.uniforms.backgroundBlurriness.value=b.backgroundBlurriness,d.material.uniforms.backgroundIntensity.value=b.backgroundIntensity,d.material.uniforms.backgroundRotation.value.setFromMatrix4(_f.makeRotationFromEuler(b.backgroundRotation)).transpose(),T.isRenderTargetTexture===!1&&d.material.uniforms.backgroundRotation.value.premultiply(Cr),d.material.toneMapped=rt.getTransfer(T.colorSpace)!==Ze,(m!==T||g!==T.version||v!==e.toneMapping)&&(d.material.needsUpdate=!0,m=T,g=T.version,v=e.toneMapping),d.layers.enableAll(),M.unshift(d,d.geometry,d.material,0,0,null)):T&&T.isTexture&&(p===void 0&&(p=new ye(new Ct(2,2),new gn({name:"BackgroundMaterial",uniforms:mi(Vt.background.uniforms),vertexShader:Vt.background.vertexShader,fragmentShader:Vt.background.fragmentShader,side:Ln,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),p.geometry.deleteAttribute("normal"),Object.defineProperty(p.material,"map",{get:function(){return this.uniforms.t2D.value}}),i.update(p)),p.material.uniforms.t2D.value=T,p.material.uniforms.backgroundIntensity.value=b.backgroundIntensity,p.material.toneMapped=rt.getTransfer(T.colorSpace)!==Ze,T.matrixAutoUpdate===!0&&T.updateMatrix(),p.material.uniforms.uvTransform.value.copy(T.matrix),(m!==T||g!==T.version||v!==e.toneMapping)&&(p.material.needsUpdate=!0,m=T,g=T.version,v=e.toneMapping),p.layers.enableAll(),M.unshift(p,p.geometry,p.material,0,0,null))}function h(M,b){M.getRGB(Gn,fr(e)),t.buffers.color.setClear(Gn.r,Gn.g,Gn.b,b,r)}function u(){d!==void 0&&(d.geometry.dispose(),d.material.dispose(),d=void 0),p!==void 0&&(p.geometry.dispose(),p.material.dispose(),p=void 0)}return{getClearColor:function(){return o},setClearColor:function(M,b=1){o.set(M),s=b,h(o,s)},getClearAlpha:function(){return s},setClearAlpha:function(M){s=M,h(o,s)},render:R,addToRenderList:L,dispose:u}}function Sf(e,n){const t=e.getParameter(e.MAX_VERTEX_ATTRIBS),i={},a=v(null);let r=a,o=!1;function s(B,K,$,C,Q){let y=!1;const N=g(B,C,$,K);r!==N&&(r=N,d(r.object)),y=_(B,C,$,Q),y&&R(B,C,$,Q),Q!==null&&n.update(Q,e.ELEMENT_ARRAY_BUFFER),(y||o)&&(o=!1,T(B,K,$,C),Q!==null&&e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,n.get(Q).buffer))}function p(){return e.createVertexArray()}function d(B){return e.bindVertexArray(B)}function m(B){return e.deleteVertexArray(B)}function g(B,K,$,C){const Q=C.wireframe===!0;let y=i[K.id];y===void 0&&(y={},i[K.id]=y);const N=B.isInstancedMesh===!0?B.id:0;let ae=y[N];ae===void 0&&(ae={},y[N]=ae);let Y=ae[$.id];Y===void 0&&(Y={},ae[$.id]=Y);let ee=Y[Q];return ee===void 0&&(ee=v(p()),Y[Q]=ee),ee}function v(B){const K=[],$=[],C=[];for(let Q=0;Q<t;Q++)K[Q]=0,$[Q]=0,C[Q]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:K,enabledAttributes:$,attributeDivisors:C,object:B,attributes:{},index:null}}function _(B,K,$,C){const Q=r.attributes,y=K.attributes;let N=0;const ae=$.getAttributes();for(const Y in ae)if(ae[Y].location>=0){const re=Q[Y];let we=y[Y];if(we===void 0&&(Y==="instanceMatrix"&&B.instanceMatrix&&(we=B.instanceMatrix),Y==="instanceColor"&&B.instanceColor&&(we=B.instanceColor)),re===void 0||re.attribute!==we||we&&re.data!==we.data)return!0;N++}return r.attributesNum!==N||r.index!==C}function R(B,K,$,C){const Q={},y=K.attributes;let N=0;const ae=$.getAttributes();for(const Y in ae)if(ae[Y].location>=0){let re=y[Y];re===void 0&&(Y==="instanceMatrix"&&B.instanceMatrix&&(re=B.instanceMatrix),Y==="instanceColor"&&B.instanceColor&&(re=B.instanceColor));const we={};we.attribute=re,re&&re.data&&(we.data=re.data),Q[Y]=we,N++}r.attributes=Q,r.attributesNum=N,r.index=C}function L(){const B=r.newAttributes;for(let K=0,$=B.length;K<$;K++)B[K]=0}function h(B){u(B,0)}function u(B,K){const $=r.newAttributes,C=r.enabledAttributes,Q=r.attributeDivisors;$[B]=1,C[B]===0&&(e.enableVertexAttribArray(B),C[B]=1),Q[B]!==K&&(e.vertexAttribDivisor(B,K),Q[B]=K)}function M(){const B=r.newAttributes,K=r.enabledAttributes;for(let $=0,C=K.length;$<C;$++)K[$]!==B[$]&&(e.disableVertexAttribArray($),K[$]=0)}function b(B,K,$,C,Q,y,N){N===!0?e.vertexAttribIPointer(B,K,$,Q,y):e.vertexAttribPointer(B,K,$,C,Q,y)}function T(B,K,$,C){L();const Q=C.attributes,y=$.getAttributes(),N=K.defaultAttributeValues;for(const ae in y){const Y=y[ae];if(Y.location>=0){let ee=Q[ae];if(ee===void 0&&(ae==="instanceMatrix"&&B.instanceMatrix&&(ee=B.instanceMatrix),ae==="instanceColor"&&B.instanceColor&&(ee=B.instanceColor)),ee!==void 0){const re=ee.normalized,we=ee.itemSize,Fe=n.get(ee);if(Fe===void 0)continue;const X=Fe.buffer,_e=Fe.type,xe=Fe.bytesPerElement,Pe=_e===e.INT||_e===e.UNSIGNED_INT||ee.gpuType===hr;if(ee.isInterleavedBufferAttribute){const ve=ee.data,Oe=ve.isInterleavedBuffer===!0?ve.stride:ve.itemSize,At=ee.offset;if(ve.isInstancedInterleavedBuffer||ve.isInstancedBufferAttribute){for(let Ce=0;Ce<Y.locationSize;Ce++)u(Y.location+Ce,ve.meshPerAttribute);B.isInstancedMesh!==!0&&C._maxInstanceCount===void 0&&(C._maxInstanceCount=ve.meshPerAttribute*ve.count)}else for(let Ce=0;Ce<Y.locationSize;Ce++)h(Y.location+Ce);e.bindBuffer(e.ARRAY_BUFFER,X);for(let Ce=0;Ce<Y.locationSize;Ce++)b(Y.location+Ce,we/Y.locationSize,_e,re,Oe*xe,(At+we/Y.locationSize*Ce)*xe,Pe)}else{if(ee.isInstancedBufferAttribute){for(let ve=0;ve<Y.locationSize;ve++)u(Y.location+ve,ee.meshPerAttribute);B.isInstancedMesh!==!0&&C._maxInstanceCount===void 0&&(C._maxInstanceCount=ee.meshPerAttribute*ee.count)}else for(let ve=0;ve<Y.locationSize;ve++)h(Y.location+ve);e.bindBuffer(e.ARRAY_BUFFER,X);for(let ve=0;ve<Y.locationSize;ve++)b(Y.location+ve,we/Y.locationSize,_e,re,we*xe,we/Y.locationSize*ve*xe,Pe)}}else if(N!==void 0){const re=N[ae];if(re!==void 0)switch(re.length){case 2:e.vertexAttrib2fv(Y.location,re);break;case 3:e.vertexAttrib3fv(Y.location,re);break;case 4:e.vertexAttrib4fv(Y.location,re);break;default:e.vertexAttrib1fv(Y.location,re)}}}}M()}function D(){W();for(const B in i){const K=i[B];for(const $ in K){const C=K[$];for(const Q in C){const y=C[Q];for(const N in y)m(y[N].object),delete y[N];delete C[Q]}}delete i[B]}}function w(B){if(i[B.id]===void 0)return;const K=i[B.id];for(const $ in K){const C=K[$];for(const Q in C){const y=C[Q];for(const N in y)m(y[N].object),delete y[N];delete C[Q]}}delete i[B.id]}function c(B){for(const K in i){const $=i[K];for(const C in $){const Q=$[C];if(Q[B.id]===void 0)continue;const y=Q[B.id];for(const N in y)m(y[N].object),delete y[N];delete Q[B.id]}}}function E(B){for(const K in i){const $=i[K],C=B.isInstancedMesh===!0?B.id:0,Q=$[C];if(Q!==void 0){for(const y in Q){const N=Q[y];for(const ae in N)m(N[ae].object),delete N[ae];delete Q[y]}delete $[C],Object.keys($).length===0&&delete i[K]}}}function W(){F(),o=!0,r!==a&&(r=a,d(r.object))}function F(){a.geometry=null,a.program=null,a.wireframe=!1}return{setup:s,reset:W,resetDefaultState:F,dispose:D,releaseStatesOfGeometry:w,releaseStatesOfObject:E,releaseStatesOfProgram:c,initAttributes:L,enableAttribute:h,disableUnusedAttributes:M}}function Ef(e,n,t){let i;function a(p){i=p}function r(p,d){e.drawArrays(i,p,d),t.update(d,i,1)}function o(p,d,m){m!==0&&(e.drawArraysInstanced(i,p,d,m),t.update(d,i,m))}function s(p,d,m){if(m===0)return;n.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,p,0,d,0,m);let v=0;for(let _=0;_<m;_++)v+=d[_];t.update(v,i,1)}this.setMode=a,this.render=r,this.renderInstances=o,this.renderMultiDraw=s}function Mf(e,n,t,i){let a;function r(){if(a!==void 0)return a;if(n.has("EXT_texture_filter_anisotropic")===!0){const c=n.get("EXT_texture_filter_anisotropic");a=e.getParameter(c.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else a=0;return a}function o(c){return!(c!==jt&&i.convert(c)!==e.getParameter(e.IMPLEMENTATION_COLOR_READ_FORMAT))}function s(c){const E=c===Yt&&(n.has("EXT_color_buffer_half_float")||n.has("EXT_color_buffer_float"));return!(c!==kt&&c!==Qt&&!E&&i.convert(c)!==e.getParameter(e.IMPLEMENTATION_COLOR_READ_TYPE))}function p(c){if(c==="highp"){if(e.getShaderPrecisionFormat(e.VERTEX_SHADER,e.HIGH_FLOAT).precision>0&&e.getShaderPrecisionFormat(e.FRAGMENT_SHADER,e.HIGH_FLOAT).precision>0)return"highp";c="mediump"}return c==="mediump"&&e.getShaderPrecisionFormat(e.VERTEX_SHADER,e.MEDIUM_FLOAT).precision>0&&e.getShaderPrecisionFormat(e.FRAGMENT_SHADER,e.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let d=t.precision!==void 0?t.precision:"highp";const m=p(d);m!==d&&(Xe("WebGLRenderer:",d,"not supported, using",m,"instead."),d=m);const g=t.reversedDepthBuffer===!0&&n.has("EXT_clip_control"),v=t.logarithmicDepthBuffer===!0&&g===!1;t.reversedDepthBuffer===!0&&g===!1&&Xe("WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer."),t.logarithmicDepthBuffer===!0&&g===!0&&Xe("WebGLRenderer: Logarithmic depth buffer is ignored when reversed depth buffer is enabled.");const _=e.getParameter(e.MAX_TEXTURE_IMAGE_UNITS),R=e.getParameter(e.MAX_VERTEX_TEXTURE_IMAGE_UNITS),L=e.getParameter(e.MAX_TEXTURE_SIZE),h=e.getParameter(e.MAX_CUBE_MAP_TEXTURE_SIZE),u=e.getParameter(e.MAX_VERTEX_ATTRIBS),M=e.getParameter(e.MAX_VERTEX_UNIFORM_VECTORS),b=e.getParameter(e.MAX_VARYING_VECTORS),T=e.getParameter(e.MAX_FRAGMENT_UNIFORM_VECTORS),D=e.getParameter(e.MAX_SAMPLES),w=e.getParameter(e.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:p,textureFormatReadable:o,textureTypeReadable:s,precision:d,logarithmicDepthBuffer:v,reversedDepthBuffer:g,maxTextures:_,maxVertexTextures:R,maxTextureSize:L,maxCubemapSize:h,maxAttributes:u,maxVertexUniforms:M,maxVaryings:b,maxFragmentUniforms:T,maxSamples:D,samples:w}}function xf(e){const n=this;let t=null,i=0,a=!1,r=!1;const o=new nn,s=new Ve,p={value:null,needsUpdate:!1};this.uniform=p,this.numPlanes=0,this.numIntersection=0,this.init=function(g,v){const _=g.length!==0||v||i!==0||a;return a=v,i=g.length,_},this.beginShadows=function(){r=!0,m(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(g,v){t=m(g,v,0)},this.setState=function(g,v,_){const R=g.clippingPlanes,L=g.clipIntersection,h=g.clipShadows,u=e.get(g);if(!a||R===null||R.length===0||r&&!h)r?m(null):d();else{const M=r?0:i,b=M*4;let T=u.clippingState||null;p.value=T,T=m(R,v,b,_);for(let D=0;D!==b;++D)T[D]=t[D];u.clippingState=T,this.numIntersection=L?this.numPlanes:0,this.numPlanes+=M}};function d(){p.value!==t&&(p.value=t,p.needsUpdate=i>0),n.numPlanes=i,n.numIntersection=0}function m(g,v,_,R){const L=g!==null?g.length:0;let h=null;if(L!==0){if(h=p.value,R!==!0||h===null){const u=_+L*4,M=v.matrixWorldInverse;s.getNormalMatrix(M),(h===null||h.length<u)&&(h=new Float32Array(u));for(let b=0,T=_;b!==L;++b,T+=4)o.copy(g[b]).applyMatrix4(M,s),o.normal.toArray(h,T),h[T+3]=o.constant}p.value=h,p.needsUpdate=!0}return n.numPlanes=L,n.numIntersection=0,h}}class bi extends zt{constructor(n=1,t={}){super(n,n,t),this.isWebGLCubeRenderTarget=!0;const i={width:n,height:n,depth:1},a=[i,i,i,i,i,i];this.texture=new dr(a),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(n,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const i={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},a=new ln(5,5,5),r=new gn({name:"CubemapFromEquirect",uniforms:mi(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:Dt,blending:pn});r.uniforms.tEquirect.value=t;const o=new ye(a,r),s=t.minFilter;return t.minFilter===an&&(t.minFilter=Bt),new gi(1,10,this).update(n,o),t.minFilter=s,o.geometry.dispose(),o.material.dispose(),this}clear(n,t=!0,i=!0,a=!0){const r=n.getRenderTarget();for(let o=0;o<6;o++)n.setRenderTarget(this,o),n.clear(t,i,a);n.setRenderTarget(r)}}const Da=256,Tf=3,bf=20,Lr=256,Dr=16,Af=3,Rf=new ie,wf=new qe;class Zn{constructor(n){this._renderer=n,this._cubeSize=0,this._sourceTarget=null,this._cubeCamera=new gi(1,10,null),this._boxMesh=new ye(new ln(5,5,5),null),this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null,this._integrationMaterial=null}fromScene(n,t=0,i=.1,a=100,r={}){const{size:o=256,position:s=Rf}=r,p=this._renderer;this._setSize(o);const d=this._allocateTarget(),m=this._getSourceTarget(!0);t>0&&(m.texture.mipmapsAutoUpdate=!1);const g=p.autoClear,v=p.autoClearColor,_=p.autoClearDepth,R=p.autoClearStencil,L=n.background;p.autoClear=!0,p.autoClearColor=!0,p.autoClearDepth=!0,p.autoClearStencil=!0,L===null&&(n.background=p.getClearColor(wf));const h=new gi(i,a,m);return h.position.copy(s),h.update(p,n),p.autoClear=g,p.autoClearColor=v,p.autoClearDepth=_,p.autoClearStencil=R,n.background=L,t>0&&(m.texture.mipmapsAutoUpdate=!0,this._blur(d,t)),this._applyPMREM(d),d}fromEquirectangular(n,t=null){return this._fromTexture(n,t)}fromCubemap(n,t=null){return this._fromTexture(n,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Ia(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Ua(),this._compileMaterial(this._equirectMaterial))}dispose(){this._sourceTarget!==null&&this._sourceTarget.dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._integrationMaterial!==null&&this._integrationMaterial.dispose(),this._boxMesh.geometry.dispose()}static lodToRoughness(n,t){return t>0?1-Math.sqrt(1-n/t):0}_setSize(n){this._cubeSize=Math.max(Da,jo(n))}_fromTexture(n,t){n.mapping===Kn||n.mapping===Un?this._setSize(n.image.length===0?Da:n.image[0].width||n.image[0].image.width):this._setSize(n.image.width/4);const i=t||this._allocateTarget();return this._textureToCubemap(n),this._applyPMREM(i),i}_allocateTarget(){const n=this._cubeSize,t=ya(n,!1,!1),i=Math.log2(n)-Tf;for(let a=0;a<=i;a++)t.texture.mipmaps.push({width:n>>a,height:n>>a});return t.texture.name="PMREM",t.texture.isPMREMTexture=!0,t}_getSourceTarget(n=!1){const t=this._cubeSize,i=this._sourceTarget;return(i===null||i.width!==t||n&&i.depthBuffer===!1)&&(i!==null&&i.dispose(),this._sourceTarget=ya(t,!0,n)),this._sourceTarget}_compileMaterial(n){this._boxMesh.material=n,this._renderer.compile(this._boxMesh,this._cubeCamera.children[0])}_renderCube(n,t,i){const a=this._boxMesh,r=this._cubeCamera;a.material=i,r.renderTarget=n,r.activeMipmapLevel=t;const o=n.width>>t;n.viewport.set(0,0,o,o),r.update(this._renderer,a),n.viewport.set(0,0,n.width,n.height)}_textureToCubemap(n){let t;n.mapping===Kn||n.mapping===Un?(this._cubemapMaterial===null&&(this._cubemapMaterial=Ia()),t=this._cubemapMaterial,t.uniforms.flipEnvMap.value=n.isRenderTargetTexture===!1?-1:1):(this._equirectMaterial===null&&(this._equirectMaterial=Ua()),t=this._equirectMaterial),t.uniforms.envMap.value=n,this._renderCube(this._getSourceTarget(),0,t)}_applyPMREM(n){this._ggxMaterial===null&&(this._ggxMaterial=Pf(),this._integrationMaterial=Cf());const t=this._cubeSize,i=n.texture.mipmaps.length-1,a=this._ggxMaterial.uniforms;a.envMap.value=this._sourceTarget.texture;const r=this._integrationMaterial.uniforms;r.envMap.value=this._sourceTarget.texture,r.sourceLod.value=Math.log2(t/Dr);for(let o=0;o<=i;o++){const s=Zn.lodToRoughness(o,i);if(o>i-Af)r.roughness.value=s,this._renderCube(n,o,this._integrationMaterial);else{const p=s>0?Math.log2(t)+.5*Math.log2(6/(Lr*Math.pow(s,4)))+.5:0;a.roughness.value=s,a.lodBias.value=p,this._renderCube(n,o,this._ggxMaterial)}}}_blur(n,t){this._blurMaterial===null&&(this._blurMaterial=Lf());const i=this._blurMaterial,a=i.uniforms,r=this._sourceTarget;a.sigma.value=Math.min(t,Math.PI)/Math.SQRT2,a.envMap.value=r.texture,this._renderCube(n,0,i),a.envMap.value=n.texture,this._renderCube(r,0,i)}}function ya(e,n,t){return new bi(e,{minFilter:an,generateMipmaps:n,type:Yt,colorSpace:xr,depthBuffer:t})}function In(e,n,t){return new gn({name:e,uniforms:n,vertexShader:Ne.cube_vert,fragmentShader:t,side:Dt,blending:pn,depthTest:!1,depthWrite:!1})}function Pf(){return In("PMREMGGXConvolution",{envMap:{value:null},roughness:{value:0},lodBias:{value:0}},`

		#define GGX_SAMPLES ${Lr}u

		varying vec3 vWorldDirection;

		uniform samplerCube envMap;
		uniform float roughness;
		uniform float lodBias;

		#include <common>

		// Van der Corput radical inverse
		float radicalInverse_VdC( uint bits ) {

			bits = ( bits << 16u ) | ( bits >> 16u );
			bits = ( ( bits & 0x55555555u ) << 1u ) | ( ( bits & 0xAAAAAAAAu ) >> 1u );
			bits = ( ( bits & 0x33333333u ) << 2u ) | ( ( bits & 0xCCCCCCCCu ) >> 2u );
			bits = ( ( bits & 0x0F0F0F0Fu ) << 4u ) | ( ( bits & 0xF0F0F0F0u ) >> 4u );
			bits = ( ( bits & 0x00FF00FFu ) << 8u ) | ( ( bits & 0xFF00FF00u ) >> 8u );
			return float( bits ) * 2.3283064365386963e-10; // / 0x100000000

		}

		// Hammersley sequence
		vec2 hammersley( uint i, uint N ) {

			return vec2( float( i ) / float( N ), radicalInverse_VdC( i ) );

		}

		void main() {

			vec3 N = normalize( vWorldDirection );

			// For very low roughness, just sample the environment directly
			if ( roughness < 0.001 ) {

				gl_FragColor = vec4( textureLod( envMap, N, 0.0 ).rgb, 1.0 );
				return;

			}

			float alpha = roughness * roughness;
			float alpha2 = alpha * alpha;

			// Tangent space basis for VNDF sampling
			vec3 up = abs( N.z ) < 0.999 ? vec3( 0.0, 0.0, 1.0 ) : vec3( 1.0, 0.0, 0.0 );
			vec3 tangent = normalize( cross( up, N ) );
			vec3 bitangent = cross( N, tangent );

			vec3 prefilteredColor = vec3( 0.0 );
			float totalWeight = 0.0;

			for ( uint i = 0u; i < GGX_SAMPLES; i ++ ) {

				vec2 Xi = hammersley( i, GGX_SAMPLES );

				// With V = N, sample the reflected direction directly.
				float invQ = 1.0 / ( 1.0 - Xi.x + alpha2 * Xi.x );
				float NdotL = ( 1.0 - Xi.x - alpha2 * Xi.x ) * invQ;

				if ( NdotL > 0.0 ) {

					float phi = 2.0 * PI * Xi.y;
					float sinTheta = 2.0 * alpha * sqrt( Xi.x * ( 1.0 - Xi.x ) ) * invQ;
					vec3 L = N * NdotL + ( tangent * cos( phi ) + bitangent * sin( phi ) ) * sinTheta;

					// Match the source mip to the sample's solid angle. The terms
					// independent of the sample are precomputed in lodBias.
					float d = alpha2 * invQ;
					float lod = max( log2( d ) + lodBias, 0.0 );

					// Weight by NdotL for the split-sum approximation
					prefilteredColor += textureLod( envMap, L, lod ).rgb * NdotL;
					totalWeight += NdotL;

				}

			}

			gl_FragColor = vec4( prefilteredColor / totalWeight, 1.0 );

		}
	`)}function Cf(){return In("PMREMGGXIntegration",{envMap:{value:null},roughness:{value:0},sourceLod:{value:0},sourceSize:{value:Dr}},`

		varying vec3 vWorldDirection;

		uniform samplerCube envMap;
		uniform float roughness;
		uniform float sourceLod;
		uniform int sourceSize;

		void main() {

			vec3 N = normalize( vWorldDirection );

			float alpha = roughness * roughness;
			float alpha2 = alpha * alpha;

			float texelSize = 2.0 / float( sourceSize );

			vec3 prefilteredColor = vec3( 0.0 );
			float totalWeight = 0.0;

			// Pair opposite texels: only the one in N's hemisphere contributes.
			for ( int face = 0; face < 3; face ++ ) {

				for ( int y = 0; y < sourceSize; y ++ ) {

					for ( int x = 0; x < sourceSize; x ++ ) {

						vec2 uv = ( vec2( x, y ) + 0.5 ) * texelSize - 1.0;
						vec3 texelDirection = face == 0 ? vec3( 1.0, uv ) : ( face == 1 ? vec3( uv.x, 1.0, uv.y ) : vec3( uv, 1.0 ) );

						float invDistance = inversesqrt( 1.0 + dot( uv, uv ) );
						float NdotL = dot( N, texelDirection );
						texelDirection *= NdotL < 0.0 ? - 1.0 : 1.0;
						NdotL = abs( NdotL ) * invDistance;

						// With V = N, NdotH squared is ( 1 + NdotL ) / 2. Common factors
						// in the GGX distribution and texel solid angle cancel when normalized.
						float d = 1.0 + alpha2 + ( alpha2 - 1.0 ) * NdotL;
						float weight = NdotL * invDistance * invDistance * invDistance / ( d * d );

						prefilteredColor += textureLod( envMap, texelDirection, sourceLod ).rgb * weight;
						totalWeight += weight;

					}

				}

			}

			gl_FragColor = vec4( prefilteredColor / totalWeight, 1.0 );

		}
	`)}function Lf(){return In("PMREMSphericalGaussianBlur",{envMap:{value:null},sigma:{value:0}},`

		#define SAMPLES ${bf}
		#define GOLDEN_ANGLE 2.39996322973

		varying vec3 vWorldDirection;

		uniform samplerCube envMap;
		uniform float sigma;

		#include <common>

		void main() {

			vec3 outputDirection = normalize( vWorldDirection );

			vec3 up = abs( outputDirection.z ) < 0.999 ? vec3( 0.0, 0.0, 1.0 ) : vec3( 1.0, 0.0, 0.0 );
			vec3 tangent = normalize( cross( up, outputDirection ) );
			vec3 bitangent = cross( outputDirection, tangent );

			// Truncate the kernel at three standard deviations or at the antipode.
			float thetaMax = min( 3.0 * sigma, PI );
			float truncation = 1.0 - exp( - 0.5 * thetaMax * thetaMax / ( sigma * sigma ) );

			vec3 accumColor = vec3( 0.0 );
			float accumWeight = 0.0;

			for ( int i = 0; i < SAMPLES; i ++ ) {

				// Stratified inverse-CDF sampling of the Gaussian, placed on a golden-angle spiral.
				float stratum = ( float( i ) + 0.5 ) / float( SAMPLES );
				float theta = sigma * sqrt( - 2.0 * log( 1.0 - stratum * truncation ) );
				float phi = float( i ) * GOLDEN_ANGLE;

				vec3 offset = cos( phi ) * tangent + sin( phi ) * bitangent;
				vec3 sampleDirection = cos( theta ) * outputDirection + sin( theta ) * offset;

				// Correct the planar sample density to solid angle.
				float weight = sin( theta ) / theta;

				accumColor += weight * textureLod( envMap, sampleDirection, 0.0 ).rgb;
				accumWeight += weight;

			}

			gl_FragColor = vec4( accumColor / accumWeight, 1.0 );

		}
	`)}function Ua(){return In("PMREMEquirectangularToCubemap",{envMap:{value:null}},`

		varying vec3 vWorldDirection;

		uniform sampler2D envMap;

		#include <common>

		void main() {

			// Average four subpixel samples to preserve small, bright features.
			vec3 direction = normalize( vWorldDirection );
			vec3 dx = dFdx( direction ) * 0.25;
			vec3 dy = dFdy( direction ) * 0.25;

			vec3 color = textureLod( envMap, equirectUv( normalize( direction - dx - dy ) ), 0.0 ).rgb;
			color += textureLod( envMap, equirectUv( normalize( direction + dx - dy ) ), 0.0 ).rgb;
			color += textureLod( envMap, equirectUv( normalize( direction - dx + dy ) ), 0.0 ).rgb;
			color += textureLod( envMap, equirectUv( normalize( direction + dx + dy ) ), 0.0 ).rgb;
			gl_FragColor = vec4( color * 0.25, 1.0 );

		}
	`)}function Ia(){return In("PMREMCubemapToCubemap",{envMap:{value:null},flipEnvMap:{value:-1}},`

		varying vec3 vWorldDirection;

		uniform samplerCube envMap;
		uniform float flipEnvMap;

		void main() {

			gl_FragColor = vec4( textureCube( envMap, vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) ).rgb, 1.0 );

		}
	`)}function Df(e){let n=new WeakMap,t=new WeakMap,i=null;function a(v,_=!1){return v==null?null:_?o(v):r(v)}function r(v){if(v&&v.isTexture){const _=v.mapping;if(_===li||_===ci)if(n.has(v)){const R=n.get(v).texture;return s(R,v.mapping)}else{const R=v.image;if(R&&R.height>0){const L=new bi(R.height);return L.fromEquirectangularTexture(e,v),n.set(v,L),v.addEventListener("dispose",d),s(L.texture,v.mapping)}else return null}}return v}function o(v){if(v&&v.isTexture&&v.isPMREMTexture!==!0){const _=v.mapping,R=_===li||_===ci,L=_===Kn||_===Un;if(R||L){let h=t.get(v);const u=h!==void 0?h.texture.pmremVersion:0;if(v.isRenderTargetTexture&&v.pmremVersion!==u)return i===null&&(i=new Zn(e)),h=R?i.fromEquirectangular(v,h):i.fromCubemap(v,h),h.texture.pmremVersion=v.pmremVersion,t.set(v,h),h.texture;if(h!==void 0)return h.texture;{const M=v.image;return R&&M&&M.height>0||L&&M&&p(M)?(i===null&&(i=new Zn(e)),h=R?i.fromEquirectangular(v):i.fromCubemap(v),h.texture.pmremVersion=v.pmremVersion,t.set(v,h),v.addEventListener("dispose",m),h.texture):null}}}return v}function s(v,_){return _===li?v.mapping=Kn:_===ci&&(v.mapping=Un),v}function p(v){let _=0;const R=6;for(let L=0;L<R;L++)v[L]!==void 0&&_++;return _===R}function d(v){const _=v.target;_.removeEventListener("dispose",d);const R=n.get(_);R!==void 0&&(n.delete(_),R.dispose())}function m(v){const _=v.target;_.removeEventListener("dispose",m);const R=t.get(_);R!==void 0&&(t.delete(_),R.dispose())}function g(){n=new WeakMap,t=new WeakMap,i!==null&&(i.dispose(),i=null)}return{get:a,dispose:g}}function yf(e){const n={};function t(i){if(n[i]!==void 0)return n[i];const a=e.getExtension(i);return n[i]=a,a}return{has:function(i){return t(i)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(i){const a=t(i);return a===null&&Co("WebGLRenderer: "+i+" extension not supported."),a}}}function Uf(e,n,t,i){const a={},r=new WeakMap,o=new FinalizationRegistry(R=>delete a[R]);function s(R){p(R.target)}function p(R){R.index!==null&&n.remove(R.index);for(const h in R.attributes)n.remove(R.attributes[h]);R.removeEventListener("dispose",s),delete a[R.id],o.unregister(R);const L=r.get(R);L&&(n.remove(L),r.delete(R)),i.releaseStatesOfGeometry(R),R.isInstancedBufferGeometry===!0&&delete R._maxInstanceCount,t.memory.geometries--}function d(R,L){return a[L.id]!==void 0||(L.addEventListener("dispose",s),a[L.id]=new WeakRef(L),o.register(L,L.id,L),t.memory.geometries++),L}function m(R){const L=R.attributes;for(const h in L)n.update(L[h],e.ARRAY_BUFFER)}function g(R){const L=R.index,h=R.attributes.position;let u=0;if(h===void 0)return;const M=L!==null?L.array.length:h.array.length/3-1,b=h.count>=65535?$o:Zo,T=new b(Math.ceil(M/3)*6,1),D=T.array;if(L!==null){const c=L.array;u=L.version;for(let E=0,W=0;E<M;E+=3){const F=c[E+0],B=c[E+1],K=c[E+2];D[W++]=F,D[W++]=B,D[W++]=B,D[W++]=K,D[W++]=K,D[W++]=F}}else{u=h.version;for(let c=0,E=0;c<M;c+=3){const W=c+0,F=c+1,B=c+2;D[E++]=W,D[E++]=F,D[E++]=F,D[E++]=B,D[E++]=B,D[E++]=W}}T.version=u;const w=r.get(R);w&&n.remove(w),r.set(R,T)}function v(R){const L=r.get(R);if(L){const h=R.index;h!==null&&L.version<h.version&&g(R)}else g(R);return r.get(R)}function _(){for(const R in a){const L=a[R].deref();L!==void 0&&p(L)}}return{get:d,update:m,getWireframeAttribute:v,dispose:_}}function If(e,n,t){let i;function a(g){i=g}let r,o;function s(g){r=g.type,o=g.bytesPerElement}function p(g,v){e.drawElements(i,v,r,g*o),t.update(v,i,1)}function d(g,v,_){_!==0&&(e.drawElementsInstanced(i,v,r,g*o,_),t.update(v,i,_))}function m(g,v,_){if(_===0)return;n.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,v,0,r,g,0,_);let L=0;for(let h=0;h<_;h++)L+=v[h];t.update(L,i,1)}this.setMode=a,this.setIndex=s,this.render=p,this.renderInstances=d,this.renderMultiDraw=m}function Nf(e){const n={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function i(r,o,s){switch(t.calls++,o){case e.TRIANGLES:t.triangles+=s*(r/3);break;case e.LINES:t.lines+=s*(r/2);break;case e.LINE_STRIP:t.lines+=s*(r-1);break;case e.LINE_LOOP:t.lines+=s*r;break;case e.POINTS:t.points+=s*r;break;default:tt("WebGLInfo: Unknown draw mode:",o);break}}function a(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:n,render:t,programs:null,autoReset:!0,reset:a,update:i}}function Of(e,n,t){const i=new WeakMap,a=new Lt;function r(o,s,p){const d=o.morphTargetInfluences,m=s.morphAttributes.position||s.morphAttributes.normal||s.morphAttributes.color,g=m!==void 0?m.length:0;let v=i.get(s);if(v===void 0||v.count!==g){let W=function(){c.dispose(),i.delete(s),s.removeEventListener("dispose",W)};v!==void 0&&v.texture.dispose();const _=s.morphAttributes.position!==void 0,R=s.morphAttributes.normal!==void 0,L=s.morphAttributes.color!==void 0,h=s.morphAttributes.position||[],u=s.morphAttributes.normal||[],M=s.morphAttributes.color||[];let b=0;_===!0&&(b=1),R===!0&&(b=2),L===!0&&(b=3);let T=s.attributes.position.count*b,D=1;T>n.maxTextureSize&&(D=Math.ceil(T/n.maxTextureSize),T=n.maxTextureSize);const w=new Float32Array(T*D*4*g),c=new pr(w,T,D,g);c.type=Qt,c.needsUpdate=!0;const E=b*4;for(let F=0;F<g;F++){const B=h[F],K=u[F],$=M[F],C=T*D*4*F;for(let Q=0;Q<B.count;Q++){const y=Q*E;_===!0&&(a.fromBufferAttribute(B,Q),w[C+y+0]=a.x,w[C+y+1]=a.y,w[C+y+2]=a.z,w[C+y+3]=0),R===!0&&(a.fromBufferAttribute(K,Q),w[C+y+4]=a.x,w[C+y+5]=a.y,w[C+y+6]=a.z,w[C+y+7]=0),L===!0&&(a.fromBufferAttribute($,Q),w[C+y+8]=a.x,w[C+y+9]=a.y,w[C+y+10]=a.z,w[C+y+11]=$.itemSize===4?a.w:1)}}v={count:g,texture:c,size:new xt(T,D)},i.set(s,v),s.addEventListener("dispose",W)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)p.getUniforms().setValue(e,"morphTexture",o.morphTexture,t);else{let _=0;for(let L=0;L<d.length;L++)_+=d[L];const R=s.morphTargetsRelative?1:1-_;p.getUniforms().setValue(e,"morphTargetBaseInfluence",R),p.getUniforms().setValue(e,"morphTargetInfluences",d)}p.getUniforms().setValue(e,"morphTargetsTexture",v.texture,t),p.getUniforms().setValue(e,"morphTargetsTextureSize",v.size)}return{update:r}}function Ff(e,n,t,i,a){let r=new WeakMap;function o(d){const m=a.render.frame,g=d.geometry,v=n.get(d,g);if(r.get(v)!==m&&(n.update(v),r.set(v,m)),d.isInstancedMesh&&(d.hasEventListener("dispose",p)===!1&&d.addEventListener("dispose",p),r.get(d)!==m&&(t.update(d.instanceMatrix,e.ARRAY_BUFFER),d.instanceColor!==null&&t.update(d.instanceColor,e.ARRAY_BUFFER),r.set(d,m))),d.isSkinnedMesh){const _=d.skeleton;r.get(_)!==m&&(_.update(),r.set(_,m))}return v}function s(){r=new WeakMap}function p(d){const m=d.target;m.removeEventListener("dispose",p),i.releaseStatesOfObject(m),t.remove(m.instanceMatrix),m.instanceColor!==null&&t.remove(m.instanceColor)}return{update:o,dispose:s}}const Bf={[Mr]:"LINEAR_TONE_MAPPING",[Er]:"REINHARD_TONE_MAPPING",[Sr]:"CINEON_TONE_MAPPING",[Ti]:"ACES_FILMIC_TONE_MAPPING",[vr]:"AGX_TONE_MAPPING",[_r]:"NEUTRAL_TONE_MAPPING",[gr]:"CUSTOM_TONE_MAPPING"};function Gf(e,n,t,i,a,r){const o=new zt(n,t,{type:e,depthBuffer:a,stencilBuffer:r,samples:i?4:0,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,resolveDepthBuffer:!1,resolveStencilBuffer:!1});let s=null,p=null,d=null;const m=new xi;m.setAttribute("position",new pi([-1,3,0,-1,-1,0,3,-1,0],3)),m.setAttribute("uv",new pi([0,2,0,0,2,0],2));const g=new bo({uniforms:{tDiffuse:{value:null}},vertexShader:`
			precision highp float;

			uniform mat4 modelViewMatrix;
			uniform mat4 projectionMatrix;

			attribute vec3 position;
			attribute vec2 uv;

			varying vec2 vUv;

			void main() {
				vUv = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			}`,fragmentShader:`
			precision highp float;

			uniform sampler2D tDiffuse;

			varying vec2 vUv;

			#include <tonemapping_pars_fragment>
			#include <colorspace_pars_fragment>

			void main() {
				gl_FragColor = texture2D( tDiffuse, vUv );

				#ifdef LINEAR_TONE_MAPPING
					gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );
				#elif defined( REINHARD_TONE_MAPPING )
					gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );
				#elif defined( CINEON_TONE_MAPPING )
					gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );
				#elif defined( ACES_FILMIC_TONE_MAPPING )
					gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );
				#elif defined( AGX_TONE_MAPPING )
					gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );
				#elif defined( NEUTRAL_TONE_MAPPING )
					gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );
				#elif defined( CUSTOM_TONE_MAPPING )
					gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );
				#endif

				#ifdef SRGB_TRANSFER
					gl_FragColor = sRGBTransferOETF( gl_FragColor );
				#endif
			}`,depthTest:!1,depthWrite:!1}),v=new ye(m,g),_=new ar(-1,1,1,-1,0,1);let R=null,L=null,h=!1,u,M=null,b=[],T=!1;this.setSize=function(D,w){o.setSize(D,w),s!==null&&s.setSize(D,w),p!==null&&p.setSize(D,w);for(let c=0;c<b.length;c++){const E=b[c];E.setSize&&E.setSize(D,w)}},this.setEffects=function(D){b=D,T=b.length>0&&b[0].isRenderPass===!0;const w=o.width,c=o.height;b.length>0&&s===null&&(s=new zt(w,c,{type:Yt,depthBuffer:!1,stencilBuffer:!1}),p=new zt(w,c,{type:Yt,depthBuffer:!1,stencilBuffer:!1}));const E=a===!0&&b.some(W=>W.needsDepthTexture===!0);E!==(o.depthTexture!==null)&&(E===!0&&d===null&&(d=new Dn(w,c),r===!0&&(d.format=on,d.type=vn)),o.dispose(),o.depthTexture=E?d:null,o.resolveDepthBuffer=E,o.storeMultisampledDepthBuffer=E);for(let W=0;W<b.length;W++){const F=b[W];F.setSize&&F.setSize(w,c),E&&F.needsDepthTexture===!0&&F.setDepthTexture&&F.setDepthTexture(d)}},this.begin=function(D,w){if(h||D.toneMapping===Kt&&b.length===0)return!1;if(M=w,w!==null){const c=w.width,E=w.height;(o.width!==c||o.height!==E)&&this.setSize(c,E)}return T===!1&&D.setRenderTarget(o),u=D.toneMapping,D.toneMapping=Kt,!0},this.hasRenderPass=function(){return T},this.end=function(D,w){D.toneMapping=u,h=!0;let c=o,E=s;for(let W=0;W<b.length;W++){const F=b[W];F.enabled!==!1&&(F.render(D,E,c,w),F.needsSwap!==!1&&(c=E,E=E===s?p:s))}if(R!==D.outputColorSpace||L!==D.toneMapping){R=D.outputColorSpace,L=D.toneMapping,g.defines={},rt.getTransfer(R)===Ze&&(g.defines.SRGB_TRANSFER="");const W=Bf[L];W&&(g.defines[W]=""),g.needsUpdate=!0}g.uniforms.tDiffuse.value=c.texture,D.setRenderTarget(M),D.render(v,_),M=null,h=!1},this.isCompositing=function(){return h},this.dispose=function(){o.dispose(),s!==null&&s.dispose(),p!==null&&p.dispose(),m.dispose(),g.dispose()}}const yr=new Tr,Ur=new Dn(1,1),Ir=new ir(1),Nr=new pr,Or=new is,Fr=new dr,Na=[],Oa=[],Fa=new Float32Array(16),Ba=new Float32Array(9),Ga=new Float32Array(4);function Sn(e,n,t){const i=e[0];if(i<=0||i>0)return e;const a=n*t;let r=Na[a];if(r===void 0&&(r=new Float32Array(a),Na[a]=r),n!==0){i.toArray(r,0);for(let o=1,s=0;o!==n;++o)s+=t,e[o].toArray(r,s)}return r}function ft(e,n){if(e.length!==n.length)return!1;for(let t=0,i=e.length;t<i;t++)if(e[t]!==n[t])return!1;return!0}function dt(e,n){for(let t=0,i=n.length;t<i;t++)e[t]=n[t]}function Qn(e,n){let t=Oa[n];t===void 0&&(t=new Int32Array(n),Oa[n]=t);for(let i=0;i!==n;++i)t[i]=e.allocateTextureUnit();return t}function Hf(e,n){const t=this.cache;t[0]!==n&&(e.uniform1f(this.addr,n),t[0]=n)}function Vf(e,n){const t=this.cache;if(n.x!==void 0)(t[0]!==n.x||t[1]!==n.y)&&(e.uniform2f(this.addr,n.x,n.y),t[0]=n.x,t[1]=n.y);else{if(ft(t,n))return;e.uniform2fv(this.addr,n),dt(t,n)}}function kf(e,n){const t=this.cache;if(n.x!==void 0)(t[0]!==n.x||t[1]!==n.y||t[2]!==n.z)&&(e.uniform3f(this.addr,n.x,n.y,n.z),t[0]=n.x,t[1]=n.y,t[2]=n.z);else if(n.r!==void 0)(t[0]!==n.r||t[1]!==n.g||t[2]!==n.b)&&(e.uniform3f(this.addr,n.r,n.g,n.b),t[0]=n.r,t[1]=n.g,t[2]=n.b);else{if(ft(t,n))return;e.uniform3fv(this.addr,n),dt(t,n)}}function zf(e,n){const t=this.cache;if(n.x!==void 0)(t[0]!==n.x||t[1]!==n.y||t[2]!==n.z||t[3]!==n.w)&&(e.uniform4f(this.addr,n.x,n.y,n.z,n.w),t[0]=n.x,t[1]=n.y,t[2]=n.z,t[3]=n.w);else{if(ft(t,n))return;e.uniform4fv(this.addr,n),dt(t,n)}}function Wf(e,n){const t=this.cache,i=n.elements;if(i===void 0){if(ft(t,n))return;e.uniformMatrix2fv(this.addr,!1,n),dt(t,n)}else{if(ft(t,i))return;Ga.set(i),e.uniformMatrix2fv(this.addr,!1,Ga),dt(t,i)}}function Xf(e,n){const t=this.cache,i=n.elements;if(i===void 0){if(ft(t,n))return;e.uniformMatrix3fv(this.addr,!1,n),dt(t,n)}else{if(ft(t,i))return;Ba.set(i),e.uniformMatrix3fv(this.addr,!1,Ba),dt(t,i)}}function qf(e,n){const t=this.cache,i=n.elements;if(i===void 0){if(ft(t,n))return;e.uniformMatrix4fv(this.addr,!1,n),dt(t,n)}else{if(ft(t,i))return;Fa.set(i),e.uniformMatrix4fv(this.addr,!1,Fa),dt(t,i)}}function Kf(e,n){const t=this.cache;t[0]!==n&&(e.uniform1i(this.addr,n),t[0]=n)}function Yf(e,n){const t=this.cache;if(n.x!==void 0)(t[0]!==n.x||t[1]!==n.y)&&(e.uniform2i(this.addr,n.x,n.y),t[0]=n.x,t[1]=n.y);else{if(ft(t,n))return;e.uniform2iv(this.addr,n),dt(t,n)}}function $f(e,n){const t=this.cache;if(n.x!==void 0)(t[0]!==n.x||t[1]!==n.y||t[2]!==n.z)&&(e.uniform3i(this.addr,n.x,n.y,n.z),t[0]=n.x,t[1]=n.y,t[2]=n.z);else{if(ft(t,n))return;e.uniform3iv(this.addr,n),dt(t,n)}}function Zf(e,n){const t=this.cache;if(n.x!==void 0)(t[0]!==n.x||t[1]!==n.y||t[2]!==n.z||t[3]!==n.w)&&(e.uniform4i(this.addr,n.x,n.y,n.z,n.w),t[0]=n.x,t[1]=n.y,t[2]=n.z,t[3]=n.w);else{if(ft(t,n))return;e.uniform4iv(this.addr,n),dt(t,n)}}function Qf(e,n){const t=this.cache;t[0]!==n&&(e.uniform1ui(this.addr,n),t[0]=n)}function jf(e,n){const t=this.cache;if(n.x!==void 0)(t[0]!==n.x||t[1]!==n.y)&&(e.uniform2ui(this.addr,n.x,n.y),t[0]=n.x,t[1]=n.y);else{if(ft(t,n))return;e.uniform2uiv(this.addr,n),dt(t,n)}}function Jf(e,n){const t=this.cache;if(n.x!==void 0)(t[0]!==n.x||t[1]!==n.y||t[2]!==n.z)&&(e.uniform3ui(this.addr,n.x,n.y,n.z),t[0]=n.x,t[1]=n.y,t[2]=n.z);else{if(ft(t,n))return;e.uniform3uiv(this.addr,n),dt(t,n)}}function ed(e,n){const t=this.cache;if(n.x!==void 0)(t[0]!==n.x||t[1]!==n.y||t[2]!==n.z||t[3]!==n.w)&&(e.uniform4ui(this.addr,n.x,n.y,n.z,n.w),t[0]=n.x,t[1]=n.y,t[2]=n.z,t[3]=n.w);else{if(ft(t,n))return;e.uniform4uiv(this.addr,n),dt(t,n)}}function jn(e){return e.version===0&&(e.compareFunction=nr,e.needsUpdate=!0),e}function td(e,n,t){const i=this.cache,a=t.allocateTextureUnit();i[0]!==a&&(e.uniform1i(this.addr,a),i[0]=a);let r;this.type===e.SAMPLER_2D_SHADOW?r=jn(Ur):r=yr,t.setTexture2D(n||r,a)}function nd(e,n,t){const i=this.cache,a=t.allocateTextureUnit();i[0]!==a&&(e.uniform1i(this.addr,a),i[0]=a),t.setTexture3D(n||Or,a)}function id(e,n,t){const i=this.cache,a=t.allocateTextureUnit();i[0]!==a&&(e.uniform1i(this.addr,a),i[0]=a);let r;this.type===e.SAMPLER_CUBE_SHADOW?r=jn(Ir):r=Fr,t.setTextureCube(n||r,a)}function ad(e,n,t){const i=this.cache,a=t.allocateTextureUnit();i[0]!==a&&(e.uniform1i(this.addr,a),i[0]=a),t.setTexture2DArray(n||Nr,a)}function rd(e){switch(e){case 5126:return Hf;case 35664:return Vf;case 35665:return kf;case 35666:return zf;case 35674:return Wf;case 35675:return Xf;case 35676:return qf;case 5124:case 35670:return Kf;case 35667:case 35671:return Yf;case 35668:case 35672:return $f;case 35669:case 35673:return Zf;case 5125:return Qf;case 36294:return jf;case 36295:return Jf;case 36296:return ed;case 35678:case 36198:case 36298:case 36306:case 35682:return td;case 35679:case 36299:case 36307:return nd;case 35680:case 36300:case 36308:case 36293:return id;case 36289:case 36303:case 36311:case 36292:return ad}}function od(e,n){e.uniform1fv(this.addr,n)}function sd(e,n){const t=Sn(n,this.size,2);e.uniform2fv(this.addr,t)}function ld(e,n){const t=Sn(n,this.size,3);e.uniform3fv(this.addr,t)}function cd(e,n){const t=Sn(n,this.size,4);e.uniform4fv(this.addr,t)}function fd(e,n){const t=Sn(n,this.size,4);e.uniformMatrix2fv(this.addr,!1,t)}function dd(e,n){const t=Sn(n,this.size,9);e.uniformMatrix3fv(this.addr,!1,t)}function ud(e,n){const t=Sn(n,this.size,16);e.uniformMatrix4fv(this.addr,!1,t)}function hd(e,n){e.uniform1iv(this.addr,n)}function pd(e,n){e.uniform2iv(this.addr,n)}function md(e,n){e.uniform3iv(this.addr,n)}function gd(e,n){e.uniform4iv(this.addr,n)}function _d(e,n){e.uniform1uiv(this.addr,n)}function vd(e,n){e.uniform2uiv(this.addr,n)}function Sd(e,n){e.uniform3uiv(this.addr,n)}function Ed(e,n){e.uniform4uiv(this.addr,n)}function Md(e,n,t){const i=this.cache,a=n.length,r=Qn(t,a);ft(i,r)||(e.uniform1iv(this.addr,r),dt(i,r));let o;this.type===e.SAMPLER_2D_SHADOW?o=jn(Ur):o=yr;for(let s=0;s!==a;++s)t.setTexture2D(n[s]||o,r[s])}function xd(e,n,t){const i=this.cache,a=n.length,r=Qn(t,a);ft(i,r)||(e.uniform1iv(this.addr,r),dt(i,r));for(let o=0;o!==a;++o)t.setTexture3D(n[o]||Or,r[o])}function Td(e,n,t){const i=this.cache,a=n.length,r=Qn(t,a);ft(i,r)||(e.uniform1iv(this.addr,r),dt(i,r));let o;this.type===e.SAMPLER_CUBE_SHADOW?o=jn(Ir):o=Fr;for(let s=0;s!==a;++s)t.setTextureCube(n[s]||o,r[s])}function bd(e,n,t){const i=this.cache,a=n.length,r=Qn(t,a);ft(i,r)||(e.uniform1iv(this.addr,r),dt(i,r));for(let o=0;o!==a;++o)t.setTexture2DArray(n[o]||Nr,r[o])}function Ad(e){switch(e){case 5126:return od;case 35664:return sd;case 35665:return ld;case 35666:return cd;case 35674:return fd;case 35675:return dd;case 35676:return ud;case 5124:case 35670:return hd;case 35667:case 35671:return pd;case 35668:case 35672:return md;case 35669:case 35673:return gd;case 5125:return _d;case 36294:return vd;case 36295:return Sd;case 36296:return Ed;case 35678:case 36198:case 36298:case 36306:case 35682:return Md;case 35679:case 36299:case 36307:return xd;case 35680:case 36300:case 36308:case 36293:return Td;case 36289:case 36303:case 36311:case 36292:return bd}}class Rd{constructor(n,t,i){this.id=n,this.addr=i,this.cache=[],this.type=t.type,this.setValue=rd(t.type)}}class wd{constructor(n,t,i){this.id=n,this.addr=i,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=Ad(t.type)}}class Pd{constructor(n){this.id=n,this.seq=[],this.map={}}setValue(n,t,i){const a=this.seq;for(let r=0,o=a.length;r!==o;++r){const s=a[r];s.setValue(n,t[s.id],i)}}}const di=/(\w+)(\])?(\[|\.)?/g;function Ha(e,n){e.seq.push(n),e.map[n.id]=n}function Cd(e,n,t){const i=e.name,a=i.length;for(di.lastIndex=0;;){const r=di.exec(i),o=di.lastIndex;let s=r[1];const p=r[2]==="]",d=r[3];if(p&&(s=s|0),d===void 0||d==="["&&o+2===a){Ha(t,d===void 0?new Rd(s,e,n):new wd(s,e,n));break}else{let g=t.map[s];g===void 0&&(g=new Pd(s),Ha(t,g)),t=g}}}class Wn{constructor(n,t){this.seq=[],this.map={};const i=n.getProgramParameter(t,n.ACTIVE_UNIFORMS);for(let o=0;o<i;++o){const s=n.getActiveUniform(t,o),p=n.getUniformLocation(t,s.name);Cd(s,p,this)}const a=[],r=[];for(const o of this.seq)o.type===n.SAMPLER_2D_SHADOW||o.type===n.SAMPLER_CUBE_SHADOW||o.type===n.SAMPLER_2D_ARRAY_SHADOW?a.push(o):r.push(o);a.length>0&&(this.seq=a.concat(r))}setValue(n,t,i,a){const r=this.map[t];r!==void 0&&r.setValue(n,i,a)}setOptional(n,t,i){const a=t[i];a!==void 0&&this.setValue(n,i,a)}static upload(n,t,i,a){for(let r=0,o=t.length;r!==o;++r){const s=t[r],p=i[s.id];p.needsUpdate!==!1&&s.setValue(n,p.value,a)}}static seqWithValue(n,t){const i=[];for(let a=0,r=n.length;a!==r;++a){const o=n[a];o.id in t&&i.push(o)}return i}}function Va(e,n,t){const i=e.createShader(n);return e.shaderSource(i,t),e.compileShader(i),i}const Ld=37297;let Dd=0;function yd(e,n){const t=e.split(`
`),i=[],a=Math.max(n-6,0),r=Math.min(n+6,t.length);for(let o=a;o<r;o++){const s=o+1;i.push(`${s===n?">":" "} ${s}: ${t[o]}`)}return i.join(`
`)}const ka=new Ve;function Ud(e){rt._getMatrix(ka,rt.workingColorSpace,e);const n=`mat3( ${ka.elements.map(t=>t.toFixed(4))} )`;switch(rt.getTransfer(e)){case mr:return[n,"LinearTransferOETF"];case Ze:return[n,"sRGBTransferOETF"];default:return Xe("WebGLProgram: Unsupported color space: ",e),[n,"LinearTransferOETF"]}}function za(e,n,t){const i=e.getShaderParameter(n,e.COMPILE_STATUS),r=(e.getShaderInfoLog(n)||"").trim();if(i&&r==="")return"";const o=/ERROR: 0:(\d+)/.exec(r);if(o){const s=parseInt(o[1]);return t.toUpperCase()+`

`+r+`

`+yd(e.getShaderSource(n),s)}else return r}function Id(e,n){const t=Ud(n);return[`vec4 ${e}( vec4 value ) {`,`	return ${t[1]}( vec4( ${t[0]} * value.rgb, value.a ) );`,"}"].join(`
`)}const Nd={[Mr]:"Linear",[Er]:"Reinhard",[Sr]:"Cineon",[Ti]:"ACESFilmic",[vr]:"AgX",[_r]:"Neutral",[gr]:"Custom"};function Od(e,n){const t=Nd[n];return t===void 0?(Xe("WebGLProgram: Unsupported toneMapping:",n),"vec3 "+e+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+e+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}const Hn=new ie;function Fd(){rt.getLuminanceCoefficients(Hn);const e=Hn.x.toFixed(4),n=Hn.y.toFixed(4),t=Hn.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${e}, ${n}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function Bd(e){return[e.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",e.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(wn).join(`
`)}function Gd(e){const n=[];for(const t in e){const i=e[t];i!==!1&&n.push("#define "+t+" "+i)}return n.join(`
`)}function Hd(e,n){const t={},i=e.getProgramParameter(n,e.ACTIVE_ATTRIBUTES);for(let a=0;a<i;a++){const r=e.getActiveAttrib(n,a),o=r.name;let s=1;r.type===e.FLOAT_MAT2&&(s=2),r.type===e.FLOAT_MAT3&&(s=3),r.type===e.FLOAT_MAT4&&(s=4),t[o]={type:r.type,location:e.getAttribLocation(n,o),locationSize:s}}return t}function wn(e){return e!==""}function Wa(e,n){const t=n.numSpotLightShadows+n.numSpotLightMaps-n.numSpotLightShadowsWithMaps;return e.replace(/NUM_SUN_LIGHTS/g,n.numSunLights).replace(/NUM_DIR_LIGHTS/g,n.numDirLights).replace(/NUM_SPOT_LIGHTS/g,n.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,n.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,n.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,n.numPointLights).replace(/NUM_HEMI_LIGHTS/g,n.numHemiLights).replace(/NUM_SUN_LIGHT_SHADOWS/g,n.numSunLightShadows).replace(/NUM_DIR_LIGHT_SHADOWS/g,n.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,n.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,n.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,n.numPointLightShadows).replace(/NUM_LIGHT_PROBE_GRIDS/g,n.numLightProbeGrids)}function Xa(e,n){return e.replace(/NUM_CLIPPING_PLANES/g,n.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,n.numClippingPlanes-n.numClipIntersection)}const Vd=/^[ \t]*#include +<([\w\d./]+)>/gm;function Ei(e){return e.replace(Vd,kd)}function kd(e,n){const t=Ne[n];if(t===void 0)throw new Error("THREE.WebGLProgram: Can not resolve #include <"+n+">");return Ei(t)}const zd=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function qa(e){return e.replace(zd,Wd)}function Wd(e,n,t,i){let a="";for(let r=parseInt(n);r<parseInt(t);r++)a+=i.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return a}function Ka(e){let n=`precision ${e.precision} float;
	precision ${e.precision} int;
	precision ${e.precision} sampler2D;
	precision ${e.precision} samplerCube;
	precision ${e.precision} sampler3D;
	precision ${e.precision} sampler2DArray;
	precision ${e.precision} sampler2DShadow;
	precision ${e.precision} samplerCubeShadow;
	precision ${e.precision} sampler2DArrayShadow;
	precision ${e.precision} isampler2D;
	precision ${e.precision} isampler3D;
	precision ${e.precision} isamplerCube;
	precision ${e.precision} isampler2DArray;
	precision ${e.precision} usampler2D;
	precision ${e.precision} usampler3D;
	precision ${e.precision} usamplerCube;
	precision ${e.precision} usampler2DArray;
	`;return e.precision==="highp"?n+=`
#define HIGH_PRECISION`:e.precision==="mediump"?n+=`
#define MEDIUM_PRECISION`:e.precision==="lowp"&&(n+=`
#define LOW_PRECISION`),n}const Xd={[Pn]:"SHADOWMAP_TYPE_PCF",[An]:"SHADOWMAP_TYPE_VSM"};function qd(e){return Xd[e.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}const Kd={[Un]:"ENVMAP_MODE_REFRACTION"};function Yd(e){return e.envMap===!1?"ENVMAP_MODE_REFLECTION":Kd[e.envMapMode]||"ENVMAP_MODE_REFLECTION"}const $d={[ns]:"ENVMAP_BLENDING_MULTIPLY",[ts]:"ENVMAP_BLENDING_MIX",[es]:"ENVMAP_BLENDING_ADD"};function Zd(e){return e.envMap===!1?"ENVMAP_BLENDING_NONE":$d[e.combine]||"ENVMAP_BLENDING_NONE"}function Qd(e,n,t,i){const a=e.getContext(),r=t.defines;let o=t.vertexShader,s=t.fragmentShader;const p=qd(t),d=t.envMapPMREM===!0?"ENVMAP_TYPE_PMREM":"ENVMAP_TYPE_CUBE",m=Yd(t),g=Zd(t),v=Bd(t),_=Gd(r),R=a.createProgram();let L,h,u=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(L=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,_].filter(wn).join(`
`),L.length>0&&(L+=`
`),h=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,_].filter(wn).join(`
`),h.length>0&&(h+=`
`)):(L=[Ka(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,_,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+m:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.diffuseRoughnessMap?"#define USE_DIFFUSE_ROUGHNESSMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.diffuseRoughnessMapUv?"#define DIFFUSE_ROUGHNESSMAP_UV "+t.diffuseRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexNormals?"#define HAS_NORMAL":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+p:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(wn).join(`
`),h=[Ka(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,_,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+d:"",t.envMap?"#define "+m:"",t.envMap?"#define "+g:"",t.envMapPMREM?"#define ENVMAP_MAX_LOD "+t.envMapMaxLod+".0":"",t.envMapPMREM?"#define ENVMAP_SIZE "+t.envMapSize+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.packedNormalMap?"#define USE_PACKED_NORMALMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.diffuseRoughness?"#define USE_DIFFUSE_ROUGHNESS":"",t.diffuseRoughnessMap?"#define USE_DIFFUSE_ROUGHNESSMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.retroreflection?"#define USE_RETROREFLECTION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor?"#define USE_COLOR":"",t.vertexAlphas||t.batchingColor?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+p:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==Kt?"#define TONE_MAPPING":"",t.toneMapping!==Kt?Ne.tonemapping_pars_fragment:"",t.toneMapping!==Kt?Od("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",Ne.colorspace_pars_fragment,Id("linearToOutputTexel",t.outputColorSpace),Fd(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(wn).join(`
`)),o=Ei(o),o=Wa(o,t),o=Xa(o,t),s=Ei(s),s=Wa(s,t),s=Xa(s,t),o=qa(o),s=qa(s),t.isRawShaderMaterial!==!0&&(u=`#version 300 es
`,L=[v,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+L,h=["#define varying in",t.glslVersion===xa?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===xa?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+h);const M=u+L+o,b=u+h+s,T=Va(a,a.VERTEX_SHADER,M),D=Va(a,a.FRAGMENT_SHADER,b);a.attachShader(R,T),a.attachShader(R,D),t.index0AttributeName!==void 0?a.bindAttribLocation(R,0,t.index0AttributeName):t.hasPositionAttribute===!0&&a.bindAttribLocation(R,0,"position"),a.linkProgram(R);function w(F){if(e.debug.checkShaderErrors){const B=a.getProgramInfoLog(R)||"",K=a.getShaderInfoLog(T)||"",$=a.getShaderInfoLog(D)||"",C=B.trim(),Q=K.trim(),y=$.trim();let N=!0,ae=!0;if(a.getProgramParameter(R,a.LINK_STATUS)===!1)if(N=!1,typeof e.debug.onShaderError=="function")e.debug.onShaderError(a,R,T,D);else{const Y=za(a,T,"vertex"),ee=za(a,D,"fragment");tt("WebGLProgram: Shader Error "+a.getError()+" - VALIDATE_STATUS "+a.getProgramParameter(R,a.VALIDATE_STATUS)+`

Material Name: `+F.name+`
Material Type: `+F.type+`

Program Info Log: `+C+`
`+Y+`
`+ee)}else C!==""?Xe("WebGLProgram: Program Info Log:",C):(Q===""||y==="")&&(ae=!1);ae&&(F.diagnostics={runnable:N,programLog:C,vertexShader:{log:Q,prefix:L},fragmentShader:{log:y,prefix:h}})}a.deleteShader(T),a.deleteShader(D),c=new Wn(a,R),E=Hd(a,R)}let c;this.getUniforms=function(){return c===void 0&&w(this),c};let E;this.getAttributes=function(){return E===void 0&&w(this),E};let W=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return W===!1&&(W=a.getProgramParameter(R,Ld)),W},this.destroy=function(){i.releaseStatesOfProgram(this),a.deleteProgram(R),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=Dd++,this.cacheKey=n,this.usedTimes=1,this.program=R,this.vertexShader=T,this.fragmentShader=D,this}let jd=0;class Jd{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(n,t,i){const a=this._getShaderCacheForMaterial(n);return a.has(t)===!1&&(a.add(t),t.usedTimes++),a.has(i)===!1&&(a.add(i),i.usedTimes++),this}remove(n){const t=this.materialCache.get(n);for(const i of t)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(n),this}getVertexShaderStage(n){return this._getShaderStage(n.vertexShader)}getFragmentShaderStage(n){return this._getShaderStage(n.fragmentShader)}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(n){const t=this.materialCache;let i=t.get(n);return i===void 0&&(i=new Set,t.set(n,i)),i}_getShaderStage(n){const t=this.shaderCache;let i=t.get(n);return i===void 0&&(i=new eu(n),t.set(n,i)),i}}class eu{constructor(n){this.id=jd++,this.code=n,this.usedTimes=0}}function tu(e){return e===_n||e===_i||e===vi}function nu(e,n,t,i,a,r){const o=new Qo,s=new Jd,p=new Set,d=[],m=new Map,g=i.logarithmicDepthBuffer,v={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function _(c){return p.add(c),c===0?"uv":`uv${c}`}function R(c,E,W,F,B,K){const $=F.fog,C=B.geometry,Q=c.isMeshStandardMaterial||c.isMeshLambertMaterial||c.isMeshPhongMaterial?F.environment:null,y=c.isMeshStandardMaterial||c.isMeshLambertMaterial&&!c.envMap||c.isMeshPhongMaterial&&!c.envMap,N=n.get(c.envMap||Q,y),ae=v[c.type];let Y=i.precision;c.precision!==null&&(Y=i.getMaxPrecision(c.precision),Y!==c.precision&&Xe("WebGLProgram.getParameters:",c.precision,"not supported, using",Y,"instead."));const ee=C.morphAttributes.position||C.morphAttributes.normal||C.morphAttributes.color,re=ee!==void 0?ee.length:0;let we=0;C.morphAttributes.position!==void 0&&(we=1),C.morphAttributes.normal!==void 0&&(we=2),C.morphAttributes.color!==void 0&&(we=3);let Fe,X,_e,xe;if(ae){const pe=Vt[ae];Fe=pe.vertexShader,X=pe.fragmentShader}else{Fe=c.vertexShader,X=c.fragmentShader;const pe=s.getVertexShaderStage(c),We=s.getFragmentShaderStage(c);s.update(c,pe,We),_e=pe.id,xe=We.id}const Pe=e.getRenderTarget(),ve=e.state.buffers.depth.getReversed(),Oe=B.isInstancedMesh===!0,At=B.isBatchedMesh===!0,Ce=!!c.map,Qe=!!c.matcap,Ke=!!N,Be=Ke&&N.isPMREMTexture===!0,gt=!!c.aoMap,lt=!!c.lightMap,Rt=!!c.bumpMap&&c.wireframe===!1,nt=!!c.normalMap,Gt=!!c.displacementMap,ut=!!c.emissiveMap,yt=!!c.metalnessMap,Ut=!!c.roughnessMap,It=c.anisotropy>0,P=c.clearcoat>0,Nt=c.diffuseRoughness>0,je=c.dispersion>0,Je=c.retroreflectivity>0,he=c.iridescence>0,ct=c.sheen>0,Re=c.transmission>0,Le=It&&!!c.anisotropyMap,S=P&&!!c.clearcoatMap,l=P&&!!c.clearcoatNormalMap,I=P&&!!c.clearcoatRoughnessMap,j=Nt&&!!c.diffuseRoughnessMap,q=he&&!!c.iridescenceMap,oe=he&&!!c.iridescenceThicknessMap,de=ct&&!!c.sheenColorMap,V=ct&&!!c.sheenRoughnessMap,k=!!c.specularMap,le=!!c.specularColorMap,x=!!c.specularIntensityMap,z=Re&&!!c.transmissionMap,H=Re&&!!c.thicknessMap,ce=!!c.gradientMap,ne=!!c.alphaMap,se=c.alphaTest>0,be=!!c.alphaHash,Ie=!!c.extensions;let te=Kt;c.toneMapped&&(Pe===null||Pe.isXRRenderTarget===!0)&&(te=e.toneMapping);const Ae=Be?N.isCompressedCubeTexture?N.image[0].mipmaps:N.mipmaps:null,Ue={shaderID:ae,shaderType:c.type,shaderName:c.name,vertexShader:Fe,fragmentShader:X,defines:c.defines,customVertexShaderID:_e,customFragmentShaderID:xe,isRawShaderMaterial:c.isRawShaderMaterial===!0,glslVersion:c.glslVersion,precision:Y,batching:At,batchingColor:At&&B._colorsTexture!==null,instancing:Oe,instancingColor:Oe&&B.instanceColor!==null,instancingMorph:Oe&&B.morphTexture!==null,outputColorSpace:Pe===null?e.outputColorSpace:Pe.isXRRenderTarget===!0?Pe.texture.colorSpace:rt.workingColorSpace,alphaToCoverage:!!c.alphaToCoverage,map:Ce,matcap:Qe,envMap:Ke,envMapMode:Ke&&N.mapping,envMapPMREM:Be,envMapMaxLod:Be?Ae.length-1:null,envMapSize:Be?Ae[0].width:null,aoMap:gt,lightMap:lt,bumpMap:Rt,normalMap:nt,displacementMap:Gt,emissiveMap:ut,normalMapObjectSpace:nt&&c.normalMapType===Vo,normalMapTangentSpace:nt&&c.normalMapType===Wi,packedNormalMap:nt&&c.normalMapType===Wi&&tu(c.normalMap.format),metalnessMap:yt,roughnessMap:Ut,anisotropy:It,anisotropyMap:Le,clearcoat:P,clearcoatMap:S,clearcoatNormalMap:l,clearcoatRoughnessMap:I,diffuseRoughness:Nt,diffuseRoughnessMap:j,dispersion:je,retroreflection:Je,iridescence:he,iridescenceMap:q,iridescenceThicknessMap:oe,sheen:ct,sheenColorMap:de,sheenRoughnessMap:V,specularMap:k,specularColorMap:le,specularIntensityMap:x,transmission:Re,transmissionMap:z,thicknessMap:H,gradientMap:ce,opaque:c.transparent===!1&&c.blending===kn&&c.alphaToCoverage===!1,alphaMap:ne,alphaTest:se,alphaHash:be,combine:c.combine,mapUv:Ce&&_(c.map.channel),aoMapUv:gt&&_(c.aoMap.channel),lightMapUv:lt&&_(c.lightMap.channel),bumpMapUv:Rt&&_(c.bumpMap.channel),normalMapUv:nt&&_(c.normalMap.channel),displacementMapUv:Gt&&_(c.displacementMap.channel),emissiveMapUv:ut&&_(c.emissiveMap.channel),metalnessMapUv:yt&&_(c.metalnessMap.channel),roughnessMapUv:Ut&&_(c.roughnessMap.channel),anisotropyMapUv:Le&&_(c.anisotropyMap.channel),clearcoatMapUv:S&&_(c.clearcoatMap.channel),clearcoatNormalMapUv:l&&_(c.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:I&&_(c.clearcoatRoughnessMap.channel),diffuseRoughnessMapUv:j&&_(c.diffuseRoughnessMap.channel),iridescenceMapUv:q&&_(c.iridescenceMap.channel),iridescenceThicknessMapUv:oe&&_(c.iridescenceThicknessMap.channel),sheenColorMapUv:de&&_(c.sheenColorMap.channel),sheenRoughnessMapUv:V&&_(c.sheenRoughnessMap.channel),specularMapUv:k&&_(c.specularMap.channel),specularColorMapUv:le&&_(c.specularColorMap.channel),specularIntensityMapUv:x&&_(c.specularIntensityMap.channel),transmissionMapUv:z&&_(c.transmissionMap.channel),thicknessMapUv:H&&_(c.thicknessMap.channel),alphaMapUv:ne&&_(c.alphaMap.channel),vertexTangents:!!C.attributes.tangent&&(nt||It),vertexNormals:!!C.attributes.normal,vertexColors:c.vertexColors,vertexAlphas:c.vertexColors===!0&&!!C.attributes.color&&C.attributes.color.itemSize===4,pointsUvs:B.isPoints===!0&&!!C.attributes.uv&&(Ce||ne),fog:!!$,useFog:c.fog===!0,fogExp2:!!$&&$.isFogExp2,flatShading:c.wireframe===!1&&(c.flatShading===!0||C.attributes.normal===void 0&&nt===!1&&(c.isMeshLambertMaterial||c.isMeshPhongMaterial||c.isMeshStandardMaterial||c.isMeshPhysicalMaterial)),sizeAttenuation:c.sizeAttenuation===!0,logarithmicDepthBuffer:g,reversedDepthBuffer:ve,skinning:B.isSkinnedMesh===!0,hasPositionAttribute:C.attributes.position!==void 0,morphTargets:C.morphAttributes.position!==void 0,morphNormals:C.morphAttributes.normal!==void 0,morphColors:C.morphAttributes.color!==void 0,morphTargetsCount:re,morphTextureStride:we,numSunLights:E.sun.length,numDirLights:E.directional.length,numPointLights:E.point.length,numSpotLights:E.spot.length,numSpotLightMaps:E.spotLightMap.length,numRectAreaLights:E.rectArea.length,numHemiLights:E.hemi.length,numSunLightShadows:E.sunShadowMap.length,numDirLightShadows:E.directionalShadowMap.length,numPointLightShadows:E.pointShadowMap.length,numSpotLightShadows:E.spotShadowMap.length,numSpotLightShadowsWithMaps:E.numSpotLightShadowsWithMaps,numLightProbes:E.numLightProbes,numLightProbeGrids:K.filter(pe=>pe.texture!==null).length,numClippingPlanes:r.numPlanes,numClipIntersection:r.numIntersection,dithering:c.dithering,shadowMapEnabled:e.shadowMap.enabled&&W.length>0,shadowMapType:e.shadowMap.type,toneMapping:te,decodeVideoTexture:Ce&&c.map.isVideoTexture===!0&&rt.getTransfer(c.map.colorSpace)===Ze,decodeVideoTextureEmissive:ut&&c.emissiveMap.isVideoTexture===!0&&rt.getTransfer(c.emissiveMap.colorSpace)===Ze,premultipliedAlpha:c.premultipliedAlpha,doubleSided:c.side===vt,flipSided:c.side===Dt,useDepthPacking:c.depthPacking>=0,depthPacking:c.depthPacking||0,index0AttributeName:c.index0AttributeName,extensionClipCullDistance:Ie&&c.extensions.clipCullDistance===!0&&t.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Ie&&c.extensions.multiDraw===!0||At)&&t.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:t.has("KHR_parallel_shader_compile"),customProgramCacheKey:c.customProgramCacheKey()};return Ue.vertexUv1s=p.has(1),Ue.vertexUv2s=p.has(2),Ue.vertexUv3s=p.has(3),p.clear(),Ue}function L(c){const E=[];if(c.shaderID?E.push(c.shaderID):(E.push(c.customVertexShaderID),E.push(c.customFragmentShaderID)),c.defines!==void 0)for(const W in c.defines)E.push(W),E.push(c.defines[W]);return c.isRawShaderMaterial===!1&&(h(E,c),u(E,c),E.push(e.outputColorSpace)),E.push(c.customProgramCacheKey),E.join()}function h(c,E){c.push(E.precision),c.push(E.outputColorSpace),c.push(E.envMapMode),c.push(E.envMapPMREM),c.push(E.envMapMaxLod),c.push(E.envMapSize),c.push(E.mapUv),c.push(E.alphaMapUv),c.push(E.lightMapUv),c.push(E.aoMapUv),c.push(E.bumpMapUv),c.push(E.normalMapUv),c.push(E.displacementMapUv),c.push(E.emissiveMapUv),c.push(E.metalnessMapUv),c.push(E.roughnessMapUv),c.push(E.anisotropyMapUv),c.push(E.clearcoatMapUv),c.push(E.clearcoatNormalMapUv),c.push(E.clearcoatRoughnessMapUv),c.push(E.diffuseRoughnessMapUv),c.push(E.iridescenceMapUv),c.push(E.iridescenceThicknessMapUv),c.push(E.sheenColorMapUv),c.push(E.sheenRoughnessMapUv),c.push(E.specularMapUv),c.push(E.specularColorMapUv),c.push(E.specularIntensityMapUv),c.push(E.transmissionMapUv),c.push(E.thicknessMapUv),c.push(E.combine),c.push(E.fogExp2),c.push(E.sizeAttenuation),c.push(E.morphTargetsCount),c.push(E.numSunLights),c.push(E.numDirLights),c.push(E.numPointLights),c.push(E.numSpotLights),c.push(E.numSpotLightMaps),c.push(E.numHemiLights),c.push(E.numRectAreaLights),c.push(E.numSunLightShadows),c.push(E.numDirLightShadows),c.push(E.numPointLightShadows),c.push(E.numSpotLightShadows),c.push(E.numSpotLightShadowsWithMaps),c.push(E.numLightProbes),c.push(E.numLightProbeGrids),c.push(E.shadowMapType),c.push(E.toneMapping),c.push(E.numClippingPlanes),c.push(E.numClipIntersection),c.push(E.depthPacking)}function u(c,E){o.disableAll(),E.instancing&&o.enable(0),E.instancingColor&&o.enable(1),E.instancingMorph&&o.enable(2),E.matcap&&o.enable(3),E.envMap&&o.enable(4),E.normalMapObjectSpace&&o.enable(5),E.normalMapTangentSpace&&o.enable(6),E.clearcoat&&o.enable(7),E.iridescence&&o.enable(8),E.alphaTest&&o.enable(9),E.vertexColors&&o.enable(10),E.vertexAlphas&&o.enable(11),E.vertexUv1s&&o.enable(12),E.vertexUv2s&&o.enable(13),E.vertexUv3s&&o.enable(14),E.vertexTangents&&o.enable(15),E.anisotropy&&o.enable(16),E.alphaHash&&o.enable(17),E.batching&&o.enable(18),E.dispersion&&o.enable(19),E.retroreflection&&o.enable(24),E.diffuseRoughness&&o.enable(25),E.batchingColor&&o.enable(20),E.gradientMap&&o.enable(21),E.packedNormalMap&&o.enable(22),E.vertexNormals&&o.enable(23),c.push(o.mask),o.disableAll(),E.fog&&o.enable(0),E.useFog&&o.enable(1),E.flatShading&&o.enable(2),E.logarithmicDepthBuffer&&o.enable(3),E.reversedDepthBuffer&&o.enable(4),E.skinning&&o.enable(5),E.morphTargets&&o.enable(6),E.morphNormals&&o.enable(7),E.morphColors&&o.enable(8),E.premultipliedAlpha&&o.enable(9),E.shadowMapEnabled&&o.enable(10),E.doubleSided&&o.enable(11),E.flipSided&&o.enable(12),E.useDepthPacking&&o.enable(13),E.dithering&&o.enable(14),E.transmission&&o.enable(15),E.sheen&&o.enable(16),E.opaque&&o.enable(17),E.pointsUvs&&o.enable(18),E.decodeVideoTexture&&o.enable(19),E.decodeVideoTextureEmissive&&o.enable(20),E.alphaToCoverage&&o.enable(21),E.numLightProbeGrids>0&&o.enable(22),E.hasPositionAttribute&&o.enable(23),c.push(o.mask)}function M(c){const E=v[c.type];let W;if(E){const F=Vt[E];W=Ho.clone(F.uniforms)}else W=c.uniforms;return W}function b(c,E){let W=m.get(E);return W!==void 0?++W.usedTimes:(W=new Qd(e,E,c,a),d.push(W),m.set(E,W)),W}function T(c){if(--c.usedTimes===0){const E=d.indexOf(c);d[E]=d[d.length-1],d.pop(),m.delete(c.cacheKey),c.destroy()}}function D(c){s.remove(c)}function w(){s.dispose()}return{getParameters:R,getProgramCacheKey:L,getUniforms:M,acquireProgram:b,releaseProgram:T,releaseShaderCache:D,programs:d,dispose:w}}function iu(){let e=new WeakMap;function n(o){return e.has(o)}function t(o){let s=e.get(o);return s===void 0&&(s={},e.set(o,s)),s}function i(o){e.delete(o)}function a(o,s,p){e.get(o)[s]=p}function r(){e=new WeakMap}return{has:n,get:t,remove:i,update:a,dispose:r}}function au(e,n){return e.groupOrder!==n.groupOrder?e.groupOrder-n.groupOrder:e.renderOrder!==n.renderOrder?e.renderOrder-n.renderOrder:e.material.id!==n.material.id?e.material.id-n.material.id:e.materialVariant!==n.materialVariant?e.materialVariant-n.materialVariant:e.z!==n.z?e.z-n.z:e.id-n.id}function Ya(e,n){return e.groupOrder!==n.groupOrder?e.groupOrder-n.groupOrder:e.renderOrder!==n.renderOrder?e.renderOrder-n.renderOrder:e.z!==n.z?n.z-e.z:e.id-n.id}function $a(){const e=[];let n=0;const t=[],i=[],a=[];function r(){n=0,t.length=0,i.length=0,a.length=0}function o(v){let _=0;return v.isInstancedMesh&&(_+=2),v.isSkinnedMesh&&(_+=1),_}function s(v,_,R,L,h,u){let M=e[n];return M===void 0?(M={id:v.id,object:v,geometry:_,material:R,materialVariant:o(v),groupOrder:L,renderOrder:v.renderOrder,z:h,group:u},e[n]=M):(M.id=v.id,M.object=v,M.geometry=_,M.material=R,M.materialVariant=o(v),M.groupOrder=L,M.renderOrder=v.renderOrder,M.z=h,M.group=u),n++,M}function p(v,_,R,L,h,u,M){M.reversedDepth===!0&&(h=-h);const b=s(v,_,R,L,h,u);R.transmission>0?i.push(b):R.transparent===!0?a.push(b):t.push(b)}function d(v,_,R,L,h,u){const M=s(v,_,R,L,h,u);R.transmission>0?i.unshift(M):R.transparent===!0?a.unshift(M):t.unshift(M)}function m(v,_){t.length>1&&t.sort(v||au),i.length>1&&i.sort(_||Ya),a.length>1&&a.sort(_||Ya)}function g(){for(let v=n,_=e.length;v<_;v++){const R=e[v];if(R.id===null)break;R.id=null,R.object=null,R.geometry=null,R.material=null,R.group=null}}return{opaque:t,transmissive:i,transparent:a,init:r,push:p,unshift:d,finish:g,sort:m}}function ru(){let e=new WeakMap;function n(i,a){const r=e.get(i);let o;return r===void 0?(o=new $a,e.set(i,[o])):a>=r.length?(o=new $a,r.push(o)):o=r[a],o}function t(){e=new WeakMap}return{get:n,dispose:t}}function ou(){const e={};return{get:function(n){if(e[n.id]!==void 0)return e[n.id];let t;switch(n.type){case"SunLight":case"DirectionalLight":t={direction:new ie,color:new qe};break;case"SpotLight":t={position:new ie,direction:new ie,color:new qe,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new ie,color:new qe,distance:0,decay:0};break;case"HemisphereLight":t={direction:new ie,skyColor:new qe,groundColor:new qe};break;case"RectAreaLight":t={color:new qe,position:new ie,halfWidth:new ie,halfHeight:new ie};break}return e[n.id]=t,t}}}function su(){const e={};return{get:function(n){if(e[n.id]!==void 0)return e[n.id];let t;switch(n.type){case"SunLight":case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new xt};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new xt};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new xt,shadowCameraNear:1,shadowCameraFar:1e3};break}return e[n.id]=t,t}}}let lu=0;function cu(e,n){return(n.castShadow?2:0)-(e.castShadow?2:0)+(n.map?1:0)-(e.map?1:0)}function fu(e){const n=new ou,t=su(),i={version:0,hash:{sunLength:-1,directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numSunShadows:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],sun:[],sunShadow:[],sunShadowMap:[],sunShadowMatrix:[],sunShadowCascade:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let d=0;d<9;d++)i.probe.push(new ie);const a=new ie,r=new mn,o=new mn;function s(d){let m=0,g=0,v=0;for(let K=0;K<9;K++)i.probe[K].set(0,0,0);let _=0,R=0,L=0,h=0,u=0,M=0,b=0,T=0,D=0,w=0,c=0,E=0,W=0,F=0;d.sort(cu);for(let K=0,$=d.length;K<$;K++){const C=d[K],Q=C.color,y=C.intensity,N=C.distance;let ae=null;if(C.shadow&&C.shadow.map&&(C.shadow.map.texture.format===_n?ae=C.shadow.map.texture:ae=C.shadow.map.depthTexture||C.shadow.map.texture),C.isAmbientLight)m+=Q.r*y,g+=Q.g*y,v+=Q.b*y;else if(C.isLightProbe){for(let Y=0;Y<9;Y++)i.probe[Y].addScaledVector(C.sh.coefficients[Y],y);F++}else if(C.isSunLight){const Y=n.get(C);if(Y.color.copy(C.color).multiplyScalar(C.intensity),C.castShadow){const ee=C.shadow,re=t.get(C);re.shadowIntensity=ee.intensity,re.shadowBias=ee.bias,re.shadowNormalBias=ee.normalBias,re.shadowRadius=ee.radius,re.shadowMapSize.copy(ee.mapSize).multiply(ee.getFrameExtents()),i.sunShadow[R]=re,i.sunShadowMap[R]=ae;const we=ee.getViewportCount();for(let Fe=0;Fe<we;Fe++)i.sunShadowMatrix[L+Fe]=ee.getMatrix(Fe),i.sunShadowCascade[L+Fe]=ee._cascadeData[Fe];L+=we,R++}i.sun[_]=Y,_++}else if(C.isDirectionalLight){const Y=n.get(C);if(Y.color.copy(C.color).multiplyScalar(C.intensity),C.castShadow){const ee=C.shadow,re=t.get(C);re.shadowIntensity=ee.intensity,re.shadowBias=ee.bias,re.shadowNormalBias=ee.normalBias,re.shadowRadius=ee.radius,re.shadowMapSize=ee.mapSize,i.directionalShadow[h]=re,i.directionalShadowMap[h]=ae,i.directionalShadowMatrix[h]=C.shadow.matrix,D++}i.directional[h]=Y,h++}else if(C.isSpotLight){const Y=n.get(C);Y.position.setFromMatrixPosition(C.matrixWorld),Y.color.copy(Q).multiplyScalar(y),Y.distance=N,Y.coneCos=Math.cos(C.angle),Y.penumbraCos=Math.cos(C.angle*(1-C.penumbra)),Y.decay=C.decay,i.spot[M]=Y;const ee=C.shadow;if(C.map&&(i.spotLightMap[E]=C.map,E++,ee.updateMatrices(C),C.castShadow&&W++),i.spotLightMatrix[M]=ee.matrix,C.castShadow){const re=t.get(C);re.shadowIntensity=ee.intensity,re.shadowBias=ee.bias,re.shadowNormalBias=ee.normalBias,re.shadowRadius=ee.radius,re.shadowMapSize=ee.mapSize,i.spotShadow[M]=re,i.spotShadowMap[M]=ae,c++}M++}else if(C.isRectAreaLight){const Y=n.get(C);Y.color.copy(Q).multiplyScalar(y),Y.halfWidth.set(C.width*.5,0,0),Y.halfHeight.set(0,C.height*.5,0),i.rectArea[b]=Y,b++}else if(C.isPointLight){const Y=n.get(C);if(Y.color.copy(C.color).multiplyScalar(C.intensity),Y.distance=C.distance,Y.decay=C.decay,C.castShadow){const ee=C.shadow,re=t.get(C);re.shadowIntensity=ee.intensity,re.shadowBias=ee.bias,re.shadowNormalBias=ee.normalBias,re.shadowRadius=ee.radius,re.shadowMapSize=ee.mapSize,re.shadowCameraNear=ee.camera.near,re.shadowCameraFar=ee.camera.far,i.pointShadow[u]=re,i.pointShadowMap[u]=ae,i.pointShadowMatrix[u]=C.shadow.matrix,w++}i.point[u]=Y,u++}else if(C.isHemisphereLight){const Y=n.get(C);Y.skyColor.copy(C.color).multiplyScalar(y),Y.groundColor.copy(C.groundColor).multiplyScalar(y),i.hemi[T]=Y,T++}}b>0&&(e.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=me.LTC_FLOAT_1,i.rectAreaLTC2=me.LTC_FLOAT_2):(i.rectAreaLTC1=me.LTC_HALF_1,i.rectAreaLTC2=me.LTC_HALF_2)),i.ambient[0]=m,i.ambient[1]=g,i.ambient[2]=v;const B=i.hash;(B.sunLength!==_||B.directionalLength!==h||B.pointLength!==u||B.spotLength!==M||B.rectAreaLength!==b||B.hemiLength!==T||B.numSunShadows!==R||B.numDirectionalShadows!==D||B.numPointShadows!==w||B.numSpotShadows!==c||B.numSpotMaps!==E||B.numLightProbes!==F)&&(i.sun.length=_,i.directional.length=h,i.spot.length=M,i.rectArea.length=b,i.point.length=u,i.hemi.length=T,i.sunShadow.length=R,i.sunShadowMap.length=R,i.sunShadowMatrix.length=L,i.sunShadowCascade.length=L,i.directionalShadow.length=D,i.directionalShadowMap.length=D,i.directionalShadowMatrix.length=D,i.pointShadow.length=w,i.pointShadowMap.length=w,i.pointShadowMatrix.length=w,i.spotShadow.length=c,i.spotShadowMap.length=c,i.spotLightMatrix.length=c+E-W,i.spotLightMap.length=E,i.numSpotLightShadowsWithMaps=W,i.numLightProbes=F,B.sunLength=_,B.directionalLength=h,B.pointLength=u,B.spotLength=M,B.rectAreaLength=b,B.hemiLength=T,B.numSunShadows=R,B.numDirectionalShadows=D,B.numPointShadows=w,B.numSpotShadows=c,B.numSpotMaps=E,B.numLightProbes=F,i.version=lu++)}function p(d,m){let g=0,v=0,_=0,R=0,L=0,h=0;const u=m.matrixWorldInverse;for(let M=0,b=d.length;M<b;M++){const T=d[M];if(T.isSunLight){const D=i.sun[g];D.direction.setFromMatrixPosition(T.matrixWorld),D.direction.transformDirection(u),g++}else if(T.isDirectionalLight){const D=i.directional[v];D.direction.setFromMatrixPosition(T.matrixWorld),a.setFromMatrixPosition(T.target.matrixWorld),D.direction.sub(a),D.direction.transformDirection(u),v++}else if(T.isSpotLight){const D=i.spot[R];D.position.setFromMatrixPosition(T.matrixWorld),D.position.applyMatrix4(u),D.direction.setFromMatrixPosition(T.matrixWorld),a.setFromMatrixPosition(T.target.matrixWorld),D.direction.sub(a),D.direction.transformDirection(u),R++}else if(T.isRectAreaLight){const D=i.rectArea[L];D.position.setFromMatrixPosition(T.matrixWorld),D.position.applyMatrix4(u),o.identity(),r.copy(T.matrixWorld),r.premultiply(u),o.extractRotation(r),D.halfWidth.set(T.width*.5,0,0),D.halfHeight.set(0,T.height*.5,0),D.halfWidth.applyMatrix4(o),D.halfHeight.applyMatrix4(o),L++}else if(T.isPointLight){const D=i.point[_];D.position.setFromMatrixPosition(T.matrixWorld),D.position.applyMatrix4(u),_++}else if(T.isHemisphereLight){const D=i.hemi[h];D.direction.setFromMatrixPosition(T.matrixWorld),D.direction.transformDirection(u),h++}}}return{setup:s,setupView:p,state:i}}function Za(e){const n=new fu(e),t=[],i=[],a=[];function r(g){m.camera=g,t.length=0,i.length=0,a.length=0}function o(g){g.isLightProbeGrid?a.push(g):t.push(g)}function s(g){i.push(g)}function p(){n.setup(t),a.sort((g,v)=>g.priority-v.priority||g.id-v.id)}function d(g){n.setupView(t,g)}const m={lightsArray:t,shadowsArray:i,lightProbeGridArray:a,camera:null,lights:n,transmissionRenderTarget:{},textureUnits:0};return{init:r,state:m,setupLights:p,setupLightsView:d,pushLight:o,pushShadow:s}}function du(e){let n=new WeakMap;function t(a,r=0){const o=n.get(a);let s;return o===void 0?(s=new Za(e),n.set(a,[s])):r>=o.length?(s=new Za(e),o.push(s)):s=o[r],s}function i(){n=new WeakMap}return{get:t,dispose:i}}const uu=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,hu=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ).rg;
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ).r;
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( max( 0.0, squared_mean - mean * mean ) );
	gl_FragColor = vec4( mean, std_dev, 0.0, 1.0 );
}`,pu=[new ie(1,0,0),new ie(-1,0,0),new ie(0,1,0),new ie(0,-1,0),new ie(0,0,1),new ie(0,0,-1)],mu=[new ie(0,-1,0),new ie(0,-1,0),new ie(0,0,1),new ie(0,0,-1),new ie(0,-1,0),new ie(0,-1,0)],Qa=new mn,xn=new ie,ui=new ie;function gu(e,n,t){let i=new ja;const a=new xt,r=new xt,o=new Lt,s=new Eo,p=new Mo,d={},m=t.maxTextureSize,g={[Ln]:Dt,[Dt]:Ln,[vt]:vt},v=new gn({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new xt},radius:{value:4}},vertexShader:uu,fragmentShader:hu}),_=v.clone();_.defines.HORIZONTAL_PASS=1;const R=new xi;R.setAttribute("position",new xo(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const L=new ye(R,v),h=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Pn;let u=this.type;this.render=function(w,c,E){if(h.enabled===!1||h.autoUpdate===!1&&h.needsUpdate===!1||w.length===0)return;this.type===To&&(Xe("WebGLShadowMap: PCFSoftShadowMap has been removed. Using PCFShadowMap instead."),this.type=Pn);const W=e.getRenderTarget(),F=e.getActiveCubeFace(),B=e.getActiveMipmapLevel(),K=e.state;K.setBlending(pn),K.buffers.depth.getReversed()===!0?K.buffers.color.setClear(0,0,0,0):K.buffers.color.setClear(1,1,1,1),K.buffers.depth.setTest(!0),K.setScissorTest(!1);const $=u!==this.type;$&&c.traverse(function(C){C.material&&(Array.isArray(C.material)?C.material.forEach(Q=>Q.needsUpdate=!0):C.material.needsUpdate=!0)});for(let C=0,Q=w.length;C<Q;C++){const y=w[C],N=y.shadow;if(N===void 0){Xe("WebGLShadowMap:",y,"has no shadow.");continue}if(N.autoUpdate===!1&&N.needsUpdate===!1)continue;a.copy(N.mapSize);const ae=N.getFrameExtents();a.multiply(ae),r.copy(N.mapSize),(a.x>m||a.y>m)&&(a.x>m&&(r.x=Math.floor(m/ae.x),a.x=r.x*ae.x,N.mapSize.x=r.x),a.y>m&&(r.y=Math.floor(m/ae.y),a.y=r.y*ae.y,N.mapSize.y=r.y));const Y=e.state.buffers.depth.getReversed();if(N.camera._reversedDepth=Y,N.map===null||$===!0){if(N.map!==null&&(N.map.depthTexture!==null&&(N.map.depthTexture.dispose(),N.map.depthTexture=null),N.map.dispose()),this.type===An){if(y.isPointLight){Xe("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}N.map=new zt(a.x,a.y,{format:_n,type:Yt,minFilter:Bt,magFilter:Bt,generateMipmaps:!1}),N.map.texture.name=y.name+".shadowMap",N.map.depthTexture=new Dn(a.x,a.y,Qt),N.map.depthTexture.name=y.name+".shadowMapDepth",N.map.depthTexture.format=yn,N.map.depthTexture.compareFunction=null,N.map.depthTexture.minFilter=rn,N.map.depthTexture.magFilter=rn}else y.isPointLight?(N.map=new bi(a.x),N.map.depthTexture=new ir(a.x,sn)):(N.map=new zt(a.x,a.y),N.map.depthTexture=new Dn(a.x,a.y,sn)),N.map.depthTexture.name=y.name+".shadowMap",N.map.depthTexture.format=yn,this.type===Pn?(N.map.depthTexture.compareFunction=Y?er:tr,N.map.depthTexture.minFilter=Bt,N.map.depthTexture.magFilter=Bt):(N.map.depthTexture.compareFunction=null,N.map.depthTexture.minFilter=rn,N.map.depthTexture.magFilter=rn);N.camera.updateProjectionMatrix()}N.map.isWebGLCubeRenderTarget!==!0&&(N.map.width!==a.x||N.map.height!==a.y)&&N.map.setSize(a.x,a.y);const ee=N.map.isWebGLCubeRenderTarget?6:N.getViewportCount();y.isPointLight!==!0&&N.updateMatrices(y,E);const re=(N.camera.layers.mask&4294967294)!==0?N.camera.layers:E.layers;for(let we=0;we<ee;we++){const Fe=N.getCamera(we);if(y.isPointLight){const X=N.camera,_e=N.matrix,xe=y.distance||X.far;xe!==X.far&&(X.far=xe,X.updateProjectionMatrix()),xn.setFromMatrixPosition(y.matrixWorld),X.position.copy(xn),ui.copy(X.position),ui.add(pu[we]),X.up.copy(mu[we]),X.lookAt(ui),X.updateMatrixWorld(),_e.makeTranslation(-xn.x,-xn.y,-xn.z),Qa.multiplyMatrices(X.projectionMatrix,X.matrixWorldInverse),N._frustum.setFromProjectionMatrix(Qa,X.coordinateSystem,X.reversedDepth)}if(N.map.isWebGLCubeRenderTarget)e.setRenderTarget(N.map,we),e.clear();else{we===0&&(e.setRenderTarget(N.map),e.clear());const X=N.getViewport(we);o.set(r.x*X.x,r.y*X.y,r.x*X.z,r.y*X.w),K.viewport(o)}i=N.getFrustum(we),T(c,E,Fe,y,re,this.type)}N.isPointLightShadow!==!0&&this.type===An&&M(N,E),N.needsUpdate=!1}u=this.type,h.needsUpdate=!1,e.setRenderTarget(W,F,B)};function M(w,c){const E=n.update(L);v.defines.VSM_SAMPLES!==w.blurSamples&&(v.defines.VSM_SAMPLES=w.blurSamples,_.defines.VSM_SAMPLES=w.blurSamples,v.needsUpdate=!0,_.needsUpdate=!0),w.mapPass===null?w.mapPass=new zt(a.x,a.y,{format:_n,type:Yt}):(w.mapPass.width!==w.map.width||w.mapPass.height!==w.map.height)&&w.mapPass.setSize(w.map.width,w.map.height),v.uniforms.shadow_pass.value=w.map.depthTexture,v.uniforms.resolution.value.set(w.map.width,w.map.height),v.uniforms.radius.value=w.radius,e.setRenderTarget(w.mapPass),e.clear(),e.renderBufferDirect(c,null,E,v,L,null),_.uniforms.shadow_pass.value=w.mapPass.texture,_.uniforms.resolution.value.set(w.map.width,w.map.height),_.uniforms.radius.value=w.radius,e.setRenderTarget(w.map),e.clear(),e.renderBufferDirect(c,null,E,_,L,null)}function b(w,c,E,W){let F=null;const B=E.isPointLight===!0?w.customDistanceMaterial:w.customDepthMaterial;if(B!==void 0)F=B;else if(F=E.isPointLight===!0?p:s,e.localClippingEnabled&&c.clipShadows===!0&&Array.isArray(c.clippingPlanes)&&c.clippingPlanes.length!==0||c.displacementMap&&c.displacementScale!==0||c.alphaMap&&c.alphaTest>0||c.map&&c.alphaTest>0||c.alphaToCoverage===!0){const K=F.uuid,$=c.uuid;let C=d[K];C===void 0&&(C={},d[K]=C);let Q=C[$];Q===void 0&&(Q=F.clone(),C[$]=Q,c.addEventListener("dispose",D)),F=Q}if(F.visible=c.visible,F.wireframe=c.wireframe,W===An?F.side=c.shadowSide!==null?c.shadowSide:c.side:F.side=c.shadowSide!==null?c.shadowSide:g[c.side],F.alphaMap=c.alphaMap,F.alphaTest=c.alphaToCoverage===!0?.5:c.alphaTest,F.map=c.map,F.clipShadows=c.clipShadows,F.clippingPlanes=c.clippingPlanes,F.clipIntersection=c.clipIntersection,F.displacementMap=c.displacementMap,F.displacementScale=c.displacementScale,F.displacementBias=c.displacementBias,F.wireframeLinewidth=c.wireframeLinewidth,F.linewidth=c.linewidth,E.isPointLight===!0&&F.isMeshDistanceMaterial===!0){const K=e.properties.get(F);K.light=E}return F}function T(w,c,E,W,F,B){if(w.visible===!1)return;if(w.layers.test(F)&&(w.isMesh||w.isLine||w.isPoints)&&(w.castShadow||w.receiveShadow&&B===An)&&(!w.frustumCulled||w.intersectsFrustum(i))){w.modelViewMatrix.multiplyMatrices(E.matrixWorldInverse,w.matrixWorld);const C=n.update(w),Q=w.material;if(Array.isArray(Q)){const y=C.groups;for(let N=0,ae=y.length;N<ae;N++){const Y=y[N],ee=Q[Y.materialIndex];if(ee&&ee.visible){const re=b(w,ee,W,B);w.onBeforeShadow(e,w,c,E,C,re,Y),e.renderBufferDirect(E,null,C,re,w,Y),w.onAfterShadow(e,w,c,E,C,re,Y)}}}else if(Q.visible){const y=b(w,Q,W,B);w.onBeforeShadow(e,w,c,E,C,y,null),e.renderBufferDirect(E,null,C,y,w,null),w.onAfterShadow(e,w,c,E,C,y,null)}}const $=w.children;for(let C=0,Q=$.length;C<Q;C++)T($[C],c,E,W,F,B)}function D(w){w.target.removeEventListener("dispose",D);for(const E in d){const W=d[E],F=w.target.uuid;F in W&&(W[F].dispose(),delete W[F])}}}function _u(e,n){function t(){let x=!1;const z=new Lt;let H=null;const ce=new Lt(0,0,0,0);return{setMask:function(ne){H!==ne&&!x&&(e.colorMask(ne,ne,ne,ne),H=ne)},setLocked:function(ne){x=ne},setClear:function(ne,se,be,Ie,te){te===!0&&(ne*=Ie,se*=Ie,be*=Ie),z.set(ne,se,be,Ie),ce.equals(z)===!1&&(e.clearColor(ne,se,be,Ie),ce.copy(z))},reset:function(){x=!1,H=null,ce.set(-1,0,0,0)}}}function i(){let x=!1,z=!1,H=null,ce=null,ne=null;return{setReversed:function(se){if(z!==se){const be=n.get("EXT_clip_control");se?be.clipControlEXT(be.LOWER_LEFT_EXT,be.ZERO_TO_ONE_EXT):be.clipControlEXT(be.LOWER_LEFT_EXT,be.NEGATIVE_ONE_TO_ONE_EXT),z=se;const Ie=ne;ne=null,this.setClear(Ie)}},getReversed:function(){return z},setTest:function(se){se?ve(e.DEPTH_TEST):Oe(e.DEPTH_TEST)},setMask:function(se){H!==se&&!x&&(e.depthMask(se),H=se)},setFunc:function(se){if(z&&(se=as[se]),ce!==se){switch(se){case Oo:e.depthFunc(e.NEVER);break;case No:e.depthFunc(e.ALWAYS);break;case Io:e.depthFunc(e.LESS);break;case Gi:e.depthFunc(e.LEQUAL);break;case Uo:e.depthFunc(e.EQUAL);break;case yo:e.depthFunc(e.GEQUAL);break;case Do:e.depthFunc(e.GREATER);break;case Lo:e.depthFunc(e.NOTEQUAL);break;default:e.depthFunc(e.LEQUAL)}ce=se}},setLocked:function(se){x=se},setClear:function(se){ne!==se&&(ne=se,z&&(se=1-se),e.clearDepth(se))},reset:function(){x=!1,H=null,ce=null,ne=null,z=!1}}}function a(){let x=!1,z=null,H=null,ce=null,ne=null,se=null,be=null,Ie=null,te=null;return{setTest:function(Ae){x||(Ae?ve(e.STENCIL_TEST):Oe(e.STENCIL_TEST))},setMask:function(Ae){z!==Ae&&!x&&(e.stencilMask(Ae),z=Ae)},setFunc:function(Ae,Ue,pe){(H!==Ae||ce!==Ue||ne!==pe)&&(e.stencilFunc(Ae,Ue,pe),H=Ae,ce=Ue,ne=pe)},setOp:function(Ae,Ue,pe){(se!==Ae||be!==Ue||Ie!==pe)&&(e.stencilOp(Ae,Ue,pe),se=Ae,be=Ue,Ie=pe)},setLocked:function(Ae){x=Ae},setClear:function(Ae){te!==Ae&&(e.clearStencil(Ae),te=Ae)},reset:function(){x=!1,z=null,H=null,ce=null,ne=null,se=null,be=null,Ie=null,te=null}}}const r=new t,o=new i,s=new a;let p={};const d=new WeakMap;let m={},g={},v={},_=new WeakMap,R=[],L=null,h=!1,u=null,M=null,b=null,T=null,D=null,w=null,c=null,E=new qe(0,0,0),W=0,F=!1,B=null,K=null,$=null,C=null,Q=null;const y=e.getParameter(e.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let N=!1,ae=0;const Y=e.getParameter(e.VERSION);Y.indexOf("WebGL")!==-1?(ae=parseFloat(/^WebGL (\d)/.exec(Y)[1]),N=ae>=1):Y.indexOf("OpenGL ES")!==-1&&(ae=parseFloat(/^OpenGL ES (\d)/.exec(Y)[1]),N=ae>=2);let ee=null,re={};const we=e.getParameter(e.SCISSOR_BOX),Fe=e.getParameter(e.VIEWPORT),X=new Lt().fromArray(we),_e=new Lt().fromArray(Fe);function xe(x,z,H,ce){const ne=new Uint8Array(4),se=e.createTexture();e.bindTexture(x,se),e.texParameteri(x,e.TEXTURE_MIN_FILTER,e.NEAREST),e.texParameteri(x,e.TEXTURE_MAG_FILTER,e.NEAREST);for(let be=0;be<H;be++)x===e.TEXTURE_3D||x===e.TEXTURE_2D_ARRAY?e.texImage3D(z,0,e.RGBA,1,1,ce,0,e.RGBA,e.UNSIGNED_BYTE,ne):e.texImage2D(z+be,0,e.RGBA,1,1,0,e.RGBA,e.UNSIGNED_BYTE,ne);return se}const Pe={};Pe[e.TEXTURE_2D]=xe(e.TEXTURE_2D,e.TEXTURE_2D,1),Pe[e.TEXTURE_CUBE_MAP]=xe(e.TEXTURE_CUBE_MAP,e.TEXTURE_CUBE_MAP_POSITIVE_X,6),Pe[e.TEXTURE_2D_ARRAY]=xe(e.TEXTURE_2D_ARRAY,e.TEXTURE_2D_ARRAY,1,1),Pe[e.TEXTURE_3D]=xe(e.TEXTURE_3D,e.TEXTURE_3D,1,1),r.setClear(0,0,0,1),o.setClear(1),s.setClear(0),ve(e.DEPTH_TEST),o.setFunc(Gi),Rt(!1),nt(Hi),ve(e.CULL_FACE),gt(pn);function ve(x){m[x]!==!0&&(e.enable(x),m[x]=!0)}function Oe(x){m[x]!==!1&&(e.disable(x),m[x]=!1)}function At(x,z){return v[x]!==z?(e.bindFramebuffer(x,z),v[x]=z,x===e.DRAW_FRAMEBUFFER&&(v[e.FRAMEBUFFER]=z),x===e.FRAMEBUFFER&&(v[e.DRAW_FRAMEBUFFER]=z),!0):!1}function Ce(x,z){let H=R,ce=!1;if(x){H=_.get(z),H===void 0&&(H=[],_.set(z,H));const ne=x.textures;if(H.length!==ne.length||H[0]!==e.COLOR_ATTACHMENT0){for(let se=0,be=ne.length;se<be;se++)H[se]=e.COLOR_ATTACHMENT0+se;H.length=ne.length,ce=!0}}else H[0]!==e.BACK&&(H[0]=e.BACK,ce=!0);ce&&e.drawBuffers(H)}function Qe(x){return L!==x?(e.useProgram(x),L=x,!0):!1}const Ke={[Mn]:e.FUNC_ADD,[Zr]:e.FUNC_SUBTRACT,[$r]:e.FUNC_REVERSE_SUBTRACT};Ke[rs]=e.MIN,Ke[os]=e.MAX;const Be={[uo]:e.ZERO,[fo]:e.ONE,[co]:e.SRC_COLOR,[lo]:e.SRC_ALPHA,[so]:e.SRC_ALPHA_SATURATE,[oo]:e.DST_COLOR,[ro]:e.DST_ALPHA,[ao]:e.ONE_MINUS_SRC_COLOR,[io]:e.ONE_MINUS_SRC_ALPHA,[no]:e.ONE_MINUS_DST_COLOR,[to]:e.ONE_MINUS_DST_ALPHA,[eo]:e.CONSTANT_COLOR,[Jr]:e.ONE_MINUS_CONSTANT_COLOR,[jr]:e.CONSTANT_ALPHA,[Qr]:e.ONE_MINUS_CONSTANT_ALPHA};function gt(x,z,H,ce,ne,se,be,Ie,te,Ae){if(x===pn){h===!0&&(Oe(e.BLEND),h=!1);return}if(h===!1&&(ve(e.BLEND),h=!0),x!==Go){if(x!==u||Ae!==F){if((M!==Mn||D!==Mn)&&(e.blendEquation(e.FUNC_ADD),M=Mn,D=Mn),Ae)switch(x){case kn:e.blendFuncSeparate(e.ONE,e.ONE_MINUS_SRC_ALPHA,e.ONE,e.ONE_MINUS_SRC_ALPHA);break;case zi:e.blendFunc(e.ONE,e.ONE);break;case ki:e.blendFuncSeparate(e.ZERO,e.ONE_MINUS_SRC_COLOR,e.ZERO,e.ONE);break;case Vi:e.blendFuncSeparate(e.DST_COLOR,e.ONE_MINUS_SRC_ALPHA,e.ZERO,e.ONE);break;default:tt("WebGLState: Invalid blending: ",x);break}else switch(x){case kn:e.blendFuncSeparate(e.SRC_ALPHA,e.ONE_MINUS_SRC_ALPHA,e.ONE,e.ONE_MINUS_SRC_ALPHA);break;case zi:e.blendFuncSeparate(e.SRC_ALPHA,e.ONE,e.ONE,e.ONE);break;case ki:tt("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case Vi:tt("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:tt("WebGLState: Invalid blending: ",x);break}b=null,T=null,w=null,c=null,E.set(0,0,0),W=0,u=x,F=Ae}return}ne=ne||z,se=se||H,be=be||ce,(z!==M||ne!==D)&&(e.blendEquationSeparate(Ke[z],Ke[ne]),M=z,D=ne),(H!==b||ce!==T||se!==w||be!==c)&&(e.blendFuncSeparate(Be[H],Be[ce],Be[se],Be[be]),b=H,T=ce,w=se,c=be),(Ie.equals(E)===!1||te!==W)&&(e.blendColor(Ie.r,Ie.g,Ie.b,te),E.copy(Ie),W=te),u=x,F=!1}function lt(x,z){x.side===vt?Oe(e.CULL_FACE):ve(e.CULL_FACE);let H=x.side===Dt;z&&(H=!H),Rt(H),x.blending===kn&&x.transparent===!1?gt(pn):gt(x.blending,x.blendEquation,x.blendSrc,x.blendDst,x.blendEquationAlpha,x.blendSrcAlpha,x.blendDstAlpha,x.blendColor,x.blendAlpha,x.premultipliedAlpha),o.setFunc(x.depthFunc),o.setTest(x.depthTest),o.setMask(x.depthWrite),r.setMask(x.colorWrite);const ce=x.stencilWrite;s.setTest(ce),ce&&(s.setMask(x.stencilWriteMask),s.setFunc(x.stencilFunc,x.stencilRef,x.stencilFuncMask),s.setOp(x.stencilFail,x.stencilZFail,x.stencilZPass)),ut(x.polygonOffset,x.polygonOffsetFactor,x.polygonOffsetUnits),x.alphaToCoverage===!0?ve(e.SAMPLE_ALPHA_TO_COVERAGE):Oe(e.SAMPLE_ALPHA_TO_COVERAGE)}function Rt(x){B!==x&&(x?e.frontFace(e.CW):e.frontFace(e.CCW),B=x)}function nt(x){x!==Fo?(ve(e.CULL_FACE),x!==K&&(x===Hi?e.cullFace(e.BACK):x===Bo?e.cullFace(e.FRONT):e.cullFace(e.FRONT_AND_BACK))):Oe(e.CULL_FACE),K=x}function Gt(x){x!==$&&(N&&e.lineWidth(x),$=x)}function ut(x,z,H){x?(ve(e.POLYGON_OFFSET_FILL),(C!==z||Q!==H)&&(C=z,Q=H,o.getReversed()&&(z=-z,H=-H),e.polygonOffset(z,H))):Oe(e.POLYGON_OFFSET_FILL)}function yt(x){x?ve(e.SCISSOR_TEST):Oe(e.SCISSOR_TEST)}function Ut(x){x===void 0&&(x=e.TEXTURE0+y-1),ee!==x&&(e.activeTexture(x),ee=x)}function It(x,z,H){H===void 0&&(ee===null?H=e.TEXTURE0+y-1:H=ee);let ce=re[H];ce===void 0&&(ce={type:void 0,texture:void 0},re[H]=ce),(ce.type!==x||ce.texture!==z)&&(ee!==H&&(e.activeTexture(H),ee=H),e.bindTexture(x,z||Pe[x]),ce.type=x,ce.texture=z)}function P(){const x=re[ee];x!==void 0&&x.type!==void 0&&(e.bindTexture(x.type,null),x.type=void 0,x.texture=void 0)}function Nt(){try{e.compressedTexImage2D(...arguments)}catch(x){tt("WebGLState:",x)}}function je(){try{e.compressedTexImage3D(...arguments)}catch(x){tt("WebGLState:",x)}}function Je(){try{e.texSubImage2D(...arguments)}catch(x){tt("WebGLState:",x)}}function he(){try{e.texSubImage3D(...arguments)}catch(x){tt("WebGLState:",x)}}function ct(){try{e.compressedTexSubImage2D(...arguments)}catch(x){tt("WebGLState:",x)}}function Re(){try{e.compressedTexSubImage3D(...arguments)}catch(x){tt("WebGLState:",x)}}function Le(){try{e.texStorage2D(...arguments)}catch(x){tt("WebGLState:",x)}}function S(){try{e.texStorage3D(...arguments)}catch(x){tt("WebGLState:",x)}}function l(){try{e.texImage2D(...arguments)}catch(x){tt("WebGLState:",x)}}function I(){try{e.texImage3D(...arguments)}catch(x){tt("WebGLState:",x)}}function j(x){return g[x]!==void 0?g[x]:e.getParameter(x)}function q(x,z){g[x]!==z&&(e.pixelStorei(x,z),g[x]=z)}function oe(x){X.equals(x)===!1&&(e.scissor(x.x,x.y,x.z,x.w),X.copy(x))}function de(x){_e.equals(x)===!1&&(e.viewport(x.x,x.y,x.z,x.w),_e.copy(x))}function V(x,z){let H=d.get(z);H===void 0&&(H=new WeakMap,d.set(z,H));let ce=H.get(x);ce===void 0&&(ce=e.getUniformBlockIndex(z,x.name),e.uniformBlockBinding(z,ce,ce),H.set(x,ce))}function k(x,z,H){const ne=d.get(z).get(x);p[ne]!==H&&(e.bindBufferBase(e.UNIFORM_BUFFER,ne,H),p[ne]=H)}function le(){e.disable(e.BLEND),e.disable(e.CULL_FACE),e.disable(e.DEPTH_TEST),e.disable(e.POLYGON_OFFSET_FILL),e.disable(e.SCISSOR_TEST),e.disable(e.STENCIL_TEST),e.disable(e.SAMPLE_ALPHA_TO_COVERAGE),e.blendEquation(e.FUNC_ADD),e.blendFunc(e.ONE,e.ZERO),e.blendFuncSeparate(e.ONE,e.ZERO,e.ONE,e.ZERO),e.blendColor(0,0,0,0),e.colorMask(!0,!0,!0,!0),e.clearColor(0,0,0,0),e.depthMask(!0),e.depthFunc(e.LESS),o.setReversed(!1),e.clearDepth(1),e.stencilMask(4294967295),e.stencilFunc(e.ALWAYS,0,4294967295),e.stencilOp(e.KEEP,e.KEEP,e.KEEP),e.clearStencil(0),e.cullFace(e.BACK),e.frontFace(e.CCW),e.polygonOffset(0,0),e.activeTexture(e.TEXTURE0),e.bindFramebuffer(e.FRAMEBUFFER,null),e.bindFramebuffer(e.DRAW_FRAMEBUFFER,null),e.bindFramebuffer(e.READ_FRAMEBUFFER,null),e.useProgram(null),e.lineWidth(1),e.scissor(0,0,e.canvas.width,e.canvas.height),e.viewport(0,0,e.canvas.width,e.canvas.height),e.pixelStorei(e.PACK_ALIGNMENT,4),e.pixelStorei(e.UNPACK_ALIGNMENT,4),e.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,!1),e.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),e.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,e.BROWSER_DEFAULT_WEBGL),e.pixelStorei(e.PACK_ROW_LENGTH,0),e.pixelStorei(e.PACK_SKIP_PIXELS,0),e.pixelStorei(e.PACK_SKIP_ROWS,0),e.pixelStorei(e.UNPACK_ROW_LENGTH,0),e.pixelStorei(e.UNPACK_IMAGE_HEIGHT,0),e.pixelStorei(e.UNPACK_SKIP_PIXELS,0),e.pixelStorei(e.UNPACK_SKIP_ROWS,0),e.pixelStorei(e.UNPACK_SKIP_IMAGES,0),m={},g={},ee=null,re={},v={},p={},_=new WeakMap,R=[],L=null,h=!1,u=null,M=null,b=null,T=null,D=null,w=null,c=null,E=new qe(0,0,0),W=0,F=!1,B=null,K=null,$=null,C=null,Q=null,X.set(0,0,e.canvas.width,e.canvas.height),_e.set(0,0,e.canvas.width,e.canvas.height),r.reset(),o.reset(),s.reset()}return{buffers:{color:r,depth:o,stencil:s},enable:ve,disable:Oe,bindFramebuffer:At,drawBuffers:Ce,useProgram:Qe,setBlending:gt,setMaterial:lt,setFlipSided:Rt,setCullFace:nt,setLineWidth:Gt,setPolygonOffset:ut,setScissorTest:yt,activeTexture:Ut,bindTexture:It,unbindTexture:P,compressedTexImage2D:Nt,compressedTexImage3D:je,texImage2D:l,texImage3D:I,pixelStorei:q,getParameter:j,updateUBOMapping:V,uniformBlockBinding:k,texStorage2D:Le,texStorage3D:S,texSubImage2D:Je,texSubImage3D:he,compressedTexSubImage2D:ct,compressedTexSubImage3D:Re,scissor:oe,viewport:de,reset:le}}function vu(e,n,t,i,a,r,o){const s=n.has("WEBGL_multisampled_render_to_texture")?n.get("WEBGL_multisampled_render_to_texture"):null,p=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),d=new xt,m=new WeakMap,g=new Set;let v;const _=new WeakMap,R=new Set,L=new FinalizationRegistry(S=>R.delete(S));let h=!1;try{h=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function u(S,l){return h?new OffscreenCanvas(S,l):Jo("canvas")}function M(S,l,I){let j=1;const q=Le(S);if((q.width>I||q.height>I)&&(j=I/Math.max(q.width,q.height)),j<1)if(typeof HTMLImageElement<"u"&&S instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&S instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&S instanceof ImageBitmap||typeof VideoFrame<"u"&&S instanceof VideoFrame){const oe=Math.floor(j*q.width),de=Math.floor(j*q.height);v===void 0&&(v=u(oe,de));const V=l?u(oe,de):v;return V.width=oe,V.height=de,V.getContext("2d").drawImage(S,0,0,oe,de),Xe("WebGLRenderer: Texture has been resized from ("+q.width+"x"+q.height+") to ("+oe+"x"+de+")."),V}else return"data"in S&&Xe("WebGLRenderer: Image in DataTexture is too big ("+q.width+"x"+q.height+")."),S;return S}function b(S){return S.generateMipmaps}function T(S){e.generateMipmap(S)}function D(S){return S.isWebGLCubeRenderTarget?e.TEXTURE_CUBE_MAP:S.isWebGL3DRenderTarget?e.TEXTURE_3D:S.isWebGLArrayRenderTarget||S.isCompressedArrayTexture?e.TEXTURE_2D_ARRAY:e.TEXTURE_2D}function w(S,l,I,j,q,oe=!1){if(S!==null){if(e[S]!==void 0)return e[S];Xe("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+S+"'")}let de;j&&(de=n.get("EXT_texture_norm16"),de||Xe("WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension"));let V=l;if(l===e.RED&&(I===e.FLOAT&&(V=e.R32F),I===e.HALF_FLOAT&&(V=e.R16F),I===e.UNSIGNED_BYTE&&(V=e.R8),I===e.UNSIGNED_SHORT&&de&&(V=de.R16_EXT),I===e.SHORT&&de&&(V=de.R16_SNORM_EXT)),l===e.RED_INTEGER&&(I===e.UNSIGNED_BYTE&&(V=e.R8UI),I===e.UNSIGNED_SHORT&&(V=e.R16UI),I===e.UNSIGNED_INT&&(V=e.R32UI),I===e.BYTE&&(V=e.R8I),I===e.SHORT&&(V=e.R16I),I===e.INT&&(V=e.R32I)),l===e.RG&&(I===e.FLOAT&&(V=e.RG32F),I===e.HALF_FLOAT&&(V=e.RG16F),I===e.UNSIGNED_BYTE&&(V=e.RG8),I===e.UNSIGNED_SHORT&&de&&(V=de.RG16_EXT),I===e.SHORT&&de&&(V=de.RG16_SNORM_EXT)),l===e.RG_INTEGER&&(I===e.UNSIGNED_BYTE&&(V=e.RG8UI),I===e.UNSIGNED_SHORT&&(V=e.RG16UI),I===e.UNSIGNED_INT&&(V=e.RG32UI),I===e.BYTE&&(V=e.RG8I),I===e.SHORT&&(V=e.RG16I),I===e.INT&&(V=e.RG32I)),l===e.RGB_INTEGER&&(I===e.UNSIGNED_BYTE&&(V=e.RGB8UI),I===e.UNSIGNED_SHORT&&(V=e.RGB16UI),I===e.UNSIGNED_INT&&(V=e.RGB32UI),I===e.BYTE&&(V=e.RGB8I),I===e.SHORT&&(V=e.RGB16I),I===e.INT&&(V=e.RGB32I)),l===e.RGBA_INTEGER&&(I===e.UNSIGNED_BYTE&&(V=e.RGBA8UI),I===e.UNSIGNED_SHORT&&(V=e.RGBA16UI),I===e.UNSIGNED_INT&&(V=e.RGBA32UI),I===e.BYTE&&(V=e.RGBA8I),I===e.SHORT&&(V=e.RGBA16I),I===e.INT&&(V=e.RGBA32I)),l===e.RGB&&(I===e.UNSIGNED_SHORT&&de&&(V=de.RGB16_EXT),I===e.SHORT&&de&&(V=de.RGB16_SNORM_EXT),I===e.UNSIGNED_INT_5_9_9_9_REV&&(V=e.RGB9_E5),I===e.UNSIGNED_INT_10F_11F_11F_REV&&(V=e.R11F_G11F_B10F)),l===e.RGBA){const k=oe?mr:rt.getTransfer(q);I===e.FLOAT&&(V=e.RGBA32F),I===e.HALF_FLOAT&&(V=e.RGBA16F),I===e.UNSIGNED_BYTE&&(V=k===Ze?e.SRGB8_ALPHA8:e.RGBA8),I===e.UNSIGNED_SHORT&&de&&(V=de.RGBA16_EXT),I===e.SHORT&&de&&(V=de.RGBA16_SNORM_EXT),I===e.UNSIGNED_SHORT_4_4_4_4&&(V=e.RGBA4),I===e.UNSIGNED_SHORT_5_5_5_1&&(V=e.RGB5_A1)}return(V===e.R16F||V===e.R32F||V===e.RG16F||V===e.RG32F||V===e.RGBA16F||V===e.RGBA32F)&&n.get("EXT_color_buffer_float"),V}function c(S,l){let I;return S?l===null||l===sn||l===vn?I=e.DEPTH24_STENCIL8:l===Qt?I=e.DEPTH32F_STENCIL8:l===qn&&(I=e.DEPTH24_STENCIL8,Xe("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):l===null||l===sn||l===vn?I=e.DEPTH_COMPONENT24:l===Qt?I=e.DEPTH_COMPONENT32F:l===qn&&(I=e.DEPTH_COMPONENT16),I}function E(S,l){return b(S)===!0||S.isFramebufferTexture&&S.minFilter!==rn&&S.minFilter!==Bt?Math.log2(Math.max(l.width,l.height))+1:S.mipmaps.length>0?S.mipmaps.length:S.isCompressedTexture&&Array.isArray(S.image)?l.mipmaps.length:1}function W(S){const l=new WeakRef(S);i.get(S).__ref=l,R.add(l),L.register(S,l,l)}function F(S){const l=i.get(S).__ref;l!==void 0&&(R.delete(l),L.unregister(l))}function B(S){$(S.target)}function K(S){C(S.target)}function $(S){S.removeEventListener("dispose",B),F(S),y(S),S.isVideoTexture&&m.delete(S),S.isHTMLTexture&&g.delete(S)}function C(S){S.removeEventListener("dispose",K),F(S),ae(S)}function Q(){for(const S of R){const l=S.deref();l!==void 0&&(l.isRenderTarget===!0?C(l):$(l))}R.clear(),g.clear()}function y(S){const l=i.get(S);if(l.__webglInit===void 0)return;const I=S.source,j=_.get(I);if(j){const q=j[l.__cacheKey];q.usedTimes--,q.usedTimes===0&&N(S),Object.keys(j).length===0&&_.delete(I)}i.remove(S)}function N(S){const l=i.get(S);e.deleteTexture(l.__webglTexture);const I=S.source,j=_.get(I);delete j[l.__cacheKey],o.memory.textures--}function ae(S){const l=i.get(S);l.__depthDisposeCallback&&l.__depthDisposeCallback();const I=S.depthTexture;if(I&&I.renderTarget===S&&$(I),S.isWebGLCubeRenderTarget)for(let q=0;q<6;q++){if(Array.isArray(l.__webglFramebuffer[q]))for(let oe=0;oe<l.__webglFramebuffer[q].length;oe++)e.deleteFramebuffer(l.__webglFramebuffer[q][oe]);else e.deleteFramebuffer(l.__webglFramebuffer[q]);l.__webglDepthbuffer&&e.deleteRenderbuffer(l.__webglDepthbuffer[q])}else{if(Array.isArray(l.__webglFramebuffer))for(let q=0;q<l.__webglFramebuffer.length;q++)e.deleteFramebuffer(l.__webglFramebuffer[q]);else e.deleteFramebuffer(l.__webglFramebuffer);if(l.__webglDepthbuffer&&e.deleteRenderbuffer(l.__webglDepthbuffer),l.__webglMultisampledFramebuffer&&e.deleteFramebuffer(l.__webglMultisampledFramebuffer),l.__webglColorRenderbuffer)for(let q=0;q<l.__webglColorRenderbuffer.length;q++)l.__webglColorRenderbuffer[q]&&e.deleteRenderbuffer(l.__webglColorRenderbuffer[q]);l.__webglDepthRenderbuffer&&e.deleteRenderbuffer(l.__webglDepthRenderbuffer)}const j=S.textures;for(let q=0,oe=j.length;q<oe;q++){const de=i.get(j[q]);de.__webglTexture&&(e.deleteTexture(de.__webglTexture),o.memory.textures--),i.remove(j[q])}i.remove(S)}let Y=0;function ee(){Y=0}function re(){return Y}function we(S){Y=S}function Fe(){const S=Y;return S>=a.maxTextures&&Xe("WebGLTextures: Trying to use "+(S+1)+" texture units while this GPU supports only "+a.maxTextures),Y+=1,S}function X(S){const l=[];return l.push(S.wrapS),l.push(S.wrapT),l.push(S.wrapR||0),l.push(S.magFilter),l.push(S.minFilter),l.push(S.anisotropy),l.push(S.internalFormat),l.push(S.format),l.push(S.type),l.push(S.generateMipmaps),l.push(S.mipmapsAutoUpdate),l.push(S.premultiplyAlpha),l.push(S.flipY),l.push(S.unpackAlignment),l.push(S.colorSpace),l.join()}function _e(S,l){const I=i.get(S);if(S.isVideoTexture&&ct(S),S.isRenderTargetTexture===!1&&S.isExternalTexture!==!0&&S.version>0&&I.__version!==S.version){const j=S.image;if(j===null)Xe("WebGLRenderer: Texture marked for update but no image data found.");else if(j.complete===!1)Xe("WebGLRenderer: Texture marked for update but image is incomplete");else{lt(I,S,l);return}}else S.isExternalTexture&&(I.__webglTexture=S.sourceTexture?S.sourceTexture:null);t.bindTexture(e.TEXTURE_2D,I.__webglTexture,e.TEXTURE0+l)}function xe(S,l){const I=i.get(S);if(S.isRenderTargetTexture===!1&&S.version>0&&I.__version!==S.version){lt(I,S,l);return}else S.isExternalTexture&&(I.__webglTexture=S.sourceTexture?S.sourceTexture:null);t.bindTexture(e.TEXTURE_2D_ARRAY,I.__webglTexture,e.TEXTURE0+l)}function Pe(S,l){const I=i.get(S);if(S.isRenderTargetTexture===!1&&S.version>0&&I.__version!==S.version){lt(I,S,l);return}t.bindTexture(e.TEXTURE_3D,I.__webglTexture,e.TEXTURE0+l)}function ve(S,l){const I=i.get(S);if(S.version>0&&I.__version!==S.version){Rt(I,S,l);return}t.bindTexture(e.TEXTURE_CUBE_MAP,I.__webglTexture,e.TEXTURE0+l)}const Oe={[Ja]:e.REPEAT,[hi]:e.CLAMP_TO_EDGE,[ho]:e.MIRRORED_REPEAT},At={[rn]:e.NEAREST,[po]:e.NEAREST_MIPMAP_NEAREST,[Fn]:e.NEAREST_MIPMAP_LINEAR,[Bt]:e.LINEAR,[ti]:e.LINEAR_MIPMAP_NEAREST,[an]:e.LINEAR_MIPMAP_LINEAR},Ce={[So]:e.NEVER,[nr]:e.ALWAYS,[vo]:e.LESS,[tr]:e.LEQUAL,[_o]:e.EQUAL,[er]:e.GEQUAL,[go]:e.GREATER,[mo]:e.NOTEQUAL};function Qe(S,l){if(l.type===Qt&&n.has("OES_texture_float_linear")===!1&&(l.magFilter===Bt||l.magFilter===ti||l.magFilter===Fn||l.magFilter===an||l.minFilter===Bt||l.minFilter===ti||l.minFilter===Fn||l.minFilter===an)&&Xe("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),e.texParameteri(S,e.TEXTURE_WRAP_S,Oe[l.wrapS]),e.texParameteri(S,e.TEXTURE_WRAP_T,Oe[l.wrapT]),(S===e.TEXTURE_3D||S===e.TEXTURE_2D_ARRAY)&&e.texParameteri(S,e.TEXTURE_WRAP_R,Oe[l.wrapR]),e.texParameteri(S,e.TEXTURE_MAG_FILTER,At[l.magFilter]),e.texParameteri(S,e.TEXTURE_MIN_FILTER,At[l.minFilter]),l.compareFunction&&(e.texParameteri(S,e.TEXTURE_COMPARE_MODE,e.COMPARE_REF_TO_TEXTURE),e.texParameteri(S,e.TEXTURE_COMPARE_FUNC,Ce[l.compareFunction])),n.has("EXT_texture_filter_anisotropic")===!0){if(l.magFilter===rn||l.minFilter!==Fn&&l.minFilter!==an||l.type===Qt&&n.has("OES_texture_float_linear")===!1)return;if(l.anisotropy>1||i.get(l).__currentAnisotropy){const I=n.get("EXT_texture_filter_anisotropic");e.texParameterf(S,I.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(l.anisotropy,a.getMaxAnisotropy())),i.get(l).__currentAnisotropy=l.anisotropy}}}function Ke(S,l){let I=!1;S.__webglInit===void 0&&(S.__webglInit=!0,l.addEventListener("dispose",B),W(l));const j=l.source;let q=_.get(j);q===void 0&&(q={},_.set(j,q));const oe=X(l);if(oe!==S.__cacheKey){q[oe]===void 0&&(q[oe]={texture:e.createTexture(),usedTimes:0},o.memory.textures++,I=!0),q[oe].usedTimes++;const de=q[S.__cacheKey];de!==void 0&&(q[S.__cacheKey].usedTimes--,de.usedTimes===0&&N(l)),S.__cacheKey=oe,S.__webglTexture=q[oe].texture}return I}function Be(S,l,I){return Math.floor(Math.floor(S/I)/l)}function gt(S,l,I,j){const oe=S.updateRanges;if(oe.length===0)t.texSubImage2D(e.TEXTURE_2D,0,0,0,l.width,l.height,I,j,l.data);else{oe.sort((x,z)=>x.start-z.start);let de=0;for(let x=1;x<oe.length;x++){const z=oe[de],H=oe[x],ce=z.start+z.count,ne=Be(H.start,l.width,4),se=Be(z.start,l.width,4);H.start<=ce+1&&ne===se&&Be(H.start+H.count-1,l.width,4)===ne?z.count=Math.max(z.count,H.start+H.count-z.start):(++de,oe[de]=H)}oe.length=de+1;const V=t.getParameter(e.UNPACK_ROW_LENGTH),k=t.getParameter(e.UNPACK_SKIP_PIXELS),le=t.getParameter(e.UNPACK_SKIP_ROWS);t.pixelStorei(e.UNPACK_ROW_LENGTH,l.width);for(let x=0,z=oe.length;x<z;x++){const H=oe[x],ce=Math.floor(H.start/4),ne=Math.ceil(H.count/4),se=ce%l.width,be=Math.floor(ce/l.width),Ie=ne,te=1;t.pixelStorei(e.UNPACK_SKIP_PIXELS,se),t.pixelStorei(e.UNPACK_SKIP_ROWS,be),t.texSubImage2D(e.TEXTURE_2D,0,se,be,Ie,te,I,j,l.data)}S.clearUpdateRanges(),t.pixelStorei(e.UNPACK_ROW_LENGTH,V),t.pixelStorei(e.UNPACK_SKIP_PIXELS,k),t.pixelStorei(e.UNPACK_SKIP_ROWS,le)}}function lt(S,l,I){let j=e.TEXTURE_2D;(l.isDataArrayTexture||l.isCompressedArrayTexture)&&(j=e.TEXTURE_2D_ARRAY),l.isData3DTexture&&(j=e.TEXTURE_3D);const q=Ke(S,l),oe=l.source;t.bindTexture(j,S.__webglTexture,e.TEXTURE0+I);const de=i.get(oe);if(oe.version!==de.__version||q===!0){if(t.activeTexture(e.TEXTURE0+I),(typeof ImageBitmap<"u"&&l.image instanceof ImageBitmap)===!1){const te=rt.getPrimaries(rt.workingColorSpace),Ae=l.colorSpace===un?null:rt.getPrimaries(l.colorSpace),Ue=l.colorSpace===un||te===Ae?e.NONE:e.BROWSER_DEFAULT_WEBGL;t.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,l.flipY),t.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,l.premultiplyAlpha),t.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,Ue)}t.pixelStorei(e.UNPACK_ALIGNMENT,l.unpackAlignment);let k=M(l.image,!1,a.maxTextureSize);k=Re(l,k);const le=r.convert(l.format,l.colorSpace),x=r.convert(l.type);let z=w(l.internalFormat,le,x,l.normalized,l.colorSpace,l.isVideoTexture);Qe(j,l);let H;const ce=l.mipmaps,ne=l.isVideoTexture!==!0,se=de.__version===void 0||q===!0,be=oe.dataReady,Ie=E(l,k);if(l.isDepthTexture)z=c(l.format===on,l.type),se&&(ne?t.texStorage2D(e.TEXTURE_2D,1,z,k.width,k.height):t.texImage2D(e.TEXTURE_2D,0,z,k.width,k.height,0,le,x,null));else if(l.isDataTexture)if(ce.length>0){ne&&se&&t.texStorage2D(e.TEXTURE_2D,Ie,z,ce[0].width,ce[0].height);for(let te=0,Ae=ce.length;te<Ae;te++)H=ce[te],ne?be&&t.texSubImage2D(e.TEXTURE_2D,te,0,0,H.width,H.height,le,x,H.data):t.texImage2D(e.TEXTURE_2D,te,z,H.width,H.height,0,le,x,H.data);l.generateMipmaps=!1}else ne?(se&&t.texStorage2D(e.TEXTURE_2D,Ie,z,k.width,k.height),be&&gt(l,k,le,x)):t.texImage2D(e.TEXTURE_2D,0,z,k.width,k.height,0,le,x,k.data);else if(l.isCompressedTexture)if(l.isCompressedArrayTexture){ne&&se&&t.texStorage3D(e.TEXTURE_2D_ARRAY,Ie,z,ce[0].width,ce[0].height,k.depth);for(let te=0,Ae=ce.length;te<Ae;te++)if(H=ce[te],l.format!==jt)if(le!==null)if(ne){if(be)if(l.layerUpdates.size>0){const Ue=Ma(H.width,H.height,l.format,l.type);for(const pe of l.layerUpdates){const We=H.data.subarray(pe*Ue/H.data.BYTES_PER_ELEMENT,(pe+1)*Ue/H.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(e.TEXTURE_2D_ARRAY,te,0,0,pe,H.width,H.height,1,le,We)}}else t.compressedTexSubImage3D(e.TEXTURE_2D_ARRAY,te,0,0,0,H.width,H.height,k.depth,le,H.data)}else t.compressedTexImage3D(e.TEXTURE_2D_ARRAY,te,z,H.width,H.height,k.depth,0,H.data,0,0);else Xe("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else ne?be&&t.texSubImage3D(e.TEXTURE_2D_ARRAY,te,0,0,0,H.width,H.height,k.depth,le,x,H.data):t.texImage3D(e.TEXTURE_2D_ARRAY,te,z,H.width,H.height,k.depth,0,le,x,H.data);l.layerUpdates.size>0&&l.clearLayerUpdates()}else{ne&&se&&t.texStorage2D(e.TEXTURE_2D,Ie,z,ce[0].width,ce[0].height);for(let te=0,Ae=ce.length;te<Ae;te++)H=ce[te],l.format!==jt?le!==null?ne?be&&t.compressedTexSubImage2D(e.TEXTURE_2D,te,0,0,H.width,H.height,le,H.data):t.compressedTexImage2D(e.TEXTURE_2D,te,z,H.width,H.height,0,H.data):Xe("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):ne?be&&t.texSubImage2D(e.TEXTURE_2D,te,0,0,H.width,H.height,le,x,H.data):t.texImage2D(e.TEXTURE_2D,te,z,H.width,H.height,0,le,x,H.data)}else if(l.isDataArrayTexture)if(ne){if(se&&t.texStorage3D(e.TEXTURE_2D_ARRAY,Ie,z,k.width,k.height,k.depth),be)if(l.layerUpdates.size>0){const te=Ma(k.width,k.height,l.format,l.type);for(const Ae of l.layerUpdates){const Ue=k.data.subarray(Ae*te/k.data.BYTES_PER_ELEMENT,(Ae+1)*te/k.data.BYTES_PER_ELEMENT);t.texSubImage3D(e.TEXTURE_2D_ARRAY,0,0,0,Ae,k.width,k.height,1,le,x,Ue)}l.clearLayerUpdates()}else t.texSubImage3D(e.TEXTURE_2D_ARRAY,0,0,0,0,k.width,k.height,k.depth,le,x,k.data)}else t.texImage3D(e.TEXTURE_2D_ARRAY,0,z,k.width,k.height,k.depth,0,le,x,k.data);else if(l.isData3DTexture)ne?(se&&t.texStorage3D(e.TEXTURE_3D,Ie,z,k.width,k.height,k.depth),be&&t.texSubImage3D(e.TEXTURE_3D,0,0,0,0,k.width,k.height,k.depth,le,x,k.data)):t.texImage3D(e.TEXTURE_3D,0,z,k.width,k.height,k.depth,0,le,x,k.data);else if(l.isFramebufferTexture){if(se)if(ne)t.texStorage2D(e.TEXTURE_2D,Ie,z,k.width,k.height);else{let te=k.width,Ae=k.height;for(let Ue=0;Ue<Ie;Ue++)t.texImage2D(e.TEXTURE_2D,Ue,z,te,Ae,0,le,x,null),te>>=1,Ae>>=1}}else if(l.isHTMLTexture){if("texElementImage2D"in e){const te=e.canvas;if(te.hasAttribute("layoutsubtree")||te.setAttribute("layoutsubtree","true"),k.parentNode!==te){te.appendChild(k),g.add(l),te.onpaint=Ae=>{const Ue=Ae.changedElements;for(const pe of g)Ue.includes(pe.image)&&(pe.needsUpdate=!0)},te.requestPaint();return}if(e.texElementImage2D.length===3)e.texElementImage2D(e.TEXTURE_2D,e.RGBA8,k);else{const Ue=e.RGBA,pe=e.RGBA,We=e.UNSIGNED_BYTE;e.texElementImage2D(e.TEXTURE_2D,0,Ue,pe,We,k)}e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE)}}else if(ce.length>0){if(ne&&se){const te=Le(ce[0]);t.texStorage2D(e.TEXTURE_2D,Ie,z,te.width,te.height)}for(let te=0,Ae=ce.length;te<Ae;te++)H=ce[te],ne?be&&t.texSubImage2D(e.TEXTURE_2D,te,0,0,le,x,H):t.texImage2D(e.TEXTURE_2D,te,z,le,x,H);l.generateMipmaps=!1}else if(ne){if(se){const te=Le(k);t.texStorage2D(e.TEXTURE_2D,Ie,z,te.width,te.height)}be&&t.texSubImage2D(e.TEXTURE_2D,0,0,0,le,x,k)}else t.texImage2D(e.TEXTURE_2D,0,z,le,x,k);b(l)&&l.mipmapsAutoUpdate===!0&&T(j),de.__version=oe.version,l.onUpdate&&l.onUpdate(l)}S.__version=l.version}function Rt(S,l,I){if(l.image.length!==6)return;const j=Ke(S,l),q=l.source;t.bindTexture(e.TEXTURE_CUBE_MAP,S.__webglTexture,e.TEXTURE0+I);const oe=i.get(q);if(q.version!==oe.__version||j===!0){t.activeTexture(e.TEXTURE0+I);const de=rt.getPrimaries(rt.workingColorSpace),V=l.colorSpace===un?null:rt.getPrimaries(l.colorSpace),k=l.colorSpace===un||de===V?e.NONE:e.BROWSER_DEFAULT_WEBGL;t.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,l.flipY),t.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,l.premultiplyAlpha),t.pixelStorei(e.UNPACK_ALIGNMENT,l.unpackAlignment),t.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,k);const le=l.isCompressedTexture||l.image[0].isCompressedTexture,x=l.image[0]&&l.image[0].isDataTexture,z=[];for(let pe=0;pe<6;pe++)!le&&!x?z[pe]=M(l.image[pe],!0,a.maxCubemapSize):z[pe]=x?l.image[pe].image:l.image[pe],z[pe]=Re(l,z[pe]);const H=z[0],ce=r.convert(l.format,l.colorSpace),ne=r.convert(l.type);let se=w(l.internalFormat,ce,ne,l.normalized,l.colorSpace);const be=l.isVideoTexture!==!0,Ie=oe.__version===void 0||j===!0,te=q.dataReady;let Ae=E(l,H);Qe(e.TEXTURE_CUBE_MAP,l);let Ue;if(l.isDepthTexture){if(se=c(l.format===on,l.type),Ie)if(be)t.texStorage2D(e.TEXTURE_CUBE_MAP,1,se,H.width,H.height);else for(let pe=0;pe<6;pe++)t.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+pe,0,se,H.width,H.height,0,ce,ne,null)}else if(le){be&&Ie&&t.texStorage2D(e.TEXTURE_CUBE_MAP,Ae,se,H.width,H.height);for(let pe=0;pe<6;pe++){Ue=z[pe].mipmaps;for(let We=0;We<Ue.length;We++){const ht=Ue[We];l.format!==jt?ce!==null?be?te&&t.compressedTexSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+pe,We,0,0,ht.width,ht.height,ce,ht.data):t.compressedTexImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+pe,We,se,ht.width,ht.height,0,ht.data):Xe("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):be?te&&t.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+pe,We,0,0,ht.width,ht.height,ce,ne,ht.data):t.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+pe,We,se,ht.width,ht.height,0,ce,ne,ht.data)}}}else{if(Ue=l.mipmaps,be&&Ie){Ue.length>0&&Ae++;const pe=Le(z[0]);t.texStorage2D(e.TEXTURE_CUBE_MAP,Ae,se,pe.width,pe.height)}for(let pe=0;pe<6;pe++)if(x){be?te&&t.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+pe,0,0,0,z[pe].width,z[pe].height,ce,ne,z[pe].data):t.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+pe,0,se,z[pe].width,z[pe].height,0,ce,ne,z[pe].data);for(let We=0;We<Ue.length;We++){const $t=Ue[We].image[pe].image;be?te&&t.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+pe,We+1,0,0,$t.width,$t.height,ce,ne,$t.data):t.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+pe,We+1,se,$t.width,$t.height,0,ce,ne,$t.data)}}else{be?te&&t.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+pe,0,0,0,ce,ne,z[pe]):t.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+pe,0,se,ce,ne,z[pe]);for(let We=0;We<Ue.length;We++){const ht=Ue[We];be?te&&t.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+pe,We+1,0,0,ce,ne,ht.image[pe]):t.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+pe,We+1,se,ce,ne,ht.image[pe])}}}b(l)&&l.mipmapsAutoUpdate===!0&&T(e.TEXTURE_CUBE_MAP),oe.__version=q.version,l.onUpdate&&l.onUpdate(l)}S.__version=l.version}function nt(S,l,I,j,q,oe){const de=r.convert(I.format,I.colorSpace),V=r.convert(I.type),k=w(I.internalFormat,de,V,I.normalized,I.colorSpace),le=i.get(l),x=i.get(I);if(x.__renderTarget=l,!le.__hasExternalTextures){const z=Math.max(1,l.width>>oe),H=Math.max(1,l.height>>oe);q===e.TEXTURE_3D||q===e.TEXTURE_2D_ARRAY?t.texImage3D(q,oe,k,z,H,l.depth,0,de,V,null):t.texImage2D(q,oe,k,z,H,0,de,V,null)}t.bindFramebuffer(e.FRAMEBUFFER,S),he(l)?s.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER,j,q,x.__webglTexture,0,Je(l)):(q===e.TEXTURE_2D||q>=e.TEXTURE_CUBE_MAP_POSITIVE_X&&q<=e.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&e.framebufferTexture2D(e.FRAMEBUFFER,j,q,x.__webglTexture,oe),t.bindFramebuffer(e.FRAMEBUFFER,null)}function Gt(S,l,I){if(e.bindRenderbuffer(e.RENDERBUFFER,S),l.depthBuffer){const j=l.depthTexture,q=j&&j.isDepthTexture?j.type:null,oe=c(l.stencilBuffer,q),de=l.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT;he(l)?s.renderbufferStorageMultisampleEXT(e.RENDERBUFFER,Je(l),oe,l.width,l.height):I?e.renderbufferStorageMultisample(e.RENDERBUFFER,Je(l),oe,l.width,l.height):e.renderbufferStorage(e.RENDERBUFFER,oe,l.width,l.height),e.framebufferRenderbuffer(e.FRAMEBUFFER,de,e.RENDERBUFFER,S)}else{const j=l.textures;for(let q=0;q<j.length;q++){const oe=j[q],de=r.convert(oe.format,oe.colorSpace),V=r.convert(oe.type),k=w(oe.internalFormat,de,V,oe.normalized,oe.colorSpace);he(l)?s.renderbufferStorageMultisampleEXT(e.RENDERBUFFER,Je(l),k,l.width,l.height):I?e.renderbufferStorageMultisample(e.RENDERBUFFER,Je(l),k,l.width,l.height):e.renderbufferStorage(e.RENDERBUFFER,k,l.width,l.height)}}e.bindRenderbuffer(e.RENDERBUFFER,null)}function ut(S,l,I){const j=l.isWebGLCubeRenderTarget===!0;if(t.bindFramebuffer(e.FRAMEBUFFER,S),!(l.depthTexture&&l.depthTexture.isDepthTexture))throw new Error("THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.");const q=i.get(l.depthTexture);q.__renderTarget=l;const oe=j?l.depthTexture.image[0]:l.depthTexture.image;(!q.__webglTexture||oe.width!==l.width||oe.height!==l.height)&&(oe.width=l.width,oe.height=l.height,l.depthTexture.needsUpdate=!0),j?ve(l.depthTexture,0):_e(l.depthTexture,0);const de=q.__webglTexture,V=Je(l),k=j?e.TEXTURE_CUBE_MAP_POSITIVE_X+I:e.TEXTURE_2D,le=l.depthTexture.format===on?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT;if(l.depthTexture.format===yn)he(l)?s.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER,le,k,de,0,V):e.framebufferTexture2D(e.FRAMEBUFFER,le,k,de,0);else if(l.depthTexture.format===on)he(l)?s.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER,le,k,de,0,V):e.framebufferTexture2D(e.FRAMEBUFFER,le,k,de,0);else throw new Error("THREE.WebGLTextures: Unknown depthTexture format.")}function yt(S){const l=i.get(S),I=S.isWebGLCubeRenderTarget===!0;if(l.__boundDepthTexture!==S.depthTexture){const j=S.depthTexture;if(l.__depthDisposeCallback&&l.__depthDisposeCallback(),j){const q=()=>{delete l.__boundDepthTexture,delete l.__depthDisposeCallback,j.removeEventListener("dispose",q)};j.addEventListener("dispose",q),l.__depthDisposeCallback=q}l.__boundDepthTexture=j}if(S.depthTexture&&!l.__autoAllocateDepthBuffer)if(I)for(let j=0;j<6;j++)ut(l.__webglFramebuffer[j],S,j);else S.texture.mipmaps.length>0?ut(l.__webglFramebuffer[0],S,0):ut(l.__webglFramebuffer,S,0);else if(I){l.__webglDepthbuffer=[];for(let j=0;j<6;j++)if(t.bindFramebuffer(e.FRAMEBUFFER,l.__webglFramebuffer[j]),l.__webglDepthbuffer[j]===void 0)l.__webglDepthbuffer[j]=e.createRenderbuffer(),Gt(l.__webglDepthbuffer[j],S,!1);else{const q=S.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,oe=l.__webglDepthbuffer[j];e.bindRenderbuffer(e.RENDERBUFFER,oe),e.framebufferRenderbuffer(e.FRAMEBUFFER,q,e.RENDERBUFFER,oe)}}else if(S.texture.mipmaps.length>0?t.bindFramebuffer(e.FRAMEBUFFER,l.__webglFramebuffer[0]):t.bindFramebuffer(e.FRAMEBUFFER,l.__webglFramebuffer),l.__webglDepthbuffer===void 0)l.__webglDepthbuffer=e.createRenderbuffer(),Gt(l.__webglDepthbuffer,S,!1);else{const q=S.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,oe=l.__webglDepthbuffer;e.bindRenderbuffer(e.RENDERBUFFER,oe),e.framebufferRenderbuffer(e.FRAMEBUFFER,q,e.RENDERBUFFER,oe)}t.bindFramebuffer(e.FRAMEBUFFER,null)}function Ut(S,l,I){const j=i.get(S);l!==void 0&&nt(j.__webglFramebuffer,S,S.texture,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,0),I!==void 0&&yt(S)}function It(S){const l=S.texture,I=i.get(S),j=i.get(l);S.addEventListener("dispose",K),W(S);const q=S.textures,oe=S.isWebGLCubeRenderTarget===!0,de=q.length>1;if(de||(j.__webglTexture===void 0&&(j.__webglTexture=e.createTexture()),j.__version=l.version,o.memory.textures++),oe){I.__webglFramebuffer=[];for(let V=0;V<6;V++)if(l.mipmaps.length>0){I.__webglFramebuffer[V]=[];for(let k=0;k<l.mipmaps.length;k++)I.__webglFramebuffer[V][k]=e.createFramebuffer()}else I.__webglFramebuffer[V]=e.createFramebuffer()}else{if(l.mipmaps.length>0){I.__webglFramebuffer=[];for(let V=0;V<l.mipmaps.length;V++)I.__webglFramebuffer[V]=e.createFramebuffer()}else I.__webglFramebuffer=e.createFramebuffer();if(de)for(let V=0,k=q.length;V<k;V++){const le=i.get(q[V]);le.__webglTexture===void 0&&(le.__webglTexture=e.createTexture(),o.memory.textures++)}if(S.samples>0&&he(S)===!1){I.__webglMultisampledFramebuffer=e.createFramebuffer(),I.__webglColorRenderbuffer=[],t.bindFramebuffer(e.FRAMEBUFFER,I.__webglMultisampledFramebuffer);for(let V=0;V<q.length;V++){const k=q[V];I.__webglColorRenderbuffer[V]=e.createRenderbuffer(),e.bindRenderbuffer(e.RENDERBUFFER,I.__webglColorRenderbuffer[V]);const le=r.convert(k.format,k.colorSpace),x=r.convert(k.type),z=w(k.internalFormat,le,x,k.normalized,k.colorSpace,S.isXRRenderTarget===!0),H=Je(S);e.renderbufferStorageMultisample(e.RENDERBUFFER,H,z,S.width,S.height),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0+V,e.RENDERBUFFER,I.__webglColorRenderbuffer[V])}e.bindRenderbuffer(e.RENDERBUFFER,null),S.depthBuffer&&(I.__webglDepthRenderbuffer=e.createRenderbuffer(),Gt(I.__webglDepthRenderbuffer,S,!0)),t.bindFramebuffer(e.FRAMEBUFFER,null)}}if(oe){t.bindTexture(e.TEXTURE_CUBE_MAP,j.__webglTexture),Qe(e.TEXTURE_CUBE_MAP,l);for(let V=0;V<6;V++)if(l.mipmaps.length>0)for(let k=0;k<l.mipmaps.length;k++)nt(I.__webglFramebuffer[V][k],S,l,e.COLOR_ATTACHMENT0,e.TEXTURE_CUBE_MAP_POSITIVE_X+V,k);else nt(I.__webglFramebuffer[V],S,l,e.COLOR_ATTACHMENT0,e.TEXTURE_CUBE_MAP_POSITIVE_X+V,0);b(l)?T(e.TEXTURE_CUBE_MAP):l.mipmaps.length>0&&e.texParameteri(e.TEXTURE_CUBE_MAP,e.TEXTURE_MAX_LEVEL,l.mipmaps.length-1),t.unbindTexture()}else if(de){for(let V=0,k=q.length;V<k;V++){const le=q[V],x=i.get(le);let z=e.TEXTURE_2D;(S.isWebGL3DRenderTarget||S.isWebGLArrayRenderTarget)&&(z=S.isWebGL3DRenderTarget?e.TEXTURE_3D:e.TEXTURE_2D_ARRAY),t.bindTexture(z,x.__webglTexture),Qe(z,le),nt(I.__webglFramebuffer,S,le,e.COLOR_ATTACHMENT0+V,z,0),b(le)&&T(z)}t.unbindTexture()}else{let V=e.TEXTURE_2D;if((S.isWebGL3DRenderTarget||S.isWebGLArrayRenderTarget)&&(V=S.isWebGL3DRenderTarget?e.TEXTURE_3D:e.TEXTURE_2D_ARRAY),t.bindTexture(V,j.__webglTexture),Qe(V,l),l.mipmaps.length>0)for(let k=0;k<l.mipmaps.length;k++)nt(I.__webglFramebuffer[k],S,l,e.COLOR_ATTACHMENT0,V,k);else nt(I.__webglFramebuffer,S,l,e.COLOR_ATTACHMENT0,V,0);b(l)?T(V):l.mipmaps.length>0&&e.texParameteri(V,e.TEXTURE_MAX_LEVEL,l.mipmaps.length-1),t.unbindTexture()}S.depthBuffer&&yt(S)}function P(S){const l=S.textures;for(let I=0,j=l.length;I<j;I++){const q=l[I];if(b(q)&&q.mipmapsAutoUpdate===!0){const oe=D(S),de=i.get(q).__webglTexture;t.bindTexture(oe,de),T(oe),t.unbindTexture()}}}const Nt=[];function je(S){if(S.samples>0){if(he(S)===!1){const l=S.textures,I=S.width,j=S.height;let q=e.COLOR_BUFFER_BIT;const oe=S.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,de=i.get(S),V=l.length>1;if(V)for(let le=0;le<l.length;le++)t.bindFramebuffer(e.FRAMEBUFFER,de.__webglMultisampledFramebuffer),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0+le,e.RENDERBUFFER,null),t.bindFramebuffer(e.FRAMEBUFFER,de.__webglFramebuffer),e.framebufferTexture2D(e.DRAW_FRAMEBUFFER,e.COLOR_ATTACHMENT0+le,e.TEXTURE_2D,null,0);t.bindFramebuffer(e.READ_FRAMEBUFFER,de.__webglMultisampledFramebuffer),S.texture.mipmaps.length>0?t.bindFramebuffer(e.DRAW_FRAMEBUFFER,de.__webglFramebuffer[0]):t.bindFramebuffer(e.DRAW_FRAMEBUFFER,de.__webglFramebuffer);for(let le=0;le<l.length;le++){if(S.resolveDepthBuffer&&(S.depthBuffer&&(q|=e.DEPTH_BUFFER_BIT),S.stencilBuffer&&S.resolveStencilBuffer&&(q|=e.STENCIL_BUFFER_BIT)),V){e.framebufferRenderbuffer(e.READ_FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.RENDERBUFFER,de.__webglColorRenderbuffer[le]);const x=i.get(l[le]).__webglTexture;e.framebufferTexture2D(e.DRAW_FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,x,0)}e.blitFramebuffer(0,0,I,j,0,0,I,j,q,e.NEAREST),p===!0&&(Nt.length=0,Nt.push(e.COLOR_ATTACHMENT0+le),S.depthBuffer&&S.storeMultisampledDepthBuffer===!1&&Nt.push(oe),e.invalidateFramebuffer(e.READ_FRAMEBUFFER,Nt))}if(t.bindFramebuffer(e.READ_FRAMEBUFFER,null),t.bindFramebuffer(e.DRAW_FRAMEBUFFER,null),V)for(let le=0;le<l.length;le++){t.bindFramebuffer(e.FRAMEBUFFER,de.__webglMultisampledFramebuffer),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0+le,e.RENDERBUFFER,de.__webglColorRenderbuffer[le]);const x=i.get(l[le]).__webglTexture;t.bindFramebuffer(e.FRAMEBUFFER,de.__webglFramebuffer),e.framebufferTexture2D(e.DRAW_FRAMEBUFFER,e.COLOR_ATTACHMENT0+le,e.TEXTURE_2D,x,0)}t.bindFramebuffer(e.DRAW_FRAMEBUFFER,de.__webglMultisampledFramebuffer)}else if(S.depthBuffer&&S.storeMultisampledDepthBuffer===!1&&p){const l=S.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT;e.invalidateFramebuffer(e.DRAW_FRAMEBUFFER,[l])}}}function Je(S){return Math.min(a.maxSamples,S.samples)}function he(S){const l=i.get(S);return S.samples>0&&n.has("WEBGL_multisampled_render_to_texture")===!0&&l.__useRenderToTexture!==!1}function ct(S){const l=o.render.frame;m.get(S)!==l&&(m.set(S,l),S.update())}function Re(S,l){const I=S.colorSpace,j=S.format,q=S.type;return S.isCompressedTexture===!0||S.isVideoTexture===!0||I!==xr&&I!==un&&(rt.getTransfer(I)===Ze?(j!==jt||q!==kt)&&Xe("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):tt("WebGLTextures: Unsupported texture color space:",I)),l}function Le(S){return typeof HTMLImageElement<"u"&&S instanceof HTMLImageElement?(d.width=S.naturalWidth||S.width,d.height=S.naturalHeight||S.height):typeof VideoFrame<"u"&&S instanceof VideoFrame?(d.width=S.displayWidth,d.height=S.displayHeight):(d.width=S.width,d.height=S.height),d}this.allocateTextureUnit=Fe,this.resetTextureUnits=ee,this.getTextureUnits=re,this.setTextureUnits=we,this.setTexture2D=_e,this.setTexture2DArray=xe,this.setTexture3D=Pe,this.setTextureCube=ve,this.rebindTextures=Ut,this.setupRenderTarget=It,this.updateRenderTargetMipmap=P,this.updateMultisampleRenderTarget=je,this.setupDepthRenderbuffer=yt,this.setupFrameBufferTexture=nt,this.useMultisampledRTT=he,this.dispose=Q}function Su(e,n){function t(i,a=un){let r;const o=rt.getTransfer(a);if(i===kt)return e.UNSIGNED_BYTE;if(i===lr)return e.UNSIGNED_SHORT_4_4_4_4;if(i===cr)return e.UNSIGNED_SHORT_5_5_5_1;if(i===ko)return e.UNSIGNED_INT_5_9_9_9_REV;if(i===zo)return e.UNSIGNED_INT_10F_11F_11F_REV;if(i===Wo)return e.BYTE;if(i===Xo)return e.SHORT;if(i===qn)return e.UNSIGNED_SHORT;if(i===hr)return e.INT;if(i===sn)return e.UNSIGNED_INT;if(i===Qt)return e.FLOAT;if(i===Yt)return e.HALF_FLOAT;if(i===qo)return e.ALPHA;if(i===Ko)return e.RGB;if(i===jt)return e.RGBA;if(i===yn)return e.DEPTH_COMPONENT;if(i===on)return e.DEPTH_STENCIL;if(i===Yo)return e.RED;if(i===sr)return e.RED_INTEGER;if(i===_n)return e.RG;if(i===or)return e.RG_INTEGER;if(i===rr)return e.RGBA_INTEGER;if(i===ai||i===ri||i===oi||i===si)if(o===Ze)if(r=n.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(i===ai)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===ri)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===oi)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===si)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=n.get("WEBGL_compressed_texture_s3tc"),r!==null){if(i===ai)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===ri)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===oi)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===si)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===Xi||i===qi||i===Ki||i===Yi)if(r=n.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(i===Xi)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===qi)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===Ki)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===Yi)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===$i||i===Zi||i===Qi||i===ji||i===Ji||i===_i||i===ea)if(r=n.get("WEBGL_compressed_texture_etc"),r!==null){if(i===$i||i===Zi)return o===Ze?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(i===Qi)return o===Ze?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC;if(i===ji)return r.COMPRESSED_R11_EAC;if(i===Ji)return r.COMPRESSED_SIGNED_R11_EAC;if(i===_i)return r.COMPRESSED_RG11_EAC;if(i===ea)return r.COMPRESSED_SIGNED_RG11_EAC}else return null;if(i===ta||i===na||i===ia||i===aa||i===ra||i===oa||i===sa||i===la||i===ca||i===fa||i===da||i===ua||i===ha||i===pa)if(r=n.get("WEBGL_compressed_texture_astc"),r!==null){if(i===ta)return o===Ze?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===na)return o===Ze?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===ia)return o===Ze?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===aa)return o===Ze?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===ra)return o===Ze?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===oa)return o===Ze?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===sa)return o===Ze?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===la)return o===Ze?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===ca)return o===Ze?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===fa)return o===Ze?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===da)return o===Ze?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===ua)return o===Ze?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===ha)return o===Ze?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===pa)return o===Ze?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===ma||i===ga||i===_a)if(r=n.get("EXT_texture_compression_bptc"),r!==null){if(i===ma)return o===Ze?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===ga)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===_a)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===va||i===Sa||i===vi||i===Ea)if(r=n.get("EXT_texture_compression_rgtc"),r!==null){if(i===va)return r.COMPRESSED_RED_RGTC1_EXT;if(i===Sa)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===vi)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===Ea)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===vn?e.UNSIGNED_INT_24_8:e[i]!==void 0?e[i]:null}return{convert:t}}const Eu=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,Mu=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;class xu{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(n,t){if(this.texture===null){const i=new ur(n.texture);(n.depthNear!==t.depthNear||n.depthFar!==t.depthFar)&&(this.depthNear=n.depthNear,this.depthFar=n.depthFar),this.texture=i}}getMesh(n){if(this.texture!==null&&this.mesh===null){const t=n.cameras[0].viewport,i=new gn({vertexShader:Eu,fragmentShader:Mu,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new ye(new Ct(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class Tu extends Ao{constructor(n,t){super();const i=this;let a=null,r=1,o=null,s="local-floor",p=1,d=null,m=null,g=null,v=null,_=null,R=null;const L=typeof XRWebGLBinding<"u",h=new xu,u={},M=t.getContextAttributes();let b=null,T=null;const D=[],w=[],c=new xt;let E=null,W=null;const F=new ni;F.viewport=new Lt;const B=new ni;B.viewport=new Lt;const K=[F,B],$=new Ro;let C=null,Q=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(X){let _e=D[X];return _e===void 0&&(_e=new ii,D[X]=_e),_e.getTargetRaySpace()},this.getControllerGrip=function(X){let _e=D[X];return _e===void 0&&(_e=new ii,D[X]=_e),_e.getGripSpace()},this.getHand=function(X){let _e=D[X];return _e===void 0&&(_e=new ii,D[X]=_e),_e.getHandSpace()};function y(X){const _e=w.indexOf(X.inputSource);if(_e===-1)return;const xe=D[_e];xe!==void 0&&(xe.update(X.inputSource,X.frame,d||o),xe.dispatchEvent({type:X.type,data:X.inputSource}))}function N(){a.removeEventListener("select",y),a.removeEventListener("selectstart",y),a.removeEventListener("selectend",y),a.removeEventListener("squeeze",y),a.removeEventListener("squeezestart",y),a.removeEventListener("squeezeend",y),a.removeEventListener("end",N),a.removeEventListener("inputsourceschange",ae);for(let X=0;X<D.length;X++){const _e=w[X];_e!==null&&(w[X]=null,D[X].disconnect(_e))}C=null,Q=null,h.reset();for(const X in u)delete u[X];if(n.setRenderTarget(b),_=null,v=null,g=null,a=null,T=null,Fe.stop(),i.isPresenting=!1,n.setPixelRatio(E),n.setSize(c.width,c.height,!1),W!==null){const X=W.camera;X.fov=W.fov,X.zoom=W.zoom,X.updateProjectionMatrix(),W=null}i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(X){r=X,i.isPresenting===!0&&Xe("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(X){s=X,i.isPresenting===!0&&Xe("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return d||o},this.setReferenceSpace=function(X){d=X},this.getBaseLayer=function(){return v!==null?v:_},this.getBinding=function(){return g===null&&L&&(g=new XRWebGLBinding(a,t)),g},this.getFrame=function(){return R},this.getSession=function(){return a},this.setSession=async function(X){if(a=X,a!==null){if(b=n.getRenderTarget(),a.addEventListener("select",y),a.addEventListener("selectstart",y),a.addEventListener("selectend",y),a.addEventListener("squeeze",y),a.addEventListener("squeezestart",y),a.addEventListener("squeezeend",y),a.addEventListener("end",N),a.addEventListener("inputsourceschange",ae),M.xrCompatible!==!0&&await t.makeXRCompatible(),E=n.getPixelRatio(),n.getSize(c),L&&"createProjectionLayer"in XRWebGLBinding.prototype){let xe=null,Pe=null,ve=null;M.depth&&(ve=M.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,xe=M.stencil?on:yn,Pe=M.stencil?vn:sn);const Oe={colorFormat:t.RGBA8,depthFormat:ve,scaleFactor:r};g=this.getBinding(),v=g.createProjectionLayer(Oe),a.updateRenderState({layers:[v]}),n.setPixelRatio(1),n.setSize(v.textureWidth,v.textureHeight,!1),T=new zt(v.textureWidth,v.textureHeight,{format:jt,type:kt,depthTexture:new Dn(v.textureWidth,v.textureHeight,Pe,void 0,void 0,void 0,void 0,void 0,void 0,xe),stencilBuffer:M.stencil,colorSpace:n.outputColorSpace,samples:M.antialias?4:0,resolveDepthBuffer:v.ignoreDepthValues===!1,resolveStencilBuffer:v.ignoreDepthValues===!1,storeMultisampledDepthBuffer:v.ignoreDepthValues===!1,storeMultisampledStencilBuffer:v.ignoreDepthValues===!1})}else{const xe={antialias:M.antialias,alpha:!0,depth:M.depth,stencil:M.stencil,framebufferScaleFactor:r};_=new XRWebGLLayer(a,t,xe),a.updateRenderState({baseLayer:_}),n.setPixelRatio(1),n.setSize(_.framebufferWidth,_.framebufferHeight,!1),T=new zt(_.framebufferWidth,_.framebufferHeight,{format:jt,type:kt,colorSpace:n.outputColorSpace,stencilBuffer:M.stencil,resolveDepthBuffer:_.ignoreDepthValues===!1,resolveStencilBuffer:_.ignoreDepthValues===!1,storeMultisampledDepthBuffer:_.ignoreDepthValues===!1,storeMultisampledStencilBuffer:_.ignoreDepthValues===!1})}T.isXRRenderTarget=!0,this.setFoveation(p),d=null,o=await a.requestReferenceSpace(s),Fe.setContext(a),Fe.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(a!==null)return a.environmentBlendMode},this.getDepthTexture=function(){return h.getDepthTexture()};function ae(X){for(let _e=0;_e<X.removed.length;_e++){const xe=X.removed[_e],Pe=w.indexOf(xe);Pe>=0&&(w[Pe]=null,D[Pe].disconnect(xe))}for(let _e=0;_e<X.added.length;_e++){const xe=X.added[_e];let Pe=w.indexOf(xe);if(Pe===-1){for(let Oe=0;Oe<D.length;Oe++)if(Oe>=w.length){w.push(xe),Pe=Oe;break}else if(w[Oe]===null){w[Oe]=xe,Pe=Oe;break}if(Pe===-1)break}const ve=D[Pe];ve&&ve.connect(xe)}}function Y(X,_e){_e===null?X.matrixWorld.copy(X.matrix):X.matrixWorld.multiplyMatrices(_e.matrixWorld,X.matrix),X.matrixWorldInverse.copy(X.matrixWorld).invert()}this.updateCamera=function(X){if(a===null)return;let _e=X.near,xe=X.far;h.texture!==null&&(h.depthNear>0&&(_e=h.depthNear),h.depthFar>0&&(xe=h.depthFar)),$.near=B.near=F.near=_e,$.far=B.far=F.far=xe,(C!==$.near||Q!==$.far)&&(a.updateRenderState({depthNear:$.near,depthFar:$.far}),C=$.near,Q=$.far),$.layers.mask=X.layers.mask|6,F.layers.mask=$.layers.mask&-5,B.layers.mask=$.layers.mask&-3;const Pe=X.parent,ve=$.cameras;Y($,Pe);for(let Oe=0;Oe<ve.length;Oe++)Y(ve[Oe],Pe);$.projectionMatrix.copy(F.projectionMatrix),$.projectionMatrixInverse.copy(F.projectionMatrixInverse),W===null&&X.isPerspectiveCamera&&(W={camera:X,fov:X.fov,zoom:X.zoom}),ee(X,$,Pe)};function ee(X,_e,xe){xe===null?X.matrix.copy(_e.matrixWorld):(X.matrix.copy(xe.matrixWorld),X.matrix.invert(),X.matrix.multiply(_e.matrixWorld)),X.matrix.decompose(X.position,X.quaternion,X.scale),X.updateMatrixWorld(!0),X.projectionMatrix.copy(_e.projectionMatrix),X.projectionMatrixInverse.copy(_e.projectionMatrixInverse),X.isPerspectiveCamera&&(X.fov=wo*2*Math.atan(1/X.projectionMatrix.elements[5]),X.zoom=1)}this.getCamera=function(){return $},this.getFoveation=function(){if(!(v===null&&_===null))return p},this.setFoveation=function(X){p=X,v!==null&&(v.fixedFoveation=X),_!==null&&_.fixedFoveation!==void 0&&(_.fixedFoveation=X)},this.hasDepthSensing=function(){return h.texture!==null},this.getDepthSensingMesh=function(){return h.getMesh($)},this.getCameraTexture=function(X){return u[X]};let re=null;function we(X,_e){if(m=_e.getViewerPose(d||o),R=_e,m!==null){const xe=m.views;_!==null&&(n.setRenderTargetFramebuffer(T,_.framebuffer),n.setRenderTarget(T));let Pe=!1;xe.length!==$.cameras.length&&($.cameras.length=0,Pe=!0);for(let Ce=0;Ce<xe.length;Ce++){const Qe=xe[Ce];let Ke=null;if(_!==null)Ke=_.getViewport(Qe);else{const gt=g.getViewSubImage(v,Qe);Ke=gt.viewport,Ce===0&&(n.setRenderTargetTextures(T,gt.colorTexture,gt.depthStencilTexture),n.setRenderTarget(T))}let Be=K[Ce];Be===void 0&&(Be=new ni,Be.layers.enable(Ce),Be.viewport=new Lt,K[Ce]=Be),Be.matrix.fromArray(Qe.transform.matrix),Be.matrix.decompose(Be.position,Be.quaternion,Be.scale),Be.projectionMatrix.fromArray(Qe.projectionMatrix),Be.projectionMatrixInverse.copy(Be.projectionMatrix).invert(),Be.viewport.set(Ke.x,Ke.y,Ke.width,Ke.height),Ce===0&&($.matrix.copy(Be.matrix),$.matrix.decompose($.position,$.quaternion,$.scale)),Pe===!0&&$.cameras.push(Be)}const ve=a.enabledFeatures;if(ve&&ve.includes("depth-sensing")&&a.depthUsage=="gpu-optimized"&&L){g=i.getBinding();const Ce=g.getDepthInformation(xe[0]);Ce&&Ce.isValid&&Ce.texture&&h.init(Ce,a.renderState)}if(ve&&ve.includes("camera-access")&&L){n.state.unbindTexture(),g=i.getBinding();for(let Ce=0;Ce<xe.length;Ce++){const Qe=xe[Ce].camera;if(Qe){let Ke=u[Qe];Ke||(Ke=new ur,u[Qe]=Ke);const Be=g.getCameraImage(Qe);Ke.sourceTexture=Be}}}}for(let xe=0;xe<D.length;xe++){const Pe=w[xe],ve=D[xe];Pe!==null&&ve!==void 0&&ve.update(Pe,_e,d||o)}re&&re(X,_e),_e.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:_e}),R=null}const Fe=new Pr;Fe.setAnimationLoop(we),this.setAnimationLoop=function(X){re=X},this.dispose=function(){}}}const bu=new mn,Br=new Ve;Br.set(-1,0,0,0,1,0,0,0,1);function Au(e,n){function t(h,u){h.matrixAutoUpdate===!0&&h.updateMatrix(),u.value.copy(h.matrix)}function i(h,u){u.color.getRGB(h.fogColor.value,fr(e)),u.isFog?(h.fogNear.value=u.near,h.fogFar.value=u.far):u.isFogExp2&&(h.fogDensity.value=u.density)}function a(h,u,M,b,T){u.isNodeMaterial?u.uniformsNeedUpdate=!1:u.isMeshBasicMaterial?r(h,u):u.isMeshLambertMaterial?(r(h,u),u.envMap&&(h.envMapIntensity.value=u.envMapIntensity)):u.isMeshToonMaterial?(r(h,u),g(h,u)):u.isMeshPhongMaterial?(r(h,u),m(h,u),u.envMap&&(h.envMapIntensity.value=u.envMapIntensity)):u.isMeshStandardMaterial?(r(h,u),v(h,u),u.isMeshPhysicalMaterial&&_(h,u,T)):u.isMeshMatcapMaterial?(r(h,u),R(h,u)):u.isMeshDepthMaterial?r(h,u):u.isMeshDistanceMaterial?(r(h,u),L(h,u)):u.isMeshNormalMaterial?r(h,u):u.isLineBasicMaterial?(o(h,u),u.isLineDashedMaterial&&s(h,u)):u.isPointsMaterial?p(h,u,M,b):u.isSpriteMaterial?d(h,u):u.isShadowMaterial?(h.color.value.copy(u.color),h.opacity.value=u.opacity):u.isShaderMaterial&&(u.uniformsNeedUpdate=!1)}function r(h,u){h.opacity.value=u.opacity,u.color&&h.diffuse.value.copy(u.color),u.emissive&&h.emissive.value.copy(u.emissive).multiplyScalar(u.emissiveIntensity),u.map&&(h.map.value=u.map,t(u.map,h.mapTransform)),u.alphaMap&&(h.alphaMap.value=u.alphaMap,t(u.alphaMap,h.alphaMapTransform)),u.bumpMap&&(h.bumpMap.value=u.bumpMap,t(u.bumpMap,h.bumpMapTransform),h.bumpScale.value=u.bumpScale,u.side===Dt&&(h.bumpScale.value*=-1)),u.normalMap&&(h.normalMap.value=u.normalMap,t(u.normalMap,h.normalMapTransform),h.normalScale.value.copy(u.normalScale),u.side===Dt&&h.normalScale.value.negate()),u.displacementMap&&(h.displacementMap.value=u.displacementMap,t(u.displacementMap,h.displacementMapTransform),h.displacementScale.value=u.displacementScale,h.displacementBias.value=u.displacementBias),u.emissiveMap&&(h.emissiveMap.value=u.emissiveMap,t(u.emissiveMap,h.emissiveMapTransform)),u.specularMap&&(h.specularMap.value=u.specularMap,t(u.specularMap,h.specularMapTransform)),u.alphaTest>0&&(h.alphaTest.value=u.alphaTest);const M=n.get(u),b=M.envMap,T=M.envMapRotation;b&&(h.envMap.value=b,h.envMapRotation.value.setFromMatrix4(bu.makeRotationFromEuler(T)).transpose(),b.isCubeTexture&&b.isRenderTargetTexture===!1&&h.envMapRotation.value.premultiply(Br),h.reflectivity.value=u.reflectivity,h.ior.value=u.ior,h.refractionRatio.value=u.refractionRatio),u.lightMap&&(h.lightMap.value=u.lightMap,h.lightMapIntensity.value=u.lightMapIntensity,t(u.lightMap,h.lightMapTransform)),u.aoMap&&(h.aoMap.value=u.aoMap,h.aoMapIntensity.value=u.aoMapIntensity,t(u.aoMap,h.aoMapTransform))}function o(h,u){h.diffuse.value.copy(u.color),h.opacity.value=u.opacity,u.map&&(h.map.value=u.map,t(u.map,h.mapTransform))}function s(h,u){h.dashSize.value=u.dashSize,h.totalSize.value=u.dashSize+u.gapSize,h.scale.value=u.scale}function p(h,u,M,b){h.diffuse.value.copy(u.color),h.opacity.value=u.opacity,h.size.value=u.size*M,h.scale.value=b*.5,u.map&&(h.map.value=u.map,t(u.map,h.uvTransform)),u.alphaMap&&(h.alphaMap.value=u.alphaMap,t(u.alphaMap,h.alphaMapTransform)),u.alphaTest>0&&(h.alphaTest.value=u.alphaTest)}function d(h,u){h.diffuse.value.copy(u.color),h.opacity.value=u.opacity,h.rotation.value=u.rotation,u.map&&(h.map.value=u.map,t(u.map,h.mapTransform)),u.alphaMap&&(h.alphaMap.value=u.alphaMap,t(u.alphaMap,h.alphaMapTransform)),u.alphaTest>0&&(h.alphaTest.value=u.alphaTest)}function m(h,u){h.specular.value.copy(u.specular),h.shininess.value=Math.max(u.shininess,1e-4)}function g(h,u){u.gradientMap&&(h.gradientMap.value=u.gradientMap)}function v(h,u){h.metalness.value=u.metalness,u.metalnessMap&&(h.metalnessMap.value=u.metalnessMap,t(u.metalnessMap,h.metalnessMapTransform)),h.roughness.value=u.roughness,u.roughnessMap&&(h.roughnessMap.value=u.roughnessMap,t(u.roughnessMap,h.roughnessMapTransform)),u.envMap&&(h.envMapIntensity.value=u.envMapIntensity)}function _(h,u,M){h.ior.value=u.ior,u.diffuseRoughness>0&&(h.diffuseRoughness.value=u.diffuseRoughness,u.diffuseRoughnessMap&&(h.diffuseRoughnessMap.value=u.diffuseRoughnessMap,t(u.diffuseRoughnessMap,h.diffuseRoughnessMapTransform))),u.sheen>0&&(h.sheenColor.value.copy(u.sheenColor).multiplyScalar(u.sheen),h.sheenRoughness.value=u.sheenRoughness,u.sheenColorMap&&(h.sheenColorMap.value=u.sheenColorMap,t(u.sheenColorMap,h.sheenColorMapTransform)),u.sheenRoughnessMap&&(h.sheenRoughnessMap.value=u.sheenRoughnessMap,t(u.sheenRoughnessMap,h.sheenRoughnessMapTransform))),u.clearcoat>0&&(h.clearcoat.value=u.clearcoat,h.clearcoatRoughness.value=u.clearcoatRoughness,u.clearcoatMap&&(h.clearcoatMap.value=u.clearcoatMap,t(u.clearcoatMap,h.clearcoatMapTransform)),u.clearcoatRoughnessMap&&(h.clearcoatRoughnessMap.value=u.clearcoatRoughnessMap,t(u.clearcoatRoughnessMap,h.clearcoatRoughnessMapTransform)),u.clearcoatNormalMap&&(h.clearcoatNormalMap.value=u.clearcoatNormalMap,t(u.clearcoatNormalMap,h.clearcoatNormalMapTransform),h.clearcoatNormalScale.value.copy(u.clearcoatNormalScale),u.side===Dt&&h.clearcoatNormalScale.value.negate())),u.dispersion>0&&(h.dispersion.value=u.dispersion),u.retroreflectivity>0&&(h.retroreflectivity.value=u.retroreflectivity),u.iridescence>0&&(h.iridescence.value=u.iridescence,h.iridescenceIOR.value=u.iridescenceIOR,h.iridescenceThicknessMinimum.value=u.iridescenceThicknessMinimum,h.iridescenceThicknessMaximum.value=u.iridescenceThicknessMaximum,u.iridescenceMap&&(h.iridescenceMap.value=u.iridescenceMap,t(u.iridescenceMap,h.iridescenceMapTransform)),u.iridescenceThicknessMap&&(h.iridescenceThicknessMap.value=u.iridescenceThicknessMap,t(u.iridescenceThicknessMap,h.iridescenceThicknessMapTransform))),u.transmission>0&&(h.transmission.value=u.transmission,h.transmissionSamplerMap.value=M.texture,h.transmissionSamplerSize.value.set(M.width,M.height),u.transmissionMap&&(h.transmissionMap.value=u.transmissionMap,t(u.transmissionMap,h.transmissionMapTransform)),h.thickness.value=u.thickness,u.thicknessMap&&(h.thicknessMap.value=u.thicknessMap,t(u.thicknessMap,h.thicknessMapTransform)),h.attenuationDistance.value=u.attenuationDistance,h.attenuationColor.value.copy(u.attenuationColor)),u.anisotropy>0&&(h.anisotropyVector.value.set(u.anisotropy*Math.cos(u.anisotropyRotation),u.anisotropy*Math.sin(u.anisotropyRotation)),u.anisotropyMap&&(h.anisotropyMap.value=u.anisotropyMap,t(u.anisotropyMap,h.anisotropyMapTransform))),h.specularIntensity.value=u.specularIntensity,h.specularColor.value.copy(u.specularColor),u.specularColorMap&&(h.specularColorMap.value=u.specularColorMap,t(u.specularColorMap,h.specularColorMapTransform)),u.specularIntensityMap&&(h.specularIntensityMap.value=u.specularIntensityMap,t(u.specularIntensityMap,h.specularIntensityMapTransform))}function R(h,u){u.matcap&&(h.matcap.value=u.matcap)}function L(h,u){const M=n.get(u).light;h.referencePosition.value.setFromMatrixPosition(M.matrixWorld),h.nearDistance.value=M.shadow.camera.near,h.farDistance.value=M.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:a}}function Ru(e,n,t,i){let a={},r={};function o(M,b){const T=b.program;i.uniformBlockBinding(M,T,a[M.id])}function s(M,b){let T=a[M.id];T===void 0&&(R(M),T=p(M),a[M.id]=T,M.addEventListener("dispose",h));const D=b.program;i.updateUBOMapping(M,D);const w=n.render.frame;r[M.id]!==w&&(d(M),r[M.id]=w)}function p(M){const b=e.createBuffer(),T=M.__size,D=M.usage;return e.bindBuffer(e.UNIFORM_BUFFER,b),e.bufferData(e.UNIFORM_BUFFER,T,D),e.bindBuffer(e.UNIFORM_BUFFER,null),b}function d(M){const b=a[M.id],T=M.uniforms,D=M.__cache;e.bindBuffer(e.UNIFORM_BUFFER,b);for(let w=0,c=T.length;w<c;w++){const E=T[w];if(Array.isArray(E))for(let W=0,F=E.length;W<F;W++)m(E[W],w,W,D);else m(E,w,0,D)}e.bindBuffer(e.UNIFORM_BUFFER,null)}function m(M,b,T,D){if(v(M,b,T,D)===!0){const w=M.__offset,c=M.value;if(Array.isArray(c)){let E=0;for(let W=0;W<c.length;W++){const F=c[W],B=L(F,!0);g(F,M.__data,E),E+=B.storage/Float32Array.BYTES_PER_ELEMENT}}else g(c,M.__data,0);e.bufferSubData(e.UNIFORM_BUFFER,w,M.__data)}}function g(M,b,T){typeof M=="number"||typeof M=="boolean"?b[T]=M:M.isMatrix3?(b[T]=M.elements[0],b[T+1]=M.elements[1],b[T+2]=M.elements[2],b[T+3]=0,b[T+4]=M.elements[3],b[T+5]=M.elements[4],b[T+6]=M.elements[5],b[T+7]=0,b[T+8]=M.elements[6],b[T+9]=M.elements[7],b[T+10]=M.elements[8],b[T+11]=0):ArrayBuffer.isView(M)?b.set(M.subarray(0,b.length-T),T):M.toArray(b,T)}function v(M,b,T,D){const w=M.value,c=b+"_"+T;if(Array.isArray(w)){D[c]===void 0&&(D[c]=[]);const E=D[c];let W=!1;for(let F=0;F<w.length;F++)_(w[F],E,F)===!0&&(W=!0);return W}return _(w,D,c)}function _(M,b,T){if(b[T]===void 0)return typeof M=="number"||typeof M=="boolean"?b[T]=M:ArrayBuffer.isView(M)?b[T]=M.slice():b[T]=M.clone(),!0;{const D=b[T];if(typeof M=="number"||typeof M=="boolean"){if(D!==M)return b[T]=M,!0}else{if(ArrayBuffer.isView(M))return!0;if(D.equals(M)===!1)return D.copy(M),!0}}return!1}function R(M){const b=M.uniforms;let T=0;const D=16;for(let c=0,E=b.length;c<E;c++){const W=Array.isArray(b[c])?b[c]:[b[c]];for(let F=0,B=W.length;F<B;F++){const K=W[F],$=Array.isArray(K.value)?K.value:[K.value],C=Array.isArray(b[c])||Array.isArray(K.value);let Q=T;for(let N=0,ae=$.length;N<ae;N++){const Y=$[N],ee=L(Y,C),re=T%D,we=re%ee.boundary,Fe=re+we;T+=we,Fe!==0&&D-Fe<ee.storage&&(T+=D-Fe),N===0&&(Q=T),T+=ee.storage}const y=K.type==="int"?Int32Array:K.type==="uint"?Uint32Array:Float32Array;K.__data=new y((T-Q)/Float32Array.BYTES_PER_ELEMENT),K.__offset=Q}}const w=T%D;return w>0&&(T+=D-w),M.__size=T,M.__cache={},this}function L(M,b){const T={boundary:0,storage:0};return typeof M=="number"||typeof M=="boolean"?(T.boundary=4,T.storage=4):M.isVector2?(T.boundary=8,T.storage=8):M.isVector3||M.isColor?(T.boundary=16,T.storage=12):M.isVector4?(T.boundary=16,T.storage=16):M.isMatrix3?(T.boundary=16,T.storage=48):M.isMatrix4?(T.boundary=16,T.storage=64):M.isTexture?Xe("WebGLRenderer: Texture samplers can not be part of an uniforms group."):ArrayBuffer.isView(M)?(T.boundary=16,T.storage=M.byteLength):Xe("WebGLRenderer: Unsupported uniform value type.",M),b===!0&&(T.boundary=16,T.storage=Math.ceil(T.storage/16)*16),T}function h(M){const b=M.target;b.removeEventListener("dispose",h),e.deleteBuffer(a[b.id]),delete a[b.id],delete r[b.id]}function u(){for(const M in a)e.deleteBuffer(a[M]);a={},r={}}return{bind:o,update:s,dispose:u}}const wu=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]);let Ht=null;function Pu(){return Ht===null&&(Ht=new Po(wu,16,16,_n,Yt),Ht.name="DFG_LUT",Ht.minFilter=Bt,Ht.magFilter=Bt,Ht.wrapS=hi,Ht.wrapT=hi,Ht.generateMipmaps=!1,Ht.needsUpdate=!0),Ht}class Cu{constructor(n={}){const{canvas:t=Xr(),context:i=null,depth:a=!0,stencil:r=!1,alpha:o=!1,antialias:s=!1,premultipliedAlpha:p=!0,preserveDrawingBuffer:d=!1,powerPreference:m="default",failIfMajorPerformanceCaveat:g=!1,reversedDepthBuffer:v=!1,outputBufferType:_=kt}=n;this.isWebGLRenderer=!0;let R;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");R=i.getContextAttributes().alpha}else R=o;const L=_,h=new Set([rr,or,sr]),u=new Set([kt,sn,qn,vn,lr,cr]),M=new Uint32Array(4),b=new Int32Array(4),T={textures:[],min:[],max:[],resolution:[]};let D=null,w=null;const c=[],E=[];let W=null;this.domElement=t,this.debug={checkShaderErrors:!0,diagnostics:{keywords:!1},onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=Kt,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const F=this;let B=!1,K=null,$=null,C=null,Q=null;this._outputColorSpace=Mi;let y=0,N=0,ae=null,Y=-1,ee=null;const re=new Lt,we=new Lt;let Fe=null;const X=new qe(0);let _e=0,xe=t.width,Pe=t.height,ve=1,Oe=null,At=null;const Ce=new Lt(0,0,xe,Pe),Qe=new Lt(0,0,xe,Pe);let Ke=!1;const Be=new ja,gt=new Kr;let lt=!1,Rt=!1;const nt=new mn,Gt=new ie,ut=new Lt,yt={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let Ut=!1;function It(){return ae===null?ve:1}let P=i;function Nt(f,A){return t.getContext(f,A)}let je,Je,he,ct,Re,Le,S,l,I,j,q,oe,de,V,k,le,x,z,H,ce,ne,se,be;try{const f={alpha:!0,depth:a,stencil:r,antialias:s,premultipliedAlpha:p,preserveDrawingBuffer:d,powerPreference:m,failIfMajorPerformanceCaveat:g};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${qr}`),t.addEventListener("webglcontextlost",Ae,!1),t.addEventListener("webglcontextrestored",Ue,!1),t.addEventListener("webglcontextcreationerror",pe,!1),P===null){const A="webgl2";if(P=Nt(A,f),P===null)throw Nt(A)?new Error("THREE.WebGLRenderer: Error creating WebGL context with your selected attributes."):new Error("THREE.WebGLRenderer: Error creating WebGL context.")}Ie()}catch(f){throw t.removeEventListener("webglcontextlost",Ae,!1),t.removeEventListener("webglcontextrestored",Ue,!1),t.removeEventListener("webglcontextcreationerror",pe,!1),tt("WebGLRenderer: "+f.message),f}function Ie(){je=new yf(P),je.init(),ne=new Su(P,je),Je=new Mf(P,je,n,ne),he=new _u(P,je),Je.reversedDepthBuffer&&v&&he.buffers.depth.setReversed(!0),$=P.createFramebuffer(),C=P.createFramebuffer(),Q=P.createFramebuffer(),ct=new Nf(P),Re=new iu,Le=new vu(P,je,he,Re,Je,ne,ct),S=new Df(F),l=new Os(P),se=new Sf(P,l),I=new Uf(P,l,ct,se),j=new Ff(P,I,l,se,ct),z=new Of(P,Je,Le),k=new xf(Re),q=new nu(F,S,je,Je,se,k),oe=new Au(F,Re),de=new ru,V=new du(je),x=new vf(F,S,he,j,R,p),le=new gu(F,j,Je),be=new Ru(P,ct,Je,he),H=new Ef(P,je,ct),ce=new If(P,je,ct),ct.programs=q.programs,F.capabilities=Je,F.extensions=je,F.properties=Re,F.renderLists=de,F.shadowMap=le,F.state=he,F.info=ct}L!==kt&&(W=new Gf(L,t.width,t.height,s,a,r));const te=new Tu(F,P);this.xr=te,this.getContext=function(){return P},this.getContextAttributes=function(){return P.getContextAttributes()},this.forceContextLoss=function(){const f=je.get("WEBGL_lose_context");f&&f.loseContext()},this.forceContextRestore=function(){const f=je.get("WEBGL_lose_context");f&&f.restoreContext()},this.getPixelRatio=function(){return ve},this.setPixelRatio=function(f){f!==void 0&&(ve=f,this.setSize(xe,Pe,!1))},this.getSize=function(f){return f.set(xe,Pe)},this.setSize=function(f,A,G=!0){if(te.isPresenting){Xe("WebGLRenderer: Can't change size while VR device is presenting.");return}xe=f,Pe=A,t.width=Math.floor(f*ve),t.height=Math.floor(A*ve),G===!0&&(t.style.width=f+"px",t.style.height=A+"px"),W!==null&&W.setSize(t.width,t.height),this.setViewport(0,0,f,A)},this.getDrawingBufferSize=function(f){return f.set(xe*ve,Pe*ve).floor()},this.setDrawingBufferSize=function(f,A,G){xe=f,Pe=A,ve=G,t.width=Math.floor(f*G),t.height=Math.floor(A*G),this.setViewport(0,0,f,A)},this.setEffects=function(f){if(L===kt){tt("WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(f){for(let A=0;A<f.length;A++)if(f[A].isOutputPass===!0){Xe("WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}W.setEffects(f||[])},this.getCurrentViewport=function(f){return f.copy(re)},this.getViewport=function(f){return f.copy(Ce)},this.setViewport=function(f,A,G,U){f.isVector4?Ce.set(f.x,f.y,f.z,f.w):Ce.set(f,A,G,U),he.viewport(re.copy(Ce).multiplyScalar(It()).round())},this.getScissor=function(f){return f.copy(Qe)},this.setScissor=function(f,A,G,U){f.isVector4?Qe.set(f.x,f.y,f.z,f.w):Qe.set(f,A,G,U),he.scissor(we.copy(Qe).multiplyScalar(It()).round())},this.getScissorTest=function(){return Ke},this.setScissorTest=function(f){he.setScissorTest(Ke=f)},this.setOpaqueSort=function(f){Oe=f},this.setTransparentSort=function(f){At=f},this.getClearColor=function(f){return f.copy(x.getClearColor())},this.setClearColor=function(){x.setClearColor(...arguments)},this.getClearAlpha=function(){return x.getClearAlpha()},this.setClearAlpha=function(){x.setClearAlpha(...arguments)},this.clear=function(f=!0,A=!0,G=!0){let U=0;if(f){let O=!1;if(ae!==null){const ue=ae.texture.format;O=h.has(ue)}if(O){const ue=ae.texture.type,Se=u.has(ue),fe=x.getClearColor(),ge=x.getClearAlpha(),Te=fe.r,De=fe.g,Ge=fe.b;Se?(M[0]=Te,M[1]=De,M[2]=Ge,M[3]=ge,P.clearBufferuiv(P.COLOR,0,M)):(b[0]=Te,b[1]=De,b[2]=Ge,b[3]=ge,P.clearBufferiv(P.COLOR,0,b))}else U|=P.COLOR_BUFFER_BIT}A&&(U|=P.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),G&&(U|=P.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),U!==0&&P.clear(U)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(f){f.setRenderer(this),K=f},this.dispose=function(){t.removeEventListener("webglcontextlost",Ae,!1),t.removeEventListener("webglcontextrestored",Ue,!1),t.removeEventListener("webglcontextcreationerror",pe,!1),x.dispose(),de.dispose(),V.dispose(),Le.dispose(),Re.dispose(),S.dispose(),j.dispose(),I.dispose(),se.dispose(),be.dispose(),q.dispose(),te.dispose(),te.removeEventListener("sessionstart",wi),te.removeEventListener("sessionend",Pi),Jt.stop()};function Ae(f){f.preventDefault(),Fi("WebGLRenderer: Context Lost."),B=!0}function Ue(){Fi("WebGLRenderer: Context Restored."),B=!1;const f=ct.autoReset,A=le.enabled,G=le.autoUpdate,U=le.needsUpdate,O=le.type;Ie(),ct.autoReset=f,le.enabled=A,le.autoUpdate=G,le.needsUpdate=U,le.type=O}function pe(f){tt("WebGLRenderer: A WebGL context could not be created. Reason: ",f.statusMessage)}function We(f){const A=f.target;A.removeEventListener("dispose",We),ht(A)}function ht(f){$t(f),Re.remove(f)}function $t(f){const A=Re.get(f).programs;A!==void 0&&(A.forEach(function(G){q.releaseProgram(G)}),f.isShaderMaterial&&q.releaseShaderCache(f))}this.renderBufferDirect=function(f,A,G,U,O,ue){A===null&&(A=yt);const Se=O.isMesh&&O.matrixWorld.determinantAffine()<0,fe=kr(f,A,G,U,O);he.setMaterial(U,Se);let ge=G.index,Te=1;if(U.wireframe===!0){if(ge=I.getWireframeAttribute(G),ge===void 0)return;Te=2}const De=G.drawRange,Ge=G.attributes.position;let Ee=De.start*Te,He=(De.start+De.count)*Te;ue!==null&&(Ee=Math.max(Ee,ue.start*Te),He=Math.min(He,(ue.start+ue.count)*Te)),ge!==null?(Ee=Math.max(Ee,0),He=Math.min(He,ge.count)):Ge!=null&&(Ee=Math.max(Ee,0),He=Math.min(He,Ge.count));const st=He-Ee;if(st<0||st===1/0)return;se.setup(O,U,fe,G,ge);let $e,Ye=H;if(ge!==null&&($e=l.get(ge),Ye=ce,Ye.setIndex($e)),O.isMesh)U.wireframe===!0?(he.setLineWidth(U.wireframeLinewidth*It()),Ye.setMode(P.LINES)):Ye.setMode(P.TRIANGLES);else if(O.isLine){let St=U.linewidth;St===void 0&&(St=1),he.setLineWidth(St*It()),O.isLineSegments?Ye.setMode(P.LINES):O.isLineLoop?Ye.setMode(P.LINE_LOOP):Ye.setMode(P.LINE_STRIP)}else O.isPoints?Ye.setMode(P.POINTS):O.isSprite&&Ye.setMode(P.TRIANGLES);if(O.isBatchedMesh)if(je.get("WEBGL_multi_draw"))Ye.renderMultiDraw(O._multiDrawStarts,O._multiDrawCounts,O._multiDrawCount);else{const St=O._multiDrawStarts,Me=O._multiDrawCounts,Tt=O._multiDrawCount,ze=ge?l.get(ge).bytesPerElement:1,en=Re.get(U).currentProgram.getUniforms();for(let Et=0;Et<Tt;Et++)en.setValue(P,"_gl_DrawID",Et),Ye.render(St[Et]/ze,Me[Et])}else if(O.isInstancedMesh)Ye.renderInstances(Ee,st,O.count);else if(G.isInstancedBufferGeometry){const St=G._maxInstanceCount!==void 0?G._maxInstanceCount:1/0,Me=Math.min(G.instanceCount,St);Ye.renderInstances(Ee,st,Me)}else Ye.render(Ee,st)};function Ri(f,A,G,U){K!==null&&f.isNodeMaterial&&K.setObject(U,f),lt===!0&&k.setState(f,G,!1),f.transparent===!0&&f.side===vt&&f.forceSinglePass===!1?(f.side=Dt,f.needsUpdate=!0,En(f,A,U),f.side=Ln,f.needsUpdate=!0,En(f,A,U),f.side=vt):En(f,A,U)}this.compile=function(f,A,G=null){G===null&&(G=f),K!==null&&K.renderStart(f,A,G),w=V.get(G),w.init(A),E.push(w),G.traverseVisible(function(O){O.isLight&&O.layers.test(A.layers)&&(w.pushLight(O),O.castShadow&&w.pushShadow(O))}),f!==G&&f.traverseVisible(function(O){O.isLight&&O.layers.test(A.layers)&&(w.pushLight(O),O.castShadow&&w.pushShadow(O))}),w.setupLights(),K!==null&&K.updateLights(w.state.lightsArray),Rt=this.localClippingEnabled,lt=k.init(this.clippingPlanes,Rt),lt===!0&&k.setGlobalState(this.clippingPlanes,A),K!==null&&le.render(w.state.shadowsArray,G,A);const U=new Set;return f.traverse(function(O){if(!(O.isMesh||O.isPoints||O.isLine||O.isSprite))return;const ue=O.material;if(ue)if(Array.isArray(ue))for(let Se=0;Se<ue.length;Se++){const fe=ue[Se];Ri(fe,G,A,O),U.add(fe)}else Ri(ue,G,A,O),U.add(ue)}),w=E.pop(),K!==null&&K.renderEnd(),U},this.compileAsync=function(f,A,G=null){const U=this.compile(f,A,G);return new Promise(O=>{function ue(){if(U.forEach(function(Se){const ge=Re.get(Se).currentProgram;(ge===void 0||ge.isReady())&&U.delete(Se)}),U.size===0){O(f);return}setTimeout(ue,10)}je.get("KHR_parallel_shader_compile")!==null?ue():setTimeout(ue,10)})};let Jn=null;function Hr(f){Jn&&Jn(f)}function wi(){Jt.stop()}function Pi(){Jt.start()}const Jt=new Pr;Jt.setAnimationLoop(Hr),typeof self<"u"&&Jt.setContext(self),this.setAnimationLoop=function(f){Jn=f,te.setAnimationLoop(f),f===null?Jt.stop():Jt.start()},te.addEventListener("sessionstart",wi),te.addEventListener("sessionend",Pi),this.render=function(f,A){if(A!==void 0&&A.isCamera!==!0){tt("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(B===!0)return;K!==null&&K.renderStart(f,A);const G=te.enabled===!0&&te.isPresenting===!0,U=W!==null&&(ae===null||G)&&W.begin(F,ae);if(f.matrixWorldAutoUpdate===!0&&f.updateMatrixWorld(),A.parent===null&&A.matrixWorldAutoUpdate===!0&&A.updateMatrixWorld(),te.enabled===!0&&te.isPresenting===!0&&(W===null||W.isCompositing()===!1)&&(te.cameraAutoUpdate===!0&&te.updateCamera(A),A=te.getCamera()),f.isScene===!0&&f.onBeforeRender(F,f,A,ae),w=V.get(f,E.length),w.init(A),w.state.textureUnits=Le.getTextureUnits(),E.push(w),nt.multiplyMatrices(A.projectionMatrix,A.matrixWorldInverse),A.isArrayCamera?gt.setFromArrayCamera(A):Be.setFromProjectionMatrix(nt,Bi,A.reversedDepth),Rt=this.localClippingEnabled,lt=k.init(this.clippingPlanes,Rt),D=de.get(f,c.length),D.init(),c.push(D),this.info.render.frame++,te.enabled===!0&&te.isPresenting===!0){const Se=F.xr.getDepthSensingMesh();Se!==null&&ei(Se,A,-1/0,F.sortObjects)}ei(f,A,0,F.sortObjects),D.finish(),K!==null&&K.updateLights(w.state.lightsArray),F.sortObjects===!0&&D.sort(Oe,At),Ut=te.enabled===!1||te.isPresenting===!1||te.hasDepthSensing()===!1,Ut&&x.addToRenderList(D,f),this.info.autoReset===!0&&this.info.reset(),lt===!0&&k.beginShadows();const O=w.state.shadowsArray;if(le.render(O,f,A),lt===!0&&k.endShadows(),(U&&W.hasRenderPass())===!1){const Se=D.opaque,fe=D.transmissive;if(w.setupLights(),A.isArrayCamera){const ge=A.cameras;if(fe.length>0)for(let Te=0,De=ge.length;Te<De;Te++){const Ge=ge[Te];Li(Se,fe,f,Ge)}Ut&&x.render(f);for(let Te=0,De=ge.length;Te<De;Te++){const Ge=ge[Te];Ci(D,f,Ge,Ge.viewport)}}else fe.length>0&&Li(Se,fe,f,A),Ut&&x.render(f),Ci(D,f,A)}ae!==null&&N===0&&(Le.updateMultisampleRenderTarget(ae),Le.updateRenderTargetMipmap(ae)),U&&W.end(F),f.isScene===!0&&f.onAfterRender(F,f,A),se.resetDefaultState(),Y=-1,ee=null,E.pop(),E.length>0?(w=E[E.length-1],Le.setTextureUnits(w.state.textureUnits),lt===!0&&k.setGlobalState(F.clippingPlanes,w.state.camera)):w=null,c.pop(),c.length>0?D=c[c.length-1]:D=null,K!==null&&K.renderEnd()};function ei(f,A,G,U){if(f.visible===!1)return;if(f.layers.test(A.layers)){if(f.isGroup)G=f.renderOrder;else if(f.isLOD)f.autoUpdate===!0&&f.update(A);else if(f.isLight)w.pushLight(f),f.castShadow&&w.pushShadow(f);else if(f.isSprite){const Se=A.isArrayCamera?gt:Be;if(!f.frustumCulled||f.intersectsFrustum(Se)){U&&ut.setFromMatrixPosition(f.matrixWorld).applyMatrix4(nt);const fe=j.update(f),ge=f.material;ge.visible&&D.push(f,fe,ge,G,ut.z,null,A)}}else if(f.isMesh||f.isLine||f.isPoints){const Se=A.isArrayCamera?gt:Be;if(!f.frustumCulled||f.intersectsFrustum(Se)){const fe=j.update(f),ge=f.material;if(U&&(f.boundingSphere!==void 0?(f.boundingSphere===null&&f.computeBoundingSphere(),ut.copy(f.boundingSphere.center)):(fe.boundingSphere===null&&fe.computeBoundingSphere(),ut.copy(fe.boundingSphere.center)),ut.applyMatrix4(f.matrixWorld).applyMatrix4(nt)),Array.isArray(ge)){const Te=fe.groups;for(let De=0,Ge=Te.length;De<Ge;De++){const Ee=Te[De],He=ge[Ee.materialIndex];He&&He.visible&&D.push(f,fe,He,G,ut.z,Ee,A)}}else ge.visible&&D.push(f,fe,ge,G,ut.z,null,A)}}}const ue=f.children;for(let Se=0,fe=ue.length;Se<fe;Se++)ei(ue[Se],A,G,U)}function Ci(f,A,G,U){const{opaque:O,transmissive:ue,transparent:Se}=f;w.setupLightsView(G),lt===!0&&k.setGlobalState(F.clippingPlanes,G),U&&he.viewport(re.copy(U)),O.length>0&&Nn(O,A,G),ue.length>0&&Nn(ue,A,G),Se.length>0&&Nn(Se,A,G),he.buffers.depth.setTest(!0),he.buffers.depth.setMask(!0),he.buffers.color.setMask(!0),he.setPolygonOffset(!1)}function Li(f,A,G,U){if((G.isScene===!0?G.overrideMaterial:null)!==null)return;if(w.state.transmissionRenderTarget[U.id]===void 0){const Ee=je.has("EXT_color_buffer_half_float")||je.has("EXT_color_buffer_float");w.state.transmissionRenderTarget[U.id]=new zt(1,1,{generateMipmaps:!0,type:Ee?Yt:kt,minFilter:an,samples:Math.max(4,Je.samples),stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,colorSpace:rt.workingColorSpace})}const ue=w.state.transmissionRenderTarget[U.id],Se=U.viewport||re;ue.setSize(Se.z*F.transmissionResolutionScale,Se.w*F.transmissionResolutionScale);const fe=F.getRenderTarget(),ge=F.getActiveCubeFace(),Te=F.getActiveMipmapLevel();F.setRenderTarget(ue),F.getClearColor(X),_e=F.getClearAlpha(),_e<1&&F.setClearColor(16777215,.5),F.clear(),Ut&&x.render(G);const De=F.toneMapping;F.toneMapping=Kt;const Ge=U.viewport;if(U.viewport!==void 0&&(U.viewport=void 0),w.setupLightsView(U),lt===!0&&k.setGlobalState(F.clippingPlanes,U),Nn(f,G,U),Le.updateMultisampleRenderTarget(ue),Le.updateRenderTargetMipmap(ue),je.has("WEBGL_multisampled_render_to_texture")===!1){let Ee=!1;for(let He=0,st=A.length;He<st;He++){const $e=A[He],{object:Ye,geometry:St,material:Me,group:Tt}=$e;if(Me.side===vt&&Ye.layers.test(U.layers)){const ze=Me.side;Me.side=Dt,Me.needsUpdate=!0,Di(Ye,G,U,St,Me,Tt),Me.side=ze,Me.needsUpdate=!0,Ee=!0}}Ee===!0&&(Le.updateMultisampleRenderTarget(ue),Le.updateRenderTargetMipmap(ue))}F.setRenderTarget(fe,ge,Te),F.setClearColor(X,_e),Ge!==void 0&&(U.viewport=Ge),F.toneMapping=De}function Nn(f,A,G){const U=A.isScene===!0?A.overrideMaterial:null;for(let O=0,ue=f.length;O<ue;O++){const Se=f[O],{object:fe,geometry:ge,group:Te}=Se;let De=Se.material;De.allowOverride===!0&&U!==null&&(De=U),fe.layers.test(G.layers)&&Di(fe,A,G,ge,De,Te)}}function Di(f,A,G,U,O,ue){K!==null&&O.isNodeMaterial&&K.setObject(f,O),f.onBeforeRender(F,A,G,U,O,ue),f.modelViewMatrix.multiplyMatrices(G.matrixWorldInverse,f.matrixWorld),f.normalMatrix.getNormalMatrix(f.modelViewMatrix),O.onBeforeRender(F,A,G,U,f,ue),O.transparent===!0&&O.side===vt&&O.forceSinglePass===!1?(O.side=Dt,O.needsUpdate=!0,F.renderBufferDirect(G,A,U,O,f,ue),O.side=Ln,O.needsUpdate=!0,F.renderBufferDirect(G,A,U,O,f,ue),O.side=vt):F.renderBufferDirect(G,A,U,O,f,ue),f.onAfterRender(F,A,G,U,O,ue)}function yi(f){let A=0;for(const G of f)G.texture!==null&&A++;return A}function En(f,A,G){A.isScene!==!0&&(A=yt);const U=Re.get(f),O=w.state.lights,ue=w.state.shadowsArray,Se=O.state.version,fe=q.getParameters(f,O.state,ue,A,G,w.state.lightProbeGridArray),ge=q.getProgramCacheKey(fe);let Te=U.programs;U.environment=f.isMeshStandardMaterial||f.isMeshLambertMaterial||f.isMeshPhongMaterial?A.environment:null,U.fog=A.fog;const De=f.isMeshStandardMaterial||f.isMeshLambertMaterial&&!f.envMap||f.isMeshPhongMaterial&&!f.envMap;U.envMap=S.get(f.envMap||U.environment,De),U.envMapRotation=U.environment!==null&&f.envMap===null?A.environmentRotation:f.envMapRotation,Te===void 0&&(f.addEventListener("dispose",We),Te=new Map,U.programs=Te,U.programVariants=new Map);let Ge=Te.get(ge);if(Ge!==void 0){if(U.currentProgram===Ge&&U.lightsStateVersion===Se)return Ii(f,fe),Ge}else fe.uniforms=q.getUniforms(f),K!==null&&f.isNodeMaterial&&K.build(f,G,fe),f.onBeforeCompile(fe,F),Ge=q.acquireProgram(fe,ge),Te.set(ge,Ge),U.uniforms=fe.uniforms;const Ee=U.uniforms;return(!f.isShaderMaterial&&!f.isRawShaderMaterial||f.clipping===!0)&&(Ee.clippingPlanes=k.uniform),Ii(f,fe),U.needsLights=Wr(f),U.lightsStateVersion=Se,U.needsLights&&(Ee.ambientLightColor.value=O.state.ambient,Ee.lightProbe.value=O.state.probe,Ee.sunLights.value=O.state.sun,Ee.sunLightShadows.value=O.state.sunShadow,Ee.directionalLights.value=O.state.directional,Ee.directionalLightShadows.value=O.state.directionalShadow,Ee.spotLights.value=O.state.spot,Ee.spotLightShadows.value=O.state.spotShadow,Ee.rectAreaLights.value=O.state.rectArea,Ee.ltc_1.value=O.state.rectAreaLTC1,Ee.ltc_2.value=O.state.rectAreaLTC2,Ee.pointLights.value=O.state.point,Ee.pointLightShadows.value=O.state.pointShadow,Ee.hemisphereLights.value=O.state.hemi,Ee.sunShadowMatrix.value=O.state.sunShadowMatrix,Ee.sunShadowCascade.value=O.state.sunShadowCascade,Ee.directionalShadowMatrix.value=O.state.directionalShadowMatrix,Ee.spotLightMatrix.value=O.state.spotLightMatrix,Ee.spotLightMap.value=O.state.spotLightMap,Ee.pointShadowMatrix.value=O.state.pointShadowMatrix),U.numLightProbeGrids=yi(w.state.lightProbeGridArray),U.currentProgram=Ge,U.uniformsList=null,Ge}function Vr(f,A,G,U,O){const ue=Re.get(f),Se=ue.currentProgram.id+","+U+","+O;let fe=ue.programVariants.get(Se);return fe===void 0?(fe=En(f,A,G),ue.programVariants.set(Se,fe)):(ue.currentProgram=fe,ue.uniformsList=null,ue.outputColorSpace=U,ue.toneMapping=O),fe}function Ui(f){if(f.uniformsList===null){const A=f.currentProgram.getUniforms();f.uniformsList=Wn.seqWithValue(A.seq,f.uniforms)}return f.uniformsList}function Ii(f,A){const G=Re.get(f);G.outputColorSpace=A.outputColorSpace,G.batching=A.batching,G.batchingColor=A.batchingColor,G.instancing=A.instancing,G.instancingColor=A.instancingColor,G.instancingMorph=A.instancingMorph,G.skinning=A.skinning,G.morphTargets=A.morphTargets,G.morphNormals=A.morphNormals,G.morphColors=A.morphColors,G.morphTargetsCount=A.morphTargetsCount,G.numClippingPlanes=A.numClippingPlanes,G.numIntersection=A.numClipIntersection,G.vertexAlphas=A.vertexAlphas,G.vertexTangents=A.vertexTangents,G.toneMapping=A.toneMapping}function kr(f,A,G,U,O){A.isScene!==!0&&(A=yt),Le.resetTextureUnits();const ue=A.fog,Se=U.isMeshStandardMaterial||U.isMeshLambertMaterial||U.isMeshPhongMaterial?A.environment:null,fe=ae===null?F.outputColorSpace:ae.isXRRenderTarget===!0?ae.texture.colorSpace:rt.workingColorSpace,ge=U.isMeshStandardMaterial||U.isMeshLambertMaterial&&!U.envMap||U.isMeshPhongMaterial&&!U.envMap,Te=S.get(U.envMap||Se,ge),De=U.vertexColors===!0&&!!G.attributes.color&&G.attributes.color.itemSize===4,Ge=!!G.attributes.tangent&&(!!U.normalMap||U.anisotropy>0),Ee=!!G.morphAttributes.position,He=!!G.morphAttributes.normal,st=!!G.morphAttributes.color;let $e=Kt;U.toneMapped&&(ae===null||ae.isXRRenderTarget===!0)&&($e=F.toneMapping);const Ye=G.morphAttributes.position||G.morphAttributes.normal||G.morphAttributes.color,St=Ye!==void 0?Ye.length:0,Me=Re.get(U),Tt=w.state.lights;if(lt===!0&&(Rt===!0||f!==ee)){const it=f===ee&&U.id===Y;k.setState(U,f,it)}let ze=!1,en=!1;U.version===Me.__version?Me.needsLights&&Me.lightsStateVersion!==Tt.state.version||O.isBatchedMesh&&Me.batching===!1||!O.isBatchedMesh&&Me.batching===!0||O.isBatchedMesh&&Me.batchingColor===!0&&O._colorsTexture===null||O.isBatchedMesh&&Me.batchingColor===!1&&O._colorsTexture!==null||O.isInstancedMesh&&Me.instancing===!1||!O.isInstancedMesh&&Me.instancing===!0||O.isSkinnedMesh&&Me.skinning===!1||!O.isSkinnedMesh&&Me.skinning===!0||O.isInstancedMesh&&Me.instancingColor===!0&&O.instanceColor===null||O.isInstancedMesh&&Me.instancingColor===!1&&O.instanceColor!==null||O.isInstancedMesh&&Me.instancingMorph===!0&&O.morphTexture===null||O.isInstancedMesh&&Me.instancingMorph===!1&&O.morphTexture!==null||Me.envMap!==Te||U.fog===!0&&Me.fog!==ue||Me.numClippingPlanes!==void 0&&(Me.numClippingPlanes!==k.numPlanes||Me.numIntersection!==k.numIntersection)||Me.vertexAlphas!==De||Me.vertexTangents!==Ge||Me.morphTargets!==Ee||Me.morphNormals!==He||Me.morphColors!==st||Me.morphTargetsCount!==St||Me.numLightProbeGrids!==yi(w.state.lightProbeGridArray)?ze=!0:(Me.outputColorSpace!==fe||Me.toneMapping!==$e)&&(en=!0):(ze=!0,Me.__version=U.version);let Et=Me.currentProgram;(ze===!0||en===!0)&&(Et=en===!0?Vr(U,A,O,fe,$e):En(U,A,O),K&&U.isNodeMaterial&&K.onUpdateProgram(U,Et,Me));let On=!1,Zt=!1,tn=!1;const ke=Et.getUniforms(),_t=Me.uniforms;if(he.useProgram(Et.program)&&(On=!0,Zt=!0,tn=!0),U.id!==Y&&(Y=U.id,Zt=!0),On||ee!==f){he.buffers.depth.getReversed()&&f.reversedDepth!==!0&&(f._reversedDepth=!0,f.updateProjectionMatrix()),ke.setValue(P,"projectionMatrix",f.projectionMatrix),ke.setValue(P,"viewMatrix",f.matrixWorldInverse);const pt=ke.map.cameraPosition;pt!==void 0&&pt.setValue(P,Gt.setFromMatrixPosition(f.matrixWorld)),Je.logarithmicDepthBuffer&&ke.setValue(P,"logDepthBufFC",2/(Math.log(f.far+1)/Math.LN2)),(U.isMeshPhongMaterial||U.isMeshToonMaterial||U.isMeshLambertMaterial||U.isMeshBasicMaterial||U.isMeshStandardMaterial||U.isShaderMaterial)&&ke.setValue(P,"isOrthographic",f.isOrthographicCamera===!0),ee!==f&&(ee=f,Zt=!0,tn=!0)}if(Me.needsLights&&(Tt.state.sunShadowMap.length>0&&ke.setValue(P,"sunShadowMap",Tt.state.sunShadowMap,Le),Tt.state.directionalShadowMap.length>0&&ke.setValue(P,"directionalShadowMap",Tt.state.directionalShadowMap,Le),Tt.state.spotShadowMap.length>0&&ke.setValue(P,"spotShadowMap",Tt.state.spotShadowMap,Le),Tt.state.pointShadowMap.length>0&&ke.setValue(P,"pointShadowMap",Tt.state.pointShadowMap,Le)),O.isSkinnedMesh){ke.setOptional(P,O,"bindMatrix"),ke.setOptional(P,O,"bindMatrixInverse");const it=O.skeleton;it&&(it.boneTexture===null&&it.computeBoneTexture(),ke.setValue(P,"boneTexture",it.boneTexture,Le))}O.isBatchedMesh&&(ke.setOptional(P,O,"batchingTexture"),ke.setValue(P,"batchingTexture",O._matricesTexture,Le),ke.setOptional(P,O,"batchingIdTexture"),ke.setValue(P,"batchingIdTexture",O._indirectTexture,Le),ke.setOptional(P,O,"batchingColorTexture"),O._colorsTexture!==null&&ke.setValue(P,"batchingColorTexture",O._colorsTexture,Le));const Ft=G.morphAttributes;if((Ft.position!==void 0||Ft.normal!==void 0||Ft.color!==void 0)&&z.update(O,G,Et),(Zt||Me.receiveShadow!==O.receiveShadow)&&(Me.receiveShadow=O.receiveShadow,ke.setValue(P,"receiveShadow",O.receiveShadow)),(U.isMeshStandardMaterial||U.isMeshLambertMaterial||U.isMeshPhongMaterial)&&U.envMap===null&&A.environment!==null&&(_t.envMapIntensity.value=A.environmentIntensity),_t.dfgLUT!==void 0&&(_t.dfgLUT.value=Pu()),Zt){if(ke.setValue(P,"toneMappingExposure",F.toneMappingExposure),Me.needsLights&&zr(_t,tn),ue&&U.fog===!0&&oe.refreshFogUniforms(_t,ue),oe.refreshMaterialUniforms(_t,U,ve,Pe,w.state.transmissionRenderTarget[f.id]),Me.needsLights&&Me.numLightProbeGrids>0){const it=T;let pt=0;for(const Wt of w.state.lightProbeGridArray)Wt.texture!==null&&(it.textures[pt]=Wt.texture,it.min[pt]=Wt.boundingBox.min,it.max[pt]=Wt.boundingBox.max,it.resolution[pt]=Wt.resolution,pt++);for(const Wt in it)it[Wt].length=pt;_t.probesSH.value=it.textures,_t.probesMin.value=it.min,_t.probesMax.value=it.max,_t.probesResolution.value=it.resolution}Wn.upload(P,Ui(Me),_t,Le)}if(U.isShaderMaterial&&U.uniformsNeedUpdate===!0&&(Wn.upload(P,Ui(Me),_t,Le),U.uniformsNeedUpdate=!1),U.isSpriteMaterial&&ke.setValue(P,"center",O.center),ke.setValue(P,"modelViewMatrix",O.modelViewMatrix),ke.setValue(P,"normalMatrix",O.normalMatrix),ke.setValue(P,"modelMatrix",O.matrixWorld),U.uniformsGroups!==void 0){const it=U.uniformsGroups;for(let pt=0,Wt=it.length;pt<Wt;pt++){const Oi=it[pt];be.update(Oi,Et),be.bind(Oi,Et)}}return Et}function zr(f,A){f.ambientLightColor.needsUpdate=A,f.lightProbe.needsUpdate=A,f.sunLights.needsUpdate=A,f.sunLightShadows.needsUpdate=A,f.directionalLights.needsUpdate=A,f.directionalLightShadows.needsUpdate=A,f.pointLights.needsUpdate=A,f.pointLightShadows.needsUpdate=A,f.spotLights.needsUpdate=A,f.spotLightShadows.needsUpdate=A,f.rectAreaLights.needsUpdate=A,f.hemisphereLights.needsUpdate=A}function Wr(f){return f.isMeshLambertMaterial||f.isMeshToonMaterial||f.isMeshPhongMaterial||f.isMeshStandardMaterial||f.isShadowMaterial||f.isShaderMaterial&&f.lights===!0}this.getActiveCubeFace=function(){return y},this.getActiveMipmapLevel=function(){return N},this.getRenderTarget=function(){return ae},this.setRenderTargetTextures=function(f,A,G){const U=Re.get(f);U.__autoAllocateDepthBuffer=f.resolveDepthBuffer===!1,U.__autoAllocateDepthBuffer===!1&&(U.__useRenderToTexture=!1),Re.get(f.texture).__webglTexture=A,Re.get(f.depthTexture).__webglTexture=U.__autoAllocateDepthBuffer?void 0:G,U.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(f,A){const G=Re.get(f);G.__webglFramebuffer=A,G.__useDefaultFramebuffer=A===void 0},this.setRenderTarget=function(f,A=0,G=0){ae=f,y=A,N=G;let U=null,O=!1,ue=!1;if(f){const fe=Re.get(f);if(fe.__useDefaultFramebuffer!==void 0){he.bindFramebuffer(P.FRAMEBUFFER,fe.__webglFramebuffer),re.copy(f.viewport),we.copy(f.scissor),Fe=f.scissorTest,he.viewport(re),he.scissor(we),he.setScissorTest(Fe),Y=-1;return}else if(fe.__webglFramebuffer===void 0)Le.setupRenderTarget(f);else if(fe.__hasExternalTextures)Le.rebindTextures(f,Re.get(f.texture).__webglTexture,Re.get(f.depthTexture).__webglTexture);else if(f.depthBuffer){const De=f.depthTexture;if(fe.__boundDepthTexture!==De){if(De!==null&&Re.has(De)&&(f.width!==De.image.width||f.height!==De.image.height))throw new Error("THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.");Le.setupDepthRenderbuffer(f)}}const ge=f.texture;(ge.isData3DTexture||ge.isDataArrayTexture||ge.isCompressedArrayTexture)&&(ue=!0);const Te=Re.get(f).__webglFramebuffer;f.isWebGLCubeRenderTarget?(Array.isArray(Te[A])?U=Te[A][G]:U=Te[A],O=!0):f.samples>0&&Le.useMultisampledRTT(f)===!1?U=Re.get(f).__webglMultisampledFramebuffer:Array.isArray(Te)?U=Te[G]:U=Te,re.copy(f.viewport),we.copy(f.scissor),Fe=f.scissorTest}else re.copy(Ce).multiplyScalar(ve).floor(),we.copy(Qe).multiplyScalar(ve).floor(),Fe=Ke;if(G!==0&&(U=$),he.bindFramebuffer(P.FRAMEBUFFER,U)&&he.drawBuffers(f,U),he.viewport(re),he.scissor(we),he.setScissorTest(Fe),O){const fe=Re.get(f.texture);P.framebufferTexture2D(P.FRAMEBUFFER,P.COLOR_ATTACHMENT0,P.TEXTURE_CUBE_MAP_POSITIVE_X+A,fe.__webglTexture,G)}else if(ue){const fe=A;for(let ge=0;ge<f.textures.length;ge++){const Te=Re.get(f.textures[ge]);P.framebufferTextureLayer(P.FRAMEBUFFER,P.COLOR_ATTACHMENT0+ge,Te.__webglTexture,G,fe)}}else if(f!==null&&G!==0){const fe=Re.get(f.texture);P.framebufferTexture2D(P.FRAMEBUFFER,P.COLOR_ATTACHMENT0,P.TEXTURE_2D,fe.__webglTexture,G)}Y=-1};function Ni(f){const A=Re.get(f);return(A.__readFormat!==f.format||A.__readType!==f.type)&&(A.__readFormat=f.format,A.__readType=f.type,A.__formatReadable=Je.textureFormatReadable(f.format),A.__typeReadable=Je.textureTypeReadable(f.type)),A}this.readRenderTargetPixels=function(f,A,G,U,O,ue,Se,fe=0){if(!(f&&f.isWebGLRenderTarget)){tt("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let ge=Re.get(f).__webglFramebuffer;if(f.isWebGLCubeRenderTarget&&Se!==void 0&&(ge=ge[Se],Array.isArray(ge)&&(ge=ge[0])),ge){he.bindFramebuffer(P.FRAMEBUFFER,ge);try{const Te=f.textures[fe],De=Te.format,Ge=Te.type;f.textures.length>1&&P.readBuffer(P.COLOR_ATTACHMENT0+fe);const Ee=Ni(Te);if(Ee.__formatReadable===!1){tt("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(Ee.__typeReadable===!1){tt("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}A>=0&&A<=f.width-U&&G>=0&&G<=f.height-O&&P.readPixels(A,G,U,O,ne.convert(De),ne.convert(Ge),ue)}finally{const Te=ae!==null?Re.get(ae).__webglFramebuffer:null;he.bindFramebuffer(P.FRAMEBUFFER,Te)}}},this.readRenderTargetPixelsAsync=async function(f,A,G,U,O,ue,Se,fe=0){if(!(f&&f.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let ge=Re.get(f).__webglFramebuffer;if(f.isWebGLCubeRenderTarget&&Se!==void 0&&(ge=ge[Se],Array.isArray(ge)&&(ge=ge[0])),ge)if(A>=0&&A<=f.width-U&&G>=0&&G<=f.height-O){he.bindFramebuffer(P.FRAMEBUFFER,ge);const Te=f.textures[fe],De=Te.format,Ge=Te.type;f.textures.length>1&&P.readBuffer(P.COLOR_ATTACHMENT0+fe);const Ee=Ni(Te);if(Ee.__formatReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(Ee.__typeReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const He=P.createBuffer();P.bindBuffer(P.PIXEL_PACK_BUFFER,He),P.bufferData(P.PIXEL_PACK_BUFFER,ue.byteLength,P.STREAM_READ),P.readPixels(A,G,U,O,ne.convert(De),ne.convert(Ge),0),P.bindBuffer(P.PIXEL_PACK_BUFFER,null);const st=ae!==null?Re.get(ae).__webglFramebuffer:null;he.bindFramebuffer(P.FRAMEBUFFER,st);const $e=P.fenceSync(P.SYNC_GPU_COMMANDS_COMPLETE,0);return P.flush(),await Yr(P,$e,4),P.bindBuffer(P.PIXEL_PACK_BUFFER,He),P.getBufferSubData(P.PIXEL_PACK_BUFFER,0,ue),P.bindBuffer(P.PIXEL_PACK_BUFFER,null),P.deleteBuffer(He),P.deleteSync($e),ue}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(f,A=null,G=0){const U=Math.pow(2,-G),O=Math.floor(f.image.width*U),ue=Math.floor(f.image.height*U),Se=A!==null?A.x:0,fe=A!==null?A.y:0;Le.setTexture2D(f,0),P.copyTexSubImage2D(P.TEXTURE_2D,G,0,0,Se,fe,O,ue),he.unbindTexture()},this.copyTextureToTexture=function(f,A,G=null,U=null,O=0,ue=0){let Se,fe,ge,Te,De,Ge,Ee,He,st;const $e=f.isCompressedTexture?f.mipmaps[ue]:f.image;if(G!==null)Se=G.max.x-G.min.x,fe=G.max.y-G.min.y,ge=G.isBox3?G.max.z-G.min.z:1,Te=G.min.x,De=G.min.y,Ge=G.isBox3?G.min.z:0;else{const ke=Math.pow(2,-O);Se=Math.floor($e.width*ke),fe=Math.floor($e.height*ke),f.isDataArrayTexture?ge=$e.depth:f.isData3DTexture?ge=Math.floor($e.depth*ke):ge=1,Te=0,De=0,Ge=0}U!==null?(Ee=U.x,He=U.y,st=U.z):(Ee=0,He=0,st=0);const Ye=ne.convert(A.format),St=ne.convert(A.type);let Me;A.isData3DTexture?(Le.setTexture3D(A,0),Me=P.TEXTURE_3D):A.isDataArrayTexture||A.isCompressedArrayTexture?(Le.setTexture2DArray(A,0),Me=P.TEXTURE_2D_ARRAY):(Le.setTexture2D(A,0),Me=P.TEXTURE_2D),he.activeTexture(P.TEXTURE0),he.pixelStorei(P.UNPACK_FLIP_Y_WEBGL,A.flipY),he.pixelStorei(P.UNPACK_PREMULTIPLY_ALPHA_WEBGL,A.premultiplyAlpha),he.pixelStorei(P.UNPACK_ALIGNMENT,A.unpackAlignment);const Tt=he.getParameter(P.UNPACK_ROW_LENGTH),ze=he.getParameter(P.UNPACK_IMAGE_HEIGHT),en=he.getParameter(P.UNPACK_SKIP_PIXELS),Et=he.getParameter(P.UNPACK_SKIP_ROWS),On=he.getParameter(P.UNPACK_SKIP_IMAGES);he.pixelStorei(P.UNPACK_ROW_LENGTH,$e.width),he.pixelStorei(P.UNPACK_IMAGE_HEIGHT,$e.height),he.pixelStorei(P.UNPACK_SKIP_PIXELS,Te),he.pixelStorei(P.UNPACK_SKIP_ROWS,De),he.pixelStorei(P.UNPACK_SKIP_IMAGES,Ge);const Zt=f.isDataArrayTexture||f.isData3DTexture,tn=A.isDataArrayTexture||A.isData3DTexture;if(f.isDepthTexture){const ke=Re.get(f),_t=Re.get(A),Ft=Re.get(ke.__renderTarget),it=Re.get(_t.__renderTarget);he.bindFramebuffer(P.READ_FRAMEBUFFER,Ft.__webglFramebuffer),he.bindFramebuffer(P.DRAW_FRAMEBUFFER,it.__webglFramebuffer);for(let pt=0;pt<ge;pt++)Zt&&(P.framebufferTextureLayer(P.READ_FRAMEBUFFER,P.COLOR_ATTACHMENT0,Re.get(f).__webglTexture,O,Ge+pt),P.framebufferTextureLayer(P.DRAW_FRAMEBUFFER,P.COLOR_ATTACHMENT0,Re.get(A).__webglTexture,ue,st+pt)),P.blitFramebuffer(Te,De,Te+Se,De+fe,Ee,He,Ee+Se,He+fe,P.DEPTH_BUFFER_BIT,P.NEAREST);he.bindFramebuffer(P.READ_FRAMEBUFFER,null),he.bindFramebuffer(P.DRAW_FRAMEBUFFER,null)}else if(O!==0||f.isRenderTargetTexture||Re.has(f)){const ke=Re.get(f),_t=Re.get(A);he.bindFramebuffer(P.READ_FRAMEBUFFER,C),he.bindFramebuffer(P.DRAW_FRAMEBUFFER,Q);for(let Ft=0;Ft<ge;Ft++)Zt?P.framebufferTextureLayer(P.READ_FRAMEBUFFER,P.COLOR_ATTACHMENT0,ke.__webglTexture,O,Ge+Ft):P.framebufferTexture2D(P.READ_FRAMEBUFFER,P.COLOR_ATTACHMENT0,P.TEXTURE_2D,ke.__webglTexture,O),tn?P.framebufferTextureLayer(P.DRAW_FRAMEBUFFER,P.COLOR_ATTACHMENT0,_t.__webglTexture,ue,st+Ft):P.framebufferTexture2D(P.DRAW_FRAMEBUFFER,P.COLOR_ATTACHMENT0,P.TEXTURE_2D,_t.__webglTexture,ue),O!==0?P.blitFramebuffer(Te,De,Te+Se,De+fe,Ee,He,Ee+Se,He+fe,P.COLOR_BUFFER_BIT,P.NEAREST):tn?P.copyTexSubImage3D(Me,ue,Ee,He,st+Ft,Te,De,Se,fe):P.copyTexSubImage2D(Me,ue,Ee,He,Te,De,Se,fe);he.bindFramebuffer(P.READ_FRAMEBUFFER,null),he.bindFramebuffer(P.DRAW_FRAMEBUFFER,null)}else tn?f.isDataTexture||f.isData3DTexture?P.texSubImage3D(Me,ue,Ee,He,st,Se,fe,ge,Ye,St,$e.data):A.isCompressedArrayTexture?P.compressedTexSubImage3D(Me,ue,Ee,He,st,Se,fe,ge,Ye,$e.data):P.texSubImage3D(Me,ue,Ee,He,st,Se,fe,ge,Ye,St,$e):f.isDataTexture?P.texSubImage2D(P.TEXTURE_2D,ue,Ee,He,Se,fe,Ye,St,$e.data):f.isCompressedTexture?P.compressedTexSubImage2D(P.TEXTURE_2D,ue,Ee,He,$e.width,$e.height,Ye,$e.data):P.texSubImage2D(P.TEXTURE_2D,ue,Ee,He,Se,fe,Ye,St,$e);he.pixelStorei(P.UNPACK_ROW_LENGTH,Tt),he.pixelStorei(P.UNPACK_IMAGE_HEIGHT,ze),he.pixelStorei(P.UNPACK_SKIP_PIXELS,en),he.pixelStorei(P.UNPACK_SKIP_ROWS,Et),he.pixelStorei(P.UNPACK_SKIP_IMAGES,On),ue===0&&A.generateMipmaps===!0&&A.mipmapsAutoUpdate===!0&&P.generateMipmap(Me),he.unbindTexture()},this.initRenderTarget=function(f){Re.get(f).__webglFramebuffer===void 0&&Le.setupRenderTarget(f)},this.initTexture=function(f){f.isCubeTexture?Le.setTextureCube(f,0):f.isData3DTexture?Le.setTexture3D(f,0):f.isDataArrayTexture||f.isCompressedArrayTexture?Le.setTexture2DArray(f,0):Le.setTexture2D(f,0),he.unbindTexture()},this.resetState=function(){y=0,N=0,ae=null,he.reset(),se.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Bi}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(n){this._outputColorSpace=n;const t=this.getContext();t.drawingBufferColorSpace=rt._getDrawingBufferColorSpace(n),t.unpackColorSpace=rt._getUnpackColorSpace()}}const Tn=new ie;function Ot(e,n,t,i,a,r){const o=2*Math.PI*a/4,s=Math.max(r-2*a,0),p=Math.PI/4;Tn.copy(n),Tn[i]=0,Tn.normalize();const d=.5*o/(o+s),m=1-Tn.angleTo(e)/p;return Math.sign(Tn[t])===1?m*d:s/(o+s)+d+d*(1-m)}class Ai extends ln{constructor(n=1,t=1,i=1,a=2,r=.1){const o=a*2+1;if(r=Math.min(n/2,t/2,i/2,r),super(1,1,1,o,o,o),this.type="RoundedBoxGeometry",this.parameters={width:n,height:t,depth:i,segments:a,radius:r},o===1)return;const s=this.toNonIndexed();this.index=null,this.attributes.position=s.attributes.position,this.attributes.normal=s.attributes.normal,this.attributes.uv=s.attributes.uv;const p=new ie,d=new ie,m=new ie(n,t,i).divideScalar(2).subScalar(r),g=this.attributes.position.array,v=this.attributes.normal.array,_=this.attributes.uv.array,R=g.length/6,L=new ie,h=.5/o;for(let u=0,M=0;u<g.length;u+=3,M+=2)switch(p.fromArray(g,u),d.copy(p),d.x-=Math.sign(d.x)*h,d.y-=Math.sign(d.y)*h,d.z-=Math.sign(d.z)*h,d.normalize(),g[u+0]=m.x*Math.sign(p.x)+d.x*r,g[u+1]=m.y*Math.sign(p.y)+d.y*r,g[u+2]=m.z*Math.sign(p.z)+d.z*r,v[u+0]=d.x,v[u+1]=d.y,v[u+2]=d.z,Math.floor(u/R)){case 0:L.set(1,0,0),_[M+0]=Ot(L,d,"z","y",r,i),_[M+1]=1-Ot(L,d,"y","z",r,t);break;case 1:L.set(-1,0,0),_[M+0]=1-Ot(L,d,"z","y",r,i),_[M+1]=1-Ot(L,d,"y","z",r,t);break;case 2:L.set(0,1,0),_[M+0]=1-Ot(L,d,"x","z",r,n),_[M+1]=Ot(L,d,"z","x",r,i);break;case 3:L.set(0,-1,0),_[M+0]=1-Ot(L,d,"x","z",r,n),_[M+1]=1-Ot(L,d,"z","x",r,i);break;case 4:L.set(0,0,1),_[M+0]=1-Ot(L,d,"x","y",r,n),_[M+1]=1-Ot(L,d,"y","x",r,t);break;case 5:L.set(0,0,-1),_[M+0]=Ot(L,d,"x","y",r,n),_[M+1]=1-Ot(L,d,"y","x",r,t);break}}static fromJSON(n){return new Ai(n.width,n.height,n.depth,n.segments,n.radius)}}function Z(e,n={}){return new ls({color:e,roughness:.76,metalness:0,...n})}function J(e,n,t,i,a=.015){const r=a?new Ai(...n,2,Math.min(a,Math.min(...n)/3)):new ln(...n),o=new ye(r,i);return o.position.set(...t),o.castShadow=!0,o.receiveShadow=!0,e.add(o),o}function mt(e,n,t,i,a,r,o=32){const s=new ye(new Yn(n,t,i,o),r);return s.position.set(...a),s.castShadow=!0,s.receiveShadow=!0,e.add(s),s}function Pt(e,n,t,i){const a=new ye(new ss(n,28,20),i);return a.position.set(...t),a.castShadow=!0,a.receiveShadow=!0,e.add(a),a}function Mt(e,n,t,i){const a=new fs(n.map(o=>new ie(...o))),r=new ye(new ds(a,24,t,8,!1),i);return r.castShadow=!0,e.add(r),r}function bt(e,n=512){const t=document.createElement("canvas");t.width=t.height=n;const i=t.getContext("2d");if(!i)throw new Error("Canvas 2D is unavailable.");e(i,n);const a=new cs(t);return a.colorSpace=Mi,a.anisotropy=4,a}function Xn(e=!1){const n=bt((t,i)=>{t.fillStyle=e?"#ddc39d":"#b99570",t.fillRect(0,0,i,i);for(let a=0;a<64;a++){const r=a*43.13%i;t.strokeStyle=a%3?"rgba(76,41,17,.035)":"rgba(255,229,187,.09)",t.lineWidth=a%5?.8:2,t.beginPath(),t.moveTo(0,r);for(let o=0;o<=i;o+=16)t.lineTo(o,r+Math.sin(o/90+a*.7)*(2+a%4));t.stroke()}t.strokeStyle="rgba(68,34,10,.09)";for(const[a,r]of[[112,160],[375,403]])for(let o=0;o<7;o++)t.beginPath(),t.ellipse(a,r,10+o*8,2+o*1.2,.02,0,Math.PI*2),t.stroke()});return Z("#fff9ec",{map:n,bumpMap:n,bumpScale:.004,roughness:.88})}function Lu(e){const n=bt((t,i)=>{t.fillStyle=e?"#c3c8a2":"#cecdab",t.fillRect(0,0,i,i);for(let a=0;a<i;a+=3){t.fillStyle=a%9?"rgba(65,72,36,.13)":"rgba(255,249,202,.28)",t.fillRect(0,a,i,1);for(let r=0;r<i;r+=12)t.fillStyle=(r+a)%24?"rgba(89,92,50,.07)":"rgba(246,239,191,.15)",t.fillRect(r+a%6,a,1,3)}});return Z("#fff5d4",{map:n,bumpMap:n,bumpScale:.004,roughness:1})}function fn(e,n,t,i,a=.21){const r=bt((s,p)=>{const d=s.createRadialGradient(p/2,p/2,p*.03,p/2,p/2,p*.5);d.addColorStop(0,"rgba(42,28,16,.9)"),d.addColorStop(.55,"rgba(42,28,16,.4)"),d.addColorStop(1,"rgba(42,28,16,0)"),s.fillStyle=d,s.fillRect(0,0,p,p)},128),o=new ye(new Ct(t,i),new Cn({map:r,transparent:!0,opacity:a,depthWrite:!1}));return o.rotation.x=-Math.PI/2,o.position.set(...n),e.add(o),o}function Du(e){const n=ot[e];return bt((t,i)=>{if(t.fillStyle=n.color,t.fillRect(0,0,i,i),t.fillStyle="rgba(255,255,255,.13)",t.fillRect(25,0,6,i),t.fillStyle="#f5efd8",t.fillRect(i*.15,i*.13,i*.7,i*.2),t.fillStyle="#314e53",t.font=`600 ${i*.105}px sans-serif`,t.textAlign="center",t.textBaseline="middle",t.fillText(e==="math"?"數學":e==="story"?"小小探險家":e==="library"?"圖書館":e==="comic"?"小芽日記":e==="notebook"?"聯絡簿":n.name,i*.5,i*.23),e==="comic")$n(t,i*.15,i*.34,i*.7);else if(e==="math")t.strokeStyle="rgba(239,246,232,.8)",t.lineWidth=7,t.beginPath(),t.arc(i*.5,i*.63,i*.19,0,Math.PI*2),t.stroke(),t.fillStyle="#f0d78e",t.fillRect(i*.31,i*.51,i*.2,i*.2),t.fillStyle="#d2e4db",t.beginPath(),t.moveTo(i*.55,i*.76),t.lineTo(i*.78,i*.76),t.lineTo(i*.665,i*.5),t.fill();else{t.strokeStyle="rgba(255,248,217,.5)",t.lineWidth=3;for(let a=i*.45;a<i*.8;a+=i*.1)t.beginPath(),t.moveTo(i*.22,a),t.lineTo(i*.78,a),t.stroke()}t.fillStyle="rgba(30,37,30,.12)",t.fillRect(0,0,15,i)},256)}function yu(e,n){return bt((t,i)=>{t.fillStyle=ot[e].color,t.fillRect(0,0,i,i),t.fillStyle="#f3e8cc",t.fillRect(i*.17,i*.12,i*.66,i*.67);const a=e==="math"?"數學":e==="notebook"?"聯絡簿":e==="comic"?"小芽日記":e==="library"?"圖書館":e==="story"?"故事書":ot[e].name;t.fillStyle="#334955",t.textAlign="center",t.textBaseline="middle",t.font=`600 ${i*.16}px sans-serif`,[...a].forEach((r,o)=>t.fillText(r,i*.5,i*.21+o*i*.135)),t.fillStyle="#f6e6ba",t.font=`600 ${i*.13}px sans-serif`,t.fillText(String(n+1),i*.5,i*.91)},256)}function Vn(e,n,t=!1,i=!1){const a=new at,r=ot[e];if(a.userData.folded=i,r.art==="car"){const o=Z(r.color);J(a,[.58,.14,.3],[0,0,0],o,.045),J(a,[.29,.15,.28],[-.035,.12,0],o,.035);for(const s of[-.145,.145]){J(a,[.22,.08,.008],[-.035,.145,s],Z("#a9c8ce"),.01);for(const p of[-.18,.18]){const d=mt(a,.075,.075,.045,[p,-.065,s],Z("#4b4840"),16);d.rotation.x=Math.PI/2}}for(const s of[-.095,.095])J(a,[.012,.045,.07],[.294,.025,s],Z("#f2d99a"),.008)}else if(r.art==="plush"){const o=Z(r.color,{roughness:1});Pt(a,.23,[0,.05,0],o).scale.set(1,1.15,.75),Pt(a,.19,[0,.32,0],o);for(const s of[-1,1])Pt(a,.085,[s*.145,.48,0],o),Pt(a,.1,[s*.24,.06,0],o),Pt(a,.11,[s*.13,-.12,.07],o),Pt(a,.018,[s*.065,.35,.17],Z("#4a392c"));Pt(a,.075,[0,.285,.16],Z("#e8cfaa")).scale.z=.5,Pt(a,.024,[0,.31,.205],Z("#4a392c"))}else if(r.art==="cushion"){J(a,[.72,.14,.63],[0,0,0],Z(r.color,{roughness:1}),.07);for(const o of[-.32,.32])Mt(a,[[o,-.01,-.26],[o,0,.26]],.006,Z("#94734f"));mt(a,.025,.025,.008,[0,.074,0],Z("#9b7b50"))}else if(r.art==="spray"){const o=Z(r.color);J(a,[.29,.38,.2],[0,0,0],o,.04),mt(a,.065,.08,.12,[0,.24,0],o),J(a,[.22,.08,.11],[.04,.32,0],Z("#e5dcc2"),.015),J(a,[.06,.12,.035],[.105,.23,0],Z("#768f85"),.008),J(a,[.14,.15,.008],[0,.01,.105],Z("#e6e4cc"),.01)}else if(r.art==="ruler"){J(a,[.66,.025,.13],[0,0,0],Z(r.color),.008);for(let o=0;o<15;o++)J(a,[.006,.004,o%5===0?.07:.035],[-.29+o*.041,.016,-.035],Z("#79663c"))}else if(r.art==="eraser")J(a,[.23,.095,.15],[0,0,0],Z("#eee1d0"),.015),J(a,[.12,.1,.155],[.03,0,0],Z(r.color),.01);else if(r.art==="headphones"){const o=new ye(new Rn(.22,.034,8,32,Math.PI),Z(r.color));o.rotation.x=-Math.PI/2,a.add(o);for(const s of[-.22,.22])J(a,[.12,.1,.19],[s,0,0],Z(r.color),.04),J(a,[.055,.09,.16],[s*.72,-.005,0],Z("#544e55"),.025)}else if(r.art==="clothes"){const o=Z(r.color,{roughness:1,side:vt}),s=Z("#a67669",{roughness:1});if(e==="cloth"){J(a,[.48,.035,.43],[0,0,0],o,.012);for(let p=0;p<6;p++)Mt(a,[[-.22,.02,-.18+p*.07],[.22,.02,-.18+p*.07]],.003,s);n&&(a.rotation.x=Math.PI/2)}else if(n){const p=new br;p.moveTo(-.1,.28),p.quadraticCurveTo(0,.17,.1,.28),p.lineTo(.23,.22),p.lineTo(.34,.07),p.lineTo(.25,-.02),p.lineTo(.19,.04),p.lineTo(.2,-.36),p.quadraticCurveTo(0,-.4,-.2,-.36),p.lineTo(-.19,.04),p.lineTo(-.25,-.02),p.lineTo(-.34,.07),p.lineTo(-.23,.22),p.closePath();const d=new ye(new Ar(p,{depth:.035,bevelEnabled:!0,bevelSize:.008,bevelThickness:.008,bevelSegments:2,steps:1}),o);d.castShadow=!0,a.add(d),Mt(a,[[-.24,.22,0],[0,.34,0],[.24,.22,0],[-.24,.22,0]],.012,Z("#8a775e")),Mt(a,[[0,.34,0],[0,.39,0],[.035,.405,0],[.05,.38,0]],.012,s),Mt(a,[[-.15,-.32,.045],[0,-.34,.045],[.15,-.32,.045]],.004,s)}else if(t)J(a,[.65,.075,.54],[0,0,0],o,.025),J(a,[.56,.016,.45],[0,.043,.015],o,.012),Mt(a,[[-.12,.054,-.25],[0,.051,-.2],[.12,.054,-.25]],.012,s),Mt(a,[[-.28,.053,.12],[0,.058,.14],[.28,.053,.11]],.006,s);else{const p=new ye(new Ct(.66,.58,12,10),o),d=p.geometry.attributes.position;for(let m=0;m<d.count;m++){const g=d.getX(m),v=d.getY(m);d.setZ(m,.012+Math.sin(g*19+v*13)*.018+Math.cos(v*24)*.012)}p.geometry.computeVertexNormals(),p.rotation.x=-Math.PI/2,p.castShadow=!0,p.receiveShadow=!0,a.add(p);for(const m of[-1,1]){const g=J(a,[.21,.06,.18],[m*.25,.02,-.16],o,.018);g.rotation.y=m*.5}Mt(a,[[-.1,.042,-.23],[0,.026,-.17],[.1,.042,-.23]],.018,s)}}else if(r.art==="parcel"){const o=Z("#ba9569"),s=Z("#8d6c47"),p=Z("#d6bc87");if(i)J(a,[.92,.07,.98],[0,0,0],o),J(a,[.18,.009,.98],[0,.04,0],p);else{J(a,[.92,.055,.98],[0,-.25,0],s);for(const g of[-.445,.445])J(a,[.03,.52,.98],[g,0,0],o);for(const g of[-.475,.475])J(a,[.86,.52,.03],[0,0,g],o);const d=[];for(const g of[-1,1]){const v=new at;v.position.set(g*.445,.26,0),a.add(v),J(v,[.445,.025,.96],[-g*.222,0,0],o),v.userData.side=g,d.push(v)}a.userData.cartonFlaps=d;const m=new ye(new ln(.94,.54,1),new Cn({transparent:!0,opacity:0,depthWrite:!1,colorWrite:!1}));m.userData.pickOnly=!0,a.add(m),J(a,[.18,.21,.005],[0,.03,.493],p)}}else if(r.art==="tissue"){const o=Z("#f3ecdd",{roughness:1,flatShading:!0});for(const[s,p,d,m]of[[0,0,0,.16],[-.11,-.02,.035,.1],[.075,-.01,.07,.12],[.03,.08,-.03,.09]]){const g=new ye(new us(m,1),o);g.position.set(s,p,d),g.scale.set(1,.7,.85),g.rotation.set(s*3,.7+d*4,.2),g.castShadow=!0,g.receiveShadow=!0,a.add(g)}}else if(r.art==="cup"){const o=Z("#dbe4d9",{transparent:!0,opacity:.48,roughness:.32,depthWrite:!1,side:vt}),s=new ye(new Yn(.16,.12,.62,32,1,!0),o);a.add(s),mt(a,.12,.12,.018,[0,-.303,0],Z("#d8dfd2",{transparent:!0,opacity:.8}));const p=new ye(new Rn(.162,.012,6,40),Z("#dce5d8"));p.rotation.x=Math.PI/2,p.position.y=.31,a.add(p);const d=bt((m,g)=>{m.clearRect(0,0,g,g);for(const v of[.25,.75])m.fillStyle=qt.cream,m.beginPath(),m.roundRect(g*(v-.19),g*.22,g*.38,g*.57,g*.06),m.fill(),$n(m,g*(v-.15),g*.27,g*.28),m.fillStyle=qt.ink,m.textAlign="center",m.font=`bold ${g*.065}px sans-serif`,m.fillText("百寶茶舖",g*v,g*.69)},256);a.add(new ye(new Yn(.161,.121,.62,32,1,!0),Z("#ffffff",{map:d,transparent:!0,alphaTest:.03,side:vt,roughness:.7})))}else if(r.art==="globe"){const o=Z("#704c34");mt(a,.18,.21,.045,[0,-.31,0],o),Mt(a,[[0,-.31,0],[0,-.16,0],[0,-.07,0]],.015,o),Pt(a,.22,[0,.06,0],Z("#8da8a2",{roughness:.68}));for(const[p,d,m]of[[-.07,.16,.15],[.08,.05,.17],[-.12,-.05,.12]])Pt(a,.095,[p,d,m],Z("#a8ab77")).scale.set(1,.8,.2);const s=new ye(new Rn(.26,.012,8,40,Math.PI*1.3),o);s.position.y=.06,s.rotation.z=-.45,a.add(s)}else if(r.art==="book"){const o=e==="comic"?3:1;for(let s=0;s<o;s++){const p=new at;a.add(p);const d=Z(r.color,{roughness:.66});J(p,[.55,.065,.72],[0,0,0],Z("#e6dfcb"),.007),J(p,[.575,.014,.745],[0,-.04,0],d,.006),J(p,[.575,.014,.745],[0,.04,0],d,.006);const m=new ye(new Ct(.56,.73),Z("#ffffff",{map:Du(e),roughness:.78}));if(m.rotation.x=-Math.PI/2,m.position.y=.048,p.add(m),J(p,[.025,.08,.745],[-.28,0,0],d,.004),n){p.rotation.set(Math.PI/2,0,0);const g=new at;a.remove(p),g.add(p),g.rotation.y=Math.PI/2,g.position.x=o>1?(s-1)*.105:0,a.add(g);const v=new ye(new Ct(.077,.71),Z("#ffffff",{map:yu(e,s),roughness:.76}));v.position.set(g.position.x,0,.294),a.add(v)}else p.position.set(s*.024,s*.092,s*-.015),p.rotation.y=s*-.13}}else if(r.art==="case"){const o=Z(r.color,{roughness:.9}),s=Z("#d5c8a6");J(a,[.6,.035,.28],[0,-.06,0],s,.015);for(const d of[-.13,.13])J(a,[.6,.13,.025],[0,-.005,d],o,.012);for(const d of[-.29,.29])J(a,[.025,.13,.25],[d,-.005,0],o,.012);const p=new at;p.position.set(0,.065,-.13),a.add(p),a.userData.containerLid=p,J(p,[.6,.035,.28],[0,0,.13],o,.02),J(p,[.49,.012,.012],[0,.023,.13],Z("#d7ae80"),.003),J(p,[.06,.02,.045],[.22,.032,.155],Z("#b0a18d",{metalness:.6,roughness:.4}),.005);for(let d=0;d<18;d++)J(p,[.012,.009,.028],[-.22+d*.026,.025,.13],Z("#dcc7a8"),0)}else if(r.art==="bottle"){const o=Z("#638779",{metalness:.18,roughness:.44});mt(a,.16,.16,.5,[0,0,0],o),Pt(a,.159,[0,-.24,0],o).scale.y=.25,mt(a,.125,.15,.09,[0,.29,0],Z("#42655b")),mt(a,.13,.13,.035,[0,.35,0],Z("#364f48")),Mt(a,[[-.11,.35,0],[-.12,.47,0],[.12,.47,0],[.11,.35,0]],.022,Z("#354c45")),mt(a,.162,.162,.075,[0,-.07,0],Z("#d9d7b9"));const s=new ye(new Ct(.16,.2),Z("#ffffff",{map:bt((p,d)=>{p.fillStyle=qt.cream,p.fillRect(0,0,d,d),$n(p,d*.04,0,d*.92)},128)}));s.position.set(0,.05,.161),a.add(s)}else if(r.art==="ball"){Pt(a,.28,[0,0,0],Z("#c9874c",{roughness:.67}));for(let s=0;s<3;s++){const p=new ye(new Rn(.281,.006,5,56),Z("#654c38"));s===1&&(p.rotation.x=Math.PI/2),s===2&&(p.rotation.y=Math.PI/2),a.add(p)}}else if(r.art==="blocks"){const o=Xn(!0);J(a,[.6,.24,.47],[0,0,0],o,.025),J(a,[.55,.03,.42],[0,.124,0],Z("#b8b68e"),.009);for(const d of[-.29,.29])J(a,[.025,.17,.47],[d,.2,0],o,.006);for(const d of[-.225,.225])J(a,[.58,.17,.025],[0,.2,d],o,.006);const s=new at;s.position.set(0,.28,-.23),a.add(s),a.userData.containerLid=s,J(s,[.62,.035,.49],[0,0,.245],o,.012),s.rotation.x=-1.75;const p=["#c17b59","#779795","#d6b269","#899e70","#947d96"];for(let d=0;d<5;d++){const m=!t&&d>1,g=J(a,[.14,.1+d%2*.035,.14],m?[-.38+(d-2)*.32,-.06,.29+d%2*.12]:[-.22+d*.11,.18,-.15],Z(p[d]),.012);m&&(g.rotation.y=d*.45)}J(a,[.27,.085,.012],[0,-.015,.243],Z("#e0d4b4"),.005)}else if(r.art==="plane"){const o=Z("#e1ddd0",{roughness:.53}),s=Z("#5a8ba0",{roughness:.5}),p=Z("#b86250");J(a,[.115,.14,.73],[0,0,0],o,.05),J(a,[.96,.035,.22],[0,.015,-.02],s,.025),J(a,[.4,.025,.13],[0,.06,.29],s,.015),J(a,[.035,.21,.16],[0,.13,.29],p,.01),Pt(a,.085,[0,.08,-.11],Z("#436d7a",{metalness:.25,roughness:.25})).scale.set(.7,.75,1.5);const m=J(a,[.27,.023,.022],[0,0,-.39],Z("#705443"),.008);m.rotation.z=.28;for(const g of[-.09,.09]){const v=mt(a,.045,.045,.025,[g,-.1,-.15],Z("#494c43"),16);v.rotation.z=Math.PI/2}}else{const o=bt((m,g)=>{if(m.fillStyle="#eee7d7",m.fillRect(0,0,g,g),m.strokeStyle="#9a9f9b",m.lineWidth=2,r.art==="exam"){m.fillStyle="#555e55",m.font="600 18px sans-serif",m.fillText("數學小考",22,28),m.font="14px sans-serif",m.fillText("姓名：＿＿＿＿",22,55),m.fillStyle="#c83d30",m.font="bold 64px sans-serif",m.fillText("0",164,99),m.font="16px sans-serif",m.fillText("/ 100",185,119),m.strokeStyle="#cc4a3a",m.lineWidth=4,m.beginPath(),m.ellipse(191,72,43,47,-.1,0,Math.PI*2),m.stroke(),m.fillStyle="#536259",m.font="15px sans-serif";for(let v=0;v<4;v++)m.fillText(`${v+1}.  ${v+2} + ${v+3} = ${v+9}`,24,120+v*31);m.strokeStyle="#cb4e40",m.lineWidth=3;for(let v=0;v<4;v++){const _=114+v*31;m.beginPath(),m.moveTo(200,_-8),m.lineTo(214,_+6),m.moveTo(214,_-8),m.lineTo(200,_+6),m.stroke()}return}for(let v=90;v<230;v+=30)m.beginPath(),m.moveTo(55,v),m.lineTo(210,v+5),m.stroke();m.strokeStyle="#aa7366",m.lineWidth=5,m.beginPath(),m.moveTo(70,60),m.lineTo(160,180),m.moveTo(155,65),m.lineTo(75,190),m.stroke()},256),s=new Ct(r.art==="exam"?.54:.47,r.art==="exam"?.68:.55,4,4),p=s.attributes.position;for(let m=0;m<p.count;m++)p.setZ(m,Math.sin(m*3.7)*(r.art==="exam"?.002:.018));s.computeVertexNormals();const d=new ye(s,Z("#ffffff",{map:o,side:vt,roughness:1}));d.rotation.x=-Math.PI/2,d.castShadow=!0,a.add(d)}return a.userData.item=e,a}const dn={seat:{anchor:[-1.19,1,.4],center:[-1.19,.85,.4],size:[.75,.22,.7]},hooks:{anchor:[1,1.78,-2.4],center:[1,1.38,-2.45],size:[.66,.85,.3]},drawer:{anchor:[-1.55,.95,-.8],center:[-2.1,.78,-.8],size:[.9,1.08,.74]},desk:{anchor:[-1.76,1.65,-.8],center:[-2.32,1.25,.1],size:[1.35,.6,2.8]},shelf:{anchor:[2.07,1.15,-1.85],center:[2.07,1.06,-2.12],size:[1.52,2.1,.72]},bag:{anchor:[2.15,.98,1.05],center:[2.28,.43,1.05],size:[1.1,.9,.6]},cabinet:{anchor:[3.1,.9,.65],center:[3.72,.55,0],size:[1.24,.95,2.64]},trash:{anchor:[-1.25,.9,1.9],center:[-1.25,.38,1.9],size:[.68,.76,.68]}};function Uu(e){const n=ot[e].art;return n==="bottle"?.34:n==="ball"?.285:n==="blocks"?.14:n==="plane"?.16:n==="case"?.09:n==="book"?e==="comic"?.13:.055:.012}function Gr(e,n,t,i){const a=zn(n,t.surface,i),r=Rr(n,t,i),o=t.upright??hn(e,a),s=a.scale*(ot[e].modelScale??1);if(n==="trash"&&!a.parent){const p=i.items.filter(m=>m.location==="trash").findIndex(m=>m.id===e),d=p*2.4;return{position:[(i.trash?.x??-1.25)+Math.cos(d+(i.trash?.rotation??0))*.11,.17+p*.014,(i.trash?.z??1.9)+Math.sin(d+(i.trash?.rotation??0))*.11],rotation:d,scale:.18*(ot[e].modelScale??1),upright:!1}}return{position:[r.x,a.y+(ot[e].carton&&i.cartonFolded?.04:ps(e,o))*s,r.z],rotation:t.rotation+(a.coordinates==="table"?Math.PI/2:a.origin?.rotation??0),scale:s,upright:o}}function Iu(e){const n={},t=[...e.items].sort((a,r)=>ot[r.id].size-ot[a.id].size),i={};for(const a of t){const r=i[a.location]??0,o=ot[a.id].size;i[a.location]=r+o;let s,p=0,d=1,m=!1;if(a.spot||hs(a.location)){const g=a.spot??Si(a,e);n[a.id]=Gr(a.id,a.location,g,e);continue}switch(a.location){case"seat":s=[e.chair?.x??-1.19,.9,e.chair?.z??.4],d=.72;break;case"hooks":s=[1,1.36,-2.45],d=.8,m=!0;break;case"shelf":{const g=Math.floor(r/4);s=[1.45+(r%4+o/2)*.31,.23+g*.62,-2.07],m=ot[a.id].art==="book",s[1]+=m?.285:a.id==="ball"?.25:a.id==="bottle"?.28:a.id==="plane"?.1:.08,d=m?.72:a.id==="plane"?.65:o===2?.84:.82,p=ot[a.id].art==="case"?Math.PI/2:0;break}case"drawer":{const g=wr(.95,-1.12);s=[g.x,.45+r*.34,g.z],d=.62,p=Math.PI/2;break}case"box":case"cabinet":m=ot[a.id].art==="book",d=a.id==="plane"?.35:a.id==="blocks"?.44:m?.46:.5,p=-Math.PI/2,s=[Math.floor(r/6)?3.65:3.34,.235+(m?.375:Uu(a.id))*d,(Math.floor(r/6)?-.49:-.05)+(r%6+o/2)*.17];break;case"bag":s=[1.92+(r+o/2)/6*.46,.6,1.03],d=.4,m=ot[a.id].art==="book",a.id==="bottle"&&(s[1]+=.12);break;case"trash":s=[-1.25,.47,1.9],d=.72,p=.2;break}n[a.id]={position:s,rotation:p,scale:d,upright:m}}return n}const bn={morning:{sky:"#d5e3d9",ambient:"#e2eee7",sun:"#fff4dd",power:1.5,exposure:1.16,position:[-7,5,1],lamp:0},afternoon:{sky:"#d8e3c9",ambient:"#d9e6e4",sun:"#fff2ce",power:1.65,exposure:1.12,position:[-6,8,-3],lamp:0},sunset:{sky:"#e5cba5",ambient:"#d9c8c0",sun:"#ffbe77",power:2.1,exposure:.95,position:[-4.8,3.2,-6],lamp:9},night:{sky:"#617681",ambient:"#9cb5d9",sun:"#accdf0",power:.32,exposure:.94,position:[-3,6,-6],lamp:10}};class Hu{renderer;scene=new ms;camera=new ar(-5,5,4,-4,.1,70);room=new at;goalItems;bagItems;bodies=new Map;sunlight=new gs("#fff0cf",3.2);ambient=new _s("#d9e6e4","#a69271",2.1);lamp=new vs("#ffd79d",0,7,1.7);bulb;furniture=new Map;hoverRoot=null;hoverEdges=[];chair=new at;movingChair=!1;movingTrash=!1;furnitureGrab=null;furnitureLive=null;movingBag=!1;bagGrab=null;bagLive=null;containerPreview=null;listHover=null;panTarget=null;chairTurn=0;drawers=new at;drawerOpen=!1;flap=new at;closetDoor=new at;closetFixed=new at;halos=new Map;state;selected=null;hinted=[];guideId=null;guideArrow;targetMarks=new Map;validTargets=new Set;landingMark;ghost=null;ghostKey="";ghostCache=new Map;assistance=!1;previewOrientation=null;heldRotation=null;heldUpright;lastPointer=null;panOffset=new ie;route;period="afternoon";hud;width=1;height=1;viewLeft=0;viewTop=0;viewHeight=1;zoomLevel=1;angle=-.15;cameraAngle=-.15;zoomActual=1;request=0;last=0;time=0;stopped=!1;disposed=!1;dragged=null;dragSession=null;dragPlane=new nn;dragNormal=new ie;dragPoint=new ie;dragOffset=new ie;dragFollowers=new Set;settling=new Map;pointerUpdate=null;pickMeshes=[];placementSurfaces=[];lastProjection=null;landingSurface=null;landingSwitch=null;cameraDirty=!0;bodyTarget=new ie;bodyScale=new ie;dragShadow;dragCasters=new Map;dragVariants=new Map;media=window.matchMedia("(prefers-reduced-motion: reduce)");reduced=this.media.matches;ray=new Ss;pointer=new xt;cutaway=[];cutawayDirty=!0;projected=new ie;projectionAt=0;report;constructor(n,t,i){this.state=t,this.report=i,this.renderer=new Cu({canvas:n,antialias:!0,alpha:!1,powerPreference:"high-performance"}),this.renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,1.75)),this.renderer.shadowMap.enabled=!0,this.renderer.shadowMap.type=Pn,this.renderer.toneMapping=Ti,this.renderer.toneMappingExposure=bn.afternoon.exposure,this.renderer.outputColorSpace=Mi,this.scene.background=new qe(bn.afternoon.sky),this.scene.add(this.room,this.ambient,this.sunlight),this.sunlight.position.set(...bn.afternoon.position),this.sunlight.target.position.set(0,0,.4),this.scene.add(this.sunlight.target),this.sunlight.castShadow=!0,this.sunlight.shadow.mapSize.set(this.renderer.getPixelRatio()>1.5?2048:1536,this.renderer.getPixelRatio()>1.5?2048:1536),Object.assign(this.sunlight.shadow.camera,{left:-6,right:6,top:6,bottom:-6,near:.1,far:24}),this.sunlight.shadow.bias=-35e-5,this.sunlight.shadow.normalBias=.025,this.sunlight.shadow.radius=4,this.sunlight.shadow.intensity=.62,this.makeArchitecture(),this.room.updateMatrixWorld(!0),this.room.traverse(o=>{if(!(o instanceof ye))return;const s=new cn().setFromObject(o);!o.userData.keepArchitecture&&s.getCenter(new ie).x<-2.95&&s.max.y>.5&&this.cutaway.push({mesh:o,bounds:s})}),this.makeFurniture(),this.bulb=Pt(this.room,.043,[-2.56,2.05,-.64],Z("#fff0c8",{emissive:"#ffce80",emissiveIntensity:.1})),this.lamp.position.set(-2.52,2,-.64),this.room.add(this.lamp);const a=this.markerTexture();for(const[o,s]of Object.entries(dn)){const p=new Bn(new Ta({map:a,transparent:!0,depthTest:!1,depthWrite:!1}));p.position.set(...s.anchor),p.renderOrder=9,p.visible=!1,this.room.add(p),this.targetMarks.set(o,p)}this.guideArrow=new Bn(new Ta({map:this.markerTexture(!0),transparent:!0,depthTest:!1,depthWrite:!1})),this.guideArrow.renderOrder=10,this.guideArrow.visible=!1,this.room.add(this.guideArrow),this.landingMark=new ye(new ba(.26,.29,48),new Cn({color:"#a9e1c1",transparent:!0,opacity:.9,side:vt,depthTest:!1})),this.dragShadow=fn(this.room,[0,.065,0],1,1,.28),this.dragShadow.visible=!1,this.dragShadow.raycast=()=>{},this.landingMark.rotation.x=-Math.PI/2,this.landingMark.visible=!1,this.landingMark.renderOrder=8,this.room.add(this.landingMark);const r=new xi().setAttribute("position",new pi(new Float32Array(72),3));this.route=new Aa(r,new Es({color:"#ffe5a3",dashSize:.12,gapSize:.09,transparent:!0,opacity:.8,depthTest:!1})),this.route.renderOrder=7,this.route.visible=!1,this.room.add(this.route),this.setState(t,null,[]),this.media.addEventListener("change",this.onMotion),document.addEventListener("visibilitychange",this.onVisibility),this.request=requestAnimationFrame(this.tick)}markerTexture(n=!1){return bt((t,i)=>{t.lineCap="round",t.lineJoin="round",n?(t.shadowColor="rgba(70,48,15,.5)",t.shadowBlur=8,t.fillStyle="#ffe28d",t.beginPath(),t.moveTo(i*.39,i*.12),t.lineTo(i*.61,i*.12),t.lineTo(i*.61,i*.51),t.lineTo(i*.81,i*.51),t.lineTo(i*.5,i*.86),t.lineTo(i*.19,i*.51),t.lineTo(i*.39,i*.51),t.closePath(),t.fill(),t.strokeStyle="#fff8d3",t.lineWidth=5,t.stroke()):(t.fillStyle="rgba(38,62,47,.8)",t.beginPath(),t.arc(i/2,i/2,i*.35,0,Math.PI*2),t.fill(),t.strokeStyle="#f8e5a5",t.lineWidth=6,t.stroke(),t.strokeStyle="#fff4c2",t.lineWidth=13,t.beginPath(),t.moveTo(i*.5,i*.31),t.lineTo(i*.5,i*.67),t.moveTo(i*.34,i*.53),t.lineTo(i*.5,i*.69),t.lineTo(i*.66,i*.53),t.stroke())},128)}makeArchitecture(){const n=Xn(),t=Z("#fff3da",{roughness:1}),i=Z("#66836a",{roughness:.94});J(this.room,[6.9,.25,5.9],[0,-.16,0],n,.06);for(let m=0;m<3;m++)for(let g=0;g<2;g++){const v=-1.62+g*3.24,_=-1.86+m*1.86;J(this.room,[3.22,.08,1.84],[v,.005,_],Lu((g+m)%2===0),.015);for(const R of[-1.57,1.57])J(this.room,[.055,.086,1.84],[v+R,.009,_],i,.005)}J(this.room,[6.7,3.4,.14],[0,1.65,-2.8],t);for(const m of[-3.3,-1.6,.55,3.3])J(this.room,[.1,3.42,.17],[m,1.66,-2.68],n,.025);for(const m of[.14,2.82,3.36])J(this.room,[6.72,.105,.2],[0,m,-2.7],n,.02);for(const[m,g]of[-1.06,-.02].entries()){J(this.room,[1.01,2.54,.035],[g,1.45,-2.685],Z(qt.paper),.009);const v=new ye(new Ct(.99,2.52),Z("#ffffff",{map:bt((R,L)=>La(R,L,m?"journal":"plant",.99/2.52)),roughness:1}));v.position.set(g,1.45,-2.662),v.receiveShadow=!0,this.room.add(v);const _=mt(this.room,.035,.035,.012,[g+(g<-.5?.36:-.36),1.08,-2.617],Z("#655b43"),20);_.rotation.x=Math.PI/2}const a=bt((m,g)=>{m.fillStyle="#ffefca",m.fillRect(0,0,g,g),m.fillStyle="#db946f",m.fillRect(0,0,g,g*.24),m.fillStyle="#674f36",m.font=`bold ${g*.12}px sans-serif`,m.textAlign="center",m.fillText("11 月",g/2,g*.17),m.font=`${g*.06}px sans-serif`;for(let v=1;v<=30;v++)m.fillText(String(v),g*.12+(v-1)%7*g*.125,g*.4+Math.floor((v-1)/7)*g*.12)},256),r=new ye(new Ct(.4,.54),Z("#ffffff",{map:a}));r.position.set(-1.32,2.16,-2.59),this.room.add(r);const o=new at;o.position.set(-.54,3.04,-2.57),o.rotation.x=Math.PI/2,mt(o,.19,.19,.045,[0,0,0],n),mt(o,.165,.165,.05,[0,.01,0],Z("#fff5d8")),J(o,[.014,.01,.12],[0,.04,-.04],Z("#78624a"));const s=J(o,[.012,.01,.09],[.025,.04,0],Z("#78624a"));s.rotation.y=.8,this.room.add(o);const p=bt((m,g)=>{m.fillStyle=qt.ground,m.fillRect(0,0,g,g);let v=317;const _=()=>(v=v*1664525+1013904223>>>0,v/4294967296);for(let R=0;R<24;R++){const L=_()*g,h=_()*g,u=g*(.12+_()*.24),M=m.createRadialGradient(L,h,0,L,h,u);M.addColorStop(0,R%2?"rgba(217,221,165,.12)":"rgba(66,104,67,.09)"),M.addColorStop(1,"rgba(179,194,161,0)"),m.fillStyle=M,m.fillRect(L-u,h-u,u*2,u*2)}for(let R=0;R<14e3;R++){const L=_()*g,h=_()*g;m.strokeStyle=R%2?"rgba(246,238,185,.065)":"rgba(52,83,47,.045)",m.lineWidth=.7,m.beginPath(),m.moveTo(L,h),m.lineTo(L+_()*3+.5,h+_()*1.5),m.stroke()}},1024);p.wrapS=p.wrapT=Ja,p.repeat.set(8,8);const d=new ye(new Ct(200,200),Z("#ffffff",{map:p,roughness:1}));d.rotation.x=-Math.PI/2,d.position.y=-.31,d.receiveShadow=!0,d.raycast=()=>{},this.scene.add(d),fn(this.scene,[0,-.302,0],10,8,.16)}makeFurniture(){const n=Xn(),t=Xn(!0),i=Z("#704c34"),a=new at;a.rotation.y=Math.PI/2,a.position.set(-.47,0,.15),this.room.add(a);const r=new at;r.userData.location="desk",this.furniture.set("desk",r),a.add(r),J(r,[2.92,.12,1.38],[.05,1.38,-1.88],t,.035),J(r,[2.7,.16,.13],[.05,1.24,-2.43],n);for(const y of[-1.22,1.32])for(const N of[-2.36,-1.4])J(r,[.095,1.32,.095],[y,.7,N],n,.015);J(r,[.74,1.08,.88],[.95,.78,-2.02],n,.025),this.drawers.userData.location="drawer",this.furniture.set("drawer",this.drawers),a.add(this.drawers);for(let y=0;y<3;y++){const N=.43+y*.34;J(this.drawers,[.69,.31,.045],[.95,N,-1.565],t,.008),J(this.drawers,[.22,.035,.045],[.95,N+.02,-1.525],i,.01),J(this.drawers,[.63,.025,.72],[.95,N-.13,-1.91],t,.004);for(const ae of[.65,1.25])J(this.drawers,[.025,.23,.72],[ae,N-.02,-1.91],t,.004)}const o=J(r,[1.85,.012,.93],[-.25,1.44,-1.83],Z("#88a58b",{roughness:.92}),.025);o.userData.location="desk",fn(a,[.05,.052,-1.88],3.4,1.9,.27);const s=this.chair;s.userData.location="seat",this.furniture.set("seat",s),s.position.set(-1.19,0,.4),s.rotation.y=Math.PI/2+.12,this.room.add(s);for(const y of[-.25,.25])for(const N of[-.23,.23])J(s,[.055,.72,.055],[y,.41,N],n,.012);J(s,[.65,.085,.59],[0,.8,0],t,.035);for(const y of[-.25,.25])J(s,[.06,.64,.06],[y,1.08,.25],n,.01);J(s,[.63,.3,.055],[0,1.27,.25],t,.025);const p=new at;p.rotation.y=0,p.position.x=4.55,this.room.add(p);const d=new at;d.userData.location="shelf",this.furniture.set("shelf",d),p.add(d),J(d,[1.52,2.08,.055],[-2.48,1.09,-2.47],Z("#a7b491"));for(const y of[-3.2,-1.76])J(d,[.085,2.16,.7],[y,1.1,-2.14],n);for(const y of[.19,.81,1.43,2.05])J(d,[1.5,.065,.72],[-2.48,y,-2.12],t);fn(p,[-2.48,.052,-2.1],2,1.2,.3);const m=new at;m.userData.location="hooks",this.furniture.set("hooks",m),this.room.add(m),J(m,[.64,.11,.045],[1,1.64,-2.67],t,.015),Mt(m,[[1,1.65,-2.63],[1,1.61,-2.41],[1,1.67,-2.4]],.018,Z("#887653"));const g=Z(qt.cream);for(const y of[-2.08,2.08])J(this.room,[.16,3.38,1.38],[3.3,1.65,y],g,.015);J(this.room,[.16,.63,2.8],[3.3,3.06,0],g,.015);for(const y of[-2.75,-1.39,1.39,2.75])J(this.room,[.18,3.43,.1],[3.22,1.66,y],n,.02);for(const y of[.14,2.73,3.36])J(this.room,[.2,.1,5.6],[3.23,y,0],n,.02);const v=new at;v.position.set(3.85,0,0),v.rotation.y=-Math.PI/2,this.furniture.set("cabinet",v),this.room.add(v),J(v,[2.64,2.65,.08],[0,1.4,-.56],Z(qt.cream),.015);for(const y of[-1.3,1.3])J(v,[.1,2.65,1.16],[y,1.4,0],n,.035);for(const y of[.14,1.07,2.61])J(v,[2.67,.1,1.16],[0,y,0],t,.025);J(v,[2.28,.17,.91],[0,1.22,-.015],Z("#f7e7bb"),.075),J(v,[1.7,.19,.88],[.26,1.36,0],Z("#95b09c",{roughness:1}),.08),J(v,[.52,.16,.68],[-.87,1.39,-.015],Z("#fff4d8"),.065),J(v,[1.55,.022,.86],[.3,1.465,.005],Z("#b9ceb0"),.025);for(const y of[-.25,.12,.49,.86])J(v,[.055,.012,.83],[y,1.48,0],Z("#e9e8ca"),.008);const _=(y,N)=>{y.userData.door="closet",J(y,[1.27,2.46,.045],[0,0,0],Z(qt.paper),.015);const ae=new ye(new Ct(1.23,2.42),Z("#ffffff",{map:bt((ee,re)=>La(ee,re,N,1.23/2.42)),roughness:1}));ae.position.z=.026,ae.receiveShadow=!0,y.add(ae);for(const ee of[-.63,.63])J(y,[.035,2.48,.06],[ee,0,.01],n,.005);const Y=mt(y,.035,.035,.012,[.46,-.12,.038],i,20);Y.rotation.x=Math.PI/2,y.position.set(.64,1.42,.65),v.add(y)},R=this.closetFixed;_(R,"plant"),R.position.set(-.64,1.42,.58),_(this.closetDoor,"journal");const L=bt((y,N)=>{y.fillStyle="#f8edce",y.fillRect(0,0,N,N),y.fillStyle="#547965",y.font=`bold ${N*.12}px sans-serif`,y.textAlign="center",y.fillText("睡覺的小窩",N/2,N*.42),y.font=`${N*.085}px sans-serif`,y.fillText("下層可以收東西",N/2,N*.68)},256),h=new ye(new Ct(.87,.35),Z("#ffffff",{map:L}));h.rotation.y=-Math.PI/2,h.position.set(4.36,2.25,0),this.room.add(h);const u=new at;u.userData.location="cabinet",this.room.add(u),J(u,[1.12,.065,2.54],[3.75,.19,0],t,.015);const M=new ye(new ln(1.24,.9,2.64),new Cn({visible:!1}));M.position.set(3.72,.62,0),u.add(M);const b=new at;b.position.set(2.15,.1,1.05),b.scale.setScalar(.68),b.userData.location="bag",this.furniture.set("bag",b),this.room.add(b);const T=Z("#788f78",{roughness:.98}),D=Z("#c9bc92"),w=Z("#3e5549"),c=new br;c.moveTo(-.4,.05),c.quadraticCurveTo(-.46,.05,-.46,.15),c.lineTo(-.46,.62),c.bezierCurveTo(-.46,1.02,.46,1.02,.46,.62),c.lineTo(.46,.15),c.quadraticCurveTo(.46,.05,.4,.05),c.closePath();const E=new ye(new Ar(c,{depth:.44,bevelEnabled:!0,bevelSegments:3,steps:1,bevelSize:.055,bevelThickness:.055,curveSegments:16}),T);E.position.z=-.22,E.castShadow=!0,E.receiveShadow=!0,b.add(E),J(b,[.63,.025,.28],[0,.895,0],w,.06);const W=new ye(new Yn(.23,.23,.4,24,1,!0,0,Math.PI),T);W.scale.x=1.55,W.position.set(.435,.325,0),W.material=T.clone(),W.material.side=vt,W.castShadow=!0,W.receiveShadow=!0,b.add(W);const F=mt(b,.23,.23,.018,[.435,.125,0],T);F.scale.x=1.55;const B=[];for(let y=0;y<=24;y++){const N=y*Math.PI/24;B.push([.435+Math.sin(N)*.23*1.55,.525,Math.cos(N)*.23])}Mt(b,B,.018,D),J(b,[.69,.36,.13],[0,.29,.3],T,.055);const K=new ye(new Ct(.22,.23),Z("#ffffff",{map:bt((y,N)=>{y.fillStyle=qt.cream,y.fillRect(0,0,N,N),$n(y,N*.02,0,N*.95)},128)}));K.position.set(0,.28,.371),b.add(K),Mt(b,[[-.29,.47,.365],[0,.49,.37],[.29,.47,.365]],.012,D),J(b,[.035,.07,.018],[.22,.43,.38],Z("#baaa79",{metalness:.35}),.006);for(const y of[-.23,.23])Mt(b,[[y,.74,-.29],[y,.44,-.47],[y,.12,-.31]],.045,T);Mt(b,[[-.14,.86,-.09],[-.14,1.02,-.1],[.14,1.02,-.1],[.14,.86,-.09]],.032,T),this.flap.position.set(0,.897,-.176),this.flap.userData.location="bag",b.add(this.flap),J(this.flap,[.65,.035,.15],[0,0,.04],T,.011),fn(this.room,[2.15,.052,1.05],1.05,.8,.2);const $=new at;$.position.set(-1.25,.055,1.9),$.userData.location="trash",this.furniture.set("trash",$),this.room.add($);const C=Z("#a9976b",{roughness:.94});mt($,.25,.23,.035,[0,.025,0],C);for(let y=0;y<28;y++){const N=y/28*Math.PI*2,ae=J($,[.026,.46,.025],[Math.sin(N)*.28,.25,Math.cos(N)*.28],C,.004);ae.rotation.y=N}for(const y of[.07,.15,.23,.31,.39,.47]){const N=new ye(new Rn(.286,.014,5,40),C);N.rotation.x=Math.PI/2,N.position.y=y,$.add(N)}fn(this.room,[-1.25,.052,1.9],1.1,1.1,.24),mt(a,.17,.19,.045,[.79,1.48,-2.12],Z("#7c8873")),Mt(a,[[.79,1.5,-2.12],[.92,1.87,-2.22],[.79,2.12,-2.1]],.023,Z("#777b65"));const Q=mt(a,.055,.16,.16,[.79,2.15,-2.1],Z("#84917a",{side:vt}),32);Q.rotation.z=-.2}setParcelContents(n){const t=this.bodies.get("parcel");if(!t)return;const i=t.group.userData.cartonContents;if(i?.userData.key===n.join(":"))return;i&&(t.group.remove(i),this.disposeObject(i));const a=new at;a.userData.key=n.join(":"),t.group.userData.cartonContents=a,n.forEach((r,o)=>{const s=Vn(r,ot[r].art==="book",!0);s.traverse(p=>{delete p.userData.item}),s.scale.setScalar(.23),s.position.set(-.29+o%4*.19,-.04+Math.floor(o/12)*.08,-.28+Math.floor(o/4)%3*.24),a.add(s)}),t.group.add(a),this.refreshPickMeshes()}setState(n,t,i,a=null,r=!1,o,s){if(this.assistance=r,this.goalItems=o,this.bagItems=s,this.selected!==t&&(this.heldRotation=null,this.heldUpright=void 0,this.previewOrientation=null,this.dragged!==t&&this.clearPreview()),this.selected!==t&&(this.landingSurface=null,this.landingSwitch=null),this.placementSurfaces=Ms(n),this.drawerOpen=n.drawerOpen??this.drawerOpen,this.state=n,this.selected=t,this.hinted=i,this.guideId=a,this.dragged||(this.landingMark.visible=!1),this.validTargets.clear(),t)for(const d of Object.keys(dn))Xt(n,t,d)||this.validTargets.add(d);const p=Iu(n);for(const d of n.items){const m=p[d.id];let g=this.bodies.get(d.id);const v=!["floor","work","desk"].includes(d.location)||ot[d.id].art==="blocks"&&!!this.state.containers&&this.state.containers[d.id]===!1;if(!g||d.id!==this.dragged&&(g.upright!==m.upright||g.stored!==v||d.id==="parcel"&&g.group.userData.folded!==!!n.cartonFolded)){const _=g?.group.position.clone();g&&(this.room.remove(g.group),this.disposeObject(g.group));const R=Vn(d.id,m.upright,v,!!n.cartonFolded);R.position.copy(_??new ie(...m.position)),R.scale.setScalar(m.scale),R.rotation.y=m.rotation,this.room.add(R),g={group:R,pose:m,upright:m.upright,stored:v},this.bodies.set(d.id,g)}if(g.pose=m,g.group.userData.location=d.location,g.group.visible=Ra({...n,drawerOpen:this.drawerOpen},d),this.reduced&&d.id!==this.dragged&&!this.dragFollowers.has(d.id)&&(g.group.position.set(...m.position),g.group.rotation.y=m.rotation,g.group.scale.setScalar(m.scale)),!this.halos.has(d.id)){const _=new ye(new ba(.32,.345,48),new Cn({color:"#f7e3a4",transparent:!0,opacity:.85,depthTest:!1,side:vt}));_.rotation.x=-Math.PI/2,_.renderOrder=6,this.room.add(_),this.halos.set(d.id,_)}}for(const[d,m]of this.bodies)if(!p[d]){this.room.remove(m.group),this.disposeObject(m.group),this.bodies.delete(d);const g=this.halos.get(d);g&&(this.room.remove(g),this.disposeObject(g),this.halos.delete(d))}this.refreshPickMeshes(),this.cutawayDirty=!0,this.projectionAt=0}refreshPickMeshes(){this.pickMeshes=[],this.room.traverse(n=>{if(!(n instanceof ye))return;let t=n;for(;t&&t!==this.room;){if(t===this.ghost)return;if(t.userData.item||t.userData.location||t.userData.door){this.pickMeshes.push(n);return}t=t.parent}})}capture(){return this.renderer.render(this.scene,this.camera),this.renderer.domElement.toDataURL("image/png")}setPeriod(n){Object.hasOwn(bn,n)&&(this.period=n)}zoom(n){this.cameraDirty=!0,this.zoomLevel=et.clamp(this.zoomLevel+n,.75,2.2)}rotate(){this.cameraDirty=!0,this.angle=this.angle===-.15?.15:-.15}resetCamera(){this.cameraDirty=!0,this.angle=-.15,this.zoomLevel=1,this.panOffset.set(0,0,0),this.panTarget=null}navigate(n,t,i=!1){if(this.cameraDirty=!0,this.panTarget=null,i)this.angle=et.clamp(this.angle+n*.004,-.5,.55);else{const a=(this.camera.right-this.camera.left)/(this.width-this.viewLeft)/this.camera.zoom,r=new ie().setFromMatrixColumn(this.camera.matrixWorld,0),o=new ie().setFromMatrixColumn(this.camera.matrixWorld,1);this.panOffset.addScaledVector(r,-n*a).addScaledVector(o,t*a),this.panOffset.clampLength(0,2.4)}this.cutawayDirty=!0}turnHeld(n=!1){if(this.movingChair||this.movingBag||this.movingTrash){this.chairTurn=(this.chairTurn+Math.PI/2+Math.PI)%(Math.PI*2)-Math.PI,this.lastPointer&&(this.movingBag?this.previewBag(this.lastPointer.x,this.lastPointer.y):this.movingTrash?this.previewTrash(this.lastPointer.x,this.lastPointer.y):this.previewChair(this.lastPointer.x,this.lastPointer.y));return}if(!this.selected)return;const t=this.state.items.find(a=>a.id===this.selected),i=zn(t.location,t.spot?.surface);return n?this.heldUpright=!(this.dragged?this.bodies.get(this.dragged).upright:this.heldUpright??this.previewOrientation?.upright??t.spot?.upright??hn(t.id,i)):this.heldRotation=((this.dragSession?this.bodies.get(this.dragged).group.rotation.y-this.dragSession.rotationBasis:this.heldRotation??this.previewOrientation?.rotation??t.spot?.rotation??0)+Math.PI/2+Math.PI)%(Math.PI*2)-Math.PI,n&&this.dragged&&this.dragPosture(this.heldUpright),this.lastPointer&&(this.dragged?this.drag(this.dragged,this.lastPointer.x,this.lastPointer.y):this.preview(this.selected,this.lastPointer.x,this.lastPointer.y)),{rotation:this.heldRotation??this.previewOrientation?.rotation??0,upright:this.heldUpright??this.previewOrientation?.upright??!1}}setHudBounds(n){this.hud=n,this.resize(this.width,this.height)}resize(n,t){this.width=n,this.height=t,this.renderer.setSize(n,t,!1),this.viewLeft=0,this.viewTop=0,this.viewHeight=t,this.renderer.setViewport(0,0,n,t),this.cameraDirty=!0,this.cutawayDirty=!0,this.updateCamera(1),this.dragged&&this.lastPointer&&this.drag(this.dragged,this.lastPointer.x,this.lastPointer.y),this.projectionAt=0}updateCamera(n){if(!this.cameraDirty&&!this.cutawayDirty&&Math.abs(this.cameraAngle-this.angle)<1e-5&&Math.abs(this.zoomActual-this.zoomLevel)<1e-5&&(!this.panTarget||this.panOffset.distanceToSquared(this.panTarget)<1e-10))return!1;this.cameraDirty=!1;const t=this.cameraAngle;return this.cameraAngle=et.lerp(this.cameraAngle,this.angle,n),this.zoomActual=et.lerp(this.zoomActual,this.zoomLevel,n),xs(this.camera,this.width,this.height,this.cameraAngle,this.zoomActual,{objectiveBottom:0,actionTop:this.height,...this.hud}),this.panTarget&&this.panOffset.lerp(this.panTarget,n),this.camera.position.add(this.panOffset),this.camera.updateMatrixWorld(),(this.cutawayDirty||Math.abs(t-this.cameraAngle)>1e-4)&&(this.updateCutaway(),this.cutawayDirty=!1),!0}updateCutaway(){const n=[];for(let r=-1.3;r<=1.4;r+=.25)for(let o=-2.45;o<=-1.25;o+=.2){const s=wr(r,o);n.push(new ie(s.x,1.53,s.z))}for(let r=1.4;r<=2.75;r+=.2)for(let o=.3;o<=2;o+=.2)n.push(new ie(r,o,-1.92));for(const r of this.bodies.values())n.push(new ie(...r.pose.position));const t=this.camera.getWorldDirection(new ie),i=new Ts,a=new ie;for(const r of this.cutaway)r.mesh.visible=!n.some(o=>{i.origin.copy(o).addScaledVector(t,-40),i.direction.copy(t);const s=i.intersectBox(r.bounds,a);return!!s&&s.distanceTo(i.origin)<39.94})}project(n){return this.projected.set(...n).project(this.camera),{x:(this.projected.x*.5+.5)*(this.width-this.viewLeft)+this.viewLeft,y:(-.5*this.projected.y+.5)*this.viewHeight+this.viewTop,visible:this.projected.z<1&&Math.abs(this.projected.x)<1.15&&Math.abs(this.projected.y)<1.15}}publish(){const n={};for(const[d,m]of this.bodies){const g=m.group.position;n[d]=this.project([g.x,g.y+(m.upright?.17:.11),g.z]),n[d].visible&&=m.group.visible}const t={},i=this.furniture.get("bag").localToWorld(new ie(0,.45,.36));for(const[d,m]of Object.entries(dn))t[d]=this.project(d==="bag"?[i.x,i.y,i.z]:d==="trash"?[this.state.trash?.x??-1.25,.6,this.state.trash?.z??1.9]:d==="seat"?[this.state.chair?.x??-1.19,1,this.state.chair?.z??.4]:m.anchor);const a=this.guideArrow.position,r=(this.camera.right-this.camera.left)/this.width,o={items:n,targets:t,doors:{closet:this.project([3.1,1.65,-.55]),cabinet:this.project([3.1,.7,.65])},guide:this.guideArrow.visible?this.project([a.x,a.y-(this.reduced?0:Math.sin(this.time*2.8)*r*4),a.z]):null,note:this.project([-1.9,2.3,-2.65]),activity:n[this.selected??this.guideId??""]??this.project([-1.5,1.55,.4])},s=this.lastProjection,p=(d,m)=>!d||!m?d!==m:d.visible!==m.visible||Math.abs(d.x-m.x)>.45||Math.abs(d.y-m.y)>.45;s&&!Object.keys(n).some(d=>p(n[d],s.items[d]))&&Object.keys(n).length===Object.keys(s.items).length&&!Object.keys(t).some(d=>p(t[d],s.targets[d]))&&!p(o.guide,s.guide)&&!p(o.activity,s.activity)&&!p(o.doors.closet,s.doors.closet)||(this.lastProjection=o,this.report(o))}setRay(n,t){this.pointer.set((n-this.viewLeft)/(this.width-this.viewLeft)*2-1,-(t-this.viewTop)/this.viewHeight*2+1),this.ray.setFromCamera(this.pointer,this.camera)}pick(n,t,i=!1){this.setRay(n,t);const a=this.ray.intersectObjects(this.pickMeshes,!1);let r=null;for(const o of a){let s=o.object;const p={};let d=!1;for(;s&&s!==this.room;)s.visible||(d=!0),s.userData.item&&(p.item=s.userData.item),s.userData.location&&(p.location=s.userData.location),s.userData.door&&(p.door=s.userData.door),s=s.parent;if(!(d||p.item===this.dragged)){if(p.item)return p;if(p.location||p.door){r=p;break}}}if(r)return r;if(!i){let o=22,s;for(const[p,d]of this.bodies)if(d.group.visible&&p!==this.dragged){const m=d.group.position,g=this.project([m.x,m.y+(d.upright?.17:.11),m.z]),v=Math.hypot(g.x-n,g.y-t);g.visible&&v<o&&(o=v,s=p)}if(s)return{item:s,location:this.state.items.find(p=>p.id===s).location}}{let o=1/0,s;for(const[p,d]of Object.entries(dn)){const m=p==="bag"?this.state.bag:p==="trash"?this.state.trash:p==="seat"?this.state.chair:void 0,g=m?new ie(m.x,p==="bag"?.43:p==="trash"?.38:.85,m.z):new ie(...d.center),v=new cn().setFromCenterAndSize(g,new ie(...d.size)),_=this.ray.ray.intersectBox(v,new ie);if(_){const R=_.distanceTo(this.camera.position);R<o&&(o=R,s=p)}}if(s)return{location:s}}return null}landing(n,t,i){this.setRay(t,i);const a=this.state.items.find(_=>_.id===n);if(!a)return null;if(ot[n].art==="clothes"){const _=dn.hooks,R=new cn().setFromCenterAndSize(new ie(..._.center),new ie(..._.size));if(this.ray.ray.intersectBox(R,new ie)){const L=fi(this.state,n,"hooks");if(L)return{location:"hooks",spot:L,error:Xt(this.state,n,"hooks",L)}}}const r=this.state.items.filter(_=>_.id!==n&&ot[_.id].container&&!wa(this.state,_.id,n)).flatMap(_=>{const R=this.bodies.get(_.id);if(!R?.group.visible)return[];const L=R.group.position,h=new cn().setFromCenterAndSize(L.clone().add(new ie(0,.07,0)),new ie(.72,.42,.5).multiplyScalar(Math.max(.65,R.pose.scale))),u=this.ray.ray.intersectBox(h,new ie);return u?[{parent:_,point:u,distance:u.distanceTo(this.camera.position)}]:[]}).sort((_,R)=>_.distance-R.distance);if(r[0]){const _=r[0].parent,R=bs(this.state,n,_.id);if(R)return{location:_.location,spot:R,error:Xt(this.state,n,_.location,R)}}const o=As(this.state),s=new cn(new ie(o.left-.08,.06,o.back-.08),new ie(o.right+.08,.91,o.front+.08));if(this.ray.ray.intersectBox(s,new ie)){const _=fi(this.state,n,"bag");return _?{location:"bag",spot:_,error:Xt(this.state,n,"bag",_)}:{location:"bag",error:Xt(this.state,n,"bag")??"書包放不下這件物品，換個大一點的位置吧。"}}const p=dn.trash,d=new cn().setFromCenterAndSize(new ie(this.state.trash?.x??p.center[0],p.center[1],this.state.trash?.z??p.center[2]),new ie(...p.size));if(this.ray.ray.intersectBox(d,new ie)){const _=fi(this.state,n,"trash",!1,this.heldRotation??void 0);return _?{location:"trash",spot:_,error:Xt(this.state,n,"trash",_)}:{location:"trash",error:Xt(this.state,n,"trash")??"桶裡有點擠，先挪動裡面的東西再試試。"}}const m=[];for(const _ of this.placementSurfaces){if(_.parent===n||!Rs(_,this.state,this.drawerOpen))continue;const R=this.ray.ray.intersectPlane(new nn(new ie(0,1,0),-_.y),new ie);if(!R)continue;const L=ws(_,R),h=_.bounds;if(L.x<h.left-.08||L.x>h.right+.08||L.z<h.back-.08||L.z>h.front+.08)continue;const u=ot[n].art==="clothes"?hn(n,_):ot[n].art==="book"&&_.location==="shelf"&&!_.parent?this.heldUpright??hn(n,_):this.heldUpright??a.spot?.upright??hn(n,_),M=_.coordinates==="table"?Math.PI/2:_.origin?.rotation??0,b=n==="cushion"&&_.id==="seat"||ot[n].art==="book"&&_.location==="shelf"&&!_.parent&&u?0:this.dragged===n?Math.atan2(Math.sin(this.bodies.get(n).group.rotation.y-M),Math.cos(this.bodies.get(n).group.rotation.y-M)):this.heldRotation??a.spot?.rotation??(_.coordinates==="table"?Si(a,this.state).rotation:0),T=Pa(n,b,u,_.scale/(_.unit??1)),D=T.x*2<=h.right-h.left?et.clamp(L.x,h.left+T.x+.002,h.right-T.x-.002):L.x,w=T.z*2<=h.front-h.back?et.clamp(L.z,h.back+T.z+.002,h.front-T.z-.002):L.z,c=_.id==="table"?Ps(D):_.location;m.push({location:c,spot:{x:D,z:w,rotation:b,surface:_.id,upright:u},distance:R.distanceTo(this.camera.position)})}let g=m.sort((_,R)=>_.distance-R.distance)[0];if(!g)return this.landingSurface=null,this.landingSwitch=null,null;const v=m.find(_=>_.spot.surface===this.landingSurface);return v&&v!==g&&!Xt(this.state,n,v.location,v.spot)?(this.landingSwitch?.surface!==g.spot.surface&&(this.landingSwitch={surface:g.spot.surface,x:t,y:i}),Math.hypot(t-this.landingSwitch.x,i-this.landingSwitch.y)<5&&(g=v)):this.landingSwitch=null,this.landingSurface!==g.spot.surface&&(this.landingSurface=g.spot.surface,this.landingSwitch=null),{location:g.location,spot:g.spot,error:Xt(this.state,n,g.location,g.spot)}}preview(n,t,i){this.lastPointer={x:t,y:i};const a=this.landing(n,t,i);return a?.spot?this.previewSpot(a.location,a.spot,!!a.error,n):this.clearPreview(),a}previewSpot(n,t,i,a=this.selected){const r=zn(n,t.surface,this.state);if(!r||!a)return;this.containerPreview=i?null:r.parent??null;const o=Rr(n,t,this.state),s=t.upright??hn(a,r);this.previewOrientation={rotation:t.rotation,upright:s};const p=Pa(a,t.rotation,s,r.scale);this.landingMark.visible=!0,this.landingMark.position.set(o.x,r.y+.012,o.z),this.landingMark.scale.set(Math.max(.55,p.x/.28),Math.max(.55,p.z/.28),1),this.landingMark.material.color.set(i?"#df9678":"#a9e1c1");const d=`${a}:${s}:${!["work","desk","floor"].includes(n)}`;this.useGhost(d,()=>{const g=Vn(a,s,!["work","desk","floor"].includes(n),!!this.state.cartonFolded);return g.traverse(v=>{if(v instanceof ye){for(const _ of Array.isArray(v.material)?v.material:[v.material])_.transparent=!0,_.opacity=.24,_.depthWrite=!1;v.raycast=()=>{},v.castShadow=!1}}),g});const m=Gr(a,n,t,this.state);this.ghost.position.set(...m.position),this.ghost.rotation.y=m.rotation,this.ghost.scale.setScalar(m.scale)}useGhost(n,t){if(this.ghostKey!==n||!this.ghost){this.ghost&&(this.ghost.visible=!1);const i=n.split(":")[0];for(const[r,o]of this.ghostCache)r.split(":")[0]!==i&&(this.room.remove(o),this.disposeObject(o),this.ghostCache.delete(r));let a=this.ghostCache.get(n);a||(a=t(),this.ghostCache.set(n,a),this.room.add(a)),this.ghost=a,this.ghostKey=n}return this.ghost.visible=!0,this.ghost}clearPreview(){this.containerPreview=null,this.landingMark.visible=!1,this.ghost&&(this.ghost.visible=!1)}focusGuide(n){if(this.cameraDirty=!0,!n){this.resetCamera();return}const t=this.state.items.find(d=>d.id===n),i=this.bodies.get(n);if(!t||!i)return;const a=t.location==="cabinet"&&!this.state.cabinetOpen?new ie(3.1,1.1,.6):i.group.position,r=this.camera.position.clone().addScaledVector(this.camera.getWorldDirection(new ie),16),o=a.clone().sub(r),s=new ie().setFromMatrixColumn(this.camera.matrixWorld,0),p=new ie().setFromMatrixColumn(this.camera.matrixWorld,1);this.panTarget=this.panOffset.clone().addScaledVector(s,o.dot(s)).addScaledVector(p,o.dot(p)),this.panTarget.clampLength(0,2.1),this.zoomLevel=1.18}highlightItem(n){this.listHover=n,this.setHover(n?{item:n}:null)}chooseBag(n){this.movingBag=n,n||(this.bagGrab=null,this.bagLive=null),n&&(this.chairTurn=this.state.bag?.rotation??0),this.clearPreview();for(const t of this.state.items)if(t.location==="bag"){const i=this.bodies.get(t.id);i&&(i.group.visible=Ra(this.state,t)&&(!n||t.spot?.surface==="bag-side"))}}beginBagDrag(n,t){this.setRay(n,t);const i=this.ray.ray.intersectPlane(new nn(new ie(0,1,0),-.055),new ie),a=this.state.bag??{x:2.15,z:1.05};this.bagGrab=i?new xt(i.x-a.x,i.z-a.z):null}bagLanding(n,t){this.setRay(n,t);const i=this.ray.ray.intersectPlane(new nn(new ie(0,1,0),-.055),new ie);if(!i)return null;const a={x:i.x-(this.bagGrab?.x??0),z:i.z-(this.bagGrab?.y??0),rotation:this.chairTurn};return{spot:a,error:Cs(this.state,a)}}previewBag(n,t){this.lastPointer={x:n,y:t};const i=this.bagLanding(n,t);if(!i){this.clearPreview();return}this.landingMark.visible=!0,this.landingMark.position.set(i.spot.x,.07,i.spot.z),this.landingMark.scale.set(2,1.35,1),this.landingMark.material.color.set(i.error?"#df9678":"#a9e1c1"),this.bagLive=i.spot;const a=this.furniture.get("bag");a.position.set(i.spot.x,.16,i.spot.z),a.rotation.y=i.spot.rotation;const r=this.state.bag??{x:2.15,z:1.05,rotation:0},o=i.spot.rotation-r.rotation,s=Math.cos(o),p=Math.sin(o);for(const d of this.state.items)if(d.location==="bag"){const m=this.bodies.get(d.id);if(!m)continue;const g=m.pose.position[0]-r.x,v=m.pose.position[2]-r.z;m.group.position.set(i.spot.x+g*s+v*p,m.pose.position[1]+.06,i.spot.z-g*p+v*s),m.group.rotation.y=m.pose.rotation+o}}queuePointerUpdate(n){this.pointerUpdate=n}flushPointerUpdate(){const n=this.pointerUpdate;this.pointerUpdate=null,n?.()}beginDrag(n,t,i){const a=this.bodies.get(n);if(!a?.group.visible)return!1;this.cancelDrag(),this.setHover(null),this.clearPreview(),this.setRay(t,i);const r=a.group;if(r.updateWorldMatrix(!0,!1),this.camera.getWorldDirection(this.dragNormal),this.dragPlane.setFromNormalAndCoplanarPoint(this.dragNormal,r.position),!this.ray.ray.intersectPlane(this.dragPlane,this.dragPoint))return!1;const o=r.worldToLocal(this.dragPoint.clone()),s=Math.max(2,this.dragOffset.copy(r.position).sub(this.camera.position).dot(this.dragNormal)-4),p=this.state.items.find(g=>g.id===n),d=this.state.items.filter(g=>wa(this.state,g.id,n)).flatMap(g=>{const v=this.bodies.get(g.id);return v?[{id:g.id,local:r.worldToLocal(v.group.position.clone())}]:[]});this.dragSession={id:n,depth:s,grab:o,rotationBasis:a.pose.rotation-(p.spot?.rotation??Si(p,this.state).rotation),followers:d,landing:null},this.dragged=n,this.dragVariants.set(a.upright,r),this.suspendDragShadows(r);const m=zn(p.location,p.spot?.surface,this.state);this.dragShadow.position.set(a.pose.position[0],m.y+.008,a.pose.position[2]),this.dragShadow.scale.setScalar(.75),this.dragShadow.visible=!0,r.position.addScaledVector(this.dragNormal,-.08),r.updateMatrixWorld(!0),this.settling.delete(n),this.dragFollowers=new Set(d.map(g=>g.id));for(const g of d)this.settling.delete(g.id);return!0}drag(n,t,i){if(this.dragged!==n||!this.dragSession)return null;const a=this.dragSession,r=this.bodies.get(n);if(this.lastPointer={x:t,y:i},this.setRay(t,i),this.camera.getWorldDirection(this.dragNormal),this.dragOffset.copy(this.camera.position).addScaledVector(this.dragNormal,a.depth),this.dragPlane.setFromNormalAndCoplanarPoint(this.dragNormal,this.dragOffset),this.ray.ray.intersectPlane(this.dragPlane,this.dragPoint)){this.heldRotation!==null&&(r.group.rotation.y=this.heldRotation+a.rotationBasis),this.dragOffset.copy(a.grab).multiply(r.group.scale).applyQuaternion(r.group.quaternion),r.group.position.copy(this.dragPoint).sub(this.dragOffset),r.group.updateMatrixWorld(!0);for(const p of a.followers){const d=this.bodies.get(p.id);this.dragOffset.copy(p.local),r.group.localToWorld(this.dragOffset),d.group.position.copy(this.dragOffset),d.group.rotation.y=d.pose.rotation+r.group.rotation.y-r.pose.rotation}}const o=this.project([r.group.position.x,r.group.position.y,r.group.position.z]),s=this.landing(n,o.x,o.y);return a.landing=s,s?.spot?(this.previewSpot(s.location,s.spot,!!s.error,n),this.dragShadow.position.copy(this.landingMark.position),this.dragShadow.position.y-=.006,this.dragShadow.scale.set(this.landingMark.scale.x*.65,this.landingMark.scale.y*.65,1),this.dragShadow.visible=!0):(this.clearPreview(),this.dragShadow.visible=!1),s}suspendDragShadows(n){n.traverse(t=>{t instanceof ye&&(this.dragCasters.set(t,t.castShadow),t.castShadow=!1)})}dragPosture(n){if(!this.dragSession)return;const t=this.bodies.get(this.dragSession.id),i=t.group;if(t.upright===n)return;let a=this.dragVariants.get(n);a||(a=Vn(this.dragSession.id,n,t.stored),this.dragVariants.set(n,a),this.suspendDragShadows(a)),a.position.copy(i.position),a.rotation.copy(i.rotation),a.scale.copy(i.scale),a.userData.location=i.userData.location,this.room.remove(i),this.room.add(a),t.group=a,t.upright=n,this.refreshPickMeshes()}endDragVisuals(n=!1){const t=this.dragSession;n&&t&&this.dragPosture(this.bodies.get(t.id).pose.upright);const i=t?this.bodies.get(t.id)?.group:null;for(const[a,r]of this.dragCasters)a.castShadow=r;this.dragCasters.clear();for(const a of this.dragVariants.values())a!==i&&this.disposeObject(a);this.dragVariants.clear(),this.dragShadow.visible=!1}settle(n){const t=this.bodies.get(n)?.group;t&&this.settling.set(n,{position:t.position.clone(),rotation:t.rotation.y,scale:t.scale.clone(),started:performance.now()})}finishDrag(n=this.dragSession?.landing??null){if(!this.dragSession)return n;if(!n||n.error)return this.cancelDrag(),n;this.endDragVisuals(),this.settle(this.dragSession.id);for(const t of this.dragSession.followers)this.settle(t.id);return this.dragged=null,this.dragSession=null,this.dragFollowers.clear(),this.clearPreview(),n}cancelDrag(){if(this.endDragVisuals(!0),this.dragSession){this.settle(this.dragSession.id);for(const n of this.dragSession.followers)this.settle(n.id)}this.dragged=null,this.dragSession=null,this.dragFollowers.clear(),this.clearPreview()}chooseChair(n){this.movingChair=n,n&&(this.chairTurn=this.state.chair?.rotation??Math.PI/2+.12),!n&&this.furnitureGrab?.kind==="chair"&&(this.furnitureGrab=null),!n&&this.furnitureLive?.kind==="chair"&&(this.furnitureLive=null),this.clearPreview()}chooseTrash(n){this.movingTrash=n,n&&(this.chairTurn=this.state.trash?.rotation??0),!n&&this.furnitureGrab?.kind==="trash"&&(this.furnitureGrab=null),!n&&this.furnitureLive?.kind==="trash"&&(this.furnitureLive=null),this.clearPreview()}beginFurnitureDrag(n,t,i){this.setRay(t,i);const a=this.ray.ray.intersectPlane(new nn(new ie(0,1,0),-.055),new ie),r=n==="chair"?this.state.chair??{x:-1.19,z:.4}:this.state.trash??{x:-1.25,z:1.9};this.furnitureGrab=a?{kind:n,x:a.x-r.x,z:a.z-r.z}:null}furnitureLanding(n,t,i){this.setRay(t,i);const a=this.ray.ray.intersectPlane(new nn(new ie(0,1,0),-.055),new ie);if(!a)return null;const r=this.furnitureGrab?.kind===n?this.furnitureGrab:null,o={x:a.x-(r?.x??0),z:a.z-(r?.z??0),rotation:this.chairTurn};return{spot:o,error:n==="chair"?Ls(this.state,o):Ds(this.state,o)}}chairLanding(n,t){return this.furnitureLanding("chair",n,t)}trashLanding(n,t){return this.furnitureLanding("trash",n,t)}previewChair(n,t){return this.previewFurniture("chair",n,t)}previewTrash(n,t){return this.previewFurniture("trash",n,t)}previewFurniture(n,t,i){this.lastPointer={x:t,y:i};const a=this.furnitureLanding(n,t,i);if(!a){this.clearPreview();return}this.furnitureLive={kind:n,spot:a.spot};const r=n==="chair"?this.chair:this.furniture.get("trash");r.position.set(a.spot.x,n==="chair"?.06:.115,a.spot.z),r.rotation.y=a.spot.rotation;const o=n==="chair"?this.state.chair??{x:-1.19,z:.4,rotation:Math.PI/2+.12}:this.state.trash??{x:-1.25,z:1.9,rotation:0},s=a.spot.rotation-o.rotation,p=Math.cos(s),d=Math.sin(s);for(const m of this.state.items)if(m.location===(n==="chair"?"seat":"trash")){const g=this.bodies.get(m.id);if(!g)continue;const v=g.pose.position[0]-o.x,_=g.pose.position[2]-o.z;g.group.position.set(a.spot.x+v*p+_*d,g.pose.position[1]+.06,a.spot.z-v*d+_*p),g.group.rotation.y=g.pose.rotation+s}this.landingMark.visible=!0,this.landingMark.position.set(a.spot.x,.07,a.spot.z),this.landingMark.scale.set(1.3,1.3,1),this.landingMark.material.color.set(a.error?"#df9678":"#a9e1c1")}setHover(n){const t=n?.item?this.bodies.get(n.item)?.group:n?.door?this.furniture.get("cabinet"):n?.location?this.furniture.get(n.location):null;if(t===this.hoverRoot)return;for(const a of this.hoverEdges)a.removeFromParent(),a.geometry.dispose(),a.material.dispose();if(this.hoverEdges=[],this.hoverRoot=t??null,!t)return;const i=[];t.traverse(a=>{a instanceof ye&&a.visible&&i.push(a)});for(const a of i){if(a.material.visible===!1||a.userData.pickOnly)continue;const r=new ys(new Us(a.geometry,20),new Is({color:"#fff2b8",transparent:!0,opacity:.85,depthWrite:!1}));r.raycast=()=>{},r.renderOrder=3,a.add(r),this.hoverEdges.push(r)}}setDrawerOpen(n){this.drawerOpen=n;for(const t of this.state.items)t.location==="drawer"&&(this.bodies.get(t.id).group.visible=n)}releaseDrag(){this.cancelDrag()}onMotion=()=>{this.reduced=this.media.matches};onVisibility=()=>{this.stopped=document.hidden,this.stopped?cancelAnimationFrame(this.request):this.disposed||(this.last=0,this.request=requestAnimationFrame(this.tick))};tick=n=>{if(this.disposed||this.stopped)return;const t=Math.min((n-(this.last||n))/1e3,.05);this.last=n,this.time+=t;const i=this.reduced?1:1-Math.exp(-t*9),a=this.updateCamera(i),r=!!this.pointerUpdate;this.flushPointerUpdate(),a&&!r&&this.dragged&&this.lastPointer&&this.drag(this.dragged,this.lastPointer.x,this.lastPointer.y);const o=this.state.mode!=="free"&&this.state.hints!==!1?(this.goalItems??Ca(this.state)).filter(M=>this.state.items.some(b=>b.id===M&&b.location!=="bag")):[],s=this.state.bag??{x:2.15,z:1.05,rotation:0},p=this.furniture.get("bag");(!this.movingBag||!this.bagLive)&&(p.position.lerp(new ie(s.x,.1,s.z),i),p.rotation.y=et.lerp(p.rotation.y,s.rotation,i));const d=this.state.chair??{x:-1.19,z:.4,rotation:Math.PI/2+.12};(!this.movingChair||this.furnitureLive?.kind!=="chair")&&(this.chair.position.lerp(new ie(d.x,0,d.z),i),this.chair.rotation.y=et.lerp(this.chair.rotation.y,d.rotation,i));const m=this.state.trash??{x:-1.25,z:1.9,rotation:0},g=this.furniture.get("trash");(!this.movingTrash||this.furnitureLive?.kind!=="trash")&&(g.position.lerp(new ie(m.x,.055,m.z),i),g.rotation.y=et.lerp(g.rotation.y,m.rotation,i));for(const[M,b]of this.bodies){const T=b.group.userData.cartonFlaps,D=b.group.userData.cartonContents;if(D&&(D.visible=!!this.state.containers?.[M]),T)for(const E of T)E.rotation.z=et.lerp(E.rotation.z,this.state.containers?.[M]?E.userData.side*2.45:0,i);const w=b.group.userData.containerLid;if(w&&(w.rotation.x=et.lerp(w.rotation.x,Ns(M,this.state)||this.containerPreview===M?ot[M].art==="case"?-.9:-1.75:0,i)),M!==this.dragged&&!this.dragFollowers.has(M)&&!(this.furnitureLive&&this.state.items.find(E=>E.id===M)?.location===(this.furnitureLive.kind==="chair"?"seat":"trash"))&&!(this.movingBag&&this.bagLive&&this.state.items.find(E=>E.id===M)?.location==="bag")){const E=this.settling.get(M),W=this.bodyTarget.set(...b.pose.position);if(E){const F=this.reduced?1:Math.min(1,(n-E.started)/140),B=1-(1-F)**3;b.group.position.lerpVectors(E.position,W,B),b.group.rotation.y=et.lerp(E.rotation,b.pose.rotation,B),b.group.scale.copy(E.scale).lerp(this.bodyScale.setScalar(b.pose.scale),B),F===1&&this.settling.delete(M)}else this.listHover===M&&!this.selected&&!this.reduced&&(W.y+=Math.max(0,Math.sin(this.time*5))*.045),b.group.position.lerp(W,i),b.group.scale.lerp(this.bodyScale.setScalar(b.pose.scale),i),b.group.rotation.y=et.lerp(b.group.rotation.y,b.pose.rotation,i)}const c=this.halos.get(M);c.visible=b.group.visible&&(M===this.selected||this.hinted.includes(M)||M===this.guideId||o.includes(M)),c.position.copy(b.group.position),c.position.y-=b.upright?.18:.045,c.scale.setScalar((M===this.selected||M===this.guideId?1:.58)*(this.reduced?1:1+Math.sin(this.time*2)*.06)),c.material.color.set(M===this.selected?"#c3edf0":"#ffdb7b")}const v=(this.camera.right-this.camera.left)/(this.width-this.viewLeft)/this.camera.zoom;for(const[M,b]of this.targetMarks)M==="bag"&&b.position.set(this.state.bag?.x??2.15,.9,this.state.bag?.z??1.05),b.visible=this.assistance&&!!this.selected&&this.validTargets.has(M),b.scale.setScalar(v*58);const _=this.guideId?this.bodies.get(this.guideId):null;if(this.guideArrow.visible=!!_&&!this.selected,_){const b=this.state.items.find(w=>w.id===this.guideId)?.location==="cabinet"&&!this.state.cabinetOpen,T=this.state.items.find(w=>w.id===this.guideId)?.spot?.surface?.slice(7),D=T&&this.state.containers?.[T]===!1?this.bodies.get(T):null;this.guideArrow.position.copy(b?new ie(3.1,.8,.65):D?.group.position??_.group.position),this.guideArrow.position.y+=(b?0:_.upright?.32:.12)+v*42+(this.reduced?0:Math.sin(this.time*2.8)*v*4),this.guideArrow.scale.setScalar(v*58)}const R=this.state.bag??{x:2.15,z:1.05},L=this.selected&&(this.bagItems??Ca(this.state)).includes(this.selected)?this.bodies.get(this.selected):null;if(this.route.visible=!!L,L){const M=this.route.geometry.attributes.position,b=L.group.position;for(let T=0;T<24;T++){const D=T/23;M.setXYZ(T,et.lerp(b.x,R.x,D),et.lerp(b.y+.15,.95,D)+Math.sin(D*Math.PI)*.28,et.lerp(b.z,R.z,D))}M.needsUpdate=!0,this.route.computeLineDistances()}this.drawers.position.z=et.lerp(this.drawers.position.z,this.drawerOpen?.68:0,i),this.closetDoor.position.x=et.lerp(this.closetDoor.position.x,this.state.closetOpen?-1.9:.64,i),this.closetFixed.position.x=et.lerp(this.closetFixed.position.x,this.state.closetOpen?-1.93:-.64,i),this.flap.rotation.x=et.lerp(this.flap.rotation.x,this.state.bagOpen!==!1&&!this.movingBag?-1.5:0,i);const h=bn[this.period],u=this.reduced?0:Math.sin(this.time/55)*.15;this.sunlight.position.lerp(new ie(h.position[0]+u,h.position[1],h.position[2]),i*.65),this.sunlight.color.lerp(new qe(h.sun),i*.7),this.sunlight.intensity=et.lerp(this.sunlight.intensity,h.power,i*.6),this.ambient.color.lerp(new qe(h.ambient),i*.6),this.ambient.intensity=et.lerp(this.ambient.intensity,this.period==="night"?.95:2.65,i*.6),this.scene.background.lerp(new qe(h.sky),i*.6),this.renderer.toneMappingExposure=et.lerp(this.renderer.toneMappingExposure,h.exposure,i*.6),this.lamp.intensity=et.lerp(this.lamp.intensity,h.lamp,i*.6),this.bulb.material.emissiveIntensity=this.lamp.intensity/5+.15,this.renderer.render(this.scene,this.camera),n-this.projectionAt>32&&(this.publish(),this.projectionAt=n),this.request=requestAnimationFrame(this.tick)};disposeObject(n){const t=new Set,i=new Set;n.traverse(a=>{(a instanceof ye||a instanceof Aa||a instanceof Bn)&&(a instanceof Bn||i.add(a.geometry),(Array.isArray(a.material)?a.material:[a.material]).forEach(o=>t.add(o)))}),i.forEach(a=>a.dispose()),t.forEach(a=>{for(const r of Object.values(a))r instanceof Tr&&r.dispose();a.dispose()})}dispose(){this.cancelDrag(),this.disposed=!0,this.pointerUpdate=null,cancelAnimationFrame(this.request),this.media.removeEventListener("change",this.onMotion),document.removeEventListener("visibilitychange",this.onVisibility),this.disposeObject(this.scene),this.renderer.dispose()}}export{Hu as RoomWorld};
