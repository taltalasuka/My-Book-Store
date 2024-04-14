import React, { useState } from 'react'
import {Badge, Button, Col, Popover} from 'antd'
import { WrapperContentPopup, WrapperHeader, WrapperHeaderAccount, WrapperTextHeader, WrapperTextHeaderSmall } from './style'
import Search from 'antd/es/input/Search'
import * as UserService from '../../services/UserService'

import {
  UserOutlined,
  CaretDownOutlined,
  ShoppingCartOutlined
} from '@ant-design/icons';
import ButtonInputSearch from '../ButtonInputSearch/ButtonInputSearch';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { resetUser, updateUser } from '../../redux/slices/userSlice';
import { searchProduct } from '../../redux/slices/productSlice'


const HeaderComponent = ( {isHiddenSearch=false, isHiddenCart = false}) => {
  const navigate = useNavigate()
  const user = useSelector((state) => state.user)
  const [search, setSearch] = useState('')
  const order = useSelector ((state) => state.order)
  const dispatch = useDispatch()
  const handleNavigateLogin = () =>{
    navigate('/sign-in')
  }

  const handleLogout = async() => {
    await UserService.logoutUser()
    dispatch(resetUser())
  }
  const content = (
    <div style={{marginRight: '50px'}}>
      <WrapperContentPopup onClick={() => navigate(`/my-order`)}>Đơn hàng của tôi</WrapperContentPopup>
      <WrapperContentPopup style={{color: 'red'}} onClick={handleLogout}>Đăng Xuất</WrapperContentPopup>
      {user?.isAdmin && (
              <WrapperContentPopup onClick={() => navigate('/system/admin')}>Quản lý hệ thống</WrapperContentPopup>
      )}
      

    </div> 
  );

  const onSearch = (e) => {
    setSearch(e.target.value)
    dispatch(searchProduct(e.target.value))
  }

  console.log('user', user)
  return (
    <div style={{width: '100%', background: '#093155', display: 'flex', justifyContent:'center'}}>
    <WrapperHeader style = {{justifyContent: isHiddenSearch && isHiddenSearch ? 'space-between' : 'unset'}}>
      <Col span={5}>
          <WrapperTextHeader onClick={() => {navigate('/')}} style={{cursor: 'pointer'}}>
            TRUYENTRANH24
          </WrapperTextHeader>
      </Col>

      {!isHiddenSearch && (
      <Col span={12}>
      <ButtonInputSearch
      size = "medium"
      textButton = "Tìm kiếm"
      placeholder= "Tìm kiếm"
      onChange = {onSearch}
      />
      </Col>
      )}

        
<Col span={6} style = {{display: 'flex', alignItems: 'center'}}>
      <WrapperHeaderAccount>
      <UserOutlined style= {{fontSize: '30px', marginLeft:'-50px' }}/>
          {user?.name ? (
            <>
            <Popover content={content} trigger="click">
            <div style={{cursor: 'pointer', marginTop: '-20px'}} >{user.name}</div>
            </Popover>
            </>
          ): (
            <div style={{marginTop:'-30px', cursor: 'pointer'}}  onClick={handleNavigateLogin}>
            <span style={{fontSize:'12px'}}>Đăng nhập/Đăng ký</span>
              <div>
              <span>Tài khoản</span>
                <CaretDownOutlined />
              </div>
           </div>
          )}
          
        {!isHiddenCart && (
        <div onClick={() => navigate('/order')} style={{cursor: 'pointer', marginLeft: '80px', marginTop: '-23px'}} >
        <Badge count={order?.orderItems.length} size="small"  >
            <ShoppingCartOutlined style= {{fontSize: '30px', color: '#fff'}} />
        
              <WrapperTextHeaderSmall>Giỏ hàng</WrapperTextHeaderSmall>
              </Badge>
                                
      </div>
      
        )}
        </WrapperHeaderAccount>
        </Col>

    </WrapperHeader>
  </div>
  )
}

export default HeaderComponent