"use client";

import { useEffect, useRef, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "../styles/map-overrides.css";

// Fix for default marker icons in Leaflet
const icon = L.icon({
  iconUrl: "/location.png",
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -35],
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  shadowSize: [45, 45],
  shadowAnchor: [10, 40],
});

const highlightIcon = L.icon({
  iconUrl: "/gps.png",
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -35],
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  shadowSize: [45, 45],
  shadowAnchor: [10, 40],
});

interface MapBounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

interface MapProps {
  center: {
    lat: number;
    lng: number;
  };
  zoom: number;
  properties: Array<{
    id: string;
    coordinates: {
      lat: number;
      lng: number;
    };
    title: string;
    price: string;
    type: string;
    isNew?: boolean; // Optional flag to highlight newly added properties
  }>;
  onMarkerClick?: (propertyId: string) => void;
  onBoundsChanged?: (bounds: MapBounds) => void;
}

// Component to handle map events and call onBoundsChanged
function MapEventsHandler({
  onBoundsChanged,
}: {
  onBoundsChanged?: (bounds: MapBounds) => void;
}) {
  const map = useMapEvents({
    moveend: () => {
      if (onBoundsChanged) {
        const bounds = map.getBounds();
        onBoundsChanged({
          north: bounds.getNorth(),
          south: bounds.getSouth(),
          east: bounds.getEast(),
          west: bounds.getWest(),
        });
      }
    },
    zoomend: () => {
      if (onBoundsChanged) {
        const bounds = map.getBounds();
        onBoundsChanged({
          north: bounds.getNorth(),
          south: bounds.getSouth(),
          east: bounds.getEast(),
          west: bounds.getWest(),
        });
      }
    },
  });
  return null;
}

// Component to track property updates and ensure they're visible
function PropertyTracker({
  properties,
}: {
  properties: MapProps["properties"];
}) {
  const map = useMap();
  const prevPropertiesRef = useRef<string[]>([]);

  useEffect(() => {
    // Check for new properties by comparing IDs
    const currentIds = properties.map((p) => p.id);
    const prevIds = prevPropertiesRef.current;

    // Find newly added properties
    const newPropertyIds = currentIds.filter((id) => !prevIds.includes(id));

    if (newPropertyIds.length > 0) {
      // If there are new properties, ensure they're visible on the map
      const newProperties = properties.filter((p) =>
        newPropertyIds.includes(p.id),
      );

      if (newProperties.length > 0) {
        // Create bounds that include all new properties
        const bounds = L.latLngBounds(
          newProperties.map((p) => [p.coordinates.lat, p.coordinates.lng]),
        );

        // Extend bounds to include existing view
        bounds.extend(map.getBounds());

        // Fit map to these bounds
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
      }
    }

    // Update previous properties ref
    prevPropertiesRef.current = currentIds;
  }, [properties, map]);

  return null;
}

const Map = ({
  center,
  zoom,
  properties,
  onMarkerClick,
  onBoundsChanged,
}: MapProps) => {
  const mapRef = useRef<L.Map>(null);
  const [visibleProperties, setVisibleProperties] = useState<
    MapProps["properties"]
  >([]);

  // Update map view when center or zoom changes
  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.setView([center.lat, center.lng], zoom);
    }
  }, [center, zoom]);

  // Track which properties are visible (useful for debugging)
  useEffect(() => {
    if (mapRef.current && properties.length > 0) {
      const bounds = mapRef.current.getBounds();
      const visible = properties.filter((property) => {
        const { lat, lng } = property.coordinates;
        return bounds.contains([lat, lng]);
      });
      setVisibleProperties(visible);
    } else {
      setVisibleProperties(properties);
    }
  }, [properties]);

  // Log property changes to help with debugging
  useEffect(() => {
    console.log(
      `Map rendering ${properties.length} properties, ${visibleProperties.length} visible`,
    );
  }, [properties.length, visibleProperties.length]);

  return (
    <MapContainer
      center={[center.lat, center.lng]}
      zoom={zoom}
      style={{ height: "100%", width: "100%", zIndex: 10 }}
      ref={mapRef}
      className="z-10"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {properties.map((property) => (
        <Marker
          key={property.id}
          position={[property.coordinates.lat, property.coordinates.lng]}
          icon={property.isNew ? highlightIcon : icon}
          eventHandlers={{
            click: () => {
              if (onMarkerClick) {
                onMarkerClick(property.id);
              }
            },
          }}
        >
          <Popup>
            <div className="p-2">
              <h3 className="font-semibold text-[#FF6B6B]">{property.title}</h3>
              <p className="text-sm text-gray-600">{property.price}</p>
              <p className="text-xs text-gray-500">{property.type}</p>
              {property.isNew && (
                <p className="text-xs text-green-500 font-semibold mt-1">
                  New Listing
                </p>
              )}
            </div>
          </Popup>
        </Marker>
      ))}
      <MapEventsHandler onBoundsChanged={onBoundsChanged} />
      <PropertyTracker properties={properties} />
    </MapContainer>
  );
};

export default Map;
