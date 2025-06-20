import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../api";
import { Button, Card, Row, Col, Typography, Spin } from "antd";
import { useState } from "react";

const { Title } = Typography;

const Home = () => {
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
  });

  const [editId, setEditId] = useState(null);

  // GET
  const { data, isLoading } = useQuery({
    queryKey: ["items"],
    queryFn: () => api.get("/items").then((res) => res.data),
  });

  // POST
  const postMutation = useMutation({
    mutationFn: (body) => api.post("/items", body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["items"] });
    },
  });

  // PUT
  const putMutation = useMutation({
    mutationFn: ({ id, body }) => api.put(`/items/${id}`, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["items"] });
    },
  });

  // DELETE
  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/items/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["items"] });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const body = {
      ...formData,
      price: Number(formData.price),
    };

    if (editId) {
      putMutation.mutate({ id: editId, body }, {
        onSuccess: () => {
          resetForm();
        }
      });
    } else {
      postMutation.mutate(body, {
        onSuccess: () => {
          resetForm();
        }
      });
    }
  };

  const resetForm = () => {
    setFormData({ name: "", price: "", image: "", description: "" });
    setEditId(null);
  };

  const handleDelete = (id) => {
    deleteMutation.mutate(id);
  };

  const handleEdit = (item) => {
    setEditId(item.id);
    setFormData({
      name: item.name,
      price: item.price,
      description: item.description,
    });
  };

  return (
    <div style={{ padding: 24 }}>
      <Title level={2}>Items</Title>

      <form onSubmit={handleSubmit} style={formStyle}>
        <input
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          style={inputStyle}
        />
        <input
          name="price"
          type="number"
          placeholder="Price"
          value={formData.price}
          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
          style={inputStyle}
        />
        <textarea
          name="description"
          placeholder="Description"
          rows={3}
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          style={{ ...inputStyle, resize: "vertical" }}
        />
        <Button htmlType="submit" type="primary">
          {editId ? "Save Changes" : "Add Item"}
        </Button>
      </form>

      {isLoading ? (
        <Spin />
      ) : (
        <Row gutter={[16, 16]}>
          {data?.map((item) => (
            <Col key={item.id} span={8}>
              <Card
                hoverable
                cover={<img alt={item.name} src={item.image} style={{ height: 300, objectFit: "cover" }} />}
                actions={[
                  <Button danger onClick={() => handleDelete(item.id)}>
                    Delete
                  </Button>,
                  <Button onClick={() => handleEdit(item)}>
                    Edit
                  </Button>,
                ]}
              >
                <Card.Meta
                  title={`${item.name} — ${item.price} UZS`}
                  description={item.description}
                />
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

const formStyle = {
  display: "flex",
  flexDirection: "column",
  maxWidth: 400,
  gap: 10,
  background: "#f9f9f9",
  padding: 16,
  border: "1px solid #ddd",
  borderRadius: 8,
  marginBottom: 32,
};

const inputStyle = {
  padding: 8,
  border: "1px solid #ccc",
  borderRadius: 4,
};

export default Home;
