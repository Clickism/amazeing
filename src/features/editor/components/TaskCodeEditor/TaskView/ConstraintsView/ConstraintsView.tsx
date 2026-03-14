import clsx from "clsx";
import type { EvaluatedConstraint } from "../../../../../../core/game/constraints.ts";
import { useTranslatable } from "../../../../../../shared/i18n/i18n.ts";
import styles from "./ConstraintsView.module.css";
import { Collapsable } from "../../../../../../shared/components/Collapsable/Collapsable.tsx";
import { QuotedText } from "../../../../../../shared/components/QuotedText/QuotedText.tsx";
import { FaCheck, FaXmark } from "react-icons/fa6";

type ConstraintsViewProps = {
  open?: boolean;
  showTooltip?: boolean;
  constraints: EvaluatedConstraint[];
};

export function ConstraintsView({
  open = false,
  showTooltip = true,
  constraints,
}: ConstraintsViewProps) {
  const { t } = useTranslatable();
  const allConstraintsMet = constraints.every((c) => c.met);
  const metConstraintsCount = constraints.filter((c) => c.met).length;
  return (
    <>
      <Collapsable
        initialOpen={open}
        tooltip={showTooltip ? t("constraintsView.tooltip") : undefined}
        title={(open) => (
          <div className={clsx(!open && styles.closed)}>
            {t("constraintsView.title")}
            <span
              className={clsx(
                styles.counter,
                allConstraintsMet ? styles.counterMet : styles.counterUnmet,
              )}
            >{` (${metConstraintsCount}/${constraints.length})`}</span>
          </div>
        )}
      >
        <div className={styles.list}>
          {constraints?.map((constraint, i) => (
            <div
              key={i}
              className={clsx(
                styles.constraint,
                constraint.met ? styles.met : styles.unmet,
              )}
            >
              <div className={styles.icon}>
                {constraint.met ? <FaCheck /> : <FaXmark size={18} />}
              </div>
              <div>
                <QuotedText
                  text={t(`constraints.${constraint.type}`, {
                    ...constraint,
                    allowed:
                      constraint.type === "allowed-instructions"
                        ? constraint.allowed.map((i) => `"${i}"`).join(", ")
                        : undefined,
                  })}
                />
              </div>
            </div>
          ))}
        </div>
      </Collapsable>
    </>
  );
}
