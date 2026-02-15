import clsx from "clsx";
import styles from "./List.module.css";
import { motion } from "motion/react";
import {
  type CSSProperties,
  type HTMLAttributes,
  type ReactNode,
  useRef,
  useState,
} from "react";
import { CornerGroup } from "../CornerGroup/CornerGroup.tsx";
import { ButtonGroup } from "../Button/ButtonGroup/ButtonGroup.tsx";
import { IoIosArrowDown, IoIosArrowForward } from "react-icons/io";

type SingleElement = {
  id: string;
  name: string;
};

type Group = {
  id: string;
  name: string;
  elements: SingleElement[];
};

type ListElement = SingleElement | Group;

type ListProps = {
  elements: ListElement[];
  activeElementId: string | null;
  openGroupIds?: string[];
  onSelectElement?: (id: string) => void;
  /**
   * Optional children to render at the bottom of the list,
   * used for add/remove actions
   */
  children?: ReactNode | ReactNode[];
  layoutId?: string;
  nestingLevel?: number;
} & HTMLAttributes<HTMLDivElement>;

export function List({
  elements,
  openGroupIds = [],
  activeElementId,
  onSelectElement,
  layoutId = "list-indicator",
  nestingLevel = 0,
  children,
  className,
  ...props
}: ListProps) {
  const listRef = useRef<HTMLDivElement>(null);
  const [openGroups, setOpenGroups] = useState<Set<string>>(
    new Set(openGroupIds),
  );

  const toggleGroup = (groupId: string) => {
    setOpenGroups((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(groupId)) {
        newSet.delete(groupId);
      } else {
        newSet.add(groupId);
      }
      return newSet;
    });
  };

  return (
    <div className={clsx(styles.container, className)} {...props}>
      <div
        className={clsx(styles.list)}
        ref={listRef}
        style={
          {
            "--nesting-level": nestingLevel,
          } as CSSProperties
        }
      >
        {elements.map((element) =>
          isGroup(element) ? (
            <GroupElement
              key={element.name}
              group={element}
              activeElementId={activeElementId}
              onSelectElement={onSelectElement}
              layoutId={layoutId}
              openGroups={openGroups}
              toggleGroup={() => toggleGroup(element.id)}
              nestingLevel={nestingLevel}
            />
          ) : (
            <SingleElement
              key={element.id}
              element={element}
              activeElementId={activeElementId}
              onSelectElement={onSelectElement}
              layoutId={layoutId}
            />
          ),
        )}
        {children && <div className={styles.spacer} />}
      </div>
      {children && (
        <CornerGroup position="bottom-left" className={styles.cornerGroup}>
          <ButtonGroup stretch>{children}</ButtonGroup>
        </CornerGroup>
      )}
    </div>
  );
}

type ElementProps = {
  element: SingleElement;
  activeElementId: string | null;
  onSelectElement?: (id: string) => void;
  layoutId: string;
};

type GroupProps = Omit<ElementProps, "element"> & {
  group: Group;
  openGroups: Set<string>;
  toggleGroup: () => void;
  nestingLevel: number;
};

function GroupElement({
  group,
  activeElementId,
  onSelectElement,
  layoutId,
  openGroups,
  toggleGroup,
  nestingLevel,
}: GroupProps) {
  const isOpen = openGroups.has(group.id);
  const isActive = group.elements.some((el) => el.id === activeElementId);
  return (
    <div className={styles.groupContainer}>
      <div
        className={clsx(
          styles.element,
          styles.group,
          isActive && styles.activeGroup,
          isOpen && styles.openGroup,
        )}
        onClick={toggleGroup}
      >
        <div className={styles.elementName}>
          {isOpen ? <IoIosArrowDown /> : <IoIosArrowForward />}
          {group.name}
        </div>
      </div>

      {isOpen && (
        <div className={styles.groupListContainer}>
          <List
            elements={group.elements}
            activeElementId={activeElementId}
            onSelectElement={onSelectElement}
            layoutId={layoutId + "-" + group.id}
            nestingLevel={nestingLevel + 1}
          />
        </div>
      )}
    </div>
  );
}

function SingleElement({
  element,
  activeElementId,
  onSelectElement,
  layoutId,
}: ElementProps) {
  const id = element.id;
  const name = element.name;
  const isActive = id === activeElementId;
  return (
    <div
      key={id}
      className={clsx(styles.element, isActive && styles.active)}
      onClick={() => {
        onSelectElement?.(id);
      }}
    >
      {isActive && (
        <motion.div
          layoutId={layoutId}
          className={styles.indicator}
          transition={{
            type: "spring",
            stiffness: 500,
            damping: 50,
          }}
        />
      )}
      <div className={styles.elementName}>{name}</div>
    </div>
  );
}

function isGroup(element: ListElement): element is Group {
  return "elements" in element;
}
