import { Layout } from "../../shared/components/Layout/Layout.tsx";
import styles from "./HomePage.module.css";

import logo from "../../assets/logo.png";
import { Button } from "../../shared/components/Button/Button.tsx";
import type { ReactNode } from "react";
import clsx from "clsx";
import { useTranslation } from "react-i18next";
import { TbSandbox, TbTools } from "react-icons/tb";
import { FaTasks } from "react-icons/fa";
import { FaArrowRight } from "react-icons/fa6";

export function HomePage() {
  const { t } = useTranslation();
  return (
    <Layout>
      <div className={styles.logoContainer}>
        <img src={logo} alt="Amazeing Logo" className={styles.logo} />
      </div>
      <div className={styles.container}>
        <Card
          title={
            <>
              {t("home.tasks")} <FaTasks size={20} />
            </>
          }
          highlighted
          description={t("home.tasks.description")}
        >
          <Button variant="primary" linkTo="/tasks">
            {t("home.tasks.button")} <FaArrowRight />
          </Button>
        </Card>
        <div className={styles.separator} />
        <Card
          title={
            <>
              {t("home.sandbox")} <TbSandbox />
            </>
          }
          description={t("home.sandbox.description")}
        >
          <Button linkTo="/sandbox">
            {t("home.sandbox.button")} <FaArrowRight />
          </Button>
        </Card>
        <Card
          title={
            <>
              {t("home.levelEditor")} <TbTools />
            </>
          }
          description={t("home.levelEditor.description")}
        >
          <Button linkTo="/level-editor">
            {t("home.levelEditor.button")} <FaArrowRight />
          </Button>
        </Card>
      </div>
    </Layout>
  );
}

function Card({
  title,
  description,
  highlighted,
  children,
}: {
  title: string | ReactNode;
  description: string | ReactNode;
  highlighted?: boolean;
  children: ReactNode;
}) {
  return (
    <div className={clsx(styles.card, highlighted && styles.highlighted)}>
      <div className={styles.cardTitle}>{title}</div>
      <div className={styles.cardDescription}>{description}</div>
      <div className={styles.cardBody}>{children}</div>
    </div>
  );
}
