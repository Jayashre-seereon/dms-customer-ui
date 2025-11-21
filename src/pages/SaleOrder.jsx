import React, { useState } from "react";
import {
  Table,
  Input,
  Button,
  Modal,
  Form,
  Select,
  InputNumber,
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
  DeleteOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import Wallet from "../pages/Wallet"
const salesContractJSON = {
  initialData: [
    {
      key: 1,
      contractNo: "SC-001",
      orderDate: "2025-10-01",
      companyName: "ABC Oils Ltd", 
      customer: "Bhubaneswar Market",
      item: "Mustard Oil",
      qty: 2000,
      uom: "Ltrs",
      location: "Warehouse A",
      status: "Approved",
      freeQty: 100,
      totalQty: 2100,
      rate: 125,
      discountAmt: 100000,
      totalAmt: 250000,
      grossWt: 2100,
      type: "Retail",
      brokerName: "Broker 1",
      depoName: "Depo A",
      totalGrossWt: 1020,
      grossAmount: 67080,
      discountPercent: 5,
      sgstPercent: 5,
      cgstPercent: 5,
      igstPercent: 0,
      sgst: 3186,
      cgst: 3186,
      igst: 0,
      totalGST: 6372,
      tcsAmt: 500,
      saleType: "Local",
      deliveryDate: "2025-10-15", 
      transporter: "Blue Transport",
      vehicleNo: "OD-05-AB-1234",
      driverName: "Rajesh Kumar",
      phoneNo: "9876543210",
      route: "Bhubaneswar to Cuttack",
      billType: "Tax Invoice",
      waybillNo: "WB-001",
      billMode: "Credit",
       itemCode:"code1",
      itemGroup:"G1",
      hsnCode:"hsn1",
      netQty:2,
      grossqty:4,
      cashDiscounrt:20,
      roundOffAmount:340,
      naarration:"narrrr"
     
    },
  ],
  contractOptions: [
    {
      contractNo: "SC-001",
      companyName: "ABC Oils Ltd",
      customer: "Bhubaneswar Market",
      item: "Mustard Oil",
    },
    {
      contractNo: "SC-002",
      companyName: "XYZ Refineries",
      customer: "Cuttack Wholesale",
      item: "Sunflower Oil",
    },
    {
      contractNo: "SC-003",
      companyName: "PQR Traders",
      customer: "Berhampur Dealers",
      item: "Coconut Oil",
    },
  ],
  itemOptions: ["Mustard Oil", "Sunflower Oil", "Coconut Oil"],
  uomOptions: ["Ltrs", "Kg"],
  statusOptions: ["Approved", "Pending", "Rejected"],
  locationOptions: ["Warehouse A", "Warehouse B", "Warehouse C"],
  companyOptions: ["ABC Oils Ltd", "XYZ Refineries", "PQR Traders"],
};

const initialNewRow = {
  contractNo: undefined,
  orderDate: dayjs(),
  companyName: undefined,
  customer: undefined,
  item: undefined,
  qty: 0,
  uom: undefined,
  location: undefined,
  deliveryDate: undefined,
  status: "Pending",
};

export default function SalesOrder() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [editForm] = Form.useForm();
  const [addForm] = Form.useForm();
  const [viewForm] = Form.useForm();
   const [walletOpen, setWalletOpen] = useState(false);
  const [data, setData] = useState(salesContractJSON.initialData);
  const [searchText, setSearchText] = useState("");

  const filteredData = data.filter(
    (item) =>
      item.companyName?.toLowerCase().includes(searchText.toLowerCase()) ||
      item.customer?.toLowerCase().includes(searchText.toLowerCase()) ||
      item.item?.toLowerCase().includes(searchText.toLowerCase()) ||
      item.status?.toLowerCase().includes(searchText.toLowerCase()) ||
      item.contractNo?.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns = [
    {
      title: <span className="text-amber-700 font-semibold">Contract No</span>,
      dataIndex: "contractNo",
      width: 100,
      render: (text) => <span className="text-amber-800">{text}</span>,
    },
    {
      title: <span className="text-amber-700 font-semibold">Company</span>,
      dataIndex: "companyName",
      width: 100,
      render: (text) => <span className="text-amber-800">{text}</span>,
    },
    {
      title: <span className="text-amber-700 font-semibold">Order Date</span>,
      dataIndex: "orderDate",
      width: 100,
      render: (text) => <span className="text-amber-800">{text}</span>,
    },
    {
      title: <span className="text-amber-700 font-semibold">Delivery Date</span>,
      dataIndex: "deliveryDate",
      width: 100,
      render: (text) => <span className="text-amber-800">{text}</span>,
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
      render: (_, record) => (
        <span className="text-amber-800">
          {record.qty} {record.uom}
        </span>
      ),
    },
    {
      title: <span className="text-amber-700 font-semibold">Status</span>,
      dataIndex: "status",
      render: (status) => {
        const base = "px-3 py-1 rounded-full text-sm font-semibold";
        if (status === "Approved")
          return (
            <span className={`${base} bg-green-100 text-green-700`}>
              Approved
            </span>
          );
        if (status === "Pending")
          return (
            <span className={`${base} bg-yellow-100 text-yellow-700`}>
              Pending
            </span>
          );
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
                orderDate: record.orderDate ? dayjs(record.orderDate) : null,
                deliveryDate: record.deliveryDate
                  ? dayjs(record.deliveryDate)
                  : null,
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
                  orderDate: record.orderDate ? dayjs(record.orderDate) : null,
                  deliveryDate: record.deliveryDate
                    ? dayjs(record.deliveryDate)
                    : null,
                });
                setIsEditModalOpen(true);
              }}
            />
          )}
        </div>
      ),
    },
  ];

  const disablePastDates = (current) =>
    current && current < dayjs().startOf("day");

  const handleContractSelect = (contractNo, formListIndex) => {
    const selectedContract = salesContractJSON.contractOptions.find(
      (c) => c.contractNo === contractNo
    );

    if (selectedContract) {
      const currentOrders = addForm.getFieldValue("orders");
      const updatedOrders = currentOrders.map((item, index) =>
        index === formListIndex
          ? {
              ...item,
              contractNo: contractNo,
              companyName: selectedContract.companyName,
              customer: selectedContract.customer, 
              item: selectedContract.item,
              orderDate: dayjs(),
              status: "Pending",
            }
          : item
      );

      addForm.setFieldsValue({
        orders: updatedOrders,
      });
    }
  };

  const handleMultiAddSubmit = (values) => {
    const payload = values.orders.map((r, i) => ({
      ...r,
      key: data.length ? data[data.length - 1].key + i + 1 : i + 1,
      orderDate: r.orderDate.format("YYYY-MM-DD"),
      deliveryDate: dayjs.isDayjs(r.deliveryDate)
        ? r.deliveryDate.format("YYYY-MM-DD")
        : r.deliveryDate,
      status: "Pending",
      uom: r.uom || salesContractJSON.uomOptions[0],
      location: r.location || salesContractJSON.locationOptions[0],
      companyName: r.companyName,
      customer: r.customer,
      item: r.item,
    }));

    setData((prev) => [...prev, ...payload]);
    addForm.resetFields();
    setIsAddModalOpen(false);
  };

  const renderFormListRows = (fields, { add, remove }) =>
    fields.map((field, index) => (
      <div
        key={field.key}
        className="border border-amber-200 rounded-lg p-3 mb-3 relative"
      >
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              {...field}
              name={[field.name, "contractNo"]}
              fieldKey={[field.fieldKey, "contractNo"]}
              label="Contract No"
              rules={[{ required: true, message: "Select Contract" }]}
            >
              <Select
                placeholder="Select Contract"
                onChange={(value) => handleContractSelect(value, index)}
              >
                {salesContractJSON.contractOptions.map((c) => (
                  <Select.Option key={c.contractNo} value={c.contractNo}>
                    {c.contractNo}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              {...field}
              name={[field.name, "orderDate"]}
              fieldKey={[field.fieldKey, "orderDate"]}
              label="Order Date"
              rules={[{ required: true, message: "Order Date is required" }]}
            >
              <DatePicker className="w-full" disabled />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item
              {...field}
              name={[field.name, "companyName"]}
              fieldKey={[field.fieldKey, "companyName"]}
              label="Company"
              rules={[{ required: true, message: "Required" }]}
            >
              <Input placeholder="Company" disabled />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item
              {...field}
              name={[field.name, "customer"]} 
              fieldKey={[field.fieldKey, "customer"]}
              label="Customer Name"
              rules={[{ required: true, message: "Required" }]}
            >
              <Input placeholder="Customer" disabled />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item
              {...field}
              name={[field.name, "item"]}
              fieldKey={[field.fieldKey, "item"]}
              label="Item Name"
              rules={[{ required: true, message: "Required" }]}
            >
              <Input placeholder="Item" disabled />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item
              {...field}
              name={[field.name, "qty"]}
              fieldKey={[field.fieldKey, "qty"]}
              label="Quantity"
              initialValue={1} 
              rules={[{ required: true, message: "Enter Quantity" }]}
            >
              <Input className="w-full" min={1} />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item
              {...field}
              name={[field.name, "uom"]}
              fieldKey={[field.fieldKey, "uom"]}
              label="UOM"
              rules={[{ required: true, message: "Select UOM" }]}
            >
              <Select placeholder="Select UOM">
                {salesContractJSON.uomOptions.map((u, i) => (
                  <Select.Option key={i} value={u}>
                    {u}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item
              {...field}
              name={[field.name, "location"]}
              fieldKey={[field.fieldKey, "location"]}
              label="Location"
              rules={[{ required: true, message: "Select Location" }]}
            >
              <Select placeholder="Select Location">
                {salesContractJSON.locationOptions.map((loc, i) => (
                  <Select.Option key={i} value={loc}>
                    {loc}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item
              {...field}
              name={[field.name, "deliveryDate"]}
              fieldKey={[field.fieldKey, "deliveryDate"]}
              label="Delivery Date"
              rules={[{ required: true, message: "Select Delivery Date" }]}
            >
              <DatePicker
                className="w-full"
                disabledDate={disablePastDates}
              />
            </Form.Item>
          </Col>

          <Form.Item
            {...field}
            name={[field.name, "status"]}
            hidden
            initialValue="Pending"
          />
        </Row>

        {fields.length > 1 && (
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            className="absolute top-2 right-2 text-red-500"
            onClick={() => remove(field.name)}
          >
            Remove
          </Button>
        )}
      </div>
    ));

  function renderBasicFields(disabled = false) {
     return (
      <Row gutter={16}>
        <Col span={8}>
          <Form.Item
            label="Contract No"
            name="contractNo"
            rules={[{ required: true, message: "Select Contract" }]}
          >
            <Select
              placeholder="Select Contract"
              disabled={disabled || selectedRecord?.status === "Approved"}
            >
              {salesContractJSON.contractOptions.map((c) => (
                <Select.Option key={c.contractNo} value={c.contractNo}>
                  {c.contractNo}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            label="Order Date"
            name="orderDate"
            rules={[{ required: true }]}
          >
            <DatePicker className="w-full" disabled />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            label="Company "
            name="companyName"
            rules={[{ required: true }]}
          >
            <Input placeholder="Company" disabled />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            label="Customer Name"
            name="customer" 
            rules={[{ required: true }]}
          >
            <Input placeholder="Customer" disabled />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="Item Name" name="item" rules={[{ required: true }]}>
            <Input placeholder="Item" disabled />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            label="Quantity"
            name="qty"
            rules={[{ required: true, type: "number", min: 1 }]}
          >
            <Input className="w-full" min={1} disabled={disabled} />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="UOM" name="uom" rules={[{ required: true }]}>
            <Select placeholder="Select UOM" disabled={disabled}>
              {salesContractJSON.uomOptions.map((u, i) => (
                <Select.Option key={i} value={u}>
                  {u}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="Location" name="location" rules={[{ required: true }]}>
            <Select placeholder="Select Location" disabled={disabled}>
              {salesContractJSON.locationOptions.map((loc, i) => (
                <Select.Option key={i} value={loc}>
                  {loc}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            label="Delivery Date"
            name="deliveryDate"
            rules={[{ required: true }]}
          >
            <DatePicker
              className="w-full"
              disabled={disabled}
              disabledDate={disablePastDates}
            />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="Status" name="status">
             <Input disabled value={disabled ? selectedRecord?.status : "Pending"} />
          </Form.Item>
        </Col>
      </Row>
    );
  }

  function renderApprovedView() {
    if (!selectedRecord) return null;

    return (
      <div>
        {/* 🔹 Basic Info */}
        <h6 className=" text-amber-500 font-bold text-lg mb-2 mt-4">Basic Info</h6>
        <Row gutter={16}>
          <Col span={6}>
            <Form.Item label="Contract No">
              <Input value={selectedRecord.contractNo} disabled />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="Order Date">
              <Input value={selectedRecord.orderDate} disabled />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="Delivery Date">
              <Input value={selectedRecord.deliveryDate} disabled />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="Company">
              <Input value={selectedRecord.companyName} disabled />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="Customer Name">
              <Input value={selectedRecord.customer} disabled />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="Broker Name">
              <Input value={selectedRecord.brokerName} disabled />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="Depo Name">
              <Input value={selectedRecord.depoName} disabled />
            </Form.Item>
          </Col>
            <Col span={6}><Form.Item label="Naarration"><Input value={selectedRecord?.naarration} disabled /></Form.Item></Col>
            
        </Row>

        {/* 🔹 Item & Quantity Details */}
        <h6 className=" text-amber-500 font-bold text-lg mb-2 mt-4">
          Item & Quantity Details
        </h6>
        <Row gutter={16}>
          <Col span={6}>
            <Form.Item label="Item Name">
              <Input value={selectedRecord.item} disabled />
            </Form.Item>
          </Col>
           <Col span={6}><Form.Item label="Item Code"><Input value={selectedRecord?.itemCode} disabled /></Form.Item></Col>
               <Col span={6}><Form.Item label="Item Group"><Input value={selectedRecord?.itemGroup} disabled /></Form.Item></Col>
               <Col span={6}><Form.Item label="HSN Code"><Input value={selectedRecord?.hsnCode} disabled /></Form.Item></Col>
                
          <Col span={6}>
            <Form.Item label="UOM">
              <Input value={selectedRecord.uom} disabled />
            </Form.Item>
          </Col>
                <Col span={6}><Form.Item label="Net Quantity"><Input value={selectedRecord?.netQty} disabled /></Form.Item></Col>
               <Col span={6}><Form.Item label="Gross Quantity"><Input value={selectedRecord?.grossqty} disabled /></Form.Item></Col>
              
          <Col span={6}>
            <Form.Item label="Qty">
              <Input value={selectedRecord.qty} disabled />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="Free Qty">
              <Input value={selectedRecord.freeQty} disabled />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="Total Qty">
              <Input value={selectedRecord.totalQty} disabled />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="Gross Wt">
              <Input value={selectedRecord.grossWt} disabled />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="Total Gross Wt">
              <Input value={selectedRecord.totalGrossWt} disabled />
            </Form.Item>
          </Col>
        </Row>

        {/* 🔹 Tax & Amount Details */}
        <h6 className=" text-amber-500 font-bold text-lg mb-2 mt-4">
          Tax & Amount Details
        </h6>
        <Row gutter={16}>
          <Col span={6}>
            <Form.Item label="Rate (₹)">
              <Input value={selectedRecord.rate} disabled />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="Discount %">
              <Input value={selectedRecord.discountPercent} disabled />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="Discount Amount (₹)">
              <Input value={selectedRecord.discountAmt} disabled />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="Gross Amount (₹)">
              <Input value={selectedRecord.grossAmount} disabled />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="SGST %">
              <Input value={selectedRecord.sgstPercent} disabled />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="CGST %">
              <Input value={selectedRecord.cgstPercent} disabled />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="IGST %">
              <Input value={selectedRecord.igstPercent} disabled />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="SGST (₹)">
              <Input value={selectedRecord.sgst} disabled />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="CGST (₹)">
              <Input value={selectedRecord.cgst} disabled />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="IGST (₹)">
              <Input value={selectedRecord.igst} disabled />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="Total GST (₹)">
              <Input value={selectedRecord.totalGST} disabled />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="TCS Amount (₹)">
              <Input value={selectedRecord.tcsAmt} disabled />
            </Form.Item>
          </Col>
          <Col span={6}><Form.Item label="Cash Disccount"><Input value={selectedRecord?.cashDiscounrt} disabled /></Form.Item></Col>
                <Col span={6}><Form.Item label="Round Off Amount"><Input value={selectedRecord?.roundOffAmount} disabled /></Form.Item></Col>
                
          <Col span={6}>
            <Form.Item label="Total Amount (₹)">
              <Input value={selectedRecord.totalAmt} disabled />
            </Form.Item>
          </Col>
        </Row>

        {/* 🔹 Transport & Other Details */}
        <h6 className=" text-amber-500 font-bold text-lg mb-2 mt-4">
          Transport & Other Details
        </h6>
        <Row gutter={16}>
          <Col span={6}>
            <Form.Item label="Sale Type">
              <Input value={selectedRecord.saleType} disabled />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="Transporter">
              <Input value={selectedRecord.transporter} disabled />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="Vehicle No">
              <Input value={selectedRecord.vehicleNo} disabled />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="Driver Name">
              <Input value={selectedRecord.driverName} disabled />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="Route">
              <Input value={selectedRecord.route} disabled />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="Phone No">
              <Input value={selectedRecord.phoneNo} disabled />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="Bill Type">
              <Input value={selectedRecord.billType} disabled />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="Waybill No">
              <Input value={selectedRecord.waybillNo} disabled />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="Bill Mode">
              <Input value={selectedRecord.billMode} disabled />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="Status">
              <Input value={selectedRecord.status} disabled />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="Location">
              <Input value={selectedRecord.location} disabled />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="Type">
              <Input value={selectedRecord.type} disabled />
            </Form.Item>
          </Col>
        </Row>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-0">
        <div>
          <h1 className="text-3xl font-bold text-amber-700">Sales Order</h1>
          <p className="text-amber-600">Manage your sales Order easily</p>
        </div>
      </div>

      <div className="flex justify-between items-center mb-2">
        <div className="flex gap-2">
          <Input
            prefix={<SearchOutlined className="text-amber-600!" />}
            placeholder="Search"
             className="w-full sm:w-80! border-amber-300! focus:border-amber-500! rounded-lg"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <Button
            icon={<FilterOutlined />}
            onClick={() => setSearchText("")}
            className="border-amber-400! text-amber-700! hover:bg-amber-100!"
          >
            Reset Search
          </Button>
        </div>
        <div className="flex gap-2">
         
             <Button
            className="border-amber-400! text-amber-700! hover:bg-amber-100!"
            onClick={() => setWalletOpen(true)}
          >
            Wallet
          </Button>
            <Button
            type="primary"
            icon={<PlusOutlined />}
            className="bg-amber-500! hover:bg-amber-600! border-none!"
            onClick={() => {
              addForm.resetFields();
                addForm.setFieldsValue({ orders: [{ ...initialNewRow }] }); 
              setIsAddModalOpen(true);
            }}
          >
            Add New
          </Button>
           <Button
            icon={<DownloadOutlined />}
            className="border-amber-400! text-amber-700! hover:bg-amber-100!"
          >
            Export
          </Button>
        
        </div>
      </div>

      <div className="border border-amber-300 rounded-lg p-4 shadow-md">
        <Table
          columns={columns}
          dataSource={filteredData}
          pagination={false}
          scroll={{ y: 350 }}
        />
      </div>

      <Modal
        title={<span className="text-amber-700 font-semibold">Add Sales Order</span>}
        open={isAddModalOpen}
        onCancel={() => setIsAddModalOpen(false)}
        footer={null}
        width={900}
        destroyOnClose={true} 
      >
        <Form
          layout="vertical"
          form={addForm}
          onFinish={handleMultiAddSubmit}
          initialValues={{ orders: [{ ...initialNewRow }] }}
        >
          <Form.List name="orders">
            {(fields, { add, remove }) => (
              <>
                {renderFormListRows(fields, { add, remove })}
                <div className="flex justify-between mt-3">
                  <Button
                    type="dashed"
                    onClick={() => add(initialNewRow)}
                    className="border-amber-400! text-amber-700! hover:bg-amber-100!"
                    icon={<PlusOutlined />}
                  >
                    Add Row
                  </Button>
                  <Button
                    type="primary"
                    htmlType="submit"
                    className="bg-amber-500! hover:bg-amber-600! border-none!"
                  >
                    Submit All
                  </Button>
                  
                </div>
              </>
            )}
          </Form.List>
        </Form>
      </Modal>
      <Modal
        title={
          <span className="text-amber-700 font-semibold">Edit Sales Order</span>
        }
        open={isEditModalOpen}
        onCancel={() => setIsEditModalOpen(false)}
        footer={null}
        width={800}
        destroyOnClose={true}   >
        <Form
          layout="vertical"
          form={editForm}
          onFinish={(values) => {
            const contractData = salesContractJSON.contractOptions.find(
              (c) => c.contractNo === values.contractNo
            );

            const payload = {
              ...selectedRecord, 
                 ...values,
              orderDate: values.orderDate.format("YYYY-MM-DD"),
              deliveryDate: values.deliveryDate.format("YYYY-MM-DD"),
              status: "Pending", companyName: contractData?.companyName,
              customer: contractData?.customer,
              item: contractData?.item,
            };

            setData((prev) =>
              prev.map((item) =>
                item.key === selectedRecord.key ? { ...item, ...payload } : item
              )
            );
            setIsEditModalOpen(false);
            editForm.resetFields();
          }}
              >
          {renderBasicFields(false)}
          <div className="flex justify-end gap-2 mt-4">
            <Button
              onClick={() => setIsEditModalOpen(false)}
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

        <Modal
        title={
          <span className="text-amber-700 text-2xl font-semibold">
            View Sales Order
          </span>
        }
        open={isViewModalOpen}
        onCancel={() => setIsViewModalOpen(false)}
        footer={null}
        width={900}
        destroyOnClose={true}
      >
        <Form layout="vertical" form={viewForm}>
          {selectedRecord?.status === "Approved"
            ? renderApprovedView()
            : renderBasicFields(true)}
        </Form>
      </Modal>
       <Modal
        open={walletOpen}
        title={<span className="text-3xl font-bold text-amber-700">Wallet</span>}
        footer={null}
        width={1100}
        onCancel={() => setWalletOpen(false)}
      >
        <Wallet/> 
      </Modal>
    </div>
  );
}