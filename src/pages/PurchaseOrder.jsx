import React, { useState, useMemo, useCallback } from "react";
import {
  Table, Input, Button, Modal, Form, Select, InputNumber, DatePicker, Row, Col, Tag, Divider
} from "antd";
import {
  SearchOutlined, PlusOutlined, DownloadOutlined, EyeOutlined, EditOutlined,
  FilterOutlined, DeleteOutlined, MinusCircleOutlined
} from "@ant-design/icons";
import dayjs from "dayjs";
import Wallet from "./Wallet";

const API_CONFIG = {
  fetchData: () => salesContractJSON.initialData, 
  saveData: (data) => data,
  updateData: (data) => data, 
  fetchContracts: () => salesContractJSON.contractOptions, 
};

// --- Data & Constants ---
const salesContractJSON = {
  initialData: [
    { key: 1, orderGroupId: "ORD-2025-001", contractNo: "SC-001", orderDate: "2025-10-01", companyName: "ABC Oils Ltd", item: "Mustard Oil", qty: 2000, uom: "Ltrs", item_code: "MO-001", deliveryDate: "2025-10-15", deliveryAddress: "Warehouse A, Bhubaneswar", status: "Approved", totalAmt: 250000, rate: 125, Net_Qty: 10, Gross_Qty: 12, HSN_Code: 1514, IGST: 12, Cash_Discount: 5, Date_of_Order: "2025-10-01", Purchase_Type: "Local", Bill_Mode: "Online", Exp_Receiving_Date: "2025-10-18", Narration: "Standard delivery order" },
    { key: 2, orderGroupId: "ORD-2025-001", contractNo: "SC-002", orderDate: "2025-10-01", companyName: "XYZ Refineries", item: "Sunflower Oil", qty: 1000, uom: "Ltrs", item_code: "SO-002", deliveryDate: "2025-10-15", deliveryAddress: "Warehouse A, Bhubaneswar", status: "Approved", totalAmt: 110000, rate: 110, Net_Qty: 8, Gross_Qty: 10, HSN_Code: 1512, IGST: 18, Cash_Discount: 3, Date_of_Order: "2025-10-01", Purchase_Type: "Interstate", Bill_Mode: "Offline", Exp_Receiving_Date: "2025-10-17", Narration: "Urgent interstate delivery" },
    { key: 3, orderGroupId: "ORD-2025-002", contractNo: "SC-003", orderDate: "2025-10-05", companyName: "PQR Traders", item: "Coconut Oil", qty: 500, uom: "Ltrs", item_code: "CO-002", deliveryDate: "2025-10-20", deliveryAddress: "Warehouse B, Cuttack", status: "Pending", totalAmt: 65000, rate: 130, Net_Qty: 5, Gross_Qty: 6, HSN_Code: 1513, IGST: 12, Cash_Discount: 2, Date_of_Order: "2025-10-05", Purchase_Type: "Local", Bill_Mode: "Online", Exp_Receiving_Date: "2025-10-25", Narration: "Pending approval" },
    { key: 4, orderGroupId: "ORD-2025-002", contractNo: "SC-003", orderDate: "2025-10-05", companyName: "PQR Traders", item: "Palm Oil", qty: 300, uom: "Ltrs", item_code: "PO-003", deliveryDate: "2025-10-20", deliveryAddress: "Warehouse B, Cuttack", status: "Pending", totalAmt: 39000, rate: 130, Net_Qty: 3, Gross_Qty: 4, HSN_Code: 1511, IGST: 18, Cash_Discount: 4, Date_of_Order: "2025-10-05", Purchase_Type: "Local", Bill_Mode: "Offline", Exp_Receiving_Date: "2025-10-22", Narration: "Standard order pending" }
  ],
  contractOptions: [
    { contractNo: "SC-001", companyName: "ABC Oils Ltd", items: [{ item: "Mustard Oil", uom: "Ltrs", restQty: 5000, rate: 125, item_code: "MO-001" }, { item: "Palm Oil", uom: "Ltrs", restQty: 1500, rate: 125, item_code: "PO-001" }] },
    { contractNo: "SC-002", companyName: "XYZ Refineries", items: [{ item: "Sunflower Oil", uom: "Ltrs", item_code: "SO-002", restQty: 3000, rate: 110 }, { item: "Coconut Oil", uom: "Ltrs", item_code: "CO-002", restQty: 800, rate: 140 }] },
    { contractNo: "SC-003", companyName: "PQR Traders", items: [{ item: "Coconut Oil", uom: "Ltrs", item_code: "CO-003", restQty: 1200, rate: 130 }, { item: "Palm Oil", uom: "Ltrs", item_code: "PO-003", restQty: 1200, rate: 130 }] }
  ],
  uomOptions: ["Ltrs", "Kg"]
};

