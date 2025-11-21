// ProfileSettings.jsx
import React, { useState } from "react";
import { Form, Input, Button, Upload, Switch, Col, Row } from "antd";
import {
  UserOutlined,
  BellOutlined,
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
  notifications: {
    email: true,
    push: true,
    sms: false,
    reports: true,
  },
  security: {
    twoFactor: true,
    loginAlerts: false,
    sessionTimeout: 30,
  },
  company: {
    name: "Ruchi Soya Industries Ltd.",
    address: "Plot No. 15, Industrial Estate, Bhubaneswar, Odisha 751010",
     companyPhone:" 9876543210",
    companyEmail: "rajesh.kumar@ruchisoya.com",
  },
};

export default function ProfileSettings() {
  const [form] = Form.useForm();
  const [profile, setProfile] = useState(profileData);

  return (
    <div>
      <h1 className="text-3xl font-bold text-amber-700">Profile Settings</h1>
      <p className="text-amber-600 mb-4">
        Manage your account settings and preferences
      </p>

      {/* MAIN 2 COLUMN LAYOUT */}
      <Row gutter={24}>
        {/* LEFT COLUMN — PERSONAL INFO — 30% */}
        <Col span={10}>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h2 className="font-semibold text-lg text-amber-700 mb-1 flex items-center gap-2">
              <UserOutlined /> Personal Information
            </h2>
            <p className="text-amber-600 mb-4">Update your personal details</p>

            {/* Avatar */}
           <Row gutter={20} align="middle" className="p-6 bg-white rounded-xl shadow-sm mb-4">
  {/* Avatar Circle */}
  <Col>
    <div className="w-20 h-20 flex items-center justify-center rounded-full bg-amber-200 text-xl font-semibold text-amber-800 shadow">
      {profile.personalInfo.avatarInitials}
    </div>
  </Col>

  {/* Upload + Remove Buttons */}
  <Col flex="1" >
    <Row gutter={[10, 10]}>
      <Col>
        <Upload showUploadList={false}>
          <Button
            type="default"
            className="border-amber-500! text-amber-700! mt-6!  hover:bg-amber-500! hover:text-white!"
          >
            Change Photo
          </Button>
        </Upload>
      </Col>

      <Col>
        <Button danger className="hover:bg-red-500! mt-6! hover:text-white!">
          Remove
        </Button>
      </Col>
    </Row>

    <p className="text-amber-500 text-sm mt-2!">
      Upload JPG/PNG/GIF – Max size 2MB.
    </p>
  </Col>
</Row>


            {/* Personal Info Form */}
           <Form
  layout="vertical"
  form={form}
  initialValues={profile.personalInfo}
>
  {/* Row 1 */}
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

  {/* Row 2 */}
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

  {/* Row 3 */}
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

  {/* Full width bio */}
  <Row>
    <Col span={24}>
      <Form.Item name="bio" label="Bio">
        <Input.TextArea rows={3} />
      </Form.Item>
    </Col>
  </Row>

  {/* Button */}
  <Button
    type="primary"
    icon={<UploadOutlined />}
    style={{ backgroundColor: "#d97706", borderColor: "#d97706" }}
  >
    Save Changes
  </Button>
</Form>

          </div>
        </Col>

        {/* RIGHT COLUMN — 70% */}
        <Col span={14}>
          {/* NOTIFICATIONS + SECURITY IN ONE ROW */}
          <Row gutter={24}>
            {/* NOTIFICATIONS — 50% */}
            <Col span={12}>
              <div className="bg-white p-4 rounded-lg shadow-sm h-full">
                <h2 className="font-semibold text-lg text-amber-700 mb-1 flex items-center gap-2">
                  <BellOutlined /> Notifications
                </h2>
                <p className="text-amber-600 mb-4">
                  Choose how you want to receive alerts
                </p>

                {[
                  {
                    label: "Email Notifications",
                    desc: "Important updates via email",
                    value: profile.notifications.email,
                  },
                  {
                    label: "Push Notifications",
                    desc: "Instant alerts on your device",
                    value: profile.notifications.push,
                  },
                  {
                    label: "SMS Notifications",
                    desc: "Receive text messages",
                    value: profile.notifications.sms,
                  },
                  {
                    label: "Report Notifications",
                    desc: "Weekly/monthly reports",
                    value: profile.notifications.reports,
                  },
                ].map((item, i) => (
                  <Row key={i} justify="space-between" className="mb-4">
                    <Col>
                      <div className="font-semibold text-amber-700">{item.label}</div>
                      <div className="text-amber-600 text-sm">{item.desc}</div>
                    </Col>
                    <Col>
                      <Switch defaultChecked={item.value} />
                    </Col>
                  </Row>
                ))}

                <Button
                  type="primary"
                  icon={<UploadOutlined />}
                  style={{ backgroundColor: "#d97706", borderColor: "#d97706" }}
                >
                  Save Preferences
                </Button>
              </div>
            </Col>

            {/* SECURITY — 50% */}
            <Col span={12}>
              <div className="bg-white p-4 rounded-lg shadow-sm h-full">
                <h2 className="font-semibold text-lg text-amber-700 mb-1 flex items-center gap-2">
                  <SafetyOutlined /> Security
                </h2>
                <p className="text-amber-600 mb-4">
                  Manage your account security
                </p>

                {/* Two Factor */}
                <Row justify="space-between" className="mb-4">
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

                {/* Login Alerts */}
                <Row justify="space-between" className="mb-4">
                  <Col>
                    <div className="font-semibold text-amber-700">Login Alerts</div>
                    <div className="text-amber-600 text-sm">
                      Notify on new login attempts
                    </div>
                  </Col>
                  <Col>
                    <Switch defaultChecked={profile.security.loginAlerts} />
                  </Col>
                </Row>

                {/* Session Timeout */}
                <Form layout="vertical">
                  <Form.Item
                    label="Session Timeout (minutes)"
                    name="sessionTimeout"
                    initialValue={profile.security.sessionTimeout}
                  >
                    <Input type="number" className="w-32" />
                  </Form.Item>
                </Form>

                <Button
                  type="primary"
                  icon={<UploadOutlined />}
                  style={{ backgroundColor: "#d97706", borderColor: "#d97706" }}
                >
                  Save Security Settings
                </Button>
              </div>
            </Col>
          </Row>

          {/* COMPANY SECTION (full width) */}
          <Row className="mt-4">
            <Col span={24}>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h2 className="font-semibold text-lg text-amber-700 mb-1 flex items-center gap-2">
                  <ApartmentOutlined /> Company Information
                </h2>
                <p className="text-amber-600 mb-4">
                  Manage your company details
                </p>

               <Form layout="vertical" initialValues={profile.company}>
  {/* Row 1 */}
  <Row gutter={16}>
    <Col span={12}>
      <Form.Item label="Company Name" name="name">
        <Input />
      </Form.Item>
    </Col>
    <Col span={12}>
      <Form.Item label="Phone" name="companyPhone">
        <Input rows={2} />
      </Form.Item>
    </Col>
     <Col span={12}>
      <Form.Item label="Company Address" name="address">
        <Input.TextArea rows={2} />
      </Form.Item>
    </Col>
    <Col span={12}>
      <Form.Item label="Email" name="companyEmail">
        <Input rows={2} />
      </Form.Item>
    </Col>

  </Row>

  {/* Button */}
  <Button
    type="primary"
    icon={<UploadOutlined />}
    style={{ backgroundColor: "#d97706", borderColor: "#d97706" }}
  >
    Save Company Info
  </Button>
</Form>

              </div>
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
}
