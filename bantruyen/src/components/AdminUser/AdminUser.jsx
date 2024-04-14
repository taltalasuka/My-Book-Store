import React, { useEffect, useRef, useState } from 'react'
import { WrapperHeader } from './style'
import { Button, Form, Space } from 'antd'
import TableComponent from '../TableComponent/TableComponent'
import InputComponent from '../InputComponent/InputComponent'
import DrawerComponent from '../DrawerComponent/DrawerComponent'
import { WrapperUploadFile } from '../AdminProduct/style'
import ModalComponent from '../ModalComponent/ModalComponent'
import { getBase64 } from '../../utils'
import * as message from '../../components/Message'
import { useSelector } from 'react-redux'
import { useMutationHooks } from '../../hooks/userMutationHook'
import * as UserService from '../../services/UserService'
import { useQuery } from '@tanstack/react-query'
import { UserAddOutlined, UploadOutlined, DeleteOutlined, EditOutlined, SearchOutlined } from '@ant-design/icons'


const AdminUser = () => {
  const user = useSelector((state) => state?.user)
  const [isOpenDrawer, setIsOpenDrawer] = useState(false)
  const [rowSelected, setRowSelected] = useState('')
  const [isModalOpenDelete, setIsModalOpenDelete ] = useState(false)
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef(null);
  const onUpdateUser = () =>{
    mutationUpdate.mutate({id: rowSelected, token: user?.access_token, ...stateUserDetails},{
      onSettled: () =>{
        queryUser.refetch()
      }
    })
  }
  const handleOnchangeAvatar = async ({fileList}) => {
    const file = fileList[0]
    if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj );
    }
    setStateUser({
      ...stateUser,
      image: file.preview
    })
}
const handleOnchangeAvatarDetails = async ({fileList}) => {
  const file = fileList[0]
  if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj );
  }
  setStateUserDetails({
    ...stateUserDetails,
    image: file.preview
  })
}
  const  [isModalOpen, setIsModalOpen] = useState(false);
  const [stateUser, setStateUser] = useState({
    name: '',
    email: '',
    phone: '',
    isAdmin: false,
  })

  const [stateUserDetails, setStateUserDetails] = useState({
    name: '',
    email: '',
    phone: '',
    isAdmin: false,
  })
  const [form] = Form.useForm();
console.log('rowSelected', rowSelected)
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

 const mutationDeletedMany = useMutationHooks(
  (data) => {
      const {  token, ...ids} = data
    const res =  UserService.deleteManyUser(
        ids,
        token)
        return res
  },
 )

 const handleDeleteManyUsers = (ids) => {
  mutationDeletedMany.mutate({ids: ids, token: user?.access_token}, {
    onSettled: () => {
      queryUser.refetch()
    }
  })
}
 const mutationDeleted = useMutationHooks(
  (data) => {
      const {  id,
      token} = data
    const res =  UserService.deleteUser(
        id,
        token)
        return res
  },
 )
const  getAllUsers = async() => {
  const res = await UserService.getAllUser(user?.access_token)
  console.log('res', res)
  return res
}

const fetchGetDetailsUser = async(rowSelected) => {
  const res = await UserService.getDetailsUser(rowSelected)
  if(res?.data){
    setStateUserDetails({
      name: res?.data?.name,
      email: res?.data?.email,
      phone: res?.data?.phone,
      isAdmin: res?.data?.isAdmin
    })
  }
}
useEffect(() =>{
  form.setFieldsValue(stateUserDetails)
}, [form, stateUserDetails])
console.log('rowSelected', rowSelected)
useEffect(() => {
  if(rowSelected && isOpenDrawer){
    fetchGetDetailsUser(rowSelected)
  }
  }, [rowSelected, isOpenDrawer])

const handleDetailsProduct = () =>  {
  setIsOpenDrawer(true)
}
const {data: dataUpdated, isSuccess: isSuccessUpdated, isError: isErrorUpdated} = mutationUpdate
const {data: dataDeleted, isSuccess: isSuccessDeleted, isError: isErrorDeleted} = mutationDeleted
const {data: dataDeletedMany, isSuccess: isSuccessDeletedMany, isError: isErrorDeletedMany} = mutationDeletedMany


