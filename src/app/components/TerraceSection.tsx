import { motion } from "motion/react";
import { useInView } from "motion/react";
import { useRef } from "react";
import BackgroundEffectLocal from "./BackgroundEffectLocal";

interface TerraceSectionProps {
  images: { description: string; url: string }[];
}

interface NarrativeStep {
  title: string;
  description: string;
  highlight: string;
}

export function TerraceSection({
  images,
}: TerraceSectionProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  // Imágenes específicas para cada narrativa
  const sunsetImage =
    "https://scontent.fsjo8-1.fna.fbcdn.net/v/t39.30808-6/518384564_772781415234243_3646475887664757925_n.jpg?stp=cp6_dst-jpg_tt6&_nc_cat=104&ccb=1-7&_nc_sid=7b2446&_nc_ohc=VMcfjqT2pbgQ7kNvwHKfLDc&_nc_oc=AdqWtwqHLpYY2K_LpirRxn93U7KwyoHNVJ692RlOK40UJpl4HmgmwXaW-acGQNf2MJnx6eWOyCzQopvfh4lLYoNC&_nc_zt=23&_nc_ht=scontent.fsjo8-1.fna&_nc_gid=VHEEw73g2JmhRadxcmFOLA&_nc_ss=7a30f&oh=00_AfweYVpMzO65ZuwskrVRki2-TFk0MNvYh_VRfdpVZUuvvA&oe=69CE8412";
  const firePitImage =
    "https://scontent.fsjo8-1.fna.fbcdn.net/v/t39.30808-6/528742789_772783145234070_2635304566584130279_n.jpg?stp=cp6_dst-jpg_tt6&_nc_cat=105&ccb=1-7&_nc_sid=7b2446&_nc_ohc=qe9szhpUzzcQ7kNvwENhpIv&_nc_oc=Adq_hf-Is7XXHd763MucYch7e-cqFsfK6cpnTnPSOAnwvBPsaEyd-9k0md3-DEx9jw4HDUXHJNpTBvFxqkFaykKs&_nc_zt=23&_nc_ht=scontent.fsjo8-1.fna&_nc_gid=qIL6X_zj8HdsK2raQHRvlg&_nc_ss=7a30f&oh=00_AfyGkGPk95ZVQ9H6eyHq5oH9X1HYyovfKBfWeYJC8lyyNA&oe=69CEAE5D";
  const panoramicImage =
    "https://scontent.fsjo8-1.fna.fbcdn.net/v/t39.30808-6/480646174_647991621046557_3391724060533103747_n.jpg?_nc_cat=105&ccb=1-7&_nc_sid=7b2446&_nc_ohc=9_j3X0CmbtgQ7kNvwFJt1qI&_nc_oc=AdpNsUvWjAiOC1ukaf64vo4cCGw-1WCHtKE8FOxF6yyBtbt2bW8SFY57_MseWjoz_VTQYj0QBVHkI4Fy88jusjds&_nc_zt=23&_nc_ht=scontent.fsjo8-1.fna&_nc_gid=g9t7-7j3yqhehL0E4w9UqQ&_nc_ss=7a30f&oh=00_AfxzYM9pwnTAIAm8jGCx3LDcRfHh3PufPLkFCfeOS9I4FQ&oe=69CE98D0";

  // Galería de diferentes tipos de terrazas
  const terraceGallery = [
    "https://scontent.fsjo8-1.fna.fbcdn.net/v/t39.30808-6/523324473_759345633244488_1789929945342545752_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=7b2446&_nc_ohc=rfXoyJfUFfoQ7kNvwFx_ini&_nc_oc=AdpV3H8-PG51WqJIlwlq2c-R-aNxcCKvBmmOrOLg4yMhP0sY0czGVzJwieiGJUx5143NMeufllF4d6B4_X_noAen&_nc_zt=23&_nc_ht=scontent.fsjo8-1.fna&_nc_gid=1ZV38o-vJhJZ-o5LwqopRA&_nc_ss=7a30f&oh=00_Afzll2CPPTPRNPN9pgL3lYNc1lNlYZkVEd26_UcAyA6eHg&oe=69CE8063",
    "https://scontent.fsjo8-1.fna.fbcdn.net/v/t39.30808-6/528799632_772783265234058_3686448046153879140_n.jpg?stp=cp6_dst-jpg_tt6&_nc_cat=101&ccb=1-7&_nc_sid=7b2446&_nc_ohc=3ArnWVsgM_4Q7kNvwHfYXlF&_nc_oc=AdoT4za9KT0jrH0IZ3N4i7h7NEm8GHS3QrY2anHuPiXnZGFYU1M4Pxd7RSeur33YNvj4cg_PS8JyFD0VVakmqwxl&_nc_zt=23&_nc_ht=scontent.fsjo8-1.fna&_nc_gid=qMEyJYZx0p2p21d5ZjaxBw&_nc_ss=7a30f&oh=00_AfweFLmTdwtOwb05SmLtnkFqyjvW32M_XmpJ27z6ivDq8Q&oe=69CEB1DF",
    "https://scontent.fsjo8-1.fna.fbcdn.net/v/t39.30808-6/528328773_772783318567386_4762488151465554044_n.jpg?stp=cp6_dst-jpg_tt6&_nc_cat=107&ccb=1-7&_nc_sid=7b2446&_nc_ohc=3yO4St2kJiIQ7kNvwEXXwSe&_nc_oc=AdpXLPk3WMfgwaZ32AgTvKlxYEueab_C_8LjVIjec1QIEgUSFOtTDkbJhDwxTl-7-NS1r-oZALuZ89WKDwdoty67&_nc_zt=23&_nc_ht=scontent.fsjo8-1.fna&_nc_gid=4SAf2qDTsBP9_Z7p0VtAhg&_nc_ss=7a30f&oh=00_AfzVebMOA2eY8nWQGgVefGpsvZqCxfPM3xK87WmJmPlgKw&oe=69CE9ABF",
    "https://scontent.fsjo8-1.fna.fbcdn.net/v/t39.30808-6/518384564_772781415234243_3646475887664757925_n.jpg?stp=cp6_dst-jpg_tt6&_nc_cat=104&ccb=1-7&_nc_sid=7b2446&_nc_ohc=VMcfjqT2pbgQ7kNvwHKfLDc&_nc_oc=AdqWtwqHLpYY2K_LpirRxn93U7KwyoHNVJ692RlOK40UJpl4HmgmwXaW-acGQNf2MJnx6eWOyCzQopvfh4lLYoNC&_nc_zt=23&_nc_ht=scontent.fsjo8-1.fna&_nc_gid=VHEEw73g2JmhRadxcmFOLA&_nc_ss=7a30f&oh=00_AfweYVpMzO65ZuwskrVRki2-TFk0MNvYh_VRfdpVZUuvvA&oe=69CE8412",
  ];

  // Narrativas detalladas para cada característica
  const sunsetNarrative: NarrativeStep[] = [
    {
      title: "La Hora Dorada Llega",
      description:
        "Entre las 5:00 y 6:30 pm, el espectáculo comienza. El sol inicia su descenso pintando el cielo con tonalidades doradas que bañan el golfo de Nicoya.",
      highlight:
        "El momento perfecto para tu primera copa del día",
    },
    {
      title: "La Sinfonía de Colores",
      description:
        "Observa cómo el horizonte se transforma: naranjas intensos, rosas suaves y púrpuras profundos danzan en el cielo mientras el sol se despide lentamente.",
      highlight: "Cada segundo es único e irrepetible",
    },
    {
      title: "El Momento de Conexión",
      description:
        "Mientras el último rayo toca el océano, el tiempo se detiene. Es el momento perfecto para un brindis, una fotografía memorable o simplemente respirar profundo.",
      highlight:
        "Este es el momento que recordarás para siempre",
    },
  ];

  const terraceTypesNarrative: NarrativeStep[] = [
    {
      title: "Terrazas Íntimas para Parejas",
      description:
        "Espacios diseñados para 2-4 personas que buscan momentos románticos y privacidad. Con mesas individuales y vistas privilegiadas.",
      highlight:
        "Perfecto para aniversarios y citas especiales",
    },
    {
      title: "Espacios Familiares",
      description:
        "Terrazas medianas con capacidad de 6-10 personas, ideales para reuniones familiares donde todos puedan compartir la misma mesa y crear recuerdos juntos.",
      highlight: "Donde las familias se reconectan",
    },
    {
      title: "Áreas de Celebración",
      description:
        "Terrazas amplias para grupos de 12-20 personas, perfectas para cumpleaños, reuniones de amigos o eventos corporativos pequeños.",
      highlight: "Celebra en grande con vistas inigualables",
    },
    {
      title: "Espacios Premium VIP",
      description:
        "Nuestras terrazas más exclusivas con servicios personalizados, ubicación privilegiada y atención dedicada para una experiencia verdaderamente única.",
      highlight: "Lujo y exclusividad en cada detalle",
    },
  ];

  const firePitNarrative: NarrativeStep[] = [
    {
      title: "El Ritual del Encendido",
      description:
        "Al caer la noche, encendemos tu fogata personal. El crepitar de las llamas marca el inicio de una experiencia mágica bajo las estrellas.",
      highlight: "El fuego crea el ambiente perfecto",
    },
    {
      title: "Conexión Bajo las Estrellas",
      description:
        "Alrededor del calor de la fogata, las conversaciones fluyen naturalmente. Comparte historias, tuesta malvaviscos y disfruta de la compañía de tus seres queridos.",
      highlight: "Momentos que unen corazones",
    },
    {
      title: "La Serenidad Nocturna",
      description:
        "La brisa nocturna, el cielo estrellado y el calor del fuego crean una atmósfera de paz absoluta. Es el momento para reflexionar y disfrutar el presente.",
      highlight: "La noche perfecta no tiene prisa",
    },
  ];

  const panoramicNarrative: NarrativeStep[] = [
    {
      title: "El Golfo de Nicoya en Su Esplendor",
      description:
        "Desde nuestras terrazas, contempla uno de los golfos más hermosos de Costa Rica. El agua cristalina se extiende hasta donde alcanza la vista.",
      highlight: "360 grados de belleza natural",
    },
    {
      title: "Las Montañas Guardianas",
      description:
        "El verde intenso de las montañas circundantes contrasta con el azul del cielo, creando un marco natural que cambia con la luz del día.",
      highlight: "La naturaleza en su máxima expresión",
    },
    {
      title: "Respirar Libertad",
      description:
        "Aquí no solo ves un paisaje, te conviertes en parte de él. Siente el viento, respira el aire puro y deja que la inmensidad renueve tu espíritu.",
      highlight: "Un lugar para sentirse vivo",
    },
  ];

  return (
    <section
      id="terrazas"
      ref={ref}
      className="py-24 px-6 md:px-12 relative overflow-hidden bg-transparent"
    >
      <BackgroundEffectLocal sectionRef={ref as any} />
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-6xl text-[#2A2419] mb-6">
            Nuestras Terrazas
          </h2>
          <p className="text-lg md:text-xl text-[#6B5D4F] max-w-3xl mx-auto">
            Un viaje sensorial donde cada espacio cuenta su
            propia historia. Descubre la magia de estar en el
            lugar perfecto, en el momento perfecto.
          </p>
        </motion.div>

        {/* EXPERIENCIA 1: Atardeceres Únicos */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.8 }}
          className="mb-32"
        >
          <div className="grid md:grid-cols-2 gap-12 items-start mb-12">
            <div className="order-2 md:order-1">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="mb-6"
              >
                <span className="text-sm tracking-wider text-[#966F40] mb-2 block">
                  Experiencia sensorial
                </span>
                <h3 className="text-4xl md:text-5xl text-[#2A2419] mb-4">
                  Atardeceres Únicos
                </h3>
                <p className="text-lg text-[#6B5D4F] leading-relaxed">
                  Vive el espectáculo natural más hermoso desde
                  la primera fila. Cada atardecer es una obra de
                  arte efímera que transforma el golfo de Nicoya
                  en un lienzo de colores imposibles.
                </p>
              </motion.div>

              {/* Guía narrativa paso a paso */}
              <div className="space-y-6">
                {sunsetNarrative.map((step, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.6,
                      delay: 0.4 + index * 0.15,
                    }}
                    className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-[#E8DCC4]/30 hover:border-[#966F40]/40 transition-all duration-300 hover:shadow-lg"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-[#966F40] to-[#8A7254] flex items-center justify-center text-white text-sm">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-lg text-[#2A2419] mb-2">
                          {step.title}
                        </h4>
                        <p className="text-[#6B5D4F] mb-3">
                          {step.description}
                        </p>
                        <p className="text-sm text-[#966F40] italic">
                          {step.highlight}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="order-1 md:order-2 relative h-[500px] md:h-[700px] rounded-3xl overflow-hidden group shadow-2xl sticky top-8"
            >
              <img
                src={sunsetImage}
                alt="Atardecer en terraza con vista al golfo"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              <div className="absolute bottom-8 left-8 right-8 text-white">
                <p className="text-sm tracking-wider mb-2 opacity-90">
                  Golden Hour
                </p>
                <p className="text-2xl">5:00 PM - 6:30 PM</p>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* EXPERIENCIA 2: Distintos Tipos de Terrazas */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.8 }}
          className="mb-32"
        >
          <div className="grid md:grid-cols-2 gap-12 items-start mb-12">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative sticky top-8"
            >
              <div className="grid grid-cols-2 gap-4">
                {terraceGallery.map((image, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.6,
                      delay: 0.6 + index * 0.1,
                    }}
                    className="relative h-[220px] md:h-[280px] rounded-2xl overflow-hidden group shadow-lg"
                  >
                    <img
                      src={image}
                      alt={`Terraza tipo ${index + 1}`}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <div>
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="mb-6"
              >
                <span className="text-sm tracking-wider text-[#966F40] mb-2 block">
                  Espacios versátiles
                </span>
                <h3 className="text-4xl md:text-5xl text-[#2A2419] mb-4">
                  Distintos Tipos y Tamaños
                </h3>
                <p className="text-lg text-[#6B5D4F] leading-relaxed">
                  Cada grupo merece su espacio perfecto. Desde
                  momentos íntimos hasta grandes celebraciones,
                  tenemos la terraza ideal para tu experiencia.
                </p>
              </motion.div>

              {/* Guía narrativa de tipos de terrazas */}
              <div className="space-y-6">
                {terraceTypesNarrative.map((step, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.6,
                      delay: 0.6 + index * 0.15,
                    }}
                    className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-[#E8DCC4]/30 hover:border-[#966F40]/40 transition-all duration-300 hover:shadow-lg"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-[#8A7254] to-[#6B5D4F] flex items-center justify-center text-white text-sm">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-lg text-[#2A2419] mb-2">
                          {step.title}
                        </h4>
                        <p className="text-[#6B5D4F] mb-3">
                          {step.description}
                        </p>
                        <p className="text-sm text-[#966F40] italic">
                          {step.highlight}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* EXPERIENCIA 3: Fogatas y Magia Nocturna */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.8 }}
          className="mb-32"
        >
          <div className="grid md:grid-cols-2 gap-12 items-start mb-12">
            <div className="order-2 md:order-1">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.7 }}
                className="mb-6"
              >
                <span className="text-sm tracking-wider text-[#966F40] mb-2 block">
                  Experiencia nocturna
                </span>
                <h3 className="text-4xl md:text-5xl text-[#2A2419] mb-4">
                  Fogatas y Magia Nocturna
                </h3>
                <p className="text-lg text-[#6B5D4F] leading-relaxed">
                  Cuando cae la noche, la verdadera magia
                  comienza. Las fogatas transforman nuestras
                  terrazas en santuarios de calidez y conexión
                  bajo las estrellas.
                </p>
              </motion.div>

              {/* Guía narrativa de fogatas */}
              <div className="space-y-6">
                {firePitNarrative.map((step, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.6,
                      delay: 0.8 + index * 0.15,
                    }}
                    className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-[#E8DCC4]/30 hover:border-[#966F40]/40 transition-all duration-300 hover:shadow-lg"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-[#966F40] to-[#8A7254] flex items-center justify-center text-white text-sm">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-lg text-[#2A2419] mb-2">
                          {step.title}
                        </h4>
                        <p className="text-[#6B5D4F] mb-3">
                          {step.description}
                        </p>
                        <p className="text-sm text-[#966F40] italic">
                          {step.highlight}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="order-1 md:order-2 relative h-[500px] md:h-[700px] rounded-3xl overflow-hidden group shadow-2xl sticky top-8"
            >
              <img
                src={firePitImage}
                alt="Fogata en terraza bajo las estrellas"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-8 left-8 right-8 text-white">
                <p className="text-sm tracking-wider mb-2 opacity-90">
                  Experiencia nocturna
                </p>
                <p className="text-2xl">7:00 PM - 11:00 PM</p>
              </div>
            </motion.div>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="mt-8 bg-gradient-to-br from-[#2A2419] to-[#3A3329] rounded-2xl p-6 text-white"
          >
            <p className="text-sm tracking-wider mb-2 opacity-80">
              Incluye
            </p>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#966F40]"></span>
                Leña premium seleccionada
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#966F40]"></span>
                Kit para tostar malvaviscos
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#966F40]"></span>
                Mantas acogedoras para la noche
              </li>
            </ul>
          </motion.div>
        </motion.div>

        {/* EXPERIENCIA 4: Vistas Panorámicas */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.8 }}
        >
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.8, delay: 1.0 }}
              className="relative h-[500px] md:h-[700px] rounded-3xl overflow-hidden group shadow-2xl sticky top-8"
            >
              <img
                src={panoramicImage}
                alt="Vista panorámica desde las terrazas"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              <div className="absolute bottom-8 left-8 right-8 text-white">
                <p className="text-sm tracking-wider mb-2 opacity-90">
                  Vista panorámica
                </p>
                <p className="text-2xl">Golfo de Nicoya</p>
              </div>
            </motion.div>

            <div>
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.9 }}
                className="mb-6"
              >
                <span className="text-sm tracking-wider text-[#966F40] mb-2 block">
                  Naturaleza inmersiva
                </span>
                <h3 className="text-4xl md:text-5xl text-[#B1630A] mb-4">
                  Vistas Que Quitan el Aliento
                </h3>
                <p className="text-lg text-[#6B5D4F] leading-relaxed">
                  No es solo observar un paisaje, es convertirse
                  en parte de él. Cada terraza ofrece una
                  perspectiva única del esplendor natural de
                  Costa Rica.
                </p>
              </motion.div>

              {/* Guía narrativa de vistas */}
              <div className="space-y-6">
                {panoramicNarrative.map((step, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.6,
                      delay: 1.0 + index * 0.15,
                    }}
                    className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-[#E8DCC4]/30 hover:border-[#966F40]/40 transition-all duration-300 hover:shadow-lg"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-[#8A7254] to-[#6B5D4F] flex items-center justify-center text-white text-sm">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-lg text-[#2A2419] mb-2">
                          {step.title}
                        </h4>
                        <p className="text-[#6B5D4F] mb-3">
                          {step.description}
                        </p>
                        <p className="text-sm text-[#966F40] italic">
                          {step.highlight}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 1.5 }}
                className="mt-8 bg-gradient-to-br from-[#966F40] to-[#8A7254] rounded-2xl p-6 text-white"
              >
                <p className="text-sm tracking-wider mb-3 opacity-90">
                  Lo que verás
                </p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="opacity-80 mb-1">Horizonte</p>
                    <p className="text-lg">∞ Infinito</p>
                  </div>
                  <div>
                    <p className="opacity-80 mb-1">Altura</p>
                    <p className="text-lg">150m</p>
                  </div>
                  <div>
                    <p className="opacity-80 mb-1">
                      Visibilidad
                    </p>
                    <p className="text-lg">360°</p>
                  </div>
                  <div>
                    <p className="opacity-80 mb-1">Amanecer</p>
                    <p className="text-lg">5:30 AM</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
