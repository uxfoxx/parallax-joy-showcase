import { createContext, useContext, useState, type ReactNode } from "react";

type ProductModalContextValue = {
  openProductModal: (slug: string) => void;
  closeProductModal: () => void;
  activeSlug: string | null;
};

const ProductModalContext = createContext<ProductModalContextValue | null>(null);

export const ProductModalProvider = ({ children }: { children: ReactNode }) => {
  const [activeSlug, setActiveSlug] = useState<string | null>(null);

  return (
    <ProductModalContext.Provider
      value={{
        openProductModal: (slug) => setActiveSlug(slug),
        closeProductModal: () => setActiveSlug(null),
        activeSlug,
      }}
    >
      {children}
    </ProductModalContext.Provider>
  );
};

export const useProductModal = () => {
  const ctx = useContext(ProductModalContext);
  if (!ctx) throw new Error("useProductModal must be used within ProductModalProvider");
  return ctx;
};
