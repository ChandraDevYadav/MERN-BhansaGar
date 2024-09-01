import React from 'react'
import './Dashboard.css'
import TotalCards from '../../components/TotalCards/TotalCards'
import OrderBarChart from '../OrderBarChart/OrderBarChart'
import OrderLineChart from '../../components/OrderLineChart/OrderLineChart'

const Dashboard = () => {
  return (
    <div className='dashboard'>
        <TotalCards/>
        <OrderBarChart/>
        <OrderLineChart/>
    </div>
  )
}

export default Dashboard