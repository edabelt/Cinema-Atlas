# Cinema Atlas

**Interactive visual cinema analytics built with React, TypeScript, D3 and ECharts.**

Cinema Atlas transforms live movie metadata into an exploratory path from global patterns to individual films:

> **World → Country → Genre → Theme → Film**

The project combines a public visual-analytics experience with a broader movie discovery application. It was developed as a portfolio project demonstrating how computational methods, interactive visualisation and close inspection of source evidence can work together in digital humanities research.

## Research concept

Cinema Atlas asks how film metadata can be modelled and visualised without separating quantitative patterns from the cultural objects behind them.

The interface supports movement between different analytical scales:

1. Select a film-producing country from an interactive world map.
2. Examine how prominent genres change across release years.
3. Compare genre profiles between two countries.
4. Follow a genre into a network of associated thematic indicators.
5. Inspect the films supporting each visible pattern.

This structure treats visualisation as an investigative interface rather than a decorative summary. Aggregate patterns remain connected to the individual films and metadata from which they were produced.

### Transferable visual research model

The Genre Dealer tests a visual approach to temporal and multi-category cultural data. Films emerge individually from a release timeline, travel into their primary genre communities and retain visible relationships with secondary genres. Viewers can pause the sequence to inspect a particular film and the classifications surrounding it, while the accumulated display reveals patterns of continuity, overlap and change.

This design keeps temporal overview, categorical relationships and record-level evidence within the same exploratory interface.

## Cinema Atlas features

- Interactive D3 world map with animated country selection and close-up views.
- Coverage across selected countries from multiple continents.
- Temporal genre analysis using films released from 2018 to 2025.
- Comparative country view for exploring differences in genre prevalence.
- Interactive ECharts genre-trend visualisations.
- **Genre Dealer**, a continuous film-by-film timeline in which films emerge from their release year, move into genre communities and retain visible relationships with secondary genres. Its interaction model is transferable to examining how narrative structures change across model versions, training stages or experimental periods.
- Force-directed theme constellations based on TMDB keyword relationships.
- Theme-to-film evidence panels linking visual patterns back to their source records.
- Persistent analytical state when moving from the Atlas to a film page and back.
- Reset and navigation controls for returning to earlier stages of the research path.
- Responsive and keyboard-accessible interface elements.

## Wider application features

Cinema Atlas also includes the movie-discovery functionality from which the visual analytics project developed:

- Browse and filter movies.
- Explore upcoming releases.
- Browse popular actors.
- View movie and actor details.
- Create an account and authenticate with Supabase.
- Save favourite movies and actors.
- Create personalised movie playlists.
- Add and view reviews.

The Atlas itself is public and does not require registration.

## Technology

| Area | Technology |
| --- | --- |
| Application | React, TypeScript, Vite |
| Interface | Material UI |
| Data fetching and caching | React Query |
| Geographic and network visualisation | D3.js |
| Analytical charts | Apache ECharts |
| Geographic data | World Atlas, TopoJSON, GeoJSON |
| Movie metadata | TMDB API |
| Authentication and user data | Supabase |
| Routing | React Router |

## Data and modelling

Cinema Atlas retrieves movie, genre and keyword metadata from the TMDB API. The application then derives several analytical representations:

- **Genre prevalence**: the percentage of sampled films in a release year associated with each genre.
- **Country comparison**: average yearly genre prevalence across two selected national datasets.
- **Thematic indicators**: frequently occurring TMDB keywords associated with prominent films in a selected genre.
- **Theme relationships**: connections between thematic indicators that co-occur across films.
- **Evidence records**: the individual films contributing to a selected theme or visual pattern.

All transformations are performed programmatically in the application and remain traceable to the films included in the current dataset.

## Interpretive limitations

Cinema Atlas is an exploratory prototype, not a definitive model of national cinema or cultural identity.

- TMDB metadata is collaboratively produced and may be incomplete or uneven across countries and languages.
- The sampled films are shaped by API availability, popularity rankings and the selected release period.
- Production-country metadata does not by itself establish a film's cultural identity.
- Genres and keywords are descriptive indicators rather than complete interpretations of narrative structure.
- Differences visible in the charts should generate research questions, not be treated as causal cultural conclusions.

These limitations are deliberately made explicit because transparency about data selection and modelling is part of responsible visualisation practice.

## Getting started

### Requirements

- Node.js 18 or later
- npm
- A TMDB API key
- A Supabase project for authentication and saved user data

### Installation

```bash
git clone <repository-url>
cd <repository-directory>
npm install
```

Create a `.env` file in the project root:

```env
VITE_TMDB_KEY=your_tmdb_api_key
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
```

Do not commit the `.env` file or expose private credentials in the repository.

Start the development server:

```bash
npm run dev
```

Create a production build:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

## Main routes

| Route | Access | Purpose |
| --- | --- | --- |
| `/` | Public | Project landing page |
| `/cinema-atlas` | Public | Visual analytics research interface |
| `/movies` | Public | Movie discovery |
| `/movies/upcoming` | Public | Upcoming releases |
| `/movies/:id` | Public | Individual movie evidence and details |
| `/actors` | Public | Popular actors |
| `/actors/:id` | Public | Actor details |
| `/dashboard` | Registered users | Personal dashboard |
| `/movies/favourites` | Registered users | Saved movies |
| `/actors/favourites` | Registered users | Saved actors |
| `/movies/playlists` | Registered users | Personal movie collections |

## Accessibility

The visual interfaces include semantic labels, keyboard-selectable controls and descriptive chart metadata where supported. Colour is combined with text, position and selection states so that it is not the only carrier of meaning.

Interactive data visualisation presents additional accessibility challenges. Further development could include downloadable tabular equivalents, expanded screen-reader summaries and user-controlled motion settings.

## Project status

Cinema Atlas is a working portfolio and research prototype. Future development may include:

- larger and user-configurable datasets;
- language and region filters;
- richer narrative and textual analysis;
- downloadable datasets and visual outputs;
- reproducible dataset snapshots;
- additional accessibility modes;
- deeper comparison of culturally specific narrative structures.

## Data attribution

This product uses the [TMDB API](https://www.themoviedb.org/documentation/api) but is not endorsed or certified by TMDB.

Geographic boundaries are rendered using data from the [World Atlas](https://github.com/topojson/world-atlas) package.

## Author

Built by [edabelt](https://github.com/edabelt).
