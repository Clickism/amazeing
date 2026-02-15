import { Layout } from "../../shared/components/Layout/Layout.tsx";
import { TaskCard } from "./TaskCard/TaskCard.tsx";
import styles from "./HomePage.module.css";

import day1Image from "../../assets/tasks/cards/day1.png";
import day2Image from "../../assets/tasks/cards/day2.png";
import day3Image from "../../assets/tasks/cards/day3.png";

const days = [1, 2, 3];
const dayImages = [day1Image, day2Image, day3Image];

export function HomePage() {
  return (
    <Layout>
      <h1>Tasks</h1>
      <div className={styles.taskContainer}>
        {days.map((day, i) => (
          <TaskCard
            title={{ key: `home.tasks.day${day}.title` }}
            description={{ key: `home.tasks.day${day}.description` }}
            backgroundImageUrl={dayImages[i]}
          />
        ))}
      </div>
    </Layout>
  );
}
