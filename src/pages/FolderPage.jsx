import React, { useState, useEffect } from "react";
import EmailService from "../services/EmailService";
import "../assets/css/style.css";
import "../assets/css/folderPage.css";
import { FaChevronDown, FaChevronRight, FaTrash } from "react-icons/fa";
import { Link, Outlet, useLocation } from "react-router-dom";

// Reusable confirmation popup component
const ConfirmationPopup = ({ message, onConfirm, onCancel }) => {
  return (
    <div className="confirmation-popup-overlay">
      <div className="confirmation-popup">
        <p>{message}</p>
        <div className="confirmation-buttons">
          <button className="folder-page-confirm-button" onClick={onConfirm}>
            Yes
          </button>
          <button className="folder-page-cancel-button" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export function FolderPage() {
  const [folders, setFolders] = useState([]);
  const [folderName, setFolderName] = useState("");
  const [expandedFolders, setExpandedFolders] = useState({});
  const [recipientLists, setRecipientLists] = useState({});
  const [newListInputVisible, setNewListInputVisible] = useState({});
  const [newListName, setNewListName] = useState("");
  // const [selectedListId, setSelectedListId] = useState(null);

  // Instead of storing only the list ID, store the whole list object
  // const [selectedList, setSelectedList] = useState(null);

  // State for deletion popup
  const [deletePopup, setDeletePopup] = useState({
    show: false,
    type: null, // "folder" or "recipientList"
    folderId: null,
    listId: null,
  });

  const token = localStorage.getItem("token");

  const location = useLocation();
  // Check if we're on the hub page
  const isHubPage = location.pathname === "/folder";

  useEffect(() => {
    loadFolders();
  }, []);

  const loadFolders = async () => {
    try {
      const foldersData = await EmailService.getFolders(token);
      setFolders(foldersData);
    } catch (err) {
      console.error("Error fetching folders:", err);
    }
  };

  const handleCreateFolder = async () => {
    if (!folderName.trim()) {
      alert("Folder name cannot be empty.");
      return;
    }
    try {
      await EmailService.createFolder(folderName, token);
      setFolderName("");
      loadFolders();
    } catch (err) {
      console.error("Error creating folder:", err);
    }
  };

  const openDeleteFolderPopup = (folderId) => {
    setDeletePopup({
      show: true,
      type: "folder",
      folderId,
      listId: null,
    });
  };

  const openDeleteRecipientListPopup = (folderId, listId) => {
    setDeletePopup({
      show: true,
      type: "recipientList",
      folderId,
      listId,
    });
  };

  const handleConfirmDelete = async () => {
    if (deletePopup.type === "folder") {
      try {
        await EmailService.deleteFolder(deletePopup.folderId, token);
        loadFolders();
      } catch (err) {
        console.error("Error deleting folder:", err);
      }
    } else if (deletePopup.type === "recipientList") {
      try {
        await EmailService.deleteRecipientList(
          deletePopup.folderId,
          deletePopup.listId,
          token
        );
        fetchRecipientLists(deletePopup.folderId);
      } catch (err) {
        console.error("Error deleting recipient list:", err);
      }
    }
    // Close the popup after deletion
    setDeletePopup({ show: false, type: null, folderId: null, listId: null });
  };

  const handleCancelDelete = () => {
    setDeletePopup({ show: false, type: null, folderId: null, listId: null });
  };

  const toggleFolderExpansion = (folderId) => {
    setExpandedFolders((prev) => ({
      ...prev,
      [folderId]: !prev[folderId],
    }));
    if (!expandedFolders[folderId]) {
      fetchRecipientLists(folderId);
    }
  };

  const fetchRecipientLists = async (folderId) => {
    try {
      const listsData = await EmailService.getRecipientLists(folderId, token);
      setRecipientLists((prev) => ({ ...prev, [folderId]: listsData }));
    } catch (err) {
      console.error("Error fetching lists for folder:", err);
    }
  };

  const showNewListInput = (folderId) => {
    setNewListInputVisible((prev) => ({ ...prev, [folderId]: true }));
  };

  const handleCreateList = async (folderId) => {
    if (!newListName.trim()) {
      alert("List name cannot be empty.");
      return;
    }
    try {
      await EmailService.createRecipientList(folderId, newListName, token);
      setNewListName("");
      setNewListInputVisible((prev) => ({ ...prev, [folderId]: false }));
      fetchRecipientLists(folderId);
    } catch (err) {
      console.error("Error creating list:", err);
    }
  };

  // if (selectedList) {
  //   return (
  //     <RecipientTable
  //       listId={selectedList.id}
  //       recipientListName={selectedList.name}
  //       onClose={() => setSelectedList(null)}
  //     />
  //   );
  // }

  return (
    <>
      {isHubPage ? (
        <div className="folder-page">
          <h1 className="page-overview-title">🗂️Folders & 📜Lists</h1>

          <div className="create-folder">
            <input
              type="text"
              placeholder="Enter folder name"
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              className="folder-text-input"
            />
            <button
              onClick={handleCreateFolder}
              className="create-folder-button"
            >
              Create
            </button>
          </div>

          <div className="folders">
            {folders.map((folder) => (
              <div key={folder.id} className="folder">
                <div className="folder-header">
                  <span
                    className="folder-toggle"
                    onClick={() => toggleFolderExpansion(folder.id)}
                  >
                    {expandedFolders[folder.id] ? (
                      <FaChevronDown />
                    ) : (
                      <FaChevronRight />
                    )}
                  </span>
                  <span className="folder-name">{folder.name}</span>
                  <button
                    className="add-list-button"
                    // onClick={() => showNewListInput(folder.id)}
                    onClick={(e) => {
                      e.stopPropagation();
                      showNewListInput(folder.id);
                    }}
                  >
                    <span className="add-button-icon">+</span>
                  </button>

                  {/*  */}
                  <button
                    className="delete-folder-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      // handleDeleteFolder(folder.id);
                      openDeleteFolderPopup(folder.id);
                    }}
                  >
                    <FaTrash />
                  </button>
                  {/*  */}
                </div>

                {expandedFolders[folder.id] && (
                  <div className="folder-contents">
                    {newListInputVisible[folder.id] && (
                      <div className="new-list-input">
                        <input
                          type="text"
                          placeholder="Recipient list name"
                          value={newListName}
                          onChange={(e) => setNewListName(e.target.value)}
                        />
                        <button onClick={() => handleCreateList(folder.id)}>
                          Create
                        </button>
                      </div>
                    )}

                    <ul className="recipient-lists">
                      {recipientLists[folder.id]?.length ? (
                        recipientLists[folder.id].map((list) => (
                          <li key={list.id} className="recipient-list-item">
                            {/* <span onClick={() => setSelectedList(list)}>
                          {list.name}
                        </span> */}
                            <Link to={`recipient-table/${list.id}`} state={{ listName: list.name }}>
                              {list.name}
                            </Link>
                            <button
                              className="delete-recipient-list-button"
                              onClick={() =>
                                // handleDeleteRecipientList(folder.id, list.id)
                                openDeleteRecipientListPopup(folder.id, list.id)
                              }
                            >
                              <FaTrash />
                            </button>
                          </li>
                        ))
                      ) : (
                        <li className="no-lists">No lists available</li>
                      )}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>

          {deletePopup.show && (
            <ConfirmationPopup
              message={
                deletePopup.type === "folder"
                  ? "Are you sure you want to delete this folder? Deleting this folder will also delete all associated recipient lists and their attached campaigns automatically. Are you sure you want to proceed?"
                  : "Are you sure you want to delete this recipient list? Deleting this recipient list will also delete all attached campaigns automatically. Are you sure you want to proceed?"
              }
              onConfirm={handleConfirmDelete}
              onCancel={handleCancelDelete}
            />
          )}
        </div>
      ) : (
        <Outlet />
      )}
    </>
  );
}
