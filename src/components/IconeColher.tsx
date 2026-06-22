// Ícone de colher — usado como toggle de favoritar.
// Dois estados: contorno (não favoritada) e preenchida (favoritada).

interface Props {
  preenchida?: boolean;
  size?: number;
}

export default function IconeColher({ preenchida = false, size = 20 }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={preenchida ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Concha da colher (oval no topo) */}
      <ellipse cx="12" cy="7" rx="4.5" ry="5.5" />
      {/* Cabo da colher (linha vertical descendo) */}
      <path d="M12 12.5 L12 21" />
    </svg>
  );
}
