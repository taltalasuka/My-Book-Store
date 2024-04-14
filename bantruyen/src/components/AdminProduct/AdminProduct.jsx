import React, { useEffect, useRef, useState } from 'react'
import { UserAddOutlined, UploadOutlined, DeleteOutlined, EditOutlined, SearchOutlined } from '@ant-design/icons'
import { WrapperHeader, WrapperUploadFile } from './style'
import { Button, Form , Modal, Select, Space } from 'antd'
import TableComponent from '../TableComponent/TableComponent'
import InputComponent from '../InputComponent/InputComponent'
import { useSelector } from 'react-redux'
import { getBase64, renderOptions } from '../../utils'
import * as ProductService from '../../services/ProductService'  
import { useMutationHooks } from '../../hooks/userMutationHook';
import * as message from '../../components/Message'
import { useQuery } from '@tanstack/react-query'
import DrawerComponent from "./../DrawerComponent/DrawerComponent";
import ModalComponent from '../ModalComponent/ModalComponent'

const AdminProduct = () => {

  
  //GHINHO: UP ẢNH
  const initial = () => ({
      name: '',
      price: '',
      description: '',
      rating: '',
      image: '',  
      type:'',
      countInStock: '',
      newType: '',
      discount: ''
  })
  const user = useSelector((state) => state?.user)
  const [isOpenDrawer, setIsOpenDrawer] = useState(false)
  const [rowSelected, setRowSelected] = useState('')
  const [typeSelect, setTypeSelect] = useState('')
  const [isModalOpenDelete, setIsModalOpenDelete ] = useState(false)
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef(null);
  const onUpdateProduct = () =>{
    mutationUpdate.mutate({id: rowSelected, token: user?.access_token, ...stateProductDetails},{
      onSettled: () =>{
        queryProduct.refetch()
      }
    })
  }
  const handleOnchangeAvatar = async ({fileList}) => {
    const file = fileList[0]
    if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj );
    }
    setStateProduct({
      ...stateProduct,
      image: file.preview
    })
}
const handleOnchangeAvatarDetails = async ({fileList}) => {
  const file = fileList[0]
  if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj );
  }
  setStateProductDetails({
    ...stateProductDetails,
    image: file.preview
  })
}
  const  [isModalOpen, setIsModalOpen] = useState(false);
  const [stateProduct, setStateProduct] = useState(initial())

  const [stateProductDetails, setStateProductDetails] = useState(initial())
  const [form] = Form.useForm();
  const mutation = useMutationHooks(
    (data) => {
        const {  name,
        price,
        description,
        rating,
        image,  
        type,
        countInStock,
        discount } = data
      const res =  ProductService.createProduct({name,
          price,
          description,
          rating,
          image,  
          type,
          countInStock, discount
        })
          return res
    }
)
console.log('rowSelected', rowSelected)
const mutationUpdate = useMutationHooks(
  (data) => {
      const {  id,
      token,
    ...rests } = data
    const res =  ProductService.updateProduct(
        id,
        token,
        {...rests})
        return res
  },
 )

 const mutationDeleted = useMutationHooks(
  (data) => {
      const {  id,
      token} = data
    const res =  ProductService.deleteProduct(
        id,
        token)
        return res
  },
 )

 const mutationDeletedMany = useMutationHooks(
  (data) => {
      const {  token, ...ids} = data
    const res =  ProductService.deleteManyProduct(
        ids,
        token)
        return res
  },
 )

 console.log('mutationDeletedMany', mutationDeletedMany)
const getAllProducts = async() => {
  const res = await ProductService.getAllProduct()
  return res
}

const fetchGetDetailsProduct = async(rowSelected) => {
  const res = await ProductService.getDetailsProduct(rowSelected)
  if(res?.data){
    setStateProductDetails({
      name: res?.data?.name,
      price: res?.data?.price,
      description: res?.data?.description,
      rating: res?.data?.rating,
      image: res?.data?.image,  
      type:res?.data?.type,
      countInStock: res?.data?.countInStock,
      discount: res?.data?.discount
    })
  }
}
useEffect(() =>{
  if(!isModalOpen){
    form.setFieldsValue(stateProductDetails)
  }else{
    form.setFieldsValue(initial())
  }
}, [form, stateProductDetails, isModalOpen])

useEffect(() => {
  if(rowSelected && isOpenDrawer){
    fetchGetDetailsProduct(rowSelected)
  }
  }, [rowSelected, isOpenDrawer])

