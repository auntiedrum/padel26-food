import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, Clock, Star, Utensils, ChevronLeft, List, Map as MapIcon, ExternalLink } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { useNavigate, useLocation, Routes, Route } from 'react-router-dom';
import kobutaFront from './assets/restaurants/kobuta_front.png';
import palmerFront from './assets/restaurants/palmer_front.png';
import backupFront from './assets/restaurants/backup_front.png';

const ImageWithFallback = ({ src, alt, className, fallback = backupFront }) => {
  const [imgSrc, setImgSrc] = useState(src);

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      onError={() => {
        if (imgSrc !== fallback) {
          setImgSrc(fallback);
        }
      }}
    />
  );
};

const images = {
  palmer: [
    'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/15/d2/68/2a/buena-carne.jpg?w=800&h=-1&s=1',
    'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2a/8d/1e/49/entrana-skirt-steak.jpg?w=800&h=-1&s=1',
    'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2e/e3/2a/25/in-out.jpg?w=800&h=-1&s=1',
    'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2a/ab/ad/0c/caption.jpg?w=800&h=-1&s=1'
  ],
  atlantida: [
    'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2b/c7/c0/44/caption.jpg?w=1100&h=1100&s=1',
    'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2a/be/f6/50/caption.jpg?w=1100&h=1100&s=1',
    'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2a/be/f6/51/caption.jpg?w=1100&h=1100&s=1',
    'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/18/a6/70/ae/img-20190805-202233-largejpg.jpg?w=800&h=800&s=1'
  ],
  farolito: [
    'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2e/82/ff/53/caption.jpg?w=1100&h=1100&s=1',
    'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2a/bc/b4/0b/caption.jpg?w=1100&h=1100&s=1',
    'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1a/af/fc/6e/asado-de-tira.jpg?w=1100&h=1100&s=1',
    'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2e/46/00/56/caption.jpg?w=1100&h=1100&s=1'
  ],
  kobuta: [
    'https://images.squarespace-cdn.com/content/v1/56c24386746fb92170364c67/1519315570220-NMK0D13L0H0L0H0L0H0L/image-asset.jpeg',
    'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1b/30/80/7d/karaage.jpg?w=1100&h=1100&s=1',
    'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1b/30/80/7c/gyozas.jpg?w=1100&h=1100&s=1',
    'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1b/30/80/7e/kobuta-ramen-i-mes.jpg?w=1100&h=1100&s=1'
  ],
  mamma: [
    'https://www.pizzeriamammaitalia.com/img-trans/productos/23079/fotos/1024-65e8a9e5b7cee-mammamia.png',
    'https://www.pizzeriamammaitalia.com/img-trans/productos/23079/fotos/1024-65e8a8c91edfd-mammamia.png',
    'https://www.pizzeriamammaitalia.com/img-trans/productos/23079/fotos/1024-65e8a96209493-mammamia.png',
    'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1a/0b/22/0c/pizza.jpg?w=800&h=-1&s=1'
  ],
  purabrasa: [
    'https://www.purabrasa.com/wp-content/uploads/2021/01/machete-purabrasa.png',
    'https://www.purabrasa.com/wp-content/uploads/2021/01/pulpo-purabrasa.png',
    'https://www.purabrasa.com/wp-content/uploads/2021/01/canelon-purabrasa.png',
    'https://www.purabrasa.com/wp-content/uploads/2021/01/steak-tartar-purabrasa.png'
  ],
  filigrana: [
    'https://media-cdn.tripadvisor.com/media/photo-s/0e/6a/f1/b7/photo0jpg.jpg',
    'https://media-cdn.tripadvisor.com/media/photo-s/11/49/7f/41/dsc-0010-largejpg.jpg',
    'https://media-cdn.tripadvisor.com/media/photo-s/13/2b/43/d8/solomillo-al-whisky.jpg',
    'https://media-cdn.tripadvisor.com/media/photo-s/11/2c/31/3b/pouring-wine.jpg'
  ],
  canota: [
    'https://media-cdn.tripadvisor.com/media/photo-s/13/b8/b2/8d/puerco.jpg',
    'https://media-cdn.tripadvisor.com/media/photo-s/0f/f2/a9/ff/albondigas-con-sepia.jpg',
    'https://media-cdn.tripadvisor.com/media/photo-s/0a/8a/7e/6a/hamburguesitas.jpg',
    'https://media-cdn.tripadvisor.com/media/photo-s/0d/16/c5/d2/un-plaer-per-al-paladar.jpg'
  ],
  mondore: [
    'https://media-cdn.tripadvisor.com/media/photo-s/0d/95/8e/3c/mondore.jpg',
    'https://media-cdn.tripadvisor.com/media/photo-s/0a/73/0c/33/tastet-de-miniburgers.jpg',
    'https://media-cdn.tripadvisor.com/media/photo-s/0c/fc/1d/1d/solomillo-de-cerdo-con.jpg',
    'https://media-cdn.tripadvisor.com/media/photo-s/0c/fc/1d/2c/degustacion-de-cervezas.jpg'
  ],
  tramuntana: [
    'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2c/2e/ab/b3/restaurant.jpg?w=1100&h=1100&s=1',
    'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2c/2e/ab/b6/restaurant.jpg?w=1100&h=1100&s=1',
    'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2c/2e/ab/ad/breakfast.jpg?w=1100&h=1100&s=1',
    'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2c/2e/ab/bd/bar.jpg?w=1100&h=1100&s=1'
  ]
};

