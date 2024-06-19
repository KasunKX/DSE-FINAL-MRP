import React, { useState, useRef } from 'react';

import CustomerManagement from './customerManagement';
import CustomerOrders from './customerOrders';
import ManufactureOrders from './manufactureOrder';
import SupplyOrders from './supplyOrder';
import Inventory from './inventory';
import EmployeeManagement from './employeeManage';
import Chat from './chat';

// import Select, { SelectChangeEvent } from '@mui/material/Select';

import './styles/manager.css';

const Manager = () => {
    const customerOrdersRef = useRef(null);
    const manufactureOrdersRef = useRef(null);
    const supplyOrdersRef = useRef(null);
    const employeeManagementRef = useRef(null);
    const customerManagementRef = useRef(null);
    const teamChatRef = useRef(null);
    const inventoryRef = useRef(null);

    const [activeTab, setActiveTab] = useState(customerOrdersRef);
    const [activeTabContent, setActiveTabContent] = useState(<CustomerOrders />); // Initialize with default content

    const manageTab = (tab) => {
        activeTab.current.classList.remove('active');
        tab.current.classList.add('active');
        setActiveTab(tab);
    };

    const renderTabContent = () => {
        switch (activeTab) {
            case customerOrdersRef:
                return <CustomerOrders />;
            case manufactureOrdersRef:
                return <ManufactureOrders />;
            case supplyOrdersRef:
                return <SupplyOrders />;
            case employeeManagementRef:
                return <EmployeeManagement />;
            case customerManagementRef:
                return <CustomerManagement />;
            case teamChatRef:
                return <Chat />;
            case inventoryRef:
                return <Inventory />;
            default:
                return <CustomerOrders />; 
        }
    };

    return (
        <div className="container">
            <nav></nav>
            <div className="content">
                <div className="sidebar">
                    <div className="tabContainer">
                        <div
                            ref={customerOrdersRef}
                            className="active customerOrders sidebarItem"
                            onClick={() => {
                                manageTab(customerOrdersRef);
                                setActiveTabContent(<CustomerOrders />);
                            }}
                        >
                            <img src="" alt="" />
                            <h2>Customer Orders</h2>
                        </div>

                        <div
                            ref={manufactureOrdersRef}
                            className="manufactureOrder sidebarItem"
                            onClick={() => {
                                manageTab(manufactureOrdersRef);
                                setActiveTabContent(<ManufactureOrders />);
                            }}
                        >
                            <img src="" alt="" />
                            <h2>Manufacture Orders</h2>
                        </div>

                        <div
                            ref={supplyOrdersRef}
                            className="supplyOrders sidebarItem"
                            onClick={() => {
                                manageTab(supplyOrdersRef);
                                setActiveTabContent(<SupplyOrders />);
                            }}
                        >
                            <img src="" alt="" />
                            <h2>Supply Orders</h2>
                        </div>

                        <div
                            ref={employeeManagementRef}
                            className="employeeManagement sidebarItem"
                            onClick={() => {
                                manageTab(employeeManagementRef);
                                setActiveTabContent(<EmployeeManagement />);
                            }}
                        >
                            <img src="" alt="" />
                            <h2>Employee Management</h2>
                        </div>

                        <div
                            ref={inventoryRef}
                            className="customerManagement sidebarItem"
                            onClick={() => {
                                manageTab(inventoryRef);
                                setActiveTabContent(<Inventory />);
                            }}
                        >
                            <img src="" alt="" />
                            <h2>Inventory</h2>
                        </div>

                        <div
                            ref={customerManagementRef}
                            className="customerManagement sidebarItem"
                            onClick={() => {
                                manageTab(customerManagementRef);
                                setActiveTabContent(<CustomerManagement />);
                            }}
                        >
                            <img src="" alt="" />
                            <h2>Customer Management/Inquiries</h2>
                        </div>

                        <div
                            ref={teamChatRef}
                            className="teamChat sidebarItem"
                            onClick={() => {
                                manageTab(teamChatRef);
                                setActiveTabContent(<Chat />);
                            }}
                        >
                            <img src="" alt="" />
                            <h2>Team Chat</h2>
                        </div>
                    </div>

                    <div className="userDetails">
                        <h3>Kasun Kalhara</h3>
                        <h4>Manager</h4>
                    </div>
                </div>

                <div className="contentContainer">{renderTabContent()}</div>
            </div>
        </div>
    );
};

export default Manager;
