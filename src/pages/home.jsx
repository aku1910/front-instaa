import Header from 'components/header'
import React from 'react'
import Story from "../components/story"
import Posts from "../components/posts"
import Footer from 'components/footer'
const home = () => {
  return (
    <div>
      <Header />
    <div>
    <div>
      <div className='flex justify-center '>
        <Story />
      </div>
      <div className='flex justify-center'>
        <Posts />
      </div>
    </div>
    </div>
    <div>
      <Footer/>
    </div>
    </div>
  )
}

export default home