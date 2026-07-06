import Benefits from "../components/Benefits"
import Hero from "../components/Hero"
import NavBar from "../components/NavBar"
import ProductSection from "../components/ProductSection"
import Stats from "../components/Stats"
import HowitWorks from '../components/HowItWorks'
import Testimonials from "../components/Testimonials"
import OrderSections from "../components/OrderSections"
import Footer from "../components/Footer"
import Ref from "./Ref"
import Chatbot from "../components/Chatbot"


const Index = () => {
  return (
    <div className='min-h-screen'>
        <NavBar/>
        <Hero/>
        <ProductSection/>
        <Benefits/>
        <Stats/>
        <HowitWorks/>
        <Testimonials/>
        <OrderSections/>
        <Footer/>
       {/*  <Ref/> */}
        <Chatbot/>
    </div>
  )
}

export default Index