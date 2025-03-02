import { useRouter } from 'next/router';
import Carousel from '../../components/Carousel';

const generateChapters = (lesson, imageCount = 739) => {
  const chapters = {};
  lesson.images.forEach((image, imgIndex) => {
    chapters[image] = Array.from({ length: imageCount }, (_, i) => 
      `/chapters/chapter%20%28${i + 1}%29.jpg`
    );
  });
  return chapters;
};

const lessons = {
  "1": { 
    title: "Lesson 1", 
    images: ["/images/lesson1-1.jpg", "/images/lesson1-2.jpg", "/images/lesson1-3.jpg", "/images/lesson1-4.jpg"]
  },
  "2": { 
    title: "Lesson 2", 
    images: ["/images/lesson2-1.jpg", "/images/lesson2-2.jpg", "/images/lesson2-3.jpg", "/images/lesson2-4.jpg", "/images/lesson2-5.jpg"]
  },
  "3": { 
    title: "Lesson 3", 
    images: ["/images/lesson3-1.jpg", "/images/lesson3-2.jpg"]
  }
};

Object.keys(lessons).forEach(id => {
  lessons[id].chapters = generateChapters(lessons[id]);
});

export default function CoursePage() {
  const router = useRouter();
  const { id } = router.query;
  const lesson = lessons[id];

  if (!lesson) return <p>Lesson not found</p>;

  return (
    <div>
      <h1>{lesson.title}</h1>
      <Carousel images={lesson.images} chapters={lesson.chapters} />
    </div>
  );
}
