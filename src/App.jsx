import { Layout, Menu } from "antd";
import { Link, Route, Routes, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import User from "./pages/User";
import './App.css'

const { Header, Content, Footer } = Layout;

const App = () => {
  const location = useLocation();

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header style={{ background: "#fff", position: "sticky", top:0, zIndex:10, padding: 0 }}>
        <Menu
          mode="horizontal"
          selectedKeys={[location.pathname]}
          style={{ background: "#fff", borderBottom: "1px solid #eee" }}
          items={[
            { label: <Link to="/">INeedLogo</Link> },
            { key: "/", label: <Link to="/">Home</Link> },
            { key: "/user", label: <Link to="/user">User</Link> },
          ]}
        />
      </Header>

      <Content style={{ padding: "24px" }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/user" element={<User />} />
        </Routes>
      </Content>

      <Footer style={{ textAlign: "center", background: "#fff", borderTop: "1px solid #eee" }}>
        © {new Date().getFullYear()} <Link to={"/"}>INeedLogo</Link>
      </Footer>
    </Layout>
  );
};

export default App;
