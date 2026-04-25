import React from 'react';

const ProductSkeleton = () => {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm animate-pulse">
      {/* Image Placeholder */}
      <div className="aspect-[4/5] bg-gray-200" />
      
      {/* Content Placeholder */}
      <div className="p-6">
        {/* Brand & Rating */}
        <div className="flex justify-between items-center mb-3">
          <div className="h-3 bg-gray-200 rounded-full w-1/4" />
          <div className="h-3 bg-gray-200 rounded-full w-1/6" />
        </div>
        
        {/* Title */}
        <div className="h-5 bg-gray-200 rounded-full w-3/4 mb-4" />
        
        {/* Price & Button */}
        <div className="flex items-center justify-between mt-4">
          <div className="h-7 bg-gray-200 rounded-full w-1/3" />
          <div className="h-9 bg-gray-200 rounded-xl w-20" />
        </div>
      </div>
    </div>
  );
};

export default ProductSkeleton;
