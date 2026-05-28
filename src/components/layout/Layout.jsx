import Navbar from './Navbar'
import Footer from './Footer'

export default function Layout({ children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '100%', minWidth: 0 }}>
      <Navbar />
      <main style={{ flex: 1, width: '100%', minWidth: 0 }}>
        {children}
      </main>
      <Footer />
    </div>
  )
}