import Categories from "../../globals/types/components/categories/categories"
import Footer from "../../globals/types/components/footer/footer"
import Navbar from "../../globals/types/components/Navbar/navbar"
import ProductPage from "../product/Product"

import Feature from "./feature"

import ModernDarkHero from "./Hero"


const Home = () => {
  return (

    <>
      <Navbar />
      <ModernDarkHero />
      <Feature />
      <Categories />
      <ProductPage />
      <Footer />



    </>
  )
}

export default Home