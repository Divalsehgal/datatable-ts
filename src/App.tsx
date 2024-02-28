import { useEffect, useState } from "react";
import Table from "./components/Table";
import Dropdown from "./components/Dropdown";

interface TableColumn {
  key: string;
  label: string;
}

function App() {
  const columns:TableColumn[]=[
    { key: "ConsumedQuantity", label: "Consumed Quantity" },
    { key: "Cost", label: "Cost" },
    { key: "Date", label: "Date" },
    { key: "InstanceId", label: "Instance ID" },
    { key: "MeterCategory", label: "Meter Category" },
    { key: "ResourceGroup", label: "Resource Group" },
    { key: "ResourceLocation", label: "Resource Location" },
    { key: "UnitOfMeasure", label: "Unit of Measure" },
    { key: "Location", label: "Location" },
    { key: "ServiceName", label: "Service Name" },
  ];
  const [selectedValue, setSelectedValue] = useState<string>("");

  const [resourceType, setResourceType] = useState([]);
  const [resourceData, setResourceData] = useState<TableColumn[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resourcesResponse, rawDataResponse] = await Promise.all([
          fetch("https://engineering-task.elancoapps.com/api/resources"),
          fetch("https://engineering-task.elancoapps.com/api/raw"),
        ]);

        const resourcesData = await resourcesResponse.json();
        const rawData = await rawDataResponse.json();
        const resourceTypes = resourcesData.map(
          (resource: any, index: number) => ({
            key: index,
            label: resource,
          })
        );
        setResourceType(resourceTypes);
        setResourceData(rawData);
      } catch (error) {
        console.log("Error:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (selectedValue === "") {
      return;
    }
    const fetchFilteredData = async () => {
      try {
        const filteredResponse = await fetch(
          `https://engineering-task.elancoapps.com/api/resources/${selectedValue}`
        );

        const filteredData = await filteredResponse.json();

        setResourceData(filteredData);
      } catch (error) {
        console.log("Error:", error);
      }
    };
    fetchFilteredData();
  }, [selectedValue]);

  const handleChange = (selectedValue: string) => {
    setSelectedValue(selectedValue);
  };

  return (
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-4">Resources Visualization</h1>
        Filter By resource:{" "}
        <Dropdown
          options={resourceType}
          value={selectedValue}
          onChange={handleChange}
        />
        <div className="min-w-full bg-white">
          {columns.length > 0 && (
            <Table columns={columns} data={resourceData} itemsPerPage={20} />
          )}
        </div>
      </div>
  );
}

export default App;
