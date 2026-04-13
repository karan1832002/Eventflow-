/**
 * components/EventMap.tsx
 * 
 * Renders an embedded Google Map based on a provided location string.
 * Used to give users a visual sense of where an event is taking place.
 */

/**
 * Props for the EventMap component.
 */
type EventMapProps = {
  /** The string representation of the event location (address or name). */
  location: string;
};

/**
 * EventMap Component
 * 
 * @param {Object} props - Component props.
 */
export default function EventMap({ location }: EventMapProps) {
  // Encode location for use in a Google Maps URL
  const encodedLocation = encodeURIComponent(location);

  return (
    <iframe
      width="100%"
      height="400"
      loading="lazy"
      style={{ border: 0 }}
      src={`https://www.google.com/maps?q=${encodedLocation}&output=embed`}
    />
  );
}