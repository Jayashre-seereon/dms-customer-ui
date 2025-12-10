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
    id: "EMP12345",
    firstName: "Rajesh",
    lastName: "Kumar",
    email: "rajesh.kumar@ruchisoya.com",
    phone: "+91 9876543210",
    address: "Bhubaneswar, Odisha, India",
    broker_associate: "N/A",
    department: "IT Department",
    avatarInitials: "RK",
  },
  company: {
    name: "Ruchi Soya Industries Ltd.",
    companyPhone: "9876543210",
    companyEmail: "rajesh.kumar@ruchisoya.com",
    state: "Odisha",
    country: "India",
    city: "Bhubaneswar",
    pin: "751010",
    address: "Plot No. 15, Industrial Estate, Bhubaneswar, Odisha 751010",
    gst_in: "21AAACR1234Q1ZV",
    tin: "1234567890",
    license_no: "LIC1234567890",
    fassai_no: "FSSAI1234567890",
    pan_no: "AAACR1234Q",
    billing_type: "online",
    adhhar_no: "1234 5678 9012",
    tdc_applicable: "Yes",
  },
};

export default function ProfileSettings() {
  const [formPersonal] = Form.useForm();
  const [formCompany] = Form.useForm();
  const [profile, setProfile] = useState(profileData);

  return (
    <div>
      <h1 className="text-3xl font-bold text-amber-700 mb-2">Profile Settings</h1>
      <p className="text-amber-600 mb-6">
        Manage your account settings and preferences
      </p>

      <Row gutter={24}>
        {/* LEFT COLUMN */}
        <Col span={10}>
          {/* PERSONAL INFO */}
          <div className="bg-white p-6 rounded-lg shadow-sm border-1 border-amber-300">
            <h2 className="font-semibold text-lg text-amber-700 mb-3 flex items-center gap-2">
              <UserOutlined /> Personal Information
            </h2>
            <p className="text-amber-600 mb-6">Update your personal details</p>

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
                    <Button
                      danger
                      className="!mt-6 hover:bg-red-500 hover:text-white"
                    >
                      Remove
                    </Button>
                  </Col>
                </Row>
                <p className="text-amber-500 text-sm mt-2">
                  Upload JPG/PNG/GIF – Max size 2MB.
                </p>
              </Col>
            </Row>

            {/* PERSONAL FORM */}
            <Form
              layout="vertical"
              form={formPersonal}
              initialValues={profile.personalInfo}
              onFinish={(values) =>
                setProfile((prev) => ({
                  ...prev,
                  personalInfo: { ...prev.personalInfo, ...values },
                }))
              }
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
              
              <Form.Item name="address" label="Address">
                <Input.TextArea rows={2} />
              </Form.Item>
              <Row gutter={16}>

                  <Col span={12}>
              <Form.Item name="broker_associate" label="Broker Associate">
                <Input />
              </Form.Item></Col>
              
                <Col span={12}>
                  <Form.Item name="department" label="Department">
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
                Save Changes
              </Button>
            </Form>
          </div>


        </Col>

        {/* RIGHT COLUMN – COMPANY INFO */}
        <Col span={14}>
          <div className="bg-white p-6 rounded-lg shadow-sm border-1 border-amber-300">
            <h2 className="font-semibold text-lg text-amber-700 mb-3 flex items-center gap-2">
              <ApartmentOutlined /> Company Information
            </h2>
            <p className="text-amber-600 mb-6">Manage your company details</p>

            <Form
              layout="vertical"
              form={formCompany}
              initialValues={profile.company}
              onFinish={(values) =>
                setProfile((prev) => ({
                  ...prev,
                  company: { ...prev.company, ...values },
                }))
              }
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

                <Col span={8}>
                  <Form.Item label="Email" name="companyEmail">
                    <Input />
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item label="Country" name="country">
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="State" name="state">
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="City" name="city">
                    <Input />
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item label="PIN" name="pin">
                    <Input />
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item label="GST IN" name="gst_in">
                    <Input />
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item label="TIN" name="tin">
                    <Input />
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item label="License No" name="license_no">
                    <Input />
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item label="FSSAI No" name="fassai_no">
                    <Input />
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item label="PAN No" name="pan_no">
                    <Input />
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item label="Adhaar No" name="adhhar_no">
                    <Input />
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item label="TDC Applicable" name="tdc_applicable">
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
