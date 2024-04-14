import { Table } from 'antd';
import React, { useState } from 'react'

const TableComponent = (props) => {
    const {selectionType = 'checkbox', data = [], columns = [], handleDeleteManyProducts} = props
    const [rowSelectedKeys, setRowSelectedKeys] = useState([])
      
      // rowSelection object indicates the need for row selection
      const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
          setRowSelectedKeys(selectedRowKeys)
        },
        // getCheckboxProps: (record) => ({
        //   disabled: record.name === 'Disabled User',
        //   // Column configuration not to be checked
        //   name: record.name,
        // }),
      };

      const handleDeleteAll =() =>{
        handleDeleteManyProducts(rowSelectedKeys)
      }
      
console.log('data', data)
  return (
    <div>
      {rowSelectedKeys.length > 0 && (
      <div style = {{
        background: 'red',
        color: '#fff',
        fontWeight: 'bold',
        padding: '10px',
        cursor: 'pointer'}}
        onClick = {handleDeleteAll}
        >

        Xóa tất cả
      </div>
      )}

    <Table
        rowSelection={{
            type: selectionType,
            ...rowSelection,
        }}
        columns={columns}
        dataSource={data}
        {...props}
    />
  </div>
  )
}

export default TableComponent