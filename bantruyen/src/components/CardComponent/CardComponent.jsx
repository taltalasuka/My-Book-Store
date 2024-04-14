import React from 'react'
import { StyleNameProduct, WrapperDiscountText, WrapperPriceText, WrapperReportText, WrapperCardStyle, WrapperStyleTextSell } from './style'
import {StarFilled} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { convertPrice } from "./../../utils";
const CardComponent = (props) => {
  const {countInStock, description, image, name, price, rating, type, discount, selled, id} = props
  const navigate = useNavigate()
  const handleDetailsProduct = (id) =>{
    navigate(`/product-details/${id}`)
  }
  return (
    <WrapperCardStyle
    hoverable
    headStyle={{width: '200px', height: '200px'}} 
    style={{ width: 200 }}
    bodyStyle={{padding: '10px'}}
    cover={<img alt="example" src={image} />}
    onClick = {() => countInStock !== 0 && handleDetailsProduct(id)}
    disabled = {countInStock === 0}
  > 
  <StyleNameProduct>{name}</StyleNameProduct>
  <WrapperReportText>
    <span style = {{marginRight: '4px'}}>
        <span>{rating}</span> <StarFilled style= {{fontSize: '12px', color: 'rgb(253, 216, 54)'}}/>
        <WrapperStyleTextSell>Đã bán {selled||0}</WrapperStyleTextSell>
    </span>
  </WrapperReportText>

     <WrapperPriceText>
        <span style ={{marginRight: '10px'}}>{convertPrice(price)}</span>
        <WrapperDiscountText>
             - {discount || 5} %
        </WrapperDiscountText>
     </WrapperPriceText>


   </WrapperCardStyle>
  )
}

export default CardComponent