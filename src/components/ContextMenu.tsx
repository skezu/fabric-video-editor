"use client";
import React, { useState } from "react";
import { StoreContext } from "@/store";
import { observer } from "mobx-react";

// Assuming you have a ReframeModal component
import ReframeModal from "./modals/ReframeModal";

interface ContextMenuProps {
    children: React.ReactNode; // Define the children prop
  }

const ContextMenu: React.FC<ContextMenuProps> = observer(({ children }) => {
  const store = React.useContext(StoreContext);
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({
    x: 0,
    y: 0,
  });

  const [showReframeModal, setShowReframeModal] = useState(false);

  const handleContextMenu = (event: React.MouseEvent) => {
    event.preventDefault(); 
    if (!store.selectedElement) return;
    setContextMenuPosition({ x: event.clientX, y: event.clientY });
    setShowContextMenu(true);
  };

  const handleCloseContextMenu = () => {
    setShowContextMenu(false);
  };

  const handleReframe = () => {
    handleCloseContextMenu();
    setShowReframeModal(true);
  };

  return (
    <div
      onContextMenu={handleContextMenu} // Attach context menu to a parent element
    > 
      {children}

      {showContextMenu && (
        <div
          className="absolute z-50 bg-white border border-gray-300 rounded shadow-md p-2"
          style={{ top: contextMenuPosition.y, left: contextMenuPosition.x }}
          onMouseLeave={handleCloseContextMenu} // Close on mouse leave
        >
          <button
            onClick={handleReframe}
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Reframe
          </button>
          {/* ... add other context menu options if needed ... */}
        </div>
      )}

      {/* Modal for reframing */}
      {showReframeModal && store.selectedElement && (
        <ReframeModal
          onClose={() => setShowReframeModal(false)}
          // Pass selectedElement to the modal
          element={store.selectedElement} 
        />
      )}
    </div>
  );
});

export default ContextMenu;