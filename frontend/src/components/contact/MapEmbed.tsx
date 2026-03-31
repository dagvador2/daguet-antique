interface MapEmbedProps {
  embedUrl: string;
}

export function MapEmbed({ embedUrl }: MapEmbedProps) {
  return (
    <div className="w-full aspect-[4/3] md:aspect-[16/9]">
      <iframe
        src={embedUrl}
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="Localisation de l'atelier"
      />
    </div>
  );
}
