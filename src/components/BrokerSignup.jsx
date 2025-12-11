import { useState } from "react";
import { Form, Input, Button, Card, Alert } from "antd";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { UserOutlined } from "@ant-design/icons";

export default function BrokerSignup() {
  const { signup } = useAuth();
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const navigate = useNavigate();

  const onFinish = (values) => {
    setLoading(true);
    setTimeout(() => {
      const res = signup({ ...values, role: "broker" }); // mark as broker
      setLoading(false);

      setAlert({
        type: res.success ? "success" : "error",
        message: res.message,
      });

      if (res.success) {
        navigate("/login", {
          state: { signupMessage: res.message },
        });
      }
    }, 500);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-amber-50">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-96 text-center">
        <div className="flex justify-center items-center mb-4">
          <div className="bg-amber-500 text-white rounded-full p-3">
            <UserOutlined className="text-3xl" />
          </div>
        </div>

        <h2 className="text-xl font-bold text-amber-700">Broker Registration</h2>
        <p className="text-amber-600 mb-6">Create your new broker account</p>

        {alert && (
          <Alert
            type={alert.type}
            message={alert.message}
            className="mb-4"
            showIcon
            closable
            onClose={() => setAlert(null)}
          />
        )}

        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item
            label={<span className="text-amber-700 font-semibold">Broker Name</span>}
            name="name"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label={<span className="text-amber-700 font-semibold">Email</span>}
            name="email"
            rules={[{ required: true, type: "email" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label={<span className="text-amber-700 font-semibold">Password</span>}
            name="password"
            rules={[{ required: true, min: 6 }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item>
            <Button
              className="bg-amber-500! hover:bg-amber-600! text-white! border-none!"
              htmlType="submit"
              block
              loading={loading}
            >
              Register as Broker
            </Button>
          </Form.Item>
        </Form>

        {/* Broker Signup */}
  <div className="text-gray-500 mb-2">
    Want to register as a customer ?{" "}
    <Link
      to="/signup"
      className="text-amber-600 ml-1 hover:underline"
    >
       Customer
    </Link>
  </div>

  {/* Normal Login */}
  <div className="text-gray-500">
    Already have an account ?{" "}
    <Link
      to="/login"
      className="text-amber-600 ml-1  hover:underline"
    >
      Log In
    </Link>
  </div>
      </div>
    </div>
  );
}
