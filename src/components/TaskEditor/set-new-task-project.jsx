import { ReactComponent as Dot } from "../../assets/svg/dot.svg";
import { ReactComponent as InboxIcon } from "../../assets/svg/inbox.svg";
import { useOverlayContextValue } from "../../context";
import { useProjects, useSelectedProject } from "../../hooks";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { SetNewTaskProjectPopper } from "../dropdowns/set-new-task-project-popper";
export const SetNewTaskProject = ({ isQuickAdd, project, setProject }) => {
  const params = useParams();
  // const { selectedProject } = useSelectedProjectValue(params);
  const { projects } = useProjects();
  const { selectedProject, defaultGroup } = useSelectedProject(params, projects);
  const [popupSelectedProject, setPopupSelectedProject] = useState(selectedProject);
  const { setShowDialog, setDialogProps } = useOverlayContextValue();
  const [showPopup, setShowPopup] = useState(false);
  const [parentPosition, setParentPosition] = useState({});

  const defaultProjectValue = { selectedProjectName: "Пошта", selectedProjectId: "", defaultProject: true };
  useEffect(() => {
    if (!project.defaultProject) {
      setPopupSelectedProject(project);
    } else {
      setPopupSelectedProject(defaultProjectValue);
    }
  }, [project]);
  useEffect(() => {
    if (!selectedProject.defaultProject) {
      setProject(selectedProject);
    } else {
      setProject(defaultProjectValue);
    }
  }, [selectedProject]);

  const showQUickAddDropDown = (parentPosition) => {
    setParentPosition(parentPosition);
    setShowPopup(true);
  };
  return (
    <div
      className="set-new-task__project"
      role="button"
      onClick={(e) => {
        setDialogProps(
          Object.assign({ elementPosition: e.currentTarget.getBoundingClientRect() }, { setProject, setPopupSelectedProject })
        );
        isQuickAdd ? showQUickAddDropDown(e.currentTarget.getBoundingClientRect()) : setShowDialog("SET_PROJECT");
      }}
    >
      {popupSelectedProject?.selectedProjectName === "Пошта" ? (
        <InboxIcon width="18px" height="18px" fill="#5297ff" />
      ) : (
        <Dot color={`${popupSelectedProject?.projectColour?.hex}`} width={17} height={17} />
      )}
      <p className="set-new-task__project--name">{popupSelectedProject.selectedProjectName}</p>
      {showPopup && (
        <SetNewTaskProjectPopper
          setShowPopup={setShowPopup}
          project={project}
          setProject={setProject}
          setPopupSelectedProject={setPopupSelectedProject}
          parentPosition={parentPosition}
          isQuickAdd={isQuickAdd}
          showPopup={showPopup}
        />
      )}
    </div>
  );
};