const emptyItem = { item: undefined, qty: 0, uom: undefined, rate: 0, key: undefined };
const emptyContract = { contractNo: undefined, companyName: undefined, items: [emptyItem] };
const initialOrderGroup = { deliveryDate: dayjs().add(3, "day"), deliveryAddress: "", contracts: [emptyContract] };

// Core data grouping utility
const groupDataByOrderGroup = (flatData) => {
  const groups = flatData.reduce((acc, curr) => {
    const { orderGroupId, contractNo, item, qty, uom, item_code, rate, totalAmt, key, Net_Qty, Gross_Qty, HSN_Code, IGST, Cash_Discount, Date_of_Order, Purchase_Type, Bill_Mode, Exp_Receiving_Date, Narration, ...rest } = curr;
    if (!acc[orderGroupId]) {
      acc[orderGroupId] = { orderGroupId, key: orderGroupId, orderDate: rest.orderDate, deliveryDate: rest.deliveryDate, deliveryAddress: rest.deliveryAddress, status: rest.status, totalItems: 0, totalAmount: 0, contracts: {}, flatKeys: [] };
    }
    const group = acc[orderGroupId];
    if (!group.contracts[contractNo]) {
      group.contracts[contractNo] = { contractNo, companyName: rest.companyName, items: [] };
    }
    group.contracts[contractNo].items.push({ item, qty, uom, item_code, rate, key, Net_Qty, Gross_Qty, HSN_Code, IGST, Cash_Discount, Date_of_Order, Purchase_Type, Bill_Mode, Exp_Receiving_Date, Narration });
    group.totalItems += qty;
    group.totalAmount += (rate || 0) * qty;
    group.flatKeys.push(key);
    return acc;
  }, {});
  return Object.values(groups).map(g => ({ ...g, contracts: Object.values(g.contracts) }));
};

// Shared form handlers
const useFormHandlers = (form, setContractItemsMap, setSelectedItemMaxMap, isEdit = false) => {
  const handleSelectContract = useCallback((contractNo, contractIndex) => {
    const c = salesContractJSON.contractOptions.find(x => x.contractNo === contractNo);
    if (!c) return;
    setContractItemsMap(prev => ({ ...prev, [contractIndex]: c.items }));
    const orders = form.getFieldValue("contracts") || [];
    const updated = orders.map((entry, idx) => idx === contractIndex ? { ...entry, contractNo, companyName: c.companyName, items: [emptyItem] } : entry);
    form.setFieldsValue({ contracts: updated });
    setSelectedItemMaxMap(prev => {
      const copy = { ...prev };
      Object.keys(copy).forEach(k => { if (k.startsWith(`${contractIndex}-`)) delete copy[k]; });
      return copy;
    });
  }, [form, setContractItemsMap, setSelectedItemMaxMap]);

  const handleSelectItem = useCallback((itemName, contractIndex, itemIndex) => {
    const items = salesContractJSON.contractOptions.flatMap(c => c.items);
    const sel = items.find(it => it.item === itemName);
    if (!sel) {
      setSelectedItemMaxMap(p => ({ ...p, [`${contractIndex}-${itemIndex}`]: 0 }));
      return;
    }
    const contracts = form.getFieldValue("contracts") || [];
    const updatedContracts = contracts.map((c, ci) => {
      if (ci !== contractIndex) return c;
      const updatedItems = (c.items || []).map((it, ii) => ii === itemIndex ? { ...it, item: sel.item, uom: sel.uom, item_code: sel.item_code, rate: sel.rate, qty: 0 } : it);
      return { ...c, items: updatedItems };
    });
    form.setFieldsValue({ contracts: updatedContracts });
    setSelectedItemMaxMap(prev => ({ ...prev, [`${contractIndex}-${itemIndex}`]: sel.restQty || 0 }));
  }, [form, setSelectedItemMaxMap]);

  return { handleSelectContract, handleSelectItem };
};

