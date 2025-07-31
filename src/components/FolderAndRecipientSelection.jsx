import { useOutletContext, useNavigate } from "react-router-dom";
import "../assets/css/newSendMailPage.css";
import { MdOutlineDoubleArrow } from "react-icons/md";
import { IoMdPeople } from "react-icons/io";
import { FaFolderOpen } from "react-icons/fa";
import { TbMailFilled } from "react-icons/tb";
import { TiArrowRightThick } from "react-icons/ti";

export default function FolderAndRecipientSelection() {
  const {
    folders,
    recipientLists,
    selectedFolderId,
    selectedListId,
    subject,
    handleFolderChange,
    setSelectedListId,
    setSubject,
  } = useOutletContext();

  const navigate = useNavigate();

  const handleNext = () => {
    if (!selectedFolderId) {
      alert("Please select a folder.");
      return;
    }

    // Check if recipientLists exists and has items
    if (!recipientLists || !recipientLists.length) {
      alert("Please select a recipient list.");
      return;
    }
    if (!subject) {
      alert("Please enter a subject.");
      return;
    }
    navigate("/create-campaign/step2");
  };

  return (
    // <div className="folder-selection-container">
    //   <h2 className="selection-title">Select Folder and Recipient List</h2>
    //   <div className="form-group">
    //     <label htmlFor="folder-select">Select Folder</label>
    //     <select
    //       id="folder-select"
    //       className="custom-select"
    //       value={selectedFolderId || ""}
    //       onChange={(e) => handleFolderChange(Number(e.target.value))}
    //     >
    //       <option value="" disabled>
    //         Select a folder
    //       </option>
    //       {folders.map((folder) => (
    //         <option key={folder.id} value={folder.id}>
    //           {folder.name}
    //         </option>
    //       ))}
    //     </select>
    //   </div>

    //   <div className="form-group">
    //     <label htmlFor="recipient-select">Select Recipient List</label>
    //     <select
    //       id="recipient-select"
    //       className="custom-select"
    //       value={selectedListId || ""}
    //       onChange={(e) => setSelectedListId(Number(e.target.value))}
    //       disabled={!recipientLists.length}
    //     >
    //       <option value="" selected disabled >
    //         Select a list
    //       </option>
    //       {recipientLists.map((list) => (
    //         <option key={list.id} value={list.id}>
    //           {list.name}
    //         </option>
    //       ))}
    //     </select>
    //   </div>

    //   <div className="form-group">
    //     <label htmlFor="email-subject">Email Subject</label>
    //     <input
    //       id="email-subject"
    //       className="custom-input"
    //       type="text"
    //       placeholder="Enter mail subject"
    //       value={subject}
    //       onChange={(e) => setSubject(e.target.value)}
    //     />
    //   </div>

    //   <div
    //     className="button-group"
    //   >
    //     <button
    //       className="btn back-btn"
    //       onClick={() => navigate(-1)}
    //     >
    //       Back
    //     </button>
    //     <button
    //       className="btn next-btn"
    //       onClick={handleNext}
    //     >
    //       Next
    //     </button>
    //   </div>
    // </div>

    <div className="fars-container">
      
      <div className="back-button-section">
        <button className="back-button" onClick={() => navigate("/create-campaign")}>
          <MdOutlineDoubleArrow className="back-icon" /> Back
        </button>
      </div>

      <h2 className="fars-title">Setup Campaign Details</h2>

      <div className="fars-form-group">
        <label htmlFor="folder-select" className="fars-label">
          <span className="fars-label-icon">
            <FaFolderOpen />
          </span>
          Select Folder
        </label>
        <select
          id="folder-select"
          className="fars-select"
          value={selectedFolderId || ""}
          onChange={(e) => handleFolderChange(Number(e.target.value))}
        >
          <option value="" disabled>
            Choose a folder
          </option>
          {folders.map((folder) => (
            <option key={folder.id} value={folder.id}>
              {folder.name}
            </option>
          ))}
        </select>
      </div>

      <div className="fars-form-group">
        <label htmlFor="recipient-select" className="fars-label">
          <span className="fars-label-icon">
            <IoMdPeople />
          </span>
          Select Recipient List
        </label>
        <select
          id="recipient-select"
          className="fars-select"
          value={selectedListId || ""}
          onChange={(e) => setSelectedListId(Number(e.target.value))}
          disabled={!recipientLists.length}
        >
          <option value="" disabled>
            Choose a recipient list
          </option>
          {recipientLists.map((list) => (
            <option key={list.id} value={list.id}>
              {list.name}
            </option>
          ))}
        </select>
      </div>

      <div className="fars-form-group">
        <label htmlFor="email-subject" className="fars-label">
          <span className="fars-label-icon">
            <TbMailFilled />
          </span>
          Email Subject
        </label>
        <input
          id="email-subject"
          className="fars-input"
          type="text"
          placeholder="Enter email subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />
      </div>

      <div className="fars-button-group">
        <button className="fars-btn fars-next-btn" onClick={handleNext}>
          Continue
          <span className="fars-btn-arrow">
            <TiArrowRightThick />
          </span>
        </button>
      </div>
    </div>
  );
}
