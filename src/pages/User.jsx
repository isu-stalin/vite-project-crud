import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../api";
import { Button } from "antd";
import { useState } from "react";

const User = () => {
  const queryClient = useQueryClient();

  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    profession: "",
    isMarried: false,
  });

  const { data } = useQuery({
    queryKey: ["user"],
    queryFn: () => api.get("/user"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/user/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });

  const postMutation = useMutation({
    mutationFn: (body) => api.post("/user", body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });

  const putMutation = useMutation({
    mutationFn: ({ id, body }) => api.put(`/user/${id}`, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const body = {
      ...formData,
      age: Number(formData.age),
    };

    if (editId) {
      putMutation.mutate({ id: editId, body }, {
        onSuccess: () => resetForm()
      });
    } else {
      postMutation.mutate(body, {
        onSuccess: () => resetForm()
      });
    }
  };

  const handleDelete = (id) => {
    deleteMutation.mutate(id);
  };

  const handleEdit = (user) => {
    setEditId(user.id);
    setFormData({
      name: user.name,
      age: user.age,
      profession: user.profession,
      isMarried: user.isMarried,
    });
  };

  const resetForm = () => {
    setFormData({ name: "", age: "", profession: "", isMarried: false });
    setEditId(null);
  };

  return (
    <div style={{ padding: 24 }}>
      <h2>User</h2>

      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          maxWidth: 300,
          gap: 12,
          background: "#f9f9f9",
          padding: 16,
          borderRadius: 8,
          border: "1px solid #ddd",
        }}
      >
        <input
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          style={{ padding: 8, border: "1px solid #ccc", borderRadius: 4 }}
        />
        <input
          name="age"
          type="number"
          placeholder="Age"
          value={formData.age}
          onChange={(e) => setFormData({ ...formData, age: e.target.value })}
          style={{ padding: 8, border: "1px solid #ccc", borderRadius: 4 }}
        />
        <input
          name="profession"
          placeholder="Profession"
          value={formData.profession}
          onChange={(e) => setFormData({ ...formData, profession: e.target.value })}
          style={{ padding: 8, border: "1px solid #ccc", borderRadius: 4 }}
        />
        <label style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <input
            type="checkbox"
            name="isMarried"
            checked={formData.isMarried}
            onChange={(e) =>
              setFormData({ ...formData, isMarried: e.target.checked })
            }
          />
          Married
        </label>
        <Button type="primary" htmlType="submit">
          {editId ? "Save" : "Add User"}
        </Button>
      </form>

      <div style={{ marginTop: 32 }}>
        {data?.data?.map((user) => (
          <div
            key={user.id}
            style={{
              border: "1px solid #ccc",
              padding: 16,
              marginBottom: 16,
              borderRadius: 8,
              background: "#fff",
            }}
          >
            <img
              src={user.image}
              width={200}
              alt={user.name}
              style={{ borderRadius: 12 }}
            />
            <h3>{user.name}</h3>
            <p>Age: {user.age}</p>
            <p>Profession: {user.profession}</p>
            <p>Married: {user.isMarried ? "Yes" : "No"}</p>
            <Button danger onClick={() => handleDelete(user.id)}>
              Delete
            </Button>
            <Button onClick={() => handleEdit(user)} style={{ marginLeft: 8 }}>
              Edit
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default User;
