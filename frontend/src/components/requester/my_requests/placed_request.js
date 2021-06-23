import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import Dialog from "../../global_ui/dialog/dialog";
import Navbar from "../../global_ui/nav";
import styles from "./placed_request.module.css";

const PlacedRequest = () => {
    const history = useHistory();
    const {
        location: {
            state: { request },
        },
    } = history;
    const [dialogData, setDialogData] = useState({ show: false, msg: "" });
    const statusStyle = {
        color: request.requestStatus === "PENDING" ? "red" : "green",
        fontWeight: "bold",
        fontSize: 1.2 + "em",
    };
    
    return (
        <>
        <Dialog
                    isShowing={dialogData.show}
                    msg={dialogData.msg}
                    confirmDialog
                    onOK={()=>setDialogData({show: false, msg: "" })}
                    onCancel={() => setDialogData({show: false, msg: "" })}
                />
            <Navbar
                back="my_requests"
                style={{
                    color: "white",
                    background: "#79cbc5",
                    marginBottom: 0.75 + "em",
                }}
                title="Order Details"
            />
            <div className={styles.container}>
                

                <p>Request #{request.requestNumber}</p>
                <span>
                    Order Status:{" "}
                    <span style={statusStyle}> {request.requestStatus}</span>
                </span>

                {request.requestStatus[0] === "D" && (
                    <p>Order delivered by {request.riderID.name}</p>
                )}
                <Address />
                {request.itemsListImages.length > 0 ? (
                    <ItemsRequestedImagesAndOthers
                        bills={request.billsImageList}
                        items={request.itemsListImages}
                        images={request.rideImages}
                    />
                ) : (
                    <>
                        <ItemsRequestedList
                            list={request.itemsListList}
                            category={request.itemCategories}
                        />
                        <ItemsRequestedImagesAndOthers
                            bills={request.billsImageList}
                            images={request.rideImages}
                        />
                    </>
                )}

                {request.requestStatus[0] != "D" && (
                    <BottomButton setDialogData={setDialogData} />
                )}
            </div>
        </>
    );
};

export default PlacedRequest;

const BottomButton = ({ setDialogData }) => {
    return (
        <div className={styles.buttonsContainer}>
            <button
                onClick={() =>{
                    setDialogData({
                        show: true,
                        msg: "Are you sure you want to cancel",
                    })
                }}
            >
                Cancel Request
            </button>
            <button
                onClick={() =>
                  {
                    setDialogData({
                        show: true,
                        msg: "Are you sure you want to confirm delivery",
                    })
                  }
                }
            >
                Confirm Request
            </button>
        </div>
    );
};

const ItemsRequestedImagesAndOthers = ({ bills, images, items = [] }) => {
    return (
        <div className={styles.imagesContainer}>
            {items.map((link) => (
                <div className={styles.singleImage} key={link}>
                    <img src={link} alt="items-img" />
                    <span>Items</span>
                </div>
            ))}
            {bills.map((link, index) => (
                <div className={styles.singleImage} key={link}>
                    <img src={link} alt="items-img" />
                    <span>Bill #{index + 1}</span>
                </div>
            ))}
            {images.map((link) => (
                <div className={styles.singleImage} key={link}>
                    <img src={link} alt="items-img" />
                    <span>Rider-Selfie</span>
                </div>
            ))}
        </div>
    );
};

const ItemsRequestedList = ({ list, category }) => {
    return (
        <div className={styles.requested}>
            <span className={styles.irItems}>Items Requested</span>

            <div className={styles.category}>
                {category.map((cat) => (
                    <span
                        className={
                            cat[1] === "E" ? styles.catGreen : styles.catGray
                        }
                        key={cat}
                    >
                        {cat}
                    </span>
                ))}
            </div>
            <div className={styles.items}>
                {list.map((item) => (
                    <span key={item.itemName}>
                        {item.itemName} - {item.quantity}
                    </span>
                ))}
            </div>
        </div>
    );
};

const Address = () => {
    const {
        location: {
            state: { request },
        },
    } = useHistory();
    const type = request.requestType;
    const pickup = request.pickupLocationAddress;
    const drop = request.dropLocationAddress;
    const pCoordinates = request.pickupLocationCoordinates.coordinates;
    const dCoordinates = request.dropLocationCoordinates.coordinates;

    return (
        <div className={styles.addressContainer}>
            {type === "P&D" && <span>Pickup Location</span>}
            <div className={styles.address}>
                <span>Address</span>
                {pickup !== null ? (
                    <>
                        <span>{pickup.addressLine}</span>
                        <span>
                            {pickup.city} {pickup.pincode}
                        </span>
                    </>
                ) : (
                    <a
                        rel="noreferrer"
                        href={`https://www.google.com/maps/search/?api=1&query=${pCoordinates[0]},${pCoordinates[1]}`}
                        target="_blank"
                    >
                        Open in google maps
                    </a>
                )}
            </div>
            {drop !== null ||
                (dCoordinates && (
                    <>
                        <span>Drop Location</span>
                        <div className={styles.address}>
                            <span>Address</span>
                            {drop !== null ? (
                                <>
                                    <span>{drop.addressLine}</span>
                                    <span>
                                        {drop.city} {drop.pincode}
                                    </span>
                                </>
                            ) : (
                                <a
                                    rel="noreferrer"
                                    href={`https://www.google.com/maps/search/?api=1&query=${dCoordinates[0]},${dCoordinates[1]}`}
                                    target="_blank"
                                >
                                    Open in google maps
                                </a>
                            )}
                        </div>
                    </>
                ))}
        </div>
    );
};
