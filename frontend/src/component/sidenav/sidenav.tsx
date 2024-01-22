import { PlusIcon } from "@radix-ui/react-icons";
import DialogAddFile from "../dialog-add-file/dialog-add-file.tsx";

interface SideNavProps {
    sideNavOpen: boolean;
}

export default function SideNav({sideNavOpen}: Readonly<SideNavProps>) {
    const widthNav = sideNavOpen ? 150 : 80;

    return (
        <div className="fixed left-5 top-15 h-screen bg-base-100 border-r-4 z-20 pr-5" style={{width: `${widthNav}px`}}>
            <div className="flex flex-col items-center">
                <div className="flex flex-col items-center">
                    <div className="flex flex-col items-center">
                        <DialogAddFile sideNavOpen={sideNavOpen}/>
                        <button className="flex flex-row items-center mb-3 mt-3 rounded hover:bg-base-300">
                            <PlusIcon className="w-10 h-10 text-base-content" fill="currentColor"
                                      aria-label={"Add file(s)"}/>
                            {sideNavOpen && <span className="text-base-content">Add file(s)</span>}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