// Data extracted and structured from the Strategic Gastronomic Assessment
const restaurants = [
  {
    id: 1,
    name: "Palmer Restaurant",
    cuisine: "Upscale Mediterranean",
    flag: "🇪🇸",
    rating: "4.4",
    price: "£27 - £47",

    drinks: "Premium wine, local beer, cocktails",
    travel: "8-min walk",
    isWalkable: true,
    hours: "Mon-Sun: 13:00-15:30 & 19:30-22:30",
    meatHighlights: "French Dip featuring thinly sliced roast beef; Pan-seared Filet Mignon tidbits; Wagyu Sausage skewer.",
    gallery: images.palmer,
    heroImage: palmerFront,
    lat: 41.3551,
    lng: 2.1229
  },
  {
    id: 2,
    name: "Restaurante Atlantida",
    cuisine: "Traditional Spanish",
    flag: "🇪🇸",
    rating: "4.0",
    price: "£17 - £26",
    taxiRank: "€10 - €15",
    drinks: "Turia draft beer, affordable Spanish wines",
    travel: "9-min walk",
    isWalkable: true,
    hours: "Mon-Sun: 13:30-16:00 & 19:00-22:00",
    meatHighlights: "Classic Spanish broiled steaks; Tender roast suckling pig (Cochinillo); Traditional lamb roasts.",
    gallery: images.atlantida,
    heroImage: backupFront,
    lat: 41.3620,
    lng: 2.1362
  },
  {
    id: 3,
    name: "Tramuntana Restaurant",
    cuisine: "Spanish / Med",
    flag: "🇪🇸",
    rating: "4.5",
    price: "£17 - £30",
    taxiRank: "€0 (Hotel)",
    drinks: "Full hotel bar, speciality coffee",
    travel: "0-min walk (Inside Hotel)",
    isWalkable: true,
    hours: "Mon-Fri: 13:00-15:30 (Lunch) (Breakfast daily)",
    meatHighlights: "Premium Spanish Entrecote with sea salt; Slow-cooked beef short ribs; Market-fresh meat selections.",
    gallery: images.tramuntana,
    heroImage: backupFront,
    lat: 41.3653,
    lng: 2.1274
  },
  {
    id: 4,
    name: "El Farolito",
    cuisine: "Argentinian Grill",
    flag: "🇦🇷",
    rating: "4.7",
    price: "£13 - £21",
    taxiRank: "€12 - €18",
    drinks: "Beer, Sangria, Spanish wines",
    travel: "22-min walk (5-min taxi)",
    isWalkable: false,
    hours: "Tue-Sun: 11:00-23:00 (Closed Mondays)",
    meatHighlights: "Legendary Carne Asada Super Burritos; Al Pastor grilled pork; Steak Super Suiza quesadillas.",
    gallery: images.farolito,
    heroImage: backupFront,
    lat: 41.3642,
    lng: 2.1381
  },
  {
    id: 5,
    name: "Kobuta Ramen i més",
    cuisine: "Authentic Japanese",
    flag: "🇯🇵",
    rating: "4.5",
    price: "£13 - £21",
    taxiRank: "€15 - €22",
    drinks: "Sake, Japanese lagers, green tea",
    travel: "30-min walk (10-min taxi)",
    isWalkable: false,
    hours: "Wed-Sat: 13:30-16:00 & 20:30-23:00, Tue: 20:30-23:00",
    meatHighlights: "Tonkotsu with melt-in-the-mouth Chashu (pork belly); Karaage fried chicken; Chashudon rice bowls.",
    gallery: images.kobuta,
    heroImage: kobutaFront,
    lat: 41.3753,
    lng: 2.1363
  },
  {
    id: 6,
    name: "Pizzeria Mamma Italia",
    cuisine: "Authentic Italian",
    flag: "🇮🇹",
    rating: "4.5",
    price: "£13 - £21",
    taxiRank: "€15 - €22",
    drinks: "Chianti, Negronis, Italian sodas",
    travel: "35-min walk (10-min taxi)",
    isWalkable: false,
    hours: "Tue-Sat: 11:30-14:00 & 17:00-21:00",
    meatHighlights: "Meat Lovers Pizza with pepperoni, bacon & ham; Penne Mignon with beef tips; Italian spicy sausage.",
    gallery: images.mamma,
    heroImage: backupFront,
    lat: 41.3740,
    lng: 2.1400
  },
  {
    id: 7,
    name: "Pura Brasa (Arenas)",
    cuisine: "Charcoal Grill",
    flag: "🇪🇸",
    rating: "4.5",
    price: "£21 - £38",
    taxiRank: "€10 - €15",
    drinks: "Craft beer, wine pairings for meats",
    travel: "30-min walk (10-min taxi)",
    isWalkable: false,
    hours: "Mon-Sun: 12:30-00:00 (Non-stop kitchen)",
    meatHighlights: "20-hour JOSPER Grilled Spanish Pork Ribs; Wagyu boneless loin; 'Machete' steak; Spanish lamb shoulder.",
    gallery: images.purabrasa,
    heroImage: backupFront,
    lat: 41.3763,
    lng: 2.1493
  },
  {
    id: 8,
    name: "Restaurante Filigrana",
    cuisine: "Market Med Grill",
    flag: "🇪🇸",
    rating: "4.8",
    price: "£43 - £68",
    taxiRank: "€10 - €15",
    drinks: "Premium wine centre, Cava",
    travel: "30-min walk (10-min taxi)",
    isWalkable: false,
    hours: "Mon-Sun: 13:00-16:00 & 20:00-23:00",
    meatHighlights: "Slow-braised Beef Tongue; Premium Market Grill selections; Pollo con Mole; Short rib tacos.",
    gallery: images.filigrana,
    heroImage: backupFront,
    lat: 41.3763,
    lng: 2.1445
  },
  {
    id: 9,
    name: "Casa de Tapas Cañota",
    cuisine: "Galician Gastropub",
    flag: "🇪🇸",
    rating: "4.0",
    price: "£26 - £38",
    taxiRank: "€12 - €17",
    drinks: "Draft beer, local wine, vermouth",
    travel: "35-min walk (12-min taxi)",
    isWalkable: false,
    hours: "Thu-Sun: 13:00-23:00, Mon-Wed: 13:00-16:00 & 19:30-23:00",
    meatHighlights: "Carrillada tender beef cheeks; Garlic & miso tenderloin tacos; Local sausage with Santa Pau beans.",
    gallery: images.canota,
    heroImage: backupFront,
    lat: 41.3742,
    lng: 2.1559
  },
  {
    id: 10,
    name: "MonDoré",
    cuisine: "Tapas / Gastropub",
    flag: "🇪🇸",
    rating: "4.5",
    price: "£21 - £30",
    taxiRank: "€14 - €20",
    drinks: "Extensive craft beer, famous house Sangria",
    travel: "40-min walk (15-min taxi)",
    isWalkable: false,
    hours: "Mon-Sun: 13:00-16:00 & 20:00-23:00",
    meatHighlights: "Award-winning Iberico ham croquettes; Catalan meat tapas; Custom dry-aged beef cuts on request.",
    gallery: images.mondore,
    heroImage: backupFront,
    lat: 41.3790,
    lng: 2.1578
  }
];

