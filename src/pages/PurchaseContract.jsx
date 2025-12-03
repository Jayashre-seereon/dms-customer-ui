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
  Space,
  Divider,
} from "antd";
import {
  SearchOutlined,
  PlusOutlined,
  DownloadOutlined,
  EyeOutlined,
  EditOutlined,
  FilterOutlined,
  MinusCircleOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";

const salesContractJSON = {
  initialData: [
    {
      key: 1,
      contractDate: "2025-10-01",
      startDate: "2025-10-05",
      endDate: "2025-10-31",
      orderNo: "1",
      companyName: "ABC Oils Ltd",
      customer: "Bhubaneswar Market",
      items: [
        { item: "Palm Oil", itemCode:"it23", qty: 2000, uom: "Ltrs", rate: 125, freeQty: 100 },
      ],
      totalQty: 2000,
      uom: "Ltrs",
      location: "Warehouse A",
      status: "Approved",
      totalAmt: 250000,
      grossWt: 2100,
      type: "Retail",
      brokerName: "Broker 1",
      discountPercent: 5,
      discountAmt: 3354,
      deliveryDate: "2024-03-21",
      depoName: "Bhubaneswar Depo",
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
      itemCode: "code1",
      itemGroup: "G1",
      hsnCode: "hsn1",
      netQty: 2,
      grossqty: 4,
      cust_phone: "4535467576",
      cust_email: "jaay@.com",
      deliveryAddress: "kdp",
      cashDiscounrt: 20,
      roundOffAmount: 340,
      naarration: "narrrr",
    },
  ],
  itemOptions: ["Mustard Oil", "Sunflower Oil", "Coconut Oil", "Palm Oil"],
  uomOptions: ["Ltrs", "Kg"],
  statusOptions: ["Approved", "Pending", "Rejected"],
  locationOptions: ["Warehouse A", "Warehouse B", "Warehouse C"],
  companyOptions: ["ABC Oils Ltd", "XYZ Refineries", "PQR Traders"],
};

export default function PurchaseContract() {
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
      (item.items || [])
        .map((it) => it.item?.toLowerCase())
        .join(" ")
        .includes(searchText.toLowerCase()) ||
      item.status?.toLowerCase().includes(searchText.toLowerCase())
  );

  const calculateTotals = (items) => {
    if (!items || items.length === 0) return { totalQty: 0, uom: "" };
    const uomSet = new Set(items.map((i) => i.uom));
    const totalQty = items.reduce((s, it) => s + Number(it.qty || 0), 0);
    return { totalQty, uom: uomSet.size === 1 ? items[0].uom : "" };
  };

  const columns = [
    {
      title: <span className="text-amber-700 font-semibold">Company</span>,
      dataIndex: "companyName",
      render: (text) => <span className="text-amber-800">{text}</span>,
    },
    {
      title: <span className="text-amber-700 font-semibold">Contract Date</span>,
      dataIndex: "contractDate",
      render: (text) => <span className="text-amber-800">{text}</span>,
    },
    {
      title: <span className="text-amber-700 font-semibold">Start - End</span>,
      render: (_, r) => (
        <span className="text-amber-800">
          {r.startDate ? dayjs(r.startDate).format("DD-MM-YYYY") : "—"} {" - "}
          {r.endDate ? dayjs(r.endDate).format("DD-MM-YYYY") : "—"}
        </span>
      ),
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
      title: <span className="text-amber-700 font-semibold">Items</span>,
      render: (_, r) => {
        const short = (r.items || [])
          .slice(0, 2)
          .map((it) => `${it.item} (${it.qty}${it.uom ? ` ${it.uom}` : ""})`)
          .join(", ");
        return (
          <div className="text-amber-800">
            {short}
            {(r.items || []).length > 2 && <span>, ...</span>}
            <div className="text-xs text-amber-600">{(r.items || []).length} item(s)</div>
          </div>
        );
      },
    },
    {
      title: <span className="text-amber-700 font-semibold">Total Qty</span>,
      render: (_, r) => {
        const totals = calculateTotals(r.items);
        return (
          <span className="text-amber-800">
            {totals.totalQty} {totals.uom}
          </span>
        );
      },
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
                contractDate: record.contractDate ? dayjs(record.contractDate) : undefined,
                startDate: record.startDate ? dayjs(record.startDate) : undefined,
                endDate: record.endDate ? dayjs(record.endDate) : undefined,
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
                  contractDate: record.contractDate ? dayjs(record.contractDate) : undefined,
                  startDate: record.startDate ? dayjs(record.startDate) : undefined,
                  endDate: record.endDate ? dayjs(record.endDate) : undefined,
                  deliveryDate: record.deliveryDate ? dayjs(record.deliveryDate) : null,
                  items: record.items || [],
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
    const finalValues = values || (isEdit ? editForm.getFieldsValue() : addForm.getFieldsValue());
    const items = finalValues.items && finalValues.items.length > 0 ? finalValues.items : [];

    const totals = calculateTotals(items);

    const payload = {
      ...finalValues,
      items,
      totalQty: totals.totalQty,
      uom: totals.uom,
      status: finalValues.status || "Pending",
      contractNo:
        selectedRecord?.contractNo ||
        `SC-2025-${String(data.length + 1).padStart(3, "0")}`,
      contractDate: finalValues.contractDate
        ? finalValues.contractDate.format("YYYY-MM-DD")
        : undefined,
      startDate: finalValues.startDate ? finalValues.startDate.format("YYYY-MM-DD") : undefined,
      endDate: finalValues.endDate ? finalValues.endDate.format("YYYY-MM-DD") : undefined,
      deliveryDate: finalValues.deliveryDate
        ? finalValues.deliveryDate.format("YYYY-MM-DD")
        : undefined,
    };

    if (isEdit) {
      setData((prev) =>
        prev.map((item) =>
          item.key === selectedRecord.key ? { ...item, ...payload, key: item.key } : item
        )
      );
    } else {
      setData((prev) => [...prev, { ...payload, key: prev.length + 1 }]);
    }

    setIsAddModalOpen(false);
    setIsEditModalOpen(false);
    setSelectedRecord(null);
  };

  const renderBasicFields = (formInstance, disabled = false) => (
   <div className="border! p-2! rounded! mb-2! border-amber-300! relative!">
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
          name="startDate"
          label="Start Date"
          rules={[{ required: true, message: "Please select Start Date" }]}
        >
          <DatePicker
            className="w-full"
            disabled={disabled}
            disabledDate={(current) => current && current.isBefore(dayjs().startOf("day"))}
            format="DD-MM-YYYY"
          />
        </Form.Item>
      </Col>

      <Col span={8}>
        <Form.Item
          name="endDate"
          label="End Date"
          rules={[
            { required: true, message: "Please select End Date" },
            {
              validator(_, value) {
                const start = formInstance.getFieldValue("startDate");
                if (start && value && value.isBefore(start, "day")) {
                  return Promise.reject(new Error("End Date cannot be before Start Date"));
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
            format="DD-MM-YYYY"
          />
        </Form.Item>
      </Col>

      <Col span={8}>
        <Form.Item
          label="Company "
          name="companyName"
          rules={[{ required: true, message: "Please select Company" }]}
        >
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
        <Form.Item
          label="Customer Name"
          name="customer"
          rules={[{ required: true, message: "Please enter Customer Name" }]}
        >
          <Input placeholder="Enter Customer Name" disabled={disabled} />
        </Form.Item>
      </Col>

      <Col span={8}>
        <Form.Item
          label="Location"
          name="location"
          rules={[{ required: true, message: "Please select Location" }]}
        >
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
   </div>
  
  );

  const renderApprovedView = () => (
    <div >
      <h3 className="text-xl font-semibold text-amber-600 mb-4">Contract & Party Details</h3>
       <div className="border! p-2! rounded! mb-2! border-amber-300! relative!">
      <Row gutter={16}>
        <Col span={6}>
          <Form.Item label="Contract Date">
            <Input value={selectedRecord?.contractDate} disabled />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item label="Start Date">
            <Input value={selectedRecord?.startDate} disabled />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item label="End Date">
            <Input value={selectedRecord?.endDate} disabled />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item label="Delivery Date">
            <Input value={selectedRecord?.deliveryDate} disabled />
          </Form.Item>
        </Col>

        <Col span={6}>
          <Form.Item label="Company">
            <Input value={selectedRecord?.companyName} disabled />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item label="Customer Name">
            <Input value={selectedRecord?.customer} disabled />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item label="Customer Phone">
            <Input value={selectedRecord?.cust_phone} disabled />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item label="Customer Email">
            <Input value={selectedRecord?.cust_email} disabled />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item label="Depo">
            <Input value={selectedRecord?.depoName} disabled />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item label="Location">
            <Input value={selectedRecord?.location} disabled />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item label="Broker">
            <Input value={selectedRecord?.brokerName} disabled />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item label="Type">
            <Input value={selectedRecord?.type} disabled />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item label="Delivery Address">
            <Input value={selectedRecord?.deliveryAddress} disabled />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item label="Status">
            <Input value={selectedRecord?.status} disabled />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item label="Naarration">
            <Input value={selectedRecord?.naarration} disabled />
          </Form.Item>
        </Col>
      </Row>
     </div>
     

     

      <h3 className="text-xl font-semibold text-amber-600 my-4">Item & Quantity Details</h3>
       <div className="border! p-2! rounded! mb-2! border-amber-300! relative!">
      {(selectedRecord?.items || []).map((it, idx) => (
        <Row gutter={16} key={idx}>
          <Col span={6}>
            <Form.Item label={`Item ${idx + 1}`}>
              <Input value={it.item} disabled />
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item label={`Itemcode`}>
              <Input value={it.itemcode} disabled />
            </Form.Item>
          </Col>
           <Col span={4}>
            <Form.Item label="Qty">
              <Input value={it.qty} disabled />
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item label="UOM">
              <Input value={it.uom} disabled />
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item label="Rate">
              <Input value={it.rate} disabled />
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item label="Free Qty">
              <Input value={it.freeQty} disabled />
            </Form.Item>
          </Col>
        </Row>
      ))}
       <Row gutter={16} className="mt-2">
        <Col span={6}>
          <Form.Item label="Total Qty">
            <Input value={selectedRecord?.totalQty} disabled />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item label="UOM">
            <Input value={selectedRecord?.uom} disabled />
          </Form.Item>
        </Col>
      </Row>
    </div>
  

      <h3 className="text-xl font-semibold text-amber-600 my-4">Pricing & Tax Details</h3>
        <div className="border! p-2! rounded! mb-2! border-amber-300! relative!">
     <Row gutter={16}>
        <Col span={6}>
          <Form.Item label="Gross Amount">
            <Input value={selectedRecord?.grossAmount} disabled />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item label="Discount %">
            <Input value={selectedRecord?.discountPercent} disabled />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item label="Discount Amount">
            <Input value={selectedRecord?.discountAmt} disabled />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item label="Total Amount">
            <Input value={selectedRecord?.totalAmt} disabled />
          </Form.Item>
        </Col>
      </Row>
    
    </div>
    </div>
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-0">
        <div>
          <h1 className="text-3xl font-bold text-amber-700">Purchase Contract</h1>
          <p className="text-amber-600">Manage your Purchase contracts easily</p>
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
              addForm.setFieldsValue({
                contractDate: dayjs(),
                startDate: dayjs(),
                endDate: dayjs().add(7, "day"),
                status: "Pending",
                items: [{ item: undefined, qty: 0, uom: "Ltrs", rate: 0 }],
              });
              setSelectedRecord(null);
              setIsAddModalOpen(true);
            }}
          >
            Add New
          </Button>
        </div>
      </div>

      <div className="border border-amber-300 rounded-lg p-4 shadow-md">
        <Table columns={columns} dataSource={filteredData} pagination={false} scroll={{ y: 350 }} rowKey="key" />
      </div>

      {/* Add Modal */}
      <Modal
        title={<span className="text-amber-700 font-semibold">Add purchase Contract</span>}
        open={isAddModalOpen}
        onCancel={() => {
          setIsAddModalOpen(false);
        }}
        footer={null}
        width={900}
      >
        <Form
          layout="vertical"
          form={addForm}
          onFinish={(values) => handleFormSubmit(values, false)}
        >
          {renderBasicFields(addForm, false)}

          <h3 className="text-lg font-semibold text-amber-600 mb-2">Items</h3>
<div className="border! p-2! rounded! mb-2! border-amber-300! relative!">
  <Form.List name="items">
            {(fields, { add, remove }) => (
              <>
                {fields.map((field) => (
                  <Row gutter={12} key={field.key} align="middle" className="mb-2">
                    <Col span={8}>
                    <label htmlFor="">Item Name</label>
                      <Form.Item
                        {...field}
                        name={[field.name, "item"]}
                        fieldKey={[field.fieldKey, "item"]}
                        rules={[{ required: true, message: "Please select item" }]}
                      >
                        <Select placeholder="Select Item">
                          {salesContractJSON.itemOptions.map((it) => (
                            <Select.Option key={it} value={it}>
                              {it}
                            </Select.Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col span={4}>
                    <label htmlFor="">Quantity</label>

                      <Form.Item
                        {...field}
                        name={[field.name, "qty"]}
                        fieldKey={[field.fieldKey, "qty"]}
                        rules={[{ required: true, message: "Enter qty" }]}
                      >
                        <Input type="number" placeholder="Qty" />
                      </Form.Item>
                    </Col>
                    <Col span={4}>
                    <label htmlFor="">UOM</label>

                      <Form.Item
                        {...field}
                        name={[field.name, "uom"]}
                        fieldKey={[field.fieldKey, "uom"]}
                        rules={[{ required: true, message: "Select UOM" }]}
                      >
                        <Select>
                          {salesContractJSON.uomOptions.map((u) => (
                            <Select.Option key={u} value={u}>
                              {u}
                            </Select.Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col span={4}>
                    <label htmlFor="">Rate</label>
                      <Form.Item
                        {...field}
                        name={[field.name, "rate"]}
                        fieldKey={[field.fieldKey, "rate"]}
                      >
                        <Input type="number" placeholder="Rate" />
                      </Form.Item>
                    </Col>
                   
                    <Col span={1}>
                      <MinusCircleOutlined onClick={() => remove(field.name)} />
                    </Col>
                  </Row>
                ))}

                <Form.Item>
                  <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                    Add Item
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
  </div>
         

          <div className="flex justify-end gap-2 mt-4">
            <Button
              onClick={() => {
                setIsAddModalOpen(false);
              }}
              className="border-amber-400! text-amber-700! hover:bg-amber-100!"
            >
              Cancel
            </Button>
            <Button type="primary" htmlType="submit" className="bg-amber-500! hover:bg-amber-600! border-none!">
              Add
            </Button>
          </div>
        </Form>
      </Modal>

      {/* Edit Modal */}
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
        width={900}
      >
        <Form
          layout="vertical"
          form={editForm}
          onFinish={() =>
            editForm
              .validateFields()
              .then(() => handleFormSubmit(null, true))
              .catch(() => {})
          }
        >
          {renderBasicFields(editForm, false)}

          <h3 className="text-lg font-semibold text-amber-600 mb-2">Items</h3>
            <div className="border! p-2! rounded! mb-2! border-amber-300! relative!">
              <Form.List name="items">
            {(fields, { add, remove }) => (
              <>
                {fields.map((field) => (
                  <Row gutter={12} key={field.key} align="middle" className="mb-2">
                    <Col span={8}>
                      <Form.Item
                        {...field}
                        name={[field.name, "item"]}
                        fieldKey={[field.fieldKey, "item"]}
                        rules={[{ required: true, message: "Please select item" }]}
                      >
                        <Select placeholder="Select Item">
                          {salesContractJSON.itemOptions.map((it) => (
                            <Select.Option key={it} value={it}>
                              {it}
                            </Select.Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col span={4}>
                      <Form.Item
                        {...field}
                        name={[field.name, "qty"]}
                        fieldKey={[field.fieldKey, "qty"]}
                        rules={[{ required: true, message: "Enter qty" }]}
                      >
                        <Input type="number" placeholder="Qty" />
                      </Form.Item>
                    </Col>
                    <Col span={4}>
                      <Form.Item
                        {...field}
                        name={[field.name, "uom"]}
                        fieldKey={[field.fieldKey, "uom"]}
                        rules={[{ required: true, message: "Select UOM" }]}
                      >
                        <Select>
                          {salesContractJSON.uomOptions.map((u) => (
                            <Select.Option key={u} value={u}>
                              {u}
                            </Select.Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col span={4}>
                      <Form.Item
                        {...field}
                        name={[field.name, "rate"]}
                        fieldKey={[field.fieldKey, "rate"]}
                      >
                        <Input type="number" placeholder="Rate" />
                      </Form.Item>
                    </Col>
                    <Col span={3}>
                      <Form.Item
                        {...field}
                        name={[field.name, "freeQty"]}
                        fieldKey={[field.fieldKey, "freeQty"]}
                      >
                        <Input type="number" placeholder="Free" />
                      </Form.Item>
                    </Col>
                    <Col span={1}>
                      <MinusCircleOutlined onClick={() => remove(field.name)} />
                    </Col>
                  </Row>
                ))}

                <Form.Item>
                  <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                    Add Item
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>

   </div>
          
          <div className="flex justify-end gap-2 mt-4">
            <Button
              onClick={() => {
                setIsEditModalOpen(false);
              }}
              className="border-amber-400! text-amber-700! hover:bg-amber-100!"
            >
              Cancel
            </Button>
            <Button type="primary" htmlType="submit" className="bg-amber-500! hover:bg-amber-600! border-none!">
              Update
            </Button>
          </div>
        </Form>
      </Modal>

      {/* View Modal */}
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
          {selectedRecord?.status === "Approved" ? (
            renderApprovedView()
          ) : (
            <>
              {renderBasicFields(viewForm, true)}
  <h3 className="text-lg font-semibold text-amber-600 mb-2">Items</h3>
              {(selectedRecord?.items || []).map((it, idx) => (
                <Row gutter={12} key={idx} className="mb-2">
                  <Col span={10}>
                    <Form.Item label={`Item ${idx + 1}`}>
                      <Input value={it.item} disabled />
                    </Form.Item>
                  </Col>
                  <Col span={4}>
                    <Form.Item label="Qty">
                      <Input value={it.qty} disabled />
                    </Form.Item>
                  </Col>
                  <Col span={4}>
                    <Form.Item label="UOM">
                      <Input value={it.uom} disabled />
                    </Form.Item>
                  </Col>
                  <Col span={4}>
                    <Form.Item label="Rate">
                      <Input value={it.rate} disabled />
                    </Form.Item>
                  </Col>
                </Row>
              ))}
            </>
          )}
        </Form>
      </Modal>
    </div>
  );
}
