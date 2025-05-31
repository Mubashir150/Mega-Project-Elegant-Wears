import React from 'react';

function SizeChartModal({ onClose, sizeChartType }) {
    let imageUrl = '';
    let chartTitle = '';

   
    switch (sizeChartType) {
        case 'jackets':
            imageUrl = '/images/Jackets.avif'; 
            chartTitle = 'Jacket Size Chart';
            break;
        case 'sweaters':
            imageUrl = '/images/sweater.webp'; 
            chartTitle = 'Sweater Size Chart';
            break;
        default:
            
            imageUrl = '';
            chartTitle = 'Size Chart Not Available';
    }

    return (
        <div className="fixed inset-0 bg-black/50 bg-opacity-70 flex items-center justify-center z-50">
            <div className="bg-gray-800 p-6 rounded-lg shadow-xl max-w-lg w-full relative text-gray-200">
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-gray-400 hover:text-gray-200 text-2xl font-bold"
                >
                    &times;
                </button>
                <h3 className="text-xl font-bold mb-4">{chartTitle}</h3>

                {imageUrl ? (
                    <img src={imageUrl} alt={chartTitle} className="w-full h-auto max-h-[80vh] object-contain" />
                ) : (
                    <p className="text-center text-gray-400">No size chart found for this product type.</p>
                )}

                
                <p className="text-sm text-gray-400 mt-4">All measurements are approximate. Please refer to product description for specific fit details.</p>
            </div>
        </div>
    );
}

export default SizeChartModal;