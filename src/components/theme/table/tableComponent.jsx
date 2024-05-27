import React from "react";
import { Table } from "antd";
import { DEFAULT_TABLE_LIMIT } from "../../constant/constant";


const TableComponent = (props) => {
    const {
        rowSelection,
        rowKey = "",
        columns = [],
        dataSource = [],
        pagination = {},
        loading,
        onTableChange,
        className,
        scroll = {},
    } = props;
    
    const onChange = (changePagination, changeFilters, changeSorter) => {
        if (typeof onTableChange === "function") {
            let sePagination = {};
            const seFilters = {};
            let seSorter = {};
            if (
                changePagination &&
                changePagination?.current &&
                changePagination?.pageSize
            ) {
                // FIND LIMIT
                const limit = changePagination?.pageSize || DEFAULT_TABLE_LIMIT;

                sePagination = {
                    ...changePagination,
                    skip: changePagination?.current * limit - limit,
                };
            }
            if (changeSorter?.field && changeSorter?.order) {
                seSorter = {
                    orderBy: `${changeSorter?.field}|${changeSorter?.order === "ascend" ? "asc" : "desc"
                        }`,
                };
            }
            onTableChange({
                pagination: sePagination,
                filters: seFilters,
                sorter: seSorter,
            });
        }
    };

    return (
        <Table
            rowSelection={rowSelection}
            rowKey={rowKey}
            columns={columns}
            dataSource={dataSource}
            onChange={onChange}
            className={className}
            loading={loading}
            pagination={pagination}
            scroll={scroll}
        />
    );
};

export default TableComponent;
