export interface NarrativeStep {
  title: string;
  description: string;
  highlight: string;
}

export const SUNSET_IMAGE = "/assets/Terrazas/AtardeceresUnicos.png";

export const FIRE_PIT_IMAGE = "/assets/Terrazas/Terraza4.jpg";

export const PANORAMIC_IMAGE = "/assets/Terrazas/Terraza1.jpg";

export const TERRACE_GALLERY = [
  "/assets/Terrazas/Terraza1.jpg",
  "/assets/Terrazas/Terraza2.jpg",
  "/assets/Terrazas/Terraza3.jpg",
  "/assets/Terrazas/AtardeceresUnicos.png",
];

export const SUNSET_NARRATIVE: NarrativeStep[] = [
  {
    title: "La Hora Dorada Llega",
    description: "Entre las 5:00 y 6:30 pm, el espectáculo comienza. El sol inicia su descenso pintando el cielo con tonalidades doradas.",
    highlight: "El momento perfecto para tu primera copa del día",
  },
  {
    title: "La Sinfonía de Colores",
    description: "Observa cómo el horizonte se transforma: naranjas intensos, rosas suaves y púrpuras profundos.",
    highlight: "Cada segundo es único e irrepetible",
  },
  {
    title: "El Momento de Conexión",
    description: "Mientras el último rayo toca el océano, el tiempo se detiene. Es el momento perfecto para un brindis.",
    highlight: "Este es el momento que recordarás para siempre",
  },
];

export const TERRACE_TYPES_NARRATIVE: NarrativeStep[] = [
  {
    title: "Terrazas Íntimas para Parejas",
    description: "Espacios diseñados para 2-4 personas buscando momentos románticos.",
    highlight: "Perfecto para aniversarios y citas especiales",
  },
  {
    title: "Espacios Familiares",
    description: "Terrazas medianas con capacidad de 6-10 personas, ideales para reuniones familiares.",
    highlight: "Donde las familias se reconectan",
  },
  {
    title: "Áreas de Celebración",
    description: "Terrazas amplias para grupos de 12-20 personas, perfectas para cumpleaños.",
    highlight: "Celebra en grande con vistas inigualables",
  },
  {
    title: "Espacios Premium VIP",
    description: "Nuestras terrazas más exclusivas con servicios personalizados.",
    highlight: "Lujo y exclusividad en cada detalle",
  },
];

export const FIRE_PIT_NARRATIVE: NarrativeStep[] = [
  {
    title: "El Ritual del Encendido",
    description: "Al caer la noche, encendemos tu fogata personal. El crepitar marca el inicio de una noche mágica.",
    highlight: "El fuego crea el ambiente perfecto",
  },
  {
    title: "Conexión Bajo las Estrellas",
    description: "Alrededor del calor del fuego, las historias fluyen. Tuesta malvaviscos y disfruta.",
    highlight: "Momentos que unen corazones",
  },
  {
    title: "La Serenidad Nocturna",
    description: "La brisa nocturna y un cielo estrellado ofrecen una atmósfera de paz absoluta.",
    highlight: "La noche perfecta no tiene prisa",
  },
];

export const PANORAMIC_NARRATIVE: NarrativeStep[] = [
  {
    title: "El Golfo de Nicoya",
    description: "Contempla uno de los golfos más hermosos. El agua cristalina se extiende al infinito.",
    highlight: "360 grados de belleza natural",
  },
  {
    title: "Las Montañas Guardianas",
    description: "El verde intenso de las montañas contrasta con el azul del cielo.",
    highlight: "La naturaleza en su máxima expresión",
  },
  {
    title: "Respirar Libertad",
    description: "Siente el viento, respira el aire puro y deja que la inmensidad renueve tu espíritu.",
    highlight: "Un lugar para sentirse vivo",
  },
];
