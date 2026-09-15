import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './lib/auth'

// layout
import { Navbar } from './components/layout/Navbar'
import { Footer } from './components/layout/Footer'
import { DashboardShell } from './components/layout/DashboardShell'
import { ProtectedRoute } from './components/layout/ProtectedRoute'

// public pages
import { Home } from './pages/Home'
import { About } from './pages/About'
import { Properties } from './pages/Properties'
import { PropertyDetail } from './pages/PropertyDetail'
import { HowItWorks } from './pages/HowItWorks'
import { Login } from './pages/Login'
import { Contact } from './pages/Contact'
import { NotFound } from './pages/NotFound'

// buyer
import { BuyerDashboard } from './pages/buyer/BuyerDashboard'
import { BuyerRequests } from './pages/buyer/BuyerRequests'
import { BuyerRequestDetail } from './pages/buyer/BuyerRequestDetail'

// owner
import { OwnerDashboard } from './pages/owner/OwnerDashboard'
import { OwnerProperties } from './pages/owner/OwnerProperties'
import { PropertyForm } from './pages/owner/PropertyForm'
import { OwnerRequests } from './pages/owner/OwnerRequests'

// admin
import { AdminDashboard } from './pages/admin/AdminDashboard'
import { AdminProperties } from './pages/admin/AdminProperties'
import { AdminUsers } from './pages/admin/AdminUsers'
import { AdminRequests } from './pages/admin/AdminRequests'

import { FloatingWhatsApp } from './components/shared/FloatingWhatsApp'
import { useScrollToHash } from './hooks/useScrollToHash'

function ScrollHandler() {
  useScrollToHash()
  return null
}

function App() {
  return (
    <BrowserRouter>
      <ScrollHandler />
      <AuthProvider>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-1">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/properties" element={<Properties />} />
              <Route path="/properties/:id" element={<PropertyDetail />} />
              <Route path="/how-it-works" element={<HowItWorks />} />
              <Route path="/login" element={<Login />} />
              <Route path="/contact" element={<Contact />} />

              {/* Buyer Routes */}
              <Route path="/buyer" element={<ProtectedRoute role="buyer"><DashboardShell /></ProtectedRoute>}>
                <Route path="dashboard" element={<BuyerDashboard />} />
                <Route path="requests" element={<BuyerRequests />} />
                <Route path="requests/:id" element={<BuyerRequestDetail />} />
              </Route>

              {/* Owner Routes */}
              <Route path="/owner" element={<ProtectedRoute role="owner"><DashboardShell /></ProtectedRoute>}>
                <Route path="dashboard" element={<OwnerDashboard />} />
                <Route path="properties" element={<OwnerProperties />} />
                <Route path="properties/new" element={<PropertyForm />} />
                <Route path="properties/:id/edit" element={<PropertyForm />} />
                <Route path="requests" element={<OwnerRequests />} />
              </Route>

              {/* Admin Routes */}
              <Route path="/admin" element={<ProtectedRoute role="admin"><DashboardShell /></ProtectedRoute>}>
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="properties" element={<AdminProperties />} />
                <Route path="users" element={<AdminUsers />} />
                <Route path="requests" element={<AdminRequests />} />
              </Route>

              {/* 404 Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <FloatingWhatsApp />
          <Footer />
        </div>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
