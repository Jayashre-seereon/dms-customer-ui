// SalesContract.jsx
import React, { useState } from "react";
import {
  Table,
  Input,
  Button,
  Modal,
  Form,
  Select,
  DatePicker,
  Row,
  Col,
} from "antd";
import {
  SearchOutlined,
  PlusOutlined,
  DownloadOutlined,
  EyeOutlined,
  EditOutlined,
  FilterOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";

const salesContractJSON = {
  initialData: [
    {
      key: 1,
      contractDate: "2025-10-01",
      orderNo:"1",
      companyName: "ABC Oils Ltd",
      customer: "Bhubaneswar Market",
      qty: 2000,
      uom: "Ltrs",
      location: "Warehouse A",
      status: "Approved",
      freeQty: 100,
      totalQty: 2100,
      rate: 125,
      totalAmt: 250000,
      grossWt: 2100,
      type: "Retail",
      brokerName: "Broker 1",
      discountPercent: 5,
      discountAmt: 3354,
      deliveryDate: "2024-03-21",
      depoName: "Bhubaneswar Depo",
      item: "Palm Oil",
      totalGrossWt: 1020,
      grossAmount: 67080,
      sgstPercent: 5,
      cgstPercent: 5,
      igstPercent: 0,
      sgst: 3186,
      cgst: 3186,
      igst: 9,
      totalGST: 6372,
      tcsAmt: 500,
      itemCode:"code1",
      itemGroup:"G1",
      hsnCode:"hsn1",
      netQty:2,
      grossqty:4,
      cust_phone:"4535467576",
      cust_email:"jaay@.com",
      deliveryAddress:"kdp",
      cashDiscounrt:20,
      roundOffAmount:340,
      naarration:"narrrr"
        },
  ],
  itemOptions: ["Mustard Oil", "Sunflower Oil", "Coconut Oil", "Palm Oil",],
  uomOptions: ["Ltrs", "Kg"],
  statusOptions: ["Approved", "Pending", "Rejected"],
  locationOptions: ["Warehouse A", "Warehouse B", "Warehouse C"],
  companyOptions: ["ABC Oils Ltd", "XYZ Refineries", "PQR Traders"],
};

export default function SalesContract() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [data, setData] = useState(salesContractJSON.initialData);
  const [searchText, setSearchText] = useState("");

  const [addForm] = Form.useForm();
  const [editForm] = Form.useForm();
  const [viewForm] = Form.useForm();

  const filteredData = data.filter(
    (item) =>
      item.contractNo?.toLowerCase().includes(searchText.toLowerCase()) ||
      item.companyName?.toLowerCase().includes(searchText.toLowerCase()) ||
      item.customer?.toLowerCase().includes(searchText.toLowerCase()) ||
      item.item?.toLowerCase().includes(searchText.toLowerCase()) ||
      item.status?.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns = [
    {
      title: <span className="text-amber-700 font-semibold">Company</span>,
      dataIndex: "companyName",
      render: (text) => <span className="text-amber-800">{text}</span>,
    },
    {
      title: <span className="text-amber-700 font-semibold">Date</span>,
      dataIndex: "contractDate",
      render: (text) => <span className="text-amber-800">{text}</span>,
    },
    {
      title: <span className="text-amber-700 font-semibold">Delivery Date</span>,
      dataIndex: "deliveryDate",
      render: (text) => <span className="text-amber-800">{text || "—"}</span>,
    },
    {
      title: <span className="text-amber-700 font-semibold">Location</span>,
      dataIndex: "location",
      render: (text) => <span className="text-amber-800">{text}</span>,
    },
    {
      title: <span className="text-amber-700 font-semibold">Customer</span>,
      dataIndex: "customer",
      render: (text) => <span className="text-amber-800">{text}</span>,
    },
    {
      title: <span className="text-amber-700 font-semibold">Item</span>,
      dataIndex: "item",
      render: (text) => <span className="text-amber-800">{text}</span>,
    },
    {
      title: <span className="text-amber-700 font-semibold">Qty</span>,
      render: (_, r) => (
        <span className="text-amber-800">
          {r.qty} {r.uom}
        </span>
      ),
    },
    {
      title: <span className="text-amber-700 font-semibold">Status</span>,
      dataIndex: "status",
      render: (status) => {
        const base = "px-3 py-1 rounded-full text-sm font-semibold";
        if (status === "Approved")
          return <span className={`${base} bg-green-100 text-green-700`}>Approved</span>;
        if (status === "Pending")
          return <span className={`${base} bg-yellow-100 text-yellow-700`}>Pending</span>;
        return <span className={`${base} bg-red-100 text-red-700`}>{status}</span>;
      },
    },
    {
      title: <span className="text-amber-700 font-semibold">Actions</span>,
      render: (record) => (
        <div className="flex gap-3">
          <EyeOutlined
            className="cursor-pointer! text-blue-500!"
            onClick={() => {
              setSelectedRecord(record);
              viewForm.setFieldsValue({
                ...record,
                contractDate: dayjs(record.contractDate),
                deliveryDate: record.deliveryDate ? dayjs(record.deliveryDate) : null,
              });
              setIsViewModalOpen(true);
            }}
          />
          {record.status !== "Approved" && (
            <EditOutlined
              className="cursor-pointer! text-red-500!"
              onClick={() => {
                setSelectedRecord(record);
                editForm.setFieldsValue({
                  ...record,
                  contractDate: dayjs(record.contractDate),
                  deliveryDate: record.deliveryDate ? dayjs(record.deliveryDate) : null,
                });
                setIsEditModalOpen(true);
              }}
            />
          )}
        </div>
      ),
    },
  ];

  const handleFormSubmit = (values, isEdit) => {
    const finalValues = isEdit ? editForm.getFieldsValue() : values;

    const payload = {
      ...finalValues,
      status: finalValues.status || "Pending",
      contractNo:
        selectedRecord?.contractNo ||
        `SC-2025-${String(data.length + 1).padStart(3, "0")}`,
      contractDate: finalValues.contractDate.format("YYYY-MM-DD"),
      deliveryDate: finalValues.deliveryDate
        ? finalValues.deliveryDate.format("YYYY-MM-DD")
        : undefined,
    };

    if (isEdit) {
      setData((prev) =>
        prev.map((item) => (item.key === selectedRecord.key ? { ...payload, key: item.key } : item))
      );
    } else {
      setData((prev) => [...prev, { ...payload, key: prev.length + 1 }]);
    }

    setIsAddModalOpen(false);
    setIsEditModalOpen(false);
    setSelectedRecord(null);
  };

  const renderBasicFields = (formInstance, disabled = false) => (
     <Row gutter={16}>
      <Col span={8}>
        <Form.Item
          name="contractDate"
          label="Contract Date"
          rules={[{ required: true, message: "Please select contract date" }]}
        >
          <DatePicker
            format="DD-MM-YYYY"
            style={{ width: "100%" }}
            disabled={true}
            disabledDate={() => true}
          />
        </Form.Item>
      </Col>

      <Col span={8}>
        <Form.Item
          label="Delivery Date"
          name="deliveryDate"
          rules={[
            { required: true, message: "Please select Delivery Date" },
            {
              validator(_, value) {
                const today = dayjs().startOf("day");
                if (value && value.isBefore(today)) {
                  return Promise.reject(new Error("Delivery Date cannot be before today"));
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          <DatePicker
            className="w-full"
            disabled={disabled}
            disabledDate={(current) => current && current.isBefore(dayjs().startOf("day"))}
          />
        </Form.Item>
      </Col>

      <Col span={8}>
        <Form.Item label="Company " name="companyName" rules={[{ required: true, message: "Please select Company" }]}>
          <Select placeholder="Select Company" disabled={disabled}>
            {salesContractJSON.companyOptions.map((c) => (
              <Select.Option key={c} value={c}>
                {c}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Col>

      <Col span={8}>
        <Form.Item label="Customer Name" name="customer" rules={[{ required: true, message: "Please enter Customer Name" }]}>
          <Input placeholder="Enter Customer Name" disabled={disabled} />
        </Form.Item>
      </Col>

      <Col span={8}>
        <Form.Item label="Item Name" name="item" rules={[{ required: true, message: "Please select Item" }]}>
          <Select placeholder="Select Item" disabled={disabled}>
            {salesContractJSON.itemOptions.map((item) => (
              <Select.Option key={item} value={item}>
                {item}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Col>

      <Col span={8}>
        <Form.Item label="Quantity" name="qty" rules={[{ required: true, message: "Please enter Quantity" }]}>
          <Input className="w-full" disabled={disabled} min={0} placeholder="0" />
        </Form.Item>
      </Col>

      <Col span={8}>
        <Form.Item label="UOM" name="uom" rules={[{ required: true, message: "Please select UOM" }]}>
          <Select placeholder="Select UOM" disabled={disabled}>
            {salesContractJSON.uomOptions.map((u) => (
              <Select.Option key={u} value={u}>
                {u}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Col>

      <Col span={8}>
        <Form.Item label="Location" name="location" rules={[{ required: true, message: "Please select Location" }]}>
          <Select placeholder="Select Location" disabled={disabled}>
            {salesContractJSON.locationOptions.map((loc) => (
              <Select.Option key={loc} value={loc}>
                {loc}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Col>

      <Col span={8}>
        <Form.Item label="Status" name="status">
          <Select disabled placeholder="Pending">
            {salesContractJSON.statusOptions.map((s) => (
              <Select.Option key={s} value={s}>
                {s}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Col>
    </Row>
  );

const renderApprovedView = () => (
  <div>
    <h3 className="text-xl font-semibold text-amber-600 mb-4">Contract & Party Details</h3>
    <Row gutter={16}>
      <Col span={6}><Form.Item label="Contract Date"><Input value={selectedRecord?.contractDate} disabled /></Form.Item></Col>
      <Col span={6}><Form.Item label="Delivery Date"><Input value={selectedRecord?.deliveryDate} disabled /></Form.Item></Col>
      <Col span={6}><Form.Item label="Company"><Input value={selectedRecord?.companyName} disabled /></Form.Item></Col>
      <Col span={6}><Form.Item label="Customer Name"><Input value={selectedRecord?.customer} disabled /></Form.Item></Col>
       <Col span={6}><Form.Item label="Customer Phone"><Input value={selectedRecord?.cust_phone} disabled /></Form.Item></Col>
      <Col span={6}><Form.Item label="Customer Email"><Input value={selectedRecord?.cust_email} disabled /></Form.Item></Col>
      <Col span={6}><Form.Item label="Depo"><Input value={selectedRecord?.depoName} disabled /></Form.Item></Col>
      <Col span={6}><Form.Item label="Location"><Input value={selectedRecord?.location} disabled /></Form.Item></Col>
      <Col span={6}><Form.Item label="Broker"><Input value={selectedRecord?.brokerName} disabled /></Form.Item></Col>
      <Col span={6}><Form.Item label="Type"><Input value={selectedRecord?.type} disabled /></Form.Item></Col>
       <Col span={6}><Form.Item label="Delivery Address"><Input value={selectedRecord?.deliveryAddress} disabled /></Form.Item></Col>
      <Col span={6}><Form.Item label="Status"><Input value={selectedRecord?.status} disabled /></Form.Item></Col>
       <Col span={6}><Form.Item label="Naarration"><Input value={selectedRecord?.naarration} disabled /></Form.Item></Col>
  
    </Row>
    <h3 className="text-xl font-semibold text-amber-600 my-4">Item & Quantity Details</h3>
    <Row gutter={16}>
      <Col span={6}><Form.Item label="Item Name"><Input value={selectedRecord?.item} disabled /></Form.Item></Col>
      <Col span={6}><Form.Item label="Item Code"><Input value={selectedRecord?.itemCode} disabled /></Form.Item></Col>
     <Col span={6}><Form.Item label="Item Group"><Input value={selectedRecord?.itemGroup} disabled /></Form.Item></Col>
     <Col span={6}><Form.Item label="HSN Code"><Input value={selectedRecord?.hsnCode} disabled /></Form.Item></Col>
      <Col span={6}><Form.Item label="Net Quantity"><Input value={selectedRecord?.netQty} disabled /></Form.Item></Col>
     <Col span={6}><Form.Item label="Gross Quantity"><Input value={selectedRecord?.grossqty} disabled /></Form.Item></Col>
      <Col span={6}><Form.Item label="Quantity"><Input value={selectedRecord?.qty} disabled /></Form.Item></Col>
      <Col span={6}><Form.Item label="Free Qty"><Input value={selectedRecord?.freeQty} disabled /></Form.Item></Col>
      <Col span={6}><Form.Item label="Total Qty"><Input value={selectedRecord?.totalQty} disabled /></Form.Item></Col>
      <Col span={6}><Form.Item label="UOM"><Input value={selectedRecord?.uom} disabled /></Form.Item></Col>
      <Col span={6}><Form.Item label="Total Gross Wt"><Input value={selectedRecord?.totalGrossWt} disabled /></Form.Item></Col>
      <Col span={6}><Form.Item label="Gross Wt"><Input value={selectedRecord?.grossWt} disabled /></Form.Item></Col>
      
    </Row>
    <h3 className="text-xl font-semibold text-amber-600 my-4">Pricing & Tax Details</h3>
    <Row gutter={16}>
      <Col span={6}><Form.Item label="Rate"><Input value={selectedRecord?.rate} disabled /></Form.Item></Col>
       <Col span={6}><Form.Item label="Gross Amount"><Input value={selectedRecord?.grossAmount} disabled /></Form.Item></Col>
      <Col span={6}><Form.Item label="Discount %"><Input value={selectedRecord?.discountPercent} disabled /></Form.Item></Col>
      <Col span={6}><Form.Item label="Discount Amount"><Input value={selectedRecord?.discountAmt} disabled /></Form.Item></Col>
      <Col span={6}><Form.Item label="SGST %"><Input value={selectedRecord?.sgstPercent} disabled /></Form.Item></Col>
      <Col span={6}><Form.Item label="CGST %"><Input value={selectedRecord?.cgstPercent} disabled /></Form.Item></Col>
      <Col span={6}><Form.Item label="IGST %"><Input value={selectedRecord?.igstPercent} disabled /></Form.Item></Col>
      <Col span={6}><Form.Item label="SGST"><Input value={selectedRecord?.sgst} disabled /></Form.Item></Col>
      <Col span={6}><Form.Item label="CGST"><Input value={selectedRecord?.cgst} disabled /></Form.Item></Col>
      <Col span={6}><Form.Item label="IGST"><Input value={selectedRecord?.igst} disabled /></Form.Item></Col>
      <Col span={6}><Form.Item label="Total GST"><Input value={selectedRecord?.totalGST} disabled /></Form.Item></Col>
       <Col span={6}><Form.Item label="TCS Amount"><Input value={selectedRecord?.tcsAmt} disabled /></Form.Item></Col>
      <Col span={6}><Form.Item label="Cash Disccount"><Input value={selectedRecord?.cashDiscounrt} disabled /></Form.Item></Col>
      <Col span={6}><Form.Item label="Round Off Amount"><Input value={selectedRecord?.roundOffAmount} disabled /></Form.Item></Col>
      <Col span={6}><Form.Item label="Total Amount"><Input value={selectedRecord?.totalAmt} disabled /></Form.Item></Col>
    </Row>
  </div>
);


  return (
    <div>
      <div className="flex justify-between items-center mb-0">
        <div>
          <h1 className="text-3xl font-bold text-amber-700">Sales Contract</h1>
          <p className="text-amber-600">Manage your sales contracts easily</p>
        </div>
      </div>
      <div className="flex justify-between items-center mb-2">
        <div className="flex gap-2">
          <Input
            prefix={<SearchOutlined className="text-amber-600!" />}
            placeholder="Search"
            className="w-64! border-amber-300! focus:border-amber-500!"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <Button
            icon={<FilterOutlined />}
            onClick={() => setSearchText("")}
            className="border-amber-400! text-amber-700! hover:bg-amber-100!"
          >
            Reset
          </Button>
        </div>

        <div className="flex gap-2">
          <Button
            icon={<DownloadOutlined />}
            className="border-amber-400! text-amber-700! hover:bg-amber-100!"
          >
            Export
          </Button>

          <Button
            type="primary"
            icon={<PlusOutlined />}
            className="bg-amber-500! hover:bg-amber-600! border-none!"
            onClick={() => {
              addForm.resetFields();
              addForm.setFieldsValue({ contractDate: dayjs(), status: "Pending" });
              setSelectedRecord(null);
              setIsAddModalOpen(true);
            }}
          >
            Add New
          </Button>
        </div>
      </div>

      <div className="border border-amber-300 rounded-lg p-4 shadow-md">
        <Table
          columns={columns}
          dataSource={filteredData}
          pagination={false}
          scroll={{ y: 350 }}
          rowKey="key"
        />
      </div>
      <Modal
        title={
          <span className="text-amber-700 font-semibold">
            Add Sales Contract
          </span>
        }
        open={isAddModalOpen}
        onCancel={() => {
          setIsAddModalOpen(false);
        }}
        footer={null}
        width={800}
      >
        <Form layout="vertical" form={addForm} onFinish={(values) => handleFormSubmit(values, false)}>
          {renderBasicFields(addForm, false)}
          <div className="flex justify-end gap-2 mt-4">
            <Button
              onClick={() => {
                setIsAddModalOpen(false);
              }}
              className="border-amber-400! text-amber-700! hover:bg-amber-100!"
            >
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              className="bg-amber-500! hover:bg-amber-600! border-none!"
            >
              Add
            </Button>
          </div>
        </Form>
      </Modal>

      {/* 2. Edit Modal (Uses editForm) */}
      <Modal
        title={
          <span className="text-amber-700 font-semibold">
            Edit Sales Contract
          </span>
        }
        open={isEditModalOpen}
        onCancel={() => {
          setIsEditModalOpen(false);
        }}
        footer={null}
        width={800}
       >
        <Form layout="vertical" form={editForm} onFinish={() => editForm.validateFields().then(() => handleFormSubmit(null, true))}>
          {renderBasicFields(editForm, false)}
          <div className="flex justify-end gap-2 mt-4">
            <Button
              onClick={() => {
                setIsEditModalOpen(false);
              }}
              className="border-amber-400! text-amber-700! hover:bg-amber-100!"
            >
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              className="bg-amber-500! hover:bg-amber-600! border-none!"
            >
              Update
            </Button>
          </div>
        </Form>
      </Modal>


      {/* 3. View Modal (Uses viewForm) */}
      <Modal
        title={<span className="text-amber-700 text-3xl font-semibold">View Contract</span>}
        open={isViewModalOpen}
        onCancel={() => {
          setIsViewModalOpen(false);
        }}
        footer={null}
        width={1000}
      >
       
        <Form layout="vertical" form={viewForm}>
          {selectedRecord?.status === "Approved"
            ? renderApprovedView()
            : renderBasicFields(viewForm, true)}
        </Form>
      </Modal>
    </div>
  );
} 