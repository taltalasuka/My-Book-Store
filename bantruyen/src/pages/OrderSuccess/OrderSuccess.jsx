  import React from 'react'
  import { Checkbox, Form, Radio } from 'antd'
  import { Lable, WrapperCountOrder, WrapperInfo, WrapperContainer, WrapperItemOrder, WrapperValue, WrapperItemOrderInfo } from './style';
  import { useDispatch, useSelector } from 'react-redux';
import { convertPrice } from '../../utils';
import { useLocation } from 'react-router-dom';
import { orderContant } from '../../contant';

  const OrderSuccess = () => {
    const order = useSelector((state) => state.order)
    const location = useLocation()
    const {state} = location
    console.log('location', location)
    
    return (
      <div style={{background: '#f5f5fa', with: '100%', height: '100vh'}}>
          <div style={{height: '100%', width: '1270px', margin: '0 auto'}}>
            <h3 style={{textAlign: 'center', fontSize: '25px', marginTop: '10px'}}>Đơn hàng đã đặt thành công! Cảm ơn quý khách đã đặt hàng!</h3>
            <div style={{ display: 'flex', justifyContent: 'center'}}>
              <WrapperContainer>
                <WrapperInfo>
                  <div style ={{fontSize: '20px'}}>
                    <Lable>Phương thức giao hàng</Lable>
                    <WrapperValue>
                      <span style={{color: '#ea8500', fontWeight: 'bold', fontSize: '20px'}}>{orderContant.delivery[state?.delivery]}</span> Giao hàng tiết kiệm
                      </WrapperValue>
                  </div>
                </WrapperInfo>
                <WrapperInfo style ={{fontSize: '20px'}}>
                  <div >
                    <Lable>Phương thức thanh toán</Lable>
                    <WrapperValue>
                    {orderContant.payment[state?.payment]}
                      </WrapperValue>
                  </div>
                </WrapperInfo>
                <WrapperItemOrderInfo>
                  {state?.orders?.map((order) => {
                    return(
                      <WrapperItemOrder>
                      <div style={{width: '390px', display: 'flex', alignItems: 'center', gap: 4}}>
                        <img src={order.image} style={{width: '77px', height: '79px', objectFit: 'cover'}}/>
                        <div style = {{
                          width: '260px',
                          overflow:'hidden',
                          textOverflow:'ellipsis',
                          whiteSpace: 'nowrap',
                        }}>{order?.name}</div>
                      </div>
                      <div style={{flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px'}}>
                        <span>
                          <span style = {{fontSize: '20px', color: 'red'}}> Giá tiền: {convertPrice(order?.price)} </span>
                        </span>
                        <span>
                          <span style = {{fontSize: '20px', color: '#242424'}}> Số lượng: {order?.amount} </span>
                        </span>

                        </div>
                        </WrapperItemOrder>
                        
                    )
                  })}

                </WrapperItemOrderInfo>
                        <div>
                          <span style = {{fontSize: '13px', color: 'red', fontSize: '25px'}}> Tổng tiền: {convertPrice(state?.totalPriceMemo)} </span>
                        </div>
              </WrapperContainer>
            </div>
          </div>
          
      </div>
    )
  }


  export default OrderSuccess