export interface GalleryImage {
  src: string;
  caption: string;
  width: number;
  height: number;
}

const galleryImages: GalleryImage[] = [
  { src: '/images/clipart.jpg', caption: 'Clipart, Helsinki', width: 1734, height: 800 },
  { src: '/images/ride.jpg', caption: 'Ride in Birgit, Berlin', width: 983, height: 983 },
  { src: '/images/disco.jpg', caption: 'Disco balls in Birgit, Berlin', width: 1080, height: 720 },
  { src: '/images/xberg.jpg', caption: 'Xberg Acid, Berlin', width: 1080, height: 1080 },
  { src: '/images/gordon.jpg', caption: 'Random Illustration, Helsinki', width: 841, height: 592 },
  { src: '/images/sunglasses.jpg', caption: 'Posing in sunglasses, Helsinki', width: 1440, height: 1440 },
  { src: '/images/so_long_spectrum.jpg', caption: 'Cover process ideation, Helsinki', width: 1440, height: 617 },
  { src: '/images/ompputalo.jpg', caption: 'Ompputalo in Lapinlahti, Helsinki', width: 1536, height: 1024 },
  { src: '/images/duduk.jpg', caption: 'Duduk, Helsinki', width: 500, height: 500 },
  { src: '/images/kuvaxtila.jpg', caption: 'Projections in Kuva x Tila, Helsinki', width: 1080, height: 1080 },
  { src: '/images/laser.jpg', caption: 'Warning, Lasers, Helsinki', width: 1080, height: 1080 },
  { src: '/images/smokebreak.jpg', caption: 'Smoke break, Helsinki', width: 1080, height: 1080 },
  { src: '/images/discosea.jpg', caption: 'Disco at sea, Helsinki', width: 1080, height: 1080 },
  { src: '/images/kaiku.jpg', caption: 'Kaiku, Helsinki', width: 960, height: 720 },
  { src: '/images/freedom.jpg', caption: 'Occupied freedom, Helsinki', width: 1080, height: 1080 },
  { src: '/images/promo.jpg', caption: 'Shot by a friend, Helsinki', width: 900, height: 600 },
];

export default galleryImages;
