# Project TODOs & Future Enhancements

## Features to Implement

### 1. Related Products API
**Priority:** Medium  
**Location:** `client/src/pages/ProductDetailPage.tsx:616`  
**Description:** Implement a recommendation engine to show related products on product detail pages  
**Requirements:**
- Create `/api/products/:id/related` endpoint
- Use category, series, or specifications for matching
- Show 3-6 related products
- Consider price range similarity

**Effort Estimate:** 3-4 hours

---

### 2. Quick View Modal
**Priority:** Low  
**Location:** `client/src/components/products/ProductCard.tsx:63`  
**Description:** Add a quick view modal to preview product details without full navigation  
**Requirements:**
- Modal with product image, specs, and pricing
- "View Full Details" button to navigate to product page
- "Request Quote" quick action
- Responsive design

**Effort Estimate:** 2-3 hours

---

## Technical Debt & Improvements

### Completed ✅
- ~~React Hooks violations (GSAP animations)~~
- ~~Stock status type mismatch~~
- ~~Navigation using window.location.href~~
- ~~Memory leak from URL.createObjectURL~~
- ~~Error handling inconsistencies~~
- ~~TypeScript 'any' types~~
- ~~useToast race condition~~
- ~~Browser back/forward button support~~
- ~~Console.log statements~~
- ~~Pagination reset on filter change~~
- ~~URL params custom hook~~
- ~~Section-level error boundaries~~

### Future Considerations
- Implement actual database persistence (currently using MemStorage)
- Add product search indexing for better performance
- Implement cart functionality
- Add user authentication and saved favorites
- Real-time inventory tracking
- Admin panel for product management

---

## Documentation
- API endpoints documented in README.md
- Component library usage guidelines
- Deployment instructions

---

**Last Updated:** 2025-10-02  
**Maintained by:** Development Team

