import React, { useEffect, useRef, useState } from 'react'
import TypeProducts from '../../components/TypeProduct/TypeProducts'
import { WrapperButtonMore, WrapperProducts, WrapperTypeProduct } from '../../pages/HomePage/style'
import SliderComponent from '../../components/SliderComponent/SliderComponent'
import slider1 from '../../components/assets/images/slider1.png'
import slider2 from '../../components/assets/images/slider2.jpg'
import slider3 from '../../components/assets/images/slider3.jpg'
import CardComponent from '../../components/CardComponent/CardComponent'
import { useQuery } from '@tanstack/react-query'
import * as ProductService from '../../services/ProductService'
import { useSelector } from 'react-redux'
import { useDebounce } from '../../hooks/useDebounce'
const HomePage = () => {
  const searchProduct = useSelector((state) => state?.product?.search)
  const searchDebounce = useDebounce(searchProduct, 300)
  const [typeProducts, setTypeProducts] = useState([])
  const [limit, setLimit] = useState(6)
  // const [page, setLimit] = useState(6)

  const fetchProductAll = async(context) => {
    const limit = context?.queryKey && context?.queryKey[1]
    const search = context?.queryKey && context?.queryKey[2]

    console.log('context', context)
    const res = await ProductService.getAllProduct(search, limit)
    return res
    }

  const fetchAllTypeProduct = async() =>{
    const res = await ProductService.getAllTypeProduct()
    if(res?. status === 'OK'){
      setTypeProducts(res?.data)

    }
  }
  
  const {data: products, isPreviousData} = useQuery(['products', limit, searchDebounce], fetchProductAll, {retry: 3, retryDelay: 1000, keepPreviousData: true})
  
  useEffect( () => {
    fetchAllTypeProduct()
  }, [])

  console.log('isPreviousData', products)
  return (
    <div>
    <div style = {{width: '1270px', margin:'0 auto'}}>
      <WrapperTypeProduct>
         {typeProducts.map((item) =>{
            return (
              <TypeProducts name={item} key={item}/>
            )
          })}
      </WrapperTypeProduct>
      </div>
        <div className="body" style={{width: '100%', backgroundColor: '#efefef'}}>
          <div id = "container" style={{height: '1000px', width: '1270px', margin: '0 auto'}}>
          <SliderComponent arrImages={[slider1, slider2, slider3]}/>

          <div style={{marginTop: '20px', display: 'flex', alignItems: 'center', gap:'15px', flexWrap: 'wrap'}}>
            <WrapperProducts>
              {products?.data?.map((product) =>{
                console.log('product', products)
                return(
                  <CardComponent
                  key ={product._id}
                  countInStock = {product.countInStock}
                  description={product.description}
                  image={product.image}
                  name={product.name}
                  price={product.price} 
                  rating = {product.rating}
                  type={product.type }
                  selled ={product.selled}
                  discount={product.discount}
                  id = {product._id}/>
                )
              })}
 
            </WrapperProducts>
          <div style= {{width: '100%', display: 'flex', alignItems: 'center', marginTop: '10px', justifyContent:'center'}}>
          <WrapperButtonMore
          textButton={isPreviousData ? 'Xem thêm' : "Xem thêm"} type="outline" styleButton={{
            border: '1px solid rgb(11, 116, 229)', color: 'rgb(11, 116, 229)',
            width: '240px', height: '38px', borderRadius: '4px'
          }}
          disabled = {products?.total === products?.data?.length||products?.totalPage === 1}
          styleTextButton={{fontWeight: 500, color: products?.total === products?.data?.length && '#fff'}}
          onClick = {() => setLimit((prev) => prev + 6)}
          />
          </div>
        </div>
      </div>
    </div>
  </div>
  )
}

export default HomePage