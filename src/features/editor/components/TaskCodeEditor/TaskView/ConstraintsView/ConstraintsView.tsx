import clsx from "clsx";
import type { EvaluatedConstraint } from "../../../../../../core/game/constraints.ts";
import { useTranslatable } from "../../../../../../shared/i18n/i18n.ts";
import { useTasks } from "../../../../../precourse/context/TasksContext.tsx";
import styles from "./ConstraintsView.module.css";
import { Collapsable } from "../../../../../../shared/components/Collapsable/Collapsable.tsx";
import { QuotedText } from "../../../../../../shared/components/QuotedText/QuotedText.tsx";

type ConstraintsViewProps = {
  constraints: EvaluatedConstraint[];
};

export function ConstraintsView({ constraints }: ConstraintsViewProps) {
  const { t } = useTranslatable();
  const { task, completedTasks } = useTasks();
  const allConstraintsMet = constraints.every((c) => c.met);
  const metConstraintsCount = constraints.filter((c) => c.met).length;
  return (
    <>
      <Collapsable
        tooltip={t("constraintsView.tooltip")}
        title={
          t("constraintsView.title") +
          ` (${metConstraintsCount}/${constraints.length})`
        }
        titleClassName={(open) =>
          clsx(
            styles.title,
            !open && styles.titleClosed,
            allConstraintsMet ? styles.titleMet : styles.titleUnmet,
          )
        }
      >
        <div className={styles.list}>
          {constraints?.map((constraint, i) => (
            <div
              key={i}
              className={clsx(
                styles.constraint,
                (constraint.met || completedTasks.includes(task.id)) &&
                  styles.met,
                // This could also be undefined if the constraint hasn't been evaluated yet
                constraint.met === false && styles.unmet,
              )}
            >
              <QuotedText
                text={t(`constraints.${constraint.type}`, {
                  ...constraint,
                  allowed:
                    constraint.type === "allowed-instructions"
                      ? constraint.allowed
                        .map((i) => `"${i}"`)
                        .join(", ")
                      : undefined,
                })}
              />
            </div>
          ))}
        </div>
      </Collapsable>
    </>
  );
}
