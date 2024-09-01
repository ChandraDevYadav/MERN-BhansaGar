import React, { useContext, useEffect, useState } from 'react';
import './PlaceOrder.css';
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const PlaceOrder = () => {
  const { getTotalCartAmount, token, food_list, cartItems, url, setCartItems } = useContext(StoreContext);
  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: ""
  });

  const [paymentMethod, setPaymentMethod] = useState('stripe');
  const navigate = useNavigate();

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData((data) => ({ ...data, [name]: value }));
  };

  const placeOrder = async (event) => {
    event.preventDefault();
  
    const orderId = "some_unique_order_id";
  
    let orderItems = [];
    food_list.forEach((item) => {
      if (cartItems[item._id] > 0) {
        let itemInfo = item;
        itemInfo["quantity"] = cartItems[item._id];
        orderItems.push(itemInfo);
      }
    });
  
    let orderData = {
      address: data,
      items: orderItems,
      amount: getTotalCartAmount() + 2,
      paymentMethod: paymentMethod,
      orderId: orderId
    };
  
    try {
      let response = await axios.post(url + "/api/order/place", orderData, { headers: { token } });
  
      if (response.data.success) {
        if (paymentMethod === 'esewa') {
          const esewaPaymentUrl = response.data.esewaPaymentUrl;
          console.log("eSewa Payment URL:", esewaPaymentUrl);
          if (esewaPaymentUrl) {
            window.location.replace(esewaPaymentUrl);
          } else {
            console.error("eSewa Payment URL is undefined.");
          }
        } else if (paymentMethod === 'stripe') {
          const { session_url } = response.data;
          window.location.replace(session_url);
        } else {
          setCartItems({});
          navigate('/myorders');
        }
      } else {
        console.error("Error placing order");
      }
    } catch (error) {
      console.error("Error placing order:", error);
    }
  };
  
  
  

  useEffect(() => {
    if (!token) {
      navigate('/cart');
    } else if (getTotalCartAmount() === 0) {
      navigate('/cart');
    }
  }, [token]);

  return (
    <form onSubmit={placeOrder} className='place-order'>
      <div className="place-order-left">
        <p className='title'>Delivery Information</p>
        <div className="multi-fields">
          <input required name='firstName' onChange={onChangeHandler} value={data.firstName} type="text" placeholder='First Name' />
          <input required name='lastName' onChange={onChangeHandler} value={data.lastName} type="text" placeholder='Last Name' />
        </div>
        <input required name='email' onChange={onChangeHandler} value={data.email} type="email" placeholder='Email Address' />
        <input required name='street' onChange={onChangeHandler} value={data.street} type="text" placeholder='Street' />
        <div className="multi-fields">
          <input required name='city' onChange={onChangeHandler}
          value={data.city} type="text" placeholder='City' />
          <input required name='state' onChange={onChangeHandler} value={data.state} type="text" placeholder='State' />
        </div>
        <div className="multi-fields">
          <input required name='zipcode' onChange={onChangeHandler} value={data.zipcode} type="text" placeholder='Zip code' />
          <input required name='country' onChange={onChangeHandler} value={data.country} type="text" placeholder='Country' />
        </div>
        <input required name='phone' onChange={onChangeHandler} value={data.phone} type="text" placeholder='Phone' />
      </div>

      <div className="place-order-right">
        <div className="cart-total">
          <h2>Cart Totals</h2>
          <div>
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>Rs {getTotalCartAmount()}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>Rs {getTotalCartAmount() === 0 ? 0 : 2}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <b>Total</b>
              <b>Rs {getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 2}</b>
            </div>
            <div className="payment-method">
              <p>Select Payment Method:</p>
              <div className='payment-method-inputs'>
                <input
                  type="radio"
                  id="stripe"
                  name="paymentMethod"
                  value="stripe"
                  checked={paymentMethod === 'stripe'}
                  onChange={() => setPaymentMethod('stripe')}
                />
                <label htmlFor="stripe">Stripe (Online Payment)</label>
              </div>
              <div className='payment-method-inputs'>
                <input
                  type="radio"
                  id="cod"
                  name="paymentMethod"
                  value="cod"
                  checked={paymentMethod === 'cod'}
                  onChange={() => setPaymentMethod('cod')}
                />
                <label htmlFor="cod">Cash on Delivery</label>
              </div>
              <div className='payment-method-inputs'>
                <input
                  type="radio"
                  id="esewa"
                  name="paymentMethod"
                  value="esewa"
                  checked={paymentMethod === 'esewa'}
                  onChange={() => setPaymentMethod('esewa')}
                />
                <label htmlFor="esewa">eSewa</label>
              </div>
            </div>
          </div>
          <button type='submit'>PLACE ORDER</button>
        </div>
        
      </div>
    </form>
  );
};

export default PlaceOrder;

