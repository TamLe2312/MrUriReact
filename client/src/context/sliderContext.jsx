import { createContext, useState } from "react";
export const SliderContext = createContext();

function SliderProvider({ children }) {
  const [sliders, setSliders] = useState([]);

  return (
    <SliderContext.Provider value={{ sliders, setSliders }}>
      {children}
    </SliderContext.Provider>
  );
}

export default SliderProvider;
