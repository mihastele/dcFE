import logo from './logo.svg';
import './App.css';
import {useEffect, useState} from "react";
import {z} from 'zod';

function App() {

    const [stores, setStores] = useState([]);
    const [storeAddress, setStoreAddress] = useState('');
    const [storePhoneNumber, setStorePhoneNumber] = useState('');
    const [servedBy, setServedBy] = useState('');
    const [email, setEmail] = useState('');
    const [btBroadband, setBtBroadband] = useState('');
    const [btTvPackage, setBtTvPackage] = useState('');
    const [sportPackage, setSportPackage] = useState('');
    const [monthlyCharge, setMonthlyCharge] = useState('');
    const [upfrontFee, setUpfrontFee] = useState('');
    const [installments, setInstallments] = useState('');
    const [otherInfo, setOtherInfo] = useState('');

    const [tableData, setTableData] = useState([]);

    const currentDate = new Date();
    const formattedDate = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`;


    const fetchdata = () => {
        fetch('http://localhost:8080/api/feature/dww-entries')
            .then(response => response.json())
            .then(data => {
                setTableData(data);
            }).catch(error => console.error(error));
    }

    useEffect(() => {
        fetch('http://localhost:8080/api/feature/stores')
            .then(response => response.json())
            .then(data => {
                setStores(data)
                setStoreAddress(data[0].storeAddress);
                setStorePhoneNumber(data[0].storePhoneNumber);
            }).catch(error => console.error(error));

        fetchdata();
    }, []);


    const onSelected = (e) => {
        fetch(`http://localhost:8080/api/feature/store/${e.target.value}`).then(response => response.json())
            .then(data => {
                setStoreAddress(data.storeAddress);
                setStorePhoneNumber(data.storePhoneNumber);
            }).catch(error => console.error(error));
    }

    const resetFields = () => {
        setServedBy('');
        setEmail('');
        setBtBroadband('');
        setBtTvPackage('');
        setSportPackage('');
        setMonthlyCharge('');
        setUpfrontFee('');
        setInstallments('');
        setOtherInfo('');
    }

    const submitForm = (e) => {
        e.preventDefault();

        const dataSchema = z.object({
            date: z.date(),
            servedBy: z.string(),
            email: z.string().email(),
            btBroadband: z.string(),
            BTTVPackage: z.string(),
            sportPackage: z.date(),
            monthlyCharge: z.number().positive(),
            upfrontFee: z.number().positive(),
            installmentsOfPayment: z.number().max(5), // Ensure that installmentsOfPayment is 5 or less
            otherHandyInfo: z.string().max(50), // Assuming otherHandyInfo should be 50 characters or less
        });

        const data = {
            store: {
                storeName: document.querySelector('select').value
            },
            date: currentDate,
            servedBy,
            email,
            btBroadband: btBroadband,
            BTTVPackage: btTvPackage,
            sportPackage: new Date(sportPackage),
            monthlyCharge: +monthlyCharge,
            upfrontFee: +upfrontFee,
            installmentsOfPayment: +installments,
            otherHandyInfo: otherInfo
        }

        // cleaner than if using useState('1')
        if(data.installmentsOfPayment <= 0) {
            data.installmentsOfPayment = 1;
        }

        console.log(data)
        console.log(JSON.stringify(data));
        // return;

        const validationResult = dataSchema.safeParse(data);

        if (validationResult.success) {
            console.log('Data is valid!');
        } else {
            console.log('Data is invalid:', validationResult.error);
            return;
        }

        fetch('http://localhost:8080/api/feature/dww-entry', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }).then(response => response.json())
            .then(data => {
                console.log('Success:', data);
                resetFields();

                fetchdata();
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }

    return (
        <div className="App">

            <form onSubmit={submitForm}>
                <div className="d-flex py-2 px-5">
                    <div className="d-flex w-50 flex-column">
                        <label className="text-start">Store name</label>
                        <select onChange={onSelected}>
                            {
                                stores.map(store => <option key={store.storeName} value={store.storeName}

                                >{store.storeName}</option>)
                            }
                        </select>
                    </div>
                </div>
                <div className="d-flex px-5">
                    <div className="d-flex w-100">
                        <div className="w-33 d-flex flex-column pe-2 py-2">
                            <label className="text-start">Date</label>
                            <input disabled type="date" value={formattedDate}/>
                        </div>
                        <div className="w-33 d-flex flex-column px-2 py-2">
                            <label className="text-start">Store Address</label>
                            <input disabled value={storeAddress}/>
                        </div>
                        <div className="w-33 d-flex flex-column ps-2 py-2">
                            <label className="text-start">Store Phone Number</label>
                            <input disabled value={storePhoneNumber}/>
                        </div>
                    </div>
                </div>
                <div className="d-flex px-5">
                    <div className="d-flex w-100">
                        <div className="w-33 d-flex flex-column pe-2 py-2">
                            <label className="text-start">Served By</label>
                            <input value={servedBy} onChange={(e) => setServedBy(e.target.value)}/>
                        </div>
                        <div className="w-33 d-flex flex-column px-2 py-2">
                            <label className="text-start">Email</label>
                            <input value={email} onChange={(e) => setEmail(e.target.value)}/>
                        </div>
                        <div className="w-33 d-flex flex-column ps-2 py-2">
                        </div>
                    </div>
                </div>
                <div className="d-flex px-5">
                    <div className="d-flex w-100">
                        <div className="w-33 d-flex flex-column pe-2 py-2">
                            <label className="text-start">BT Broadband is</label>
                            <input value={btBroadband} onChange={(e) => setBtBroadband(e.target.value)}/>
                        </div>
                        <div className="w-33 d-flex flex-column px-2 py-2">
                            <label className="text-start">BT TV package is</label>
                            <input value={btTvPackage} onChange={(e) => setBtTvPackage(e.target.value)}/>
                        </div>
                        <div className="w-33 d-flex flex-column ps-2 py-2">
                            <label className="text-start">Sport package is</label>
                            <input type="date" value={sportPackage} onChange={(e) => setSportPackage(e.target.value)}/>
                        </div>
                    </div>
                </div>
                <div className="d-flex px-5">
                    <div className="d-flex w-100">
                        <div className="w-33 d-flex flex-column pe-2 py-2">
                            <label className="text-start">Monthly charge</label>
                            <input placeholder="£" value={monthlyCharge}
                                   onChange={(e) => setMonthlyCharge(e.target.value)}/>
                        </div>
                        <div className="w-33 d-flex flex-column px-2 py-2">
                            <label className="text-start">Upfront fee</label>
                            <input placeholder="£" value={upfrontFee} onChange={(e) => setUpfrontFee(e.target.value)}/>
                        </div>
                        <div className="w-33 d-flex flex-column ps-2 py-2">
                            <label className="text-start">Installments of payments</label>
                            <select value={installments} onChange={(e) => setInstallments(e.target.value)}>
                                <option value={1}>1</option>
                                <option value={2}>2</option>
                                <option value={3}>3</option>
                                <option value={4}>4</option>
                                <option value={5}>5</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div className="d-flex py-2 px-5">
                    <div className="d-flex w-50 flex-column">
                        <label className="text-start">Other handy information</label>
                        <input maxLength="50" value={otherInfo} onChange={(e) => setOtherInfo(e.target.value)}/>
                    </div>
                </div>
                <input onClick={resetFields} type="button" value="Reset"/>
                <input type="submit" value="Submit"/>
            </form>

            <table>
                <thead>
                <tr>
                    <th>Store Name</th>
                    <th>Store Address</th>
                    <th>Store Phone Number</th>
                    <th>Date</th>
                    <th>Served By</th>
                    <th>Email</th>
                    <th>BT Broadband</th>
                    <th>BT TV Package</th>
                    <th>Sport Package</th>
                    <th>Monthly Charge</th>
                    <th>Upfront Fee</th>
                    <th>Installments</th>
                    <th>Other Info</th>
                    <th>Total Cost</th>
                </tr>
                </thead>
                <tbody>
                {
                    tableData.map((data, index) => {
                        return (
                            <tr key={index}>
                                <td>{data.store?.storeName}</td>
                                <td>{data.store?.storeAddress}</td>
                                <td>{data.store?.storePhoneNumber}</td>
                                <td>{data.date}</td>
                                <td>{data.servedBy}</td>
                                <td>{data.email}</td>
                                <td>{data.btBroadband}</td>
                                <td>{data.btTvPackage}</td>
                                <td>{data.sportPackage}</td>
                                <td>{data.monthlyCharge}</td>
                                <td>{data.upfrontFee}</td>
                                <td>{data.installmentsOfPayment}</td>
                                <td>{data.otherHandyInfo}</td>
                                <td>{data.totalContractCost}</td>
                            </tr>
                        )
                    })
                }
                </tbody>
            </table>
        </div>
    );
}

export default App;
