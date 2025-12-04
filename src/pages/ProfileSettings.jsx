// ProfileSettings.jsx
import React, { useState } from "react";
import { Form, Input, Button, Upload, Switch, Col, Row } from "antd";
import {
  UserOutlined,
  SafetyOutlined,
  ApartmentOutlined,
  UploadOutlined,
} from "@ant-design/icons";

const profileData = {
  personalInfo: {
    firstName: "Rajesh",
    lastName: "Kumar",
    email: "rajesh.kumar@ruchisoya.com",
    phone: "+91 9876543210",
    position: "System Administrator",
    department: "IT Department",
    bio: "Experienced system administrator with 5+ years in ERP systems management.",
    avatarInitials: "RK",
  },
  security: {
    twoFactor: true,
    loginAlerts: false,
    sessionTimeout: 30,
  },
  company: {
    name: "Ruchi Soya Industries Ltd.",
    address: "Plot No. 15, Industrial Estate, Bhubaneswar, Odisha 751010",
    companyPhone: "9876543210",
    companyEmail: "rajesh.kumar@ruchisoya.com",
  },
};

export default function ProfileSettings() {
  const [formPersonal] = Form.useForm();
  const [formSecurity] = Form.useForm();
  const [formCompany] = Form.useForm();
  const [profile, setProfile] = useState(profileData);

  return (
    <div>
      <h1 className="text-3xl font-bold text-amber-700 mb-2">Profile Settings</h1>
      <p className="text-amber-600 mb-6">
        Manage your account settings and preferences
      </p>

      <Row gutter={24}>
        {/* LEFT COLUMN - Personal Information 40% */}
        <Col span={10}>
          <div className="bg-white p-6 rounded-lg shadow-sm border-1 border-amber-300">
            <h2 className="font-semibold text-lg text-amber-700 mb-3 flex items-center gap-2">
              <UserOutlined /> Personal Information
            </h2>
            <p className="text-amber-600 mb-6">
              Update your personal details
            </p>

            {/* Avatar */}
            <Row gutter={20} align="middle" className="mb-6">
              <Col>
                <div className="w-20 h-20 flex items-center justify-center rounded-full bg-amber-200 text-xl font-semibold text-amber-800 shadow">
                  {profile.personalInfo.avatarInitials}
                </div>
              </Col>
              <Col flex="1">
                <Row gutter={[12, 12]}>
                  <Col>
                    <Upload showUploadList={false}>
                      <Button
                        type="default"
                        className="border-amber-500 text-amber-700 hover:bg-amber-500 hover:text-white !mt-6"
                      >
                        Change Photo
                      </Button>
                    </Upload>
                  </Col>
                  <Col>
                    <Button danger className="!mt-6 hover:bg-red-500 hover:text-white">
                      Remove
                    </Button>
                  </Col>
                </Row>
                <p className="text-amber-500 text-sm mt-2">
                  Upload JPG/PNG/GIF – Max size 2MB.
                </p>
              </Col>
            </Row>

            {/* Personal Info Form */}
            <Form
              layout="vertical"
              form={formPersonal}
              initialValues={profile.personalInfo}
              autoComplete="off"
              onFinish={(values) => {
                setProfile((prev) => ({
                  ...prev,
                  personalInfo: { ...prev.personalInfo, ...values },
                }));
              }}
            >
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item name="firstName" label="First Name">
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="lastName" label="Last Name">
                    <Input />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item name="email" label="Email Address">
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="phone" label="Phone Number">
                    <Input />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item name="position" label="Position">
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="department" label="Department">
                    <Input />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item name="bio" label="Bio">
                <Input.TextArea rows={3} />
              </Form.Item>

              <Button
                type="primary"
                htmlType="submit"
                icon={<UploadOutlined />}
                style={{ backgroundColor: "#d97706", borderColor: "#d97706" }}
              >
                Save Changes
              </Button>
            </Form>
          </div>
        </Col>

        {/* RIGHT COLUMN - Security and Company Info 60% */}
        <Col span={14}>
          {/* SECURITY SECTION */}
          <div className="bg-white p-6 rounded-lg shadow-sm mb-6 border-1 border-amber-300">
            <h2 className="font-semibold text-lg text-amber-700 mb-3 flex items-center gap-2">
              <SafetyOutlined /> Security
            </h2>
            <p className="text-amber-600 mb-6">
              Manage your account security
            </p>

            <Form
              layout="vertical"
              form={formSecurity}
              initialValues={profile.security}
              autoComplete="off"
              onFinish={(values) => {
                setProfile((prev) => ({
                  ...prev,
                  security: { ...prev.security, ...values },
                }));
              }}
            >
              <Form.Item
                name="twoFactor"
                valuePropName="checked"
                className="mb-5"
              >
                <Row justify="space-between" align="middle">
                  <Col>
                    <div className="font-semibold text-amber-700">
                      Two-Factor Authentication
                    </div>
                    <div className="text-amber-600 text-sm">
                      Add extra security layer
                    </div>
                  </Col>
                  <Col>
                    <Switch defaultChecked={profile.security.twoFactor} />
                  </Col>
                </Row>
              </Form.Item>

              <Form.Item
                name="loginAlerts"
                valuePropName="checked"
                className="mb-5"
              >
                <Row justify="space-between" align="middle">
                  <Col>
                    <div className="font-semibold text-amber-700 ">
                      Login Alerts
                    </div>
                    <div className="text-amber-600 text-sm">
                      Notify on new login attempts
                    </div>
                  </Col>
                  <Col>
                    <Switch defaultChecked={profile.security.loginAlerts} />
                  </Col>
                </Row>
              </Form.Item>

              <Form.Item
                label="Session Timeout (minutes)"
                name="sessionTimeout"
                rules={[
                  { type: "number", min: 1, max: 120, message: "1-120 minutes" },
                ]}
              >
                <Input type="number" className="w-32" />
              </Form.Item>

              <Button
                type="primary"
                htmlType="submit"
                icon={<UploadOutlined />}
                style={{ backgroundColor: "#d97706", borderColor: "#d97706" }}
              >
                Save Security Settings
              </Button>
            </Form>
          </div>

          {/* COMPANY INFORMATION SECTION */}
          <div className="bg-white p-6 rounded-lg shadow-sm border-1 border-amber-300">
            <h2 className="font-semibold text-lg text-amber-700 mb-3 flex items-center gap-2">
              <ApartmentOutlined /> Company Information
            </h2>
            <p className="text-amber-600 mb-6">
              Manage your company details
            </p>

            <Form
              layout="vertical"
              form={formCompany}
              initialValues={profile.company}
              autoComplete="off"
              onFinish={(values) => {
                setProfile((prev) => ({
                  ...prev,
                  company: { ...prev.company, ...values },
                }));
              }}
            >
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label="Company Name" name="name">
                    <Input />
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item label="Phone" name="companyPhone">
                    <Input />
                  </Form.Item>
                </Col>

                <Col span={24}>
                  <Form.Item label="Company Address" name="address">
                    <Input.TextArea rows={2} />
                  </Form.Item>
                </Col>

                <Col span={24}>
                  <Form.Item label="Email" name="companyEmail">
                    <Input />
                  </Form.Item>
                </Col>
              </Row>

              <Button
                type="primary"
                htmlType="submit"
                icon={<UploadOutlined />}
                style={{ backgroundColor: "#d97706", borderColor: "#d97706" }}
              >
                Save Company Info
              </Button>
            </Form>
          </div>
        </Col>
      </Row>
    </div>
  );
}
