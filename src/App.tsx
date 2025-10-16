import { useState } from "react";
import { AnimatePresence } from "motion/react";
import { Toaster } from "./components/ui/sonner";
import { CatalogPage } from "./components/CatalogPage";
import { OrdersPage } from "./components/OrdersPage";
import { ProfilePage } from "./components/ProfilePage";
import { ProductDetailPage } from "./components/ProductDetailPage";
import { ChatPage } from "./components/ChatPage";
import { BottomNav } from "./components/BottomNav";
import { WorksPage } from "./components/WorksPage";
import { DesignerChatPage } from "./components/DesignerChatPage";
import { DesignerProfilePage } from "./components/DesignerProfilePage";
import { AdminChatPage } from "./components/AdminChatPage";
import { AdminOrdersPage } from "./components/AdminOrdersPage";
import { AdminProfilePage } from "./components/AdminProfilePage";
import { AppProvider, Product, useApp } from "./contexts/AppContext";

function AppContent() {
  const { currentUser } = useApp();
  const [activeTab, setActiveTab] = useState<"catalog" | "orders" | "profile" | "works">(
    currentUser.role === "designer" ? "works" : "catalog"
  );
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedOrderNumber, setSelectedOrderNumber] = useState<number | null>(null);

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
  };

  const handleBackFromProduct = () => {
    setSelectedProduct(null);
  };

  const handleOrderClick = (orderNumber: number) => {
    setSelectedOrderNumber(orderNumber);
  };

  const handleBackFromChat = () => {
    setSelectedOrderNumber(null);
  };

  // Determine which chat component to use based on role and context
  const renderChatPage = () => {
    if (!selectedOrderNumber) return null;
    
    if (currentUser.role === "admin") {
      return (
        <AdminChatPage
          key={`admin-chat-${selectedOrderNumber}`}
          orderNumber={selectedOrderNumber}
          onBack={handleBackFromChat}
        />
      );
    } else if (currentUser.role === "designer" && activeTab === "works") {
      // Designer viewing their work orders (as designer)
      return (
        <DesignerChatPage
          key={`designer-chat-${selectedOrderNumber}`}
          orderNumber={selectedOrderNumber}
          onBack={handleBackFromChat}
        />
      );
    } else {
      // User or designer viewing their own orders (as customer)
      return (
        <ChatPage
          key={`user-chat-${selectedOrderNumber}`}
          orderNumber={selectedOrderNumber}
          onBack={handleBackFromChat}
        />
      );
    }
  };

  // Determine which profile to show
  const renderProfilePage = () => {
    if (currentUser.role === "admin") {
      return <AdminProfilePage key="admin-profile" />;
    } else if (currentUser.role === "designer") {
      return <DesignerProfilePage key="designer-profile" />;
    }
    return <ProfilePage key="profile" />;
  };

  return (
    <div className="dark min-h-screen bg-[rgb(0,0,0)] overflow-x-hidden">
      <div className="max-w-[430px] mx-auto relative min-h-screen bg-black overflow-hidden">
        {/* Page Content */}
        <AnimatePresence mode="wait">
          {selectedProduct ? (
            <ProductDetailPage
              key="product-detail"
              product={selectedProduct}
              onBack={handleBackFromProduct}
            />
          ) : selectedOrderNumber ? (
            renderChatPage()
          ) : activeTab === "catalog" ? (
            <CatalogPage
              key="catalog"
              onProductClick={handleProductClick}
            />
          ) : activeTab === "orders" ? (
            currentUser.role === "admin" ? (
              <AdminOrdersPage key="admin-orders" onOrderClick={handleOrderClick} />
            ) : (
              <OrdersPage key="orders" onOrderClick={handleOrderClick} />
            )
          ) : activeTab === "works" ? (
            <WorksPage key="works" onOrderClick={handleOrderClick} />
          ) : activeTab === "profile" ? (
            renderProfilePage()
          ) : null}
        </AnimatePresence>

        {/* Bottom Navigation */}
        {!selectedProduct && !selectedOrderNumber && (
          <BottomNav 
            activeTab={activeTab} 
            onTabChange={setActiveTab}
            userRole={currentUser.role}
          />
        )}

        {/* Toast Notifications */}
        <Toaster
          theme="dark"
          position="top-center"
          toastOptions={{
            style: {
              background: "rgba(18, 18, 18, 0.9)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              color: "white",
            },
          }}
        />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
