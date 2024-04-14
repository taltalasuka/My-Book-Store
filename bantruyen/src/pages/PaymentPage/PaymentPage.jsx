  import React, { useEffect, useMemo, useState } from 'react'
  import { Checkbox, Form, Radio } from 'antd'
  import { Lable, WrapperCountOrder, WrapperInfo, WrapperItemOrder, WrapperLeft, WrapperListOrder, WrapperPriceDiscount, WrapperRadio, WrapperRight, WrapperStyleHeader, WrapperStyleHeaderDilivery, WrapperTotal } from './style';
  import { WrapperInputNumber } from '../../components/ProductDetailsComponent/style';
  import ButtonComponent from '../../components/ButtonComponent/ButtonComponent';
  import { DeleteOutlined, MinusOutlined, PlusOutlined } from "@ant-design/icons";
  import { useDispatch, useSelector } from 'react-redux';
  import { decreaseAmount, increaseAmount, removeAllOrderProduct, removeOrderProduct, selectedOrder } from '../../redux/slices/orderSlice';
  import { convertPrice } from "../../utils";
  import ModalComponent from '../../components/ModalComponent/ModalComponent';
  import InputComponent from '../../components/InputComponent/InputComponent';
  import { useMutationHooks } from '../../hooks/userMutationHook';
  import * as UserService from '../../services/UserService'
  import * as message from '../../components/Message'
  import { updateUser } from '../../redux/slices/userSlice';
  import * as OrderService from '../../services/OrderService'
import { useNavigate } from 'react-router-dom';

  const PaymentPage = () => {
    const order = useSelector((state) => state.order)
    const user = useSelector((state) => state.user)
    const navigate = useNavigate()
    const [payment, setPayment] = useState('cod')
    const [delivery, setDelivery] = useState('fast')
    const [isOpenModalUpdateInfo, setIsOpenModalUpdateInfo] = useState(false)
    const [stateUserDetails, setStateUserDetails] = useState({
      name: '',
      phone: '',
      city: ''
    })
    const [form] = Form.useForm()
    const dispatch = useDispatch()
      useEffect(() =>{
        form.setFieldsValue(stateUserDetails)
      }, [form, stateUserDetails])

    useEffect(() =>{
      if(isOpenModalUpdateInfo){
        setStateUserDetails({
          name: user?.name,
          phone: user?.phone,
          city: user?.city,

        })
      }
    }, [isOpenModalUpdateInfo])

    const handleChangeAddress = () => {
      setIsOpenModalUpdateInfo(true)
    }

    const priceMemo = useMemo(() => {
      const result = order?.orderItemSelected?.reduce((total, cur) => {
        return total + ((cur.price * cur.amount));
      }, 0);
      return result;
    }, [order]);
    console.log('priceMemo', priceMemo)

    
    const handleAddOrder = () => {
      //GHINHO: THIẾU orderItemSelected VÀ priceMemo
      if(user?.access_token && order?.orderItemSelected && user?.name
       && user?.phone && user?.city && priceMemo && user?.id) {
          // eslint-disable-next-line no-unused-expressions
          mutationAddOrder.mutate(
            { 
              token: user?.access_token, 
              orderItems: order?.orderItemSelected, 
              fullName: user?.name,
              phone:user?.phone,
              city: user?.city,
              paymentMethod: payment,
              itemsPrice: priceMemo,
              shippingPrice: deliveryPriceMemo,
              totalPrice: totalPriceMemo,
              user: user?.id,
              email: user?.email
            }
          )
        }
    }
    
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

    const totalPriceMemo = useMemo(() => {
      return Number(priceMemo) + Number(priceDiscountMemo) + Number(deliveryPriceMemo);
    }, [priceMemo, priceDiscountMemo, deliveryPriceMemo]);


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
    const mutationAddOrder = useMutationHooks(
      (data) => {
          const {
          token,
        ...rests } = data
        const res =  OrderService.createOrder(
            {...rests},
            token)
            return res
      },
    )
    const {data} = mutationUpdate
    const {data: dataAdd, isSuccess, isError} = mutationAddOrder

    useEffect(() =>{
      if(isSuccess && dataAdd?.status === 'OK'){
        const arrayOrdered = []
        order?.orderItemSelected?.forEach(element =>{
          arrayOrdered.push(element.product)
        })
        dispatch(removeAllOrderProduct({listChecked: arrayOrdered}))
        message.success('Đặt hàng thành công!')
        navigate('/orderSuccess', {
          state: {
            delivery,
            payment,
            orders: order?.orderItemSelected,
            totalPriceMemo: totalPriceMemo
          }
      })
      }else if(isError){
        message.error()
      }
    }, [isSuccess, isError])

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
      <div style={{background: '#f5f5fa', with: '100%', height: '100vh'}}>
          <div style={{height: '100%', width: '1270px', margin: '0 auto'}}>
            <h3>Thanh toán</h3>
            <div style={{ display: 'flex', justifyContent: 'center'}}>
              <WrapperLeft>
                <WrapperInfo>
                  <div>
                    <Lable>Chọn phương thức giao hàng</Lable>
                    <WrapperRadio> 
                      <Radio value="fast" checked><span style={{color: '#ea8500', fontWeight: 'bold'}}>FAST</span> Giao hàng tiết kiệm</Radio>
                    </WrapperRadio>
                  </div>
                </WrapperInfo>
                <WrapperInfo>
                  <div>
                    <Lable>Chọn phương thức thanh toán</Lable>
                    <WrapperRadio> 
                      <Radio value="cod">Thanh toán tiền mặt khi nhận hàng</Radio>
                    </WrapperRadio>
                  </div>
                </WrapperInfo>
              </WrapperLeft>
              <WrapperRight>
                <div style={{width: '100%'}}>
                  <WrapperInfo>
                    <div>
                      <span>Địa chỉ: </span>
                      <span style={{fontWeight: 'bold'}}>{user?.city} </span>
                      <span onClick={handleChangeAddress} style={{color: '#9255FD', cursor:'pointer'}}>Thay đổi</span>
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
                {/* {payment === 'paypal' && sdkReady ? (
                  <div style={{width: '320px'}}>
                    <PayPalButton
                      amount={Math.round(totalPriceMemo / 30000)}
                      // shippingPreference="NO_SHIPPING" // default is "GET_FROM_FILE"
                      onSuccess={onSuccessPaypal}
                      onError={() => {
                        alert('Erroe')
                      }}
                    />
                  </div>
                ) : ( */}
                  <ButtonComponent
                    onClick={() => handleAddOrder()}
                    size={40}
                    styleButton={{
                        background: 'rgb(255, 57, 69)',
                        height: '48px',
                        width: '320px',
                        border: 'none',
                        borderRadius: '4px'
                    }}
                    textButton={'Đặt hàng'}
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


  export default PaymentPage