const handleDetailsProduct = () =>  {
  setIsOpenDrawer(true)
}
const handleDeleteManyProducts = (ids) => {
  mutationDeletedMany.mutate({ids: ids, token: user?.access_token}, {
    onSettled: () => {
      queryProduct.refetch()
    }
  })
}
const fetchAllTypeProduct = async() =>{
  const res = await ProductService.getAllTypeProduct()
  return res
}
const {data, isSuccess, isError} = mutation
const {data: dataUpdated, isSuccess: isSuccessUpdated, isError: isErrorUpdated} = mutationUpdate
const {data: dataDeleted, isSuccess: isSuccessDeleted, isError: isErrorDeleted} = mutationDeleted
const {data: dataDeletedMany, isSuccess: isSuccessDeletedMany, isError: isErrorDeletedMany} = mutationDeletedMany


// console.log('dataUpdated', dataUpdated)
const queryProduct = useQuery({queryKey: ['products'], queryFn: getAllProducts})
const typeProduct = useQuery({queryKey: ['type-product'], queryFn: fetchAllTypeProduct})

const { data: products } = queryProduct
const renderAction =() =>{
  return (
    <div >
      <EditOutlined style={{color:'blue', fontSize: '30px', cursor:'pointer'}} onClick = {handleDetailsProduct}/>
      <DeleteOutlined style={{color:'red', fontSize: '30px', cursor:'pointer'}} onClick={() => setIsModalOpenDelete(true)}/>

    </div>
  )
}
console.log('type', typeProduct)

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
        ref={searchInput}
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
          onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
          icon={<SearchOutlined />}
          size="small"
          style={{
            width: 90,
          }}
        >
          Search
        </Button>
        <Button
          onClick={() => clearFilters && handleReset(clearFilters)}
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
    title: 'Name',
    dataIndex: 'name',
    render: (text) => <a>{text}</a>,
    sorter: (a, b) => a.name.length - b.name.length,
    ...getColumnSearchProps('name')
  },
  {
    title: 'Price',
    dataIndex: 'price',
    sorter: (a, b) => a.price - b.price

  },
  {
    title: 'Rating',
    dataIndex: 'rating',
    sorter: (a, b) => a.rating - b.rating
  },
  {
    title: 'Type',
    dataIndex: 'type',
    filters: [
      {
        text: 'Truyện Tình Cảm',
        value: 'truyentinhcam',
      },
      {
        text: 'Truyện Trinh Thám',
        value: 'truyentrinhtham',
      },
      {
        text: 'Truyện Cười',
        value: 'truyencuoi',
      },
    ],
    onFilter: (value, record) => {
      console.log('value', [value, record])
      if(value === 'truyentinhcam'){
        return record.type == 'Truyện Tình Cảm'
 
      }else if(value === 'truyentrinhtham'){
            return record.type == 'Truyện Trinh Thám'
      }else if (value === 'truyencuoi'){
        return record.type == 'Truyện Cười'
      }
    }
  },
  {
    title: 'Action',
    dataIndex: 'action',
    render: renderAction
  },
];
//GHINHO: GET DỮ LIỆU PRODUCT ĐỂ SHOW LÊN
const dataTable = products?.data?.length && products?.data?.map((products) => {
  return {...products, key: products._id}
})
  // const showModal = () => {
  //   setIsModalOpen(true);
  // };

  useEffect(() =>{
    if(isSuccessDeletedMany && dataDeletedMany?.status === 'OK'){
      message.success()
    }else if(isErrorDeletedMany){
      message.error()
    }
  }, [isSuccessDeletedMany])

  useEffect(() =>{
    if(isSuccess && data?.status === 'OK'){
      message.success()
      handleCancel()
    }else if(isError){
      message.error()
    }
  }, [isSuccess])


  useEffect(() =>{
    if(isSuccessDeleted && dataDeleted?.status === 'OK'){
      message.success()
      handleCancelDelete()
    }else if(isErrorDeleted){
      message.error()
    }
  }, [isSuccessDeleted])


  useEffect(() =>{
    if(isSuccessUpdated && dataUpdated?.status === 'OK'){
      message.success()
      handleCloseDrawer()
    }else if(isErrorUpdated){
      message.error()
    }
  }, [isSuccessUpdated])

  const handleCancelDelete = () =>{
    setIsModalOpenDelete(false)
  }

const handleCancel = () => {
  setIsModalOpen(false);
  setStateProduct({
      name: '',
      price: '',
      description: '',
      rating: '',
      image: '',  
      type:'',
      countInStock: '',
      discount: ''
  })
  form.resetFields()
};

