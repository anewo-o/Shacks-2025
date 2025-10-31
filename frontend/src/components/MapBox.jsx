import { useRef, useEffect, useState } from 'react'
import mapboxgl from 'mapbox-gl'
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder'
import 'mapbox-gl/dist/mapbox-gl.css'
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css'
// import './MapBox.css'

const INITIAL_CENTER = [-74.0242, 40.6941]
const INITIAL_ZOOM = 10.12

const MapBox = ({ onSend }) => {
  const mapContainerRef = useRef(null)
  const mapRef = useRef(null)
  const initializedRef = useRef(false)

  const [startPoint, setStartPoint] = useState(null)
  const [destinationPoint, setDestinationPoint] = useState(null)

  const [center, setCenter] = useState(INITIAL_CENTER)
  const [zoom, setZoom] = useState(INITIAL_ZOOM)

  const startRef = useRef(null)
  const destRef = useRef(null)
  const activeInputRef = useRef('start')
  const markersRef = useRef({ start: null, dest: null })
  const geocoderStartRef = useRef(null)
  const geocoderDestRef = useRef(null)

  useEffect(() => {
    if (initializedRef.current) return
    initializedRef.current = true

    mapboxgl.accessToken =
      'pk.eyJ1Ijoia25kLTIwMjUiLCJhIjoiY21oZGR5MWNsMDIwaDJscHhhaHZ1b2M3aiJ9.kXnFocpNE0EHgZge5sS4kQ'

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: INITIAL_CENTER,
      zoom: INITIAL_ZOOM,
    })
    mapRef.current = map


    const startContainer = document.getElementById('geocoder-start')
    const destContainer = document.getElementById('geocoder-dest')
    if (startContainer) startContainer.innerHTML = ''
    if (destContainer) destContainer.innerHTML = ''


    geocoderStartRef.current = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      mapboxgl,
      marker: false,
      placeholder: 'Adresse de départ',
    })
    geocoderDestRef.current = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      mapboxgl,
      marker: false,
      placeholder: 'Adresse de destination',
    })

    geocoderStartRef.current.addTo('#geocoder-start')
    geocoderDestRef.current.addTo('#geocoder-dest')

    geocoderStartRef.current.on('result', (ev) => {
      const coords = ev.result.geometry.coordinates
      startRef.current = coords
      setStartPoint(coords)
      addOrReplaceMarker('start', coords)
      activeInputRef.current = 'dest'
      // drawStraightRoute()
    })

    geocoderDestRef.current.on('result', (ev) => {
      const coords = ev.result.geometry.coordinates
      destRef.current = coords
      setDestinationPoint(coords)
      addOrReplaceMarker('dest', coords)
      activeInputRef.current = 'start'
      // drawStraightRoute()
    })

    mapRef.current.on('move', () => {

      const mapCenter = mapRef.current.getCenter()
      const mapZoom = mapRef.current.getZoom()

      // update state
      setCenter([ mapCenter.lng, mapCenter.lat ])
      setZoom(mapZoom)
    })


    map.on('click', async (e) => {
      const coords = [e.lngLat.lng, e.lngLat.lat]
      const which = activeInputRef.current

      if (which === 'start') {
        startRef.current = coords
        setStartPoint(coords)
        addOrReplaceMarker('start', coords)
        await reverseGeocodeToInput(coords, 'start')
        activeInputRef.current = 'dest'
      } else {
        destRef.current = coords
        setDestinationPoint(coords)
        addOrReplaceMarker('dest', coords)
        await reverseGeocodeToInput(coords, 'dest')
        activeInputRef.current = 'start'
      }
      // drawStraightRoute()
    })

    return () => {
      map.remove()
      mapRef.current = null
      initializedRef.current = false
    }
  }, [])

  const addOrReplaceMarker = (type, coords) => {
    if (markersRef.current[type]) markersRef.current[type].remove()
    const el = document.createElement('div')
    el.className = 'marker'
    el.textContent = type === 'start' ? 'Départ' : 'Destination'
    el.style.backgroundColor = type === 'start' ? 'green' : 'red'
    el.style.color = 'white'
    el.style.padding = '4px'
    el.style.borderRadius = '4px'
    const marker = new mapboxgl.Marker(el).setLngLat(coords).addTo(mapRef.current)
    markersRef.current[type] = marker
  }

  const reverseGeocodeToInput = async ([lng, lat], type) => {
    try {
      const res = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${mapboxgl.accessToken}`
      )
      const data = await res.json()
      const place = data.features?.[0]?.place_name || `${lng}, ${lat}`
      if (type === 'start') geocoderStartRef.current?.setInput(place)
      else geocoderDestRef.current?.setInput(place)
    } catch (e) {
      console.error('Reverse geocoding failed', e)
    }
  }

  const removeRouteIfAny = () => {
    const map = mapRef.current
    if (map.getLayer('route-line')) map.removeLayer('route-line')
    if (map.getSource('route')) map.removeSource('route')
  }
  
  const drawRoute = (coordinates) => {
  const map = mapRef.current
  if (!map || !coordinates || coordinates.length < 2) return
  removeRouteIfAny()

  map.addSource('route', {
    type: 'geojson',
    data: {
      type: 'Feature',
      geometry: {
        type: 'LineString',
        coordinates,
      },
    },
  })

  map.addLayer({
    id: 'route-line',
    type: 'line',
    source: 'route',
    layout: { 'line-join': 'round', 'line-cap': 'round' },
    paint: { 'line-width': 4, 'line-color': '#ff6600' },
  })


  const bounds = coordinates.reduce((b, coord) => b.extend(coord), new mapboxgl.LngLatBounds(coordinates[0], coordinates[0]))
  map.fitBounds(bounds, { padding: 40 })
}


  const drawStraightRoute = () => {
    const map = mapRef.current
    if (!startRef.current || !destRef.current) return
    removeRouteIfAny()

    map.addSource('route', {
      type: 'geojson',
      data: {
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates: [startRef.current, destRef.current],
        },
      },
    })
    map.addLayer({
      id: 'route-line',
      type: 'line',
      source: 'route',
      layout: { 'line-join': 'round', 'line-cap': 'round' },
      paint: { 'line-width': 4, 'line-color': '#007bff' },
    })
  }

  const handleReset = () => {
    Object.values(markersRef.current).forEach((m) => m?.remove())
    markersRef.current = { start: null, dest: null }
    removeRouteIfAny()
    startRef.current = null
    destRef.current = null
    setStartPoint(null)
    setDestinationPoint(null)
    activeInputRef.current = 'start'
    geocoderStartRef.current?.clear()
    geocoderDestRef.current?.clear()
    mapRef.current?.flyTo({ center: INITIAL_CENTER, zoom: INITIAL_ZOOM })
  }

  const handleSend = async() => {
    if (!startPoint || !destinationPoint) {
      alert('Please select both points first!')
      return
    }
    const payload = { start: startPoint, destination: destinationPoint }
    console.log('Sending to backend:', payload)
    try {
    const res = await fetch('http://127.0.0.1:5000/test', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    const data = await res.json()

    if (data.route) {
      drawRoute(data.route)
    } else {
      console.warn('No route data returned:', data)
    }
  } catch (err) {
    console.error('Error fetching route:', err)
  }
  }

  return (
    <div className="mapbox-wrapper">
      <div className="sidebar">
        Longitude: {center[0].toFixed(4)} | Latitude: {center[1].toFixed(4)} | Zoom: {zoom.toFixed(2)}
      </div>
      <div className="controls">
        <div id="geocoder-start" className="geocoder-container" />
        <div id="geocoder-dest" className="geocoder-container" />
        <small>
          Click map to set <b>{activeInputRef.current === 'start' ? 'Start' : 'Destination'}</b>
        </small>
        <div className="buttons">
          <button onClick={handleReset}>Réinitialiser</button>
          <button onClick={handleSend}>Chercher</button>
        </div>
      </div>
      <div id="map-container" ref={mapContainerRef} />
    </div>
  )
}

export default MapBox
