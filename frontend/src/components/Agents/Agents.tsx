import classes from "./Agents.module.css";
import AgentsInstance from "../../store/Agents";
import {observer} from "mobx-react-lite";
import {toJS} from "mobx";
import {Title} from "../common/Title/Title";
import {useEffect} from "react";
import MUIDataTable from "mui-datatables";

export const Agents = observer(() => {
    useEffect(() => {
        if (!toJS(AgentsInstance.agents)) AgentsInstance.loadAgents();
    }, []);

    const columns = [
        {
            name: "Name",
            options: {
                filter: false,
                sort: true
            }
        },
        {
            name: "Full Name",
            options: {
                filter: false,
                sort: true
            }
        },
        {
            name: "Email",
            options: {
                filter: false,
                sort: true
            }
        },
        {
            name: "Office",
            options: {
                filter: true,
                sort: true
            }
        }
    ];


    const data = AgentsInstance.agents ?
        AgentsInstance.agents.map(item => [item.Name, item.FullName, item.Email, item.Office]) : [[""]]

    return (
        <div>
            <Title text={"Агенты"}/>
            <div className={classes.table}>
                <MUIDataTable
                    title={"Список Агентов"}
                    data={data}
                    columns={columns}
                    options={{
                        pagination: false,
                        selectableRows: "none",
                        print: false
                    }}
                />
            </div>
        </div>
    )
});
