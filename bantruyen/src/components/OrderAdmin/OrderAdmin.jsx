import React, { useEffect, useRef, useState } from 'react'
import { WrapperHeader } from './style'
import { Button, Form, Space } from 'antd'
import TableComponent from '../TableComponent/TableComponent'
import InputComponent from '../InputComponent/InputComponent'
import DrawerComponent from '../DrawerComponent/DrawerComponent'
import { WrapperUploadFile } from '../AdminProduct/style'
import ModalComponent from '../ModalComponent/ModalComponent'
import { getBase64 } from '../../utils'
import * as message from '../Message'
import { useSelector } from 'react-redux'
import { useMutationHooks } from '../../hooks/userMutationHook'
import * as OrderService from '../../services/OrderService'
import { useQuery } from '@tanstack/react-query'
import { UserAddOutlined, UploadOutlined, DeleteOutlined, EditOutlined, SearchOutlined } from '@ant-design/icons'
import { orderContant } from "./../../contant";
import PieChartComponent from './PieChart'


const OrderAdmin = () => {
  const user = useSelector((state) => state?.user)
  const [isOpenDrawer, setIsOpenDrawer] = useState(false)
  const [rowSelected, setRowSelected] = useState('')
  const [isModalOpenDelete, setIsModalOpenDelete ] = useState(false)
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef(null);


const  getAllOrder = async() => {
  const res = await OrderService.getAllOrder(user?.access_token)
  console.log('res', res)
  return res
}

console.log('rowSelected', rowSelected)
const queryOrder = useQuery({queryKey: ['orders'], queryFn: getAllOrder})
const { data: orders } = queryOrder

const handleSearch = (selectedKeys, confirm, dataIndex) => {
  confirm();
  // setSearchText(selectedKeys[0]);
  // setSearchedColumn(dataIndex);
};
const handleReset = (clearFilters) => {
  clearFilters();
  // setSearchText('');
}; 
const getColumnSearchProps = (dataIndex) => ({
  filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
    <div
      style={{
        padding: 8,
      }}
      onKeyDown={(e) => e.stopPropagation()}
    >
      <InputComponent
        // ref={searchInput}
        placeholder={`Search ${dataIndex}`}
        value={`${selectedKeys[0] || ''}`}
        onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
        onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
        style={{
          marginBottom: 8,
          display: 'block',
        }}
      />
      <Space>
        <Button
          type="primary"
          // onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
          icon={<SearchOutlined />}
          size="small"
          style={{
            width: 90,
          }}
        >
          Search
        </Button>
        <Button
          // onClick={() => clearFilters && handleReset(clearFilters)}
          size="small"
          style={{
            width: 90,
          }}
        >
          Reset
        </Button>
      </Space>
    </div>
  ),
  filterIcon: (filtered) => (
    <SearchOutlined
      style={{
        color: filtered ? '#1890ff' : undefined,
      }}
    />
  ),
  onFilter: (value, record) =>
    record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
  onFilterDropdownOpenChange: (visible) => {
    if (visible) {
      setTimeout(() => searchInput.current?.select(), 100);
    }
  },
  // render: (text) =>
  //   searchedColumn === dataIndex ? (
  //     // <Highlighter
  //     //   highlightStyle={{
  //     //     backgroundColor: '#ffc069',
  //     //     padding: 0,
  //     //   }}
  //     //   searchWords={[searchText]}
  //     //   autoEscape
  //     //   textToHighlight={text ? text.toString() : ''}
  //     // />
  //   ) : (
  //     text
  //   ),
});


const columns = [
  {
    title: 'Tên người đặt hàng',
    dataIndex: 'userName',
    render: (text) => <a>{text}</a>,
    sorter: (a, b) => a.userName.length - b.userName.length,
    ...getColumnSearchProps('userName')
  },
  {
    title: 'Số điện thoại',
    dataIndex: 'phone',
    render: (text) => <a>{text}</a>,
    sorter: (a, b) => a.phone.length - b.phone.length,
    ...getColumnSearchProps('phone')
  },
  {
    title: 'Giá sản phẩm',
    dataIndex: 'itemsPrice',
    render: (text) => <a>{text}</a>,
    sorter: (a, b) => a.itemsPrice.length - b.itemsPrice.length,
    ...getColumnSearchProps('itemsPrice')
  },
  {
    title: 'Phương thức thanh toán',
    dataIndex: 'paymentMethod',
    render: (text) => <a>{text}</a>,
    sorter: (a, b) => a.paymentMethod.length - b.paymentMethod.length,
    ...getColumnSearchProps('paymentMethod')
  },
  {
    title: 'Đã thanh toán hay chưa',
    dataIndex: 'isPaid',
    render: (text) => <a>{text}</a>,
    sorter: (a, b) => a.isPaid.length - b.isPaid.length,
    ...getColumnSearchProps('isPaid')
  },
  {
    title: 'Tiền ship',
    dataIndex: 'shippingPrice',
    render: (text) => <a>{text}</a>,
    sorter: (a, b) => a.shippingPrice.length - b.shippingPrice.length,
    ...getColumnSearchProps('shippingPrice')
  },
  {
    title: 'Tổng tiền',
    dataIndex: 'totalPrice',
    render: (text) => <a>{text}</a>,
    sorter: (a, b) => a.totalPrice.length - b.totalPrice.length,
    ...getColumnSearchProps('totalPrice')
  },
  {
    title: 'Đã giao hàng hay chưa',
    dataIndex: 'isDelivered',
    render: (text) => <a>{text}</a>,
    sorter: (a, b) => a.isDelivered.length - b.isDelivered.length,
    ...getColumnSearchProps('isDelivered')
  },
  {
    title: 'Ngày mua',
    dataIndex: 'updatedAt',
    render: (text) => <a>{text}</a>,
    sorter: (a, b) => a.updatedAt.length - b.updatedAt.length,
    ...getColumnSearchProps('updatedAt')
  },


];
  // const showModal = () => {
  //   setIsModalOpen(true);
  // };




const dataTable = orders?.data?.length && orders?.data?.map((order) => {
  console.log('usear', order)
  
  return {...order, key: order._id, userName: order?.shippingAddress?.fullName, phone: order?.shippingAddress?.phone, city: order?.shippingAddress?.city,
  paymentMethod: orderContant.payment[order?.paymentMethod], isPaid: order?.isPaid ? 'ĐÃ THANH TOÁN':'CHƯA THANH TOÁN', isDelivered: order?.isDelivered ? 'ĐÃ GIAO HÀNG':'CHƯA GIAO HÀNG'}
}) 
return (
  <div>
    <WrapperHeader>Quản lý đơn hàng</WrapperHeader>
    <div style={{ height: 200, width: 200 }}>
      <PieChartComponent data={orders?.data} />
    </div>
    <div style={{ marginTop: "10px" }}>
      <TableComponent columns={columns} data={dataTable} />
    </div>
  </div>
);
}

export default OrderAdmin