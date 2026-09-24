import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './lib/auth'
import { RequestsProvider } from './lib/requests'
import { EventsProvider } from './lib/events'
import { ThemeProvider } from './lib/theme'
import { LeadsProvider } from './lib/leads'

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
import { Pricing } from './pages/Pricing'
import { Login } from './pages/Login'
import { Contact } from './pages/Contact'
import { NotFound } from './pages/NotFound'
import { PropertyHistory } from './pages/PropertyHistory'

// buyer
import { BuyerDashboard } from './pages/buyer/BuyerDashboard'
import { BuyerRequests } from './pages/buyer/BuyerRequests'
import { BuyerRequestDetail } from './pages/buyer/BuyerRequestDetail'

// owner
import { OwnerDashboard } from './pages/owner/OwnerDashboard'
import { OwnerProperties } from './pages/owner/OwnerProperties'
import { PropertyForm } from './pages/owner/PropertyForm'
import { OwnerRequests } from './pages/owner/OwnerRequests'

// agent
import { AgentDashboard } from './pages/agent/AgentDashboard'
import { AgentLeads } from './pages/agent/AgentLeads'
import { AgentListings } from './pages/agent/AgentListings'

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
    <ThemeProvider>
      <BrowserRouter>
        <ScrollHandler />
        <AuthProvider>
          <RequestsProvider>
            <EventsProvider>
              <LeadsProvider>
                <div className="flex flex-col min-h-screen">
                  <Navbar />
                  <main className="flex-1">
                    <Routes>
                      {/* Public Routes */}
                      <Route path="/" element={<Home />} />
                      <Route path="/about" element={<About />} />
                      <Route path="/pricing" element={<Pricing />} />
                      <Route path="/properties" element={<Properties />} />
                      <Route path="/properties/:id" element={<PropertyDetail />} />
                      <Route path="/properties/:id/history" element={<PropertyHistory />} />
                      <Route path="/how-it-works" element={<HowItWorks />} />
                      <Route path="/login" element={<Login />} />
                      <Route path="/contact" element={<Contact />} />

                      {/* Buyer Routes */}
                      <Route path="/buyer" element={<ProtectedRoute permission="request_site_visit"><DashboardShell /></ProtectedRoute>}>
                        <Route path="dashboard" element={<BuyerDashboard />} />
                        <Route path="requests" element={<BuyerRequests />} />
                        <Route path="requests/:id" element={<BuyerRequestDetail />} />
                      </Route>

                      {/* Owner Routes */}
                      <Route path="/owner" element={<ProtectedRoute permission="manage_own_properties"><DashboardShell /></ProtectedRoute>}>
                        <Route path="dashboard" element={<OwnerDashboard />} />
                        <Route path="properties" element={<OwnerProperties />} />
                        <Route path="properties/new" element={<PropertyForm />} />
                        <Route path="properties/:id/edit" element={<PropertyForm />} />
                        <Route path="requests" element={<OwnerRequests />} />
                      </Route>

                      {/* Agent Routes */}
                      <Route path="/agent" element={<ProtectedRoute permission="manage_leads"><DashboardShell /></ProtectedRoute>}>
                        <Route path="dashboard" element={<AgentDashboard />} />
                        <Route path="leads" element={<AgentLeads />} />
                        <Route path="listings" element={<AgentListings />} />
                      </Route>

                      {/* Admin Routes */}
                      <Route path="/admin" element={<ProtectedRoute permission="view_all_users"><DashboardShell /></ProtectedRoute>}>
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
              </LeadsProvider>
            </EventsProvider>
          </RequestsProvider>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