// Main component
export default function SalesOrder() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedOrderGroup, setSelectedOrderGroup] = useState(null);
  const [data, setData] = useState(API_CONFIG.fetchData());
  const [searchText, setSearchText] = useState("");
  const [contractItemsMap, setContractItemsMap] = useState({});
  const [selectedItemMaxMap, setSelectedItemMaxMap] = useState({});
  const [walletOpen, setWalletOpen] = useState(false);

  const [addForm] = Form.useForm();
  const [editForm] = Form.useForm();

  const disablePastDates = current => current && current < dayjs().startOf("day");
  const groupedData = useMemo(() => groupDataByOrderGroup(data), [data]);
  const filteredData = useMemo(() => 
    groupedData.filter(d => 
      (d.orderGroupId || "").toLowerCase().includes(searchText.toLowerCase()) ||
      (d.status || "").toLowerCase().includes(searchText.toLowerCase()) ||
      d.contracts.some(c => 
        c.contractNo.toLowerCase().includes(searchText.toLowerCase()) || 
        c.companyName.toLowerCase().includes(searchText.toLowerCase())
      )
    ), [groupedData, searchText]
  );

  // Table columns (UI unchanged)
  const columns = [
    { title: <span className="text-amber-700 font-semibold">Order Group</span>, dataIndex: "orderGroupId", key: "orderGroupId", width: 100, render: t => <span className="text-amber-800 font-bold">{t}</span> },
    { title: <span className="text-amber-700 font-semibold">Contracts</span>, dataIndex: "contracts", key: "contracts", width: 150, render: contracts => (
      <div>{(contracts || []).map(c => (
        <div key={c.contractNo} className="mb-1">
          <Tag color="volcano">{c.contractNo} - {c.companyName} ({c.items.length} items)</Tag>
        </div>
      ))}</div>
    )},
    { title: <span className="text-amber-700 font-semibold">Delivery Address</span>, dataIndex: "deliveryAddress", key: "deliveryAddress", width: 100, render: t => <span className="text-amber-800">{t}</span> },
    { title: <span className="text-amber-700 font-semibold">Total Qty</span>, dataIndex: "totalItems", key: "totalItems", width: 100, render: t => <span className="text-amber-800">{t}</span> },
    { title: <span className="text-amber-700 font-semibold">Status</span>, dataIndex: "status", key: "status", width: 100, render: status => {
      const base = "px-3 py-1 rounded-full text-sm font-semibold";
      if (status === "Approved") return <span className={`${base} bg-green-100 text-green-700`}>Approved</span>;
      if (status === "Pending") return <span className={`${base} bg-yellow-100 text-yellow-700`}>Pending</span>;
      return <span className={`${base} bg-red-100 text-red-700`}>{status}</span>;
    }},
    { title: <span className="text-amber-700 font-semibold">Actions</span>, key: "actions", width: 100, render: record => (
      <div className="flex gap-3">
        <EyeOutlined className="cursor-pointer! text-blue-500!" onClick={() => { setSelectedOrderGroup(record); setIsViewModalOpen(true); }} />
        {record.status !== "Approved" && <EditOutlined className="cursor-pointer! text-red-500!" onClick={() => openEditModal(record)} />}
      </div>
    )}
  ];

  const openEditModal = useCallback(record => {
    if (record.status === 'Approved') return;
    const fullGroup = groupedData.find(g => g.orderGroupId === record.orderGroupId);
    if (!fullGroup) return;

    const initialContractItemsMap = {};
    const initialSelectedItemMaxMap = {};
    fullGroup.contracts.forEach((contract, contractIndex) => {
      const contractDetails = salesContractJSON.contractOptions.find(c => c.contractNo === contract.contractNo);
      if (contractDetails) {
        initialContractItemsMap[contractIndex] = contractDetails.items;
        contract.items.forEach((item, itemIndex) => {
          const contractItemDetail = contractDetails.items.find(i => i.item === item.item);
          if (contractItemDetail) initialSelectedItemMaxMap[`${contractIndex}-${itemIndex}`] = item.qty + (contractItemDetail.restQty || 0);
        });
      }
    });

    setContractItemsMap(initialContractItemsMap);
    setSelectedItemMaxMap(initialSelectedItemMaxMap);
    const initialValues = {
      deliveryAddress: fullGroup.deliveryAddress,
      deliveryDate: fullGroup.deliveryDate ? dayjs(fullGroup.deliveryDate) : null,
      orderGroupId: fullGroup.orderGroupId,
      orderDate: fullGroup.orderDate ? dayjs(fullGroup.orderDate) : null,
      contracts: fullGroup.contracts.map(contract => ({ contractNo: contract.contractNo, companyName: contract.companyName, items: contract.items }))
    };
    setSelectedOrderGroup(fullGroup);
    editForm.setFieldsValue(initialValues);
    setIsEditModalOpen(true);
  }, [groupedData, editForm]);

  const handleAddSubmit = useCallback(values => {
    const deliveryDate = values.deliveryDate?.format("YYYY-MM-DD");
    const deliveryAddress = values.deliveryAddress || "";
    const orderGroupId = `ORD-${dayjs().format("YYYYMMDD")}-${String(Date.now()).slice(-5)}`;
    const newRows = [];
    let baseKey = data.length ? data[data.length - 1].key : 0;
    let idx = 1;

    (values.contracts || []).forEach(contract => {
      const contractNo = contract.contractNo;
      const contractDetails = salesContractJSON.contractOptions.find(c => c.contractNo === contractNo);
      const companyName = contractDetails?.companyName;
      (contract.items || []).forEach(it => {
        if (!it?.item || !it.qty || Number(it.qty) <= 0) return;
        newRows.push({
          key: baseKey + idx++,
          orderGroupId, contractNo, companyName,
          item: it.item, qty: Number(it.qty), uom: it.uom, item_code: it.item_code,
          rate: it.rate, orderDate: dayjs().format("YYYY-MM-DD"),
          deliveryDate, deliveryAddress, status: "Pending",
          totalAmt: (it.rate || 0) * Number(it.qty)
        });
      });
    });

    if (newRows.length) {
      setData(prev => [...prev, ...newRows]);
    }
    addForm.resetFields();
    setContractItemsMap({}); setSelectedItemMaxMap({}); setIsAddModalOpen(false);
  }, [data, addForm]);

  const handleEditSubmit = useCallback(values => {
    const { deliveryDate, deliveryAddress, orderGroupId, contracts } = values;
    const updatedDeliveryDate = deliveryDate?.format("YYYY-MM-DD");
    const otherFlatRows = data.filter(item => item.orderGroupId !== orderGroupId);
    let maxKey = data.length > 0 ? Math.max(...data.map(d => d.key)) : 0;
    const updatedFlatRows = [];

    contracts.forEach(contract => {
      const { contractNo, items } = contract;
      const contractDetails = salesContractJSON.contractOptions.find(c => c.contractNo === contractNo);
      const companyName = contractDetails?.companyName;
      items.forEach(item => {
        if (!item?.item || !item.qty || Number(item.qty) <= 0) return;
        const isNewItem = item.key === undefined || item.key === null;
        const itemKey = isNewItem ? ++maxKey : item.key;
        updatedFlatRows.push({
          key: itemKey, orderGroupId, contractNo, companyName,
          item: item.item, qty: Number(item.qty), uom: item.uom, item_code: item.item_code,
          rate: item.rate, orderDate: selectedOrderGroup?.orderDate || dayjs().format("YYYY-MM-DD"),
          deliveryDate: updatedDeliveryDate, deliveryAddress: deliveryAddress || "", status: "Pending",
          totalAmt: (item.rate || 0) * Number(item.qty)
        });
      });
    });

    if (updatedFlatRows.length) {
      const finalData = [...otherFlatRows, ...updatedFlatRows];
      setData(finalData);
      // API_CONFIG.updateData(finalData); // Future API call
    }
    setIsEditModalOpen(false); editForm.resetFields(); setSelectedOrderGroup(null);
    setContractItemsMap({}); setSelectedItemMaxMap({});
  }, [data, selectedOrderGroup, editForm]);

  // Shared render components
  const RenderItemsList = useCallback(({ contractIndex, fields, operations, formInstance, handleSelectItem, isEditMode = false }) => {
    return fields.map(f => {
      const itemDetails = formInstance.getFieldValue(["contracts", contractIndex, "items", f.name]);
      const isNewItem = isEditMode ? (itemDetails?.key === undefined || itemDetails?.key === null) : true;
      const maxQty = selectedItemMaxMap[`${contractIndex}-${f.name}`];
      
      return (
        <div key={f.key} className="border! p-2! rounded! mb-2! relative! border-amber-300!">
          <Row gutter={12}>
            <Col span={8}>
              <Form.Item name={[f.name, "item"]} fieldKey={[f.fieldKey, "item"]} label="Item" rules={[{ required: true, message: "Select item" }]}>
                <Select placeholder="Select item" onChange={val => handleSelectItem(val, contractIndex, f.name)} disabled={!isNewItem}>
                  {(contractItemsMap[contractIndex] || []).map(it => (
                    <Select.Option key={it.item} value={it.item}>
                      {it.item} — available: {it.restQty} {it.uom} {it.item_code}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item name={[f.name, "qty"]} fieldKey={[f.fieldKey, "qty"]} label="Qty" rules={[
                { required: true, message: "Enter qty" },
                { validator: (_, value) => {
                  if (!value || Number(value) <= 0) return Promise.reject(new Error("Qty must be > 0"));
                  if (maxQty !== undefined && Number(value) > maxQty) return Promise.reject(new Error(`Max allowed: ${maxQty}`));
                  return Promise.resolve();
                }}
              ]}>
                <InputNumber min={1} style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col span={4}><Form.Item name={[f.name, "uom"]} label="UOM"><Input disabled value={itemDetails?.uom} /></Form.Item></Col>
            <Col span={4}><Form.Item name={[f.name, "item_code"]} label="Item Code"><Input style={{ width: "100%" }} disabled value={itemDetails?.item_code} /></Form.Item></Col>
            <Col span={4}><Form.Item name={[f.name, "rate"]} label="Rate"><InputNumber style={{ width: "100%" }} disabled value={itemDetails?.rate} /></Form.Item></Col>
            <Col span={2}><Button type="text" danger icon={<MinusCircleOutlined />} onClick={() => operations.remove(f.name)} /></Col>
            {isEditMode && <Form.Item name={[f.name, "key"]} hidden />}
          </Row>
        </div>
      );
    });
  }, [contractItemsMap, selectedItemMaxMap]);

  const RenderContractsList = useCallback(({ fields, operations, formInstance, handleSelectContract, handleSelectItem }) => {
    return fields.map(field => {
      const contractDetails = formInstance.getFieldValue(["contracts", field.name]);
      return (
        <div key={field.key} className="p-4 border border-amber-500 rounded-lg mb-4 relative">
          <h3 className="text-amber-700 font-semibold mb-2">Contract Details</h3>
          <Row gutter={12}>
            <Col span={8}>
              <Form.Item name={[field.name, "contractNo"]} fieldKey={[field.fieldKey, "contractNo"]} label="Contract No" rules={[{ required: true, message: "Select Contract" }]}>
                <Select placeholder="Select Contract" onChange={val => handleSelectContract(val, field.name)}>
                  {salesContractJSON.contractOptions.map(c => (
                    <Select.Option key={c.contractNo} value={c.contractNo}>{c.contractNo} — {c.companyName}</Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}><Form.Item name={[field.name, "companyName"]} fieldKey={[field.fieldKey, "companyName"]} label="Company"><Input disabled value={contractDetails?.companyName} /></Form.Item></Col>
          </Row>
          <Divider className="my-2" />
          <h4 className="text-amber-600 font-medium mb-2">Items</h4>
          <Form.List name={[field.name, "items"]}>
            {(itemsFields, itemsOps) => (
              <>
                <RenderItemsList contractIndex={field.name} fields={itemsFields} operations={itemsOps} formInstance={formInstance} handleSelectItem={handleSelectItem} />
                <div className="flex gap-2"><Button type="dashed" onClick={() => itemsOps.add(emptyItem)} icon={<PlusOutlined />} className="border-amber-400! text-amber-700! hover:bg-amber-100!">Add Item</Button></div>
              </>
            )}
          </Form.List>
          {fields.length > 1 && (
            <Button type="link" danger icon={<DeleteOutlined />} className="absolute top-2 right-2 text-red-500"
              onClick={() => {
                setContractItemsMap(prev => { const copy = { ...prev }; delete copy[field.name]; return copy; });
                setSelectedItemMaxMap(prev => { const copy = { ...prev }; Object.keys(copy).forEach(k => { if (k.startsWith(`${field.name}-`)) delete copy[k]; }); return copy; });
                operations.remove(field.name);
              }}>
              Remove Contract
            </Button>
          )}
        </div>
      );
    });
  }, [RenderItemsList]);

  // View Modal (unchanged UI)
  const renderOrderGroupView = useCallback(groupData => {
    if (!groupData) return null;
    const { orderGroupId, orderDate, deliveryDate, deliveryAddress, status, totalItems, totalAmount, contracts } = groupData;
    const isApprovedStatus = status === 'Approved';
    const itemColumns = [
      { title: 'Item', dataIndex: 'item', key: 'item', width: 120 },
      { title: 'Item Code', dataIndex: 'item_code', key: 'item_code', width: 120 },
      { title: 'Net Qty', dataIndex: 'Net_Qty', key: 'Net_Qty', width: 80, render: val => <span>{val}</span> },
      { title: 'Gross Qty', dataIndex: 'Gross_Qty', key: 'Gross_Qty', width: 90, render: val => <span>{val}</span> },
      { title: 'HSN Code', dataIndex: 'HSN_Code', key: 'HSN_Code', width: 90, render: val => <span>{val}</span> },
      { title: 'Qty', dataIndex: 'qty', key: 'qty', width: 70 },
      { title: 'UOM', dataIndex: 'uom', key: 'uom', width: 60 },
      { title: 'Rate', dataIndex: 'rate', key: 'rate', width: 80, render: val => <span>₹{val}</span> },
      ...(isApprovedStatus ? [
        { title: 'IGST', dataIndex: 'IGST', key: 'IGST', width: 70, render: val => <span>{val}%</span> },
        { title: 'Cash Disc', dataIndex: 'Cash_Discount', key: 'Cash_Discount', width: 80, render: val => <span>-{val}%</span> }
      ] : []),
      { title: 'Total', key: 'total', width: 100, render: (_, record) => <span>₹{((record.qty || 0) * (record.rate || 0)).toLocaleString()}</span> }
    ];

    return (
      <div className="p-6">
        <Row gutter={16} className="mb-6 p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200">
          <Col span={6}><div className="font-semibold text-amber-700 mb-1">Order Group ID:</div><div className="text-amber-500">{orderGroupId}</div></Col>
          <Col span={6}><div className="font-semibold text-amber-700 mb-1">Order Date:</div><div className="text-amber-500">{orderDate}</div></Col>
          <Col span={6}><div className="font-semibold text-amber-700 mb-1">Delivery Date:</div><div className="text-amber-500">{deliveryDate}</div></Col>
          <Col span={6}><div className="font-semibold text-amber-700 mb-1">Status:</div><Tag color={status === 'Approved' ? 'green' : 'yellow'} className="text-amber-500 px-4 py-2">{status}</Tag></Col>
          <Col span={12} className="mt-4"><div className="font-semibold text-amber-700 mb-1">Delivery Address:</div><div className="text-amber-500">{deliveryAddress}</div></Col>
          <Col span={6} className="mt-4"><div className="font-semibold text-amber-700 mb-1">Total Quantity:</div><div className="text-amber-500">{totalItems.toLocaleString()}</div></Col>
          <Col span={6} className="mt-4"><div className="font-semibold text-amber-700 mb-1">Total Amount:</div><div className="text-amber-500">₹{totalAmount.toLocaleString()}</div></Col>
        </Row>
        {isApprovedStatus && (
          <Row gutter={16} className="mb-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
            <Col span={6}><div className="font-semibold text-green-700 mb-1">Date of Order:</div><div className="text-green-500">{contracts[0]?.items[0]?.Date_of_Order || 'N/A'}</div></Col>
            <Col span={6}><div className="font-semibold text-green-700 mb-1">Purchase Type:</div><div className="text-green-500">{contracts[0]?.items[0]?.Purchase_Type || 'N/A'}</div></Col>
            <Col span={6}><div className="font-semibold text-green-700 mb-1">Bill Mode:</div><div className="text-green-500">{contracts[0]?.items[0]?.Bill_Mode || 'N/A'}</div></Col>
            <Col span={6}><div className="font-semibold text-green-700 mb-1">Exp. Receiving Date:</div><div className="text-green-500">{contracts[0]?.items[0]?.Exp_Receiving_Date || 'N/A'}</div></Col>
            <Col span={24} className="mt-2"><div className="font-semibold text-green-700 mb-1">Narration:</div><div className="text-green-500">{contracts[0]?.items[0]?.Narration || 'N/A'}</div></Col>
          </Row>
        )}
        <Divider orientation="left" className="text-amber-700! font-bold! text-xl! mb-6!">Contracts & Items Details</Divider>
        {contracts.map((contract, index) => (
          <div key={contract.contractNo} className="mb-8 p-4 border-1 border-amber-300 rounded-xl bg-gradient-to-br from-amber-50 to-yellow-50">
            <h4 className="text-xl font-bold text-amber-700 mb-4 flex items-center">
              Contract No: <span className="ml-2">{contract.contractNo}</span> <span className="ml-4 text-lg font-semibold text-amber-700">— {contract.companyName}</span>
            </h4>
            <Table columns={itemColumns} dataSource={contract.items.map((item, i) => ({ ...item, key: `${contract.contractNo}-${i}` }))} pagination={false} size="middle" rowKey="key" scroll={{ x: 1400, y: 400 }} />
          </div>
        ))}
      </div>
    );
  }, []);

  const addHandlers = useFormHandlers(addForm, setContractItemsMap, setSelectedItemMaxMap);
  const editHandlers = useFormHandlers(editForm, setContractItemsMap, setSelectedItemMaxMap, true);

  return (
    <div>
      <div className="flex justify-between items-center mb-0">
        <div><h1 className="text-3xl font-bold text-amber-700">Sales Order Management</h1><p className="text-amber-600">Manage your Purchase orders easily</p></div>
      </div>
      <div className="flex justify-between items-center mb-2">
        <div className="flex gap-2">
          <Input placeholder="Search" className="w-64! border-amber-300! focus:border-amber-500!" prefix={<SearchOutlined className="text-amber-600!" />} value={searchText} onChange={e => setSearchText(e.target.value)} allowClear size="large" />
          <Button className="border-amber-400! text-amber-700! hover:bg-amber-100!" icon={<FilterOutlined />}>Filter</Button>
        </div>
        <div className="flex gap-2">
          <Button className="border-amber-400! text-amber-700! hover:bg-amber-100!" onClick={() => setWalletOpen(true)}>Open Wallet</Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => { addForm.setFieldsValue(initialOrderGroup); setContractItemsMap({}); setSelectedItemMaxMap({}); setIsAddModalOpen(true); }} className="bg-amber-500! hover:bg-amber-600! border-none!">Add New Order</Button>
          <Button className="border-amber-400! text-amber-700! hover:bg-amber-100!" icon={<DownloadOutlined />}>Export</Button>
        </div>
      </div>
      <div className="border border-amber-300 rounded-lg p-4 shadow-md">
        <Table columns={columns} dataSource={filteredData} pagination={false} scroll={{ y: 400 }} rowKey="orderGroupId" />
      </div>
      <Modal title={<span className="text-amber-600 font-semibold">Create New Order Group</span>} open={isAddModalOpen} onCancel={() => setIsAddModalOpen(false)} okText="Create Order" onOk={() => addForm.submit()} width={900}>
        <Divider className="my-6" />
        <Form form={addForm} layout="vertical" onFinish={handleAddSubmit} initialValues={initialOrderGroup}>
          <Row gutter={24} className="mb-8">
            <Col span={8}><Form.Item name="deliveryDate" label={<span className="font-semibold text-amber-700">Delivery Date</span>} rules={[{ required: true }]}><DatePicker style={{ width: "100%" }} disabledDate={disablePastDates} format="YYYY-MM-DD" size="large" /></Form.Item></Col>
            <Col span={14}><Form.Item name="deliveryAddress" label={<span className="font-semibold text-amber-700">Delivery Address</span>} rules={[{ required: true }]}><Input.TextArea placeholder="Enter complete delivery address" rows={2} className="resize-none" /></Form.Item></Col>
          </Row>
          <Divider className="text-amber-700 font-bold text-lg">Contracts and Items</Divider>
          <Form.List name="contracts">
            {(fields, { add, remove }) => (
              <>
                <RenderContractsList fields={fields} operations={{ add, remove }} formInstance={addForm} {...addHandlers} />
                <Button type="dashed" onClick={() => add(emptyContract)} block icon={<PlusOutlined />} className="mt-4 border-2 border-amber-500 text-amber-700 hover:bg-amber-100 font-semibold h-12 text-lg">Add New Contract</Button>
              </>
            )}
          </Form.List>
        </Form>
      </Modal>

      {/* Edit Modal - UI unchanged */}
      <Modal title={<span className="text-2xl font-bold text-amber-600">Edit Order Group</span>} open={isEditModalOpen} onCancel={() => { setIsEditModalOpen(false); setSelectedOrderGroup(null); setContractItemsMap({}); setSelectedItemMaxMap({}); }} okText="Save Changes" onOk={() => editForm.submit()} width={900}>
        <Divider className="my-6" />
        <Form form={editForm} layout="vertical" onFinish={handleEditSubmit}>
          <Row gutter={24} className="mb-8">
            <Col span={8}><Form.Item name="orderGroupId" label={<span className="font-semibold text-amber-700">Order ID</span>}><Input disabled /></Form.Item></Col>
            <Col span={8}><Form.Item name="deliveryDate" label={<span className="font-semibold text-amber-700">Delivery Date</span>} rules={[{ required: true }]}><DatePicker style={{ width: "100%" }} disabledDate={disablePastDates} format="YYYY-MM-DD" size="large" /></Form.Item></Col>
            <Col span={8}><Form.Item name="deliveryAddress" label={<span className="font-semibold text-amber-700">Delivery Address</span>} rules={[{ required: true }]}><Input.TextArea placeholder="Enter delivery address" rows={2} className="resize-none" /></Form.Item></Col>
          </Row>
          <Divider className="text-amber-700 font-bold text-lg">Contracts and Items</Divider>
          <Form.List name="contracts">
            {(fields, { add, remove }) => (
              <>
                <RenderContractsList fields={fields} operations={{ add, remove }} formInstance={editForm} {...editHandlers} />
                <Button type="dashed" onClick={() => add(emptyContract)} block icon={<PlusOutlined />} className="mt-4 border-2 border-red-500 text-red-700 hover:bg-red-50 font-semibold h-12 text-lg">Add New Contract</Button>
              </>
            )}
          </Form.List>
        </Form>
      </Modal>

      <Modal title={<span className="text-2xl text-amber-600! font-bold!">Order Group Details</span>} open={isViewModalOpen} onCancel={() => setIsViewModalOpen(false)} footer={null} width={900}>
        {renderOrderGroupView(selectedOrderGroup)}
      </Modal>

      <Modal title={<span className="text-2xl font-bold text-green-700">Wallet</span>} open={walletOpen} onCancel={() => setWalletOpen(false)} footer={null} width={1200}>
        <Wallet />
      </Modal>
    </div>
  );
}
