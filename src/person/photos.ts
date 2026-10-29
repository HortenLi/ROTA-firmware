/**
 * Photographs shown on the personal page.
 *
 * Nine frames picked out of the whole pool for colour contrast, story and
 * movement — every one of them from a folder labelled with a film stock, so
 * the page's "made on film" line stays true. Exported at their original
 * aspect ratio with no grade applied: the brief asks the work to keep its own
 * colour, so nothing here goes through the duotone used on the brand home.
 *
 * `span` is the width in columns on the 3-column desktop grid (1–3); the
 * sequence is laid out so each row's heights stay close to each other.
 * Alt text lives in the locale files (`person.film.a1` … `a9`).
 */
export type Photo = {
  file: string
  w: number
  h: number
  film: string
  altKey: string
  span: 1 | 2 | 3
}

export const PHOTOS: Photo[] = [
  {
    file: 'photo-01.webp',
    w: 1500,
    h: 844,
    film: 'Provia 100F',
    altKey: 'person.film.a1',
    span: 2,
  },
  {
    file: 'photo-04.webp',
    w: 1000,
    h: 1500,
    film: 'Delta 100',
    altKey: 'person.film.a2',
    span: 1,
  },
  {
    file: 'photo-07.webp',
    w: 1012,
    h: 1500,
    film: 'Berlin 400',
    altKey: 'person.film.a3',
    span: 1,
  },
  {
    file: 'photo-03.webp',
    w: 1500,
    h: 1000,
    film: 'Venus 800',
    altKey: 'person.film.a4',
    span: 2,
  },
  {
    file: 'photo-05.webp',
    w: 1500,
    h: 1000,
    film: 'Delta 100',
    altKey: 'person.film.a5',
    span: 2,
  },
  {
    file: 'photo-06.webp',
    w: 977,
    h: 1500,
    film: 'FomaPan 400',
    altKey: 'person.film.a6',
    span: 1,
  },
  {
    file: 'photo-02.webp',
    w: 1500,
    h: 1059,
    film: 'Kodak 5219',
    altKey: 'person.film.a7',
    span: 2,
  },
  {
    file: 'photo-08.webp',
    w: 1500,
    h: 1008,
    film: 'Cinestill 800T',
    altKey: 'person.film.a8',
    span: 1,
  },
  {
    file: 'photo-09.webp',
    w: 1500,
    h: 1001,
    film: 'Phoenix 200',
    altKey: 'person.film.a9',
    span: 3,
  },
]
