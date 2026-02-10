# Implementation Plan - Replace Emojis with Premium Icons

The objective is to identify all instances where emojis are used as icons in the application UI and replace them with premium icons (Lucide-React) to maintain a professional and premium aesthetic.

## 1. Research and Identification
- [ ] Scan all files in `src/app` and `src/components` for emojis.
- [ ] Specifically check `src/components/billing/ChargeEntry.tsx` and `src/components/calendar/DragOverlay.tsx`.
- [ ] Document all found emojis and their context.

## 2. Icon Selection
- [ ] Select appropriate Lucide-React icons for each emoji:
    - `🍳` (Breakfast) -> `Coffee` or `Utensils`
    - `🚗` (Parking) -> `Car`
    - `🍾` (Mini-bar) -> `Wine` or `GlassWater`
    - `🍽️` (Room Service) -> `UtensilsCrossed`
    - `⏰` (Late Checkout) -> `Clock`
    - `💆` (Spa Service) -> `Flower2` or `Sparkles`
    - `⚠️` (Warning) -> `AlertTriangle`

## 3. Implementation
- [ ] Update `src/components/billing/ChargeEntry.tsx` to use `Lucide` icons instead of emoji strings in the `quickItems` array.
- [ ] Update `src/components/calendar/DragOverlay.tsx` to use `AlertTriangle` instead of `⚠️`.
- [ ] Check for other files identified during research and update them accordingly.

## 4. Verification
- [ ] Review the UI to ensure the new icons fit the design.
- [ ] Ensure all imports are correct and there are no lint errors.
