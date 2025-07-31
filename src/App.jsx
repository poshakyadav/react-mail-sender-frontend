import React from "react";
import "./assets/css/analytics.css";
import "./assets/css/comman-style.css";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Dashboard from "./pages/Dashboard";
import AddConfiguration from "./pages/AddConfiguration";
import ManageRecipients from "./pages/ManageRecipients";
import ComposeEmail from "./pages/ComposeEmail";
import ProtectedRoute from "./components/ProtectedRoute";
import EmailConfigurations from "./pages/EmailConfigurations";
import { FolderPage } from "./pages/FolderPage";
import NewSendMailPage from "./pages/NewSendMailPage";
import TemplatesPage from "./pages/TemplatesPage";
import UserSavedTemplatesPage from "./pages/UserSavedTemplatesPage";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ProtectedLayout from "./components/ProtectedLayout";
import FolderAndRecipientSelection from "./components/FolderAndRecipientSelection";
import MailBodyEditor from "./components/MailBodyEditor";
import HistoryCampaigns from "./pages/HistoryCampaigns";
import EditCampaign from "./pages/EditCampaign";
import CampaignAnalytics from "./pages/CampaignAnalytics";
import NestedCampaignComposer from "./components/NestedCampaignComposer";
import { RecipientTable } from "./components/RecipientTable";
import AdminTemplateCreator from "./pages/AdminTemplateCreator";
import AdminCategoryManager from "./pages/AdminCategoryManager";

const App = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <LoginPage />,
    },
    {
      path: "/login",
      element: <LoginPage />,
    },
    {
      path: "/register",
      element: <RegisterPage />,
    },
    {
      path: "/",
      element: (
        <ProtectedRoute>
          <ProtectedLayout />
        </ProtectedRoute>
      ),
      children: [
        {
          path: "dashboard",
          element: (
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          ),
        },
        {
          path: "add-configuration",
          element: (
            <ProtectedRoute>
              <AddConfiguration />
            </ProtectedRoute>
          ),
        },
        {
          path: "mail-activate",
          element: (
            <ProtectedRoute>
              <EmailConfigurations />
            </ProtectedRoute>
          ),
        },
        {
          path: "manage-recipients",
          element: (
            <ProtectedRoute>
              <ManageRecipients />
            </ProtectedRoute>
          ),
        },
        {
          path: "compose-email",
          element: (
            <ProtectedRoute>
              <ComposeEmail />
            </ProtectedRoute>
          ),
        },
        {
          path: "folder",
          element: (
            <ProtectedRoute>
              <FolderPage />
            </ProtectedRoute>
          ),
          children: [
            {
              path: "recipient-table/:listId",
              element: (
                <ProtectedRoute>
                  <RecipientTable />
                </ProtectedRoute>
              ),
            },
          ],
        },
        {
          path: "create-campaign",
          element: (
            <ProtectedRoute>
              {/* Add key to force remount */}
              <NewSendMailPage key={Date.now()} />
            </ProtectedRoute>
          ),
          children: [
            {
              path: "step1",
              element: (
                <ProtectedRoute>
                  <FolderAndRecipientSelection />
                </ProtectedRoute>
              ),
            },
            {
              path: "step2",
              element: (
                <ProtectedRoute>
                  <MailBodyEditor />
                </ProtectedRoute>
              ),
            },
          ],
        },
        {
          path: "templates",
          element: (
            <ProtectedRoute>
              <TemplatesPage />
            </ProtectedRoute>
          ),
        },
        {
          path: "saved-templates",
          element: (
            <ProtectedRoute>
              <UserSavedTemplatesPage />
            </ProtectedRoute>
          ),
        },
        {
          path: "admin-create-templates",
          element: (
            <ProtectedRoute>
              <AdminTemplateCreator />
            </ProtectedRoute>
          ),
        },
        {
          path: "admin-categories",
          element: (
            <ProtectedRoute>
              <AdminCategoryManager />
            </ProtectedRoute>
          ),
        },
        {
          path: "history-campaigns",
          element: (
            <ProtectedRoute>
              <HistoryCampaigns />
            </ProtectedRoute>
          ),
        },
        {
          path: "edit-campaign/:campaignId",
          element: (
            <ProtectedRoute>
              <EditCampaign />
            </ProtectedRoute>
          ),
        },
        {
          path: "campaign-analytics/:campaignId",
          element: (
            <ProtectedRoute>
              <CampaignAnalytics />
            </ProtectedRoute>
          ),
        },
        {
          path: "nested-campaign/:campaignId",
          element: (
            <ProtectedRoute>
              <NestedCampaignComposer />
            </ProtectedRoute>
          ),
        },
      ],
    },
    {
      path: "*",
      element: <h1>404 Not Found</h1>,
    },
  ]);
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
};

export default App;
