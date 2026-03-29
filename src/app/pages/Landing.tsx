import { Hero } from "../components/Hero";
import { TerraceSection } from "../components/TerraceSection";
import { FoodTruckSection } from "../components/FoodTruckSection";
import { EventsSection, MainEvent, UpcomingEvent } from "../components/EventsSection";
import { EventHallSection } from "../components/EventHallSection";
import { AirbnbSection } from "../components/AirbnbSection";
import { MomentsGallery } from "../components/MomentsGallery";
import { InfoSection } from "../components/InfoSection";
import { Footer } from "../components/Footer";
import { ChatAssistant } from "../components/ChatAssistant";
import { Navbar } from "../components/Navbar";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

const fallbackMainEvents: MainEvent[] = [
  {
    id: "sabinazo",
    title: "El Sabinazo",
    description: "Una noche inolvidable rindiendo tributo a la poesía y música de Joaquín Sabina. Canto, recuerdos y un ambiente acústico espectacular.",
    poster_url: "/assets/Eventos/ElSabinazoPoster.jpg",
    gallery_urls: [
      "/assets/Eventos/ElSabinazo1.jpg",
      "/assets/Eventos/ElSabinazo2.jpg",
      "/assets/Eventos/ElSabinazo3.jpg",
      "/assets/Eventos/ElSabinazo4.jpg",
      "/assets/Eventos/ElSabinazo5.jpg",
      "/assets/Eventos/ElSabinazo6.jpg",
    ]
  },
  {
    id: "tardeo",
    title: "Tardeo",
    description: "La transición perfecta del día a la noche con buena música, excelente gastronomía y un ambiente inmejorable al atardecer.",
    poster_url: "/assets/Eventos/TardeoPoster.jpg",
    gallery_urls: [
      "/assets/Eventos/Tardeo.jpg",
      "/assets/Eventos/Tardeo1.jpg",
      "/assets/Eventos/Tardeo2.jpg",
      "/assets/Eventos/Tardeo3.jpg",
      "/assets/Eventos/Tardeo4.jpg",
      "/assets/Eventos/Tardeo5.jpg",
      "/assets/Eventos/Tardeo6.jpg",
      "/assets/Eventos/Tardeo7.jpg",
      "/assets/Eventos/Tardeo8.jpg",
      "/assets/Eventos/Tardeo9.jpg",
    ]
  }
];

const fallbackUpcomingPosters: UpcomingEvent[] = [
  { id: "p1", poster_url: "/assets/Eventos/PiscisSunsetPoster.jpg", title: "Piscis Sunset" },
  { id: "p2", poster_url: "/assets/Eventos/BateeriaPoster.jpg", title: "Show de Batería" },
  { id: "p3", poster_url: "/assets/Eventos/SaxofonPoster.jpg", title: "Noches de Saxofón" },
  { id: "p4", poster_url: "/assets/Eventos/ConciertosInstrumentosPoster.jpg", title: "Música en Vivo" },
];

