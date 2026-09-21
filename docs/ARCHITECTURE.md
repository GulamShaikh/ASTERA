# ASTERA Technical Architecture

## Principle
Start simple. Add infrastructure only when a real requirement appears.

## Recommended initial stack
If starting from scratch:
- React
- TypeScript
- Vite
- Tailwind CSS
- modern component architecture
- Git/GitHub

Alternative frameworks can be considered if there is a specific SEO/deployment requirement.

## Suggested structure
```text
src/
  assets/
  components/
    common/
    layout/
    product/
    brand/
  data/
  pages/
  hooks/
  lib/
  styles/
  App.tsx
  main.tsx

public/
docs/

CLAUDE.md
DESIGN.md
```

## Data model direction
Products should be represented as data, not duplicated JSX.

Example:
```ts
type Product = {
  id: string;
  name: string;
  brand: string;
  category: string;
  price?: number;
  image: string;
  description?: string;
  featured?: boolean;
};
```

Brands should also be data-driven:
```ts
type Brand = {
  id: string;
  name: string;
  description: string;
  logo?: string;
  local?: boolean;
  featured?: boolean;
};
```

## Pages
Initial:
- `/`
- `/shop`
- `/brands`
- `/categories`
- `/about`
- `/contact`

Future:
- `/product/:slug`
- `/brand/:slug`
- `/category/:slug`

## SEO
Use:
- semantic headings
- unique page titles
- meta descriptions
- Open Graph metadata
- descriptive URLs
- structured data when appropriate
- optimized images

## Performance
Prioritize:
- small bundles
- lazy loading where useful
- optimized images
- minimal third-party scripts
- no unnecessary animation libraries

## State
Prefer local/component state for simple UI.
Introduce global state only when multiple independent areas genuinely need shared state.

## Backend
Do not add a backend in the first phase unless the project requires:
- authentication
- inventory management
- online checkout
- persistent product administration
- orders

For a first marketing/catalogue site, static/data-driven content is preferable.

## Deployment
Choose the deployment platform after the frontend architecture is stable.
Document deployment steps in `docs/DEPLOYMENT.md`.

## Security
Never commit:
- API keys
- OAuth tokens
- service account credentials
- `.env` secrets

Use environment variables and `.gitignore`.
