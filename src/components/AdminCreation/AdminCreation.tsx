import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import ResponsiveDrawer from "../../ResponsiveDrawer";
import AdminList from "./AdminList";
import AddAdminDialog from "./AddAdminDialog";
import EditAdminDialog from "./EditAdminDialog";
import DeleteAdminDialog from "./DeleteAdminDialog";
import Fabs from "./Fabs";
import { api } from "../../api/api";

import { useAuth } from "../../context/AuthContext"; // adjust path accordingly

interface User {
  user_id: string;
  username: string;
  password: string;
}

const AdminCreation: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, token, logout, role } = useAuth();

  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null);
  const [open, setOpen] = useState<boolean>(false);
  const [editOpen, setEditOpen] = useState<boolean>(false);
  const [confirmOpen, setConfirmOpen] = useState<boolean>(false);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/adminlogin"); // or your login route
    }
  }, [isAuthenticated, navigate]);

  // Example: you can do role check if needed
  useEffect(() => {
    if (role && role !== "admin") {
      toast.error("You do not have permission to access this page.");
      navigate("/"); // redirect or block as needed
    }
  }, [role, navigate]);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${api}/admin/users`, {
        headers: {
          Authorization: `Bearer ${token}`, // include token here
        },
      });
      if (response.data.Status) {
        setUsers(response.data.Users || []);
      } else {
        console.error(response.data.Error);
        toast.error(response.data.Error || "Failed to fetch users.");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Error fetching users.");
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchUsers();
    }
  }, [isAuthenticated, token]);

  return (
    <ResponsiveDrawer>
      <Toaster position="top-center" reverseOrder={false} />

      {/* Optional logout button */}
      <button
        onClick={() => {
          logout();
          navigate("/adminlogin");
        }}
        style={{ position: "absolute", top: 20, right: 20 }}
      >
        Logout
      </button>

      <Fabs onClick={() => setOpen(true)} />

      <AddAdminDialog open={open} setOpen={setOpen} fetchUsers={fetchUsers} />
      <EditAdminDialog
        open={editOpen}
        setOpen={setEditOpen}
        user={selectedUser}
        setUser={setSelectedUser}
        fetchUsers={fetchUsers}
      />
      <DeleteAdminDialog
        open={confirmOpen}
        setOpen={setConfirmOpen}
        userId={deleteUserId}
        fetchUsers={fetchUsers}
      />

      <AdminList
        users={users}
        onEdit={(user) => {
          setSelectedUser(user);
          setEditOpen(true);
        }}
        onDelete={(userId) => {
          setDeleteUserId(userId);
          setConfirmOpen(true);
        }}
        navigate={navigate}
        onAddClick={() => setOpen(true)}
      />
    </ResponsiveDrawer>
  );
};

export default AdminCreation;