const HOTEL_LOCATION = { lat: 41.3582, lng: 2.1345, name: "Leonardo Royal Hotel" };

const createCustomIcon = (rating = null, isHotel = false, flag = "") => {
  return new L.DivIcon({
    className: 'custom-div-icon',
    html: `
      <div class="marker-pin ${isHotel ? 'marker-hotel' : ''} flex items-center justify-center">
        ${isHotel ? '<span class="text-xs">🏨</span>' : `<div class="flex flex-col items-center">
            <span class="text-[8px] leading-none mb-0.5">${flag}</span>
            <span class="rating-label">${rating}</span>
          </div>`}
      </div>`,
    iconSize: [35, 45],
    iconAnchor: [17, 45]
  });
};

const convertEurToGbp = (eurRange) => {
  if (!eurRange || eurRange.includes('Hotel')) return null;
  const matches = eurRange.match(/\d+/g);
  if (!matches) return null;
  const rate = 0.85;
  const gbpMatches = matches.map(m => Math.round(parseInt(m) * rate));
  return `£${gbpMatches[0]} - £${gbpMatches[1]}`;
};

function MapView({ onSelect, restaurants: places }) {
  return (
    <div className="w-full h-full bg-neutral-900">
      <MapContainer 
        center={[HOTEL_LOCATION.lat, HOTEL_LOCATION.lng]} 
        zoom={14} 
        scrollWheelZoom={true}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; CARTO'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        
        <Marker position={[HOTEL_LOCATION.lat, HOTEL_LOCATION.lng]} icon={createCustomIcon(null, true)}>
          <Popup>
            <div className="font-bold">Leonardo Royal Hotel</div>
            <div className="text-xs text-neutral-500">Starting Point</div>
          </Popup>
        </Marker>

        {places.map((place) => {
          const walkTime = parseInt(place.travel.match(/\d+/)?.[0] || 0);
          const showTaxiInGbp = walkTime > 15;
          const gbpTaxi = convertEurToGbp(place.taxiRank);

          return (
            <Marker 
              key={place.id} 
              position={[place.lat, place.lng]} 
              icon={createCustomIcon(place.rating, false, place.flag)}
            >
              <Popup>
                <div className="flex flex-col gap-2 min-w-[220px]">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-[#0E2433] leading-tight text-sm">{place.name}</h4>
                      <p className="text-[10px] text-[#2E59FB] uppercase font-black tracking-widest flex items-center gap-1">
                        <span>{place.flag}</span>
                        <span>{place.cuisine}</span>
                      </p>
                    </div>
                    <div className="flex items-center gap-1 bg-[#EEFC2C] px-1.5 py-0.5 rounded-full">
                      <Star size={10} className="text-black fill-black" />
                      <span className="text-[10px] font-black text-black">{place.rating}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-1 py-1 border-t border-gray-100 mt-1">
                    <div className="flex items-center gap-2 text-[11px] text-gray-500">
                      <div className="flex items-center gap-1.5 px-1.5 py-0.5 bg-[#2E59FB]/5 text-[#2E59FB] text-[8px] font-black rounded-md">
                        FROM HOTEL 🚶
                      </div>
                      <span className="font-semibold text-[10px]">{place.travel.split('(')[0]} ({walkTime}m)</span>
                    </div>
                  </div>

                  <button 
                    onClick={() => onSelect(place)}
                    className="w-full bg-[#2E59FB] text-white mt-1 py-2.5 rounded-full text-xs font-black flex items-center justify-center gap-2 hover:bg-[#1a44e5] transition-all"
                  >
                    <span>VIEW DOSSIER</span>
                    <ExternalLink size={12} />
                  </button>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeView, setActiveView] = useState('list');
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [nukedIds, setNukedIds] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('nukedRestaurants');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  const visibleRestaurants = restaurants.filter(r => !nukedIds.includes(r.id));

  useEffect(() => {
    const path = location.pathname;
    if (path.startsWith('/restaurant/')) {
      const id = parseInt(path.split('/').pop());
      const restaurant = restaurants.find(r => r.id === id);
      if (restaurant) {
        setSelectedRestaurant(restaurant);
        setActiveView('detail');
      } else {
        navigate('/', { replace: true });
      }
    } else if (path === '/map') {
      setActiveView('map');
      setSelectedRestaurant(null);
    } else {
      setActiveView('list');
      setSelectedRestaurant(null);
    }
  }, [location.pathname, navigate]);

  const handleSelect = (restaurant) => {
    navigate(`/restaurant/${restaurant.id}`);
  };

  const handleBack = () => {
    navigate('/');
  };

  const nukeRestaurant = (id) => {
    if (typeof window !== 'undefined' && confirm('Nuke this place? You will never see it again.')) {
      const newNuked = [...nukedIds, id];
      setNukedIds(newNuked);
      localStorage.setItem('nukedRestaurants', JSON.stringify(newNuked));
      navigate('/');
    }
  };

  const [showSausageScore, setShowSausageScore] = useState(false);

  const goToNext = (currentId) => {
    const currentIndex = visibleRestaurants.findIndex(r => r.id === currentId);
    if (currentIndex === -1) return;
    const nextIndex = (currentIndex + 1) % visibleRestaurants.length;
    navigate(`/restaurant/${visibleRestaurants[nextIndex].id}`);
    setShowSausageScore(false);
  };

  const goToPrev = (currentId) => {
    const currentIndex = visibleRestaurants.findIndex(r => r.id === currentId);
    if (currentIndex === -1) return;
    const prevIndex = (currentIndex - 1 + visibleRestaurants.length) % visibleRestaurants.length;
    navigate(`/restaurant/${visibleRestaurants[prevIndex].id}`);
    setShowSausageScore(false);
  };

  const generateMapsUrl = (restaurantName, useCurrent = false) => {
    const origin = useCurrent ? '' : encodeURIComponent("Leonardo Royal Hotel Barcelona Fira");
    const destination = encodeURIComponent(`${restaurantName}, Barcelona, Spain`);
    // Default to walking Mode
    return `https://www.google.com/maps/dir/?api=1${origin ? `&origin=${origin}` : ''}&destination=${destination}&travelmode=walking`;
  };

  return (
    <div className="min-h-screen bg-[#0E2433] flex items-center justify-center p-0 sm:p-4">
      <div className="w-full max-w-md bg-[#F5F7FF] min-h-screen sm:min-h-[85vh] sm:rounded-[32px] overflow-hidden flex flex-col shadow-[0_32px_64px_-15px_rgba(0,0,0,0.5)] app-container relative">
        
        {/* Playtomic Style Header */}
        <header className="bg-[#2E59FB] px-8 pt-8 pb-6 flex flex-col gap-6 sticky top-0 z-30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-white">
              {activeView === 'detail' && (
                <button 
                  onClick={handleBack}
                  className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-all border border-white/10"
                >
                  <ChevronLeft size={20} />
                </button>
              )}
              <h1 className="text-xl font-black tracking-tightest uppercase italic">
                {activeView === 'detail' ? 'Dossier' : 'Barcelona Dining'}
              </h1>
            </div>
            
            {activeView !== 'detail' && (
              <div className="flex bg-black/10 p-1 rounded-full border border-white/10">
                <button 
                  onClick={() => navigate('/')}
                  className={`p-2.5 rounded-full transition-all ${activeView === 'list' ? 'bg-[#C8FC2C] text-black shadow-lg' : 'text-white/60'}`}
                >
                  <List size={20} />
                </button>
                <button 
                  onClick={() => navigate('/map')}
                  className={`p-2.5 rounded-full transition-all ${activeView === 'map' ? 'bg-[#C8FC2C] text-black shadow-lg' : 'text-white/60'}`}
                >
                  <MapIcon size={20} />
                </button>
              </div>
            )}
          </div>
        </header>

        {/* View Transition Container */}
        <div className="relative flex-1 overflow-hidden bg-[#F5F7FF]">
          
          {/* LIST VIEW */}
          <div 
            className={`absolute inset-0 w-full h-full overflow-y-auto pb-8 transition-all duration-500 ease-out ${
              activeView === 'list' ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0 pointer-events-none'
            }`}
          >
            <div className="p-6 space-y-6">
              {visibleRestaurants.map((place) => (
                <button
                  key={place.id}
                  onClick={() => handleSelect(place)}
                  className="w-full text-left bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_15px_45px_rgb(0,0,0,0.08)] transition-all duration-300 group border border-gray-100"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1 pr-4">
                      <p className="text-[10px] text-[#2E59FB] uppercase font-black tracking-[0.2em] mb-1 flex items-center gap-2">
                        <span className="text-base grayscale group-hover:grayscale-0 transition-all">{place.flag}</span>
                        {place.cuisine}
                      </p>
                      <h2 className="text-lg font-black text-[#0E2433] leading-tight group-hover:text-[#2E59FB] transition-colors uppercase">
                        {place.name}
                      </h2>
                    </div>
                    <div className="flex items-center bg-[#C8FC2C] px-3 py-1 rounded-full shadow-sm text-black">
                      <Star size={12} className="fill-current mr-1" />
                      <span className="text-xs font-black">{place.rating}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <p className="text-sm text-gray-500 font-medium leading-relaxed">
                       {place.meatHighlights.split(';')[0]}...
                    </p>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-gray-50 mt-4">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 text-[11px] font-bold text-gray-400">
                          <Clock size={14} className="text-[#2E59FB]" />
                          <span>{place.hours.split('&')[0].trim()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1.5 px-1.5 py-0.5 bg-[#2E59FB]/5 text-[#2E59FB] text-[8px] font-black rounded-md">
                            FROM HOTEL 🚶
                          </div>
                          <span className="text-[11px] font-bold text-gray-400">{place.travel.split('(')[0].trim()}</span>
                        </div>
                      </div>
                      <div className="bg-[#2E59FB]/5 p-2 rounded-full text-[#2E59FB] group-hover:bg-[#2E59FB] group-hover:text-white transition-all">
                        <ChevronLeft size={16} className="rotate-180" />
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* MAP VIEW */}
          <div 
            className={`absolute inset-0 w-full h-full transition-all duration-500 ease-out ${
              activeView === 'map' ? 'scale-100 opacity-100' : 'scale-105 opacity-0 pointer-events-none'
            }`}
          >
            <MapView onSelect={handleSelect} restaurants={visibleRestaurants} />
          </div>

          {/* DETAIL VIEW */}
          <div 
            className={`absolute inset-0 w-full h-full overflow-y-auto bg-white transition-all duration-500 ease-out z-40 ${
              activeView === 'detail' ? 'translate-x-0' : 'translate-x-full'
            }`}
          >
            {selectedRestaurant && (
              <div className="pb-32 min-h-full flex flex-col">
                <div className="p-8 pb-10 bg-[#2E59FB] text-white rounded-b-[48px] shadow-xl relative">
                  <div className="flex flex-col gap-6 mb-4">
                    <div className="flex justify-center mt-2">
                       <span className="text-xl sm:text-2xl font-black text-[#FF00FF] uppercase tracking-[0.2em] text-center drop-shadow-[0_0_15px_rgba(255,0,255,0.8)] crazy-flicker bg-black/20 px-6 py-3 rounded-3xl border border-[#FF00FF]/30 backdrop-blur-sm flex items-center gap-2">
                         <span className="text-3xl">{selectedRestaurant.flag}</span>
                         <span>{selectedRestaurant.cuisine}</span>
                       </span>
                    </div>

                    <div className="flex items-center justify-between gap-2">
                      <button 
                        onClick={() => goToPrev(selectedRestaurant.id)}
                        className="flex items-center gap-1.5 px-3 py-2 bg-white/10 text-white text-[10px] font-black rounded-full hover:bg-white/20 transition-all border border-white/20"
                      >
                        <ChevronLeft size={14} /> BACK
                      </button>

                      <div className="flex items-center gap-2 flex-1 justify-center">
                        <a 
                          href={`https://www.google.com/search?q=${encodeURIComponent(selectedRestaurant.name + ' Barcelona reviews')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center px-4 py-2 bg-[#C8FC2C] text-black text-[10px] font-black rounded-full shadow-[0_0_15px_rgba(200,252,44,0.4)] hover:shadow-[0_0_25px_rgba(200,252,44,0.8)] hover:bg-white transition-all cursor-pointer hover:-translate-y-0.5"
                          title="Read reviews on Google"
                        >
                          <Star size={12} className="mr-1.5 fill-current" /> {selectedRestaurant.rating} REVIEWS
                        </a>
                      </div>

                      <button 
                        onClick={() => goToNext(selectedRestaurant.id)}
                        className="flex items-center gap-1.5 px-3 py-2 bg-[#C8FC2C] text-black text-[10px] font-black rounded-full shadow-[0_0_15px_rgba(200,252,44,0.4)] hover:shadow-[0_0_25px_rgba(200,252,44,0.8)] hover:bg-[#EEFC2C] transition-all hover:-translate-y-0.5"
                      >
                        NEXT <ChevronLeft size={14} className="rotate-180" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-center gap-4">
                      <h2 className="text-3xl font-black tracking-tightest leading-tight uppercase italic text-center">
                        {selectedRestaurant.name}
                      </h2>
                      <a 
                        href={generateMapsUrl(selectedRestaurant.name, true)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 bg-[#C8FC2C] text-black rounded-full shadow-lg hover:scale-110 transition-all active:scale-95 relative ripple-effect"
                        title="Get directions from my location"
                      >
                        <Navigation size={20} className="fill-current" />
                      </a>
                    </div>
                  </div>
                </div>

                <div className="p-8 space-y-6 -mt-6">
                  {/* Logistics Section - Moved Up for better usability */}
                  <div className="bg-white rounded-[32px] p-6 shadow-[0_20px_60px_-15px_rgba(46,89,251,0.12)] space-y-5 border border-gray-50">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-[#2E59FB]/10 rounded-xl text-[#2E59FB] shrink-0">
                          <Clock size={22} />
                        </div>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Opening Hours</p>
                      </div>
                      <div className="pl-[52px]">
                        <p className="text-base text-[#0E2433] leading-relaxed font-black bg-gray-50 p-4 rounded-2xl border border-gray-100 shadow-inner">
                          {selectedRestaurant.hours}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <div className="p-2.5 bg-[#2E59FB]/10 rounded-xl text-[#2E59FB]">
                        <Utensils size={18} />
                      </div>
                      <div className="flex-1">
                        <p className="text-[10px] text-gray-400 font-bold uppercase mb-0.5 tracking-wider">Pricing & Drinks</p>
                        <p className="text-sm text-[#0E2433] leading-relaxed font-black">{selectedRestaurant.price} • <span className="text-[#2E59FB]">{selectedRestaurant.drinks}</span></p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="p-2.5 bg-[#2E59FB]/10 rounded-xl text-[#2E59FB]">
                        <MapPin size={18} />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-[#0E2433] leading-relaxed font-black">
                          It will take about {(() => {
                            const minutes = parseInt(selectedRestaurant.travel.match(/\d+/)?.[0] || 0);
                            return Math.max(1, Math.round(minutes * 0.85)); // Reduce by 15%
                          })()} minutes from the hotel 🚶
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Hero Restaurant Image */}
                  <div className="aspect-[16/9] rounded-[32px] overflow-hidden shadow-xl border-4 border-white">
                    <ImageWithFallback 
                      src={selectedRestaurant.heroImage} 
                      alt={selectedRestaurant.name} 
                      className="w-full h-full object-cover" 
                    />
                  </div>

                  {/* Meat Highlights */}
                  <div className="bg-[#0E2433] rounded-[32px] p-6 text-white shadow-2xl relative overflow-hidden group border border-white/5">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-[#C8FC2C]/10 rounded-full -mr-12 -mt-12 blur-2xl group-hover:bg-[#C8FC2C]/20 transition-all duration-500"></div>
                    <div className="flex items-center gap-3 mb-3">
                      <Star size={16} className="text-[#C8FC2C] fill-[#C8FC2C]" />
                      <h3 className="text-[10px] font-black text-[#C8FC2C] uppercase tracking-[0.2em]">Chef's Meat Highlights</h3>
                    </div>
                    <p className="text-sm text-white/95 leading-relaxed font-bold italic">
                      "{selectedRestaurant.meatHighlights}"
                    </p>
                  </div>

                  {/* Food Image Gallery */}
                  {(() => {
                    const uniqueGalleryImages = Array.from(new Set(selectedRestaurant.gallery));
                    const hasSingleUnique = uniqueGalleryImages.length === 1;

                    return (
                      <div className="space-y-4">
                        <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] px-2">Signature Dishes</h3>
                        {hasSingleUnique ? (
                          <div className="aspect-[16/9] rounded-3xl overflow-hidden shadow-xl border-2 border-gray-50 bg-gray-50">
                            <ImageWithFallback 
                              src={uniqueGalleryImages[0]} 
                              alt={`${selectedRestaurant.name} dish`} 
                              className="w-full h-full object-cover" 
                            />
                          </div>
                        ) : (
                          <div className="grid grid-cols-2 gap-3">
                            {uniqueGalleryImages.map((img, idx) => (
                              <div key={idx} className="aspect-square rounded-2xl overflow-hidden shadow-md border border-gray-100 bg-gray-50">
                                <ImageWithFallback 
                                  src={img} 
                                  alt={`${selectedRestaurant.name} dish`} 
                                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" 
                                />
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </div>

                <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto p-6 pointer-events-none flex flex-col gap-3 z-50">
                  <div className="flex gap-3">
                    <a
                      href={generateMapsUrl(selectedRestaurant.name)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="pointer-events-auto flex-1 bg-[#C8FC2C] hover:bg-[#b8ea28] hover:translate-y-[-2px] text-black py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 transition-all active:translate-y-[1px] shadow-[0_20px_40px_-10px_rgba(200,252,44,0.4)]"
                    >
                      <Navigation size={20} className="fill-current" />
                      <span>Get Directions</span>
                    </a>
                    <button 
                      onClick={() => setShowSausageScore(true)}
                      className="pointer-events-auto px-6 bg-[#2E59FB] hover:bg-[#1a44e5] text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg transition-all active:scale-95 whitespace-nowrap"
                    >
                      I REALLY LIKE SAUSAGE
                    </button>
                  </div>
                  {showSausageScore && (
                    <div className="pointer-events-auto bg-[#0E2433] text-[#C8FC2C] text-[10px] font-black uppercase tracking-widest p-3 rounded-xl text-center shadow-2xl border border-[#C8FC2C]/20 animate-bounce">
                      Currently, Richie has the high score! 👑
                    </div>
                  )}
                  <div className="h-4"></div> {/* Safety space at the bottom */}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
