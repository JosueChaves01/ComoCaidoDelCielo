import { Hero } from "./components/Hero";
import { TerraceSection } from "./components/TerraceSection";
import { FoodTruckSection } from "./components/FoodTruckSection";
import { EventsSection } from "./components/EventsSection";
import { EventHallSection } from "./components/EventHallSection";
import { AirbnbSection } from "./components/AirbnbSection";
import { MomentsGallery } from "./components/MomentsGallery";
import { InfoSection } from "./components/InfoSection";
import { Footer } from "./components/Footer";
import { ChatAssistant } from "./components/ChatAssistant";
import { Navbar } from "./components/Navbar";

export default function App() {
  // Hero image
  const heroImage = "https://images.unsplash.com/photo-1758571993819-029a11a09ed0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdW5zZXQlMjB0ZXJyYWNlJTIwbW91bnRhaW4lMjB2aWV3fGVufDF8fHx8MTc3NDcyOTM2Nnww&ixlib=rb-4.1.0&q=80&w=1080";

  // Terrace images
  const terraceImages = [
    "https://images.unsplash.com/photo-1771784970622-dc59bba3f1aa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzY2VuaWMlMjBvdmVybG9vayUyMHRlcnJhY2UlMjB2aWV3cG9pbnR8ZW58MXx8fHwxNzc0NzI5MzY5fDA&ixlib=rb-4.1.0&q=80&w=1080",
    "https://images.unsplash.com/photo-1774346601445-5547d48f39d6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvdXRkb29yJTIwdGVycmFjZSUyMGZyaWVuZHMlMjBnYXRoZXJpbmd8ZW58MXx8fHwxNzc0NzI5MzY2fDA&ixlib=rb-4.1.0&q=80&w=1080"
  ];

  // Food truck images
  const foodTruckImages = [
    "https://images.unsplash.com/photo-1552380159-55fd9f132843?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb29kJTIwdHJ1Y2slMjBnb3VybWV0JTIwZXZlbmluZ3xlbnwxfHx8fDE3NzQ3MjkzNjZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "https://images.unsplash.com/photo-1718066236092-fde38149a233?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvdXRkb29yJTIwZGluaW5nJTIwbmF0dXJhbCUyMGxpZ2h0fGVufDF8fHx8MTc3NDcyOTM2OHww&ixlib=rb-4.1.0&q=80&w=1080",
    "https://images.unsplash.com/photo-1673883429956-726cd5f67985?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3VudGFpbiUyMGxhbmRzY2FwZSUyMGdvbGRlbiUyMGhvdXJ8ZW58MXx8fHwxNzc0NzI5MzY4fDA&ixlib=rb-4.1.0&q=80&w=1080"
  ];

  // Events images
  const eventsImages = [
    "https://images.unsplash.com/photo-1761145090303-670cf0c19773?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvdXRkb29yJTIwcGFydHklMjBESiUyMGV2ZW50fGVufDF8fHx8MTc3NDcyOTM2N3ww&ixlib=rb-4.1.0&q=80&w=1080",
    "https://images.unsplash.com/photo-1760783319065-d5b31a94b017?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZW9wbGUlMjBjZWxlYnJhdGluZyUyMG91dGRvb3IlMjBldmVudHxlbnwxfHx8fDE3NzQ3MjkzNjl8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "https://images.unsplash.com/photo-1768028758084-e6b264ece28b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib25maXJlJTIwbmlnaHQlMjBmcmllbmRzJTIwb3V0ZG9vcnN8ZW58MXx8fHwxNzc0NzI5MzY4fDA&ixlib=rb-4.1.0&q=80&w=1080"
  ];

  // Event hall image
  const eventHallImage = "https://images.unsplash.com/photo-1763231575952-98244918f99b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVnYW50JTIwZXZlbnQlMjBoYWxsJTIwaW50ZXJpb3J8ZW58MXx8fHwxNzc0NzI5MzY3fDA&ixlib=rb-4.1.0&q=80&w=1080";

  // Airbnb images
  const airbnbImages = [
    "https://images.unsplash.com/photo-1758983065583-9cea714214f9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3p5JTIwY2FiaW4lMjBiZWRyb29tJTIwbmF0dXJlfGVufDF8fHx8MTc3NDcyOTM2N3ww&ixlib=rb-4.1.0&q=80&w=1080",
    "https://images.unsplash.com/photo-1768578927019-8be9eb339fb5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxydXN0aWMlMjBhY2NvbW1vZGF0aW9uJTIwYWlyYm5iJTIwaW50ZXJpb3J8ZW58MXx8fHwxNzc0NzI5MzcwfDA&ixlib=rb-4.1.0&q=80&w=1080"
  ];

  // Gallery moments - using all available images
  const momentsImages = [
    heroImage,
    ...terraceImages,
    ...foodTruckImages.slice(0, 2),
    ...eventsImages,
    ...airbnbImages
  ];

  return (
    <div className="overflow-x-hidden">
      <Navbar />
      <Hero imageUrl={heroImage} />
      <TerraceSection images={terraceImages} />
      <FoodTruckSection images={foodTruckImages} />
      <EventsSection images={eventsImages} />
      <EventHallSection image={eventHallImage} />
      <AirbnbSection images={airbnbImages} />
      <MomentsGallery images={momentsImages} />
      <InfoSection />
      <Footer />
      <ChatAssistant />
    </div>
  );
}