import { useTasks } from "../../../../precourse/context/TasksContext.tsx";
import { useTranslatable } from "../../../../i18n/i18n.ts";
import { useState } from "react";
import { translateDayId } from "../../../../precourse/day.ts";
import { List } from "../../../../components/List/List.tsx";

export function TaskSelector() {
  const { t } = useTranslatable();
  const { task: currentTask, days } = useTasks();

  const [testTask, setTestTask] = useState<string | null>(null);

  const selectTask = (taskId: string) => {};

  return (
    // <div>
    //   {days.map((day) => {
    //     const isOpen = openDays.has(day.id);
    //     return (
    //       <div key={day.id} className={styles.dayContainer}>
    //         <div className={styles.day} onClick={() => toggleDay(day.id)}>
    //           {isOpen ? <IoIosArrowDown /> : <IoIosArrowForward />}{" "}
    //           {translateDayId(t, day.id)}
    //         </div>
    //         {isOpen && (
    //           <List
    //             elements={day.tasks.map((task) => ({
    //               id: task.id,
    //               name: t("day.task", { num: task.taskNumber }),
    //             }))}
    //             activeElementId={
    //               day.id === currentTask.dayId ? currentTask.id : null
    //             }
    //             onSelectElement={selectTask}
    //           />
    //         )}
    //       </div>
    //     );
    //   })}
    // </div>
    <List
      elements={days.map((day) => ({
        id: day.id,
        name: translateDayId(t, day.id),
        elements: day.tasks.map((task) => ({
          id: task.id,
          name: t("day.task", { num: task.taskNumber }),
        })),
      }))}
      activeElementId={testTask}
      onSelectElement={(task) => setTestTask(task)}
      openGroupIds={[currentTask.dayId]}
      layoutId="task-selector-indicator"
    />
  );
}
