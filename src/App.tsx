import { Suspense, lazy } from 'react'
import { Route, Routes } from 'react-router-dom'
import { RootLayout } from './components/layout/RootLayout'
import { Home } from './pages/Home'
import { Shop } from './pages/Shop'
import { ProductDetail } from './pages/ProductDetail'
import { Categories } from './pages/Categories'
import { CategoryDetail } from './pages/CategoryDetail'
import { Brands } from './pages/Brands'
import { BrandDetail } from './pages/BrandDetail'
import { About } from './pages/About'
import { Contact } from './pages/Contact'
import { NotFound } from './pages/NotFound'

// The admin app is a separate chunk — public visitors never download it.
const AdminRoot = lazy(() => import('./pages/admin/AdminRoot').then((m) => ({ default: m.AdminRoot })))
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin').then((m) => ({ default: m.AdminLogin })))
const AccessDenied = lazy(() => import('./pages/admin/AccessDenied').then((m) => ({ default: m.AccessDenied })))
const ProtectedRoute = lazy(() =>
  import('./components/admin/ProtectedRoute').then((m) => ({ default: m.ProtectedRoute })),
)
const AdminLayout = lazy(() => import('./components/admin/AdminLayout').then((m) => ({ default: m.AdminLayout })))
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard').then((m) => ({ default: m.AdminDashboard })))
const AdminProducts = lazy(() => import('./pages/admin/AdminProducts').then((m) => ({ default: m.AdminProducts })))
const AdminProductForm = lazy(() =>
  import('./pages/admin/AdminProductForm').then((m) => ({ default: m.AdminProductForm })),
)
const AdminCategories = lazy(() =>
  import('./pages/admin/AdminCategories').then((m) => ({ default: m.AdminCategories })),
)
const AdminBrands = lazy(() => import('./pages/admin/AdminBrands').then((m) => ({ default: m.AdminBrands })))
const AdminMedia = lazy(() => import('./pages/admin/AdminMedia').then((m) => ({ default: m.AdminMedia })))

function AdminChunkFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-space-black" aria-busy="true">
      <span className="text-sm text-starlight/60">Loading admin…</span>
    </div>
  )
}

function App() {
  return (
    <Suspense fallback={<AdminChunkFallback />}>
      <Routes>
        <Route element={<RootLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:slug" element={<ProductDetail />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/categories/:slug" element={<CategoryDetail />} />
          <Route path="/brands" element={<Brands />} />
          <Route path="/brands/:slug" element={<BrandDetail />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Route>

        <Route path="/admin" element={<AdminRoot />}>
          <Route path="login" element={<AdminLogin />} />
          <Route path="access-denied" element={<AccessDenied />} />

          <Route element={<ProtectedRoute />}>
            <Route element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="products/new" element={<AdminProductForm />} />
              <Route path="products/:id/edit" element={<AdminProductForm />} />
              <Route path="categories" element={<AdminCategories />} />
              <Route path="brands" element={<AdminBrands />} />
              <Route path="media" element={<AdminMedia />} />
            </Route>
          </Route>
        </Route>
      </Routes>
    </Suspense>
  )
}

export default App
