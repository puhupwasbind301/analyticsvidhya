
export const nextSlide = (index, setIndex, images, setSelectedChapters, chapters) => {
    const newIndex = (index + 1) % images.length;
    setIndex(newIndex);
    setSelectedChapters(chapters[images[newIndex]]);
  };
  
  export const prevSlide = (index, setIndex, images, setSelectedChapters, chapters) => {
    const newIndex = (index - 1 + images.length) % images.length;
    setIndex(newIndex);
    setSelectedChapters(chapters[images[newIndex]]);
  };
  
  export const handleTouchStart = (e, touchStartX) => {
    touchStartX.current = e.touches[0].clientX;
  };
  
  export const handleTouchEnd = (e, touchStartX, touchEndX, nextSlide, prevSlide) => {
    touchEndX.current = e.changedTouches[0].clientX;
    const swipeDistance = touchStartX.current - touchEndX.current;
  
    if (swipeDistance > 50) nextSlide(); 
    else if (swipeDistance < -50) prevSlide(); 
  };
  
  export const openFullscreen = (imgSrc, setFullscreenImage, setZoomLevel, setPosition) => {
    setFullscreenImage(imgSrc);
    setZoomLevel(1);
    setPosition({ x: 0, y: 0 });
  };
  
  export const closeFullscreen = (setFullscreenImage) => {
    setFullscreenImage(null);
  };
  
  export const handleZoom = (event, setZoomLevel) => {
    event.preventDefault();
    const zoomFactor = event.deltaY > 0 ? 0.9 : 1.1;
    setZoomLevel((prevZoom) => Math.min(Math.max(prevZoom * zoomFactor, 1), 3));
  };
  
  export const handleDrag = (event, zoomLevel, setPosition) => {
    if (zoomLevel > 1) {
      setPosition((prev) => ({
        x: prev.x + event.movementX,
        y: prev.y + event.movementY,
      }));
    }
  };
  



export const handleKeyboardNavigation = (event, focusedIndex, setFocusedIndex, totalImages, columns) => {
    const rowCount = Math.ceil(totalImages / columns);
    const columnIndex = focusedIndex % columns;
    const rowIndex = Math.floor(focusedIndex / columns);
  
    if (event.key === "ArrowRight" && columnIndex < columns - 1 && focusedIndex + 1 < totalImages) {
      setFocusedIndex(focusedIndex + 1);
    } else if (event.key === "ArrowLeft" && columnIndex > 0) {
      setFocusedIndex(focusedIndex - 1);
    } else if (event.key === "ArrowDown" && rowIndex < rowCount - 1 && focusedIndex + columns < totalImages) {
      setFocusedIndex(focusedIndex + columns);
    } else if (event.key === "ArrowUp" && rowIndex > 0) {
      setFocusedIndex(focusedIndex - columns);
    }
};
  
  