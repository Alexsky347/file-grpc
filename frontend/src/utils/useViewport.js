import { viewportContext } from './ViewportProvider.js';
import { useContext } from "react";


/* Rewrite the "useViewport" hook to pull the width and height values
   out of the context instead of calculating them itself */
export const useViewport = () => {
   /* We can use the "useContext" Hook to acccess a context from within
      another Hook, remember, Hooks are composable! */
   const { width, height } = useContext(viewportContext);;

   const isMobile = (width > 1 && width <= 513);
   const isTablet = (width > 513 && width <= 1025);
   return { isMobile, isTablet, isDesktop: !isMobile && !isTablet, width, height };

}