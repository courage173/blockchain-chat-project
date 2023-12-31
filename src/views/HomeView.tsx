import { ReactElement, useEffect } from "react";

import AOS from "aos";
import "aos/dist/aos.css";
import DashboardLayout from "./DashboardLayout";

export default function HomeView(): ReactElement {
  useEffect(() => {
    AOS.init();
  }, []);
  return (
    <DashboardLayout>
      <div className="pt-[50px] h-full">
        <small className="flex justify-center items-center text-white h-full">
          <span className="text-white text-lg text-center md:text-xl mb-2 ">
            Blockchain encrypted <br />
            conversations will appear here
          </span>
        </small>
      </div>
    </DashboardLayout>
  );
}
