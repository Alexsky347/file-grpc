import { PlusIcon } from "@radix-ui/react-icons";
import DialogAddFile from "../dialog-add-file/dialog-add-file.tsx";
import { Dispatch, SetStateAction } from "react";

interface SideNavProps {
  sideNavOpen: boolean;
  reRender: boolean;
  setReRender: Dispatch<SetStateAction<boolean>>;
}

export default function SideNav({
  sideNavOpen,
  reRender,
  setReRender,
}: Readonly<SideNavProps>) {
  const widthNav = sideNavOpen ? 150 : 0;

  return (
    <div
      className={`fixed left-5 h-screen top-20 bg-base-100 border-r-2 z-20 pr-5 ${
        widthNav === 0 ? "hidden" : ""
      }`}
      style={{ width: `${widthNav}px` }}
    >
      <div className="flex flex-col items-center">
        <div className="flex flex-col items-center">
          <div className="flex flex-col items-center">
            <DialogAddFile
              reRender={reRender}
              setReRender={setReRender}
              sideNavOpen={sideNavOpen}
            />
            <button className="flex flex-row items-center mb-3 mt-3 rounded hover:bg-base-300">
              <PlusIcon
                className="w-10 h-10 text-base-content"
                fill="currentColor"
                aria-label={"Add file(s)"}
              />
              {sideNavOpen && (
                <span className="text-base-content">Add file(s)</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
