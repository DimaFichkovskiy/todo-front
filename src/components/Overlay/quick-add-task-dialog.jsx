import { TaskEditor } from "../TaskEditor";
export const QuickAddTaskDialog = ({ closeOverlay }) => {
  return (
    <div className="option__overlay" onClick={(event) => closeOverlay(event)}>
      <div className="quick-add-task__wrapper">
        <TaskEditor isQuickAdd closeOverlay={closeOverlay} />
      </div>
    </div>
  );
};
