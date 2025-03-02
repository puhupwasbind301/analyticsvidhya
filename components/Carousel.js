import { useState, useEffect, useRef,  lazy, Suspense } from "react";
import Image from "next/image";
import { FixedSizeGrid as Grid } from "react-window";
import styles from "../styles/Carousel.module.css";
import {
  nextSlide,
  prevSlide,
  handleTouchStart,
  handleTouchEnd,
  handleKeyboardNavigation,
  openFullscreen,
  closeFullscreen,
  handleZoom,
  handleDrag
} from "../utils/carouselUtils";

const LazyImage = lazy(() => import("./LazyImage").then(module => ({ default: module.default })));

export default function Carousel({ images, chapters }) {
  const [index, setIndex] = useState(0);
  const [selectedChapters, setSelectedChapters] = useState(chapters[images[0]]);
  const [containerWidth, setContainerWidth] = useState(600);
  const [fullscreenImage, setFullscreenImage] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [columns, setColumns] = useState(2);
  const [focusedIndex, setFocusedIndex] = useState(0);
  const gridRef = useRef(null);

  
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  useEffect(() => {
    const updateWidth = () => {
      setContainerWidth(window.innerWidth);
      setColumns(window.innerWidth < 768 ? 1 : 2); 
    };

    window.addEventListener("resize", updateWidth);
    updateWidth();

    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event) => {
      handleKeyboardNavigation(event, focusedIndex, setFocusedIndex, selectedChapters.length, columns);
      
      if (event.key === "Enter") {
        openFullscreen(selectedChapters[focusedIndex], setFullscreenImage, setZoomLevel, setPosition);
      }

      if (event.key === "Escape") {
        closeFullscreen(setFullscreenImage);
      }
      
      if (gridRef.current) {
        const row = Math.floor(focusedIndex / columns);
        gridRef.current.scrollToItem({ rowIndex: row+1, align: "top", behavior: "smooth", block: "nearest" });
      }
    };
    
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [focusedIndex, selectedChapters, columns]);

  const columnWidth = containerWidth / columns;
  const rowHeight = columnWidth * 0.75;

  return (
    <div className={styles.carouselWrapper}>
      <div
        className={styles.carouselContainer}
        onTouchStart={(e) => handleTouchStart(e, touchStartX)}
        onTouchEnd={(e) => handleTouchEnd(e, touchStartX, touchEndX, () => nextSlide(index, setIndex, images, setSelectedChapters, chapters), () => prevSlide(index, setIndex, images, setSelectedChapters, chapters))}
      >
        <button className={styles.prev} onClick={() => prevSlide(index, setIndex, images, setSelectedChapters, chapters)}>❮</button>
         <Suspense fallback={<div>Loading...</div>}>
          <LazyImage 
          src={images[index]}
          className={styles.carouselImage}
          alt="Lesson Slide"
          width={containerWidth}
          height={rowHeight}
          priority
          />
        </Suspense>
        <button className={styles.next} onClick={() => nextSlide(index, setIndex, images, setSelectedChapters, chapters)}>❯</button>
      </div>
      <h3>Chapter Images</h3>
      <div className={styles.gridContainer}>
        <Grid
          ref={gridRef}
          columnCount={columns}
          columnWidth={columnWidth}
          height={400}
          rowCount={Math.ceil(selectedChapters.length / columns)}
          rowHeight={rowHeight}
          width={containerWidth}
        >
          {({ columnIndex, rowIndex, style }) => {
            const imageIndex = rowIndex * columns + columnIndex;
            if (imageIndex >= selectedChapters.length) return null;
            return (
              <div
                style={{
                  ...style,
                }}
                className={styles.imageContainer}
                tabIndex={0}
                onFocus={() => setFocusedIndex(imageIndex)}
                onKeyDown={(event) => handleKeyboardNavigation(event, focusedIndex, setFocusedIndex, selectedChapters.length, columns)}
                onClick={() => openFullscreen(selectedChapters[imageIndex], setFullscreenImage, setZoomLevel, setPosition)}
              >
                <Suspense fallback={<div>Loading...</div>}>
                  <LazyImage 
                  src={selectedChapters[imageIndex]}
                  className={styles.gridImage}
                  style={{border: imageIndex === focusedIndex ? "2px solid blue" : "none",zIndex: imageIndex === focusedIndex ? 1 : 0}}
                  alt={`Chapter ${imageIndex + 1}`}
                  width={columnWidth}
                  height={rowHeight}
                  loading="lazy" 
                  />
                </Suspense>
              </div>
            );
          }}
        </Grid>
      </div>
      {fullscreenImage && (
        <div
          className={styles.fullscreenOverlay}
          onClick={() => closeFullscreen(setFullscreenImage)}
          onWheel={(e) => handleZoom(e, setZoomLevel)}
        >
          <div
            className={styles.fullscreenImageContainer}
            style={{
              transform: `translate(${position.x}px, ${position.y}px) scale(${zoomLevel})`,
            }}
            onPointerDown={(e) => {
              try {
                e.target.setPointerCapture(e.pointerId);
              } catch (error) {
                console.warn("setPointerCapture failed:", error);
              }
            }}
            onMouseMove={(e) => handleDrag(e, zoomLevel, setPosition)}
          >
            <Image
              src={fullscreenImage}
              className={styles.fullscreenImage}
              alt="Full Screen"
              width={window.innerWidth}
              height={window.innerHeight}
            />
          </div>
        </div>
      )}
    </div>
  );
}