export function Landing() {
  const [mainEvents, setMainEvents] = useState<MainEvent[]>(fallbackMainEvents);
  const [upcomingEvents, setUpcomingEvents] = useState<UpcomingEvent[]>(fallbackUpcomingPosters);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { data: carouselData } = await supabase
          .from('carousel_events')
          .select('*')
          .order('created_at', { ascending: false });

        if (carouselData && carouselData.length > 0) {
          setMainEvents([...carouselData, ...fallbackMainEvents]);
        }

        const { data: upcomingData } = await supabase
          .from('upcoming_events')
          .select('*')
          .order('created_at', { ascending: false });

        if (upcomingData && upcomingData.length > 0) {
          setUpcomingEvents([...upcomingData, ...fallbackUpcomingPosters]);
        }
      } catch (err) {
        console.error("Error fetching events:", err);
      }
    };

    fetchEvents();
  }, []);
  // Hero image
  const heroImage = "https://scontent.fsjo8-1.fna.fbcdn.net/v/t39.30808-6/474073411_988019740087191_996796627425577335_n.jpg?_nc_cat=102&ccb=1-7&_nc_sid=7b2446&_nc_ohc=jC4ynTK0_RQQ7kNvwH78VgQ&_nc_oc=Adp_5TUxoLvAJI3UUVBmMbkOlx5OvcONZG1j4_t4TnuMh6CouZpG_y3yUyaodeY7t-j_UUxlCPNGpZNGgMU1-S-z&_nc_zt=23&_nc_ht=scontent.fsjo8-1.fna&_nc_gid=A8STgCoqxKqKS5emqKySXA&_nc_ss=7a30f&oh=00_AfzyBRQPZ3lP8oaVjsevRRD5Yq0k-AAaJy8CqSNd0LDZ8g&oe=69CE23CC";

  // ===========================================
  // TERRAZAS  
  // ===========================================
  const terraceImages = [
    {
      description: "Vista principal de las terrazas",
      url: "https://scontent.fsjo8-1.fna.fbcdn.net/v/t39.30808-6/528799632_772783265234058_3686448046153879140_n.jpg?stp=cp6_dst-jpg_tt6&_nc_cat=101&ccb=1-7&_nc_sid=7b2446&_nc_ohc=3ArnWVsgM_4Q7kNvwELX-5X&_nc_oc=AdrHJuOlKei3T-fREycbr7-i1Bl2jeCfRgIF9Y86fWiNyPTMgqHzX3Bdy2iEu6JE2D4hylhzuH7_c4MRbK1R_Vbo&_nc_zt=23&_nc_ht=scontent.fsjo8-1.fna&_nc_gid=LZ14JebUd0T5MCQsHCu6iQ&_nc_ss=7a32e&oh=00_AfwCCCMIUCumcMPc_cJzVpls0tDWmvGUPGtSwzTF-oM9OA&oe=69CEB1DF"
    },
    {
      description: "Vista con fogata/noche",
      url: "https://scontent.fsjo8-1.fna.fbcdn.net/v/t39.30808-6/528234181_772783235234061_4145822863533234919_n.jpg?stp=cp6_dst-jpg_tt6&_nc_cat=101&ccb=1-7&_nc_sid=7b2446&_nc_ohc=g_g4yL9_MgUQ7kNvwHtzCFY&_nc_oc=Adp8_EF-tFeadzYMMyIuskO2aTuDArWNlXuVnMwwGXAM6lx2wXhd9HZWtOEB-doUtt5SuMB15FJEpIssy29sMHyb&_nc_zt=23&_nc_ht=scontent.fsjo8-1.fna&_nc_gid=lkxfqWMuAyX46jlYI4sOGQ&_nc_ss=7a32e&oh=00_AfwAv_Fug1bkuwOd5ckCGY6hprRdR-7bN6aj3MGb6mRrFQ&oe=69CE95BB"
    },
    {
      description: "Vista panorámica atardecer",
      url: "https://scontent.fsjo8-1.fna.fbcdn.net/v/t39.30808-6/528328773_772783318567386_4762488151465554044_n.jpg?stp=cp6_dst-jpg_tt6&_nc_cat=107&ccb=1-7&_nc_sid=7b2446&_nc_ohc=3yO4St2kJiIQ7kNvwHCcXOD&_nc_oc=AdoLdUI0L5Z0hMhrwTLKE_Ad9WL9XgCSrhzuHbwKbuW65IBqUYpOVrWB79kcHWNN7YqKbtahgeMDleyHb9Z4xW4Z&_nc_zt=23&_nc_ht=scontent.fsjo8-1.fna&_nc_gid=MdUpAs76W8Fg9ZZPlm3Yqw&_nc_ss=7a32e&oh=00_AfxlCwxZms07kJxda-clgX1v8gD_6dSgf0ZJ3E0p7CTPyQ&oe=69CE9ABF"
    },
    {
      description: "Terraza noche/ambiente",
      url: "https://scontent.fsjo8-1.fna.fbcdn.net/v/t39.30808-6/529315823_776585161520535_690728631650181931_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=7b2446&_nc_ohc=v4RRFGlkW-sQ7kNvwGMDGlk&_nc_oc=Ados912maCHFjZ6LqXwOcfdQR-nanPrZPuWXH5DXx-Kx9kFYRkccq6yTm87kg1BCfEdZDObX6DfB3M2Z3Ovm9gX1&_nc_zt=23&_nc_ht=scontent.fsjo8-1.fna&_nc_gid=kAWdboaqz_arO6rK11sCvg&_nc_ss=7a32e&oh=00_Afzct4-hFFfsqpuRKMtsJhgGyCw2hAQ3Q_uh_Wwy_RKz1A&oe=69CE9201"
    },
    {
      description: "Detalle especial del lugar",
      url: "https://scontent.fsjo8-1.fna.fbcdn.net/v/t39.30808-6/608145370_889442246901492_9126853255372449719_n.jpg?stp=cp6_dst-jpg_tt6&_nc_cat=105&ccb=1-7&_nc_sid=7b2446&_nc_ohc=H0UBx3Rjhm8Q7kNvwF-W6Cn&_nc_oc=AdqEfKaz-ubNVc6Jm7zYkc64-XliW6hqPZfH8wc2AQbxBSinw6C-PwWDbbYEJlwWzeCTFmgCIl_ls60SmR4A40Gr&_nc_zt=23&_nc_ht=scontent.fsjo8-1.fna&_nc_gid=l3XDO4fmK6ARQEbjNCfhrQ&_nc_ss=7a32e&oh=00_AfzZ4I0kuZSweIfiOsJzrbIQ0cYAPb73X5AGs3Yqz5EkWw&oe=69CE7D02"
    }
  ];

  // ===========================================
  // FOOD TRUCK
  // ===========================================
  const foodTruckImages = [
    {
      description: "Food truck principal",
      url: "https://scontent.fsjo8-1.fna.fbcdn.net/v/t51.75761-15/476615545_18013476683690161_666161389142179383_n.jpg?stp=dst-jpegr_tt6&_nc_cat=111&ccb=1-7&_nc_sid=13d280&_nc_ohc=3vnUWd5avrIQ7kNvwHsJH5g&_nc_oc=AdqoIQ_IRqfYc0Ydjhrmq3k5b_vr6F2oiXXzR-vKZnvph1mV7h5GETlOJQHQ8gCG35vO0W-hfILOPUhN89uJE4u-&_nc_zt=23&se=-1&_nc_ht=scontent.fsjo8-1.fna&_nc_gid=pAfbXBayo7w_0t7ywe8myQ&_nc_ss=7a389&oh=00_AfwHMjgE9cx3gdszcj46mAzfbnVB7K2xE3KAiAZ5lCPMtQ&oe=69CF5E03"
    },
    {
      description: "Ambiente natural",
      url: "https://scontent.fsjo8-1.fna.fbcdn.net/v/t51.75761-15/476257377_18013476665690161_905882436149764683_n.jpg?stp=dst-jpegr_tt6&_nc_cat=107&ccb=1-7&_nc_sid=13d280&_nc_ohc=p9Ww65InfEIQ7kNvwGd3T4t&_nc_oc=AdoD8OWzyGwp_yRLyJm4OtVUsVQMqURVsMZhfmMytks60P6wXhPBELHgKLqPbHV_-OZdPdeyV0ewTeYXIP_AitTS&_nc_zt=23&_nc_ht=scontent.fsjo8-1.fna&_nc_gid=JSth1nyyLkxXRFhm2LrV0A&_nc_ss=7a30f&oh=00_Afxk5R5fFRqrFUduHe0KUjVBhZk21zcEWQlFo_VqhMN9ng&oe=69CEA8AD"
    }
  ];

  // ===========================================
  // EVENTOS
  // ===========================================
  const eventsImages = [
    {
      description: "Eventos con DJ en vivo",
      url: "https://scontent.fsjo8-1.fna.fbcdn.net/v/t51.75761-15/472240127_18009265946690161_7249590703318624480_n.jpg?_nc_cat=108&ccb=1-7&_nc_sid=13d280&_nc_ohc=-wWkEh4WCEcQ7kNvwEO6SAf&_nc_oc=AdoubjTDAjdJpfaoBc1bh0YcILYry9Ppm9dewjc9LrrDkIkKhUky8Msg4kI3JYzRtkMyo0C1fkJ97X2fJIWS16m-&_nc_zt=23&_nc_ht=scontent.fsjo8-1.fna&_nc_gid=0mrGZHHTk0jlluha8ChObw&_nc_ss=7a30f&oh=00_AfxDoq4iLd7yWC98qnsU48_WYJ2g7bDCEm2fhH9Adw-Lig&oe=69CE858E"
    },
    {
      description: "Ambiente de fiesta",
      url: "https://scontent.fsjo8-1.fna.fbcdn.net/v/t51.75761-15/470940870_18009266171690161_8629964451366537970_n.jpg?stp=dst-jpegr_tt6&_nc_cat=108&ccb=1-7&_nc_sid=13d280&_nc_ohc=t7s_MNRJm5QQ7kNvwFY8u8o&_nc_oc=AdqTiIZWJpwdkmuDtEGAkD5WXsKElDUbriYHhF1AryVJWAMVPgCUgwMPQi-G_DF8_c3Nr6c8ELInCFsA3H24l_kI&_nc_zt=23&se=-1&_nc_ht=scontent.fsjo8-1.fna&_nc_gid=m_eLWUb-ONgpZdHD92ywFw&_nc_ss=7a30f&oh=00_AfyOCC7AAMTOWZJGiJ63kn3KY6OTZfo0xz3dr4EQVfFk-A&oe=69CE8CB9"
    },
    {
      description: "Noches memorables",
      url: "https://scontent.fsjo8-1.fna.fbcdn.net/v/t39.30808-6/469238785_18005545208690161_8684546020131478997_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=13d280&_nc_ohc=dhqpvh46hdoQ7kNvwG4keY3&_nc_oc=Adp-NNmhlGMyJyp7UyoZICi9gteGbSrawn47BjNeOylw88_FDLv3zQ1cCtnGh-m7BOYvBKwyUFji9wnDZnPPgak6&_nc_zt=23&_nc_ht=scontent.fsjo8-1.fna&_nc_gid=Ie2a7feThB5vhmGud9jXaA&_nc_ss=7a30f&oh=00_AfwxKeFHzrVCraMjQcfsO0Eg5Tbn5ElGxlZFdOHim9Vvgg&oe=69CEB2F4"
    }
  ];

  // Event hall images (real photos — curated order)
  const eventHallImages = [
    "/assets/SalonEventos/mesass2.jpg",   // Elegante con cortinas doradas — hero
    "/assets/SalonEventos/salon.jpg",      // Vista panorámica del salón
    "/assets/SalonEventos/Mesa.jpg",       // Detalle de mesa con vista
    "/assets/SalonEventos/Mesas2.jpeg",    // Decoración temática de mar
    "/assets/SalonEventos/postres.jpg",    // Celebración cumpleaños
  ];

  // Airbnb images
  const airbnbImages = [
    {
      description: "Habitación acogedora",
      url: "https://scontent.fsjo8-1.fna.fbcdn.net/v/t39.30808-6/457282273_17992859513690161_9127164110288451810_n.jpg?stp=dst-jpegr_tt6&_nc_cat=100&ccb=1-7&_nc_sid=13d280&_nc_ohc=6qEf3ZGn4xIQ7kNvwHUb3hf&_nc_oc=Adq7L_3A7AmKZZsP02MNkcRWu8rdCY8VaCWh4g9_9SFd8vrpEAE1dvzvVfWIrxhOcBDznUDDA-p-pVlbJhO5UjSI&_nc_zt=23&se=-1&_nc_ht=scontent.fsjo8-1.fna&_nc_gid=PJk5ygkeTCNfpBTIgVwgwQ&_nc_ss=7a30f&oh=00_AfyiX_VVhPFLFsRPgPmUukq572mSNe1nM-LxDiGasPNoxA&oe=69CE41AE"
    },
    {
      description: "Interior del hospedaje",
      url: "https://scontent.fsjo8-1.fna.fbcdn.net/v/t39.30808-6/457392693_17992859492690161_3873199616786529814_n.jpg?stp=dst-jpegr_tt6&_nc_cat=100&ccb=1-7&_nc_sid=13d280&_nc_ohc=W_vZwc-4jJwQ7kNvwEMcJGK&_nc_oc=Ado1Zg22BgKrouI-_nawqNdYR9BPvQ3oXa_9R5KVoV6Ds18nkMkV4cfYaSqy7Pa31n-GzWWhmeupsu348mGWLWk&_nc_zt=23&se=-1&_nc_ht=scontent.fsjo8-1.fna&_nc_gid=GQDUes5VfEArQ5mCJ9hm5A&_nc_ss=7a30f&oh=00_AfwdznYcifVxVKDoJq78DX7H-FlyLOW7FKinSN5PWlhqbA&oe=69CE887C"
    }
  ];

  // Gallery moments - using all available images
  const momentsImages = [
    heroImage,
    ...terraceImages.map(img => img.url),
    ...foodTruckImages.map(img => img.url),
    ...foodTruckImages.slice(0, 2).map(img => img.url),
    ...eventsImages.map(img => img.url),
    ...airbnbImages.map(img => img.url)
  ];

  return (
    <div className="overflow-x-hidden">
      <Navbar />
      <Hero imageUrl={heroImage} />
      <TerraceSection images={terraceImages} />
      <EventsSection mainEvents={mainEvents} upcomingPosters={upcomingEvents} />
      <FoodTruckSection images={foodTruckImages.map(img => img.url)} />
      <EventHallSection images={eventHallImages} />
      <AirbnbSection images={airbnbImages.map(img => img.url)} />
      <MomentsGallery images={momentsImages} />
      <InfoSection />
      <Footer />
      <ChatAssistant />
    </div>
  );
}