console.log('dataUpdated', dataUpdated)
const queryUser = useQuery({queryKey: ['users'], queryFn: getAllUsers})
const { data: users } = queryUser
const renderAction =() =>{
  return (
    <div >
      <EditOutlined style={{color:'blue', fontSize: '30px', cursor:'pointer'}} onClick = {handleDetailsProduct}/>
      <DeleteOutlined style={{color:'red', fontSize: '30px', cursor:'pointer'}} onClick={() => setIsModalOpenDelete(true)}/>

    </div>
  )
}


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
    title: 'Email',
    dataIndex: 'email',
    render: (text) => <a>{text}</a>,
    sorter: (a, b) => a.email.length - b.email.length,
    ...getColumnSearchProps('email')
  },
  {
    title: 'Admin',
    dataIndex: 'isAdmin',
    filters: [
      {
        text: 'True',
        value: true,
      },
      {
        text: 'False',
        value: false,
      },
    ],
  },
  {
    title: 'Phone',
    dataIndex: 'phone',
    sorter: (a, b) => a.phone - b.phone,
    ...getColumnSearchProps('phone')
  },
  {
    title: 'Action',
    dataIndex: 'action',
    render: renderAction
  },
];
//GHINHO: GET DỮ LIỆU PRODUCT ĐỂ SHOW LÊN
const dataTable = users?.data?.length && users?.data?.map((user) => {
  return {...user, key: user._id, isAdmin: user.isAdmin? 'TRUE' : 'FALSE'}
})
  // const showModal = () => {
  //   setIsModalOpen(true);
  // };


  useEffect(() =>{
    if(isSuccessDeleted && dataDeleted?.status === 'OK'){
      message.success()
      handleCancelDelete()
    }else if(isErrorDeleted){
      message.error()
    }
  }, [isSuccessDeleted])

  useEffect(() =>{
    if(isSuccessDeletedMany && dataDeletedMany?.status === 'OK'){
      message.success()
      handleCancelDelete()
    }else if(isErrorDeletedMany){
      message.error()
    }
  }, [isSuccessDeletedMany])

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

const handleDeleteUser = () =>{
  mutationDeleted.mutate({id: rowSelected, token: user?.access_token}, {
    onSettled: () => {
      queryUser.refetch()
    }
  })
}

const handleCloseDrawer = () => {
  setIsOpenDrawer(false);
  setStateUserDetails({
      name: '',
      email: '',
      phone: '',
      isAdmin: false,
  })
  form.resetFields()
};

const handleOnchangeDetails = (e) => {
  setStateUserDetails({
    ...stateUserDetails,
    [e.target.name] : e.target.value
  })
}
  return (
    <div>
        <WrapperHeader>
            Quản lý người dùng
        </WrapperHeader>
        <div style = {{marginTop: '10px'}}>
        <TableComponent handleDeleteManyProducts={handleDeleteManyUsers} columns={columns} data={dataTable}  onRow={(record, rowIndex) => {
    return {
      onClick: event => {
        setRowSelected(record._id)
      }
    };
  }}/>


      <DrawerComponent forceRender title='Chi tiết người dùng' isOpen={isOpenDrawer} onClose={() => setIsOpenDrawer(false)} width="60%">
      <Form
      name="basic"
      labelCol={{ span: 3 }}
      wrapperCol={{ span: 22 }}
      onFinish={onUpdateUser}
      autoComplete="on"
      form = {form}
    >
      <Form.Item
        label="Name"
        name="name"
        rules={[{ required: true, message: 'Điền tên người dùng!' }]}
      >
        <InputComponent value={stateUserDetails['name']} onChange={handleOnchangeDetails} name = "name"/>
      </Form.Item>

      <Form.Item
        label="Email"
        name="email"
        rules={[{ required: true, message: 'Điền email!' }]}
      >
        <InputComponent value={stateUserDetails['email']} onChange={handleOnchangeDetails} name = "type"/>
      </Form.Item>
      <Form.Item
        label="Phone"
        name="phone"
        rules={[{ required: true, message: 'Điền loại số lượng!' }]}
      >
        <InputComponent value={stateUserDetails.phone} onChange={handleOnchangeDetails} name = "phone"/>
      </Form.Item>

      <Form.Item wrapperCol={{ offset: 10, span: 16 }}>
        <Button type="primary" htmlType="submit">
          Cập Nhật
        </Button>
      </Form.Item>
    </Form>
      </DrawerComponent>


      <ModalComponent forceRender title="Xóa người dùng" open={isModalOpenDelete} onCancel={handleCancelDelete} onOk={handleDeleteUser}>
               <div>
                Bạn có chắc muốn xóa người dùng này không?
                </div>             
      </ModalComponent>
        </div>
    </div>
  )
}

export default AdminUser