/**
 * Central image registry.
 *
 * Every photograph on the site is referenced from here, keyed by the slug of
 * the entity it belongs to. Swapping the placeholder editorial imagery for
 * real restaurant assets is a single-file change: point the values at the
 * platform CDN and update `images.remotePatterns` in `next.config.ts`.
 *
 * All URLs below were verified to resolve at time of writing.
 */

const UNSPLASH_HOST = "https://images.unsplash.com";

/**
 * Caps the size fetched by the image optimizer. Without a width the origin
 * returns multi-megabyte originals, which slows cold optimization noticeably.
 */
function photo(id: string, width: number): string {
  return `${UNSPLASH_HOST}/${id}?auto=format&fit=crop&w=${width}&q=80`;
}

const W = {
  hero: 1600,
  promo: 1800,
  cover: 1400,
  gallery: 1200,
  dish: 800,
  cuisine: 800,
} as const;

/**
 * Shared blur-up placeholder. A 12×9 warm gradient encoded inline — cheaper
 * than per-image base64 payloads and visually correct for food photography,
 * which is overwhelmingly warm-toned.
 */
export const BLUR_WARM =
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMiIgaGVpZ2h0PSI5Ij48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImciIHgxPSIwIiB5MT0iMCIgeDI9IjEiIHkyPSIxIj48c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiNlZmUyZDYiLz48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiNkOGMzYjAiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cmVjdCB3aWR0aD0iMTIiIGhlaWdodD0iOSIgZmlsbD0idXJsKCNnKSIvPjwvc3ZnPg==";

/** Darker variant for the promotional slides and the ink CTA panel. */
export const BLUR_DARK =
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMiIgaGVpZ2h0PSI5Ij48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImciIHgxPSIwIiB5MT0iMCIgeDI9IjEiIHkyPSIxIj48c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiMyYjIwMWEiLz48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiM0YTM1MmEiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cmVjdCB3aWR0aD0iMTIiIGhlaWdodD0iOSIgZmlsbD0idXJsKCNnKSIvPjwvc3ZnPg==";

/* -------------------------------------------------------------------------- */
/* Hero                                                                        */
/* -------------------------------------------------------------------------- */

export const heroImages = {
  /** LCP candidate — loaded eagerly with high fetch priority. */
  primary: photo("photo-1517248135467-4c7edcad34c4", W.hero),
  dishInset: photo("photo-1631452180519-c014fe946bc7", 600),
  cafeInset: photo("photo-1554118811-1e0d58224f24", 600),
} as const;

/* -------------------------------------------------------------------------- */
/* Promotional carousel                                                        */
/* -------------------------------------------------------------------------- */

export const promoImages = {
  "weekend-offers": photo("photo-1517244683847-7456b63c5969", W.promo),
  "top-rated": photo("photo-1579027989536-b7b1f875659b", W.promo),
  "new-restaurants": photo("photo-1551632436-cbf8dd35adfa", W.promo),
  "book-table": photo("photo-1559847844-5315695dadae", W.promo),
} as const;

/* -------------------------------------------------------------------------- */
/* Restaurants — cover + gallery, keyed by restaurant slug                     */
/* -------------------------------------------------------------------------- */

