import React, { useEffect, useState } from 'react'
import './List.css'
import axios from 'axios' 
import {toast} from 'react-toastify'

const List = ({url}) => {

  const [list, setList] = useState([]);

  const fetchList = async () => {
    try {
      const response = await axios.get(`${url}/api/food/list`);
      if (response.data.success) {  // Corrected the key to 'success'
        setList(response.data.data);
      } else {
        toast.error("Error");
      }
    } catch (error) {
      toast.error("An error occurred while fetching the list");
    }
  }

  const removeFood = async(foodId) =>{
      const response = await axios.post(`${url}/api/food/remove`,{id:foodId});
      await fetchList();
      if (response.data.success) {
        toast.success(response.data.message)
      }
      else{
        toast.error("Error");
      }
  }

  useEffect(() => {
    fetchList();
  }, [])

  return (
    <div className='list add flex-col'>
      <p>All Foods List</p>
      <div className="list-table">
        <div className="list-table-format title">
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b>Action</b>
        </div>
        {list.map((item,index)=>{
          return (
            <div className='list-table-format' key={index}>
              <img src={`${url}/images/`+item.image} alt="" />
              <p>{item.name}</p>
              <p>{item.category}</p>
              <p>Rs.{item.price}</p>
              {/* <p >X</p> */}
              <img className='cursor' style={{width: '30px', height: '30px'}} onClick={()=>removeFood(item._id)} src={'./delete.png'} alt="" />
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default List
