import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import IntesaVincente from './games/intesa-vincente/IntesaVincente'
import AvantiUnAltro from './games/avanti-un-altro/AvantiUnAltro'
import Completamento from './games/completamento/Completamento'
import ChiSono from './games/chi-sono/ChiSono'
import TabooSprint from './games/taboo-sprint/TabooSprint'
import IlFalso from './games/il-falso/IlFalso'

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/intesa-vincente" element={<IntesaVincente />} />
        <Route path="/avanti-un-altro" element={<AvantiUnAltro />} />
        <Route path="/completamento" element={<Completamento />} />
        <Route path="/chi-sono" element={<ChiSono />} />
        <Route path="/taboo-sprint" element={<TabooSprint />} />
        <Route path="/il-falso" element={<IlFalso />} />
      </Routes>
    </Layout>
  )
}
