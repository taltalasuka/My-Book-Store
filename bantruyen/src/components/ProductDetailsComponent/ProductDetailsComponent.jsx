import { Button, Col, Image, InputNumber, Rate, Row } from 'antd'
import React, { useState } from 'react'
import ImageProductSmall from '../assets/images/image-small.webp'
import { WrapperAddressProduct, WrapperBtnQualityProduct, WrapperInputNumber, WrapperPriceProduct, WrapperPriceTextProduct, WrapperQualityProduct, WrapperStyleColImage, WrapperStyleImageSmall, WrapperStyleNameProduct, WrapperStyleTextSell } from './style'
import {  PlusOutlined, MinusOutlined } from "@ant-design/icons";
import ButtonComponent from "./../ButtonComponent/ButtonComponent";
import * as ProductService from '../../services/ProductService'  
import { useQuery } from '@tanstack/react-query'
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { addOrderProduct } from '../../redux/slices/orderSlice';
import { convertPrice } from '../../utils';


const ProductDetailsComponent = ({idProduct}) => {
    const [numProduct, setNumProduct] = useState(1)
    const location = useLocation()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const user = useSelector((state) => state.user)
    const onChange = (value) => {
        setNumProduct(Number(value))
    }
    const fetchGetDetailsProduct = async(context) => {
        const id = context?.queryKey && context?.queryKey[1]
        if(id){
            const res = await ProductService.getDetailsProduct(id)
            return res.data
        }
      }
      const handleChangeCount = (type) => {
        if(type === 'increase') {
            setNumProduct(numProduct + 1)
        }else{
            setNumProduct(numProduct - 1)
        }
      }
      

    const {data: productDetails} = useQuery(['products-details', idProduct], fetchGetDetailsProduct, {enabled: !!idProduct})
    console.log('ProductDetails', productDetails)
    const handleAddOrderProduct = () =>{
        if(!user?.name){
            navigate('/sign-in', {state: location?.pathname})
        }else{
            // {
            //     name: {type: String, required: true},
            //     amount: {type: Number, required: true},
            //     image: {type: String, required: true},
            //     price: {type: Number, required: true},
            //     product: {
            //         type: mongoose.Schema.Types.ObjectId,
            //         ref: 'Product',
            //         require: true,  
            //     },
            // },
            dispatch(addOrderProduct({
                orderItem: {
                    name: productDetails?.name,
                    amount: numProduct,
                    image: productDetails?.image,
                    price: productDetails?.price,
                    product: productDetails?._id,
                    discount: productDetails?.discount
                },
        }))
        }
      }


    console.log('productDetails', productDetails, user)


  return (
    <Row  style = {{padding: '16px', background: '#fff', borderRadius: '4px'}}>
        <Col span = {10} style = {{borderRight: '1px solid #e5e5e5', paddingRight: '8px' }}>
            <Image src={productDetails?.image} alt="Image Product" preview = {false}/>
            <Row style={{paddingTop: '10px', justifyContent: 'space-between'}}>
            </Row>
        </Col>
        <Col span = {14} style = {{ paddingLeft: '10px'}}>
            <WrapperStyleNameProduct>
                {productDetails?.name}
            </WrapperStyleNameProduct>

                <div>
                    <Rate allowHalf defaultValue={productDetails?.rating} value={productDetails?.rating}/>
                 <WrapperStyleTextSell>| Đã bán 1000</WrapperStyleTextSell>
                </div>
                <WrapperPriceProduct>
                    <WrapperPriceTextProduct>
                        {convertPrice(productDetails?.price)}
                    </WrapperPriceTextProduct>
                </WrapperPriceProduct>

                <WrapperAddressProduct>
                </WrapperAddressProduct>
                <div style={{ margin: '10px 0 20px', padding: '10px 0', borderTop: '1px solid #e5e5e5', borderBottom: '1px solid #ccc'}}>
                    <div style = {{marginBottom: '10px'}}>Số lượng</div>
                    <WrapperQualityProduct>
                        <button style = {{border: 'none', background: 'transparent', cursor: 'pointer'}} onClick={() => handleChangeCount('decrease')}>
                            <MinusOutlined style = {{color: '000', fontSize :'20px'}}/>   
                        </button>
                        <WrapperInputNumber  onChange={onChange} defaultValue={1} value={numProduct} size="small"  />
                        <button style = {{border: 'none', background: 'transparent', cursor: 'pointer'}} onClick={() => handleChangeCount('increase')}>

                            <PlusOutlined style = {{color: '#000', fontSize :'20px'}} />
                        </button>
                    </WrapperQualityProduct>
                </div>
                <div>
                    <ButtonComponent
                        size={40} 
                        styleButton={{
                            background: 'rgb(255,57,69)',
                            height: '48px',
                            width: '220px',
                    }} 
                    onClick={handleAddOrderProduct}
                        textButton = {'Chọn mua'}
                        styleTextButton={{color: '#fff', fontSize: '15px', fontWeight: '700px'}}
                    ></ButtonComponent>

                    <ButtonComponent
                        size={40} 
                        styleButton={{
                            background: '#fff',
                            height: '48px',
                            width: '220px',
                            border: '1px solid rgb(13, 92, 182)',
                            borderRadius: '4px',
                            marginLeft: '15px'
                    }} 
                        textButton = {'Mua trả sau'}
                        styleTextButton={{color: 'rgb(13,92,182)', fontSize: '15px'}}
                    ></ButtonComponent>
                </div>
        </Col>
    </Row>
  )
}

export default ProductDetailsComponent