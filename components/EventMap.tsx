type EventMapProps = {
  location: string;
};

export default function EventMap({ location }: EventMapProps) {
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