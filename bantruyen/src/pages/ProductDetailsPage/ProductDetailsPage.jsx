import React from 'react'
import ProductDetailsComponent from '../../components/ProductDetailsComponent/ProductDetailsComponent'
import { useNavigate, useParams } from 'react-router-dom'

const ProductDetailsPage = () => {
  const {id} = useParams()
  const navigate = useNavigate()
  return (
      <div style={{width: '100%',background: '#efefef', height: '100%'}}>
    <div style={{ width: '1270px', height: '1000px', margin: '0 auto'}} >
      <h1 style={{marginTop:'20px'}}>Chi tiết sản phẩm</h1>
      <ProductDetailsComponent idProduct={id} />
    </div>
  </div>
  )
}

export default ProductDetailsPage