import React, { useEffect, useMemo, useState } from 'react'
import { Checkbox, Form } from 'antd'
import { WrapperCountOrder, WrapperInfo, WrapperItemOrder, WrapperLeft, WrapperListOrder, WrapperPriceDiscount, WrapperRight, WrapperStyleHeader, WrapperStyleHeaderDilivery, WrapperTotal } from './style';
import { WrapperInputNumber } from '../../components/ProductDetailsComponent/style';
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent';
import { DeleteOutlined, MinusOutlined, PlusOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from 'react-redux';
import { decreaseAmount, increaseAmount, removeAllOrderProduct, removeOrderProduct, selectedOrder } from '../../redux/slices/orderSlice';
import { convertPrice } from "./../../utils";
import ModalComponent from '../../components/ModalComponent/ModalComponent';
import InputComponent from '../../components/InputComponent/InputComponent';
import { useMutationHooks } from '../../hooks/userMutationHook';
import * as UserService from '../../services/UserService'
import * as message from '../../components/Message'
import { updateUser } from '../../redux/slices/userSlice';
import { useNavigate  } from 'react-router-dom';



const OrderPage = () => {
  const order = useSelector((state) => state.order)
  const [rowSelected, setRowSelected] = useState('')
  const user = useSelector((state) => state.user)
  const navigate = useNavigate()
  const [isOpenModalUpdateInfo, setIsOpenModalUpdateInfo] = useState(false)
  const [stateUserDetails, setStateUserDetails] = useState({
    name: '',
    phone: '',
    city: ''
  })
  const [form] = Form.useForm()
  const dispatch = useDispatch()
  const [listChecked, setListChecked] = useState([])
  const onChange = (e) => {
    console.log(`checked = ${e.target.value}`);

    if(listChecked.includes(e.target.value)){
      const newListChecked = listChecked.filter((item) => item !== e.target.value)
      setListChecked(newListChecked)
    }else{
      setListChecked([...listChecked, e.target.value])
    }
  }

  useEffect(() =>{
    dispatch(selectedOrder({listChecked}))
  }, [listChecked])

    useEffect(() =>{
      form.setFieldsValue(stateUserDetails)
    }, [form, stateUserDetails])

  useEffect(() =>{
    if(isOpenModalUpdateInfo){
      setStateUserDetails({
        city: user?.city,
        name: user?.name,
        phone: user?.phone
      })
    }
  }, [isOpenModalUpdateInfo])

  const handleChangeAddress = () => {
    setIsOpenModalUpdateInfo(true)
  }
  const handleChangeCount = (type, idProduct) => {
    if(type ==='increase'){
      dispatch(increaseAmount({idProduct}))
    }else{
      dispatch(decreaseAmount({idProduct}))
    }
  }
  const handleDeleteOrder = (idProduct) => {
    dispatch(removeOrderProduct({idProduct}))
  }
  const handleOnchangeCheckAll = (e) => {
    if(e.target.checked) {
      const newListChecked = []
      order?.orderItems?.forEach((item) => {
        newListChecked.push(item?.product)
      })
      setListChecked(newListChecked)
    }else{
      setListChecked([])
    }
  }

  const priceMemo = useMemo(() => {
    const result = order?.orderItemSelected?.reduce((total, cur) => {
      return total + ((cur.price * cur.amount));
    }, 0);
    return result;
  }, [order]);
  
  const priceDiscountMemo = useMemo(() => {
    const result = order?.orderItemSelected?.reduce((total, cur) => {
      return total + ((cur.discount * cur.amount));
    }, 0);
    if(Number(result)){
      return result
    }else{
      return 0
    }
  }, [order]);

  const deliveryPriceMemo = useMemo(() => {
    if(priceMemo > 100000){
      return 10000
    }else if (priceMemo ===0){
      return 0
    }else{
      return 20000
    }
  }, [priceMemo]);

  const handleRemoveAllOrder = () => {
    if(listChecked?.length > 1){
      dispatch(removeAllOrderProduct({listChecked}))
    }
  }
  const totalPriceMemo = useMemo(() => {
    return Number(priceMemo) + Number(priceDiscountMemo) + Number(deliveryPriceMemo);
  }, [priceMemo, priceDiscountMemo, deliveryPriceMemo]);
  
    const handleAddCart =() => {
      if(!order?.orderItemSelected?.length){
        message.error('Vui lòng chọn sản phẩm')
      }else if(!user?.phone || !user?.name || !user?.city){
        setIsOpenModalUpdateInfo(true)
      }else{
        navigate('/payment')
      }
    }
  const mutationUpdate = useMutationHooks(
    (data) => {
        const {  id,
        token,
      ...rests } = data
      const res =  UserService.updateUser(
          id,
          {...rests},
          token)
          return res
    },
   )
   const {data} = mutationUpdate
  const handleCancelUpdate = () => {
    setStateUserDetails({
      name: '',
      email: '',
      phone: '',
      isAdmin: false,
  })
  form.resetFields()
    setIsOpenModalUpdateInfo(false)
  }
  console.log('data', data)
  
  const handleUpdateInforUser = () =>{
    const {name, city, phone} = stateUserDetails
    if(name && city && phone){
      mutationUpdate.mutate({id: user?.id, token: user?.access_token, ...stateUserDetails},{
        onSuccess: () => {
          dispatch(updateUser({name, city, phone}))
          setIsOpenModalUpdateInfo(false)
        }
       })
    }
  }
  const handleOnchangeDetails = (e) => {
    setStateUserDetails({
      ...stateUserDetails,
      [e.target.name] : e.target.value
    })
  }
  console.log('stateUserDetails', stateUserDetails)
  return (
    <div style = {{background: '#f5f5fa', width: '100%', height: '100vh'}}>
      <div style = {{height: '100%', width: '1270px', margin: '0 auto'}}>
        <h3>Giỏ hàng</h3>
        <div style = {{display: 'flex', justifyContent: 'center'}}>
          <WrapperLeft>
            <WrapperStyleHeader>
              <span style = {{display: 'inline-block', width: '390px'}}>
                <Checkbox onChange = {handleOnchangeCheckAll} checked={listChecked?.length === order?.orderItems?.length}></Checkbox>
                <span>Tất cả ({order?.orderItems?.length} sản phẩm )</span>
              </span>
              <div style = {{flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                <span>Đơn giá</span>
                <span>Số lượng</span>
                <span>Thành tiền</span>
                <DeleteOutlined style = {{cursor: 'pointer'}} onClick={handleRemoveAllOrder}/>
              </div>
            </WrapperStyleHeader>
            <WrapperListOrder>
              {order?.orderItems?.map((order) => {
                console.log('checkOrder', order)
                return (
                  <WrapperItemOrder>
                <div style={{width: '390px', display: 'flex', alignItems: 'center', gap: 4}}>
                  <Checkbox onChange ={onChange} value = {order?.product} checked={listChecked.includes(order?.product)}></Checkbox>
                  <img src={order?.image} style={{width: '77px', height: '79px', objectFit: 'cover'}}/>
                  <div style = {{
                    width: '260px',
                    overflow:'hidden',
                    textOverflow:'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>{order?.name}</div>
                </div>
                <div style={{flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                  <span>
                    <span style = {{fontSize: '13px', color: '#242424'}}> {convertPrice(order?.price)} </span>
                  </span>
                  <WrapperCountOrder>
                  <button style={{ border: 'none', background: 'transparent', cursor: 'pointer' }} onClick={() => handleChangeCount('decrease', order?.product)}>
                          <MinusOutlined style={{ color: '#000', fontSize: '10px' }} />
                      </button>
                      <WrapperInputNumber defaultValue={order?.amount} value={order?.amount} size = 'small' />
                      <button style={{ border: 'none', background: 'transparent', cursor: 'pointer' }} onClick={() => handleChangeCount('increase', order?.product)}>
                          <PlusOutlined style={{ color: '#000', fontSize: '10px' }}/>
                      </button>
                  </WrapperCountOrder>
                  <span style={{color: 'rgb(255, 66, 78)', fontSize: '13px', fontWeight: 500}}>{convertPrice(order?.price * order?.amount)}</span>
                  <DeleteOutlined style = {{cursor: 'pointer', fontSize: '30px'}} onClick={() => handleDeleteOrder(order?.product)}/>
                  </div>
                  </WrapperItemOrder>
                  )
              })}
            </WrapperListOrder>
          </WrapperLeft>
          <WrapperRight>
          
          <div style={{width: '100%'}}>
          <WrapperInfo>
            <div>
              <span>Địa chỉ: </span>
              <span style={{fontWeight: 'bold', fontSize: '15px'}}>{user?.city}</span>
              <span onClick ={handleChangeAddress} style={{color: 'blue', fontSize: '15px', cursor: 'pointer'}}>Thay đổi</span>

            </div>
            </WrapperInfo>
          <WrapperInfo>
                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                  <span>Tạm tính</span>
                  <span style={{color: '#000', fontSize: '14px', fontWeight: 'bold'}}>{convertPrice(priceMemo)}</span>
                </div>
                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                  <span>Giảm giá</span>
                  <span style={{color: '#000', fontSize: '14px', fontWeight: 'bold'}}>{`${priceDiscountMemo} %`}</span>
                </div>
                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                  <span>Phí giao hàng</span>
                  <span style={{color: '#000', fontSize: '14px', fontWeight: 'bold'}}>{convertPrice(deliveryPriceMemo)}</span>
                </div>
              </WrapperInfo>
              <WrapperTotal>
                <span>Tổng tiền</span>
                <span style={{display:'flex', flexDirection: 'column'}}>
                  <span style={{color: 'rgb(254, 56, 52)', fontSize: '24px', fontWeight: 'bold'}}>{convertPrice(totalPriceMemo)}</span>
                  <span style={{color: '#000', fontSize: '11px'}}>(Đã bao gồm VAT nếu có)</span>
                </span>
              </WrapperTotal>
          </div>
          <ButtonComponent
          onClick = {() => handleAddCart()}
              size={40}
              styleButton={{
                  background: 'rgb(255, 57, 69)',
                  height: '48px',
                  width: '320px',
                  border: 'none',
                  borderRadius: '4px'
              }}
              textButton={'Mua hàng'}
              styleTextButton={{ color: '#fff', fontSize: '15px', fontWeight: '700' }}
          ></ButtonComponent>
          </WrapperRight>
        </div>
      </div>
      <ModalComponent forceRender title="Cập nhật thông tin giao hàng" open={isOpenModalUpdateInfo} onCancel={handleCancelUpdate} onOk={handleUpdateInforUser}>
      <Form
      name="basic"
      labelCol={{ span: 5 }}
      wrapperCol={{ span: 20 }}
      // onFinish={onUpdateUser}
      autoComplete="on"
      form = {form}
    >
      <Form.Item
        label="Họ và tên:"
        name="name"
        rules={[{ required: true, message: 'Điền họ và tên!' }]}
      >
        <InputComponent value={stateUserDetails['name']} onChange={handleOnchangeDetails} name = "name"/>
      </Form.Item>

      <Form.Item
        label="Số điện thoại"
        name="phone"
        rules={[{ required: true, message: 'Điền số điện thoại!' }]}
      >
        <InputComponent value={stateUserDetails.phone} onChange={handleOnchangeDetails} name = "phone"/>
      </Form.Item>

      <Form.Item
        label="Địa chỉ"
        name="city"
        rules={[{ required: true, message: 'Điền địa chỉ!' }]}
      >
        <InputComponent value={stateUserDetails['city']} onChange={handleOnchangeDetails} name = "city"/>
      </Form.Item>

    </Form>           
      </ModalComponent>
    </div>
  )
}

export default OrderPage