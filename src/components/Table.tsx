import React, { useState, useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";

interface TableColumn {
  key: string;
  label: string;
}

interface TableData {
  [key: string]: any;
}

interface TableProps {
  columns: TableColumn[];
  data: TableData[];
  itemsPerPage: number;
}

const Table: React.FC<TableProps> = ({ columns, data, itemsPerPage }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [displayData, setDisplayData] = useState<TableData[]>([]);
  const [isFetching, setIsFetching] = useState(false);

  const [sortedColumn, setSortedColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [totalItems, setTotalItemsLength] = useState(0);
  
  const lastElementRef = useRef<HTMLTableRowElement | null>(null);

  useEffect(() => {
    setTotalItemsLength(data?.length);
    setDisplayData(data.slice(0, itemsPerPage));
  }, [data, itemsPerPage]);

  const handleSort = (columnKey: string) => {
    if (columnKey === sortedColumn) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortedColumn(columnKey);
      setSortDirection("asc");
    }
  };

  const loadMoreData = () => {
    let timer = 0;
    clearTimeout(timer);
    if (currentPage < totalItems && !isFetching) {
      setIsFetching(true);
      timer = setTimeout(() => {
        const startIndex = currentPage * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const newData = [...displayData, ...data.slice(startIndex, endIndex)];
        setDisplayData(newData);
        setCurrentPage(currentPage + 1);
        setIsFetching(false);
      }, 1000);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (
        lastElementRef.current &&
        lastElementRef.current.getBoundingClientRect().bottom <=
          window.innerHeight
      ) {
        loadMoreData();
      }
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          loadMoreData();
        }
      },
      { root: null, rootMargin: "0px", threshold: 0.1 }
    );

    if (lastElementRef.current) {
      observer.observe(lastElementRef.current);
    }

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      observer.disconnect();
    };
  }, [isFetching, totalItems]);

  const sortedData = sortedColumn
    ? [...displayData].sort((a, b) => {
        const valueA = a[sortedColumn];
        const valueB = b[sortedColumn];
        if (valueA < valueB) return sortDirection === "asc" ? -1 : 1;
        if (valueA > valueB) return sortDirection === "asc" ? 1 : -1;
        return 0;
      })
    : displayData;

  return (
    <table className="w-full border-collapse table-auto">
      <thead>
        <tr>
          <th className="px-4 py-2 bg-gray-200 text-left text-gray-800">#</th>
          {columns.map((column) => (
            <th
              key={column.key}
              className="px-4 py-2 bg-gray-200 text-left text-gray-800"
              onClick={() => handleSort(column.key)}
            >
              {column.label}
              {sortedColumn === column.key && (
                <span>{sortDirection === "asc" ? " ▲" : " ▼"}</span>
              )}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {sortedData.map((row, index) => {
          const rowId = uuidv4();
          return (
            <tr
              key={rowId}
              ref={index === sortedData.length - 1 ? lastElementRef : null}
            >
              <td>{index + 1}</td>
              {columns.map((column) => (
                <td
                  key={`${rowId}-${column.key}`}
                  className="px-4 py-2 border-b border-gray-200"
                >
                  {row[column.key]}
                </td>
              ))}
            </tr>
          );
        })}
      </tbody>
      {currentPage < totalItems && (
        <tfoot>
          <tr>
            <td colSpan={columns.length}>{isFetching ? "loading..." : ""}</td>
          </tr>
        </tfoot>
      )}
    </table>
  );
};

export default Table;
