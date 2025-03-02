"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from '../styles/Roadmap.module.css';

const lessons = [
  { id: 1, title: "Lesson 1", images: ["/images/lesson1-1.jpg", "/images/lesson1-2.jpg", "/images/lesson1-3.jpg", "/images/lesson1-4.jpg"] },
  { id: 2, title: "Lesson 2", images: ["/images/lesson2-1.jpg", "/images/lesson2-2.jpg", "/images/lesson2-3.jpg", "/images/lesson2-4.jpg", "/images/lesson2-5.jpg"] },
  { id: 3, title: "Lesson 3", images: ["/images/lesson3-1.jpg", "/images/lesson3-2.jpg"] }
];

export default function Roadmap() {
  const [progress, setProgress] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const savedProgress = localStorage.getItem('roadmapProgress');
    if (savedProgress) {
      setProgress(JSON.parse(savedProgress));
    }
  }, []);

  const handleLessonClick = (lesson) => {
    toast.success(`Navigating to ${lesson.title} course page!`, { position: "top-right", autoClose: 2000 });
    const updatedProgress = [...progress, lesson.id];
    setProgress(updatedProgress);
    localStorage.setItem('roadmapProgress', JSON.stringify(updatedProgress));
    
    setTimeout(() => {
      router.push(`/course/${lesson.id}`);
    }, 2000);
  };

  return (
    <div className={styles.roadmap}>
      {lessons.map((lesson, index) => (
        <div 
          key={lesson.id} 
          className={`${styles.lessonCircle} ${progress.includes(lesson.id) ? styles.completed : ''}`}
          role="button"
          tabIndex="0"
          onClick={() => handleLessonClick(lesson)}
          onKeyPress={(e) => { if(e.key === 'Enter') handleLessonClick(lesson); }}
          aria-label={`Lesson ${lesson.id}: ${lesson.title}`}
          style={{
            width: "80px", 
            height: "80px",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: progress.includes(lesson.id) ? "#4CAF50" : "#ddd",
            color: progress.includes(lesson.id) ? "white" : "black",
            cursor: "pointer",
            transition: "transform 0.3s",
            boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
            margin: "10px", 
            flexShrink: 0 
          }}
        >
          {lesson.title}
        </div>
      ))}
      <ToastContainer position="top-right" autoClose={2000} />
    </div>
  );
}