export const restaurantImages: Record<string, { cover: string; gallery: string[] }> = {
  "copper-tandoor": {
    cover: photo("photo-1600891964599-f61ba0e24092", W.cover),
    gallery: [
      photo("photo-1631452180519-c014fe946bc7", W.gallery),
      photo("photo-1592861956120-e524fc739696", W.gallery),
      photo("photo-1589302168068-964664d93dc0", W.gallery),
    ],
  },
  "nawabs-table": {
    cover: photo("photo-1563379091339-03b21ab4a4f8", W.cover),
    gallery: [
      photo("photo-1599487488170-d11ec9c172f0", W.gallery),
      photo("photo-1552566626-52f8b828add9", W.gallery),
      photo("photo-1604382354936-07c5d9983bd3", W.gallery),
    ],
  },
  "saffron-junction": {
    cover: photo("photo-1601050690597-df0568f70950", W.cover),
    gallery: [
      photo("photo-1589301760014-d929f3979dbc", W.gallery),
      photo("photo-1631515243349-e0cb75fb8d3a", W.gallery),
      photo("photo-1528605248644-14dd04022da1", W.gallery),
    ],
  },
  "dilli-chaat-company": {
    cover: photo("photo-1626132647523-66f5bf380027", W.cover),
    gallery: [
      photo("photo-1585032226651-759b368d7246", W.gallery),
      photo("photo-1596040033229-a9821ebd058d", W.gallery),
      photo("photo-1496412705862-e0088f16f791", W.gallery),
    ],
  },
  "madras-filter-room": {
    cover: photo("photo-1630409351241-e90e7f5e434d", W.cover),
    gallery: [
      photo("photo-1606755962773-d324e0a13086", W.gallery),
      photo("photo-1610192244261-3f33de3f55e4", W.gallery),
      photo("photo-1589647363585-f4a7d3877b10", W.gallery),
    ],
  },
  "bamboo-wok": {
    cover: photo("photo-1585238342024-78d387f4a707", W.cover),
    gallery: [
      photo("photo-1552611052-33e04de081de", W.gallery),
      photo("photo-1563245372-f21724e3856d", W.gallery),
      photo("photo-1626804475297-41608ea09aeb", W.gallery),
    ],
  },
  "trattoria-nove": {
    cover: photo("photo-1574071318508-1cdbab80d002", W.cover),
    gallery: [
      photo("photo-1565299624946-b28f40a0ae38", W.gallery),
      photo("photo-1551183053-bf91a1d81141", W.gallery),
      photo("photo-1481833761820-0509d3217039", W.gallery),
    ],
  },
  "the-roasted-bean": {
    cover: photo("photo-1517686469429-8bdb88b9f907", W.cover),
    gallery: [
      photo("photo-1495474472287-4d71bcdd2085", W.gallery),
      photo("photo-1470337458703-46ad1756a187", W.gallery),
      photo("photo-1600093463592-8e36ae95ef56", W.gallery),
    ],
  },
  "green-leaf-bhojanalya": {
    cover: photo("photo-1633945274405-b6c8069047b0", W.cover),
    gallery: [
      photo("photo-1596797038530-2c107229654b", W.gallery),
      photo("photo-1567188040759-fb8a883dc6d8", W.gallery),
      photo("photo-1550966871-3ed3cdb5ed0c", W.gallery),
    ],
  },
  "char-and-ember": {
    cover: photo("photo-1533777419517-3e4017e2e15a", W.cover),
    gallery: [
      photo("photo-1628294895950-9805252327bc", W.gallery),
      photo("photo-1588166524941-3bf61a9c41db", W.gallery),
      photo("photo-1559925393-8be0ec4767c8", W.gallery),
    ],
  },
  "sugar-and-saffron": {
    cover: photo("photo-1563805042-7684c019e1cb", W.cover),
    gallery: [
      photo("photo-1548943487-a2e4e43b4853", W.gallery),
      photo("photo-1571877227200-a0d98ea607e9", W.gallery),
      photo("photo-1517701550927-30cf4ba1dba5", W.gallery),
    ],
  },
  "urban-tiffin": {
    cover: photo("photo-1505253758473-96b7015fcd40", W.cover),
    gallery: [
      photo("photo-1534939561126-855b8675edd7", W.gallery),
      photo("photo-1568901346375-23c9450c58cd", W.gallery),
      photo("photo-1498837167922-ddd27525d352", W.gallery),
    ],
  },
};

/* -------------------------------------------------------------------------- */
/* Dishes — keyed by dish id                                                   */
/* -------------------------------------------------------------------------- */

export const dishImages: Record<string, string> = {
  "dish-butter-chicken": photo("photo-1610057099443-fde8c4d50f91", W.dish),
  "dish-dal-makhani": photo("photo-1589302168068-964664d93dc0", W.dish),
  "dish-galouti-kebab": photo("photo-1599487488170-d11ec9c172f0", W.dish),
  "dish-dum-biryani": photo("photo-1589301760014-d929f3979dbc", W.dish),
  "dish-masala-dosa": photo("photo-1668236543090-82eba5ee5976", W.dish),
  "dish-paneer-tikka": photo("photo-1628294895950-9805252327bc", W.dish),
  "dish-aloo-tikki-chaat": photo("photo-1585032226651-759b368d7246", W.dish),
  "dish-chilli-garlic-noodles": photo("photo-1552611052-33e04de081de", W.dish),
  "dish-truffle-pizza": photo("photo-1593560708920-61dd98c46a4e", W.dish),
  "dish-chole-bhature": photo("photo-1633945274405-b6c8069047b0", W.dish),
  "dish-tiramisu-jar": photo("photo-1551024506-0bccd828d307", W.dish),
  "dish-chicken-momos": photo("photo-1534939561126-855b8675edd7", W.dish),
};

/* -------------------------------------------------------------------------- */
/* Cuisines — keyed by cuisine slug                                            */
/* -------------------------------------------------------------------------- */

export const cuisineImages: Record<string, string> = {
  "north-indian": photo("photo-1585937421612-70a008356fbe", W.cuisine),
  mughlai: photo("photo-1604382354936-07c5d9983bd3", W.cuisine),
  chinese: photo("photo-1541696432-82c6da8ce7bf", W.cuisine),
  "south-indian": photo("photo-1567337710282-00832b415979", W.cuisine),
  italian: photo("photo-1513104890138-7c749659a591", W.cuisine),
  cafe: photo("photo-1521017432531-fbd92d768814", W.cuisine),
  "street-food": photo("photo-1601050690117-94f5f6fa8bd7", W.cuisine),
  desserts: photo("photo-1571877227200-a0d98ea607e9", W.cuisine),
};

/* -------------------------------------------------------------------------- */
/* Editorial                                                                   */
/* -------------------------------------------------------------------------- */

export const editorialImages = {
  /** Backdrop for the "why restaurants join" section. */
  partnerKitchen: photo("photo-1414235077428-338989a2e8c0", W.gallery),
  /** Backdrop for the closing conversion panel. */
  finalCta: photo("photo-1493770348161-369560ae357d", W.promo),
} as const;
