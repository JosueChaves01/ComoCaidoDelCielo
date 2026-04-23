import React, { useState, useEffect } from "react";
import { Navbar } from "../components/Navbar";
import { Hero } from "../components/Hero";
import { TerraceSection } from "../components/TerraceSection";
import { ReservationSection } from "../components/ReservationSection";
import { EventsSection } from "../components/EventsSection";
import { FoodTruckSection } from "../components/FoodTruckSection";
import { AirbnbSection } from "../components/AirbnbSection";
import { MomentsGallery } from "../components/MomentsGallery";
import { InfoSection } from "../components/InfoSection";
import { Footer } from "../components/Footer";
import { EventHallSection } from "../components/EventHallSection";
import { ChatAssistant } from "../components/ChatAssistant";
import { useNavigate } from "react-router";
import { supabase } from "../../lib/supabase";

interface MainEvent {
  id: string;
  image_url: string;
  title: string;
  description: string;
  date: string;
}

interface UpcomingEvent {
  id: string;
  poster_url: string;
  title: string;
}

const fallbackMainEvents: MainEvent[] = [
  {
    id: "1",
    image_url: "/assets/Eventos/ConciertoAtardecer.jpg",
    title: "Atardeceres Acústicos",
    description: "Cada sábado, disfruta de música en vivo mientras el sol se oculta sobre las montañas de San Ramón.",
    date: "Todos los Sábados, 4:30 PM"
  },
  {
    id: "2",
    image_url: "/assets/Eventos/CataVinos.jpg",
    title: "Catas de Altura",
    description: "Una selección exclusiva de vinos maridados con nuestra tabla de quesos artesanales.",
    date: "Próximo: 15 de Mayo"
  }
];

const fallbackUpcomingPosters: UpcomingEvent[] = [
  { id: "p1", poster_url: "/assets/Eventos/JazzNightPoster.jpg", title: "Noche de Jazz" },
  { id: "p2", poster_url: "/assets/Eventos/TapasPoster.jpg", title: "Festival de Tapas" },
  { id: "p3", poster_url: "/assets/Eventos/SaxofonPoster.jpg", title: "Noches de Saxofón" },
  { id: "p4", poster_url: "/assets/Eventos/ConciertosInstrumentosPoster.jpg", title: "Música en Vivo" },
];

export function Landing() {
  const navigate = useNavigate();
  const [mainEvents, setMainEvents] = useState<MainEvent[]>(fallbackMainEvents);
  const [upcomingEvents, setUpcomingEvents] = useState<UpcomingEvent[]>(fallbackUpcomingPosters);
  
  const scrollToReservation = () => {
    const el = document.getElementById('reservar');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { data: mainData } = await supabase
          .from('events_main')
          .select('*')
          .eq('is_active', true);
        if (mainData && mainData.length > 0) setMainEvents(mainData);

        const { data: upcomingData } = await supabase
          .from('events_upcoming')
          .select('*')
          .eq('is_active', true);
        if (upcomingData && upcomingData.length > 0) setUpcomingEvents(upcomingData);
      } catch (err) {
        console.error("Error fetching events:", err);
      }
    };
    fetchEvents();
  }, []);

  const heroImage = "/assets/Home/HeroHome3.jpg";
  const terraceImages = [
    { url: "/assets/Terrazas/Terraza1.jpg", description: "Vista panorámica" },
    { url: "/assets/Terrazas/Terraza2.jpg", description: "Ambiente íntimo" },
    { url: "/assets/Terrazas/Terraza3.jpg", description: "Deck de madera" },
    { url: "/assets/Terrazas/Terraza4.jpg", description: "VIP Experience" },
  ];
  const eventHallImages = [
    "/assets/SalonEventos/Salon1.jpg",
    "/assets/SalonEventos/Salon2.jpg",
    "/assets/SalonEventos/Salon3.jpg",
  ];
  const foodTruckImages = [
    { url: "/assets/Foodtruck/Comida4.jpg", description: "Pizza Artesanal" },
    { url: "/assets/Foodtruck/Comida2.jpg", description: "Hamburguesa Gourmet" },
    { url: "/assets/Foodtruck/Comida3.jpg", description: "Tacos de Autor" },
    { url: "/assets/Foodtruck/Comida1.jpg", description: "Postres Caseros" },
  ];
  const airbnbImages = [
    { url: "/assets/Airbnb/Airbnb1.jpg", description: "Habitación Principal" },
    { url: "/assets/Airbnb/Airbnb2.jpg", description: "Vista desde Balcón" },
    { url: "/assets/Airbnb/Airbnb3.jpg", description: "Jacuzzi Privado" },
  ];
  const momentsImages = [
    { url: "/assets/Momentos/Momento1.jpg", alt: "Atardecer" },
    { url: "/assets/Momentos/Momento2.jpg", alt: "Pareja brindando" },
    { url: "/assets/Momentos/Momento3.jpg", alt: "Amigos compartiendo" },
    { url: "/assets/Momentos/Momento4.jpg", alt: "Evento de noche" },
  ];

  const eventsImages = [
    "/assets/Eventos/Evento1.jpg",
    "/assets/Eventos/Evento2.jpg",
    "/assets/Eventos/Evento3.jpg",
  ];

  const allImagesToPreload = [
    heroImage,
    ...terraceImages.map(img => img.url),
    ...foodTruckImages.map(img => img.url),
    ...foodTruckImages.slice(0, 2).map(img => img.url),
    ...eventsImages.map(img => img.url),
    ...airbnbImages.map(img => img.url)
  ];

  return (
    <div className="overflow-x-hidden">
      <Navbar onOpenReservation={scrollToReservation} />
      <Hero imageUrl={heroImage} onOpenReservation={scrollToReservation} />
      <TerraceSection images={terraceImages} onOpenReservation={scrollToReservation} />
      <ReservationSection />
      <EventsSection mainEvents={mainEvents} upcomingPosters={upcomingEvents} />
      <EventHallSection images={eventHallImages} />
      <FoodTruckSection images={foodTruckImages.map(img => img.url)} />
      <AirbnbSection images={airbnbImages.map(img => img.url)} />
      <MomentsGallery images={momentsImages} />
      <InfoSection />
      <Footer />
      <ChatAssistant />
    </div>
  );
}