const handleDeleteProduct = () =>{
  mutationDeleted.mutate({id: rowSelected, token: user?.access_token}, {
    onSettled: () => {
      queryProduct.refetch()
    }
  })
}

const handleCloseDrawer = () => {
  setIsOpenDrawer(false);
  setStateProductDetails({
      name: '',
      price: '',
      description: '',
      rating: '',
      image: '',  
      type:'',
      countInStock: '',
      discount: ''
  })
  form.resetFields()
};

// console.log('stateproduct', stateProduct)

const onFinish = () =>{
  const params = {
      name: stateProduct.name,
      price: stateProduct.price,
      description: stateProduct.description,
      rating: stateProduct.rating,
      image: stateProduct.image,  
      type:stateProduct.type === 'add_type' ? stateProduct.newType : stateProduct.type,
      countInStock: stateProduct.countInStock,
      discount: stateProduct.discount,
  }
  mutation.mutate(params,{
    onSettled: () =>{
    queryProduct.refetch()
  }})
}
const handleOnchange = (e) => {
  setStateProduct({
    ...stateProduct,
    [e.target.name] : e.target.value
  })
}

const handleOnchangeDetails = (e) => {
  setStateProductDetails({
    ...stateProductDetails,
    [e.target.name] : e.target.value
  })
}
const handleChangeSelect = (value) => {
  setStateProduct({
    ...stateProduct,
    type:value
  })
console.log('value={stateProduct.type}', stateProduct)

}
  return (
    <div>
        <WrapperHeader>
            Quản lý truyện bán
        </WrapperHeader>
        <div style = {{marginTop: '10px'}}>
            <Button style = {{height: '150px', width: '150px', borderRadius: '6px', borderStyle:'dashed'}} onClick={() => setIsModalOpen(true)}><UserAddOutlined style={{fontSize: '40px'}}/>
        </Button>
        </div>
        <div style = {{marginTop: '10px'}}>
          //GHINHO: LẤY DỮ LIỆU DATA PRODUCT
        <TableComponent handleDeleteManyProducts={handleDeleteManyProducts} columns={columns} data={dataTable}  onRow={(record, rowIndex) => {
    return {
      onClick: event => {
        setRowSelected(record._id)
      }
    };
  }}/>
      <ModalComponent forceRender title="Tạo sản phẩm" open={isModalOpen} onCancel={handleCancel} footer={null}>
      <Form
      name="basic"
      labelCol={{ span: 6 }}
      wrapperCol={{ span: 18 }}
      onFinish={onFinish}
      autoComplete="off"
      form = {form}
    >
      <Form.Item
        label="Name"
        name="name"
        rules={[{ required: true, message: 'Điền thông tin truyện!' }]}
      >
        <InputComponent value={stateProduct.name} onChange={handleOnchange} name = "name"/>
      </Form.Item>
      <Form.Item
              label="Type"
              name="type"
              rules={[{ required: true, message: 'Điền loại truyện!' }]}
            >
              <Select
                name="type"
                // defaultValue="lucy"
                // style={{ width: 120 }}
                value={stateProduct.type}
                onChange={handleChangeSelect}
                options={renderOptions(typeProduct?.data?.data)}
                />
            </Form.Item>
            {stateProduct.type === 'add_type' && (
              <Form.Item
                label='Loại truyện mới'
                name="newType"
                rules={[{ required: true, message: 'Vui lòng điền loại truyện mới!' }]}
              >
                <InputComponent value={stateProduct.newType} onChange={handleOnchange} name="newType" />
              </Form.Item>
            )}
      
      <Form.Item
        label="count inStock"
        name="countInStock"
        rules={[{ required: true, message: 'Điền loại số lượng!' }]}
      >
        <InputComponent value={stateProduct.countInStock} onChange={handleOnchange} name = "countInStock"/>
      </Form.Item>
      <Form.Item
        label="Price"
        name="price"
        rules={[{ required: true, message: 'Điền giá tiền!' }]}
      >
        <InputComponent value={stateProduct.price} onChange={handleOnchange} name = "price"/>
      </Form.Item>
      <Form.Item
        label="Description"
        name="description"
        rules={[{ required: true, message: 'Điền mô tả!' }]}
      >
        <InputComponent  value={stateProduct.description} onChange={handleOnchange} name = "description"/>
      </Form.Item>
      <Form.Item
        label="Rating"
        name="rating"
        rules={[{ required: true, message: 'Điền đánh giá!' }]}
      >
        <InputComponent  value={stateProduct.rating} onChange={handleOnchange} name = "rating"/>
      </Form.Item>
      <Form.Item
        label="Discount"
        name="discount"
        rules={[{ required: true, message: 'Điền giảm giá của sản phẩm!' }]}
      >
        <InputComponent  value={stateProduct.discount} onChange={handleOnchange} name = "discount"/>
      </Form.Item>
      <Form.Item
        label="Image"
        name="image"
        rules={[{ required: true, message: 'Upload ảnh!' }]}
      >
        
      <WrapperUploadFile onChange={handleOnchangeAvatar} maxCount={1}>
                            <Button>Select File</Button>
                            {stateProduct?.image && (
                            <img src={stateProduct?.image} style={{
                                height: '60px',
                                width: '60px',
                                borderRadius: '50%',
                                objectFit: 'cover',
                                marginLeft: '10px'
                            }} alt="avatar"/>
                        )}
      </WrapperUploadFile>
      </Form.Item>

      <Form.Item wrapperCol={{ offset: 10, span: 16 }}>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
      </ModalComponent>


      <DrawerComponent title='Chi tiết sản phẩm' isOpen={isOpenDrawer} onClose={() => setIsOpenDrawer(false)} width="60%">
      <Form
      name="basic"
      labelCol={{ span: 3 }}
      wrapperCol={{ span: 22 }}
      onFinish={onUpdateProduct}
      autoComplete="on"
      form = {form}
    >
      <Form.Item
        label="Name"
        name="name"
        rules={[{ required: true, message: 'Điền thông tin truyện!' }]}
      >
        <InputComponent value={stateProductDetails['name']} onChange={handleOnchangeDetails} name = "name"/>
      </Form.Item>

      <Form.Item
        label="Type"
        name="type"
        rules={[{ required: true, message: 'Điền loại truyện!' }]}
      >
        <InputComponent value={stateProductDetails.type} onChange={handleOnchangeDetails} name = "type"/>
      </Form.Item>
      <Form.Item
        label="CountInStock"
        name="countInStock"
        rules={[{ required: true, message: 'Điền loại số lượng!' }]}
      >
        <InputComponent value={stateProductDetails.countInStock} onChange={handleOnchangeDetails} name = "countInStock"/>
      </Form.Item>
      <Form.Item
        label="Price"
        name="price"
        rules={[{ required: true, message: 'Điền giá tiền!' }]}
      >
        <InputComponent value={stateProductDetails.price} onChange={handleOnchangeDetails} name = "price"/>
      </Form.Item>
      <Form.Item
        label="Description"
        name="description"
        rules={[{ required: true, message: 'Điền mô tả!' }]}
      >
        <InputComponent  value={stateProductDetails.description} onChange={handleOnchangeDetails} name = "description"/>
      </Form.Item>
      <Form.Item
        label="Rating"
        name="rating"
        rules={[{ required: true, message: 'Điền đánh giá!' }]}
      >
        <InputComponent  value={stateProductDetails.rating} onChange={handleOnchangeDetails} name = "rating"/>
      </Form.Item>
      <Form.Item
        label="Discount"
        name="discount"
        rules={[{ required: true, message: 'Điền giảm giá!' }]}
      >
        <InputComponent  value={stateProductDetails.discount} onChange={handleOnchangeDetails} name = "discount"/>
      </Form.Item>


      <Form.Item
        label="Image"
        name="image"
        rules={[{ required: true, message: 'Upload ảnh!' }]}
      >
        
      <WrapperUploadFile onChange={handleOnchangeAvatarDetails} maxCount={1}>
                            <Button>Select File</Button>
                            {stateProductDetails?.image && (
                            <img src={stateProductDetails?.image} style={{
                                height: '60px',
                                width: '60px',
                                borderRadius: '50%',
                                objectFit: 'cover',
                                marginLeft: '10px'
                            }} alt="avatar"/>
                        )}
      </WrapperUploadFile>
      </Form.Item>

      <Form.Item wrapperCol={{ offset: 10, span: 16 }}>
        <Button type="primary" htmlType="submit">
          Cập Nhật
        </Button>
      </Form.Item>
    </Form>
      </DrawerComponent>


      <ModalComponent forceRender title="Xóa sản phẩm" open={isModalOpenDelete} onCancel={handleCancelDelete} onOk={handleDeleteProduct}>
               <div>
                Bạn có chắc muốn xóa sản phẩm này không
                </div>             
      </ModalComponent>
        </div>
    </div>
  )
}

export default AdminProduct