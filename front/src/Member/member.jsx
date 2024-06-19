import { useRef, useState, useEffect } from "react";
import CustomerOrders from "./customerOrders";
import ManufactureOrders from "./manufactureOrder";
import Chat from "./chat";
import Inventory from "./inventory";
import SupplyOrders from "./supplyOrder";
import './styles/fab.css'
import {useLocation} from 'react-router-dom'



const Member = () => {
    const customerOrdersRef = useRef(null);
    const manufactureOrdersRef = useRef(null);
    const teamChatRef = useRef(null);
    const inventoryRef = useRef(null);
    
    const location = useLocation()
    const [userData, setUserData] = useState(location.state.data)
    console.log(userData)

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
                        <h3>{userData.firstName} {userData.lastName}</h3>
                        <h4>Team Member</h4>
                    </div>
                </div>

                <div className="contentContainer">{renderTabContent()}</div>
            </div>
        </div>
    )
}

export default Member