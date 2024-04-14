import { Menu } from 'antd'
import React, { useState } from 'react'
import { getItem } from '../../utils';
import {UserOutlined, BookOutlined, ShoppingCartOutlined } from '@ant-design/icons'
import HeaderComponent from '../../components/HeaderComponent/HeaderComponent';
import AdminUser from '../../components/AdminUser/AdminUser';
import AdminProduct from '../../components/AdminProduct/AdminProduct';
import OrderAdmin from '../../components/OrderAdmin/OrderAdmin';
const AdminPage = () => {
  const items = [
    getItem('Người dùng', 'user',<UserOutlined />),
    getItem('Truyện', 'product', <BookOutlined />),
    getItem('Đơn hàng', 'order', <ShoppingCartOutlined />)

  ];
  const rootSubmenuKeys = ['user', 'product'];
  const [keySelected, setKeySelected] = useState('')
  const renderPage = (key) => {
    switch(key) {
      case 'user':
        return(
          <AdminUser />
        )
        case 'product':
          return(
            <AdminProduct/>
          )
          case 'order':
            return(
              <OrderAdmin/>
            )
        default:
          return <></> 
    }

  }

  const handleonClick = ({key}) => {
    setKeySelected(key)
  }
  console.log('keySelected', keySelected)
  return (
  <>
    <HeaderComponent isHiddenSearch isHiddenCart/>
    <div style = {{display: 'flex'}}>
    <Menu
      mode="inline"

      style={{ width: 256, boxShadow:'1px 1px 2px #ccc', height:'100vh'}}
      items={items}
      onClick={handleonClick}
    />
      <div style={{flex: 1, padding: '15px'}}>
          {renderPage(keySelected)}
      </div>
    </div>
    </>
  )
}

export default AdminPage