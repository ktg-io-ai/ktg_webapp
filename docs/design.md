# KTG WebApp Design Standards

## Scroll Behavior - De Facto Standard

**Body Scroll Configuration:**
```css
body {
    margin: 0;
    padding: 0;
    overflow-x: hidden;
    overflow-y: auto;
}
```

**Key Benefits:**
- Prevents horizontal scrolling while allowing vertical scroll
- Clean, natural scrolling experience
- Works seamlessly with fixed top/second bars
- Maintains proper content flow
- Compatible with all themes (KTG, Light, Dark)

**Implementation Notes:**
- Use `overflow-x: hidden` to prevent horizontal scroll issues
- Use `overflow-y: auto` for natural vertical scrolling
- Avoid `overflow: hidden` which blocks all scrolling
- Ensure main content has proper `margin-top: 100px` to account for fixed bars

**Reference Implementation:** `docs/minimalist_makeavatar.html`

## Minimalist Container Style - De Facto Standard

**Floating Container Layout:**
```css
.main-content {
    flex-grow: 1;
    padding: 0;
    height: calc(100vh - 100px);
    overflow: hidden;
    margin-top: 100px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.container-element {
    width: 400px;
    margin: 0 auto;
    /* Floating above background with illumination effect */
}
```

**Key Features:**
- Fixed top bar (50px) + second bar (50px) = 100px total
- Main content uses `calc(100vh - 100px)` for perfect fit
- Content container floats centered with `display: flex; align-items: center; justify-content: center`
- Background video/image provides illumination effect
- Container appears to float above the background
- Clean, minimal aesthetic with focused content area

**Reference Implementation:** `modules/destiny/login.html`