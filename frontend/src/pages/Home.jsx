import React from 'react'
import Hero from '../components/Hero'
import LatestCollection from '../components/LatestCollection'
import BestSeller from '../components/BestSeller'
import OurPolicy from '../components/OurPolicy'
import NewsLetter from '../components/NewsLtter'
import Footer from '../components/Footer'

const home = () => {
  return (
    <div>
        <Hero/>
         <LatestCollection/>
          <BestSeller/>
          <OurPolicy/>
          <NewsLetter/>
 
    </div>
  )
}

export default home