// Ícone de bookmark (estilo Instagram) — usado como toggle de salvar.
// Retângulo com V invertido na parte inferior. Dois estados: contorno e preenchido.

interface Props {
  preenchida?: boolean;
  size?: number;
}

export default function IconeSalvar({ preenchida = false, size = 20 }: Props) {
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
      aria-hidden="true"
    >
      {/* Bookmark: parte de cima reta, fundo com V invertido */}
      <path d="M5 4 L5 21 L12 16 L19 21 L19 4 Z" />
    </svg>
  );
}
