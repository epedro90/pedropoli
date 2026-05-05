import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import IntesaVincente from './games/intesa-vincente/IntesaVincente'
import AvantiUnAltro from './games/avanti-un-altro/AvantiUnAltro'
import Completamento from './games/completamento/Completamento'

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/intesa-vincente" element={<IntesaVincente />} />
        <Route path="/avanti-un-altro" element={<AvantiUnAltro />} />
        <Route path="/completamento" element={<Completamento />} />
      </Routes>
    </Layout>
  )
}
