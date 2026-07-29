import { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"
import Categories from "../../globals/types/components/categories/categories"
import Footer from "../../globals/types/components/footer/footer"
import Navbar from "../../globals/types/components/Navbar/navbar"
import ProductPage from "../product/Product"
import Feature from "./feature"
import ModernDarkHero from "./Hero"
import PaymentSection from "./PaymentSection"
import { APIWITHTOKEN } from "../../http"

const Home = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [khaltiStatus, setKhaltiStatus] = useState<"success" | "failed" | null>(null)

  useEffect(() => {
    const pidx = searchParams.get("pidx")
    const status = searchParams.get("status")

    if (pidx && status === "Completed") {
      // Verify with backend
      APIWITHTOKEN.post("/order/verify-pidx", { pidx })
        .then(() => {
          setKhaltiStatus("success")
          // Clean URL params
          setSearchParams({})
        })
        .catch(() => {
          setKhaltiStatus("failed")
          setSearchParams({})
        })
    }
  }, [])

  return (
    <>
      <Navbar />

      {/* Khalti Payment Status Banner */}
      {khaltiStatus === "success" && (
        <div className="bg-green-500/15 border-b border-green-500/30 text-green-400 text-center py-3 text-sm font-semibold flex items-center justify-center gap-2">
          <span>✅</span>
          <span>Payment successful! Your order has been confirmed and stock updated.</span>
          <button onClick={() => setKhaltiStatus(null)} className="ml-4 text-green-300 hover:text-white text-xs underline">Dismiss</button>
        </div>
      )}
      {khaltiStatus === "failed" && (
        <div className="bg-red-500/15 border-b border-red-500/30 text-red-400 text-center py-3 text-sm font-semibold flex items-center justify-center gap-2">
          <span>❌</span>
          <span>Payment verification failed. Please contact support if you were charged.</span>
          <button onClick={() => setKhaltiStatus(null)} className="ml-4 text-red-300 hover:text-white text-xs underline">Dismiss</button>
        </div>
      )}

      <ModernDarkHero />
      <Feature />
      <Categories />
      <ProductPage />
      <PaymentSection />
      <Footer />
    </>
  )
}

export default Home