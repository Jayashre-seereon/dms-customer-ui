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

// --- Mock Data/JSON Extended ---
const contractJSON = {
  initialData: [
    {
      key: "C-0001",
      contractDate: "2025-10-01",
      startDate: "2025-10-05",
      endDate: "2025-10-31",
      orderNo: "1",
      items: [
        {
          companyName: "ABC Oils Ltd",
          item: "Palm Oil",
          itemCode: "IT23",
          qty: 2000,
          uom: "Ltrs",
          rate: 125.50,
          freeQty: 100
        },
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
    {
      key: "C-0002",
      contractDate: "2025-11-15",
      startDate: "2025-11-20",
      endDate: "2025-12-31",
      orderNo: "2",
      items: [
        {
          companyName: "XYZ Refineries",
          item: "Mustard Oil",
          itemCode: "MO101",
          qty: 500,
          uom: "Kg",
          rate: 180.00,
          freeQty: 0
        },
        {
          companyName: "XYZ Refineries",
          item: "Coconut Oil",
          itemCode: "CO202",
          qty: 1500,
          uom: "Ltrs",
          rate: 220.75,
          freeQty: 50
        },
      ],
      totalQty: 2000,
      uom: "", // Mixed UOM
      location: "Warehouse B",
      status: "Pending",
      totalAmt: 350000,
      brokerName: "Broker 2",
      // other fields...
    },
  ],
  // Item options are now grouped by company for auto-fill and filter logic
  companyOptions: ["ABC Oils Ltd", "XYZ Refineries", "PQR Traders"],
  uomOptions: ["Ltrs", "Kg"],
  statusOptions: ["Approved", "Pending", "Rejected"],
  locationOptions: ["Warehouse A", "Warehouse B", "Warehouse C"],
};

// Mock data for item code and rate lookup
const itemDetailsByCompany = {
  "ABC Oils Ltd": {
    "Palm Oil": { itemCode: "IT23", rate: 125.50, uom: "Ltrs" },
    "Sunflower Oil": { itemCode: "SF45", rate: 140.00, uom: "Ltrs" },
  },
  "XYZ Refineries": {
    "Mustard Oil": { itemCode: "MO101", rate: 180.00, uom: "Kg" },
    "Coconut Oil": { itemCode: "CO202", rate: 220.75, uom: "Ltrs" },
  },
  "PQR Traders": {
    "Mustard Oil": { itemCode: "MO101", rate: 178.50, uom: "Kg" },
    "Palm Oil": { itemCode: "IT23", rate: 126.00, uom: "Ltrs" },
  }
};

// 1. Define Company to Location Mapping
const companyLocationMap = {
  "ABC Oils Ltd": "Warehouse A",
  "XYZ Refineries": "Warehouse B",
  "PQR Traders": "Warehouse C",
};


// Function to get item options for a specific company
const getItemOptionsForCompany = (companyName) => {
  return itemDetailsByCompany[companyName] ? Object.keys(itemDetailsByCompany[companyName]) : [];
};

const getCompanyNamesFromItems = (items) => {
  return (items || []).map(item => item.companyName).filter((value, index, self) => self.indexOf(value) === index).join(", ");
};

export default function Contract() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [data, setData] = useState(contractJSON.initialData);
  const [searchText, setSearchText] = useState("");

  const [addForm] = Form.useForm();
  const [editForm] = Form.useForm();
  const [viewForm] = Form.useForm();


  const filteredData = data.filter(
    (item) => {
      const companyNames = getCompanyNamesFromItems(item.items);
      return item.key?.toLowerCase().includes(searchText.toLowerCase()) ||
        companyNames?.toLowerCase().includes(searchText.toLowerCase()) ||
        (item.items || [])
          .map((it) => it.item?.toLowerCase())
          .join(" ")
          .includes(searchText.toLowerCase()) ||
        item.status?.toLowerCase().includes(searchText.toLowerCase())
    }
  );

  const calculateTotals = (items) => {
    if (!items || items.length === 0) return { totalQty: 0, uom: "" };
    const uomSet = new Set(items.map((i) => i.uom));
    const totalQty = items.reduce((s, it) => s + Number(it.qty || 0), 0);
    return { totalQty, uom: uomSet.size === 1 ? items[0].uom : (uomSet.size > 1 ? "Mixed" : "") };
  };

  const columns = [
    {
      title: <span className="text-amber-700 font-semibold">Contract No</span>,
      dataIndex: "key", // Using key as contract no
      render: (text) => <span className="text-amber-800 font-bold">{text}</span>,
    },
    {
      title: <span className="text-amber-700 font-semibold">Company</span>,
      render: (_, r) => <span className="text-amber-800">{getCompanyNamesFromItems(r.items)}</span>,
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
      width: 120,
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

  // Logic to handle item selection change for auto-fill (Rate and Item Code)
  const handleItemSelect = (form, companyName, itemName, rowIndex) => {
    const itemData = itemDetailsByCompany[companyName]?.[itemName];

    if (!itemData) return;

    // Get current list
    const items = form.getFieldValue('items') || [];

    // Update only selected row
    items[rowIndex] = {
      ...items[rowIndex],
      item: itemName,
      itemCode: itemData.itemCode,
      rate: itemData.rate,
      uom: itemData.uom,  // UPDATE UOM
    };

    // Push updated list back to form
    form.setFieldsValue({ items });
  };

  const handleCompanyChange = (form, companyName, fieldName, isEdit) => {

    const newLocation = companyLocationMap[companyName];

    // Update the top-level location if this is the FIRST item (index 0)
    if (fieldName === 0 && newLocation) {
      form.setFieldsValue({ location: newLocation });
    }

    // Reset item, itemCode, and rate when company changes
    form.setFieldsValue({
      items: form.getFieldValue('items').map((item, index) =>
        index === fieldName ? { ...item, item: undefined, itemCode: undefined, rate: undefined, uom: undefined } : item
      )
    });
  }


  const handleFormSubmit = (values, isEdit) => {
    const formInstance = isEdit ? editForm : addForm;
    const finalValues = values || formInstance.getFieldsValue();
    const items = finalValues.items && finalValues.items.length > 0 ? finalValues.items : [];

    const totals = calculateTotals(items);

    // Determine the next contract number
    const newContractNo = `C-${String(data.length + 1).padStart(4, '0')}`;

    const payload = {
      // Use existing key or generated one
      key: isEdit ? selectedRecord.key : newContractNo,
      ...finalValues,
      items,
      totalQty: totals.totalQty,
      uom: totals.uom,
      status: finalValues.status || "Pending",
      contractDate: finalValues.contractDate
        ? finalValues.contractDate.format("YYYY-MM-DD")
        : undefined,
      startDate: finalValues.startDate ? finalValues.startDate.format("YYYY-MM-DD") : undefined,
      endDate: finalValues.endDate ? finalValues.endDate.format("YYYY-MM-DD") : undefined,
      deliveryDate: finalValues.deliveryDate
        ? finalValues.deliveryDate.format("YYYY-MM-DD")
        : undefined,
      // location is kept here as a top-level field
    };

    if (isEdit) {
      setData((prev) =>
        prev.map((item) =>
          item.key === selectedRecord.key ? { ...item, ...payload } : item
        )
      );
    } else {
      setData((prev) => [...prev, payload]);
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
            name="key"
            label="Contract No."
          >
            <Input
              placeholder="Auto-Generated"
              disabled={true}
              className="font-bold text-amber-800"
            />
          </Form.Item>
        </Col>

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
            label="Location"
            name="location"
            rules={[{ required: true, message: "Please select Location" }]}
          >
            <Select placeholder="Select Location" disabled>
              {contractJSON.locationOptions.map((loc) => (
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
              {contractJSON.statusOptions.map((s) => (
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

  const renderItemRow = (formInstance, field, remove, disabled) => {
    const items = formInstance.getFieldValue('items');
    const currentItem = items && items[field.name];
    const selectedCompany = currentItem?.companyName;
    const itemOptions = getItemOptionsForCompany(selectedCompany);

    return (
     <Row 
  gutter={24} 
  key={field.key} 
  align="middle" 
  className="mb-2 border-b border-dashed pb-2"
>

  {/* Company */}
  <Col span={6}>
    <label>Company</label>
    <Form.Item
      {...field}
      name={[field.name, "companyName"]}
      fieldKey={[field.fieldKey, "companyName"]}
      rules={[{ required: true, message: "Select company" }]}
    >
      <Select
        placeholder="Select Company"
        disabled={disabled}
        onChange={(companyName) =>
          handleCompanyChange(formInstance, companyName, field.name, isEditModalOpen)
        }
      >
        {contractJSON.companyOptions.map((c) => (
          <Select.Option key={c} value={c}>{c}</Select.Option>
        ))}
      </Select>
    </Form.Item>
  </Col>

  {/* Item Name */}
  <Col span={6}>
    <label>Item Name</label>
    <Form.Item
      {...field}
      name={[field.name, "item"]}
      fieldKey={[field.fieldKey, "item"]}
      rules={[{ required: true, message: "Select item" }]}
    >
      <Select
        placeholder="Select Item"
        disabled={disabled || !selectedCompany}
        onChange={(value) =>
          handleItemSelect(
            formInstance,
            selectedCompany,
            value,
            field.name,
            field.fieldKey
          )
        }
      >
        {itemOptions.map((it) => (
          <Select.Option key={it} value={it}>{it}</Select.Option>
        ))}
      </Select>
    </Form.Item>
  </Col>

  {/* Item Code */}
  <Col span={6}>
    <label>Item Code</label>
    <Form.Item
      {...field}
      name={[field.name, "itemCode"]}
      fieldKey={[field.fieldKey, "itemCode"]}
    >
      <Input placeholder="Code" disabled />
    </Form.Item>
  </Col>

  {/* Rate */}
  <Col span={6}>
    <label>Rate</label>
    <Form.Item
      {...field}
      name={[field.name, "rate"]}
      fieldKey={[field.fieldKey, "rate"]}
      rules={[{ required: true, message: "Enter rate" }]}
    >
      <Input type="number" placeholder="Rate" disabled />
    </Form.Item>
  </Col>

  {/* UOM */}
  <Col span={6}>
    <label>UOM</label>
    <Form.Item
      {...field}
      name={[field.name, "uom"]}
      fieldKey={[field.fieldKey, "uom"]}
    >
      <Input placeholder="UOM" disabled />
    </Form.Item>
  </Col>

  {/* Quantity */}
  <Col span={6}>
    <label>Quantity</label>
    <Form.Item
      {...field}
      name={[field.name, "qty"]}
      fieldKey={[field.fieldKey, "qty"]}
      rules={[
        { required: true, message: "Enter qty" },
        { type: "number", min: 1, message: "Minimum qty is 1" }
      ]}
    >
      <Input type="number" placeholder="Qty" disabled={disabled} min={1} />
    </Form.Item>
  </Col>

  {/* Remove Button */}
  <Col span={1}>
    {!disabled && (
      <MinusCircleOutlined onClick={() => remove(field.name)} />
    )}
  </Col>
</Row>

    );
  };

  const renderItemSection = (formInstance, disabled) => (
    <>
      <h3 className="text-lg font-semibold text-amber-600 mb-2">Items</h3>
      <div className="border! p-2! rounded! mb-2! border-amber-300! relative!">
        <Form.List name="items">
          {(fields, { add, remove }) => (
            <>
              {fields.map((field) => renderItemRow(formInstance, field, remove, disabled))}

              {!disabled && (
                <Form.Item className="mt-4">
                  <Button type="dashed" onClick={() => add({ uom: 'Ltrs', qty: 0, rate: 0 })} block icon={<PlusOutlined />}>
                    Add Item
                  </Button>
                </Form.Item>
              )}
            </>
          )}
        </Form.List>
      </div>
    </>
  );

  const renderApprovedView = () => (
    <div >
      <h3 className="text-xl font-semibold text-amber-600 mb-4">Contract & Party Details</h3>
      <div className="border! p-2! rounded! mb-2! border-amber-300! relative!">
        <Row gutter={16}>
          <Col span={6}>
            <Form.Item label="Contract No.">
              <Input value={selectedRecord?.key} disabled />
            </Form.Item>
          </Col>
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
            <Form.Item label="Company(ies)">
              <Input value={getCompanyNamesFromItems(selectedRecord?.items)} disabled />
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
          <Row gutter={16} key={idx} className="mb-2 border-b border-dashed pb-2">
            <Col span={6}>
              <Form.Item label={`Company ${idx + 1}`}>
                <Input value={it.companyName} disabled />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label={`Item ${idx + 1}`}>
                <Input value={it.item} disabled />
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item label={`Item Code`}>
                <Input value={it.itemCode} disabled />
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item label="Rate">
                <Input value={it.rate} disabled />
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item label="Uom">
                <Input value={it.uom} disabled />
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
              <Form.Item label="Free Qty">
                <Input value={it.freeQty} disabled />
              </Form.Item>
            </Col>
          </Row>
        ))}
        <Row gutter={16} className="mt-4">
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
          <h1 className="text-3xl font-bold text-amber-700">Contracts</h1>
          <p className="text-amber-600">Manage your contracts easily</p>
        </div>
      </div>
      <div className="flex justify-between items-center mb-2">
        <div className="flex gap-2">
          <Input
            prefix={<SearchOutlined className="text-amber-600!" />}
            placeholder="Search by Contract No, Company, Item, Status"
            className="w-96! border-amber-300! focus:border-amber-500!"
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
                key: `C-${String(data.length + 1).padStart(4, '0')}`,
                contractDate: dayjs(),
                startDate: dayjs(),
                endDate: dayjs().add(7, "day"),
                status: "Pending",
                // Set initial item with empty company/item/code/rate
                items: [{ companyName: undefined, item: undefined, itemCode: undefined, qty: 0, uom: "Ltrs", rate: 0 }],
                location: undefined, // Reset location
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
        width={1000}
      >
        <Form
          layout="vertical"
          form={addForm}
          onFinish={(values) => handleFormSubmit(values, false)}
          initialValues={{
            key: `C-${String(data.length + 1).padStart(4, '0')}`,
            contractDate: dayjs(),
            startDate: dayjs(),
            endDate: dayjs().add(7, "day"),
            status: "Pending",
            items: [{ companyName: undefined, item: undefined, itemCode: undefined, qty: 0, uom: "Ltrs", rate: 0 }],
          }}
        >
          {renderBasicFields(addForm, false)}
          {renderItemSection(addForm, false)}

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
        width={1000}
      >
        <Form
          layout="vertical"
          form={editForm}
          onFinish={() =>
            editForm
              .validateFields()
              .then(() => handleFormSubmit(null, true))
              .catch(() => { })
          }
        >
          {renderBasicFields(editForm, false)}
          {renderItemSection(editForm, false)}

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
              {renderItemSection(viewForm, true)}
            </>
          )}
        </Form>
      </Modal>
    </div>
  );
}