import http from 'http';
import https from 'https';
import crypto from 'crypto';

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
    'https://www.mammamiapoblenou.com/img-trans/productos/23079/fotos/1024-65e8a9e5b7cee-mammamia.png',
    'https://www.mammamiapoblenou.com/img-trans/productos/23079/fotos/1024-65e8a8c91edfd-mammamia.png',
    'https://www.mammamiapoblenou.com/img-trans/productos/23079/fotos/1024-65e8a96209493-mammamia.png',
    'https://b.zmtcdn.com/data/pictures/8/16723228/626507310065073e5f5c8a9e6b7c5e9a.jpg'
  ],
  purabrasa: [
    'https://www.purabrasa.com/wp-content/uploads/2021/01/chuleton-purabrasa-600x353.png',
    'https://www.purabrasa.com/wp-content/uploads/2024/04/Costillar-600x353.png',
    'https://www.purabrasa.com/wp-content/uploads/2024/04/burger-wagyu-600x353.png',
    'https://www.purabrasa.com/wp-content/uploads/2021/01/coctails-600x353.png'
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

const fetchUrl = (url) => {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    const req = client.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return fetchUrl(res.headers.location).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return resolve({ url, error: `Status ${res.statusCode}` });
      }
      let hash = crypto.createHash('md5');
      let size = 0;
      res.on('data', chunk => {
        hash.update(chunk);
        size += chunk.length;
      });
      res.on('end', () => resolve({ url, hash: hash.digest('hex'), size }));
    });
    req.on('error', err => resolve({ url, error: err.message }));
  });
};

async function check() {
  for (const [key, urls] of Object.entries(images)) {
    console.log(`Checking ${key}...`);
    const results = await Promise.all(urls.map(fetchUrl));
    for (const r of results) {
      if (r.error) console.log(`  ERROR: ${r.url} - ${r.error}`);
      else console.log(`  OK: hash=${r.hash.substr(0,8)} size=${r.size}`);
    }
    
    // Check duplicates
    const hashes = results.filter(r => !r.error).map(r => r.hash);
    const unique = new Set(hashes);
    if (unique.size < hashes.length) {
      console.log(`  >>> FOUND DUPLICATES for ${key}! Unique images: ${unique.size}/${hashes.length}`);
    }
  }
}

check();
