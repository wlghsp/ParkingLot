import {useEffect, useState} from "react";
import ParkingLot from "../../lib/parking-lot.js";
import styles from "./main.module.scss";
import {ParkingSlot} from "../../components/ParkingSlot/index.js";
import {InfoBoard} from "../../components/InfoBoard/index.js";
import {Controls} from "../../components/Controls/Controls.jsx";
import {Car} from "../../components/Car/index.js";


const ROW_LIMIT = 5;
export const Main = ({ slotsCount }) => {
    const [parkingLot, setParkingLot] = useState(null);
    const [availableSlots, setAvailableSlots] = useState(slotsCount);
    const [rows, setRows] = useState([]);
    const [carAnimation, setCarAnimation] = useState(true);
    const [infoBoardVisible, setInfoBoardVisible] = useState(false);

    useEffect(() => {
        setParkingLot(new ParkingLot(slotsCount));
    }, [slotsCount]);

    useEffect(() => {
        function distributeSlotsToRows() {
            let rowsCount = Math.ceil(slotsCount / ROW_LIMIT);
            const rows = [];
            let row = [];

            while (slotsCount > 0 && rowsCount > 0) {
                // It's important first to decrement the count of the slots otherwise we will miss one
                slotsCount--;

                const slot = parkingLot?.slots[slotsCount];
                const isSlotTaken = slot !== null && slot !== undefined;
                row.push({
                    slotNum: slotsCount,
                    isBusy: isSlotTaken,
                    numberPlate: slot,
                });

                if (slotsCount % ROW_LIMIT === 0) {
                    rowsCount--;
                    rows.push(row);
                    row = [];
                }
            }
            setRows(rows);
        }

        distributeSlotsToRows();
    }, [slotsCount, availableSlots]);

    const handleAddToParking = (carId) => {
        if (parkingLot.isFull()) {
            setInfoBoardVisible(true);
            return;
        }

        parkingLot.park(carId);
        setAvailableSlots(parkingLot.getAvailable());
        setCarAnimation((state) => !state);
    };

    const handleRemoveFromParking = (carId) => {
        if (carId) {
            parkingLot.remove(carId);
            setAvailableSlots(parkingLot.getAvailable());
            setCarAnimation((state) => !state);
        }
    };

    const handleGetInfo = () => {
        setInfoBoardVisible((state) => !state);
    };

    return (
        <>
            <section className={styles.main}>
                {rows.map((row, idx) => (
                    <div key={row + idx} className={styles.row}>
                        {row.map(({slotNum, isBusy, numberPlate}) => (
                            <ParkingSlot
                                remove={handleRemoveFromParking}
                                key={slotNum + idx }
                                num={slotNum}
                                isBusy={isBusy}
                                numberPlate={numberPlate}
                            />
                        ))}
                    </div>
                ))}
            </section>
            <section className={styles.dashboard}>
                <InfoBoard availableSlotsCount={availableSlots}/>
                <Controls add={handleAddToParking} getInfo={handleGetInfo}/>
                <div className={styles.footerNote}>
                    Click on a busy parking slot to unpark the car.
                </div>
                <Car animationState={carAnimation} />
            </section>
        </>
    )
}