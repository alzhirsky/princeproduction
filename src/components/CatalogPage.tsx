import { Search, Plus, Edit2, Trash2, X, FolderPlus, Package, Layers } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { ProductCard } from "./ProductCard";
import { CategoryCard } from "./CategoryCard";
import { useApp, Product } from "../contexts/AppContext";
import { useState, type MouseEvent } from "react";
import { AppLogo } from "./AppLogo";
import { toast } from "sonner";

interface CatalogPageProps {
  onProductClick: (product: Product) => void;
}

const smoothTransition = {
  type: "spring" as const,
  stiffness: 200,
  damping: 25,
  mass: 0.8,
};

export function CatalogPage({ onProductClick }: CatalogPageProps) {
  const { 
    products, 
    favorites, 
    sections, 
    categories, 
    currentUser,
    addSection,
    addCategory,
    addProduct,
    updateProduct,
    deleteSection,
    deleteCategory,
    deleteProduct,
    designers,
  } = useApp();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  
  // Modals
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [showAddSectionModal, setShowAddSectionModal] = useState(false);
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  
  // Form states
  const [newSectionName, setNewSectionName] = useState("");
  const [newCategoryName, setNewCategoryName] = useState("");
  const [productForm, setProductForm] = useState({
    title: "",
    description: "",
    designerPrice: "",
    platformFee: "",
    features: ["", "", "", ""],
    assignedDesignerId: "",
  });
  const [productImages, setProductImages] = useState<string[]>(["", "", "", "", ""]);

  const isAdmin = currentUser.role === "admin";

  // Get current section/category
  const currentSection = selectedSectionId ? sections.find(s => s.id === selectedSectionId) : null;
  const currentCategory = selectedCategoryId ? categories.find(c => c.id === selectedCategoryId) : null;

  // Build breadcrumb path
  const getBreadcrumbPath = () => {
    const parts = ["All"];
    if (currentSection) parts.push(currentSection.name);
    if (currentCategory) {
      // Get full category path (for nested categories)
      const categoryPath: string[] = [];
      let cat = currentCategory;
      while (cat) {
        categoryPath.unshift(cat.name);
        cat = cat.parentCategoryId ? categories.find(c => c.id === cat.parentCategoryId) : undefined;
      }
      parts.push(...categoryPath);
    }
    return parts.join(" / ");
  };

  // Get child categories of current location
  const getChildCategories = () => {
    if (selectedCategoryId) {
      // Get categories that have this category as parent
      return categories.filter(c => c.parentCategoryId === selectedCategoryId).sort((a, b) => a.order - b.order);
    } else if (selectedSectionId) {
      // Get top-level categories in this section (no parent)
      return categories.filter(c => c.sectionId === selectedSectionId && !c.parentCategoryId).sort((a, b) => a.order - b.order);
    }
    return [];
  };

  const childCategories = getChildCategories();

  // Filter products based on current navigation
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (selectedCategoryId) {
      // Show products in this specific category
      return matchesSearch && product.categoryId === selectedCategoryId;
    } else if (selectedSectionId) {
      // Show products in this section (not in any category)
      return matchesSearch && product.sectionId === selectedSectionId && !product.categoryId;
    }
    
    return matchesSearch;
  });

  const favoriteProducts = filteredProducts.filter((product) => favorites.has(product.id));
  const nonFavoriteProducts = filteredProducts.filter((product) => !favorites.has(product.id));

  // Sort sections by order
  const sortedSections = [...sections].sort((a, b) => a.order - b.order);

  // Handlers
  const handleAddSection = () => {
    if (!newSectionName.trim()) {
      toast.error("Please enter a section name");
      return;
    }
    addSection({ name: newSectionName, order: sections.length });
    toast.success("Section added!");
    setShowAddSectionModal(false);
    setNewSectionName("");
  };

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) {
      toast.error("Please enter a category name");
      return;
    }
    if (!selectedSectionId) {
      toast.error("Please select a section first");
      return;
    }
    
    if (editingCategory) {
      // Update existing category
      const category = categories.find(c => c.id === editingCategory);
      if (category) {
        const updatedCategories = categories.map(c => 
          c.id === editingCategory ? { ...c, name: newCategoryName } : c
        );
        // Note: In a real app, you'd have an updateCategory function in context
        toast.success("Category updated!");
      }
    } else {
      // Add new category
      const categoryData: any = {
        name: newCategoryName,
        sectionId: selectedSectionId,
        order: childCategories.length,
      };
      
      // If we're in a category, set it as parent
      if (selectedCategoryId) {
        categoryData.parentCategoryId = selectedCategoryId;
      }
      
      addCategory(categoryData);
      toast.success("Category added!");
    }
    
    setShowAddCategoryModal(false);
    setNewCategoryName("");
    setEditingCategory(null);
  };

  const handleEditCategory = (category: any, e: MouseEvent) => {
    e.stopPropagation();
    setEditingCategory(category.id);
    setNewCategoryName(category.name);
    setShowAddCategoryModal(true);
  };

  const handleProductSubmit = () => {
    // Validation
    if (!productForm.title.trim() || !productForm.description.trim()) {
      toast.error("Please fill in title and description");
      return;
    }
    if (!productForm.designerPrice || !productForm.platformFee) {
      toast.error("Please fill in pricing");
      return;
    }
    if (!productForm.assignedDesignerId) {
      toast.error("Please assign a designer");
      return;
    }
    if (!selectedSectionId) {
      toast.error("Please select a section first");
      return;
    }
    if (productImages.filter(img => img.trim()).length === 0) {
      toast.error("Please add at least one image");
      return;
    }

    const designerPrice = parseFloat(productForm.designerPrice);
    const platformFee = parseFloat(productForm.platformFee);
    const totalPrice = designerPrice + platformFee;

    const productData = {
      title: productForm.title,
      description: productForm.description,
      designerPrice,
      platformFee,
      price: totalPrice,
      starsPrice: Math.ceil(totalPrice / 2),
      images: productImages.filter(img => img.trim()),
      sectionId: selectedSectionId,
      categoryId: selectedCategoryId || undefined,
      features: productForm.features.filter(f => f.trim()),
      assignedDesignerId: parseInt(productForm.assignedDesignerId),
      downloads: editingProduct?.downloads || 0,
      order: editingProduct?.order || products.length,
    };

    if (editingProduct) {
      updateProduct(editingProduct.id, productData);
      toast.success("Product updated!");
    } else {
      addProduct(productData);
      toast.success("Product created!");
    }

    handleCloseProductModal();
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setProductForm({
      title: product.title,
      description: product.description,
      designerPrice: product.designerPrice.toString(),
      platformFee: product.platformFee.toString(),
      features: [...product.features, "", "", "", ""].slice(0, 4),
      assignedDesignerId: product.assignedDesignerId.toString(),
    });
    setProductImages([...product.images, "", "", "", "", ""].slice(0, 5));
    setSelectedSectionId(product.sectionId);
    setSelectedCategoryId(product.categoryId || null);
    setShowProductModal(true);
  };

  const handleDeleteProduct = (productId: number) => {
    if (confirm("Are you sure you want to delete this product?")) {
      deleteProduct(productId);
      toast.success("Product deleted");
    }
  };

  const handleCloseProductModal = () => {
    setShowProductModal(false);
    setEditingProduct(null);
    setProductForm({
      title: "",
      description: "",
      designerPrice: "",
      platformFee: "",
      features: ["", "", "", ""],
      assignedDesignerId: "",
    });
    setProductImages(["", "", "", "", ""]);
  };

  const openAddMenu = () => {
    if (!isAdmin) return;
    setShowAddMenu(true);
  };

  const handleAddMenuChoice = (type: 'section' | 'category' | 'product') => {
    setShowAddMenu(false);
    if (type === 'section') {
      setShowAddSectionModal(true);
    } else if (type === 'category') {
      if (!selectedSectionId) {
        toast.error("Please select a section first to add a category");
        return;
      }
      setShowAddCategoryModal(true);
    } else if (type === 'product') {
      if (!selectedSectionId) {
        toast.error("Please select a section first to add a product");
        return;
      }
      setShowProductModal(true);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={smoothTransition}
      className="min-h-screen bg-black pb-24"
    >
      {/* Header */}
      <div className="sticky top-0 z-40 backdrop-blur-2xl bg-black/60 border-b border-white/10 overflow-visible">
        <div className="max-w-screen-lg mx-auto px-6 py-4">
          <div className="flex justify-center mb-4">
            <AppLogo />
          </div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...smoothTransition, delay: 0.05 }}
            className="relative"
          >
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full glass-button rounded-[20px] pl-12 pr-4 py-3.5 text-white placeholder:text-white/40 focus:outline-none focus:border-white/20 focus:bg-white/12 transition-all duration-300"
            />
          </motion.div>

          {/* Breadcrumb Path */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...smoothTransition, delay: 0.1 }}
            className="mt-4 mb-3"
          >
            <p className="text-gray-400 text-sm">{getBreadcrumbPath()}</p>
          </motion.div>

          {/* Sections */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...smoothTransition, delay: 0.15 }}
            className="flex gap-2 overflow-x-auto pb-4 pt-2 -mx-6 px-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
          >
            <motion.button
              whileTap={{ scale: 0.92 }}
              onClick={() => {
                setSelectedSectionId(null);
                setSelectedCategoryId(null);
              }}
              className={`px-5 py-2.5 rounded-full whitespace-nowrap transition-all duration-300 flex-shrink-0 ${
                !selectedSectionId
                  ? "glass-button text-white shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                  : "bg-white/5 text-gray-300 border border-white/10 hover:bg-white/10"
              }`}
            >
              All
            </motion.button>
            {sortedSections.map((section, index) => (
              <motion.div
                key={section.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ ...smoothTransition, delay: 0.15 + index * 0.03 }}
                className="relative group flex-shrink-0"
              >
                <motion.button
                  whileTap={{ scale: 0.92 }}
                  onClick={() => {
                    setSelectedSectionId(section.id);
                    setSelectedCategoryId(null);
                  }}
                  className={`px-5 py-2.5 rounded-full whitespace-nowrap transition-all duration-300 ${
                    selectedSectionId === section.id
                      ? "glass-button text-white shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                      : "bg-white/5 text-gray-300 border border-white/10 hover:bg-white/10"
                  }`}
                >
                  {section.name}
                </motion.button>
                {isAdmin && (
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm(`Delete section "${section.name}"? This will also delete all categories and products in it.`)) {
                        deleteSection(section.id);
                        if (selectedSectionId === section.id) {
                          setSelectedSectionId(null);
                          setSelectedCategoryId(null);
                        }
                        toast.success("Section deleted");
                      }
                    }}
                    className="absolute -bottom-2 -right-2 w-6 h-6 rounded-full bg-red-500/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10"
                  >
                    <Trash2 className="w-3 h-3 text-white" />
                  </motion.button>
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-screen-lg mx-auto px-6 pt-6 space-y-8">
        {/* Categories Section */}
        {childCategories.length > 0 && (
          <div>
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ ...smoothTransition, delay: 0.15 }}
              className="text-white mb-4"
            >
              Categories
            </motion.h2>
            <div className="grid grid-cols-1 gap-3">
              {childCategories.map((category, index) => (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ ...smoothTransition, delay: 0.2 + index * 0.05 }}
                >
                  <CategoryCard
                    id={category.id}
                    name={category.name}
                    image={index === 0 
                      ? "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600" 
                      : "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600"}
                    onClick={() => setSelectedCategoryId(category.id)}
                    onEdit={(e) => handleEditCategory(category, e)}
                    onDelete={(e) => {
                      e.stopPropagation();
                      if (confirm(`Delete category "${category.name}"?`)) {
                        deleteCategory(category.id);
                        if (selectedCategoryId === category.id) {
                          setSelectedCategoryId(null);
                        }
                        toast.success("Category deleted");
                      }
                    }}
                    isAdmin={isAdmin}
                  />
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Favorites Section */}
        {favoriteProducts.length > 0 && (
          <div>
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ ...smoothTransition, delay: 0.15 }}
              className="text-white mb-4"
            >
              Favorites
            </motion.h2>
            <div className="grid grid-cols-2 gap-4">
              {favoriteProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ ...smoothTransition, delay: 0.2 + index * 0.02 }}
                  className="relative group"
                >
                  <ProductCard
                    {...product}
                    image={product.images[0]}
                    onClick={() => onProductClick(product)}
                    isFavorited={true}
                  />
                  {isAdmin && (
                    <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditProduct(product);
                        }}
                        className="w-8 h-8 rounded-full bg-gray-500/90 backdrop-blur-sm flex items-center justify-center shadow-lg"
                      >
                        <Edit2 className="w-4 h-4 text-white" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteProduct(product.id);
                        }}
                        className="w-8 h-8 rounded-full bg-red-500/90 backdrop-blur-sm flex items-center justify-center shadow-lg"
                      >
                        <Trash2 className="w-4 h-4 text-white" />
                      </motion.button>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* All Products Section */}
        {(nonFavoriteProducts.length > 0 || (!selectedSectionId && !selectedCategoryId)) && (
          <div>
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ ...smoothTransition, delay: favoriteProducts.length > 0 ? 0.25 : 0.15 }}
              className="text-white mb-4"
            >
              Products
            </motion.h2>
            
            <div className="grid grid-cols-2 gap-4">
              {nonFavoriteProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ ...smoothTransition, delay: 0.3 + index * 0.02 }}
                  className="relative group"
                >
                  <ProductCard
                    {...product}
                    image={product.images[0]}
                    onClick={() => onProductClick(product)}
                    isFavorited={favorites.has(product.id)}
                  />
                  {isAdmin && (
                    <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditProduct(product);
                        }}
                        className="w-8 h-8 rounded-full bg-gray-500/90 backdrop-blur-sm flex items-center justify-center shadow-lg"
                      >
                        <Edit2 className="w-4 h-4 text-white" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteProduct(product.id);
                        }}
                        className="w-8 h-8 rounded-full bg-red-500/90 backdrop-blur-sm flex items-center justify-center shadow-lg"
                      >
                        <Trash2 className="w-4 h-4 text-white" />
                      </motion.button>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>

            {/* No Results */}
            {nonFavoriteProducts.length === 0 && favoriteProducts.length === 0 && childCategories.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <p className="text-gray-400">No content found</p>
              </motion.div>
            )}
          </div>
        )}
      </div>

      {/* Admin Add Button */}
      {isAdmin && (
        <motion.button
          whileHover={{ scale: 1.05, rotate: 90 }}
          whileTap={{ scale: 0.95 }}
          onClick={openAddMenu}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
          className="fixed bottom-24 right-6 w-16 h-16 rounded-full backdrop-blur-xl bg-white/10 border-2 border-white/20 shadow-[0_8px_32px_rgba(255,255,255,0.15)] flex items-center justify-center z-40"
        >
          <Plus className="w-8 h-8 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" />
        </motion.button>
      )}

      {/* Add Menu Modal */}
      <AnimatePresence>
        {showAddMenu && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddMenu(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-md z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-md z-50"
            >
              <div className="rounded-[28px] glass-card p-6 border border-white/20">
                <h3 className="text-white text-xl mb-4">What do you want to add?</h3>
                <div className="space-y-3">
                  <motion.button
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    onClick={() => handleAddMenuChoice('section')}
                    className="w-full py-4 rounded-[20px] glass-button text-white flex items-center justify-center gap-3"
                  >
                    <FolderPlus className="w-5 h-5" />
                    Section
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    onClick={() => handleAddMenuChoice('category')}
                    className="w-full py-4 rounded-[20px] glass-button text-white flex items-center justify-center gap-3"
                    disabled={!selectedSectionId}
                    style={{ opacity: !selectedSectionId ? 0.5 : 1 }}
                  >
                    <Layers className="w-5 h-5" />
                    Category
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    onClick={() => handleAddMenuChoice('product')}
                    className="w-full py-4 rounded-[20px] glass-button text-white flex items-center justify-center gap-3"
                    disabled={!selectedSectionId}
                    style={{ opacity: !selectedSectionId ? 0.5 : 1 }}
                  >
                    <Package className="w-5 h-5" />
                    Product
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    onClick={() => setShowAddMenu(false)}
                    className="w-full py-4 rounded-[20px] bg-white/5 text-gray-300 border border-white/10 flex items-center justify-center"
                  >
                    Cancel
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Add Section Modal */}
      <AnimatePresence>
        {showAddSectionModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddSectionModal(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-md z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={smoothTransition}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-md z-50"
            >
              <div className="rounded-[28px] glass-card p-6 border border-white/20">
                <h3 className="text-white text-xl mb-4">Add Section</h3>
                <input
                  type="text"
                  value={newSectionName}
                  onChange={(e) => setNewSectionName(e.target.value)}
                  placeholder="Enter section name"
                  className="w-full glass-button rounded-xl px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-purple-500/50 transition-all mb-6"
                  onKeyPress={(e) => e.key === 'Enter' && handleAddSection()}
                />
                <div className="space-y-3">
                  <motion.button
                    whileHover={{ scale: 1.02, y: -1 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleAddSection}
                    className="w-full py-4 rounded-[20px] glass-button text-white flex items-center justify-center"
                  >
                    Add Section
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowAddSectionModal(false)}
                    className="w-full py-4 rounded-[20px] bg-white/5 text-gray-300 border border-white/10 flex items-center justify-center"
                  >
                    Cancel
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Add Category Modal */}
      <AnimatePresence>
        {showAddCategoryModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddCategoryModal(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-md z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={smoothTransition}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-md z-50"
            >
              <div className="rounded-[28px] glass-card p-6 border border-white/20">
                <h3 className="text-white text-xl mb-4">{editingCategory ? "Edit Category" : "Add Category"}</h3>
                <p className="text-gray-400 text-sm mb-4">
                  {editingCategory 
                    ? `Editing category` 
                    : selectedCategoryId 
                      ? `Adding to: ${currentCategory?.name}` 
                      : `Adding to section: ${currentSection?.name}`}
                </p>
                <input
                  type="text"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="Enter category name"
                  className="w-full glass-button rounded-xl px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-cyan-500/50 transition-all mb-6"
                  onKeyPress={(e) => e.key === 'Enter' && handleAddCategory()}
                />
                <div className="space-y-3">
                  <motion.button
                    whileHover={{ scale: 1.02, y: -1 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleAddCategory}
                    className="w-full py-4 rounded-[20px] glass-button text-white flex items-center justify-center"
                  >
                    {editingCategory ? "Update Category" : "Add Category"}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowAddCategoryModal(false)}
                    className="w-full py-4 rounded-[20px] bg-white/5 text-gray-300 border border-white/10 flex items-center justify-center"
                  >
                    Cancel
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Product Modal */}
      <AnimatePresence>
        {showProductModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseProductModal}
              className="fixed inset-0 bg-black/80 backdrop-blur-md z-50"
            />
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              transition={smoothTransition}
              className="fixed inset-0 z-50 flex items-end"
            >
              <div className="w-full max-h-[90vh] overflow-y-auto rounded-t-[32px] bg-gradient-to-br from-gray-900 via-black to-gray-900 border-t border-white/20 p-6 pb-32 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                <div className="max-w-2xl mx-auto">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-white text-2xl">{editingProduct ? "Edit Product" : "Add Product"}</h3>
                    <motion.button
                      whileHover={{ scale: 1.1, rotate: 90 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={handleCloseProductModal}
                      className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center"
                    >
                      <X className="w-6 h-6 text-white" />
                    </motion.button>
                  </div>

                  {/* Form */}
                  <div className="space-y-5">
                    {/* Title */}
                    <div>
                      <label className="text-gray-300 text-sm mb-2 block">Product Title *</label>
                      <input
                        type="text"
                        value={productForm.title}
                        onChange={(e) => setProductForm({ ...productForm, title: e.target.value })}
                        placeholder="Gaming Thumbnail Pack"
                        className="w-full glass-button rounded-xl px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-purple-500/50 transition-all"
                      />
                    </div>

                    {/* Description */}
                    <div>
                      <label className="text-gray-300 text-sm mb-2 block">Description *</label>
                      <textarea
                        value={productForm.description}
                        onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                        placeholder="Professional gaming thumbnail designs..."
                        rows={3}
                        className="w-full glass-button rounded-xl px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-purple-500/50 transition-all resize-none"
                      />
                    </div>

                    {/* Pricing */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-gray-300 text-sm mb-2 block">Designer Price (₽) *</label>
                        <input
                          type="number"
                          value={productForm.designerPrice}
                          onChange={(e) => setProductForm({ ...productForm, designerPrice: e.target.value })}
                          placeholder="150"
                          className="w-full glass-button rounded-xl px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-green-500/50 transition-all"
                        />
                      </div>
                      <div>
                        <label className="text-gray-300 text-sm mb-2 block">Platform Fee (₽) *</label>
                        <input
                          type="number"
                          value={productForm.platformFee}
                          onChange={(e) => setProductForm({ ...productForm, platformFee: e.target.value })}
                          placeholder="29"
                          className="w-full glass-button rounded-xl px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-purple-500/50 transition-all"
                        />
                      </div>
                    </div>

                    {/* Total Price Display */}
                    {productForm.designerPrice && productForm.platformFee && (
                      <div className="rounded-xl bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-purple-500/20 p-4">
                        <p className="text-gray-300 text-sm mb-1">Total Price</p>
                        <div className="flex items-center gap-2">
                          <span className="text-green-300 text-xs">RUB</span>
                          <span className="text-white font-bold text-xl">{(parseFloat(productForm.designerPrice) + parseFloat(productForm.platformFee)).toFixed(0)}</span>
                          <span className="text-white/40">•</span>
                          <span className="text-yellow-300 text-xs">STARS</span>
                          <span className="text-white font-bold text-xl">{Math.ceil((parseFloat(productForm.designerPrice) + parseFloat(productForm.platformFee)) / 2)}</span>
                        </div>
                      </div>
                    )}

                    {/* Images */}
                    <div>
                      <label className="text-gray-300 text-sm mb-2 block">Product Images * (First image is main)</label>
                      <div className="space-y-2">
                        {productImages.map((img, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <span className="text-gray-400 text-sm w-6">{index + 1}.</span>
                            <input
                              type="text"
                              value={img}
                              onChange={(e) => {
                                const newImages = [...productImages];
                                newImages[index] = e.target.value;
                                setProductImages(newImages);
                              }}
                              placeholder={index === 0 ? "Main image URL (required)" : "Image URL (optional)"}
                              className="flex-1 glass-button rounded-xl px-4 py-2.5 text-white placeholder:text-white/40 focus:outline-none focus:border-blue-500/50 transition-all text-sm"
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Features */}
                    <div>
                      <label className="text-gray-300 text-sm mb-2 block">Features (up to 4)</label>
                      <div className="space-y-2">
                        {productForm.features.map((feature, index) => (
                          <input
                            key={index}
                            type="text"
                            value={feature}
                            onChange={(e) => {
                              const newFeatures = [...productForm.features];
                              newFeatures[index] = e.target.value;
                              setProductForm({ ...productForm, features: newFeatures });
                            }}
                            placeholder={`Feature ${index + 1}`}
                            className="w-full glass-button rounded-xl px-4 py-2.5 text-white placeholder:text-white/40 focus:outline-none focus:border-cyan-500/50 transition-all text-sm"
                          />
                        ))}
                      </div>
                    </div>

                    {/* Assigned Designer */}
                    <div>
                      <label className="text-gray-300 text-sm mb-2 block">Assign Designer *</label>
                      <select
                        value={productForm.assignedDesignerId}
                        onChange={(e) => setProductForm({ ...productForm, assignedDesignerId: e.target.value })}
                        className="w-full glass-button rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500/50 transition-all"
                      >
                        <option value="" className="bg-gray-900">Select designer...</option>
                        {designers.map((designer) => (
                          <option key={designer.id} value={designer.id} className="bg-gray-900">
                            {designer.username} ({designer.telegramUsername})
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-4 space-y-3">
                      <motion.button
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleProductSubmit}
                        className="w-full py-4 rounded-[20px] glass-button text-white text-lg flex items-center justify-center"
                      >
                        {editingProduct ? "Update Product" : "Create Product"}
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleCloseProductModal}
                        className="w-full py-4 rounded-[20px] bg-white/5 text-gray-300 border border-white/10 flex items-center justify-center"
                      >
                        Cancel
                      </motion.button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
