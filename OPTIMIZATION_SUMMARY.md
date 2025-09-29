# ConnectedCardsCustomAnchors Component Optimizations

## Performance Optimizations Made:

### 1. **React.memo Implementation**

- Wrapped both `ConnectedCardsCustomAnchors` and `PowerCard` components with `React.memo`
- Prevents unnecessary re-renders when props haven't changed
- Improves performance especially when parent components re-render

### 2. **Viewport-Based Animation Triggering**

- Added Intersection Observer to `useConnectedAnchors` hook
- SVG path animations now only start when the component enters the viewport (30% visible)
- Added 50px root margin for smoother animation timing
- Prevents animations from running immediately on page load

### 3. **Memoization Improvements**

- Used `useMemo` for positions calculation to prevent unnecessary recalculations
- Used `useCallback` for the recompute function to optimize dependency arrays
- Better key props using power names instead of just indices

### 4. **GSAP Animation Optimizations**

- Added `once: true` to ScrollTrigger for one-time animations
- Implemented `force3D: true` for hardware acceleration
- Added `will-change` CSS properties during animations and cleaned them up after
- Added `transform-gpu` CSS class for better GPU utilization

### 5. **Image Loading Optimizations**

- Improved `sizes` attribute for responsive images
- Added `loading="lazy"` for better performance
- Set `priority={false}` since these images are not above the fold

### 6. **Animation Timing Improvements**

- Increased initial delay to 200ms after viewport entry
- Better staggered delays (300ms for desktop, full duration for mobile)
- Smoother animation sequencing

### 7. **Memory Management**

- Proper cleanup of timeouts and observers
- Better ref management and cleanup
- Cleaner dependency arrays to prevent memory leaks

## Key Benefits:

1. **Reduced Initial Load Time**: Animations don't start until needed
2. **Better Performance**: Hardware acceleration and memoization
3. **Smoother Animations**: Viewport-based triggering prevents janky startup animations
4. **Memory Efficiency**: Proper cleanup and optimized re-renders
5. **Better UX**: Animations feel more responsive and intentional

## Browser Compatibility:

- Intersection Observer is supported in all modern browsers
- Fallback behavior: animations will still work if observer fails
- Hardware acceleration works across all major browsers
