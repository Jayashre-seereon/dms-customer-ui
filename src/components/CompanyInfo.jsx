// src/components/CompanyInfoModal.jsx
import { Modal, Form, Input, Row, Col, Button, Select } from "antd";
import { PlusOutlined, CloseCircleOutlined } from "@ant-design/icons";

export default function CompanyInfoModal({ open, onClose, onSave }) {
  const [form] = Form.useForm();

  const saveCompanies = () => {
    form.validateFields().then((values) => {
      onSave(values.companyList);   // return all companies
      form.resetFields();
      onClose();
    });
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      onOk={saveCompanies}
      okText="Save Companies"
      title={<span className="text-amber-700 font-semibold text-lg">Company Information</span> }
      width={1000}
    >
      <Form form={form} layout="vertical">
        <Form.List name="companyList" initialValue={[{}]}>
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name }) => (
                <div key={key} className="border border-amber-200 p-4 rounded-xl mb-4 bg-amber-50">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-amber-700 font-semibold">Company {name + 1}</h3>

                    {fields.length > 1 && (
                      <Button
                        type="text"
                        danger
                        icon={<CloseCircleOutlined />}
                        onClick={() => remove(name)}
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                    <Row gutter={24}>
                      <Col span={6}>   
                  <Form.Item label="Company Name" name={[name, "name"]} rules={[{ required: true }]}>
                    <Input />
                  </Form.Item>
</Col>
<Col span={6}>
                      <Form.Item label="Phone" name={[name, "companyPhone"]} rules={[{ required: true }]}>
                        <Input />
                      </Form.Item>
                    </Col>
                    <Col span={6}>
                      <Form.Item label="Email" name={[name, "companyEmail"]} rules={[{ required: true, type: "email" }]}>
                        <Input />
                      </Form.Item>
                    </Col>
                     <Col span={6}>
                      <Form.Item label="State" name={[name, "state"]}>
                        <Input />
                      </Form.Item>
                    </Col>
                  </Row>
                  

                  <Row gutter={24}>
                   

                    <Col span={6}>
                      <Form.Item label="City" name={[name, "city"]}>
                        <Input />
                      </Form.Item>
                    </Col>
                     <Col span={6}>
                      <Form.Item label="Country" name={[name, "country"]}>
                        <Input />
                      </Form.Item>
                    </Col>
                    <Col span={6}>
                      <Form.Item label="PIN" name={[name, "pin"]}>
                        <Input />
                      </Form.Item>
                    </Col>
                      <Col span={6}>
                  <Form.Item label="TDC Applicable" name={[name, "tdc_applicable"]}>
                    <Select
                      options={[
                        { label: "Yes", value: "Yes" },
                        { label: "No", value: "No" },
                      ]}
                    />
                  </Form.Item>
                    </Col>
                  </Row>

                  <Row gutter={24}>
                    

                    
                  
                     <Col span={6}>
                      <Form.Item label="GST IN" name={[name, "gst_in"]}>
                        <Input />
                      </Form.Item>
                    </Col>
                    
                    <Col span={6}>
                      <Form.Item label="TIN" name={[name, "tin"]}>
                        <Input />
                      </Form.Item>
                    </Col>
                       <Col span={6}>
                     <Form.Item label="License No" name={[name, "license_no"]}>
                    <Input />
                  </Form.Item>
                    </Col>
                    <Col span={6}>
                     <Form.Item label="FASSAI No" name={[name, "fassai_no"]}>
                    <Input />
                  </Form.Item>
                    </Col>
                     <Col span={6}>
                  <Form.Item label="Billing Type" name={[name, "billing_type"]}>
                    <Select
                      options={[
                        { label: "Online", value: "online" },
                        { label: "Offline", value: "offline" },
                      ]}
                    />
                  </Form.Item>
                    </Col>
                    <Col span={6}>
                     <Form.Item label="Aadhaar No" name={[name, "adhhar_no"]}>
                    <Input />
                  </Form.Item>

                  </Col>
                      <Col span={6}>  
                  <Form.Item label="PAN No" name={[name, "pan_no"]}>
                    <Input />
                  </Form.Item>
                    </Col>
                 <Col span={6}>
                     <Form.Item label="Address" name={[name, "address"]}>
                    <Input.TextArea rows={2} />
                  </Form.Item>
                    </Col>
                  </Row>

                  


                
                  
                </div>
              ))}

              <Button
                type="dashed"
                block
                icon={<PlusOutlined />}
                onClick={() => add({})}
                className="text-amber-700! border-amber-300!"
              >
                Add More Company
              </Button>
            </>
          )}
        </Form.List>
      </Form>
    </Modal>
  );
}
